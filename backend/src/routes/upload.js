const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const { cloudinary } = require("../config/cloudinary");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Use memory storage so we can process the buffer with sharp before uploading
const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Allow up to 10MB raw; we will compress it down
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only image files (JPEG, PNG, WebP, GIF) are allowed"),
        false,
      );
    }
  },
});

// Helper: compress image buffer using sharp, targeting ~2MB max output
async function compressImage(buffer, mimetype) {
  const MAX_OUTPUT_BYTES = 2 * 1024 * 1024; // 2 MB target

  let sharpInstance = sharp(buffer).resize({
    width: 1500,
    height: 1500,
    fit: "inside",
    withoutEnlargement: true,
  });

  // Pick output format
  const isGif = mimetype === "image/gif";
  let quality = 80;

  let outputBuffer;
  if (isGif) {
    // GIF: just return as-is (sharp GIF support is limited)
    outputBuffer = buffer;
  } else {
    // Convert everything to WebP (smaller + better quality than JPEG/PNG)
    outputBuffer = await sharpInstance.webp({ quality }).toBuffer();

    // If still too large, reduce quality further
    while (outputBuffer.length > MAX_OUTPUT_BYTES && quality > 20) {
      quality -= 10;
      outputBuffer = await sharp(buffer)
        .resize({
          width: 1500,
          height: 1500,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality })
        .toBuffer();
    }
  }

  return outputBuffer;
}

router.post(
  "/",
  verifyToken,
  isAdmin,
  (req, res, next) => {
    upload.array("images", 10)(req, res, (err) => {
      if (err) {
        console.error("Upload Error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "Image too large. Max raw size is 10 MB." });
        }
        return res
          .status(400)
          .json({ message: err.message || "Upload failed" });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadPromises = req.files.map(async (file) => {
        // Compress the image
        const compressed = await compressImage(file.buffer, file.mimetype);

        // Upload compressed buffer to Cloudinary using upload_stream
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "pashmina_products",
              resource_type: "image",
              format: "webp",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            },
          );
          stream.end(compressed);
        });
      });

      const urls = await Promise.all(uploadPromises);
      res.json({ urls });
    } catch (err) {
      console.error("Compression/Upload Error:", err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  },
);

module.exports = router;

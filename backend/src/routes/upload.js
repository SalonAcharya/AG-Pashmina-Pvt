const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
// Quick check for sharp native dependencies
try {
  sharp();
  console.log("[Upload] Sharp initialized successfully");
} catch (e) {
  console.error(
    "[Upload] Sharp initialization check failed. Image processing might be unstable:",
    e.message,
  );
}
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

async function compressImage(buffer, mimetype) {
  console.log(
    `Compressing ${mimetype} buffer of size ${buffer.length} bytes...`,
  );
  const MAX_OUTPUT_BYTES = 500 * 1024; // 500 KB hard ceiling

  if (mimetype === "image/gif") return buffer;

  let quality = 72; // start at 72% — within the 65-75% sweet spot
  let outputBuffer = await sharp(buffer)
    .resize({
      width: 1200,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer();

  // Step quality down if still over ceiling, but never go below 50%
  while (outputBuffer.length > MAX_OUTPUT_BYTES && quality > 50) {
    quality -= 8;
    outputBuffer = await sharp(buffer)
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();
  }

  return outputBuffer;
}

router.post(
  "/",
  verifyToken,
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
      console.log("Files received by upload route:", req.files?.length);
      if (!req.files || req.files.length === 0) {
        console.warn("Upload request received but no files found in req.files");
        return res.status(400).json({ message: "No files uploaded" });
      }

      // Check Cloudinary config
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY
      ) {
        console.error("FATAL: Cloudinary environment variables are missing!");
        return res.status(500).json({
          message: "Server configuration error: Cloudinary credentials missing",
          error: "Cloudinary environment variables not found on server.",
        });
      }

      const uploadPromises = req.files.map(async (file, idx) => {
        console.log(
          `[Upload] Processing file ${idx}: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`,
        );

        // Compress the image
        let compressed;
        try {
          compressed = await compressImage(file.buffer, file.mimetype);
          console.log(
            `[Upload] File ${idx} compressed. New size: ${compressed.length} bytes`,
          );
        } catch (compErr) {
          console.error(
            `[Upload] Compression failed for file ${idx}:`,
            compErr,
          );
          // Fallback to original buffer if compression fails
          compressed = file.buffer;
        }

        // Upload to Cloudinary
        return new Promise((resolve, reject) => {
          console.log(`[Upload] Opening Cloudinary stream for file ${idx}...`);
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "pashmina_products",
              resource_type: "image",
              format: "webp",
            },
            (error, result) => {
              if (error) {
                console.error(
                  `[Upload] Cloudinary rejection for file ${idx}:`,
                  error,
                );
                reject(
                  new Error(
                    `Cloudinary Error: ${error.message || "Unknown error"}`,
                  ),
                );
              } else {
                console.log(
                  `[Upload] File ${idx} successfully uploaded: ${result.secure_url}`,
                );
                resolve(result.secure_url);
              }
            },
          );

          stream.on("error", (err) => {
            console.error(`[Upload] Stream error for file ${idx}:`, err);
            reject(new Error(`Stream Error: ${err.message}`));
          });

          stream.end(compressed);
        });
      });

      const urls = await Promise.all(uploadPromises);
      console.log("[Upload] All files processed and uploaded successfully");
      res.json({ urls });
    } catch (err) {
      console.error("[Upload] FATAL UNHANDLED ERROR:", err);
      res.status(500).json({
        message: "Upload failed",
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  },
);

module.exports = router;

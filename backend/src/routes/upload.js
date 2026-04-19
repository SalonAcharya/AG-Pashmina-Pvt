const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const { verifyToken, isAdmin } = require("../middleware/auth");

const upload = multer({ storage });

router.post(
  "/",
  verifyToken,
  isAdmin,
  (req, res, next) => {
    upload.array("images", 10)(req, res, (err) => {
      if (err) {
        console.error("Cloudinary Upload Error:", err);
        return res
          .status(500)
          .json({ message: "Upload failed", error: err.message });
      }
      next();
    });
  },
  (req, res) => {
    // Cloudinary returns the full URL in file.path
    const fileUrls = req.files.map((file) => file.path);
    res.json({ urls: fileUrls });
  },
);

module.exports = router;

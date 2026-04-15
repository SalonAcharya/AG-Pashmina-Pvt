const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { verifyToken, isAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.array("images", 10),
  (req, res) => {
    const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
    res.json({ urls: fileUrls });
  },
);

module.exports = router;

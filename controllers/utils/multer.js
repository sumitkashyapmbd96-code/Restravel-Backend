const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure folders exist
const imagePath = "uploads/images";
const videoPath = "uploads/videos";

[imagePath, videoPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, imagePath);
    } else if (file.mimetype.startsWith("video")) {
      cb(null, videoPath);
    } else {
      cb(new Error("Invalid file type"), false); //  FIX
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/avif",
    "video/mp4",
    "video/mkv",
    "video/avi"
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images/videos allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } 
});

module.exports = upload;
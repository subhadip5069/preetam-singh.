const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/banner"); // Save images in 'uploads/images'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// File filter for only image formats
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

// Initialize Multer
const uploadBanner = multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // MB limit
    fileFilter: fileFilter,
});

module.exports = uploadBanner;

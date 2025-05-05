const multer = require('multer');
const path = require('path');

// Size Limits
const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_CSV_SIZE = 1 * 1024 * 1024; // 1 MB

// Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/csvPdf');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File Type Filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// Multer upload setup
const upload = multer({
  storage,
  fileFilter,
});

module.exports = {
  upload,
  validateFileSizes: (req, res, next) => {
    // Check uploaded files
    if (req.files['notes']) {
      for (const file of req.files['notes']) {
        if (file.size > MAX_PDF_SIZE) {
          return res.status(400).json({ error: 'PDF note file too large (max 5MB).' });
        }
      }
    }

    if (req.files['assignments']) {
      for (const file of req.files['assignments']) {
        if (file.size > MAX_CSV_SIZE) {
          return res.status(400).json({ error: 'CSV assignment file too large (max 1MB).' });
        }
      }
    }

    next();
  }
};

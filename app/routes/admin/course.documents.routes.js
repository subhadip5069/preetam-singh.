const express = require('express');
const { upload, validateFileSizes } = require('../../multer/coursee.docs');
const router = express.Router();
const courseDocumentsController = require('../../controller/admin/uploade.course.documents.controller');
const { AdminauthMiddleware } = require('../../middleware/middleware');
router.post(
  '/upload-docs', AdminauthMiddleware,
  upload.fields([
    { name: 'notes', maxCount: 5 },
    { name: 'assignments', maxCount: 1 },
  ]),
  validateFileSizes,courseDocumentsController.uploadCourseDocs
);

module.exports = router;

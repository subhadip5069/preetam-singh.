const express = require('express');
const router = express.Router();

const courseController = require('../../controller/admin/admin.course.controller');
const uploadCourse = require('../../multer/course.multer'); // Adjust the path as necessary
const { AdminauthMiddleware } = require('../../middleware/middleware');
 
router.post('/add',AdminauthMiddleware,uploadCourse.single('image'),courseController.createCourse); // POST /course/add
router.post('/update/:id',AdminauthMiddleware,uploadCourse.single('image'), courseController.updateCourse); // POST /course/update/:id
router.get('/delete/:id',AdminauthMiddleware, courseController.deleteCourse); // GET /course/delete/:id
router.post('/status/:id', AdminauthMiddleware, courseController.updateCourseStatus); // GET /course/edit/:id


module.exports = router;
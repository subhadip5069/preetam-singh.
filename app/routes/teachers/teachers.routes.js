const express = require('express'); 

const router = express.Router();

const PagesController = require('../../controller/teacher/pages.controller');

router.get('/teacher/courses', PagesController.mycourses); // Route to get all courses
router.get('/teacher/addcourses', PagesController.addcourses); // Route to add a new course

module.exports = router;
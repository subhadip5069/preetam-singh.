const express = require('express');
const router = express.Router();


const userpagesController = require('../../controller/user/user.pages.controller');
const {authMiddleware} = require("../../middleware/middleware")
// User Pages Routes
router.get('/', authMiddleware,userpagesController.apifrouser);
router.get('/profile',authMiddleware, userpagesController.profile);
router.get('/contact',authMiddleware, userpagesController.contact);
router.get('/about',authMiddleware ,userpagesController.about);
router.get('/courses',authMiddleware, userpagesController.courses);
router.get('/category/:id',authMiddleware, userpagesController.getcoursesbycategory);
router.get('/payment',authMiddleware, userpagesController.paymentpage);
router.get('/enrollment/:id',authMiddleware, userpagesController.enrollment);
router.get("/paymenthistory",authMiddleware,userpagesController.paymentHistory)
router.get("/mycourses",authMiddleware,userpagesController.mycourses)
router.get("/coursedetails/:id",authMiddleware,userpagesController.getCourseDocuments)
router.post("/submitassignment/:id",authMiddleware,userpagesController.submitAssignment)








// Export the router
module.exports = router;

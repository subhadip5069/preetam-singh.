const express = require('express');
const router = express.Router();

const categoryController = require('../../controller/admin/category.controller');

const { AdminauthMiddleware } = require("../../middleware/middleware")


// Category Routes
router.post('/create',AdminauthMiddleware, categoryController.createCategory);
router.post('/update/:id',AdminauthMiddleware, categoryController.updateCategory);
router.get('/delete/:id', AdminauthMiddleware, categoryController.deleteCategory);


module.exports = router;
const express = require('express');
const router = express.Router();


const AdminAuthController = require('../../controller/admin/auth.admin.controller');


router.post('/login', AdminAuthController.login);
router.get('/logout', AdminAuthController.logout);

module.exports = router;
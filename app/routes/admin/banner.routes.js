const express = require('express');
const router = express.Router();

const bannerController = require('../../controller/admin/banner.controller');
const uploadBanner = require('../../multer/banner.multer');



router.post('/create', uploadBanner.single('image'), bannerController.create);

router.post('/update/:id', uploadBanner.single('image'), bannerController.update);
router.get('/delete/:id', bannerController.delete);


module.exports = router;
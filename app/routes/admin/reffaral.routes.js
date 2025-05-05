const express = require('express');
const router = express.Router();


const referralBonusController = require('../../controller/admin/referal.controller');
const { AdminauthMiddleware } = require('../../middleware/middleware');
    
router.get('/',AdminauthMiddleware, referralBonusController.getBonus); // GET /referralbonus
router.post('/update/:id', AdminauthMiddleware, referralBonusController.updateBonus); // POST /referralbonus/update/:id

module.exports = router;
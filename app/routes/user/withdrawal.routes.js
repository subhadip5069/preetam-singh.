const express = require("express");
const router = express.Router();


const withdrawalcontroller = require("../../controller/user/withdrawal.controller");
const { authMiddleware } = require("../../middleware/middleware");

router.post("/request", authMiddleware,withdrawalcontroller.createWithdrawalRequest);

module.exports = router;
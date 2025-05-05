const express =require("express")
const router = express.Router()


const paymentcontroller = require("../../controller/user/paymentcontroller");
const { authMiddleware } = require("../../middleware/middleware");


router.post("/create",authMiddleware,paymentcontroller.createOrder)
router.post("/verify",authMiddleware,paymentcontroller.verifyPayment)

module.exports = router;
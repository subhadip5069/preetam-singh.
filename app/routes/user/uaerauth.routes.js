const express =require("express")
const router = express.Router()


const usercontroller = require("../../controller/user/user.authcontroller");


router.post("/sighnup",usercontroller.signup)
router.post("/sendOtp",usercontroller.sendOtp)
router.post("/login",usercontroller.login)
router.get("/logout",usercontroller.logout)





module.exports = router;
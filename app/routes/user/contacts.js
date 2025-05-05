const express = require("express");
const router = express.Router()

const contactcontroller = require("../../controller/user/contacts.controller")


router.post("/create",contactcontroller.contactCreate)


module.exports=router
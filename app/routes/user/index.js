const express = require("express");
const app = express.Router();


app.use("/api/", require("./user.pages.routes"));
app.use("/api/contact",require("./contacts"))
app.use("/api/auth",require("./uaerauth.routes"))
app.use("/api/payment",require("./payment.routes"))
app.use("/api/withdrawal",require("./withdrawal.routes"))
app.use("/api/enroll",require("./enrollroutes"))



// export the router
module.exports = app;
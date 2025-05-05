const express = require('express');
const app = express.Router();

app.use("/admin", require("./admin.pages.routes"));
app.use("/admin/banner", require("./banner.routes"));
app.use("/admin/auth", require("./admin.auth.routes"));
app.use("/admin/refer", require("./reffaral.routes"));
app.use("/admin/course", require("./course.routes"));
app.use("/admin/course-documents", require("./course.documents.routes"));
app.use("/admin/about", require("./admin.routes"));
app.use("/admin/category", require("./admin.category.routes"));

module.exports = app;
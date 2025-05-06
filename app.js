const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const path = require("path");
const cors = require("cors")
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const connectDB = require("./app/config/DB0000");



require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();


app.use(session({
  secret: 'educate-mysecretkey', // use a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // 1 minute (adjust as needed)
}));

app.use(cors({
  origin: ["http://localhost:3000", "http://digitalcors.netlify.app"],  // your React frontend
  methods: ["GET", "POST"],
  credentials: true               // allow cookies
}));




app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS
app.set("view engine", "ejs");
app.set("views", "views");

// Public folder
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));


// Routesuser
app.use("/", require("./app/routes/user/index"));

// admin routes
app.use("/", require("./app/routes/admin/index"));

// teacher routes
app.use("/", require("./app/routes/teachers/teachers.routes"));



// Start server after database connections are established
const PORT =  3265;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT} `);

});

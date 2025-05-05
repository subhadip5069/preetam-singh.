// models/UserCourse.js

const mongoose = require('mongoose');
const userCourseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    purchaseDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true }
  });
  
  module.exports = mongoose.model('UserCourse', userCourseSchema);
  
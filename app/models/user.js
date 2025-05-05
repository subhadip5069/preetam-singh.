const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone:{
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  myReferralCode: {
    type: String,
    required: true
  },
  mybonus: {
    type: Number,
    default: 0
  },
  refferby: {
    type: String,  // Store the referral code (as a string, not ObjectId)
    default: ""    // Default to empty string if not set
  },
  role:{
    type:"string",
    enum:["student","admin","teacher"],
    default:"student"

  },
  assighments:[{
    courses:{
      type: mongoose.Schema.ObjectId,
      ref: "Course"
    },
    marks: {
      type: Number,
      default: 0
    },}
  ],
  refferalBonus: {
    type: mongoose.Schema.ObjectId,
    ref: "ReferalBonus"
  }
});

// ✅ Avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;

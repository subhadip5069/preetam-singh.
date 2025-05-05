const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    features: [{
        type: String,
        required: true,
    }],
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },

    validated: {
       type:String,
       required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",  
    },
    },{
    timestamps: true,
});

module.exports = mongoose.model("Course", courseSchema);
    
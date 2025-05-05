const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const contactUsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject:{
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    }
    },{
        timestamps: true,
        versionKey: false, // Disable version key (__v)
    // Adding timestamps to the schema
    }
);
module.exports = mongoose.model("ContactUs", contactUsSchema);
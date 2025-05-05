const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutUsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    }
    },{
        timestamps: true,
        versionKey: false, // Disable version key (__v)
    // Adding timestamps to the schema
    }
);
module.exports = mongoose.model("AboutUs", aboutUsSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    }
},{
    timestamps: true,
    versionKey: false, // Disable version key (__v)
// Adding timestamps to the schema
});
module.exports = mongoose.model("Category", categorySchema);
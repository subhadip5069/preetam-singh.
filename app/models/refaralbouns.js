const mongoose = require('mongoose');

const referalbonusSchema = new mongoose.Schema({
    usercount: {
        type:String,
        default: 0,
        required: true
    },
    referalbonus: {
        type: Number,
        default: 0
    },
},{
    timestamps: true,
});

module.exports = mongoose.model('ReferalBonus', referalbonusSchema);
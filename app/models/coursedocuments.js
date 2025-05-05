const mongoose = require('mongoose');

const courseDocumentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
   notes:[{
        type: String,
        required: true,
    }],
    videos:[{
        type: String,
        required: true,
    }],
    assignments:[{
       questions: {
            type: String,
            required: true,
        },
        answers: [{
            type: String,
            required: true,
        }],
        correctAnswer: {
            type: String,
            required: true,
        },
        marks: {
            type: Number,
            required: true,
        },
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('CourseDocument', courseDocumentSchema);
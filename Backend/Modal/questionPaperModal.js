const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
    class: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    questions: [
        {
            question: String,
            options: [String],
            correctAnswer: String
        }
    ],
    schedule: {
        type: {
            frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'once'], default: 'once' },
            date: Date // for 'once' or next scheduled date
        },
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('questionPaperSchema', questionPaperSchema); 
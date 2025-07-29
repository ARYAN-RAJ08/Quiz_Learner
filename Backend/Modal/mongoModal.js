const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    pNumber: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    // Add isActive for soft delete and user status
    isActive: {
        type: Boolean,
        default: true
    },
    // Add activityLog for logging user actions
    activityLog: {
        type: [
            {
                action: String,
                timestamp: { type: Date, default: Date.now }
            }
        ],
        default: []
    },
    // Add profilePic for storing profile picture path
    profilePic: {
        type: String
    },
    // Add lastLogin for tracking user logins
    lastLogin: {
        type: Date
    },
    // Add for password reset functionality
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
})

module.exports = mongoose.model("userSchema", userSchema)
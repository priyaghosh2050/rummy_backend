const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose

const reportedProbSchema = new Schema({
    reportedPlayer: {
        type: String,
    },
    email: {
        type: String,
    },
    typeOfIssue: {
        type: String
    },
    attachment: {
        type: String
    },
    contactName: {
        type: String
    },
    status: {
        type: String,
        enum: ["New", "In Progress", "Complete", "Invalid"],
        default: "New"
    },
    message: {
        type: String
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});

module.exports = mongoose.model('ReportedProblems', reportedProbSchema);
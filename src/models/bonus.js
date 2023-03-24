const mongoose = require('mongoose');

const { Schema } = mongoose

const bonusSchema = new Schema({
    title: {
        type: String
    },
    bonusCode: {
        type: String
    },
    creditTo: {
        type: String,
        enum: ['bonus Wallet','deposit wallet']
    },
    validDays: {
        type: Number
    },
    bonus: {
        type: Number
    },
    credit: {
        type: Number
    },
    maxLimit: {
        type: Number
    },
    fromDate: {
        type: Date
    },
    toDate: {
        type: Date
    },
    description: {
        type: String
    },
    termsAndConditions: {
        type: String
    },
    is_active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});

module.exports = mongoose.model('Bonus', bonusSchema);
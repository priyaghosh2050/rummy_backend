const { boolean } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose

const offerNotificationSchema = new Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    enable:{
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

module.exports = mongoose.model('offerNotification', offerNotificationSchema);
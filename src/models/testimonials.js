const mongoose = require('mongoose');

const { Schema } = mongoose

const testimonialSchema = new Schema({
    nameAndAddress: {
        type: String
    },
    prizeTitle: {
        type: String
    },
    message: {
        type: String
    },
    files: {
        type: Array
    },
    createdAt: {
        type: String
    }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
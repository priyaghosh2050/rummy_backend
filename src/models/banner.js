const { array } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose

const bannerSchema = new Schema({
    banner_name: {
        type: String
    },
    banner_image: {
        type: Array
    },
    banner_position: {
        type: String,
        enum: ['Home-Page', 'Login-Page', 'Registration-Page', 'Promotion-Page', 'Leaderboard-Page']
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

module.exports = mongoose.model('Banner', bannerSchema);
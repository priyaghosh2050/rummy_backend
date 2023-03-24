const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose

const adminSchema = new Schema({
    cuid: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["superadmin", "admin", "subadmin"],
        default: "superadmin"
    },
    password: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    accessToken: {
        type: String,
        default: null
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});

module.exports = mongoose.model('Admin', adminSchema);

module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Hashing failed", error);
    }
};

module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        throw new Error("Comparison failed", error);
    }
};
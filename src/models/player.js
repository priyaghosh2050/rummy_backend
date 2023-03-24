const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const playerSchema = new Schema(
    {
        cuid: { type: String, unique: true},
        userName: { type: String, unique: true },
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String, unique: true },
        phone: { type: String, unique: true },
        gender: { type: String, enum: ['Male', 'Female'] },
        birthday: { type: Date },
        addressLineOne: { type: String, },
        addressLineTwo: { type: String, },
        city: { type: String, },
        state: { type: String, },
        pincode: { type: String },
        panCard: {
            image: {
                type: String
            },
            status: {
                type: String,
                enum: ['not-submitted', 'submitted', 'verified', 'denied'],
                default: 'not-submitted'
            }
        },
        aadharCard: {
            imageOne: {
                type: String
            },
            imageTwo: {
                type: String
            },
            status: {
                type: String,
                enum: ['not-submitted', 'submitted', 'verified', 'denied'],
                default: 'not-submitted'
            }
        },
        addressProof: {
            image: {
                type: String
            },
            status: {
                type: String,
                enum: ['not-submitted', 'submitted', 'verified', 'denied'],
                default: 'not-submitted'
            }
        },
        password: { type: String },
        otp:{ type: Number },
        registeredAt: { type: String },
        lastUpdatedAt: { type: String },
        isActive: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        emailToken: { type: String, default: null },
        emailTokenExpires: { type: Date, default: null },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
        accessToken: { type: String, default: null },
    }
);

module.exports = mongoose.model('Player', playerSchema)

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
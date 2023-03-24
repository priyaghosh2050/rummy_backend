require('dotenv').config();

const jwt = require('jsonwebtoken');

const options = {
    expiresIn: '24h',
}

const secret = process.env.JWT_SECRET;

async function generateAdminJwt(username, email, role, cuid, adminId) {
    try {
        const payload = { username: username, email: email, role: role, cuid: cuid, adminId: adminId };
        const token = await jwt.sign(payload, secret, options);
        return { error: false, token: token };
    } catch (error) {
        return { error: true };
    }
}

module.exports = { generateAdminJwt };
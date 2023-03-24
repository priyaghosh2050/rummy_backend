require('dotenv').config();

const jwt = require('jsonwebtoken');

const options = {
    expiresIn: '1h',
}

const secret = process.env.JWT_SECRET;

async function generatePlayerJwt(username, email, cuid, userId) {
    try {
        const payload = { username: username, email: email, cuid: cuid, userId: userId};
        const token = await jwt.sign(payload, secret, options);
        return { error: false, token: token };
    } catch (error) {
        return { error: true };
    }
}

module.exports = { generatePlayerJwt };
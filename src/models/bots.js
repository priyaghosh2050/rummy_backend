const mongoose = require('mongoose');
const { Schema } = mongoose;

const botSchema = new Schema(
    {
        username: String,
        firstname: String,
        lastname: String,
        gender: { type: String, enum: ['male', 'female'] },
        state: String,
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        botCanPlay: { type: String, enum: ['practise', 'tournament', 'deal(cash)', 'point(cash)', 'pool(cash)'] }
    }
);

const Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;
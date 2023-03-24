const mongoose = require('mongoose');

const { Schema } = mongoose

const stateSchema = new Schema({
    stateName: {
        type: String
    },
    playPermission: {
        type: Boolean
    }
});

module.exports = mongoose.model('State', stateSchema);
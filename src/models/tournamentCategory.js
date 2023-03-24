const mongoose = require('mongoose');

const { Schema } = mongoose

const tournamentCategorySchema = new Schema({
    tournamentCategoryName: {
        type: String
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('TournamentCategory', tournamentCategorySchema);
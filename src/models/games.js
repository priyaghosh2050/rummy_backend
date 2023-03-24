const { string } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose

const gameSchema = new Schema({
    gameType: {
        type: String,
        required: true,
        enum: ["cash", "practise"]
    },
    gameSubType: {
        type: String,
        required: true,
        enum: ["deals", "pool", "points"]
    },
    noOfCards: {
        type: Number,
        enum: [13]
    },
    seats: {
        type: Number,
        required: true,
        enum: [2, 4, 6]
    },
    pointValue: {
        type: Number,
        default: null
    },
    entryFee: {
        type: Number,
        default: null
    },
    prize: {
        type: Number,
        default: null
    },
    poolGameType: {
        type: Number,
        enum: [101, 201]
    },
    deals:{
        type: Number,
        enum: [2, 4, 6]
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive"]
    },
    botAllowed: {
        type: String,
        required: true,
        enum: ["Active", "Inactive"]
    },
    jokers: {
        min: {
            type: Number
        },
        max: {
            type: Number
        }
    },
    middleDropScore: {
        min: {
            type: Number
        },
        max: {
            type: Number
        }
    },
    cardsDeckSearch: {
        min: {
            type: Number
        },
        max: {
            type: Number
        }
    },
    dealingCardsScore: {
        min: {
            type: Number
        },
        max: {
            type: Number
        }
    },
    dealCardsFetchCount: {
        min: {
            type: Number
        },
        max: {
            type: Number
        }
    },
    scoreDrop: {
        min: {
            type: Number
        },
        max: {
            type: Number
        }
    },
    date: String,
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});

module.exports = mongoose.model('Game', gameSchema);


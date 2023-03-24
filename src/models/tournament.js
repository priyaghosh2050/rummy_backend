const mongoose = require('mongoose');
const { Schema } = mongoose

const tournamentSchema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TournamentCategory"
    },
    tournamentTitle: {
        type: String
    },
    allowed: {
        type: String,
        enum: ['all', 'joker', 'club', 'diamond', 'heart', 'spade']
    },
    numberOfBots: {
        type: Number
    },
    frequency: {
        type: String,
        enum: ['one-time', 'monthly', 'weekly', 'daily']
    },
    registrationStartTime: {
        type: String
    },
    registrationEndTime: {
        type: String
    },
    tournamentStartTime: {
        type: String
    },
    botsAllowed: {
        type: String,
        enum: ['active', 'inactive']
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
    entryFeeType: {
        type: String,
        enum: ['Cash', 'Free']
    },
    entryFee: {
        type: Number
    },
    maxPlayers: {
        type: Number
    },
    chargeForConductingTournament: {
        type: Number
    },
    prizeAmount: {
        type: Number
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    },
    date: String,
    rounds: [
        {
            round: Number,
            qualifyPerTable: Number
        }
    ],
    prizePositions: [
        {
            from: Number,
            to: Number,
            minimum: Number,
            perPlayerPrizeCash: Number,
            totalPrize: Number
        }
    ]

});

module.exports = mongoose.model('Tournament', tournamentSchema);

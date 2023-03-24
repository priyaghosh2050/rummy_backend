const mongoose = require('mongoose');

const { Schema } = mongoose;

const walletSchema = new Schema(
    {
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        },
        bot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bot"
        },
        funChips: {
            type: Number,
            default: 0
        },
        inPlayFunChips: {
            type: Number,
            default: 0
        },
        realChipsDeposit: {
            type: Number,
            default: 0
        },
        inPlayRealChips: {
            type: Number,
            default: 0
        },
        realChipsWithdrawl: {
            type: Number,
            default: 0
        },
        rewardPoints: {
            type: Number,
            default: 0
        },
        totalBonus: {
            type: Number,
            default: 0
        },
        activeBonus: {
            type: Number,
            default: 0
        },
        releaseBonus: {
            type: Number,
            default: 0
        },
        pendingBonus: {
            type: Number,
            default: 0
        }
    }
);

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
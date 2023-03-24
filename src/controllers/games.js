require("dotenv").config();
const Joi = require("joi");
const GamesModel = require('../models/games');
const timeline = require("../utils/timestamp");

// Banner validation schema
const GamesSchema = Joi.object().keys({
    gameType: Joi.string().required(),
    gameSubType: Joi.string().required(),
    noOfCards: Joi.number(),
    seats: Joi.number().required(),
    pointValue: Joi.number(),
    prize: Joi.number(),
    poolGameType: Joi.number(),
    deals: Joi.number(),
    entryFee: Joi.number().required(),
    status: Joi.string().required(),
    botAllowed: Joi.string().required(),
    jokers: {
        min: Joi.number().required(),
        max: Joi.number().required()
    },
    middleDropScore: {
        min: Joi.number().required(),
        max: Joi.number().required()
    },
    cardsDeckSearch: {
        min: Joi.number().required(),
        max: Joi.number().required()
    },
    dealingCardsScore: {
        min: Joi.number().required(),
        max: Joi.number().required()
    },
    dealCardsFetchCount: {
        min: Joi.number().required(),
        max: Joi.number().required()
    },
    scoreDrop: {
        min: Joi.number().required(),
        max: Joi.number().required()
    },
})

// Create endpoint
exports.create = async (req, res) => {
    try {
        const games = GamesSchema.validate(req.body);
        if (games.error) {
            return res.json({
                "error": true,
                "status": 400,
                "message": games.error.message,
            });
        }

        // const prizeCal = req.body.seats * req.body.entryFee
        // games.value.prize = prizeCal;

        let date_time = timeline.timestamp();
        games.value.createdAt = date_time;

        console.log("timestamp", date_time);

        let date = timeline.currentDate();
        games.value.date = date

        console.log("date", date);

        const newGames = new GamesModel(games.value);
        await newGames.save();

        return res.status(200).json({
            "success": true,
            "message": "Created Success",
            "Games": newGames
        });
    } catch (error) {
        return res.status(500).json({
            "error": true,
            "message": "Cannot Create",
            "error_details": error.message
        });
    }
}

// get all endpoint
exports.getAll = async (req, res) => {
    try {
        const games = await GamesModel.find({});
        if (games.length === 0) {
            return res.status(400).json({ messgae: "No games found in Database!" });
        } else {
            return res.status(200).json({ games })
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get-by-game-type
exports.getGameByGameType = async (req, res) => {
    try {
        const games = await GamesModel.find({ gameType: req.params.gameType });
        if (!games) {
            return res.status(400).json({ message: "no games found!" })
        } else if (games.error) {
            // console.log("game-error:", games.error);
            return res.status(400).json({ error: games.error.message });
        } else {
            return res.status(200).json({ games });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get-by-game-sub-type
exports.getByGameSubType = async (req, res) => {
    try {
        const games = await GamesModel.find({ gameSubType: req.params.gameSubType });
        if (!games) {
            return res.status(400).json({ message: "no gmaes found!" })
        } else if (games.error) {
            // console.log("game-error:", games.error);
            return res.status(400).json({ error: games.error.message });
        } else {
            return res.status(200).json({ games });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// Update game
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { gameType, gameSubType, seats, noOfCards, pointValue, entryFee, prize, poolGameType, deals, date, status, botAllowed, minJokers, maxJokers, minScoreToMiddleDrop, maxScoreToMiddleDrop, minScoreToDealingCards, maxScoreToDealingCards, minDealCardsFetchCount, maxDealCardsFetchCount, minScoreToDrop, maxScoreToDrop, minCardsToSearchInDeck, maxCardsToSearchInDeck } = req.body;
        let date_time = timeline.timestamp();

        const game = await GamesModel.findByIdAndUpdate(id);

        if (!game) {
            return res.status(404).json({ message: "Game Not Found" });
        } else if (game.error) {
            // console.log("game-error:", game.error);
            return res.status(400).json({ error: game.error.message });
        }

        game.gameType = gameType || game.gameType;
        game.gameSubType = gameSubType || game.gameSubType;
        game.noOfCards = noOfCards || game.noOfCards;
        game.seats = seats || game.seats;
        game.pointValue = pointValue || game.pointValue;
        game.entryFee = entryFee || game.entryFee;
        game.prize = prize || game.prize;
        game.status = status || game.status;
        game.botAllowed = botAllowed || game.botAllowed;
        game.poolGameType = poolGameType || game.poolGameType;
        game.deals = deals || game.deals;
        game.date = date || game.date;

        if (minJokers || maxJokers) {
            game.jokers.min = minJokers || game.jokers.min;
            game.jokers.max = maxJokers || game.jokers.max;
        }

        if (minScoreToMiddleDrop || maxScoreToMiddleDrop) {
            game.middleDropScore.min = minScoreToMiddleDrop || game.middleDropScore.min;
            game.middleDropScore.max = maxScoreToMiddleDrop || game.middleDropScore.max;
        }

        if (minScoreToDealingCards || maxScoreToDealingCards) {
            game.dealingCardsScore.min = minScoreToDealingCards || game.dealingCardsScore.min;
            game.dealingCardsScore.max = maxScoreToDealingCards || game.dealingCardsScore.max;
        }

        if (minDealCardsFetchCount || maxDealCardsFetchCount) {
            game.dealCardsFetchCount.min = minDealCardsFetchCount || game.dealCardsFetchCount.min;
            game.dealCardsFetchCount.max = maxDealCardsFetchCount || game.dealCardsFetchCount.max;
        }

        if (minScoreToDrop || maxScoreToDrop) {
            game.scoreDrop.min = minScoreToDrop || game.scoreDrop.min;
            game.scoreDrop.max = maxScoreToDrop || game.scoreDrop.max;
        }

        if (minCardsToSearchInDeck || maxCardsToSearchInDeck) {
            game.cardsDeckSearch.min = minCardsToSearchInDeck || game.cardsDeckSearch.min;
            game.cardsDeckSearch.max = maxCardsToSearchInDeck || game.cardsDeckSearch.max;
        }

        game.updatedAt = date_time;

        await game.save();

        return res.status(200).json({ message: "Game Updated Successfully!", game });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}


// Delete Specifi game By Id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await GamesModel.findByIdAndDelete(id);
        if (!game) {
            return res.status(404).json({ message: "Game Not Found" });
        } else if (game.error) {
            // console.log("game-error:", game.error);
            return res.status(400).json({ error: game.error.message });
        }
        return res.status(200).json({ message: "Game Deleted Successfully!" });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}
require("dotenv").config();
const Joi = require("joi");

const TournamentModel = require('../models/tournament');
const timeline = require("../utils/timestamp");

// Tournament validation schema
const TournamentSchema = Joi.object().keys({
    category: Joi.string().required(),
    tournamentTitle: Joi.string().required(),
    allowed: Joi.string().required(),
    numberOfBots: Joi.number().required(),
    frequency: Joi.string().required(),
    registrationStartTime: Joi.string().required(),
    registrationEndTime: Joi.string().required(),
    tournamentStartTime: Joi.string().required(),
    botsAllowed: Joi.string().required(),

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

    entryFeeType: Joi.string().required(),
    entryFee: Joi.number().required(),
    maxPlayers: Joi.number().required(),
    chargeForConductingTournament: Joi.number().required(),

    rounds: Joi.array().items(
        Joi.object().keys(
            {
                round: Joi.number().required(),
                qualifyPerTable: Joi.number().required()
            }
        )
    ),

    prizePositions: Joi.array().items(
        Joi.object().keys(
            {
                from: Joi.number().required(),
                to: Joi.number().required(),
                minimum: Joi.number().required(),
                perPlayerPrizeCash: Joi.number().required(),
            }
        )
    ),

})

// Create Endpoint
exports.create = async (req, res) => {
    try {
        console.log("body: ", req.body);
        const tournament = TournamentSchema.validate(req.body);
        if (tournament.error) {
            console.log("error: ", tournament.error);
            return res.status(400).json({
                "error": true,
                "status": 400,
                "message": tournament.error.message,
            });
        }

        // Expected Prize amount calculation
        const totalFeeForMaxPlayer = (req.body.entryFee * req.body.maxPlayers)
        const conductCharge = (req.body.chargeForConductingTournament * (totalFeeForMaxPlayer)) / 100
        tournament.value.prizeAmount = totalFeeForMaxPlayer - conductCharge;

        // Total prize calculation
        const difference = (req.body.prizePositions.toPosition - req.body.prizePositions.fromPosition) + 1;
        const total = (difference * req.body.prizePositions.perPlayerPrizeCash);
        tournament.value.prizePositions.totalPrize = total;

        const { prizeAmount, totalPrize } = req.body;
        if (prizeAmount < totalPrize) {
            return res.status(400).json(
                {
                    "error": true,
                    "message": "Total Prize amount must be less than or equal prize amount."
                }
            )
        }

        tournament.value.createdAt = timeline.timestamp();
        tournament.value.date = timeline.currentDate();

        const newTournament = new TournamentModel(tournament.value);
        console.log("new-tournament", newTournament);
        await newTournament.save();

        return res.status(200).json({
            "success": true,
            "message": "Created Success",
            "Tournament": newTournament
        });
    } catch (error) {
        console.log("second-error", error)
        return res.status(500).json({
            "error": true,
            "message": "Cannot Create",
            "error_details": error.message
        });
    }
}

//get all endpoint
exports.getAll = async (req, res) => {
    try {
        const tournament = await TournamentModel.find({});
        if (tournament.length === 0) {
            return res.status(400).json({ messgae: "No tournament found in Database!" });
        } else {
            return res.status(200).json({ tournament })
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}


// ******* Need to work on it.********
//get tournament by category
exports.getByTournamentCategory = async (req, res) => {
    try {
        const tournamentCategory = await TournamentModel.find({ category: req.params.category }).populate("category");
        if (!tournamentCategory) {
            return res.status(400).json({ message: "no tournamentCategory found!" });
        } else if (tournamentCategory.error) {
            // console.log("game-error:", tournamentCategory.error);
            return res.status(400).json({ error: tournamentCategory.error.message });
        } else {
            return res.status(200).json({ tournamentCategory });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

//get tournament by type
exports.getByTournamentType = async (req, res) => {
    try {
        const tournamentType = await TournamentModel.find({ frequency: req.params.frequency }).populate("category");
        if (!tournamentType) {
            return res.status(400).json({ message: "no tournamentType found!" });
        } else if (tournamentType.error) {
            // console.log("game-error:", tournamentType.error);
            return res.status(400).json({ error: tournamentType.error.message });
        } else {
            return res.status(200).json({ tournamentType });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// Update Tournament
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, tournamentTitle, allowed, numberOfBots, frequency, registrationStartTime, registrationEndTime, tournamentStartTime, botsAllowed, minJokers, maxJokers, minMiddleDropScore,
            maxMiddleDropScore, minCardsDeckSearch, maxCardsDeckSearch, minDealingCardsScore, maxDealingCardsScore, minDealCardsFetchCount, maxDealCardsFetchCount, minScoreDrop, maxScoreDrop, entryFeeType,
            maxPlayers, chargeForConductingTournament, round, qualifyPerTable, fromPosition, toPosition, perPlayerPrizeCash, is_active } = req.body;

        let date_time = timeline.timestamp();

        const tournament = await TournamentModel.findByIdAndUpdate(id);

        if (!tournament) {
            return res.status(404).json({ message: "Tournament Not Found" });
        } else if (tournament.error) {
            // console.log("tournament-error:", tournament.error);
            return res.status(400).json({ error: tournament.error.message });
        }

        tournament.category = category || tournament.category;
        tournament.tournamentTitle = tournamentTitle || tournament.tournamentTitle;
        tournament.allowed = allowed || tournament.allowed;
        tournament.numberOfBots = numberOfBots || tournament.numberOfBots;
        tournament.frequency = frequency || tournament.frequency;
        tournament.registrationStartTime = registrationStartTime || tournament.registrationStartTime;
        tournament.registrationEndTime = registrationEndTime || tournament.registrationEndTime;
        tournament.tournamentStartTime = tournamentStartTime || tournament.tournamentStartTime;
        tournament.botsAllowed = botsAllowed || tournament.botsAllowed;

        if (minJokers || maxJokers) {
            tournament.jokers.min = minJokers || tournament.jokers.min;
            tournament.jokers.max = maxJokers || tournament.jokers.max;
        }

        if (minMiddleDropScore || maxMiddleDropScore) {
            tournament.middleDropScore.min = minMiddleDropScore || tournament.middleDropScore.min;
            tournament.middleDropScore.max = maxMiddleDropScore || tournament.middleDropScore.max;
        }

        if (minDealingCardsScore || maxDealingCardsScore) {
            tournament.dealingCardsScore.min = minDealingCardsScore || tournament.dealingCardsScore.min;
            tournament.dealingCardsScore.max = maxDealingCardsScore || tournament.dealingCardsScore.max;
        }

        if (minDealCardsFetchCount || maxDealCardsFetchCount) {
            tournament.dealCardsFetchCount.min = minDealCardsFetchCount || tournament.dealCardsFetchCount.min;
            tournament.dealCardsFetchCount.max = maxDealCardsFetchCount || tournament.dealCardsFetchCount.max;
        }

        if (minScoreDrop || maxScoreDrop) {
            tournament.scoreDrop.min = minScoreDrop || tournament.scoreDrop.min;
            tournament.scoreDrop.max = maxScoreDrop || tournament.scoreDrop.max;
        }

        if (minCardsDeckSearch || maxCardsDeckSearch) {
            tournament.cardsDeckSearch.min = minCardsDeckSearch || tournament.cardsDeckSearch.min;
            tournament.cardsDeckSearch.max = maxCardsDeckSearch || tournament.cardsDeckSearch.max;
        }

        tournament.entryFeeType = entryFeeType || tournament.entryFeeType;
        tournament.entryFee = entryFee || tournament.entryFee;
        tournament.maxPlayers = maxPlayers || tournament.maxPlayers;
        tournament.chargeForConductingTournament = chargeForConductingTournament || tournament.chargeForConductingTournament;
        tournament.round = round || tournament.round;
        tournament.qualifyPerTable = qualifyPerTable || tournament.qualifyPerTable;
        tournament.fromPosition = fromPosition || tournament.fromPosition;
        tournament.toPosition = toPosition || tournament.toPosition;
        tournament.perPlayerPrizeCash = perPlayerPrizeCash || tournament.perPlayerPrizeCash;
        tournament.is_active = is_active;
        tournament.updatedAt = date_time;

        await tournament.save();

        return res.status(200).json({ message: "Tournament Updated Successfully!", tournament });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// Delete Tournament By Id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const tournament = await TournamentModel.findByIdAndDelete(id);
        if (!tournament) {
            return res.status(404).json({ message: "Tournament Not Found" });
        } else if (tournament.error) {
            // console.log("tournament-error:", tournament.error);
            return res.status(400).json({ error: tournament.error.message });
        }
        return res.status(200).json({ message: "Game Deleted Successfully!" });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}
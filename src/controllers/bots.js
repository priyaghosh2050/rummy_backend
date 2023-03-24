const Joi = require('joi');
const botModel = require('../models/bots');
const { usernameGenerator } = require("../utils/username_generator_for_game");

const botSchema = Joi.object().keys({
    username: Joi.string(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    gender: Joi.string(),
    state: Joi.string(),
    status: Joi.string(),
    botCanPlay: Joi.string(),
});

// bot creation
exports.create = async (req, res) => {
    try {
        const bot = botSchema.validate(req.body);
        if (bot.error) {
            return res.json({
                "error": true,
                "status": 400,
                "message": bot.error.message,
            });
        }

        const newBot = new botModel(bot.value);
        await newBot.save();

        return res.status(200).json({
            "message": "new bot created!",
            "bot": newBot
        });
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// bulk bot creation
exports.bulkBotWrite = async (req, res) => {
    try {
        const { number, canPlay } = req.body;
        if (number && canPlay) {
            let gender = ['male', 'female'];
            var bots = [];

            console.log(number, canPlay);

            for (i = 0; i < number; i++) {

                let username = usernameGenerator(); // if this function doesnt work according to the standards, we have to use randomstring.
                const generatedBots = {
                    username: `${username}`,
                    gender: gender[Math.floor(Math.random() * gender.length)],
                    botCanPlay: canPlay,
                }
                const bot = new botModel(generatedBots);
                bots.push(bot);
                await bot.save();
            }
            return res.status(200).json({ message: `${number} bots generated`, bots});
        } else {
            return res.status(400).json({ "message": "'number' and 'canPlay' is not provided to create bots in bulk" });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// delete-specific
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const bot = await botModel.findByIdAndDelete(id);
        if (!bot) {
            return res.status(404).json({ message: "Bot Not Found" });
        } else if (bot.error) {
            // console.log("bot-error:", bot.error);
            return res.status(400).json({ error: bot.error.message });
        }
        return res.status(200).json({ message: "Bot Deleted Successfully!" });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// delete-all
exports.deleteAll = async (req, res) => {
    try {
        const bots = await botModel.deleteMany({});
        if (bots.error) {
            return res.status(400).json({ message: "found an function error", error: bots.error });
        }
        return res.status(200).json({ message: "Deleted All the bots which were present in the database!" })
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get all
exports.getAll = async (req, res) => {
    try {
        const bots = await botModel.find({});
        if (bots.length === 0) {
            return res.status(400).json({ messgae: "No bots found in Database!" });
        } else {
            return res.status(200).json({ bots });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get specific
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const bot = await botModel.findById(id);
        if (bot.error) {
            return res.status(400).json({ message: "found an function error", error: bot.error });
        } else {
            return res.status(200).json({ bot });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

exports.getByPlay = async (req, res) => {
    try {
        const { play } = req.params;
        const bots = await botModel.find({ botCanPlay: play });
        if (bots.error) {
            return res.status(400).json({ message: "found an function error", error: bots.error });
        } else {
            return res.status(200).json({ bots });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}


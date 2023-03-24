require("dotenv").config();
const Joi = require("joi");

const StateModel = require('../models/state');

// State validation schema
const StateSchema = Joi.object().keys({
    stateName: Joi.string().required(),
    playPermission: Joi.boolean().required()
})

// Create endpoint
exports.create = async (req, res) => {
    try {
        const state = StateSchema.validate(req.body);
        if (state.error) {
            return res.json({
                "error": true,
                "status": 400,
                "message": state.error.message,
            });
        }
        const newState = new StateModel(state.value);
        await newState.save();

        return res.status(200).json({
            "success": true,
            "message": "Created Success",
            "State": newState
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
        const states = await StateModel.find({});
        if (states.length === 0) {
            return res.status(400).json({ messgae: "No state found in Database!" });
        } else {
            return res.status(200).json({ states })
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get state by state name
exports.getStateByName = async (req, res) => {
    try {
        const state = await StateModel.find({ stateName: req.params.stateName });
        if (!state) {
            return res.status(400).json({ message: "no state found!" })
        } else if (state.error) {
            // console.log("game-error:", state.error);
            return res.status(400).json({ error: state.error.message });
        } else {
            return res.status(200).json({ state });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}
// Update State
exports.updateState = async (req, res) => {
    try {
        const { id } = req.params;
        const { playPermission } = req.body;
        let date_time = timeline.timestamp();

        const state = await StateModel.findByIdAndUpdate(id);

        if (!state) {
            return res.status(404).json({ message: "State Not Found" });
        } else if (state.error) {
            // console.log("state-error:", state.error);
            return res.status(400).json({ error: state.error.message });
        }

        state.playPermission = playPermission || state.playPermission;
        state.updatedAt = date_time;

        await state.save();
        return res.status(200).json({ message: "State Updated Successfully!", state });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// Delete Specifi state By Id
exports.deleteState = async (req, res) => {
    try {
        const { id } = req.params;
        const state = await StateModel.findByIdAndDelete(id);
        if (!state) {
            return res.status(404).json({ message: "State Not Found" });
        } else if (state.error) {
            // console.log("state-error:", state.error);
            return res.status(400).json({ error: state.error.message });
        }
        return res.status(200).json({ message: "State Deleted Successfully!" });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
};
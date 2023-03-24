require("dotenv").config();
// const Joi = require("joi");

const TestimonialModel = require('../models/testimonials');
const timeline = require('../utils/timestamp');
const multer = require("../utils/multer");

exports.Register = async (req, res) => {
    multer.uploadFiles(req, res, async (error) => {
        // console.log("fields", req.body);
        // console.log('files', req.files);

        if (error) {
            // console.log("error", error);
            return res.status(400).json({ "error": error });
        }
        else if (req.files === undefined) {
            // console.log("No such file selected");
            return res.status(500).json({
                "status": 'fail',
                "message": `Error: No File Selected`
            });
        }
        else {
            // If Success
            let fields = req.body
            // console.log("bannerFields:", fields);

            let testimonyFileArray = req.files;
            let fileLocation;
            let files = [];
            
            fields.files = files;
            
            let date_time = timeline.timestamp();
            fields.createdAt = date_time;
            
            for (let i = 0; i < testimonyFileArray.length; i++) {
                fileLocation = testimonyFileArray[i].location;
                console.log('filename:', fileLocation);
                files.push(fileLocation)
            }
            
            const newTestimony = new TestimonialModel(
                fields,
            );
            await newTestimony.save();
            
            // Save the file name into database
            return res.status(200).json({
                status: 'ok',
                Testimony: newTestimony
            });
        }

    })
}

// get all endpoint
exports.getAll = async (req, res) => {
    try {
        const testimonial = await TestimonialModel.find({});
        if (testimonial.length === 0) {
            return res.status(400).json({ messgae: "No testimonial found in Database!" });
        } else {
            return res.status(200).json({ testimonial })
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get testimonial by name
exports.gettestimonialByName = async (req, res) => {
    try {
        const testimonial = await TestimonialModel.find({ nameAndAddress: req.params.nameAndAddress });
        if (!testimonial) {
            return res.status(400).json({ message: "no testimonial found!" })
        } else if (testimonial.error) {
            // console.log("game-error:", testimonial.error);
            return res.status(400).json({ error: testimonial.error.message });
        } else {
            return res.status(200).json({ testimonial });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// Update Testimonial
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nameAndAddress, prizeTitle, message } = req.body;
        let date_time = timeline.timestamp();

        const testimonial = await TestimonialModel.findByIdAndUpdate(id);

        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial Not Found" });
        } else if (testimonial.error) {
            // console.log("testimonial-error:", testimonial.error);
            return res.status(400).json({ error: testimonial.error.message });
        }

        testimonial.nameAndAddress = nameAndAddress || testimonial.nameAndAddress;
        testimonial.prizeTitle = prizeTitle || testimonial.prizeTitle;
        testimonial.message = message || testimonial.message;
        testimonial.updatedAt = date_time;

        await testimonial.save();

        return res.status(200).json({ message: "testimonial Updated Successfully!", testimonial });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// Delete Specifi testimonial By Id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await TestimonialModel.findByIdAndDelete(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial Not Found" });
        } else if (testimonial.error) {
            // console.log("testimonial-error:", testimonial.error);
            return res.status(400).json({ error: testimonial.error.message });
        }
        return res.status(200).json({ message: "Testimonial Deleted Successfully!" });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
};
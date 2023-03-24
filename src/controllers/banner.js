require("dotenv").config();

// const Joi = require("joi");

const BannerModel = require('../models/banner');
const timeline = require('../utils/timestamp');
const multer = require('../utils/multer');

// Upload Banner
exports.Banner = async (req, res) => {
    multer.uploadBanners(req, res, async (error) => {
        console.log("fields", req.body);
        console.log('files', req.files);

        if (error) {
            console.log("error", error);
            return res.status(400).json({ "error": error });
        }
        else if (req.files === undefined) {
            console.log("No such file selected");
            return res.status(500).json({
                "status": 'fail',
                "message": `Error: No File Selected`
            });
        }
        else {
            // If Success
            let fields = req.body
            console.log("bannerFields:", fields);
            let bannerFileArray = req.files;
            let fileLocation;
            let images = [];
            fields.banner_image = images;
            for (let i = 0; i < bannerFileArray.length; i++) {
                fileLocation = bannerFileArray[i].location;
                console.log('filename:', fileLocation);
                images.push(fileLocation)
            }
            const newBanner = new BannerModel(
                fields,
                // fields.banner_image = images
            );
            await newBanner.save();
            // Save the file name into database
            return res.status(200).json({
                status: 'ok',
                banners: newBanner
            });
        }

    })
}

// Get all banner
exports.getBanners = async (req, res) => {
    try{
        const banners = await BannerModel.find({});
        if(banners.length === 0){
            return res.status(204).json(
                {
                    message: "no contents available in the database to present",
                }
            )
        }
        else{
            return res.status(200).json(
                {
                    banners: banners
                }
            )
        }
    }catch(error){
        return res.status(500).json(
            {
                error: "Something Went Wrong!",
                message: error
            }
        )
    }
}


// get banners by banner_position
exports.getBannerByPosition = async (req, res) => {
    try {
        const banner = await BannerModel.find({ banner_position: req.params.banner_position });
        res.json(banner);
    } catch (err) {
        res.json(
            {
                error: true,
                message: err.message
            }
        )
    }
}

// get banners by banner_name
exports.getBannerByName = async (req, res) => {
    try {
        const banner = await BannerModel.find({ banner_name: req.params.banner_name });
        res.json(banner);
    } catch (err) {
        res.json(
            {
                error: true,
                message: err.message
            }
        )
    }
}
// Update banner status
exports.updateStatus = (req, res, next) => {
    const id = req.params.id;
    let date_time = timeline.timestamp();
    BannerModel.findById(id)
        .then((banner) => {
            if (!banner) {
                const error = new Error("Could not find banner.");
                error.statusCode = 404;
                throw error;
            }
            // banner.banner_name = req.body.banner_name || banner.banner_name;
            banner.is_active = req.body.is_active;
            banner.updatedAt = date_time;

            return banner.save();
        })
        .then((result) => {
            console.log(result);
            res
                .status(200)
                .json({ message: "banner status updated!", banner: result });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


// Delete Specifi banner By Id
exports.deleteBanner = async (req, res) => {
    try {
        const deleteBanner = await BannerModel.findOneAndDelete({
            _id: req.params.id
        });
        res.json({
            error: false,
            message: "Banner Deleted Successfully!",
            Response: deleteBanner
        });
    } catch (err) {
        res.json({
            message: err.message
        });

    }
};
require("dotenv").config();
const Joi = require("joi");

const OfferNotificationModel = require('../models/offerNotification');
const timeline = require('../utils/timestamp');
const multer = require('../utils/multer');

// offerNotification validation schema
// const OfferNotificationSchema = Joi.object().keys({
//     title: Joi.string().required(),
//     image: Joi.array().required(),
// })

// Create endpoint // update is pending
exports.create = async (req, res) => {
    multer.uploadFiles(req, res, async (error) => {
        console.log("fields", req.body);
        console.log('file', req.file);

        if (error) {
            console.log("error", error);
            return res.status(400).json({ "error": error });
        }
        else if (req.file === undefined) {
            console.log("No such file selected");
            return res.status(500).json({
                "status": 'fail',
                "message": `Error: No File Selected`
            });
        }
        else {
            // If Success
            let fields = req.body
            let image = req.file;

            fields.image = image.location;

            let date_time = timeline.timestamp();
            fields.createdAt = date_time;

            const newNotification = new OfferNotificationModel(
                fields,
            );
            await newNotification.save();

            // Save the file name into database
            return res.status(200).json({
                status: 'ok',
                notification: newNotification
            });
        }

    })
}

// get all endpoint
exports.getAll = async (req, res) => {
    try {
        const notifications = await OfferNotificationModel.find({});
        if (notifications.length === 0) {
            return res.status(400).json({ messgae: "No notifications found in Database!" });
        } else {
            return res.status(200).json({ notifications })
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get by title
exports.getNotificationByTitle = async (req, res) => {
    try {
        const notification = await OfferNotificationModel.find({ title: req.params.title });
        if (!notification) {
            return res.status(400).json({ message: "no notification found!" })
        } else if (notification.error) {
            // console.log("game-error:", notification.error);
            return res.status(400).json({ error: notification.error.message });
        } else {
            return res.status(200).json({ notification });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// Update notification
// exports.update = (req, res, next) => {
//     const id = req.params.id;
//     OfferNotificationModel.findById(id)
//         .then((notification) => {
//             if (!notification) {
//                 const error = new Error("Could not find notification.");
//                 error.statusCode = 404;
//                 throw error;
//             }
//             notification.title = req.body.title || notification.title;
//             notification.image = req.body.image || notification.image;
//             // notification.title = req.body.enable;
//             // notification.description = req.body.description || notification.description;

//             let date_time = timeline.timestamp();
//             notification.updatedAt = date_time;
//             return notification.save();
//         })
//         .then((result) => {
//             console.log(result);
//             res
//                 .status(200)
//                 .json({ message: "Notification status updated!", notification: result });
//         })
//         .catch((err) => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });
// };
exports.update = async (req, res) => {
    try {
        multer.uploadFiles(req, res, async (error) => {
            // console.log("fields", req.body);
            // console.log('file', req.file);

            if (error) {
                console.log("error", error);
                return res.status(400).json({ "error": error });
            }
            else if (req.file === undefined) {
                console.log("No such file selected");
                return res.status(500).json({
                    "status": 'fail',
                    "message": `Error: No File Selected`
                });
            }
            else {
                // If Success
                const { id } = req.params;
                const notification = await OfferNotificationModel.findByIdAndUpdate(id);
                if (!notification) {
                    return res.status(400).json({ message: "Notification not found!" });
                }

                let fields = req.body
                // console.log("imageFields:", fields);
                let image = req.file;
                fields.image = image.location;

                let date_time = timeline.timestamp();

                notification.title = req.body.title || notification.title;
                notification.image = image.location || notification.image;
                notification.updatedAt = date_time;

                await notification.save();

                // Save the file name into database
                return res.status(200).json({
                    status: 'ok',
                    notification: notification
                });
            }
        });
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// change status.
exports.enable = async (req, res) => {
    try {
        const { id } = req.params;
        const { enable } = req.body;
        let date_time = timeline.timestamp();

        const notification = await OfferNotificationModel.findByIdAndUpdate(id);
        if (!notification) {
            return res.status(404).json({ message: "Notification Not Found" });
        } else if (notification.error) {
            // console.log("notification-error:", notification.error);
            return res.status(400).json({ error: notification.error.message });
        }

        notification.enable = enable || notification.enable;
        notification.updatedAt = date_time;

        await notification.save();

        return res.status(200).json({ message: `Status Set to ${enable}` });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}


// Delete Specifi notification By Id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await OfferNotificationModel.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).json({ message: "Notification Not Found" });
        } else if (notification.error) {
            // console.log("notification-error:", notification.error);
            return res.status(400).json({ error: notification.error.message });
        }
        return res.status(200).json({ message: "Notification Deleted Successfully!" });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}
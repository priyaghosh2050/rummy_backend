const express = require("express");
const router = express.Router();

const OfferNotificationController = require("../controllers/offerNotification");
const auth = require("../middleware/authentication");

// Offer Notification Route
router.post('/create', auth.verifyTokenAndSubAdminOrAdmin, OfferNotificationController.create);
router.get('/get-all', auth.verifyTokenAndSubAdminOrAdmin, OfferNotificationController.getAll);
router.get('/get-by-title/:title', auth.verifyTokenAndSubAdminOrAdmin, OfferNotificationController.getNotificationByTitle);
router.put('/update/:id', auth.verifyTokenAndSubAdminOrAdmin, OfferNotificationController.update);
router.put('/enable/:id', auth.verifyTokenAndSubAdminOrAdmin, OfferNotificationController.enable);
router.delete('/delete/:id', auth.verifyTokenAndSubAdminOrAdmin, OfferNotificationController.delete);

module.exports = router;
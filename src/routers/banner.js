const express = require("express");
const router = express.Router();

const BannerController = require("../controllers/banner");
const auth = require("../middleware/authentication");

// Banner Route
router.post('/upload-banner', auth.verifyTokenAndSubAdminOrAdmin, BannerController.Banner);
router.get('/get-all-banner', auth.verifyTokenAndSubAdminOrAdmin, BannerController.getBanners);
router.get('/get-banner-by-position/:banner_position', auth.verifyTokenAndSubAdminOrAdmin, BannerController.getBannerByPosition);
router.get('/get-banner-by-name/:banner_name', auth.verifyTokenAndSubAdminOrAdmin, BannerController.getBannerByName);
router.put('/update-status/:id', auth.verifyTokenAndSubAdminOrAdmin, BannerController.updateStatus);
router.delete('/delete-banner/:id', auth.verifyTokenAndSubAdminOrAdmin, BannerController.deleteBanner);

module.exports = router;
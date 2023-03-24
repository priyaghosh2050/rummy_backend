const express = require("express");
const router = express.Router();

const botsController = require("../controllers/bots");
const auth = require("../middleware/authentication");

// Banner Route
router.post('/create', auth.verifyTokenAndSubAdminOrAdmin, botsController.create);
router.post('/bulk-create', auth.verifyTokenAndSubAdminOrAdmin, botsController.bulkBotWrite);
router.get('/get-by-id/:id', auth.verifyTokenAndSubAdminOrAdmin, botsController.getById);
router.get('/get-by-play/:play', auth.verifyTokenAndSubAdminOrAdmin, botsController.getByPlay);
router.get('/', auth.verifyTokenAndSubAdminOrAdmin, botsController.getAll);
router.delete('/delete-all', auth.verifyTokenAndSubAdminOrAdmin, botsController.deleteAll);
router.delete('/delete/:id', auth.verifyTokenAndSubAdminOrAdmin, botsController.delete);

module.exports = router;
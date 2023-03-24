const express = require("express");
const router = express.Router();

const GamesController = require("../controllers/games");
const auth = require("../middleware/authentication");

// Games Route
router.post('/create', auth.verifyTokenAndSubAdminOrAdmin, GamesController.create);
router.get('/get-all-games', auth.verifyTokenAndSubAdminOrAdmin, GamesController.getAll);
router.get('/get-by-game-type/:gameType', auth.verifyTokenAndSubAdminOrAdmin, GamesController.getGameByGameType);
router.get('/get-by-game-sub-type/:gameSubType', auth.verifyTokenAndSubAdminOrAdmin, GamesController.getByGameSubType);
router.put('/update/:id', auth.verifyTokenAndSubAdminOrAdmin, GamesController.update);
router.delete('/delete/:id', auth.verifyTokenAndSubAdminOrAdmin, GamesController.delete);

module.exports = router;
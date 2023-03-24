const express = require("express");
const router = express.Router();

const TournamentCategoryController = require("../controllers/tournamentCategory");
const auth = require("../middleware/authentication");

// Tournament Category Route
router.post('/create-tournament', auth.verifyTokenAndSubAdminOrAdmin, TournamentCategoryController.create);
router.get('/get-all-tournament', auth.verifyTokenAndSubAdminOrAdmin, TournamentCategoryController.getAll);
router.get('/get-tournament-by-name/:name', auth.verifyTokenAndSubAdminOrAdmin, TournamentCategoryController.gettournamentByName);
router.put('/update-tournament/:id', auth.verifyTokenAndSubAdminOrAdmin, TournamentCategoryController.update);
router.delete('/delete-tournament/:id', auth.verifyTokenAndSubAdminOrAdmin, TournamentCategoryController.delete);

module.exports = router;
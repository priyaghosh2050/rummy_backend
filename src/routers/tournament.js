const express = require("express");
const router = express.Router();

const TournamentController = require("../controllers/tournament");
const auth = require('../middleware/authentication');

// Tournament Route
router.post('/create', auth.verifyTokenAndSuperAdmin, TournamentController.create);
router.get('/get-all', auth.verifyTokenAndSubAdminOrAdmin, TournamentController.getAll);
router.get('/get-by-tournament-category/:category', auth.verifyTokenAndSubAdminOrAdmin, TournamentController.getByTournamentCategory)
router.get('/get-by-tournament-type/:frequency', auth.verifyTokenAndSubAdminOrAdmin, TournamentController.getByTournamentType)
// router.get('/get-by-created-date/:createdAt',TournamentController.getByCreatedDate)
// router.get('/get-by-updated-date/:updatedAt',TournamentController.getByUpdatedDate)
router.put('/update/:id', auth.verifyTokenAndSubAdminOrAdmin, TournamentController.update)
router.delete('/delete/:id', auth.verifyTokenAndSubAdminOrAdmin, TournamentController.delete)

module.exports = router
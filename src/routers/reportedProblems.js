const express = require("express");
const router = express.Router();

const reportedProbController = require("../controllers/reportedProblems");
const auth = require("../middleware/authentication");

// Reported Problems Route
router.post('/report', reportedProbController.report);
router.get('/get-all-reportprob', auth.verifyTokenAndSubAdminOrAdmin, reportedProbController.getAll);
router.get('/get-reportprob-by-name/:name', auth.verifyTokenAndSubAdminOrAdmin, reportedProbController.getReportProbByName);
router.get('/get-reportprob-by-email/:email', auth.verifyTokenAndSubAdminOrAdmin, reportedProbController.getReportProbByEmail);
router.put('/update-reportprob/:id', auth.verifyTokenAndSubAdminOrAdmin, reportedProbController.update);
router.delete('/delete-reportprob/:id', auth.verifyTokenAndSubAdminOrAdmin, reportedProbController.delete);

module.exports = router;
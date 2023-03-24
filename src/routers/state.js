const express = require("express");
const router = express.Router();

const StateController = require("../controllers/state");
const auth = require("../middleware/authentication");

// Banner Route
router.post('/create-state', auth.verifyTokenAndSubAdminOrAdmin, StateController.create);
router.get('/get-all-state', auth.verifyTokenAndSubAdminOrAdmin, StateController.getAll);
router.get('/get-state-by-name/:stateName', auth.verifyTokenAndSubAdminOrAdmin, StateController.getStateByName);
router.put('/update-state/:id', auth.verifyTokenAndSubAdminOrAdmin, StateController.updateState);
router.delete('/delete-state/:id', auth.verifyTokenAndSubAdminOrAdmin, StateController.deleteState);

module.exports = router;
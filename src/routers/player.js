const express = require('express');
const router = express.Router();

const playerController = require('../controllers/player');
const auth = require("../middleware/authentication");

router.post('/signup', playerController.signup); // for registration

router.post('/signin-one', playerController.signinOne); // for login via email and password

router.post('/signin-two', playerController.signinTwo); // for login via Phone number

router.post('/verify-otp', playerController.verifyOtp); // for OTP verification via Phone number

router.get('/', auth.verifyTokenAndSubAdminOrAdmin, playerController.getAllPublic); // to get all registered player for public use

router.get('/get-all-players', auth.verifyTokenAndSubAdminOrAdmin, playerController.getAll); // to get all registered player for admin use

router.get("/:id", auth.verifyTokenAndSubAdminOrAdmin, playerController.getById); // to get player detail via id

router.delete("/delete-player/:id", auth.verifyTokenAndAuthorization, playerController.delete); // delete player via id

router.post("/signout", playerController.signout); //deleting player access token

router.put("/update-player", auth.verifyTokenAndAuthorization, playerController.update); // update player details

router.post('/upload-docs/:id', auth.verifyTokenAndAuthorization, playerController.docUpload);// upload player kyc docs

router.put('/update-kyc-status/:id', auth.verifyTokenAndSubAdminOrAdmin, playerController.docValidation); // for document status update

router.post('/forgot-password', playerController.forgot); // for sending unique code to the player to reset password via email or phone

router.put('/reset-password', playerController.reset); // for password reset test

router.put('/reset-password/:id', auth.verifyTokenAndAuthorization, playerController.reset); // for password reset test with id

module.exports = router;
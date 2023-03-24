const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/admin");
const auth = require("../middleware/authentication");

// Register Route
router.post('/register', AdminController.register)

// Login Route
router.post('/login', AdminController.login)

// logout Route
router.post('/logout', AdminController.logout);

// Forgot Password
router.patch("/forgot-password", AdminController.ForgotPassword);

// Reset Password
router.patch("/reset-password", AdminController.ResetPassword);

// update or edit admin details
router.put('/:id/edit', auth.verifyTokenAndSuperAdmin, AdminController.editAdmin);

// change status
router.put("/:id/change-status", auth.verifyTokenAndSuperAdmin, AdminController.changeStatus);

// delete admin
router.delete("/:id/delete", auth.verifyTokenAndSuperAdmin, AdminController.deleteAdmin);

// get all admin
router.get("/", auth.verifyTokenAndSuperAdmin, AdminController.getAllAdmin);

// get specific admin
router.get("/:id", auth.verifyTokenAndSuperAdmin, AdminController.getAdmin);

module.exports = router;
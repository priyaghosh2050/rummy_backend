const express = require("express");
const router = express.Router();

const TestimonialController = require("../controllers/testimonials");
const auth = require('../middleware/authentication')

// Testimonial Route
router.post('/create-testimonial', auth.verifyTokenAndSubAdminOrAdmin, TestimonialController.Register);
router.get('/get-all-testimonial', auth.verifyTokenAndSubAdminOrAdmin, TestimonialController.getAll);
router.get('/get-testimonial-by-name/:nameAndAddress', auth.verifyTokenAndSubAdminOrAdmin, TestimonialController.gettestimonialByName);
router.put('/update-testimonial/:id', auth.verifyTokenAndSubAdminOrAdmin, TestimonialController.update);
router.delete('/delete-testimonial/:id', auth.verifyTokenAndSubAdminOrAdmin, TestimonialController.delete);

module.exports = router;
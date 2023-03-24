const express = require("express");
const router = express.Router();

const walletController = require("../controllers/wallet");
const auth = require('../middleware/authentication');

router.post("/", auth.verifyTokenAndSubAdminOrAdmin, walletController.addWallet);
router.get("/", auth.verifyTokenAndSubAdminOrAdmin, walletController.getWallets);
router.delete("/delete/:id", auth.verifyTokenAndSubAdminOrAdmin, walletController.deleteWallet);
router.get('/:payerId', auth.verifyTokenAndSubAdminOrAdmin, walletController.getSpecificWalletByPlayer);
router.get("/:botId", auth.verifyTokenAndSubAdminOrAdmin, walletController.getSpecificWalletByBot);
router.patch("/update/:id", auth.verifyTokenAndSubAdminOrAdmin, walletController.updateSpecificWallet);
router.put('/add-amount/:id', auth.verifyTokenAndSubAdminOrAdmin, walletController.addAmountByPaymentGateway);
router.post("/verify-order", auth.verifyTokenAndSubAdminOrAdmin, walletController.verifyOrder);

module.exports = router;
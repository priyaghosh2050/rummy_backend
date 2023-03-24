const Joi = require('joi');
const Razorpay = require('razorpay');
const crypto = require("crypto");
const walletModel = require('../models/wallet');
require('dotenv').config();

const walletSchema = Joi.object().keys(
    {
        player: Joi.string() || '',
        bot: Joi.string() || '',
        funChips: Joi.number(),
        inPlayFunChips: Joi.number(),
        realChipsDeposit: Joi.number(),
        inPlayRealChips: Joi.number(),
        realChipsWithdrawl: Joi.number(),
        rewardPoints: Joi.number(),
        totalBonus: Joi.number(),
        activeBonus: Joi.number(),
        releaseBonus: Joi.number(),
        pendingBonus: Joi.number()
    }
);

// register wallet
exports.addWallet = async (req, res) => {
    try {
        const wallet = walletSchema.validate(req.body);
        if (wallet.error) {
            console.log(wallet.error.message);
            return res.status(400).json({
                error: true,
                message: wallet.error.message,
            });
        }
        if(req.body.player && req.body.bot){
            return res.status(406).json({
                error: true,
                message: `you cannot mention player and bots at the same time.`
            })
        }
        const newWallet = new walletModel(wallet.value);
        await newWallet.save();
        return res.status(200).json({
            success: true,
            message: "Wallet registration successful",
            New_Wallet: newWallet,  //Send it to the client
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Some Thing Went Wrong!",
            reason: error.message
        });
    }
};

// get wallets
exports.getWallets = async (req, res) => {
    try {
        const wallets = await walletModel.find({});
        if (wallets.length === 0) {
            return res.status(204).json({
                message: `dataset is empty`
            });
        } else if (wallets.error) {
            console.log(wallet.error.message);
            return res.status(400).json({
                error: true,
                message: wallet.error.message,
            });
        } else {
            return res.status(200).json({
                success: true,
                Wallets: wallets,  //Send it to the client
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Some Thing Went Wrong!",
            reason: error.message
        });
    }
}

// get sepecific wallets by id
exports.getSpecificWallet = async (req, res) => {
    try {
        const id = req.params.id;
        const wallet = await walletModel.findById(id).populate("player").populate("bots");
        if (!wallet) {
            return res.status(404).json({
                message: `wallet with id ${id} not found`
            });
        } else if (wallet.error) {
            console.log(wallet.error.message);
            return res.status(400).json({
                error: true,
                message: wallet.error.message,
            });
        } else {
            return res.status(200).json({
                success: true,
                Wallets: wallet,  //Send it to the client
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Some Thing Went Wrong!",
            reason: error.message
        });
    }
};

// get specific wallets by player id
exports.getSpecificWalletByPlayer = async (req, res) => {
    try {
        const player = { player: req.params.playerId };
        const wallet = await walletModel.findOne(player).populate("player");
        if (!wallet) {
            return res.status(404).json({
                message: `wallet with player id ${player} not found`
            });
        } else if (wallet.error) {
            console.log(wallet.error.message);
            return res.status(400).json({
                error: true,
                message: wallet.error.message,
            });
        } else {
            return res.status(200).json({
                success: true,
                Wallets: wallet,  //Send it to the client
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Some Thing Went Wrong!",
            reason: error.message
        });
    }
};

// get specific wallet by bot id
exports.getSpecificWalletByBot = async (req, res) => {
    try {
        const bot = { bot: req.params.botId };
        const wallet = await walletModel.findOne(bot).populate("bots");
        if (!wallet) {
            return res.status(404).json({
                message: `wallet with bot id ${bot} not found`
            });
        } else if (wallet.error) {
            console.log(wallet.error.message);
            return res.status(400).json({
                error: true,
                message: wallet.error.message,
            });
        } else {
            return res.status(200).json({
                success: true,
                Wallets: wallet,  //Send it to the client
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Some Thing Went Wrong!",
            reason: error.message
        });
    }
};

// update wallet
exports.updateSpecificWallet = async (req, res) => {
    try {
        const id = req.params.id;
        const { funChips, inPlayFunChips, realChipsDeposit, inPlayRealChips, realChipsWithdrawl, rewardPoints, totalBonus, activeBonus, releaseBonus, pendingBonus } = req.body;
        const wallet = await walletModel.findById(id).populate("player").populate("bots");
        if (!wallet) {
            return res.status(404).json({
                message: `wallet with id ${id} not found`
            });
        } else if (wallet.error) {
            console.log(wallet.error.message);
            return res.status(400).json({
                error: true,
                message: wallet.error.message,
            });
        } else {
            wallet.funChips = funChips || wallet.funChips;
            wallet.inPlayFunChips = inPlayFunChips || wallet.inPlayFunChips;
            wallet.realChipsDeposit = realChipsDeposit || wallet.realChipsDeposit;
            wallet.inPlayRealChips = inPlayRealChips || wallet.inPlayRealChips;
            wallet.realChipsWithdrawl = realChipsWithdrawl || wallet.realChipsWithdrawl;
            wallet.rewardPoints = rewardPoints || wallet.rewardPoints;
            wallet.totalBonus = totalBonus || wallet.totalBonus;
            wallet.activeBonus = activeBonus || wallet.activeBonus;
            wallet.releaseBonus = releaseBonus || wallet.releaseBonus;
            wallet.pendingBonus = pendingBonus || wallet.pendingBonus;

            await wallet.save();

            return res.status(200).json({
                success: true,
                Wallets: wallet,  //Send it to the client
            });
        }

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Some Thing Went Wrong!",
            reason: error.message
        });
    }
};

// delete wallet
exports.deleteWallet = async (req, res) => {
    try {
        const wallet = await walletModel.findByIdAndDelete(req.params.id);
        res.json({
            error: false,
            message: "Deleted Successfully!",
            Response: wallet
        });
    } catch (err) {
        res.json({
            message: err.message
        });

    }
}

// // Razorpay Instance details
// var instance = new Razorpay({
//     key_id: process.env.KEY_ID,
//     key_secret: process.env.KEY_SECRET,
// });

// var options = {
//     amount: req.body.amount || 1,  // amount in the smallest currency unit
//     currency: "INR",
//     notes: "test one"
// };

// instance.orders.create(options, async (error, order) => {
//     try {
//         if(error){
//             console.log("instance error:",error);
//         }
//         console.log("instance order:",order);
//     } catch (error) {
//         console.log("function error:",error);
//     }
// });

// add amount to wallet via payment gateway
exports.addAmountByPaymentGateway = async (req, res) => {
    // Razorpay Instance details
    var instance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
    });
    try {
        const playerId = req.params.id
        const amount = req.body.amount
        const currency = req.body.currency
        const notes = req.body.notes

        function generateReceipt() {
            var minm = 100000;
            var maxm = 999999;
            var randomNumberForReceipt = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
            var receipt = `paymemntOrder_${randomNumberForReceipt}`;
            return receipt;
        }

        var options = {
            amount: amount || 1,  // amount in the smallest currency unit
            currency: currency,
            receipt: generateReceipt(),
            notes: notes
        };

        instance.orders.create(options, async (error, order) => {
            if (error) {
                console.log("instance error:", error);
                return res.status(400).json(error)
            }
            console.log("instance order:", order);
            return res.status(200).json(order)
        });
    } catch (error) {
        console.log("func error:", error);
        return res.status(500).json(error)
    }
}

// var success_callback = { "razorpay_payment_id": "pay_29QQoUBi66xm2f", "razorpay_order_id": "order_9A33XWu170gUtm", "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d" }

// payment order verification
exports.verifyOrder = async (req, res) => {

    // Receive Payment Data
    const { razorpay_payment_id, razorpay_order_id } = req.body
    const razorpay_signature = req.headers['x-razorpay-signature'];

    // pass secret key
    const secret_key = process.env.KEY_SECRET //process.env.SECRET_KEY;

    try {
        // Creating hmac object 
        // let hmac = crypto.createHmac('sha256', secret_key);

        // // Passing the data to be hashed
        // hmac.update(razorpay_order_id + "|" + razorpay_payment_id);

        // // Creating the hmac in the required format
        // const generated_signature = hmac.digest('hex');

        // console.log("razpy-sig" + razorpay_signature);
        // console.log("ex-sig" + generated_signature);

        // test
        let body = razorpay_order_id + "|" + razorpay_payment_id
        var generated_signature = crypto.createHmac('sha256', secret_key).update(body.toString()).digest('hex');

        console.log("razpy-sig" + razorpay_signature);
        console.log("ex-sig" + generated_signature);

        // precondition check for debug
        if (generated_signature === razorpay_signature) {
            return console.log("pass");
        }
        // else return console.log("fail");

        if (razorpay_signature === generated_signature) {
            return res.json({ success: true, message: "Payment has been verified" });
        }
        return res.json({ success: false, message: "Payment verification failed" });
    } catch (error) {
        return res.status(500).json(
            {
                error: error
            }
        )
    }

}
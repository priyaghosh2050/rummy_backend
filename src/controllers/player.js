require('dotenv').config();

const PlayerDataSets = require('../models/player');

const { generatePlayerJwt } = require('../utils/playerJwt');
const timeline = require('../utils/timestamp');
const { sendEmail } = require("../utils/emailer");

const Joi = require('joi');
const cuid = require('cuid');

const fetch = require('node-fetch');
const jwt_decode = require('jwt-decode');

// validate player schema
const playerSchema = Joi.object().keys({
    userName: Joi.string().required().min(4),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    phone: Joi.string().required().min(10).max(10),
    password: Joi.string().required().min(4),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required()
});

// player registration
exports.signup = async (req, res) => {
    try {
        const player = playerSchema.validate(req.body);
        if (player.error) {
            // console.log(player.error.message);
            return res.json({
                error: true,
                status: 400,
                message: player.error.message,
            });
        }

        //Check if the email has been already registered.
        let email = await PlayerDataSets.findOne({
            email: player.value.email,
        });
        if (email) {
            return res.json({
                error: true,
                message: "This Email is already in use",
            });
        }

        // check if userName has been already registered
        let username = await PlayerDataSets.findOne({
            userName: player.value.userName,
        });
        if (username) {
            return res.json({
                error: true,
                message: "This Username is already in use",
            });
        }

        // check if the phone number is already registered
        let phoneNumber = await PlayerDataSets.findOne({
            phone: player.value.phone,
        });
        if (phoneNumber) {
            return res.json({
                error: true,
                message: "This Phone Number is already in use",
            });
        }

        // encrypt the password and asign it to a variable, then delete the confirmPassword filed and set the asigned variable to the password filed.
        const hash = await PlayerDataSets.hashPassword(player.value.password);
        delete player.value.confirmPassword;
        player.value.password = hash;

        //Generate unique collusion-resistant id for the player.
        const id = cuid();
        player.value.cuid = id;

        // send verification email
        // let code = Math.floor(100000 + Math.random() * 900000);  //Generate random 6 digit code.                             
        // let expiry = Date.now() + 60 * 1000 * 15;  //Set expiry 15 mins ahead from now
        // const sendCode = await sendEmail(result.value.email, code);
        // if (sendCode.error) {
        //     return res.status(500).json({
        //         error: true,
        //         message: "Couldn't send verification email.",
        //     });
        // }
        // result.value.emailToken = code;
        // result.value.emailTokenExpires = new Date(expiry);

        player.value.isActive = true; // temporary player activation.

        // assign resgistration time
        // let date_time = `${date}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
        let date_time = timeline.timestamp();
        player.value.registeredAt = date_time;

        // save the new player details to the db
        const newPlayer = new PlayerDataSets(player.value);
        await newPlayer.save();

        return res.status(201).json({
            newPlayer,
        });


    } catch (error) {
        console.error("signup-error", error);
        return res.status(500).json({
            error: true,
            message: "Cannot Register",
            reason: error.message
        });
    }
}

// player login with email and password
exports.signinOne = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: "Cannot authorize user.",
            });
        }

        //1. Find if any account with that email exists in DB
        const player = await PlayerDataSets.findOne({ email: email });
        // NOT FOUND - Throw error
        if (!player) {
            return res.status(404).json({
                error: true,
                message: "Account not found",
            });
        }

        //2. Throw error if account is not activated
        if (!player.isActive) {
            return res.status(400).json({
                error: true,
                message: "You must verify your email to activate your account",
            });
        }
        //3. throw error if account is blocked 
        if (player.isBlocked) {
            return res.status(400).json({
                error: true,
                message: "Your Account is blocked!",
            });
        }

        //4. Verify the password is valid
        const isValid = await PlayerDataSets.comparePasswords(password, player.password);
        if (!isValid) {
            return res.status(400).json({
                error: true,
                message: "Invalid credentials",
            });
        }

        //Generate Access token
        const { error, token } = await generatePlayerJwt(player.userName, player.email, player.cuid, player._id);
        if (error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't create access token. Please try again later",
            });
        }
        player.accessToken = token;

        await player.save();

        // success
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken: token,  //Send it to the client
        });

    } catch (error) {
        console.error("Login-error", error);
        return res.status(500).json({
            error: true,
            message: "Some Thing Went Wrong!",
            reason: error.message
        });
    }
}

// player Login with username and OTP
exports.signinTwo = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({
                error: true,
                message: "Cannot authorize user.",
            });
        }

        //1. Find if any account with that email exists in DB
        const player = await PlayerDataSets.findOne({ phone: phone });
        // NOT FOUND - Throw error
        if (!player) {
            return res.status(404).json({
                error: true,
                message: "Account not found",
            });
        }

        //2. Throw error if account is not activated
        if (!player.isActive) {
            return res.status(400).json({
                error: true,
                message: "You must verify your email to activate your account",
            });
        }
        //3. throw error if account is blocked 
        if (player.isBlocked) {
            return res.status(400).json({
                error: true,
                message: "Your Account is blocked!",
            });
        }

        //4. send otp and save

        // generate random 6 digit numbers for SMS
        const generateRandomNumber = () => {
            var minm = 100000;
            var maxm = 999999;
            return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
        };

        // SMS Gateway Details
        const user = process.env.SMS_USER;
        const password = process.env.SMS_PASS;
        const senderId = process.env.SENDER_ID;
        const tempid = process.env.TEMP_ID
        var OTP = generateRandomNumber();
        var sms = `Thank you signing up for Newton Rummy Your OTP is : ${OTP} Valid for 15 minutes only Welcome to Newton Rummy Powered By Pentad Inc.`

        // SMS URL 
        const url = `http://sms.smsmenow.in/sendsms.jsp?user=${user}&password=${password}&senderid=${senderId}&mobiles=+91${phone}&sms=${sms}&accusage=1&responsein=json&tempid=${tempid}`
        // send OTP after all the varification.
        const response = await fetch(`${url}`, { method: 'GET' });
        const data = await response.json();

        let status = 'success', reason = 'success', code = '000';
        if (data.smslist.sms.reason === reason && data.smslist.sms.code === code && data.smslist.sms.status === status) {
            player.otp = OTP
            await player.save();
            return res.status(200).json({
                status: 'success',
                message: `OTP sent to ${phone}`
            });
        } else {
            return res.status(400).json({ data });
        }

    } catch (error) {
        console.error("Login-error", error);
        return res.status(500).json({
            error: true,
            message: "Some Thing Went Wrong!",
            reason: error.message
        });
    }
};

// verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone && !otp) {
            return res.status(400).json({
                error: true,
                message: "phone number and otp are required to authenticate",
            });
        }

        //1. Find if any account with that email exists in DB
        const player = await PlayerDataSets.findOne({ phone: phone });
        // NOT FOUND - Throw error
        if (!player) {
            return res.status(404).json({
                error: true,
                message: "Account not found",
            });
        }

        //2. Throw error if account is not activated
        if (!player.isActive) {
            return res.status(400).json({
                error: true,
                message: "You must verify your email to activate your account",
            });
        }
        //3. throw error if account is blocked 
        if (player.isBlocked) {
            return res.status(400).json({
                error: true,
                message: "Your Account is blocked!",
            });
        }

        // check opt is correct in the user dataset.
        if (player.otp == otp) {
            //Generate Access token
            const { error, token } = await generatePlayerJwt(player.userName, player.email, player.cuid, player._id);
            if (error) {
                return res.status(500).json({
                    error: true,
                    message: "Couldn't create access token. Please try again later",
                });
            }
            player.accessToken = token;
            player.otp = null;
            await player.save();

            // success
            return res.status(200).json({
                success: true,
                message: "Player logged in successfully",
                accessToken: token,  //Send it to the client
            });
        } else {
            return res.status(400).json({
                message: "not authorised"
            })
        }

    } catch (error) {
        console.error("login-error", error);
        return res.status(500).json({
            error: true,
            message: "Something Went Wrong!",
            reason: error.message
        });
    }
};


// player logout
exports.signout = async (req, res) => {
    try {
        const bearerToken = req.rawHeaders[1];
        const decode = jwt_decode(bearerToken);
        const id = decode.userId;
        let player = await PlayerDataSets.findOne({ _id: id });
        player.accessToken = "";
        await player.save();
        return res.status(200).json({ success: true, message: "Player Logged out" });

    } catch (error) {
        // console.error("user-logout-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}

// Forgot Password
exports.forgot = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, phone } = req.body;

        if (email) {

            const player = await PlayerDataSets.findOne({
                email: email,
            });
            if (!player) {
                return res.status(400).json({
                    success: true,
                    message: `There is no Player with Email Id:${email}`,
                });
            }

            let code = Math.floor(100000 + Math.random() * 900000);
            let response = await sendEmail(player.email, code);
            if (response.error) {
                return res.status(500).json({
                    error: true,
                    message: "Couldn't send mail. Please try again later.",
                });
            }
            let expiry = Date.now() + 60 * 1000 * 15;
            player.resetPasswordToken = code;
            player.resetPasswordExpires = expiry; // 15 minutes
            await player.save();
            return res.status(200).json({
                success: true,
                message: "If that email address with us, we will send you a CODE to your email to reset your password",
            });

        } else if (phone) {
            const player = await PlayerDataSets.findOne({
                phone: phone,
            });
            if (!player) {
                return res.status(400).json({
                    success: true,
                    message: `There is No Player with Phone Number:${phone}`,
                });
            }

            // generate six digit number
            const generateRandomNumber = () => {
                var minm = 100000;
                var maxm = 999999;
                return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
            };

            // SMS Gateway Details
            const user = process.env.SMS_USER;
            const password = process.env.SMS_PASS;
            const senderId = process.env.SENDER_ID;
            const tempid = process.env.TEMP_ID
            var OTP = generateRandomNumber();
            var sms = `Thank you signing up for Newton Rummy Your OTP is : ${OTP} Valid for 15 minutes only Welcome to Newton Rummy Powered By Pentad Inc.`

            // SMS URL 
            const url = `http://sms.smsmenow.in/sendsms.jsp?user=${user}&password=${password}&senderid=${senderId}&mobiles=+91${phone}&sms=${sms}&accusage=1&responsein=json&tempid=${tempid}`
            // send OTP after all the varification.
            const response = await fetch(`${url}`, { method: 'GET' });
            const data = await response.json();

            let status = 'success', reason = 'success', code = '000';
            if (data.smslist.sms.reason === reason && data.smslist.sms.code === code && data.smslist.sms.status === status) {
                let expiry = Date.now() + 60 * 1000 * 15; // 15 minutes
                player.resetPasswordToken = OTP;
                player.resetPasswordExpires = expiry;
                await player.save();
                return res.status(200).json({
                    success: true,
                    message: "If that phone number is registered with us, We will send a CODE to reset your password.",
                });
            } else {
                return res.status(400).json({ data });
            }
        } else {
            return res.status(400).json({ message: "please enter an email id or a phone number to send an verification code to reset password" })
        }
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ error });
    }
}

// reset password
exports.reset = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, newPassword, confirmPassword } = req.body;

        if (code && newPassword && confirmPassword) {
            const player = await PlayerDataSets.findOne({
                resetPasswordToken: req.body.code,
                resetPasswordExpires: { $gt: Date.now() },
            });
            if (!player) {
                return res.status(400).json({
                    error: true,
                    message: "Password reset token is invalid or has expired.",
                });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    error: true,
                    message: "Passwords didn't match",
                });
            }
            const hash = await PlayerDataSets.hashPassword(req.body.newPassword);
            player.password = hash;
            player.resetPasswordToken = null;
            player.resetPasswordExpires = "";
            await player.save();
            return res.status(200).json({
                success: true,
                message: "Password has been changed",
            });
        } else if (id && newPassword && confirmPassword) {
            const player = await PlayerDataSets.findOne({
                _id: id
            });
            if (!player) {
                return res.stauts(400).json({
                    error: true,
                    message: "Player Not Found",
                });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    error: true,
                    message: "Passwords didn't match",
                });
            }
            const hash = await PlayerDataSets.hashPassword(req.body.newPassword);
            player.password = hash;
            await player.save();
            return res.status(200).json({
                success: true,
                message: "Password has been changed",
            });

        } else if (!code || !password && !confirmPassword) {
            return res.status(400).json({ message: `Please fill the required fields.` })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
}

// get all players
exports.getAllPublic = async (req, res) => {
    try {
        const options = {
            otp: 0,
            panCard: 0,
            aadharCard: 0,
            addressProof: 0,
            password: 0,
            isActive: 0,
            isBlocked: 0,
            registeredAt: 0,
            lastUpdatedAt: 0,
            isActive: 0,
            isBlocked: 0,
            emailToken: 0,
            emailTokenExpires: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            accessToken: 0,
        }
        const players = await PlayerDataSets.find({}, options);
        if (players.length === 0) {
            return res.status(404).json({ message: "Player Database is empty" });
        } else if (players.error) {
            return res.status(400).json({ error: players.error.message });
        }
        return res.status(200).json({ players });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ error });
    }
}

exports.getAll = async (req, res) => {
    try {
        const players = await PlayerDataSets.find({});
        if (players.length === 0) {
            return res.status(404).json({ message: "Player Database is empty" });
        } else if (players.error) {
            return res.status(400).json({ error: players.error.message });
        }
        return res.status(200).json({ players });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ error });
    }
}


// get specific player
exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const player = await PlayerDataSets.findById(id);
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        } else if (player.error) {
            return res.status(400).json({ error: player.error.message });
        }
        return res.status(200).json({ player });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ error });
    }
}

// update player
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, phone, gender, birthday, addressLineOne, addressLineTwo, city, state, pincode } = req.body;

        const player = await PlayerDataSets.findByIdAndUpdate(id);

        if (!player) {
            return res.status(400).json({ message: "player not found" });
        }

        player.firstName = firstname || player.firstName;
        player.lastName = lastname || player.lastName;
        player.email = email || player.email;
        player.phone = phone || player.phone;
        player.gender = gender || player.gender;
        player.birthday = birthday || player.birthday;
        player.addressLineOne = addressLineOne || player.addressLineOne;
        player.addressLineTwo = addressLineTwo || player.addressLineTwo;
        player.city = city || player.city;
        player.state = state || player.state;
        player.pincode = pincode || player.pincode;

        await player.save();

        return res.status(200).json({ message: "Player details updated successfully!", player });

    } catch (error) {
        // console.error(error);
        return res.status(500).json({ error });
    }
}

// uploading doc
// NO CHOICE LEFT FOR NOT TO USE BASE64 FOR IMAGE, BECAUSE NEITHER MULTER NOR FORMIDABLE IS ABLE TO UPLOAD IMAGE SEPARATELY IN A SINGLE FORM-DATA.
exports.docUpload = async (req, res) => {
    try {
        const { id } = req.params;
        const { aadharOne, aadharTwo, pan, addressProof } = req.body;

        const playerKyc = await PlayerDataSets.findByIdAndUpdate(id);
        if (!playerKyc) {
            return res.status(400).json({ message: "player not found" });
        }

        if (req.body.aadharOne && req.body.aadharTwo) {
            playerKyc.aadharCard.imageOne = aadharOne;
            playerKyc.aadharCard.imageTwo = aadharTwo;
            playerKyc.aadharCard.status = 'submitted';
        } else {
            return res.status(400).json({
                message: "both sides of the aadhar card should be uploaded",
            });
        }

        if (req.body.pan) {
            playerKyc.panCard.image = pan;
            playerKyc.panCard.status = 'submitted';
        }

        if (req.body.addressProof) {
            playerKyc.addressProof.image = addressProof;
            playerKyc.addressProof.status = 'submitted';
        }

        if (aadharOne || aadharTwo || pan || addressProof) {
            await playerKyc.save();
            return res.status(200).json({ message: "Player KYC docs updated successfully!", player: playerKyc })
        }
        return res.status(400).json({
            message: "not entries found"
        })

    } catch (error) {
        // console.error(error);
        return res.status(500).json({ error });
    }
}

// document validation update // admin
exports.docValidation = async (req, res) => {
    try {

        const { id } = req.params;
        const { aadhar, pan, addressProof } = req.body;

        const playerKycStatusUpdate = await PlayerDataSets.findByIdAndUpdate(id);

        if (req.body.aadhar) {
            playerKycStatusUpdate.aadharCard.status = aadhar;
        }

        if (req.body.pan) {
            playerKycStatusUpdate.panCard.status = pan;
        }

        if (req.body.addressProof) {
            playerKycStatusUpdate.addressProof.status = addressProof;
        }

        if (aadhar || pan || addressProof) {
            await playerKycStatusUpdate.save();
            return res.status(200).json({ message: "Player KYC docs Status updated successfully!", player: playerKycStatusUpdate })
        }
        return res.status(400).json({
            message: "not entries found"
        })

    } catch (error) {
        // console.error(error);
        return res.status(500).json({ error });
    }
}

// delete player
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const player = await PlayerDataSets.findByIdAndDelete(id);
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        } else if (player.error) {
            return res.status(400).json({ error: player.error.message });
        }
        return res.status(200).json({ message: `player id ${id} deleted` });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ error });
    }
}
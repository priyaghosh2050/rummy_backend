require("dotenv").config();

const Joi = require("joi");
const cuid = require("cuid");
const jwt_decode = require('jwt-decode');

const AdminModel = require("../models/admin")

const { generateAdminJwt } = require('../utils/adminJwt');
const { sendEmail } = require("../utils/emailer");
const timeline = require('../utils/timestamp');

// validate admin schema
const adminSchema = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    role: Joi.string().required(),
    password: Joi.string().required(),
})

// admin registration
exports.register = async (req, res) => {
    try {
        const administrator = adminSchema.validate(req.body);

        if (administrator.error) {
            // console.log(administrator.error);
            return res.json({
                "error": true,
                "status": 400,
                "message": admin.error.message,
            });
        }

        //Check if the adminname has been already registered.
        let admin = await AdminModel.findOne({
            username: administrator.value.username,
        });
        if (admin) {
            return res.json({
                "error": true,
                "message": "this username is already in use",
            });
        }

        const hash = await AdminModel.hashPassword(administrator.value.password);
        const id = cuid(); //Generate unique id for the admin.
        administrator.value.cuid = id;
        //remove the confirmPassword field from the result as we dont need to save this in the db.
        delete administrator.value.confirmPassword;
        administrator.value.password = hash;

        let date_time = timeline.timestamp();
        administrator.value.createdAt = date_time;

        const newAdmin = new AdminModel(administrator.value);
        await newAdmin.save();

        return res.status(200).json({
            "success": true,
            "message": "Registration Success",
            "Admin": newAdmin
        });
    } catch (error) {
        // console.error("admin-registration-error", error);
        return res.status(500).json({
            "error": true,
            "message": "Cannot Register",
            "error_details": error.message
        });
    }
}
// login
exports.login = async (req, res) => {
    try {

        const { username, password } = req.body;

        // Check if credentials match
        if (!username || !password) {
            return res.status(400).json(
                {
                    "error": true,
                    "message": "Invalid adminname or password"
                }
            )
        }
        // Find if any account with that adminnam exists in DB
        const admin = await AdminModel.findOne({ username: username });

        // throw error if admin not found
        if (!admin) {
            res.status(404).json(
                {
                    "error": true,
                    "message": "Admin Not Found"
                }
            )
        }

        // throw error if admin is blocked
        if (admin.is_blocked) {
            res.status(403).json(
                {
                    "error": true,
                    "message": "You are not Authorised to Access"
                }
            )
        }

        // throw error if admin is not active
        if (!admin.isActive) {
            res.status(401).json(
                {
                    "error": true,
                    "message": "Your Account is not Active"
                }
            )
        }
        // verify password
        const isValid = await AdminModel.comparePasswords(password, admin.password);
        if (!isValid) {
            return res.status(403).json({
                "error": true,
                "message": "Invalid Credetials",
            });
        }

        //Generate Access token
        const { error, token } = await generateAdminJwt(admin.username, admin.email, admin.role, admin.cuid, admin._id);
        if (error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't create access token. Please try again later",
            });
        }
        admin.accessToken = token;

        await admin.save();

        //Success
        return res.send({
            "success": true,
            "message": "Admin logged in successfully",
            "accessToken": token,  //Send it to the client
        });

    } catch (err) {
        // console.error("Login-error", err);
        return res.status(500).json({
            "error": true,
            "message": "Couldn't login. Please try again later.",
            "error_details": err
        });
    }
}

// logout
exports.logout = async (req, res) => {
    try {

        const bearerToken = req.rawHeaders[1];
        const decode = jwt_decode(bearerToken);
        console.log(decode);
        const id = decode.adminId;

        let admin = await AdminModel.findOne({ _id: id });
        admin.accessToken = "";

        await admin.save();

        return res.send(
            {
                "success": true,
                "message": "Admin Logged out"
            }
        );

    } catch (error) {
        console.error("admin-logout-error", error);
        return res.status(500).json({
            "error": true,
            "message": error.message,
        });
    }
};

// Forgot Password
exports.ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({
                status: 400,
                error: true,
                message: "Cannot be processed",
            });
        }
        const admin = await AdminModel.findOne({
            email: email,
        });
        if (!admin) {
            return res.send({
                success: true,
                message: "If that email address is in our database, we will send you an email to reset your password",
            });
        }
        let code = Math.floor(100000 + Math.random() * 900000);
        let response = await sendEmail(admin.email, code);
        if (response.error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't send mail. Please try again later.",
            });
        }
        let expiry = Date.now() + 60 * 1000 * 15;
        admin.resetPasswordToken = code;
        admin.resetPasswordExpires = expiry; // 15 minutes
        await admin.save();
        return res.send({
            success: true,
            message: "If that email address is in our database, we will send you an email to reset your password",
        });
    } catch (error) {
        console.error("forgot-password-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};


// reset password
exports.ResetPassword = async (req, res) => {
    try {

        const { code, newPassword, confirmPassword } = req.body;
        if (!code || !newPassword || !confirmPassword) {
            return res.status(403).json({
                error: true,
                message: "Couldn't process request. Please provide all mandatory fields",
            });
        }

        const admin = await AdminModel.findOne({
            resetPasswordToken: req.body.code,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!admin) {
            return res.send({
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
        const hash = await AdminModel.hashPassword(req.body.newPassword);
        admin.password = hash;
        admin.resetPasswordToken = null;
        admin.resetPasswordExpires = "";
        await admin.save();
        return res.send({
            success: true,
            message: "Password has been changed",
        });
    } catch (error) {
        console.error("reset-password-error", error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

// update admin
exports.editAdmin = async (req, res) => {
    const { username, email } = req.body;

    try {

        const admin = await AdminModel.findById(req.params.id);
        if (!admin) {
            const error = new Error("Astro not found.");
            error.statusCode = 404;
            throw error;
        }

        admin.username = username || admin.username;
        admin.email = email || admin.email;

        admin.updatedAt = timeline.timestamp();

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Admin details has been updated",
            update_admin: admin
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error
        })
    }
}

// block or unblock admin
exports.changeStatus = async (req, res) => {
    const { isBlocked } = req.body;

    try {

        const admin = await AdminModel.findById(req.params.id);
        if (!admin) {
            const error = new Error("Astro not found.");
            error.statusCode = 404;
            throw error;
        }

        admin.isBlocked = isBlocked;
        admin.updatedAt = timeline.timestamp();

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Admin details has been updated",
            admin: admin
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error
        })
    }
}

// delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await AdminModel.findByIdAndDelete(req.params.id);
        res.json({
            error: false,
            message: "Deleted Successfully!",
            Response: admin
        });
    } catch (err) {
        res.json({
            message: err.message
        });

    }
}

// get all admins
exports.getAllAdmin = async (req, res) => {
    try {
        // console.log(req);
        const admin = await AdminModel.find({});
        // console.log(admin);
        return res.json(admin);
    } catch (err) {
        res.json({ message: err.message })
    }
};

// Get Specific admin By Id
exports.getAdmin = async (req, res) => {
    try {
        // console.log(req);
        const admin = await AdminModel.findById(req.params.id);
        // console.log(admin);
        return res.json(admin);
    } catch (err) {
        res.json({ message: err.message })
    }
}
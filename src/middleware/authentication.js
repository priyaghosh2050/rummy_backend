const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyUserToken = async (req, res, next) => {

    try {
        var bearerHearder = await req.headers['authorization'];

        // console.log(typeof (bearerHearder));
        // console.log(bearerHearder);

        if (!bearerHearder) {
            return res.status(403).send(
                {
                    auth: false,
                    message: 'No bearerHearder provided.'
                }
            );
        } else if (typeof bearerHearder != 'undefined') {

            //split at the space  
            const bearer = bearerHearder.split(' ');
            // //Get the token from array  
            const bearerToken = bearer[1];
            // // set the token  
            const token = bearerToken;

            // console.log("bearer", bearer);
            // console.log("bearerToken", bearerToken);
            // console.log("token", token);

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                }
                // else{
                //     return res.status(200).json({
                //         "auth": "verified",
                //         "message": "User Verified",
                //         decoded
                //     })
                // }
                else {
                    // console.log("decoded user", decoded);
                    req.user = decoded;
                    next();
                }

            });
        } else {
            return res.Status(403).json({
                "message": "Forbidden"
            });
        }

    } catch (error) {
        console.log("function-error", error);
        return res.status(500).json(
            {
                "error": true,
                "message": "something went wrong",
                "reason": error.message
            }
        )
    };
};

// verify user id or a super-admin and the token
exports.verifyTokenAndAuthorization = async (req, res, next) => {
    await verifyUserToken(req, res, () => {
        if (req.user.userId === req.params.id || req.user.adminId === req.params.id || req.user.role === 'superadmin') {
            next();
        } else {
            res.status(403).json(
                {
                    "error": true,
                    "auth": 'failed',
                    "reason": `You do not have to permission to execute this task, User ID do not match.`
                }
            );
        }
    });
}

// verify user role for super-admin and token
exports.verifyTokenAndSuperAdmin = async (req, res, next) => {
    await verifyUserToken(req, res, () => {
        if (req.user.role === 'superadmin') {
            next();
        } else {
            res.status(403).json(
                {
                    "error": true,
                    "auth": 'failed',
                    "reason": 'You do not have to permission to execute this task, Super-admin Permission Required'
                }
            );
        }
    });
};

// verify user role for sub-admin and token
exports.verifyTokenAndSubAdminOrAdmin = async (req, res, next) => {
    await verifyUserToken(req, res, () => {
        if (req.user.role === 'subadmin' || 'admin' || 'superadmin') {
            next();
        } else {
            res.status(403).json(
                {
                    "error": true,
                    "auth": 'failed',
                    "reason": 'You do not have to permission to execute this task, sub-admin Permission Required'
                }
            );
        }
    });
};
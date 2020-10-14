const JWTService = require('../../services/jwt');
const AdminModel = require('../../models/admin');
const UserModel = require('../../models/user');
const TokenModel = require('../../models/token');

class Auth {
    static async userIsLoggedIn (req, res, next) {
        try {
            const { authorization } = req.headers;
            const token = authorization ? authorization.split(' ')[1] : null;

            if (token !== null) {
                const decodedToken = await JWTService.verify(token);

                if (await UserModel.findByPk(decodedToken.userEmail) && decodedToken) {
                    if (req.path.match(/(register)|(login)|(confirmation)|(resend)|(reset-password)/)) {
                        res.status(422).json({ 'message': `${decodedToken.userEmail} is logged in.`});
                    } else {
                        req.userEmail = decodedToken.userEmail;
                        next();
                    };
                } else {
                    throw new Error('Authorization failed');
                };
            } else if (req.path.match(/(register)|(login)|(confirmation)|(resend)|(password-reset)|(token)/)) {
                next();
            } else {
                throw new Error('Authorization failed');
            };
        } catch (error) {
            console.error(error);

            if (error.message === 'jwt expired') {
                error.statusCode = 403;
                error.message = error.message || 'Authorization failed';
                error.messages = [ "JsonWebToken expired. please login again" ];
            } else if (error.message === 'jwt must be provided' || error.message.includes('Unexpected token') || error.message === 'jwt malformed' || error.message === 'invalid token' || error.message === 'Authorization failed') {
                error.statusCode = 401;
                error.message = error.message || 'Authorization failed';
                error.messages = [ 'Invalid token' ];
            } else {
                error.statusCode = 500;
                error.messages = [ 'Internal error occured.' ];
            };

            next(error);
        };
    };

    static async adminIsLoggedIn (req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader ? authHeader.split(' ')[1] : null;

            if (token !== null) {
                const decodedToken = await JWTService.verify(token);

                if (await AdminModel.findByPk(decodedToken.adminEmail) && decodedToken) {
                    if (req.path === '/login') {
                        res.status(422).json({ 'message': `${decodedToken.adminEmail} is logged in.`});
                    } else {
                        req.adminEmail = decodedToken.adminEmail;
                        next();
                    };
                } else {
                    throw new Error('Authorization error');
                };
            } else if (req.path === '/login') {
                next();
            } else {
                throw new Error('Authorization error');
            };
        } catch (error) {
            console.error(error);

            if (error.message === 'jwt expired') {
                (401, error.message, [ "JWTService expired." ], next);
                error.statusCode = 401;
                error.messages = [ 'JWTService expired. please login again.' ];
            } else if (error.message === 'Invalid token' || error.message === 'Authorization error') {
                error.statusCode = 401;
                error.messages = [ 'Unauthorized user', 'Invalid token' ];
            };

            next(error);
        };
    };
};

module.exports = Auth;
const bcryptjs = require('bcryptjs');

const User = require('../../models/user');
const TokenModel = require('../../models/token');
const Validator = require('../../utils/validator');
const UserModel = require('../../models/user');
const UserPaymentModel = require('../../models/user-payment');

class UserValidator {
    /**
     * Route: postRegister [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async postRegister(req, res, next) {
        try {
            const { email, password, fullname, phone } = req.body;
            const errorMessages = [];

            if (!Validator.isEmail(email)) {
                errorMessages.push('Email is not valid.');
            } else {
                await User.findByPk(email) ? errorMessages.push('Email already exists.') : '';
            };
            if (!Validator.isPhone(phone)) {
                errorMessages.push('Phone is not valid.');
            } else {
                await User.findOne({ where: { phone } }) ? errorMessages.push('Phone already exists.') : '';
            };
            if (!Validator.isPassword(password)) {
                errorMessages.push('Password is not valid.');
            };

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: getConfirmation [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async getConfirmation(req, res, next) {
        try {
            const { token } = req.params;
            const errorMessages = [];

            !await TokenModel.findByPk(token) ? errorMessages.push('We were unable to find a valid token. Your token expired.') : '';

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: postResend [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async postResend(req, res, next) {
        try {
            const { email } = req.body;
            const errorMessages = [];

            if (!Validator.isEmail(email)) {
                errorMessages.push('Email is not valid.');
            } else {
                const user = await User.findByPk(email);
                if (!user) {
                    errorMessages.push('Email does not exists.');
                } else if (user.emailVerified) {
                    errorMessages.push('Email verified.');
                } else {
                    const token = await TokenModel.findOne({
                        where: {
                            userEmail: email,
                            type: 'email'
                        }
                    });

                    token ? token.destroy() : '';
                };
            };

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: postPasswordReset [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async postPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            const errorMessages = [];

            if (!Validator.isEmail(email)) {
                errorMessages.push('Email is not valid.');
            } else {
                const user = await User.findByPk(email);
                if (!user) {
                    errorMessages.push('Email does not exists.');
                } else if (!user.emailVerified) {
                    errorMessages.push('Email address is not verified. please verify it first.');
                } else {
                    const token = await TokenModel.findOne({
                        where: {
                            userEmail: email,
                            type: 'password'
                        }
                    });

                    token ? token.destroy() : '';
                };
            };

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: getPasswordResetToken [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async getPasswordResetToken(req, res, next) {
        try {
            const { token } = req.params;
            const errorMessages = [];

            !await TokenModel.findByPk(token) ? errorMessages.push("Token doesn't exists.") : '';

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: patchPasswordReset [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async patchPasswordReset(req, res, next) {
        try {
            const { token, newPassword } = req.body;
            const errorMessages = [];

            if (!await TokenModel.findByPk(token)) {
                errorMessages.push("Token doesn't exists.");
            } else if (!Validator.isPassword(newPassword)) {
                errorMessages.push('password is not valid.');
            };

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: postLogin [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async postLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            const errorMessages = [];
            if (!Validator.isEmail(email)) {
                errorMessages.push('Email is not valid.');
            } else {
                const user = await User.findByPk(email);
                
                if (!user) {
                    errorMessages.push('Email or password is not valid');
                } else if (!user.emailVerified) {
                    errorMessages.push('Email is not verified');
                } else if (!await bcryptjs.compare(password, user.password)) {
                    errorMessages.push('Email or password is not valid');
                };
            };

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: postAccessToken [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async postAccessToken (req, res, next) {
        try {
            const { refreshToken } = req.body;
            const errorMessages = [];
            
            if (!refreshToken) {
                errorMessages.push('refresh token is not valid.')
            } else {
                !await TokenModel.findByPk(refreshToken) ? errorMessages.push('refresh token does not exists.') : '';
            };

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 403;
                error.message = error.message || 'Refresh token expired.';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: deleteLogout [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async deleteLogout (req, res, next) {
        try {
            const { refreshToken } = req.body;
            const errorMessages = [];
            
            !refreshToken ? errorMessages.push('refresh token is not valid.') : '';
            !await TokenModel.findByPk(refreshToken) ? errorMessages.push("refresh token does not exists.") : '';

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 403;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: postConnectToGithub [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async postConnectToGithub (req, res, next) {
        try {
            const { name } = req.params;
            const { githubAccessToken, githubRefreshToken } = req.body;
            const errorMessages = [];

            if (!Validator.isDockerName(name) || name === 'all') {
                errorMessages.push('name is not valid.');
            } else {
                !await ProjectModel.findByPk(name) ? errorMessages.push('name does not exist.') : '';
            };
            !githubAccessToken ? errorMessages.push('Github access token is not valid.') : '';
            !githubRefreshToken ? errorMessages.push('Github refresh token is not valid.') : '';
            
            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: getPaymentRequest [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async getPaymentRequest (req, res, next) {
        try {
            const { amount, description, email, phone } = req.body;
            const errorMessages = [];

            if (!Validator.isEmail(email)) {
                errorMessages.push('Email is not valid.');
            } else if (req.userEmail !== email) {
                errorMessages.push('Email does not exists.');
            } else {
                !Validator.isNumeric(amount) ? errorMessages.push('Amount should be Number.') : '';
                description.length > 100 ? errorMessages.push('Description should be less than 100 character.') : '';

                if (!Validator.isPhone(phone)) {
                    errorMessages.push('Phone number is not valid.');
                } else {
                    const user = await UserModel.findByPk(email);

                    user.phone !== phone ? errorMessages.push('Phone does not match with your phone number.') : '';
                };
            };

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: getPaymentVerification [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     */
    static async getPaymentVerification (req, res, next) {
        try {
            const { id } = req.params;
            const userPayment = await UserPaymentModel.findByPk(id);
            const errorMessages = [];

            if (!userPayment) {
                errorMessages.push('Payment id does not exists.');
            } else if (userPayment.userEmail !== req.userEmail) {
                errorMessages.push('Emails did not match.');
            };

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };
};

module.exports = UserValidator;
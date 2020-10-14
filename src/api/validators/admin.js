const bcryptjs = require('bcryptjs');

const Validator = require('../../utils/validator');
const UserModel = require('../../models/user');
const AdminModel = require('../../models/admin');
const TokenModel = require('../../models/token');
const TicketModel = require('../../models/ticket');

class AdminValidator {
    static async postLogin (req, res, next) {
        try {
            const { email, password } = req.body;
            const errorMessages = [];
            
            if (!Validator.isEmail(email)) {
                errorMessages.push('email is not valid.');
            } else {
                const admin = await AdminModel.findByPk(email);
                
                if (!admin) {
                    errorMessages.push('email or password is wrong.')
                } else {
                    !Validator.isPassword(password) ? errorMessages.push('password is not valid') : '';
                    !await bcryptjs.compare(password, admin.password) ? errorMessages.push('email or password is wrong.') : '';
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

    static async postRegister (req, res, next) {
        try {
            const { email, password } = req.body;
            const errorMessages = [];

            !Validator.isEmail(email) ? errorMessages.push('email is not valid.') : '';
            await AdminModel.findByPk(email) ? errorMessages.push('email already exists.') : '';
            !Validator.isPassword(password) ? errorMessages.push('password is not valid') : '';
    
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

    static async getTicket (req, res, next) {
        try {
            const { id } = req.params;
            const errorMessages = [];

            !await TicketModel.findByPk(id) ? errorMessages.push('id is not valid.') : '';

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

    static async postTicketMessage (req, res, next) {
        try {
            const { id } = req.params;
            const errorMessages = [];

            if (!Validator.isUuid(id)) {
                errorMessages.push('id is not Valid');
            } else if (!await TicketModel.findByPk(id)) {
                errorMessages.push('id is not Valid');
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

    static patchOptions (req, res, next) {
        try {
            const { minCreditAmount, sampleAvatar, userCanRegister } = req.body;
            const errorMessages = [];

            !Validator.isNumeric(minCreditAmount) ? errorMessages.push('minCreditAmount is not valid.') : '';
            !Validator.isUrl(sampleAvatar) ? errorMessages.push('sampleAvatar is not valid.') : '';
            !Validator.isBool(userCanRegister) ? errorMessages.push('userCanRegister is not valid.') : '';

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

    static async postIncreaseUserBalance (req, res, next) {
        try {
            const { userEmail, amount } = req.body;
            const errorMessages = [];
            
            !await UserModel.findByPk(userEmail) ? errorMessages.push('userEmail does not exist.') : '';
            !Validator.isNumeric(amount) ? errorMessages.push('amount is not number.') : '';

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
};

module.exports = AdminValidator;
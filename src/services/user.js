const crypto = require('crypto');

const bcryptjs = require('bcryptjs');
const ZarinpalCheckout = require('zarinpal-checkout')

/**
 * Initial ZarinPal module.
 * @param {String} 'cde29146-5762-11e9-b614-000c295eb8fc' [MerchantID]
 * @param {bool} false [toggle `Sandbox` mode]
 */
const zarinpal = ZarinpalCheckout.create('cde29146-5762-11e9-b614-000c295eb8fc', true);

const UserModel = require('../models/user');
const TokenModel = require('../models/token');
const JWTService = require('./jwt');
const EmailService = require('./email');
const UserPaymentModel = require('../models/user-payment');
const { uiHost, jwtAccessKeyLife, jwtRefreshKeyLife, bcryptjsSalt } = require('../config');
// const Plan = require('../models/plans');

class UserService {
    static async postRegister ({ email, password, fullname, phone }) {
        try {
            const accessToken = await JWTService.sign({ email });
            const hashedPassword = await bcryptjs.hash(password, Number(bcryptjsSalt));
            const user = await UserModel.create({
                email,
                password: hashedPassword, 
                fullname,
                phone,
                accessToken
            });
            const token = await TokenModel.create({
                token: crypto.randomBytes(16).toString('hex'),
                userEmail: user.email,
                type: 'email'
            });
            // const token = await TokenModel.create({
            //     token: Math.floor(100000 + Math.random() * 900000),
            //     userEmail: user.email,
            //     type: 'phone'
            // });
    
            EmailService.sendMail({
                to: user.email, 
                subject: 'Account Verification Token - Ariana-Cloud Team', 
                text: `Hello. Please verify your account by clicking the link: http://${uiHost}/email-verification/${token.token}.`
            });

            return { user };
        } catch (error) { throw error };
    };

    static async getConfirmation (token) {
        try {
            const t = await TokenModel.findByPk(token);
            const user = await UserModel.findByPk(t.userEmail);

            t.type === 'email' ? user.emailVerified = true : '';
            t.type === 'phone' ? user.phoneVerified = true : '';
            await t.destroy();
            user.save();

            return { user };
        } catch (error) { throw error };
    };

    static async postResend (email) {
        try {
            const token = await TokenModel.create({
                token: crypto.randomBytes(16).toString('hex'),
                userEmail: email,
                type: 'email'
            });

            EmailService.sendMail({
                to: email, 
                subject: 'Account Verification Token - Ariana-Cloud Team', 
                text: `Hello. Please verify your account by clicking the link: http://${uiHost}/email-verification/${token.token}.`
            });

            return { token };
        } catch (error) { throw error };
    };

    static async postPasswordReset (email) {
        try {
            const token = await TokenModel.create({
                token: crypto.randomBytes(16).toString('hex'),
                userEmail: email,
                type: 'password'
            });

            EmailService.sendMail({
                to: email,
                subject: 'Password reset - Ariana-Cloud Team',
                text: `Hi, please click to change your password: http://${uiHost}/password-reset/${token.token}.`
            });

            return { token };
        } catch (error) { throw error };
    };

    static async patchPasswordReset (token, password) {
        try {
            const t = await TokenModel.findByPk(token);
            const user = await UserModel.findByPk(t.userEmail);
            const hashedPassword = await bcryptjs.hash(password, Number(bcryptjsSalt));

            user.password = hashedPassword;
            await t.destroy();
            user.save();

            return { user };
        } catch (error) { throw error };
    };

    static async postLogin (email) {
        try {
            const user = await UserModel.findByPk(email);
            const accessToken = await JWTService.sign({ 'userEmail': email }, { 'expiresIn': jwtAccessKeyLife });
            const refreshToken = await JWTService.signRefresh({ 'userEmail': email }, { 'expiresIn': jwtRefreshKeyLife });

            await TokenModel.create({
                token: refreshToken,
                userEmail: email,
                type: 'refresh-token'
            });

            delete user.password, user.createdAt;

            return { user, accessToken, refreshToken };
        } catch (error) { throw error };
    };

    static async postAcessToken (refreshToken) {
        try {
            const decodedRefreshToken = await JWTService.verifyRefresh(refreshToken);
            const dbRefreshToken = await TokenModel.findByPk(refreshToken);
            let accessToken;

            if (dbRefreshToken.userEmail === decodedRefreshToken.userEmail) {
                accessToken = await JWTService.sign({ "userEmail": decodedRefreshToken.userEmail }, { expiresIn: '15d' });
                return { accessToken };
            } else {
                const error = new Error();
                error.statusCode = 403;
                error.message = 'refreshToken expired.',
                error.messages = [ 'our refresh token expired or is invalid.' ]
                throw error;
            };
        } catch (error) { throw error };
    };

    static async deleteLogout (refreshToken) {
        try {
            const token = await TokenModel.findByPk(refreshToken);

            token.destroy();

            return { token };
        } catch (error) { throw error };
    };

    static async getUser (email) {
        try {
            const user = await UserModel.findByPk(email);

            delete user.password, user.createdAt, user.updatedAt;

            return { user };
        } catch (error) { throw error };
    };

    static async patchUser (email, userInfo) {
        try {
            const user = await UserModel.findByPk(email);
            const { fullname, password, avatar } = userInfo;

            user.update({ fullname, password, avatar });
        } catch (error) { throw error; };
    };

    static async deleteUser (email) {
        try {
            const user = await UserModel.findByPk(email);

            await user.destroy();

            return { user };
        } catch (error) { throw error };
    };

    static async postConnectToGithub (email, githubAccessToken, githubRefreshToken) {
        try {
            await TokenModel.create({
                token: githubAccessToken, 
                type: 'github-access-token',
                userEmail: email
            });
            await TokenModel.create({
                token: githubRefreshToken, 
                type: 'github-refresh-token',
                userEmail: email
            });
            return;
        } catch (error) { throw error };
    };

    /**
     * Service: getPaymentRequest
     * @param {Number} amount
     * @param {string} description
     * @param {String} email
     * @param {String} phone
     * @return {Object} response
     */
    static async getPaymentRequest (amount, description, email, phone) {
        try {
            const userPayment = await UserPaymentModel.create({
                amount, 
                userEmail: email
            });
            const CallbackURL = `http://192.168.1.102:3000/v1/users/payment-verification/${userPayment.id}/`
            const response = await zarinpal.PaymentRequest({
                Amount: amount, 
                CallbackURL, 
                Description: description, 
                Email: email, 
                Mobile: phone
            });

            return { response };
        } catch (error) { throw error; }
    };

    /**
     * Route: getPaymentVerification [Middleware]
     * @param {UUIDV4} id
     * @param {String} authority
     * @return {Object} response
     */
    static async getPaymentVerification (id, authority) {
        try {
            const userPayment = await UserPaymentModel.findByPk(id);
            const user = await UserModel.findByPk(userPayment.userEmail);
            const response = await zarinpal.PaymentVerification({
                Amount: userPayment.amount,
                Authority: authority,
            });

            if (response.status == 101) {
                // save { status: 100, RefID: 12345678 }
                userPayment.status = 'OK';
                userPayment.refId = response.RefID;
                user.balance = Number(user.balance) + Number(userPayment.amount);
                user.save();
            } else {
                // do something { status: -21, RefID: 0 }. failor transaction
                userPayment.status = 'NOK';
                userPayment.refId = response.RefID;
            };
    
            return { response };
        } catch (error) { throw error };
    };
};

module.exports = UserService;
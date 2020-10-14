const bcryptjs = require('bcryptjs');

const JWTService = require('./jwt');
const EmailService = require('./email');

const UserModel = require('../models/user');
const AdminModel = require('../models/admin');
const TokenModel = require('../models/token');
const TicketModel = require('../models/ticket');
const TicketMessageModel = require('../models/ticket-message');
const OptionModel = require('../models/option');
const { bcryptjsSalt, jwtAccessKeyLife, jwtRefreshKeyLife } = require('../config');

class AdminService {
    static async postLogin (email) {
        try {
            const accessToken = await JWTService.sign({ 'adminEmail': email }, { expiresIn: jwtAccessKeyLife });
            const refreshToken = await JWTService.signRefresh({ 'adminEmail': email }, { expiresIn: jwtRefreshKeyLife });
            
            EmailService.sendMail({
                to: email,
                subject: 'Login - Ariana-Cloud Team',
                text: 'Someone logged in using your email & password. if you do not did. please click on this link: '
            });

            return { accessToken, refreshToken };
        } catch (error) {
            throw error;
        };
    };

    static async postRegister (email, password) {
        try {
            const hashedPassword = await bcryptjs.hash(password, Number(bcryptjsSalt));
            const admin = await AdminModel.create({
                email,
                password: hashedPassword
            });

            EmailService.sendMail({
                to: email,
                subject: 'Registration - Ariana-Cloud Team',
                text: 'Your registration completed. now you can login as a admin.'
            });

            return { admin };
        } catch (error) {
            throw error;
        };
    };

    static async getTickets () {
        try {
            const tickets = await TicketModel.findAll({
                where: {
                    status: 'waiting'
                }
            });

            return { tickets };
        } catch (error) {
            next(error);
        }
    };

    static async getTicket (id) {
        try {
            const ticket = await TicketModel.findByPk(id);
            const messages = await TicketMessageModel.findAll({
                where: {
                    ticketId: id
                }
            });

            return { ticket, messages };
        } catch (error) {
            next(error);
        };
    };

    static async postTicketMessage (ticketId, adminEmail, message) {
        try {
            const ticket = await TicketModel.findByPk(ticketId);
            const ticketMessage = await TicketMessageModel.create({ message, ticketId, adminEmail });

            EmailService.sendMail({
                to: ticket.userEmail,
                subject: `${ticket.title} answerd`,
                text: message
            });
            ticket.status = 'answerd';
            await ticket.save();
            
            return { ticketMessage };
        } catch (error) {
            next(error);
        };
    };

    static async getOptions () {
        try {
            const option = await OptionModel.findByPk(1);

            return { option };
        } catch (error) {
            throw error;
        };
    };

    static async patchOptions (minCreditAmount, sampleAvatar, userCanRegister) {
        try {
            const option = await OptionModel.findByPk(1);
            
            option.minCreditAmount = minCreditAmount;
            option.sampleAvatar = sampleAvatar;
            option.userCanRegister = userCanRegister;
            await option.save();

            return { option };
        } catch (error) {
            throw error;
        };
    };

    static async postIncreaseUserBalance (email, amount) {
        try {
            const user = await UserModel.findByPk(email);
            user.balance = Number(user.balance) + Number(amount);

            await user.save();

            return { user };
        } catch (error) {
            next(error);
        };
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
};

module.exports = AdminService;
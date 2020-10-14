const AdminService = require('../../services/admin');

class AdminController {
    static async postLogin (req, res, next) {
        try {
            const { email } = req.body;
            const { accessToken, refreshToken } = await AdminService.postLogin(email);

            res.status(200).json({ 
                accessToken,
                refreshToken,
                'admin': email
            });
        } catch (error) { next(error) };
    };

    static async postRegister (req, res, next) {
        try {
            const { email, password } = req.body;
            const { admin } = await AdminService.postRegister(email, password);

            res.status(201).json({ "admin": admin.email });
        } catch (error) { next(error) };
    };

    static async getTickets (req, res, next) {
        try {
            const { tickets } = await AdminService.getTickets();

            res.status(200).json({ tickets });
        } catch (error) { next(error) };
    };

    static async getTicket (req, res, next) {
        try {
            const { ticketId } = req.params;
            const { ticket, messages } = await AdminService.getTicket(ticketId);

            res.status(200).json({ ticket, messages });
        } catch (error) { next(error) };
    };

    static async postTicketMessage (req, res, next) {
        try {
            const { ticketId } = req.params;
            const { messageBody } = req.body;
            const { ticketMessage } = await AdminService.postTicketMessage(ticketId, req.adminEmail, messageBody);

            res.status(201).json({ 
                ticketMessage,
                'message': 'ticket message created.'
            });
        } catch (error) { next(error) };
    };

    static async getOptions (req, res, next) {
        try {
            const { option } = await AdminService.getOptions();

            res.status(200).json({ 
                'data': option ,
                'message': 'This is Araina-Cloud options'
            });
        } catch (error) { next(error) };
    };

    static async patchOptions (req, res, next) {
        try {
            const { minCreditAmount, sampleAvatar, userCanRegister } = req.body;
            const { option } = await AdminService.patchOptions(minCreditAmount, sampleAvatar, userCanRegister);
            
            res.status(200).json({ 
                'data': option,
                'message': 'Ariana-Cloud Options updated.'
            });
        } catch (error) { next(error) };
    };

    static async postIncreaseUserBalance (req, res, next) {
        try {
            const { userEmail, amount } = req.body;
            const { user } = await AdminService.postIncreaseUserBalance(userEmail, amount);

            res.status(200).json({ 
                user,
                'message': 'user balance increased.'
            });
        } catch (error) { next(error) };
    };

    static async postAcessToken (req, res, next) {
        try {
            const { refreshToken } = req.body;
            const { accessToken } = await AdminService.postAcessToken(refreshToken);

            res.status(200).json({ accessToken });
        } catch (error) { next(error) }
    };
};

module.exports = AdminController;
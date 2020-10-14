const TicketService = require('../../services/ticket');

class TicketController {
    static async postTicket(req, res, next) {
        try {   
            const { ticketTitle: title, messageBody: body } = req.body;
            const { messageFiles: files } = req.files;
            const { ticket, ticketMessage } = await TicketService.postTicket(title, body, files, req.userEmail);

            res.status(201).json({
                ticket,
                ticketMessage,
                'message': 'ticket created.'
            });
        } catch (error) {
            next(error);
        };
    };

    static async getTickets(req, res, next) {
        try {
            const { tickets } = await TicketService.getTickets(req.userEmail);

            res.status(201).json({ tickets });
        } catch (error) { next(error) };
    };

    static async getTicket(req, res, next) {
        try {
            const { id } = req.params;
            const { ticket, ticketMessages } = await TicketService.getTicket(id);

            res.status(201).json({ ticket, ticketMessages });
        } catch (error) { next(error) };
    };

    static async deleteTicket(req, res, next) {
        try {
            const { id } = req.params;
            const { ticket } = await TicketService.deleteTicket(id);

            res.status(200).json({ ticket });
        } catch (error) { next(error) };
    };

    static async postTicketMessage(req, res, next) {
        try {
            const { id } = req.params;
            const { messageBody: body } = req.body;
            const { ticketMessage } = await TicketService.postTicketMessage(id, body);

            res.status(201).json({ ticketMessage });
        } catch (error) { next(error) };
    };
};

module.exports = TicketController;
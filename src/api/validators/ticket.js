const TicketModel = require('../../models/ticket');
const Validator = require('../../utils/validator');

class TicketValidator {
    static async postTicket(req, res, next) {
        try {
            const { ticketTitle: title, messageBody: body } = req.body;
            const { messageFiles: files } = req.files;
            const errorMessages = [];

            !Validator.isAlphanumeric(title) ? errorMessages.push('ticketTitle is not valid.') : '';
            Validator.isGreaterThan(500, body) ? errorMessages.push('ticketBody can not be grater than 500 character.') : '';
            
            files.forEach(f => {
                (f.size > 3 * 1024 * 1024) ? errorMessages.push('each file can not be grater than 3MB.') : '';
                !Validator.isPicture(f.type) ? errorMessages.push('messageFile should be picture (jpg, jpeg, bmp, gif, webp, tiff)') : '';
            });

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

    static async getTicket(req, res, next) {
        try {
            const { id } = req.params;
            const errorMessages = [];

            !await TicketModel.findByPk(id) || !Validator.isUuid(id) ? errorMessages.push('id is not valid.') : '';

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

    static async deleteTicket(req, res, next) {
        try {
            const errorMessages = [];

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

    static async postTicketMessage(req, res, next) {
        try {
            const { id } = req.params;
            const { messageBody: body, ticketFiles: files } = req.body;
            const errorMessages = [];

            !await TicketModel.findByPk(id) ? errorMessages.push('id does not exist.') : '';
            Validator.isGreaterThan(500, body) ? errorMessages.push('ticketBody can not be grater than 500 character.') : '';

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

module.exports = TicketValidator;
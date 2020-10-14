const crypto = require('crypto');
const path = require('path');
const { promises: fs, exists } = require('fs');

const TicketModel = require('../models/ticket');
const TicketMessageModel = require('../models/ticket-message');

class TicketService {
    static async postTicket(title, body, files, userEmail) {
        try {
            const ticket = await TicketModel.create({ 
                title, 
                userEmail,
                status: 'waiting'
            });
            const userDirectory = path.join(__dirname, '..', '..', 'ticket-pictures', userEmail);
            const paths = [];

            exists(userDirectory, async isExists => !isExists ? await fs.mkdir(userDirectory) : '');

            for (let i = 0; i < files.length; i++) {
                const oldFile = await fs.readFile(files[i].path);
                
                paths.push(path.join(userDirectory, `${crypto.randomBytes(8).toString('hex')}.${files[i].type.split('/')[1]}`));
                await fs.writeFile(paths[i], oldFile);
                await fs.unlink(files[i].path);
                paths[i] = `localhost:3000${paths[i].split('ticket-pictures')[1]}`;
            };

            const ticketMessage = await TicketMessageModel.create({
                message: body,
                ticketId: ticket.id,
                pics: paths
            });

            return { ticket, ticketMessage };
        } catch (error) {
            throw error;
        };
    };

    static async getTickets(userEmail) {
        try {
            const tickets = await TicketModel.findAll({ where: { userEmail }});

            return { tickets };
        } catch (error) {
            throw error;
        };
    };

    static async getTicket(id) {
        try {
            const ticket = await TicketModel.findByPk(id);
            const ticketMessages = await TicketMessageModel.findAll({
                where: {
                    ticketId: ticket.id
                }
            });

            return { ticket, ticketMessages };
        } catch (error) {
            throw error;
        };
    };

    static async deleteTicket(id) {
        try {
            const ticket = await TicketModel.findByPk(id);
            
            await ticket.destroy();
            return { ticket };
        } catch (error) {
            throw error;
        };
    };

    static async postTicketMessage(ticketId, body) {
        try {
            const ticket = await TicketModel.findByPk(ticketId);
            const ticketMessage = await TicketMessageModel.create({ message: body, ticketId });

            ticket.status = 'waiting';
            await ticket.save();

            return { ticketMessage };
        } catch (error) {
            throw error;
        };
    };
};

module.exports = TicketService;
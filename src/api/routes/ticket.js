const express = require("express");
const multipart = require('connect-multiparty');

const TicketController = require("../middlewares/ticket");
const TicketValidator = require('../validators/ticket');
const Auth = require("../middlewares/auth");

const multipartMiddleware = multipart();
const router = express.Router();

router.route('/all')
    .all(Auth.userIsLoggedIn)
    .get(TicketController.getTickets);

router.route('/')
    .all(Auth.userIsLoggedIn)
    .post(multipartMiddleware, TicketValidator.postTicket, TicketController.postTicket);

router.route('/:id')
    .all(Auth.userIsLoggedIn)
    .get(TicketValidator.getTicket, TicketController.getTicket)
    .delete(TicketValidator.deleteTicket, TicketController.deleteTicket);

router.route('/:id/messages')
    .all(Auth.userIsLoggedIn)
    .post(TicketValidator.postTicketMessage, TicketController.postTicketMessage);

module.exports = router;
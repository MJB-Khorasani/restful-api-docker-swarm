const express = require('express');

const Auth = require('../middlewares/auth');
const PrepairedProjectValidator = require('../validators/prepaired-project');
const PrepairedProjectController = require('../middlewares/prepaired-project');
const AdminController = require('../middlewares/admin');
const AdminValidator = require('../validators/admin');

const router = express.Router();

router.route('/login')
    .all(Auth.adminIsLoggedIn)
    .post(AdminValidator.postLogin, AdminController.postLogin);

router.route('/register')
    // .all(Auth.adminIsLoggedIn)
    .post(AdminValidator.postRegister, AdminController.postRegister);

router.route('/tickets/all')
    .all(Auth.adminIsLoggedIn)
    .get(AdminController.getTickets);

router.route('/tickets/:id')
    .all(Auth.adminIsLoggedIn)
    .get(AdminValidator.getTicket, AdminController.getTicket);

router.route('/tickets/:id/messages')
    .all(Auth.adminIsLoggedIn)
    .post(AdminValidator.postTicketMessage, AdminController.postTicketMessage);

router.route('/options')
    .all(Auth.adminIsLoggedIn)
    .get(AdminController.getOptions)
    .patch(AdminValidator.patchOptions, AdminController.patchOptions);

router.route('/increase-user-balance')
    .all(Auth.adminIsLoggedIn)
    .post(AdminValidator.postIncreaseUserBalance, AdminController.postIncreaseUserBalance)

router.route('projects/prepaired/:name')
    .all(Auth.adminIsLoggedIn)
    .get(PrepairedProjectValidator.getProject, PrepairedProjectController.getProject)
    .patch(PrepairedProjectValidator.patchProject, PrepairedProjectController.patchProject)
    .delete(PrepairedProjectValidator.deleteProject, PrepairedProjectController.deleteProject);

router.route('/access-token')
    .post(AdminValidator.postAccessToken, AdminController.postAcessToken);

module.exports = router;
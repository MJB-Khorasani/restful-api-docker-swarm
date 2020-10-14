const express = require("express");

const UserController = require("../middlewares/user");
const UserValidator = require('../validators/user');
const Auth = require("../middlewares/auth");

const router = express.Router();

router.route('/register')
    .all(Auth.userIsLoggedIn)
    .post(UserValidator.postRegister, UserController.postRegister);

router.route('/confirmation/:token')
    .all(Auth.userIsLoggedIn)
    .get(UserValidator.getConfirmation, UserController.getConfirmation);

router.route('/resend-confirmation')
    .all(Auth.userIsLoggedIn)
    .post(UserValidator.postResend, UserController.postResend);

router.route('/password-reset')
    .all(Auth.userIsLoggedIn)
    .post(UserValidator.postPasswordReset, UserController.postPasswordReset)
    .patch(UserValidator.patchPasswordReset, UserController.patchPasswordReset);

router.route('/password-reset/:token')
    .all(Auth.userIsLoggedIn)
    .get(UserValidator.getPasswordResetToken, UserController.getPasswordResetToken);

router.route('/login')
    .all(Auth.userIsLoggedIn)
    .post(UserValidator.postLogin, UserController.postLogin);

router.route('/access-token')
    .post(UserValidator.postAccessToken, UserController.postAcessToken);

router.route('/logout')
    .all(Auth.userIsLoggedIn)
    .delete(UserValidator.deleteLogout, UserController.deleteLogout);

router.route('/user')
    .all(Auth.userIsLoggedIn)
    .get(UserController.getUser)
//     .patch(UserValidator.patchUser, UserController.patchUser)
//     .delete(UserValidator.deleteUser, UserController.deleteUser);

router.route('/connect-to-github')
    .all(Auth.userIsLoggedIn)
    .post(UserValidator.postConnectToGithub, UserController.postConnectToGithub);

router.route('/payment-request')
    .all(Auth.userIsLoggedIn)
    .get(UserValidator.getPaymentRequest, UserController.getPaymentRequest);

router.route('/payment-verification/:id')
    .all(Auth.userIsLoggedIn)
    .get(UserValidator.getPaymentVerification, UserController.getPaymentVerification);

module.exports = router;
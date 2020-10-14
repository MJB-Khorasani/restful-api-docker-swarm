const UserService = require('../../services/user');

class UserController {
    /**
     * Route: postRegister [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response message: Please check your email ({userEmail})
     */
    static async postRegister (req, res, next) {
        try {
            const { email, password, fullname, phone } = req.body;
            const { user } = await UserService.postRegister({ email, password, fullname, phone });

            res.status(201).json({ 'message': `Please check your email (${user.email}).` });
        } catch (error) { next(error) };
    };

    /**
     * Route: getConfirmation [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response message: Your email ({userEmail}) verified.
     */
    static async getConfirmation (req, res, next) {
        try {
            const { token } = req.params;
            const { user } = await UserService.getConfirmation(token);
            
            res.status(200).json({ 'message': `Your email (${user.email}) verified.` });
        } catch (error) { next(error) };
    };

    /**
     * Route: postResend [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response message: {userEmail} please check your email.
     */
    static async postResend (req, res, next) {
        try {
            const { email } = req.body;
            const { token } = await UserService.postResend(email);

            res.status(200).json({ 'message': `${token.userEmail} please check your email.` });
        } catch (error) { next(error) };
    };

    /**
     * Route: postPasswordReset [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response message: {userEmail} please check your email.
     */
    static async postPasswordReset (req, res, next) {
        try {
            const { email } = req.body;
            const { token } = await UserService.postPasswordReset(email);

            res.status(200).json({ 'message': `${token.userEmail} please check your email` });
        } catch (error) { next(error) };
    };

    /**
     * Route: getPasswordResetToken [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response token, message: Token is valid
     */
    static async getPasswordResetToken (req, res, next) {
        try {
            const { token } = req.params;

            res.status(200).json({
                token,
                'message': 'Token is valid.'
            });
        } catch (error) { next(error) };
    };

    /**
     * Route: patchPasswordReset [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response message: Password changed
     */
    static async patchPasswordReset (req, res, next) {
        try {
            const { token, newPassword } = req.body;
            await UserService.patchPasswordReset(token, newPassword);

            res.status(200).json({ 'message': 'Password changed.' });
        } catch (error) { next(error) };
    };

    /**
     * Route: postLogin [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response refreshToken, accessTokenUser & user information
     */
    static async postLogin (req, res, next) {
        try {
            const { email } = req.body;
            const { user, accessToken, refreshToken } = await UserService.postLogin(email);

            res.status(200).json({ refreshToken, accessToken, user });
        } catch (error) { next(error) };
    };

    /**
     * Route: postAccessToken [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response accessToken
     */
    static async postAcessToken (req, res, next) {
        try {
            const { refreshToken } = req.body;
            const { accessToken } = await UserService.postAcessToken(refreshToken);

            res.status(200).json({ accessToken });
        } catch (error) { next(error) }
    };

    /**
     * Route: deleteLogout [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response message: this token ({token}) deleted.
     */
    static async deleteLogout (req, res, next) {
        try {
            const { refreshToken } = req.body;
            const { token } = await UserService.deleteLogout(refreshToken);

            res.status(204).json({ 'message': `This token (${token}) deleted.` });
        } catch (error) {
            Validator.throwError(500, 'Internall error', [ 'An internall error.' ], next);
        };
    };

    /**
     * Route: getUser [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response User information
     */
    static async getUser (req, res, next) {
        try {
            const { user } = await UserService.getUser(req.userEmail);

            res.status(200).json({ user });
        } catch (error) { next(error) };
    };
    
    /**
     * Route: patchUser [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response Updated user information
     */
    static async patchUser (req, res, next) {
        try {
            const { user } = UserService.patchUser(email, req.body);

            res.status(200).json({ user });
        } catch (error) { next(error) };
    };

    /**
     * Route: deleteUser [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response deleted user information
     */
    static async deleteUser (req, res, next) {
        try {
            const { user } = UserService.deleteUser(email);

            res.status(200).json({ user });
        } catch (error) { next(error) };
    };

    /**
     * Route: postConnectToGithub [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response githubAccessToken & githubRefreshToken
     */
    static async postConnectToGithub (req, res, next) {
        try {
            const { name } = req.params;
            const { githubAccessToken, githubRefreshToken } = req.body;
            
            await UserService.postConnectToGithub(req.userEmail, githubAccessToken, githubRefreshToken);
            res.status(200).json({ githubAccessToken, githubRefreshToken });
        } catch (error) { next(error) };
    };

    /**
     * Route: getPaymentRequest [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response Payment gateway url
     */
    static async getPaymentRequest (req, res, next) {
        try {
            const { amount, description, email, phone } = req.body;
            const { response } = await UserService.getPaymentRequest(amount, description, email, phone);
    
            if (response.status == 100) {
                res.status(100).json({ 'url': response.url });
            };
        } catch (error) { next(error) };
    };

    /**
     * Route: getPaymentVerification [Middleware]
     * @param {HttpRequest} req
     * @param {HttpResponse} res
     * @param {Call next middleware} next
     * @response 
     */
    static async getPaymentVerification (req, res, next) {
        try {
            const { id } = req.params;
            const authority = req.originalUrl.split('?')[1].split('&')[0].split('=')[1];
            const { response } = UserService.getPaymentVerification(id, authority);
            
            if (response.status == 101) {
                res.status(200).json({ 'message': 'The payment made.' });
            } else {
                res.status(200).json({ 'message': 'The payment did not make.' });
            }
        } catch (error) {
            console.log(error);
        };
    };
};

module.exports = UserController;
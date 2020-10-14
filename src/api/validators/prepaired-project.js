const Validator = require('../../utils/validator');
const ProjectModel = require('../../models/project');
const PlanModel = require('../../models/plan');
const UserModel = require('../../models/user');
const ImageModel = require('../../models/image');

class PrepairedProjectValidator {
    static async postProject (req, res, next) {
        try {
            const { name } = req.params;
            const { imageName, imageVersion, planName } = req.body;
            const errorMessages = [];
            
            if ((await UserModel.findByPk(req.userEmail)).balance <= 50) {
                errorMessages.push('balance is less than 50')
            } else {
                const image = await ImageModel.findOne({ where: { name: imageName }});

                !Validator.isDockerName(name) ? errorMessages.push('name is not valid') : '';
                if (!image) {
                    errorMessages.push('image does not exist');
                } else {
                    !image.versions.includes(imageVersion) ? errorMessages.push('image version is not valid.') : '';
                };
                (!Validator.isAlphanumeric(planName) || !await PlanModel.findByPk(planName)) ? errorMessages.push('plan name is not valid') : '';
            };

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) { next(error); };
    };

    static async getProject (req, res, next) {
        try {
            const { name } = req.params;
            const errorMessages = [];

            if (!Validator.isDockerName(name)) {
                errorMessages.push('name is not valid.')
            } else {
                !await ProjectModel.findByPk(name) ? errorMessages.push('name does not exist.') : '';
            };
            
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

    static async patchProject (req, res, next) {
        try {
            const { name } = req.params;
            const { planName, env, envStatus } = req.body;
            const errorMessages = [];
            
            if (!Validator.isDockerName(name)) {
                errorMessages.push('name is not valid.');
            } else if (await ProjectModel.findByPk(name)) {
                if (planName) {
                    (!Validator.isAlphanumeric(planName) || !await PlanModel.findByPk(planName)) ? errorMessages.push('planName is not valid.') : '';
                } else {
                    !envStatus.match(/(add)|(remove)/) ? errorMessages.push('env status is not valid.') : '';
                    env.forEach(e => {
                        !Validator.isAlphanumeric(e) ? errorMessages.push('env is not valid.') : '';
                    });
                };
            } else {
                errorMessages.push('name does not exist.');
            };

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

    static async deleteProject (req, res, next) {
        try {
            const { name } = req.params;
            const errorMessages = [];

            if (!Validator.isDockerName(name) || name === 'all') {
                errorMessages.push('name is not valid.');
            } else {
                !await ProjectModel.findByPk(name) ? errorMessages.push('name does not exist.') : '';
            };
            
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

    static async getCheckProjectName (req, res, next) {
        try {
            const { name } = req.body;
            const errorMessages = [];

            !Validator.isDockerName(name) ? errorMessages.push('name is not valid.') : '';
            
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

    static async postScaleProject (req, res, next) {
        try {
            const { name } = req.params;
            const errorMessages = [];

            if (!Validator.isDockerName(name) || name === 'all') {
                errorMessages.push('name is not valid.');
            } else {
                !await ProjectModel.findByPk(name) ? errorMessages.push('name does not exist.') : '';
            };
            
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

module.exports = PrepairedProjectValidator;
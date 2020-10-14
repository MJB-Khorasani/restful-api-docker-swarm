const Validator = require('../../utils/validator');
const ImageModel = require('../../models/image');
const PlanModel = require('../../models/plan');

class ImageValidator {
    static async postImage (req, res, next) {
        try {
            const { name } = req.params;
            const { picUrl, type, planName, versions } = req.body;
            const errorMessages = [];
            
            !Validator.isAlphanumeric(name) ? errorMessages.push('name is not valid') : '';
            !Validator.isUrl(picUrl) ? errorMessages.push('picUrl is not valid') : '';
            !(/prepaired|project|database/.test(type)) ? errorMessages.push('type is not valid.') : '';
            if (!Validator.isAlphanumeric(planName)) {
                errorMessages.push('plan name is not valid')
            } else if (!await PlanModel.findByPk(planName)) {
                errorMessages.push('plan name is not valid')
            };
            versions.forEach(v => {
                !Validator.isAlphanumeric(v) ? errorMessages.push('versions is not valid') : '';
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
        } catch (error) {
            next(error);
        };
    };

    static async getImage (req, res, next) {
        try {
            const { id } = req.params;
            const errorMessages = [];

            if (!Validator.isUuid(id)) {
                errorMessages.push('id is not UUID.');
            } else {
                !await ImageModel.findByPk(id) ? errorMessages.push('id does not exist.') : '';
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
        } catch (error) {
            next(error);
        };
    };

    static async patchImage (req, res, next) {
        try {
            const { id } = req.params;
            const { name, picUrl, type, planName } = req.body;
            const errorMessages = [];

            if (!Validator.isUuid(id)) {
                errorMessages.push('id is not UUID.');
            } else if (await ImageModel.findByPk(id)) {
                !Validator.isUrl(picUrl) ? errorMessages.push('pic url is not valid.') : '';
                !(/prepaired|project|database/.test(type)) ? errorMessages.push('type is not valid.') : '';
                (!Validator.isAlphanumeric(planName) || !(await PlanModel.findByPk(planName))) ? errorMessages.push('plan name is not valid.') : ''; 
                if (!Validator.isAlphanumeric(name)) {
                    errorMessages.push('name is not valid.');
                };
            } else {
                errorMessages.push('id does not exist.');
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
        } catch (error) {
            next(error);
        };
    };

    static async deleteImage (req, res, next) {
        try {
            const { id } = req.params;
            const errorMessages = [];

            !Validator.isUuid(id) ? errorMessages.push('id is not UUID.') : '';
            !await ImageModel.findByPk(id) ? errorMessages.push('id does not exist.') : '';

            if (errorMessages.length) {
                const error = new Error();
                error.statusCode = 422;
                error.message = error.message || 'Validation error';
                error.messages = errorMessages;
                next(error);
            } else {
                next();
            };
        } catch (error) {
            next(error);
        };
    };
};

module.exports = ImageValidator;
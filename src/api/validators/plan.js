const Validator = require('../../utils/validator');
const PlanModel = require('../../models/plan');

class PlanValidator {
    static async postPlan (req, res, next) {
        try {
            const { name } = req.params;
            const { available, price, volume, ram, cpu } = req.body;
            const errorMessages = new Array();

            if (!Validator.isAlphanumeric(name)) {
                errorMessages.push('name is not valid (string).');
            } else if (await PlanModel.findByPk(name)) {
                errorMessages.push('this plan name already exists.');
            };

            !Validator.isBool(available) ? errorMessages.push('available is not valid.') : '';
            !Validator.isNumeric(cpu) ? errorMessages.push('cpu is not valid.') : '';
            !Validator.isNumeric(price) ? errorMessages.push('price is not valid.') : '';
            !Validator.isNumeric(volume) ? errorMessages.push('volume is not valid.') : '';
            !Validator.isAlphanumeric(ram) ? errorMessages.push('ram is not valid.') : '';

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

    static async getPlan (req, res, next) {
        try {
            const { name } = req.params;
            const errorMessages = new Array();

            !Validator.isAlphanumeric(name) ? errorMessages.push('name is not valid (string).') : '';
            !await PlanModel.findByPk(name) ? errorMessages.push('name does not exist.') : '';
            
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

    static async patchPlan (req, res, next) {
        try {
            const { name } = req.params;
            const { name: newName, available, price, volume, ram, cpu } = req.body;
            const errorMessages = new Array();

            if (!Validator.isAlphanumeric(name)) {
                errorMessages.push('name is not valid (string).');
            } else if (await PlanModel.findByPk(name)) {
                !Validator.isBool(available) ? errorMessages.push('available is not valid.') : '';
                !Validator.isNumeric(volume) ? errorMessages.push('volume is not valid.') : '';
                !Validator.isNumeric(price) ? errorMessages.push('price is not valid.') : '';
                !Validator.isAlphanumeric(ram) ? errorMessages.push('ram is not valid.') : '';
                !Validator.isNumeric(cpu) ? errorMessages.push('cpu is not valid.') : '';

                if (!Validator.isAlphanumeric(newName)) {
                    errorMessages.push('New name is not valid (string).');
                } else if ((name !== newName) && await PlanModel.findByPk(newName)) {
                    errorMessages.push('New name already exists.');
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

    static async deletePlan (req, res, next) {
        try {
            const { name } = req.params;
            const errorMessages = new Array();

            !Validator.isAlphanumeric(name) ? errorMessages.push('name is not valid (string).') : '';
            !await PlanModel.findByPk(name) ? errorMessages.push('name does not exist.') : '';
            
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

module.exports = PlanValidator;
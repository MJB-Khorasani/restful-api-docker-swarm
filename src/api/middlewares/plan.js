const PlanService = require('../../services/plan');

class PlanController {
    static async postPlan (req, res, next) {
        try {
            const { name } = req.params;
            const { available, price, volume, ram, cpu, description } = req.body;
            const { plan } = await PlanService.postPlan({ name, available, price, volume, ram, cpu, description });

            res.status(201).json({ plan });
        } catch (error) { next(error) };
    };

    static async getPlans (req, res, next) {
        try {
            const { plans } = await PlanService.getPlans();

            res.status(200).json({ plans });
        } catch (error) { next(error) };
    };

    static async getPlan (req, res, next) {
        try {
            const { name } = req.params;
            const plan = await PlanService.getPlan(name);
            
            res.status(200).json({ plan });
        } catch (error) { next(error) };
    };

    static async patchPlan (req, res, next) {
        try {
            const { name } = req.params;
            const { name: newName, available, price, volume, ram, cpu } = req.body;
            const { plan } = await PlanService.patchPlan({
                name, newName, available, price, volume, ram, cpu
            });

            res.status(200).json({ plan });
        } catch (error) { next(error) };
    };

    static async deletePlan (req, res, next) {
        try {
            const { name } = req.params;
            const plan = await PlanService.deletePlan(planName);
            
            res.status(200).json({ plan });
        } catch (error) { next(error) };
    };
};

module.exports = PlanController;
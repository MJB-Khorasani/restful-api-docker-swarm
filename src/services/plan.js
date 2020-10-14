const PlanModel = require('../models/plan');

class PlanService {
    static async postPlan ({name, available, price, volume, ram, cpu, description}) {
        try {
            const plan = await PlanModel.create({ name, available, price, volume, ram, cpu, description });

            return { plan };
        } catch (error) { throw error };
    };

    static async getPlans () {
        try {
            const plans = await PlanModel.findAll();

            plans.forEach(p => {
                delete p.createdAt;
            });

            return { plans };
        } catch (error) { throw error };
    };

    static async getPlan (name) {
        try {
            const plan = await PlanModel.findByPk(name);

            return { plan };
        } catch (error) { throw error };
    };

    static async patchPlan ({ name, newName, available, price, volume, ram, cpu }) {
        try {
            const plan = await PlanModel.findByPk(name);

            await plan.update({ name: newName, available, price, volume, ram, cpu });

            return { plan };
        } catch (error) { throw error };
    };

    static async deletePlan (name) {
        try {
            const plan = await PlanModel.findByPk(name);
            
            await plan.destroy();
            
            return { plan };
        } catch (error) { throw error };
    };
};

module.exports = PlanService;
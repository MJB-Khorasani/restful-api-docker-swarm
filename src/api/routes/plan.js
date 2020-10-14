const express = require('express');

const PlanController = require('../middlewares/plan');
const Auth = require('../middlewares/auth');
const PlanValidator = require('../validators/plan');

const router = express.Router();

// READ all
router.route('/all')
    .get(PlanController.getPlans);

// CREATE READ, UPDATE, DELETE
router.route('/:name')
    .all(Auth.adminIsLoggedIn)
    .post(PlanValidator.postPlan, PlanController.postPlan)
    .get(PlanValidator.getPlan, PlanController.getPlan)
    .patch(PlanValidator.patchPlan, PlanController.patchPlan)
    .delete(PlanValidator.deletePlan, PlanController.deletePlan);

module.exports = router;
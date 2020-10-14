const express = require('express');

const Auth = require('../middlewares/auth');
const StaticProjectValidator = require('../validators/static-project');
const StaticProjectController = require('../middlewares/static-project');

const router = express.Router();

router.route('/images')
    .all(Auth.userIsLoggedIn)
    .get(StaticProjectController.getStaticImages);

router.route('/all')
    .all(Auth.userIsLoggedIn)
    .get(StaticProjectController.getProjects);

router.route('/:name')
    .all(Auth.userIsLoggedIn)
    .post(StaticProjectValidator.postProject, StaticProjectController.postProject)
    .get(StaticProjectValidator.getProject, StaticProjectController.getProject)
    .patch(StaticProjectValidator.patchProject, StaticProjectController.patchProject)
    .delete(StaticProjectValidator.deleteProject, StaticProjectController.deleteProject);

router.route('/:name/inspect')
    .all(Auth.userIsLoggedIn)
    .get(StaticProjectValidator.getProject, StaticProjectController.getInspect);

router.route('/:name/logs')
    .all(Auth.userIsLoggedIn)
    .get(StaticProjectValidator.getProject, StaticProjectController.getLogs);

router.route('/:name/stats')
    .all(Auth.userIsLoggedIn)
    .get(StaticProjectValidator.getProject, StaticProjectController.getStats);

// router.route('/:name/exec')
//     .all(Auth.userIsLoggedIn)
//     .get(StaticProjectValidator.getProject, StaticProjectController.getExec);

router.route('/:name/scale')
    .all(Auth.userIsLoggedIn)
    .post(StaticProjectValidator.postScaleProject, StaticProjectController.postScaleProject);

router.route('/:name/restart')
    .all(Auth.userIsLoggedIn)
    .post(StaticProjectValidator.getProject, StaticProjectController.postRestartProject);
module.exports = router;
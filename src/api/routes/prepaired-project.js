const express = require('express');

const Auth = require('../middlewares/auth');
const PrepairedProjectValidator = require('../validators/prepaired-project');
const PrepairedProjectController = require('../middlewares/prepaired-project');

const router = express.Router();

router.route('/images')
    .get(PrepairedProjectController.getPrepairedImages);

router.route('/all')
    .all(Auth.userIsLoggedIn)
    .get(PrepairedProjectController.getProjects);

router.route('/check-project-name')
    .all(Auth.userIsLoggedIn)
    .get(PrepairedProjectValidator.getCheckProjectName, PrepairedProjectController.getCheckProjectName);

router.route('/:name')
    .all(Auth.userIsLoggedIn)
    .post(PrepairedProjectValidator.postProject, PrepairedProjectController.postProject)
    .get(PrepairedProjectValidator.getProject, PrepairedProjectController.getProject)
    .patch(PrepairedProjectValidator.patchProject, PrepairedProjectController.patchProject)
    .delete(PrepairedProjectValidator.deleteProject, PrepairedProjectController.deleteProject);

router.route('/:name/inspect')
    .all(Auth.userIsLoggedIn)
    .get(PrepairedProjectValidator.getProject, PrepairedProjectController.getInspect);

router.route('/:name/logs')
    .all(Auth.userIsLoggedIn)
    .get(PrepairedProjectValidator.getProject, PrepairedProjectController.getLogs);

router.route('/:name/stats')
    .all(Auth.userIsLoggedIn)
    .get(PrepairedProjectValidator.getProject, PrepairedProjectController.getStats);

// router.route('/:name/exec')
//     .all(Auth.userIsLoggedIn)
//     .get(PrepairedProjectValidator.getProject, PrepairedProjectController.getExec);

router.route('/:name/scale')
    .all(Auth.userIsLoggedIn)
    .post(PrepairedProjectValidator.postScaleProject, PrepairedProjectController.postScaleProject);

router.route('/:name/restart')
    .all(Auth.userIsLoggedIn)
    .post(PrepairedProjectValidator.getProject, PrepairedProjectController.postRestartProject);

module.exports = router;
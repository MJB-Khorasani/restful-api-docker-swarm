const StaticProjectService = require('../../services/static-project');

class StaticProjectController {
    static async getStaticImages (req, res, next) {
        try {
            const { images } = await StaticProjectService.getStaticImages();

            res.status(200).json({ images });
        } catch (error) { next(error) };
    };

    static async getProjects (req, res, next) {
        try {
            const { projects } = await StaticProjectService.getStaticProjects(req.userEmail);

            res.status(200).json({ projects });
        } catch (error) { next(error) };
    };

    static async postProject (req, res, next) {
        try {
            const { name } = req.params;
            const { image, planName } = req.body;
            const { project } = await StaticProjectService.postStaticProject({ name, image, planName, userEmail: req.userEmail });
 
            res.status(201).json({
                project,
                'message': `Your project is up on http://${name}.ar.af`
            });
        } catch (error) { next(error) };
    };

    static async getProject (req, res, next) {
        try {
            const { name } = req.params;
            const { project, plan } = await StaticProjectService.getStaticProject(name);

            res.status(200).json({ project, plan, projectService });
        } catch (error) { next(error) };
    };

    static async patchProject (req, res, next) {
        try {
            const { name } = req.params;
            const { planName, env, envStatus } = req.body;
            let result;

            if (planName) {
                result = await StaticProjectService.patchStaticProjectResource(name, planName);
            } else if (env) {
                result = await StaticProjectService.patchStaticProjectEnv(name, env, envStatus);
            };
            res.status(200).json({ ...result });
        } catch (error) { next(error) };
    };

    static async deleteProject (req, res, next) {
        try {
            const { name } = req.params;
            const { result } = await StaticProjectService.deleteStaticProject(name);

            res.status(200).json({
                result,
                'message': 'project and its database deleted.'
            });
        } catch (error) { next(error) };
    };

    static async getInspect (req, res, next) {
        try {
            const { name } = req.params;
            const { inspect } = await StaticProjectService.getInspect(name);

            res.status(200).json({ inspect });
        } catch (error) { next(error) };
    };

    static async getLogs (req, res, next) {
        try {
            const { name } = req.params;
            const logs = await StaticProjectService.getLogs(name);

            logs.pipe(res);
        } catch (error) { next(error) };
    };

    static async getStats (req, res, next) {
        try {
            const { name } = req.params;
            const stats = await PrepairedProjectService.getStats(name);

            stats.pipe(res);
        } catch (error) { next(error) };
    };

    static async getExec (req, res, next) {
        try {
            const { name } = req.params;
            const exec = await PrepairedProjectService.getExec(name);

            logs.pipe(res);
        } catch (error) {
            next(error);
        };
    };

    static async postScaleProject (req, res, next) {
        try {
            const { name } = req.params;
            const { projectScale, databaseScale } = req.body;
            const { project, database } = await PrepairedProjectService.postScaleProject(name, projectScale, databaseScale);

            res.status(200).json({ project, database });
        } catch (error) {
            next(error);
        };
    };

    static async postRestartProject (req, res, next) {
        try {
            const { name } = req.params;
            const { databaseRestart } = req.body;
            const { result } = await PrepairedProjectService.postRestartProject(name, databaseRestart);

            res.status(200).json({
                result,
                'message': 'project restarted.'
            });
        } catch (error) {
            next(error);
        };
    };
};

module.exports = StaticProjectController;
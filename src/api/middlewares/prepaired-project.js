const PrepairedProjectService = require('../../services/prepaired-project');

class PrepairedProjectController {
    static async getPrepairedImages (req, res, next) {
        try {
            const { images } = await PrepairedProjectService.getPrepairedImages();

            res.status(200).json({ images });
        } catch (error) { next(error) };
    };

    static async postProject (req, res, next) {
        try {
            const { name } = req.params;
            const { imageName, imageVersion, planName } = req.body;
            const { project, db, domain } = await PrepairedProjectService.postPrepairedProject({ name, imageName, imageVersion, planName, userEmail: req.userEmail });
 
            res.status(201).json({ project, db, domain });
        } catch (error) { next(error) };
    };

    static async getProject (req, res, next) {
        try {
            const { name } = req.params;
            const { project, database, plan } = await PrepairedProjectService.getPrepairedProject(name);

            res.status(200).json({ project, database, plan });
        } catch (error) { next(error) };
    };

    static async getProjects (req, res, next) {
        try {
            const { projects, databases } = await PrepairedProjectService.getPrepairedProjects(req.userEmail);

            res.status(200).json({ projects, databases });
        } catch (error) { next(error) };
    };

    static async patchProject (req, res, next) {
        try {
            const { name } = req.params;
            const { planName, env, envStatus } = req.body;
            let result;

            if (planName) {
                result = await PrepairedProjectService.patchPrepairedProjectResource(name, planName);
            } else if (env) {
                result = await PrepairedProjectService.patchPrepairedProjectEnv(name, env, envStatus);
            };
            res.status(200).json({ ...result });
        } catch (error) { next(error) };
    };

    static async deleteProject (req, res, next) {
        try {
            const { name } = req.params;
            const { result } = await PrepairedProjectService.deletePrepairedProject(name);

            res.status(200).json({
                result,
                'message': 'project and its database deleted.'
            });
        } catch (error) { next(error) };
    };

    static async getCheckProjectName (req, res, next) {
        try {
            const { name } = req.body;
            const { project } = await PrepairedProjectService.getCheckProjectName(name);

            if (project) {
                const error = new Error('Duplicated name');
                error.statusCode = 422;
                error.errorMessages = [ 'Project name already exists.' ]; 
                throw error;
            } else {
                res.status(200).json({ 'message': 'Project name does not taken' });
            };
        } catch (error) { next(error) };
    };
    
    static async getInspect (req, res, next) {
        try {
            const { name } = req.params;
            const { projectInspect, databaseInspect } = await PrepairedProjectService.getInspect(name);

            res.status(200).json({ projectInspect, databaseInspect });
        } catch (error) { next(error) };
    };

    static async getLogs (req, res, next) {
        try {
            const { name } = req.params;
            const logs = await PrepairedProjectService.getLogs(name);

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
        } catch (error) { next(error) };
    };

    static async postScaleProject (req, res, next) {
        try {
            const { name } = req.params;
            const { projectScale, databaseScale } = req.body;
            const { project, database } = await PrepairedProjectService.postScaleProject(name, projectScale, databaseScale);

            res.status(200).json({ project, database });
        } catch (error) { next(error) };
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
        } catch (error) { next(error) };
    };
};

module.exports = PrepairedProjectController;
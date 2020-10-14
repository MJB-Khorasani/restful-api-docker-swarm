const PlanModel = require('../models/plan');
const ImageModel = require('../models/image');
const ProjectModel = require('../models/project');
const DockerStackService = require('./docker-stack');
const DockerVolumeService = require('./docker-volume');
const DockerNetworkService = require('./docker-network');
const DockerServiceService = require('./docker-service');
const DockerContainerService = require('./docker-container');


class StaticProjectService {
    static async getStaticImages () {
        try {
            const images = ImageModel.findAll({
                where: {
                    type: 'static'
                }
            });

            for(let i = images.length; i >= 0; i--) {
                delete images[i].type, images[i].createdAt;
            };

            return { images };
        } catch (error) { throw error };
    };

    static async getStaticProjects (userEmail) {
        try {
            const projects = await ProjectModel.findAll({ 
                where: { 
                    userEmail
                } 
            });

            for (let p = projects.length; p >= 0; p--) {
                if (!projects[p].image.match(/(react)|(vue)|(html)|(angular)/)) {
                    delete projects[p];
                };
            };

            return { projects };
        } catch (error) { throw error };
    };

    static async postStaticProject ({ name, image, planName, userEmail }) {
        try {
            const project = await ProjectModel.create({ name, image, imageVersion, scale: 1, userEmail, planName, url: 'http://localhost.com' });
            
            return { project };
            // const plan = await PlanModel.findByPk(planName);
            // await DockerVolumeService.create(`${name}_${image}`, plan.volume);
            // await DockerStackService.deployStaticProjects(name, image, plan);
            // cloudflare, domain registration
        } catch (error) {
            DockerVolumeService.prune();
            DockerNetworkService.prune();
            throw error;
        };
    };

    static async getStaticProject (name) {
        try {
            const project = await ProjectModel.findByPk(name);
            const plan = await PlanModel.findByPk(project.planName);

            return { project, plan };
        } catch (error) { throw error };
    };

    static async patchStaticProjectResource (name, planName) {
        try {
            const project = await ProjectModel.findByPk(name);
            const plan = await PlanModel.findByPk(planName);
            const { result: projectResult } = await DockerServiceService.updateResource(`${name}_${project.image}`, plan);
            
            project.planName = planName;
            await project.save();

            if (projectResult === 0 && databaseResult === 0) {
                return { 'result': 0 };
            }
        } catch (error) { throw error };
    };

    static async patchStaticProjectEnv (name, env, envStatus) {
        try {
            const project = await ProjectModel.findByPk(name);

            if (envStatus === 'add') {
                const { result } = await DockerServiceService.addEnv(`${name}_${project.image}`, env);
                return { result };
            } else {
                const { result } = await DockerServiceService.removeEnv(`${name}_${project.image}`, env);
                return { result };
            };
        } catch (error) { throw error };
    };

    static async deleteStaticProject (name) {
        try {
            const project = await ProjectModel.findByPk(name);
            const { result } = await DockerStackService.removeStack(name);

            await project.destroy();
            
            return { result };
        } catch (error) { throw error };
    };

    static async getInspect (name) {
        try {
            const { inspect } = await DockerServiceService.inspect(`${name}_${project.image}`);
            // delete unused fields from project, projectService
            return { inspect };
        } catch (error) { throw error };
    };

    static async getLogs (name) {
        try {
            const project = await ProjectModel.findByPk(name);

            return DockerServiceService.logs(`${name}_${project.image}`);
        } catch (error) { throw error };
    };

    static async getStats (name) {
        try {
            const project = await ProjectModel.findByPk(name);
            const containerName = await DockerContainerService.findContainerName(`${name}_${project.image}`);
            
            return DockerContainerService.stats(containerName);
        } catch (error) { throw error };
    };

    static async getExec (name) {
        try {
            const project = await ProjectModel.findByPk(name);
            const containerName = await DockerContainerService.findContainerName(`${name}_${project.image}`);
            
            return DockerContainerService.exec(containerName);
        } catch (error) { throw error };
    };

    static async postScaleProject (name, projectScale, databaseScale) {
        try {
            const project = await ProjectModel.findByPk(name);
            const database = await DatabaseModel.findByPk(name);
            
            project.scale = projectScale;
            database.scale = databaseScale;
            await DockerServiceService.scale(`${name}_${project.image}`, projectScale);
            await DockerServiceService.scale(`${name}_db`, databaseScale);

            return { project, database };
        } catch (error) { throw error };
    };

    static async postRestartProject (name, databaseRestart) {
        try {
            const projectContainerName = await DockerContainerService.findContainerName(`${name}_${project.image}`);
            // I should add container name below
            const { result } = await DockerContainerService.restart();

            return { result };
        } catch (error) { throw error };
    };
};

module.exports = StaticProjectService;
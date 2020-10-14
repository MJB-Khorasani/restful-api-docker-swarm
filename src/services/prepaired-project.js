const Cddnss = require('cloudflare-ddns-sync').default;

const cddnss = new Cddnss('leader.kali1997@gmail.com', 'abc51cdc9a78af2451d9bb87ce0758c9aad8f');

const PlanModel = require('../models/plan');
const ImageModel = require('../models/image');
const ProjectModel = require('../models/project');
const DatabaseModel = require('../models/database');
const DockerStackService = require('./docker-stack');
const DockerVolumeService = require('./docker-volume');
const DockerNetworkService = require('./docker-network');
const DockerServiceService = require('./docker-service');
const DockerContainerService = require('./docker-container');

class PrepairedProjectService {
    static async getPrepairedImages () {
        try {
            const images = await ImageModel.findAll({ 
                where: {
                    type: 'prepaired'
                }
            });

            images.forEach(image => {
                delete image.type, image.createdAt;
            });

            return { images };
        } catch (error) { throw error };
    };

    static async postPrepairedProject ({ name, imageName, imageVersion, planName, userEmail }) {
        try {
            const plan = await PlanModel.findByPk(planName);

            await DockerVolumeService.create(`${name}_${imageName}`, plan.volume);
            await DockerVolumeService.create(`${name}_db`, plan.volume);
            await DockerStackService.deployPrepairedProjects(name, imageName, plan);
            const project = await ProjectModel.create({ name, image: imageName, imageVersion, scale: 1, userEmail, planName, url: 'http://localhost.com' });
            const db = await DatabaseModel.create({ name, image: 'mysql', imageVersion: '5.7', scale: 1, userEmail, planName });
            const domain = await cddnss.syncRecord({
                name: `${name}arianacloud.ir`,
                type: 'A',
                proxied: true,
                ttl: 1,
                priority: 0,
                content: '1.2.3.4'
            });

            return { project, db, domain };
        } catch (error) {
            DockerVolumeService.prune();
            DockerNetworkService.prune();
            throw error;
        };
    };

    static async getPrepairedProject (name) {
        try {
            const project = await ProjectModel.findByPk(name);
            const database = await DatabaseModel.findByPk(name);
            const plan = await PlanModel.findByPk(project.planName);

            return { project, database, plan };
        } catch (error) { throw error };
    };

    static async getPrepairedProjects (userEmail) {
        try {
            const projects = await ProjectModel.findAll({ 
                where: { 
                    userEmail
                } 
            });
            let databases;

            projects.forEach(async (p, i) => {
                if (p.image.match(/(wordpress)|(drupal)|(ghost)|(joomla)/)) {
                    databases += await DatabaseModel.findByPk(p.name);
                } else {
                    delete projects[i];
                };
            });

            return { projects, databases };
        } catch (error) { throw error };
    };

    static async patchPrepairedProjectResource (name, planName) {
        try {
            const project = await ProjectModel.findByPk(name);
            const plan = await PlanModel.findByPk(planName);
            const { result: projectResult } = await DockerServiceService.updateResource(`${name}_${project.image}`, plan);
            const { result: databaseResult } = await DockerServiceService.updateResource(`${name}_db`, plan);
            
            project.planName = planName;
            await project.save();

            if (projectResult === 0 && databaseResult === 0) {
                return { 'result': 0 };
            }
        } catch (error) { throw error };
    };

    static async patchPrepairedProjectEnv (name, env, envStatus) {
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

    static async deletePrepairedProject (name) {
        try {
            const project = await ProjectModel.findByPk(name);
            const database = await DatabaseModel.findByPk(name);
            const { result } = await DockerStackService.removeStack(name);
            const domain = await cddnss.removeRecord(`${name}.arianaclou.ir`);

            await project.destroy();
            await database.destroy();
            
            return { result };
        } catch (error) { throw error };
    };

    static async getInspect (name) {
        try {
            const project = await ProjectModel.findByPk(name);
            const { inspect :projectInspect } = await DockerServiceService.inspect(`${name}_${project.image}`);
            const { inspect :databaseInspect } = await DockerServiceService.inspect(`${name}_db`);
            
            // delete unused fields from project, database, projectService, databaseService
            return { projectInspect, databaseInspect };
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

    static async getCheckProjectName (name) {
        try {
            const project = await ProjectModel.findByPk(name);

            return { project };
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

            if (databaseRestart === true) {
                const databaseContainerName = await DockerContainerService.findContainerName(`${name}_db`);
                await DockerContainerService.restart(containerName1);
            };

            return { result };
        } catch (error) { throw error };
    };
};

module.exports = PrepairedProjectService;
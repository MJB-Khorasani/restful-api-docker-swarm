const Spawn = require('../utils/spawn');

class DockerContainerService {
    static async findContainerName (serviceName) {
        const containerName = await Spawn.execute(`docker container ls --format "{{.Names}}" | grep ${serviceName}`);

        return containerName;
    };

    static async stats (name) {
        try {
            return Spawn.stream(`docker stats ${name} --format "{{json .}}"`, 'stdout');
        } catch (error) {
            throw error;
        };
    };

    static async exec (name) {
        try {
            return Spawn.stream(`docker exec -it ${name} bash`);
        } catch (error) {
            throw error;
        };
    };

    static async restart (name) {
        try {
            await Spawn.execute(`docker container restart ${name}`);
            const result = await Spawn.execute('echo $?');

            return { result: Number(result.split('\\')[0]) };
        } catch (error) {
            throw error;            
        };
    };
};

module.exports = DockerContainerService;
const Spawn = require('../utils/spawn');

class DockerServiceService {
    static async inspect (name) {
        try {
            const inspect = await Spawn.execute(`docker service inspect ${name} --format "{{json .}}"`);
            
            return { 'inspect': JSON.parse(inspect) };
        } catch (error) {
            throw error;
        };
    };

    static async updateResource (name, plan) {
        try {
            await Spawn.execute(`docker service update --limit-memory=${plan.ram} --limit-cpu=${plan.cpu} ${name}`);
            const result = await Spawn.execute('echo $?');

            return { result: Number(result.split('\\')[0]) };
        } catch (error) {
            throw error;
        };
    };

    static async addEnv (name, env) {
        try {
            let cmd = 'docker service update ';

            env.forEach(e => {
                cmd += `--env-add ${e} `;
            });
            cmd += `${name}`;

            await Spawn.execute(cmd);
            const result = await Spawn.execute('echo $?');

            return { result: Number(result.split('\\')[0]) };
        } catch (error) {
            throw error;
        };
    };

    static async removeEnv (name, env) {
        try {
            let cmd = 'docker service update ';

            env.forEach(e => {
                cmd += `--env-rm ${e} `;
            });
            cmd += `${name}`;

            await Spawn.execute(cmd);
            const result = await Spawn.execute('echo $?');

            return { result: Number(result.split('\\')[0]) };
        } catch (error) {
            throw error;
        };
    };

    static async logs (name) {
        try {
            return Spawn.stream(`docker service logs ${name} --follow`, 'stderr');
        } catch (error) {
            throw error;
        };
    };

    static async remove (name) {
        try {
            await Spawn.execute(`docker service rm ${name}`);
            const result = await Spawn('echo $?');

            return { result: Number(result.split('\\')[0]) };
        } catch (error) {
            throw error;
        };
    };

    static async scale (name, scale) {
        try {
            await Spawn.execute(`docker service scale ${name}=${scale}`);
            const result = await Spawn('echo $?');

            return { result: Number(result.split('\\')[0]) };
        } catch (error) {
            throw error;
        };
    };
};

module.exports = DockerServiceService;
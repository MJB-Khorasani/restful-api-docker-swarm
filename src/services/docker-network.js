const Spawn = require('../utils/spawn');

class DockerNetworkService {
    static async prune () {
        try {
            const volume = await Spawn.execute(`docker network prune -f`);

            return { volume };
        } catch (error) {
            throw error;
        };
    };
};

module.exports = DockerNetworkService;
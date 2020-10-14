const Spawn = require('../utils/spawn');

class DockerVolumeService {
    static async create (name, size) {
        try {
            const volume = await Spawn.execute(`docker volume create ${name}`);

            return { volume };
        } catch (error) {
            throw error;
        };
    };

    static async prune () {
        try {
            const volume = await Spawn.execute(`docker volume prune -f`);

            return { volume };
        } catch (error) {
            throw error;
        };
    };
};

module.exports = DockerVolumeService;
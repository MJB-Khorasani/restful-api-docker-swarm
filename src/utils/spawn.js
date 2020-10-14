const { spawn } = require('child_process');

class Spawn {
    static async execute (command) {
        try {
            const s = spawn(command, { shell: true });
            let error = '', result = '';

            return new Promise((resolve, reject) => {
                s.stderr.on('data', chunk => {
                    error += chunk.toString()
                });
                s.stdout.on('data', chunk => {
                    result += chunk.toString();
                });
                s.on('close', code => {
                    if (code === 0) {
                        resolve(result);
                    } else {
                        reject(error);
                    };
                });
            });
        } catch (error) {
            throw error;
        };
    };

    static stream (command, whichStd) {
        try {
            const s = spawn(command, { shell: true });

            if (whichStd === 'stderr') {
                return s.stderr;
            } else {
                return s.stdout;
            };
        } catch (error) {
            throw error;
        };
    }
};

module.exports = Spawn;
const path = require('path');
const crypto = require('crypto');
const { promises: fsPromises } = require('fs');

const PortScanner = require('../utils/port-scanner');
const Spawn = require('../utils/spawn');

class DockerStackService {
    static async deployPrepairedProjects (name, imageName, plan) {
        try {
            const ymlPath = ymlFilePath(imageName);
            const newymlPath = path.join(__dirname, 'docker-compose.yml');
            let yaml = await fsPromises.readFile(ymlPath);
            
            yaml = yaml.toString();
            yaml = yaml.replace(/serviceName/g, name);
            yaml = yaml.replace(/mysqlPublishedPort/g, await PortScanner.unUsePort(~~(Math.random() * (35000 - 33000 + 1)) + 33000, 35000));
            yaml = yaml.replace(/publishedPort/g, await PortScanner.unUsePort(~~(Math.random() * (11000 - 8000 + 1)) + 8000, 11000));
            yaml = yaml.replace(/dbRootPassword/g, crypto.randomBytes(10).toString('hex'));
            yaml = yaml.replace(/dbPassword/g, crypto.randomBytes(10).toString('hex'));
            yaml = yaml.replace(/"cpu"/g, `'${plan.cpu}'`);
            yaml = yaml.replace(/ram/g, plan.ram);

            await fsPromises.writeFile(newymlPath, yaml);

            const project = await Spawn.execute(`docker stack deploy -c ${newymlPath} ${name}`);

            return { project };
        } catch (error) { throw error };
    };

    static async deployStaticProjects (name, plan) {
        try {
            const ymlPath = ymlFilePath('static');
            const newymlPath = path.join(__dirname, 'docker-compose.yml');
            let yaml = await fsPromises.readFile(ymlPath);

            yaml = yaml.toString();
            yaml = yaml.replace('publishedPort', await PortScanner.unUsePort(~~(Math.random() * (11000 - 8000 + 1)) + 8000, 11000));
            yaml = yaml.replace(/"cpu"/g, `'${plan.cpu}'`);
            yaml = yaml.replace(/ram/g, plan.ram);

            await fsPromises.writeFile(newymlPath, yaml);

            const service = await Spawn.execute(`docker stack deploy -c ${newymlPath} ${name}`);

            return { service };
        } catch (error) { throw error };
    };

    static async removeStack (name) {
        try {
            await Spawn.execute(`docker stack rm ${name}`);
            const result = await Spawn.execute('echo $?');

            return { result: Number(result.split('\\')[0]) };
        } catch (error) { throw error };
    };
};

module.exports = DockerStackService;

function ymlFilePath (imageName) {
    if (imageName === 'wordpress') {
        return path.join(__dirname, '..', '..', 'yamls', 'wordpress.yml');
    } else if (imageName === 'drupal') {
        return path.join(__dirname, '..', '..', 'yamls', 'drupal.yml');
    } else if (imageName === 'joomla') {
        return path.join(__dirname, '..', '..', 'yamls', 'joomla.yml');
    } else if (imageName === 'ghost') {
        return path.join(__dirname, '..', '..', 'yamls', 'ghost.yml');
    } else if (imageName === 'static') {
        return path.join(__dirname, '..', '..', 'yamls', 'static.yml');
    };
};

// function serviceImageOptions (serviceImage) {
//     if (serviceImage.includes('postgres')) {
//         Target = '/var/lib/postgres/data';
//         TargetPort = 5432;
//         Env = [ `POSTGRES_ROOT_PASSWORD=${crypto.randomBytes(10).toString('hex')}` ];
//         Command = [ '/bin/bash' ];
//     } else if (serviceImage.includes('mssql')) {
//         Target = '/opt/mssql-tools/bin/sqlcmd';
//         TargetPort = null;
//         Env = [ `MSSQL_ROOT_PASSWORD=${crypto.randomBytes(10).toString('hex')}` ];
//         Command = [ '/bin/bash' ];
//     } else if(serviceImage.includes('mongodb')) {
//         Target = '/data/db';
//         TargetPort = 27017;
//         Env = [ `MONGODB_ROOT_PASSWORD=${crypto.randomBytes(10).toString('hex')}` ];
//         Command = [ '/bin/bash' ];
//     } else if (serviceImage.includes('nginx')) {
//         Target = '/usr/share/nginx/html/';
//         TargetPort = 80;
//         Env = [ 'NGINX_HOST', 'NGINX_PORT' ];
//         Args = [ 'google.com', '80' ];
//         Command = [ "nginx-g 'daemon off;'" ];
//     };

//     return { Target, PublishedPort, TargetPort, Env, Command };
// };
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    port: process.env.PORT,
    host: process.env.HOST,
    dockerApiHostname: process.env.DOCKER_API_HOSTNAME,
    dockerApiPort: process.env.DOCKER_API_PORT,
    dockerUser: process.env.DOCKER_USER,
    dockerPassword: process.env.DOCKER_PASSWORD,
    dbHost: process.env.PGHOST,
    dbPort: process.env.PGPORT,
    dbName: process.env.PGDATABASE, 
    dbUser: process.env.PGUSER, 
    dbPassword: process.env.PGPASSWORD,
    jwtAccessKeyLife: process.env.ACCESS_TOKEN_LIFETIME,
    jwtRefreshKeyLife: process.env.REFRESH_TOKEN_LIFETIME,
    jwtAccessKey: process.env.ACCESS_TOKEN,
    jwtRefreshKey: process.env.REFRESH_TOKEN,
    gmailUsername: process.env.GMAIL_USERNAME,
    gmailPassword: process.env.GMAIL_PASSWORD,
    uiHost: process.env.UI_HOST,
    bcryptjsSalt: process.env.BCRYPTJS_SALT
};
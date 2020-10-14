const path = require('path');

const express = require("express");
const cors = require('cors');

const { port, host } = require("./config");
const sequelize = require('./models/index');
const { errorOccurred, pageNotFound } = require('./api/middlewares/error');
const userRoutes = require('./api/routes/user');
const adminRoutes = require('./api/routes/admin');
const planRoutes = require('./api/routes/plan');
const imageRoutes = require('./api/routes/image');
const prepairedProjectRoutes = require('./api/routes/prepaired-project');
const ticketRoutes = require('./api/routes/ticket');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'ticket-pictures')));
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: [ 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE' ],
    allowedHeaders: [ 
        'accept', 
        'origin', 
        'content-type', 
        'Authorization', 
        'x-pingother', 
        'x-requested-with', 
        'x-http-method-override', 
        'if-match', 
        'if-none-match', 
        'if-modified-since', 
        'if-unmodified-since' 
    ], 
    exposedHeaders: [
        'tag', 
        'link',
        'Content-Range', 
        'X-OAuth-Scopes', 
        'X-Content-Range',
        'X-RateLimit-Limit', 
        'X-RateLimit-Reset', 
        'X-RateLimit-Remaining', 
        'X-Accepted-OAuth-Scopes' 
    ], 
    credentials: true
}));

app.use('/v1/users', userRoutes);
app.use('/v1/admins', adminRoutes);
app.use('/v1/plans', planRoutes);
app.use('/v1/images', imageRoutes);
app.use('/v1/projects/prepaired', prepairedProjectRoutes);
app.use('/v1/tickets', ticketRoutes);

app.use(pageNotFound);
app.use(errorOccurred);

sequelize.sync().then(() => {
    app.listen(port, host, () => console.log(`server is started at ${new Date()} on http://${host}:${port}`));
    require('./jobs');
}).catch(error => {
    throw error;
});

module.exports = app;
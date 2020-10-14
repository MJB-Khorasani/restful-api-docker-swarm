const Sequelize = require('sequelize');
const { dbName, dbUser, dbPassword, dbHost, dbPort } = require('../config');

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    dialect: 'postgres',
    host: dbHost,
    port: dbPort,
    pool: {
        max: 9,
        min: 0,
        idle: 10000
    },
    logging: false
});

module.exports = {
    sequelize,
    sync
};

async function sync () {
    try {
        require('./option');
        const UserModel = require('./user');
        const PlanModel = require('./plan');
        const AdminModel = require('./admin');
        const TokenModel = require('./token');
        const ImageModel = require('./image');
        const TicketModel = require('./ticket');
        const ProjectModel = require('./project');
        const DatabaseModel = require('./database');
        const UserPaymentModel = require('./user-payment');
        const TicketMessageModel = require('./ticket-message');
        const UserTransactionModel = require('./user-transaction');

        // user 1:N token
        UserModel.hasMany(TokenModel);
        TokenModel.belongsTo(UserModel, { constraints: true, onDelete: 'NO ACTION' });
        // plan 1:N image
        PlanModel.hasMany(ImageModel);
        ImageModel.belongsTo(PlanModel, { constraints: true });
        // user 1:N database
        UserModel.hasMany(DatabaseModel);
        DatabaseModel.belongsTo(UserModel, { constraints: true, onDelete: 'CASCADE' });
        // user 1:N project
        UserModel.hasMany(ProjectModel);
        ProjectModel.belongsTo(UserModel, { constraints: true, onDelete: 'CASCADE' });
        // plan 1:N database
        PlanModel.hasMany(DatabaseModel);
        DatabaseModel.belongsTo(PlanModel, { constraints: true, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
        // plan 1:N project
        PlanModel.hasMany(ProjectModel);
        ProjectModel.belongsTo(PlanModel, { constraints: true });
        // users 1:N tickets
        UserModel.hasMany(TicketModel);
        TicketModel.belongsTo(UserModel, { constraints: true, onDelete: 'CASCADE' });
        // tickets 1:N messages
        TicketModel.hasMany(TicketMessageModel);
        TicketMessageModel.belongsTo(TicketModel, { constraints: true, onDelete: 'CASCADE' });
        // admins 1:N messages
        AdminModel.hasMany(TicketMessageModel);
        TicketMessageModel.belongsTo(AdminModel, { constraints: true, onDelete: 'NO ACTION' });
        // users 1:N userPayments
        UserModel.hasMany(UserPaymentModel);
        UserPaymentModel.belongsTo(UserModel, { constraints: true, onDelete: 'NO ACTION' });
        // users 1:N userTransactions
        UserModel.hasMany(UserTransactionModel);
        UserTransactionModel.belongsTo(UserModel, { constraints: true, onDelete: 'NO ACTION' });
        
        await sequelize.sync();
        // await sequelize.sync({ force: true });
        return true;
    } catch (error) {
        throw error;
    };
};
const cron = require('node-cron');
const { Op } = require('sequelize');
const Cddnss = require('cloudflare-ddns-sync').default;
 
const cddnss = new Cddnss('leader.kali1997@gmail.com', 'abc51cdc9a78af2451d9bb87ce0758c9aad8f');


const UserModel = require('./models/user');
const PlanModel = require('./models/plan');
const TokenModel = require('./models/token');
const ProjectModel = require('./models/project');
const DatabaseModel = require('./models/database');
const UserTransactionModel = require('./models/user-transaction');

const EmailService = require('./services/email');
const DockerVolumeService = require('./services/docker-volume');
const DockerServiceService = require('./services/docker-service');
const DockerNetworkService = require('./services/docker-network');

// cron.schedule("*/10 * * * *", async () => {
//     const users = await UserModel.findAll();

//     users.forEach(async user => {
//         const plans = await PlanModel.findAll();
//         const onProjects = await ProjectModel.findAll({ where: { scale: 1, userEmail: user.email }});
//         const offProjects = await ProjectModel.findAll({ where: { scale: 0, userEmail: user.email }});
//         const onDatabases = await DatabaseModel.findAll({ where: { scale: 1, userEmail: user.email }});
//         const offDatabases = await DatabaseModel.findAll({ where: { scale: 0, userEmail: user.email }});

//         onProjects.forEach(async p => {
//             plans.forEach(plan => {
//                 p.planName === plan.name ? user.balance -= plan.price : '';
//             });
            
//             if (user.balance <= 0) {
//                 await DockerServiceService.scale(p.name, 0);
//                 p.freeze = true;
//                 p.scale = 0;
//             };
            
//             p.save();
//         });

//         onDatabases.forEach(async d => {
//             plans.forEach(plan => {
//                 d.planName === plan.name ? user.balance -= plan.price : '';
//             });
            
//             if (user.balance <= 0) {
//                 await DockerServiceService.scale(d.name, 0);
//                 d.freeze = true;
//                 d.scale = 0;
//             };
            
//             d.save();
//         });
        
//         offProjects.forEach(async p => {
//             plans.forEach(plan => {
//                 p.planName === plan.name ? user.balance -= plan.price : '';
//             });
            
//             if (user.balance <= 0 && (new Date(p.updatedAt).getDate() - new Date().getDate() === -7)) {
//                 DockerServiceService.remove(`${p.name}_${p.image}`);
//                 DockerVolumeService.prune();
//                 DockerNetworkService.prune();
//                 await cddnss.removeRecord(`${name}.arianacloud.ir`);
//                 await p.destroy();
//             } else if (user.balance >= 0 && p.freeze === true && p.scale === 0) {
//                 DockerServiceService.scale(p.name, 1);
//                 p.freeze = false;
//                 p.scale = 1;
//             };

//             p.save();
//         });
        
//         offDatabases.forEach(async d => {
//             plans.forEach(plan => {
//                 d.planName === plan.name ? user.balance -= plan.price : '';
//             });

//             if (user.balance <= 0 && (new Date(d.updatedAt).getDate() - new Date().getDate() === -7)) {
//                 DockerServiceService.remove(`${d.name}_db`);
//                 await d.destroy();
//             } else if (user.balance >= 0 && d.freeze === true && d.scale === 0) {
//                 await DockerServiceService.scale(d.name, 1);
//                 d.freeze = false;
//                 d.scale = 1;
//             };

//             d.save();
//         });

//         user.save();
        
//         if (user.balance <= 100) {
//             EmailService.sendMail({ 
//                 to: user.email,
//                 subject: 'Low balance - Ariana-Cloud Team',
//                 text: 'Your account balance is low, please before apps freezing, charge your account.'
//             });
//         };
//     });
// });

cron.schedule('*/30 * * * *', async () => {
    const expiredTokens = await TokenModel.findAll();

    expiredTokens.forEach(t => {
        if(t.type !== 'refresh-token') {
            // 60 * 60 * 1000 = 3600000; 1 hour later
            t.createdAt < new Date(Date.now() - 3600000) ? t.destroy() : '';
        } else {
            // 60 * 60 * 1000 * 24 * 15 = 1296000000; 15 days later
            t.createdAt < new Date(Date.now() - 1296000000) ? t.destroy() : '';
        };
    });
});

// cron.schedule('* * */7 * *', async () => {
//     const users = await UserModel.findAll();

//     users.forEach(async user => {
//         const transactions = UserTransactionModel.create({
//             balance: user.balance,
//             userEmail: user.email
//         });
//     });
// });
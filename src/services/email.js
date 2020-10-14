const nodemailer = require('nodemailer');

const { gmailPassword, gmailUsername } = require('../config');

const transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: gmailUsername,
        pass: gmailPassword
    }
});

class EmailService {
    static sendMail ({to, subject, text}) {
        try {
            const mailOptions = {
                from: gmailUsername,
                to,
                subject,
                text
            };
    
            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    };
                });
            });
        } catch (error) {
            Validator.throwErrorInModels(error);
        };
    };
};

module.exports = EmailService;
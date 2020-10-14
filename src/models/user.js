const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const Validator = require('../utils/validator');

class UserModel extends Model {};
UserModel.init({
    email: {
        primaryKey: true,
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullname: {
        allowNull: true,
        type: DataTypes.STRING,
        validate: {
            isUnicodeAlphanumeric(value) {
                if (Validator.isAlphanumeric(value, true) !== true) {
                    throw new Error('fullname is not valid.');
                }
            }
        }
    },
    phone: {
        type: DataTypes.STRING,
        validate: {
            isPhone(value) {
                if (Validator.isPhone(value) !== true) {
                    throw new Error('phone is not valid.');
                }
            }
        }
    },
    balance: {
        type: DataTypes.REAL,
        defaultValue: 5000,
        validate: {
            isFloat: true
        }
    },
    accessToken: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // phoneVerified: {
    //     type: DataTypes.BOOLEAN,
    //     defaultValue: false
    // },
    avatar: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    }
}, { 
    sequelize,
    modelName: 'users'
});

module.exports = UserModel;
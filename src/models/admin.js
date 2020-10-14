const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('./index');

class AdminModel extends Model {};
AdminModel.init({
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'admins',
    timestamps: true,
    paranoid: false
});

module.exports = AdminModel;
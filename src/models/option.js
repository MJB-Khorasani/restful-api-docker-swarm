const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class OptionModel extends Model {};
OptionModel.init({
    id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    minCreditAmount: {
        type: DataTypes.SMALLINT,
        defaultValue: 3000
    },
    sampleAvatar: {
        type: DataTypes.STRING,
        defaultValue: 'www.gravatar.com/avatar/72946715050010dd99f44928ac6aaf79?d=mp',
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    usersCanRegister: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, { 
    sequelize,
    modelName: 'options',
    paranoid: false
});

module.exports = OptionModel;
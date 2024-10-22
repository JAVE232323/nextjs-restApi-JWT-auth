const {DataTypes} = require('sequelize');
const {sequelize} = require('../db/db');
const { PASSWORD } = require('../config/db.config');

const User = sequelize.define('User', {
    // Поля модели
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type:DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'users'
})

module.exports = User;
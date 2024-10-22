const {DataTypes} = require('sequelize');
const {sequelize} = require('../db/db');
const Role = require('./roles')

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

// Определение связи "многие ко многим" с таблицей Role через вспомогательную таблицу UserRoles
User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });

module.exports = User;
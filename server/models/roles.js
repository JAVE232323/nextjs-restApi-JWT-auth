 const {DataTypes} = require('sequelize')
const { sequelize } = require('../db/db')

 const Role = sequelize.define('Role', {
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },

 }, {
     tableName: 'roles'
 });

 module.exports = Role;
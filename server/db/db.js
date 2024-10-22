const { Sequelize } = require('sequelize');
const config = require('../config/db.config')

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: 'localhost',
        dialect: 'postgres', // Используем PostgreSQL
    }
)

const connectDB = async () => {
    try{
        await sequelize.authenticate();
    } catch (e) {
        console.error('Ошибка соединения с базой данных:', e);
    }
}

module.exports = {connectDB, sequelize}
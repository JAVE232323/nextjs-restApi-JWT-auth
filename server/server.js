const express = require('express');
const cors = require('cors');
const { connectDB, sequelize} = require('./db/db')
const User = require('./models/users')
const Role = require('./models/roles')
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();

sequelize.sync({force: true})
    .then(() => {
        console.log('Таблицы успешно созданы')
    })
    .catch((err) => {
        console.error('Ошибка синхронизации таблиц:', err);
    })

app.get('/', (req, res) => {
    res.json({"message": '123'})
});

app.post('/users', async(req, res) => {
    try{
        const {username, email, password} = req.body;
        const newUser = await User.create({username, email, password})
        res.json(newUser)
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Ошибка при создании пользователя'})
    }
});

app.listen(PORT, () => {
    console.log(`server started on Port ${PORT}`)
});

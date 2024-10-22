const express = require('express');
const cors = require('cors');
const { connectDB, sequelize} = require('./db/db')
const User = require('./models/users')
const Role = require('./models/roles');
const authRoute = require('./routes/auth')
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

authRoute(app);

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

app.get('/users', async (req, res) => {
    const user = await User.findAll({
        include: Role
    })
    res.json({message: user})
})

app.post('/roles', async (req, res) => {
    const {role} = req.body;

    const newRole = await Role.create({role}) 

    res.json({role: newRole})
})

app.listen(PORT, () => {
    console.log(`server started on Port ${PORT}`)
});

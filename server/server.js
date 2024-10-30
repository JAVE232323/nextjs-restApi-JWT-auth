const express = require('express');
const cors = require('cors');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

passport.use(new GoogleStrategy({
    clientID: "215007847569-5q43ke2a1ars0ucfvgj2hvqool8u73kn.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: 'http://localhost:5000/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(accessToken)
        return done(null, profile)
    }));

app.use(passport.initialize());


sequelize.sync({force: true})
    .then(() => {
        console.log('Таблицы успешно созданы')
    })
    .catch((err) => {
        console.error('Ошибка синхронизации таблиц:', err);
    });


app.get('/', (req, res) => {
    res.json({"message": 'Главная страница'})
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


//start server. In terminal:
// cd server
// npm start
// To close server ctrl+c, y


const Role = require('../models/roles')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config/jwt.config')

exports.signup = async (req, res) => {
    try{
        const {username, email, password, role} = req.body;

        const hashedPassword  = await bcrypt.hash(password, 7)

        const newUser = await User.create({username, email, password: hashedPassword });
        
        const [userRole] = await Role.findOrCreate({
            where: {role: role}
        });

        await newUser.addRole(userRole);
        
        res.json({ user: newUser, role: userRole })
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Ошибка при создании пользователя'})
    }
}

exports.signin = async (req, res) => {
    try {
        const {username, email, password} = req.body;
    
        const UsernameUser = await User.findOne({
            where: {username}
        });

        const user = await User.findOne({
            where: {username}
        })

        if (!user) {
            return res.status(404).json({message:"Пользователь не найден"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid){
            return res.status(401).json({message:"Не верно введен пароль"})
        }

        const token = jwt.sign({
            userId: user.id,
            username: user.username,
            email: user.email
        },
        config.secret,
        {
            expiresIn: '1h'
        }
    )

    res.json({token, message: "Авторизация успешна"})
        
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Ошибка при авторизации' });
    }

} 
const { verify } = require('jsonwebtoken');
const Role = require('../models/roles');
const User = require('../models/users');

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    
    const {username, email} = req.body;

    const existUsernameUser = await User.findOne({
        where: {username}
    });

    if (existUsernameUser){
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    }

    const existEmailUser = await User.findOne({
        where: {email}
    })

    if (existEmailUser){
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    next();
};

checkRolesExisted = async (req, res, next) => {
    const {role} = req.body;

    const checkRole = await Role.findOne({
        where: {role}
    })

    if (!checkRole){
        return res.status(400).json({message: "Не существует такой роли"})
    }
    
    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
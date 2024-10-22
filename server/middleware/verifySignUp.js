const { verify } = require('jsonwebtoken');
const Role = require('../models/roles');
const User = require('../models/users');

checkDuplicateUsernameOrEmail = (req, res, next) => {
    
    const {username, email} = req.body;

    User.findOne({
        where: username
    })
    .then(user => {
        if (user){
            res.status(400).send({
                message: "Username is already in use"
            });
            return;
        }

        User.findOne({
            where: email
        })
        .then(user => {
            if (user) {
                res.status(400).send({
                    message: "Email is already in use"
                });
                return;
            }
            next();
        });
    });
};

checkRolesExisted = (req, res, next) => {
    const {roles} = req.body;

    if (roles) {
        for (let i = 0; i <= roles.length; i++){
            if(!Role.includes(roles[i])){
                res.status(400).send({
                    message: "Failed! Role does not exist = " + roles[i]
                });
                return;
            }
        }
    }
    next();
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
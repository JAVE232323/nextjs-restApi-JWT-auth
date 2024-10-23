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

exports.signin = (req, res) => {
    const {username, password} = req.body;
    
    User.findOne({
        where: username
    })
    .then(user => {
        if (!user) {
            return res.status(404).send({message: 'User not found'})
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword){
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!!!"
            })
        }

        const token = jwt.sign(
            { id: user.id},
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresInL:86400,
            }
        )

        const authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        })
    })
    .catch(err => {
        res.status(500).send({message: err.message})
    })

} 
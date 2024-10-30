const verifySignUp = require('../middleware/verifySignUp')
const controller = require('../controllers/authController')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config/jwt.config')

function generateToken(user) {
    const payload = {
      id: user.id,
      displayName: user.displayName,
      email: user.emails[0].value  // Получаем email из профиля
    };
    return jwt.sign(payload, config.secret, { expiresIn: '1h' }); // Токен будет действовать 1 час
  }
  

module.exports = function(app) {
    app.post('/api/auth/signup', [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
        ],
        controller.signup
    );
    
    app.post("/api/auth/signin", controller.signin)

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback', 
        passport.authenticate('google', {failureRedirect: '/'},
            (req, res) => {
                const { profile, email} = req.body;

                const token = jwt.sign({
                    username: profile,
                    email: email
                },
                config.secret,
                {
                    expiresIn: '1h'
                }
            ) 


                res.json({token})
            }
        )
    )

    app.get('/profile', (req, res) => {
        // Получаем токен из заголовков
        const token = req.headers.authorization?.split(' ')[1];
      
        if (!token) {
          return res.status(401).json({ message: 'Токен не найден, доступ запрещен' });
        }
      
        try {
          // Проверяем и декодируем токен
          const decoded = jwt.verify(token, JWT_SECRET);
          res.json({
            message: 'Успешно авторизован',
            user: decoded
          });
        } catch (err) {
          res.status(401).json({ message: 'Неверный токен' });
        }
      });
}
const verifySignUp = require('../middleware/verifySignUp')
const controller = require('../controllers/authController')

module.exports = function(app) {
    app.post('/api/auth/signup', [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
        ],
        controller.signup
    );
    
    app.post("/api/auth/signin", controller.signin)
}
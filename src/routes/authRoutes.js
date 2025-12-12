const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { loginSchema, changePasswordSchema } = require('../validators/authValidator');

router.post('/login', validateMiddleware(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, validateMiddleware(changePasswordSchema), authController.changePassword);

module.exports = router;

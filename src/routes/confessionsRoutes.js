const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const confessionController = require('../controllers/confessionController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createConfessionSchema, updateConfessionSchema, confessionQuerySchema, confessionParamOnlySchema } = require('../validators/confessionValidator');


router.post('/', authenticate, validateMiddleware(createConfessionSchema), confessionController.createConfession);
router.get('/', authenticate, validateMiddleware(confessionQuerySchema), confessionController.getConfessions);
router.get('/:id', authenticate, validateMiddleware(confessionParamOnlySchema), confessionController.getConfessionById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updateConfessionSchema), confessionController.updateConfession);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(confessionParamOnlySchema), confessionController.deleteConfession);



module.exports = router;
const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const classController = require('../controllers/classController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createClassSchema, updateClassSchema, classQuerySchema, classParamOnlySchema } = require('../validators/classValidator');


router.post('/', authenticate, requireAdmin, validateMiddleware(createClassSchema), classController.createClass);
router.get('/', authenticate, validateMiddleware(classQuerySchema), classController.getClasses);
router.get('/:id', authenticate, validateMiddleware(classParamOnlySchema), classController.getClassById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updateClassSchema), classController.updateClass);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(classParamOnlySchema), classController.deleteClass);

module.exports = router;
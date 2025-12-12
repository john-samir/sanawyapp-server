const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const pointTypeController = require('../controllers/pointTypeController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createPointTypeSchema, updatePointTypeSchema, pointTypeQuerySchema, pointTypeParamOnlySchema } = require('../validators/pointTypeValidator');


router.post('/', authenticate, requireAdmin, validateMiddleware(createPointTypeSchema), pointTypeController.createPointType);
router.get('/', authenticate, validateMiddleware(pointTypeQuerySchema), pointTypeController.getPointTypes);
router.get('/:id', authenticate, validateMiddleware(pointTypeParamOnlySchema), pointTypeController.getPointTypeById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updatePointTypeSchema), pointTypeController.updatePointType);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(pointTypeParamOnlySchema), pointTypeController.deletePointType);


module.exports = router;
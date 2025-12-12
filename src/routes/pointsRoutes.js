const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const pointController = require('../controllers/pointController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createPointSchema, updatePointSchema, pointQuerySchema, pointParamOnlySchema, pointTotalsQuerySchema } = require('../validators/pointValidator');


router.post('/', authenticate, validateMiddleware(createPointSchema), pointController.createPoint);

router.get('/totals', authenticate, requireAdmin, validateMiddleware(pointTotalsQuerySchema), pointController.getStudentTotals);

router.get('/', authenticate, validateMiddleware(pointQuerySchema), pointController.getPoints);
router.get('/:id', authenticate, validateMiddleware(pointParamOnlySchema), pointController.getPointById);
router.put('/:id', authenticate, requireAdminOrAmin, validateMiddleware(updatePointSchema), pointController.updatePoint);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(pointParamOnlySchema), pointController.deletePoint);


module.exports = router;
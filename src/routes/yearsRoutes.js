const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const yearController = require('../controllers/yearController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createYearSchema, updateYearSchema, yearQuerySchema, yearParamOnlySchema } = require('../validators/yearValidator');


router.post('/', authenticate, requireAdmin, validateMiddleware(createYearSchema), yearController.createYear);
router.get('/', authenticate, validateMiddleware(yearQuerySchema), yearController.getYears);
router.get('/:id', authenticate, validateMiddleware(yearParamOnlySchema), yearController.getYearById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updateYearSchema), yearController.updateYear);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(yearParamOnlySchema), yearController.deleteYear);

module.exports = router;
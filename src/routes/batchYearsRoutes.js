const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const batchYearController = require('../controllers/batchYearController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createBatchYearSchema, updateBatchYearSchema, batchYearQuerySchema, batchYearParamOnlySchema } = require('../validators/batchYearValidator');

router.post('/', authenticate, requireAdmin, validateMiddleware(createBatchYearSchema), batchYearController.createBatchYear);
router.get('/', authenticate, validateMiddleware(batchYearQuerySchema), batchYearController.getBatchYears);
router.get('/:id', authenticate, validateMiddleware(batchYearParamOnlySchema), batchYearController.getBatchYearById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updateBatchYearSchema), batchYearController.updateBatchYear);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(batchYearParamOnlySchema), batchYearController.deleteBatchYear);

module.exports = router;
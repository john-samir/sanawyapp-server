const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const batchController = require('../controllers/batchController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createBatchSchema, updateBatchSchema, batchQuerySchema, batchParamOnlySchema, advanceBatchSchema } = require('../validators/batchValidator');



router.post('/', authenticate, requireAdmin, validateMiddleware(createBatchSchema), batchController.createBatch);
router.get('/', authenticate, validateMiddleware(batchQuerySchema), batchController.getBatches);
router.put('/advance-batch/:id/:nextYearId', authenticate, requireAdmin, validateMiddleware(advanceBatchSchema), batchController.advanceBatch);
router.get('/:id', authenticate, validateMiddleware(batchParamOnlySchema), batchController.getBatchById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updateBatchSchema), batchController.updateBatch);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(batchParamOnlySchema), batchController.deleteBatch);

module.exports = router;
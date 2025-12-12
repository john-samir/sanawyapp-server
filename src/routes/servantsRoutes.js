const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const servantController = require('../controllers/servantController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createServantSchema, updateServantSchema, servantQuerySchema, servantParamOnlySchema } = require('../validators/servantValidator');

router.post('/', authenticate, requireAdmin, validateMiddleware(createServantSchema), servantController.createServant);
router.get('/', authenticate, validateMiddleware(servantQuerySchema), servantController.getServants);
router.get('/:id', authenticate, validateMiddleware(servantParamOnlySchema), servantController.getServantById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updateServantSchema), servantController.updateServant);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(servantParamOnlySchema), servantController.deleteServant);


module.exports = router;

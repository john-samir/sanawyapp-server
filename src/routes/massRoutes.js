const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const massController = require('../controllers/massController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createMassSchema, updateMassSchema, massQuerySchema, massParamOnlySchema } = require('../validators/massValidator');


router.post('/', authenticate, validateMiddleware(createMassSchema), massController.createMass);
router.get('/', authenticate, validateMiddleware(massQuerySchema), massController.getMasses);
router.get('/:id', authenticate, validateMiddleware(massParamOnlySchema), massController.getMassById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updateMassSchema), massController.updateMass);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(massParamOnlySchema), massController.deleteMass);


module.exports = router;
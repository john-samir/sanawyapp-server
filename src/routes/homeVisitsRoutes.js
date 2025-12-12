const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const homeVisitController = require('../controllers/homeVisitController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createHomeVisitSchema, updateHomeVisitSchema, homeVisitQuerySchema, homeVisitParamOnlySchema } = require('../validators/homeVisitValidator');


router.post('/', authenticate, validateMiddleware(createHomeVisitSchema), homeVisitController.createHomeVisit);
router.get('/', authenticate, validateMiddleware(homeVisitQuerySchema), homeVisitController.getHomeVisits);
router.get('/:id', authenticate, validateMiddleware(homeVisitParamOnlySchema), homeVisitController.getHomeVisitById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updateHomeVisitSchema), homeVisitController.updateHomeVisit);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(homeVisitParamOnlySchema), homeVisitController.deleteHomeVisit);


module.exports = router;
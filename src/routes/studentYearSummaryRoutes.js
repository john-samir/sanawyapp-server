const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const studentYearSummaryController = require('../controllers/studentYearSummaryController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createStudentYearSummarySchema, updateStudentYearSummarySchema, studentYearSummaryQuerySchema, studentYearSummaryParamOnlySchema } = require('../validators/studentYearSummaryValidator');


router.post('/', authenticate, requireAdmin, validateMiddleware(createStudentYearSummarySchema), studentYearSummaryController.createStudentYearSummary);
router.get('/', authenticate, validateMiddleware(studentYearSummaryQuerySchema), studentYearSummaryController.getStudentYearSummaries);
router.get('/:id', authenticate, validateMiddleware(studentYearSummaryParamOnlySchema), studentYearSummaryController.getStudentYearSummaryById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updateStudentYearSummarySchema), studentYearSummaryController.updateStudentYearSummary);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(studentYearSummaryParamOnlySchema), studentYearSummaryController.deleteStudentYearSummary);

module.exports = router;
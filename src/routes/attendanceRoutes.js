const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const attendanceController = require('../controllers/attendanceController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createAttendanceSchema, updateAttendanceSchema, attendanceQuerySchema, attendanceParamOnlySchema } = require('../validators/attendanceValidator');

router.post('/', authenticate, validateMiddleware(createAttendanceSchema), attendanceController.createAttendance);
router.get('/', authenticate, validateMiddleware(attendanceQuerySchema), attendanceController.getAttendances);
router.get('/:id', authenticate, validateMiddleware(attendanceParamOnlySchema), attendanceController.getAttendanceById);
router.put('/:id', authenticate, requireAdmin, validateMiddleware(updateAttendanceSchema), attendanceController.updateAttendance);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(attendanceParamOnlySchema), attendanceController.deleteAttendance);


module.exports = router;
const router = require('express').Router();
const { authenticate, requireAdmin, requireAmin, requireAdminOrAmin } = require('../middlewares/authMiddleware');
const studentController = require('../controllers/studentController');

//Validator
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createStudentSchema, updateStudentSchema, studentQuerySchema, studentParamOnlySchema } = require('../validators/studentValidator');


router.post('/', authenticate, validateMiddleware(createStudentSchema), studentController.createStudent);
router.get('/', authenticate, validateMiddleware(studentQuerySchema), studentController.getStudents);

router.put('/:id/exclude', authenticate, requireAdminOrAmin, validateMiddleware(studentParamOnlySchema), studentController.excludeStudent);
router.put('/:id/include', authenticate, requireAdminOrAmin, validateMiddleware(studentParamOnlySchema), studentController.includeStudent);

router.get('/:id', authenticate, validateMiddleware(studentParamOnlySchema), studentController.getStudentById);
router.put('/:id', authenticate, validateMiddleware(updateStudentSchema), studentController.updateStudent);
router.delete('/:id', authenticate, requireAdmin, validateMiddleware(studentParamOnlySchema), studentController.deleteStudent);


module.exports = router;
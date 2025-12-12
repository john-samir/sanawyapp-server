const router = require('express').Router();

const attendanceRoutes = require('./attendanceRoutes');
const authRoutes = require('./authRoutes');
const batchesRoutes = require('./batchesRoutes');
const batchYearsRoutes = require('./batchYearsRoutes');
const classesRoutes = require('./classesRoutes');
const ConfessionsRoutes = require('./confessionsRoutes');
const homeVisitsRoutes = require('./homeVisitsRoutes');
const massRoutes = require('./massRoutes');
const pointsRoutes = require('./pointsRoutes');
const pointTypesRoutes = require('./pointTypesRoutes');
const servantsRoutes = require('./servantsRoutes');
const studentsRoutes = require('./studentsRoutes');
const studentYearSummaryRoutes = require('./studentYearSummaryRoutes');
const yearsRoutes = require('./yearsRoutes');


router.use('/auth', authRoutes);
router.use('/students', studentsRoutes);
router.use('/student-year-summaries', studentYearSummaryRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/confessions', ConfessionsRoutes);
router.use('/masses', massRoutes);
router.use('/home-visits', homeVisitsRoutes);
router.use('/points', pointsRoutes);
router.use('/point-types', pointTypesRoutes);
router.use('/classes', classesRoutes);
router.use('/years', yearsRoutes);
router.use('/batches', batchesRoutes);
router.use('/batch-years', batchYearsRoutes);
router.use('/servants', servantsRoutes);


module.exports = router;
const Confession = require('../models/Confession');
const studentService = require('../services/studentService');
const classService = require('../services/classService');
const batchYearService = require('../services/batchYearService');
const pointService = require('../services/pointService');
const pointTypeService = require('../services/pointTypeService');

const AppError = require('../utils/AppError');

//Constants
const { STUDENT, CLASS, BATCH_YEAR, CONFESSION_CONFIG_ID, CONFESSION_CONFIG_NAME, ERROR_MESSAGES } = require('../utils/constants');

async function createConfession(data) {
    const { student, mobileNumber, date } = data;
    let confessionRecord = {};

    confessionRecord.date = new Date(date);
    confessionRecord.date.setHours(0, 0, 0, 0); // remove time

    // 1. Get student using studentService
    let studentData;
    if (student) {
        studentData = await studentService.getStudentById(student);
        if (!studentData) throw new AppError(ERROR_MESSAGES.STUDENT.NOT_FOUND, 404);

    } else if (mobileNumber) {
        const students = await studentService.getStudents({ mobile: mobileNumber });
        if (!students || students.length === 0) throw new AppError(ERROR_MESSAGES.STUDENT.NOT_FOUND, 404);
        studentData = students[0];
    }

    confessionRecord.student = studentData._id;
    confessionRecord.class = studentData.class._id;

    const batchId = studentData.batch._id;
    const yearId = studentData.batch.currYear?._id || studentData.batch.currYear;

    // 2. Find BatchYear using batchYearService
    const batchYears = await batchYearService.getBatchYears({
        batchid: batchId.toString(),
        yearid: yearId.toString()
    });

    if (!batchYears || batchYears.length === 0) {
        throw new AppError(ERROR_MESSAGES.BATCH_YEAR.NOT_FOUND, 404);
    }

    const batchYear = batchYears[0];

    // 3. Attach year to Confession
    confessionRecord.batchYear = batchYear._id;

    // 4. Create Confession record
    const confessionData = await Confession.create(confessionRecord);

    if (!confessionData) {
        throw new AppError(ERROR_MESSAGES.CONFESSION.FAILED_CREATE, 404);
    }

    // 5. Update BatchYear maxNoOfConfessions
    await updateBatchYearMaxNoOfConfessions(batchYear._id);

    // 6. Populate before returning
    await confessionData.populate([
        { path: 'student', select: STUDENT },
        { path: 'class', select: CLASS },
        { path: 'batchYear', select: BATCH_YEAR },
    ]);

    //7- Create Point record for confession and internaly updates StudentYearSummary
    const createdPoint = await createPointForConfession(confessionData);

    return confessionData;
}

async function getConfessions(query) {
    const { id, studentid, student, batchyearid, academicyear, classname, date } = query;
    const filter = {};

    if (id) filter._id = id;

    if (studentid) filter.student = studentid;
    if (student && !studentid) {
        // get students that match student name partially
        const students = await studentService.getStudents({ q: student });
        if (!students || students.length === 0) return []; // no matching records found

        // Extract the IDs of the matched records
        const studentIds = students.map(student => student._id);

        filter.student = { $in: studentIds }; // Use $in to match any of the found records
    }

    if (batchyearid) filter.batchYear = batchyearid;
    if (academicyear && !batchyearid) {
        // get batchYear that match academic Year name partially
        const batchYears = await batchYearService.getBatchYears({ academicyear: academicyear });
        if (!batchYears || batchYears.length === 0) return []; // no matching records found

        // Extract the IDs of the matched records
        const batchYearIds = batchYears.map(batchYear => batchYear._id);

        filter.batchYear = { $in: batchYearIds }; // Use $in to match any of the found records
    }

    if (classname) {
        // get classes that match class name partially
        const classes = await classService.getClasses({ q: classname });
        if (!classes || classes.length === 0) return []; // no matching records found

        // Extract the IDs of the matched records
        const classIds = classes.map(classObj => classObj._id);

        filter.class = { $in: classIds }; // Use $in to match any of the found records
    }

    if (date) {
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        filter.date = dateObj;
    }

    let sort = { createdAt: -1 }; //Descending

    const confessions = await Confession.find(filter)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'class', select: CLASS },
            { path: 'batchYear', select: BATCH_YEAR },
        ])
        .sort(sort);

    return confessions;
}

async function getConfessionById(id) {
    const confessionData = await Confession.findById(id)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'class', select: CLASS },
            { path: 'batchYear', select: BATCH_YEAR },
        ]);
    return confessionData;
}

async function updateConfession(id, data) {
    const updated = await Confession.findByIdAndUpdate(id, data, { new: true })
    if (!updated) return null;

    // Update BatchYear maxNoOfConfessions
    await updateBatchYearMaxNoOfConfessions(updated.batchYear);

    await updated.populate([
        { path: 'student', select: STUDENT },
        { path: 'class', select: CLASS },
        { path: 'batchYear', select: BATCH_YEAR },
    ]);

    return updated;
}

async function deleteConfession(id) {
    //1. Delete Confession record
    const deleted = await Confession.findByIdAndDelete({ _id: id });

    if (!deleted) return null;

    //2. Delete associated Point record and it internally updates StudentYearSummary
    const points = await pointService.getPoints({
        sourcetype: "confession",
        sourceid: deleted._id.toString()
    });

    let pointTobeDeleted;
    if (points && points.length > 0) {
        pointTobeDeleted = points[0];

        await pointService.deletePoint(pointTobeDeleted._id);
    }

    //3. Update BatchYear maxNoOfConfessions
    await updateBatchYearMaxNoOfConfessions(deleted.batchYear);

    return deleted;
}

module.exports = {
    createConfession,
    getConfessions,
    getConfessionById,
    updateConfession,
    deleteConfession,
    deleteAllConfessionsByStudentId,
    updateBatchYearMaxNoOfConfessions,
};


/// Helper Functions
async function updateBatchYearMaxNoOfConfessions(batchYearId) {
    const uniqueMonths = await Confession.aggregate([
        { $match: { batchYear: batchYearId } },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' }
                }
            }
        },
        { $count: 'total' }
    ]);

    const total = uniqueMonths[0]?.total || 0;

    await batchYearService.updateBatchYear(batchYearId, {
        maxNoOfConfessions: total
    });
}

async function createPointForConfession(confessionData) {
    const confPointType = await pointTypeService.getPointTypeById(CONFESSION_CONFIG_ID);

    if (!confPointType) {
        throw new Error(`${CONFESSION_CONFIG_NAME} ${ERROR_MESSAGES.POINT_TYPE.NOT_FOUND}`);
    }

    const pointData = {
        student: confessionData.student._id,
        batchYear: confessionData.batchYear._id,
        type: confPointType._id,
        points: confPointType.value,
        date: confessionData.date,
        source: {
            sourceType: "confession",
            sourceId: confessionData._id
        }
    };

    const createdPoint = await pointService.createPoint(pointData);
    return createdPoint;
}


async function deleteAllConfessionsByStudentId(id) {
    const deleted = await Confession.deleteMany({ student: id });
    return deleted;
}

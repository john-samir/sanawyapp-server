const Mass = require('../models/Mass');
const studentService = require('../services/studentService');
const classService = require('../services/classService');
const batchYearService = require('../services/batchYearService');
const pointService = require('../services/pointService');
const pointTypeService = require('../services/pointTypeService');

const AppError = require('../utils/AppError');

//Constants
const { STUDENT, CLASS, BATCH_YEAR, MASS_CONFIG_NAME, ERROR_MESSAGES } = require('../utils/constants');

async function createMass(data) {
    const { student, mobileNumber, date } = data;
    let massRecord = {};

    massRecord.date = new Date(date);
    massRecord.date.setHours(0, 0, 0, 0); // remove time

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

    massRecord.student = studentData._id;
    massRecord.class = studentData.class._id;

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

    // 3. Attach year to Mass Record
    massRecord.batchYear = batchYear._id;

    // 4. Create Mass record
    const massData = await Mass.create(massRecord);

    if (!massData) {
        throw new AppError(ERROR_MESSAGES.MASS.FAILED_CREATE, 404);
    }

    // 5. Populate and return Mass record
    await massData.populate([
        { path: 'student', select: STUDENT },
        { path: 'class', select: CLASS },
        { path: 'batchYear', select: BATCH_YEAR },
    ]);

    //6- Create Point record for Mass and internaly updates StudentYearSummary
    const createdPoint = await createPointForMass(massData);

    return massData;
}

async function getMasses(query) {
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

    const masses = await Mass.find(filter)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'class', select: CLASS },
            { path: 'batchYear', select: BATCH_YEAR },
        ])
        .sort(sort);

    return masses;
}

async function getMassById(id) {
    const massData = await Mass.findById(id)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'class', select: CLASS },
            { path: 'batchYear', select: BATCH_YEAR },
        ]);
    return massData;
}

async function updateMass(id, data) {
    const updated = await Mass.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return null;

    await updated.populate([
        { path: 'student', select: STUDENT },
        { path: 'class', select: CLASS },
        { path: 'batchYear', select: BATCH_YEAR },
    ]);

    return updated;
}

async function deleteMass(id) {
    //1. Delete Mass record
    const deleted = await Mass.findByIdAndDelete({ _id: id });

    if (!deleted) return null;

    //2. Delete associated Point record and it internally updates StudentYearSummary
    const points = await pointService.getPoints({
        sourcetype: "mass",
        sourceid: deleted._id.toString()
    });

    let pointTobeDeleted;
    if (points && points.length > 0) {
        pointTobeDeleted = points[0];

        await pointService.deletePoint(pointTobeDeleted._id);
    }

    return deleted;
}

module.exports = {
    createMass,
    getMasses,
    getMassById,
    updateMass,
    deleteMass,
    deleteAllMassesByStudentId,
};


/// Helper Functions
async function createPointForMass(massData) {
    const massPointType = await pointTypeService.getPointTypeById(MASS_CONFIG_ID);

    if (!confPointType) {
        throw new Error(`${MASS_CONFIG_NAME} ${ERROR_MESSAGES.POINT_TYPE.NOT_FOUND}`);
    }

    const pointData = {
        student: massData.student._id,
        batchYear: massData.batchYear._id,
        type: massPointType._id,
        points: massPointType.value,
        date: massData.date,
        source: {
            sourceType: "mass",
            sourceId: massData._id
        }
    };

    const createdPoint = await pointService.createPoint(pointData);
    return createdPoint;
}


async function deleteAllMassesByStudentId(id) {
    const deleted = await Mass.deleteMany({ student: id });
    return deleted;
}
const HomeVisit = require('../models/HomeVisit');
const studentService = require('../services/studentService');
const classService = require('../services/classService');
const batchYearService = require('../services/batchYearService');
const servantService = require('../services/servantService');

const AppError = require('../utils/AppError');

//Constants
const { STUDENT, CLASS, BATCH_YEAR, SERVANT, ERROR_MESSAGES } = require('../utils/constants');

async function createHomeVisit(data) {
    const { student, visitDate, servants, notes } = data;
    let homeVisitRecord = {};

    homeVisitRecord.visitDate = new Date(visitDate);
    homeVisitRecord.visitDate.setHours(0, 0, 0, 0); // remove time

    homeVisitRecord.servants = servants;

    if (notes) {
        homeVisitRecord.notes = notes;
    }

    // 1. Get student using studentService
    let studentData;
    if (student) {
        studentData = await studentService.getStudentById(student);
        if (!studentData) throw new AppError(ERROR_MESSAGES.STUDENT.NOT_FOUND, 404);

    }

    homeVisitRecord.student = studentData._id;
    homeVisitRecord.class = studentData.class._id;

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

    // 3. Attach year to HomeVisit Record
    homeVisitRecord.batchYear = batchYear._id;

    // 4. Create HomeVisit record
    const homeVisitData = await HomeVisit.create(homeVisitRecord);

    if (!homeVisitData) {
        throw new AppError(ERROR_MESSAGES.HOME_VISIT.FAILED_CREATE, 404);
    }

    // 5. Populate and return HomeVisit record
    await homeVisitData.populate([
        { path: 'student', select: STUDENT },
        { path: 'class', select: CLASS },
        { path: 'batchYear', select: BATCH_YEAR },
        {
            path: 'servants',   // Populate the servants field
            select: SERVANT
        }
    ]);

    return homeVisitData;
}

async function getHomeVisits(query) {
    const { id, studentid, student, batchyearid, academicyear, classname, servantid, servant, date } = query;
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

    if (servantid) {
        filter.servants = { $in: [servantid] }; // Match HomeVisits that have servantId in the servants array
    }
    if (servant && !servantid) {
        // Get servants that match servant name partially
        const servants = await servantService.getServants({ q: servant });
        if (!servants || servants.length === 0) return []; // no matching servants found

        const servantIds = servants.map(servant => servant._id);
        filter.servants = { $in: servantIds }; // Match HomeVisits that have any of the found servants in the array
    }

    if (date) {
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        filter.visitDate = dateObj;
    }

    let sort = { createdAt: -1 }; //Descending

    const homeVisits = await HomeVisit.find(filter)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'class', select: CLASS },
            { path: 'batchYear', select: BATCH_YEAR },
            {
                path: 'servants',   // Populate the servants field
                select: SERVANT
            }
        ])
        .sort(sort);

    return homeVisits;
}

async function getHomeVisitById(id) {
    const homeVisitData = await HomeVisit.findById(id)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'class', select: CLASS },
            { path: 'batchYear', select: BATCH_YEAR },
            {
                path: 'servants',   // Populate the servants field
                select: SERVANT
            }
        ]);
    return homeVisitData;
}

async function updateHomeVisit(id, data) {
    const updated = await HomeVisit.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return null;

    await updated.populate([
        { path: 'student', select: STUDENT },
        { path: 'class', select: CLASS },
        { path: 'batchYear', select: BATCH_YEAR },
        {
            path: 'servants',   // Populate the servants field
            select: SERVANT
        }
    ]);

    return updated;
}

async function deleteHomeVisit(id) {
    const deleted = await HomeVisit.findByIdAndDelete({ _id: id });

    if (!deleted) return null;

    return deleted;
}

module.exports = {
    createHomeVisit,
    getHomeVisits,
    getHomeVisitById,
    updateHomeVisit,
    deleteHomeVisit,
    deleteAllHomeVisitsByStudentId,
};


/// Helper Functions
async function deleteAllHomeVisitsByStudentId(id) {
    const deleted = await HomeVisit.deleteMany({ student: id });
    return deleted;
}
const Student = require('../models/Student');
const batchService = require('../services/batchService');
const batchYearService = require('../services/batchYearService');
const classService = require('../services/classService');
const servantService = require('../services/servantService');
const studentYearSummary = require('../services/studentYearSummaryService');


const AppError = require('../utils/AppError');

//Constants
const { CLASS, SERVANT, BATCH, ERROR_MESSAGES } = require('../utils/constants');

async function createStudent(data) {
    //1. Create Student
    const studentData = await (await Student.create(data))
        .populate([
            { path: 'class', select: CLASS },
            { path: 'servant', select: SERVANT },
            { path: 'batch', select: BATCH }
        ]);

    if (!studentData) return null;

    //2. find BatchYear 
    const batchYears = await batchYearService.getBatchYears({
        batchid: studentData.batch._id.toString(),
        yearid: studentData.batch.currYear?._id || studentData.batch.currYear
    });
    const batchYear = batchYears[0];

    //3. Create StudentYearSummary record
    const studentYearSummaryData = await studentYearSummary.createStudentYearSummary({
        student: studentData._id,
        batchYear: batchYear._id
    });

    return studentData;
}

async function getStudents(query) {
    const { id, q, batch, classname, servant, mobile, mobilenumber, birthmonth, isexcluded } = query;
    const filter = {};

    if (id) filter._id = id;
    if (batch) {
        // get batches that match batch name partially
        const batches = await batchService.getBatches({ q: batch });
        if (!batches || batches.length === 0) return []; // no matching records found

        // Extract the IDs of the matched records
        const batchIds = batches.map(batch => batch._id);

        filter.batch = { $in: batchIds }; // Use $in to match any of the found records
    }

    if (classname) {
        // get classes that match class name partially
        const classes = await classService.getClasses({ q: classname });
        if (!classes || classes.length === 0) return []; // no matching records found

        // Extract the IDs of the matched records
        const classIds = classes.map(classObj => classObj._id);

        filter.class = { $in: classIds }; // Use $in to match any of the found records
    }

    if (servant) {
        // get servants that match servant name partially
        const servants = await servantService.getServants({ q: servant });
        if (!servants || servants.length === 0) return []; // no matching records found

        // Extract the IDs of the matched records
        const servantIds = servants.map(servant => servant._id);

        filter.servant = { $in: servantIds }; // Use $in to match any of the found records
    };

    if (mobile) {
        filter.mobileNumber = mobile;
    }

    if (mobilenumber && !mobile) {
        filter.$or = [
            { mobileNumber: mobilenumber },
            { whatsAppNumber: mobilenumber },
            { frMobileNumber: mobilenumber },
            { mrMobileNumber: mobilenumber }
        ];
    }

    let sort = { fullName: 1 };

    if (birthmonth) {
        // Sort Students by day of the month
        sort = { birthDate: 1 };

        filter.$expr = {
            $eq: [{ $month: "$birthDate" }, Number(birthmonth)]
        };
    }

    if (isexcluded) filter.isExcluded = isexcluded;

    if (q) filter.fullName = { $regex: q, $options: 'i' };

    const students = await Student.find(filter)
        .populate([
            { path: 'class', select: CLASS },
            { path: 'servant', select: SERVANT },
            { path: 'batch', select: BATCH }
        ])
        .sort(sort);

    return students;
}

async function getStudentById(id) {
    const studentData = await Student.findById(id)
        .populate([
            { path: 'class', select: CLASS },
            { path: 'servant', select: SERVANT },
            { path: 'batch', select: BATCH }
        ]);
    return studentData;
}

async function updateStudent(id, data) {
    const existingStudent = await getStudentById(id);
    if (!existingStudent) {
        throw new AppError(ERROR_MESSAGES.STUDENT.NOT_FOUND, 404);
    }

    // Prevent updating batch field
    if ("batch" in data) {
        delete data.batch;
    }

    // Merge the fields
    if (data.address) {
        // Merge the existing address with the updated fields
        existingStudent.address = {
            ...existingStudent.address.toObject(),
            ...data.address
        };
    }

    // Update other fields in a similar way (if needed)
    Object.keys(data).forEach(key => {
        if (key !== 'address') {
            existingStudent[key] = data[key];
        }
    });

    // Save the updated student document
    const updatedStudent = await existingStudent.save();

    // Populate the references after saving the document
    await updatedStudent
        .populate([
            { path: 'class', select: CLASS },
            { path: 'servant', select: SERVANT },
            { path: 'batch', select: BATCH }
        ]);

    return updatedStudent;
}

async function deleteStudent(id) {
    const deleted = await Student.findByIdAndDelete({ _id: id });

    if (!deleted) return null;

    // Delete All associated Attendance records & Update BatchYear total attendance count
    const attendanceService = require('../services/attendanceService');
    await attendanceService.deleteAllAttendancesByStudentId(id);
    await attendanceService.updateBatchYearAttendanceCount(deleted.batch);

    // Delete All associated Mass records 
    const massService = require('../services/massService');
    await massService.deleteAllMassesByStudentId(id);

    // Delete All associated Confession records & Update BatchYear maxNoOfConfessions
    const confessionService = require('../services/confessionService');
    await confessionService.deleteAllConfessionsByStudentId(id);
    await confessionService.updateBatchYearMaxNoOfConfessions(deleted.batch);

    // Delete All associated Points records 
    const pointService = require('../services/pointService');
    await pointService.deleteAllPointsByStudentId(id);

    // Delete All associated HomeVisit records 
    const homeVisitService = require('../services/homeVisitService');
    await homeVisitService.deleteAllHomeVisitsByStudentId(id);

    // Delete All associated StudentYearSummary records
    await studentYearSummary.deleteAllStudentYearSummariesByStdId(id);

    return deleted;
}

async function excludeStudent(id) {
    const updated = await Student.findByIdAndUpdate(id, { isExcluded: true }, { new: true });
    return updated;
}

async function includeStudent(id) {
    const updated = await Student.findByIdAndUpdate(id, { isExcluded: false }, { new: true });
    return updated;
}

module.exports = {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    excludeStudent,
    includeStudent,
};

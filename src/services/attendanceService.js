const Attendance = require('../models/Attendance');
const studentService = require('../services/studentService');
const classService = require('../services/classService');
const batchYearService = require('../services/batchYearService');
const pointService = require('../services/pointService');
const pointTypeService = require('../services/pointTypeService');

const AppError = require('../utils/AppError');

//Constants
const { STUDENT, CLASS, BATCH_YEAR, ATTENDANCE_DEFAULT_POINT_TYPE_ID, ERROR_MESSAGES } = require('../utils/constants');

async function createAttendance(data) {
    const { student, mobileNumber, date } = data;
    let attendaceRecord = {};

    attendaceRecord.date = new Date(date);
    attendaceRecord.date.setHours(0, 0, 0, 0); // remove time

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

    attendaceRecord.student = studentData._id;
    attendaceRecord.class = studentData.class._id;

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

    // 3. Attach batchYear to Attendance
    attendaceRecord.batchYear = batchYear._id;

    // 4. Create Attendance record
    const attendanceData = await Attendance.create(attendaceRecord);

    if (!attendanceData) {
        throw new AppError(ERROR_MESSAGES.ATTENDANCE.FAILED_CREATE, 404);
    }

    // 5. Update BatchYear total attendance count
    await updateBatchYearAttendanceCount(batchYear._id);

    // 6. Populate before returning
    await attendanceData.populate([
        { path: 'student', select: STUDENT },
        { path: 'class', select: CLASS },
        { path: 'batchYear', select: BATCH_YEAR },
    ]);

    //7- Create Point record for attendance and internaly updates StudentYearSummary
    const createdPoint = await createPointForAttendance(attendanceData);

    return attendanceData;
}

async function getAttendances(query) {
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

    const attendances = await Attendance.find(filter)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'class', select: CLASS },
            { path: 'batchYear', select: BATCH_YEAR },
        ])
        .sort({ createdAt: -1 }); // Sort newest first;
    return attendances;
}

async function getAttendanceById(id) {
    const attendanceData = await Attendance.findById(id)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'class', select: CLASS },
            { path: 'batchYear', select: BATCH_YEAR },
        ]);
    return attendanceData;
}

async function updateAttendance(id, data) {
    const updated = await Attendance.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return null;

    // Update BatchYear total attendance count
    await updateBatchYearAttendanceCount(updated.batchYear);

    await updated.populate([
        { path: 'student', select: STUDENT },
        { path: 'class', select: CLASS },
        { path: 'batchYear', select: BATCH_YEAR },
    ]);

    return updated;
}

async function deleteAttendance(id) {
    //1. Delete Attendance record
    const deleted = await Attendance.findByIdAndDelete({ _id: id });

    if (!deleted) return null;

    //2. Delete associated Point record and it internally updates StudentYearSummary
    const points = await pointService.getPoints({
        sourcetype: "attendance",
        sourceid: deleted._id.toString()
    });

    let pointTobeDeleted;
    if (points && points.length > 0) {
        pointTobeDeleted = points[0];

        await pointService.deletePoint(pointTobeDeleted._id);
    }

    //3. Update BatchYear total attendance count
    await updateBatchYearAttendanceCount(deleted.batchYear);

    return deleted;
}

module.exports = {
    createAttendance,
    getAttendances,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    deleteAllAttendancesByStudentId,
    updateBatchYearAttendanceCount,
};


/// Helper Functions
async function updateBatchYearAttendanceCount(batchYearId) {
    const uniqueDates = await Attendance.aggregate([
        { $match: { batchYear: batchYearId } },
        { $group: { _id: '$date' } },
        { $count: 'total' }
    ]);

    const total = uniqueDates[0]?.total || 0;

    await batchYearService.updateBatchYear(batchYearId, {
        totalAttendanceCount: total
    });
}

async function createPointForAttendance(attendanceData) {
    const currDate = new Date();
    const attPointTypeId = pointTypeService.getAttendancePointTypeForDateTime(currDate) || ATTENDANCE_DEFAULT_POINT_TYPE_ID;
    const attPointType = await pointTypeService.getPointTypeById(attPointTypeId);

    const pointData = {
        student: attendanceData.student._id,
        batchYear: attendanceData.batchYear._id,
        type: attPointTypeId,
        points: attPointType.value,
        date: attendanceData.date,
        source: {
            sourceType: "attendance",
            sourceId: attendanceData._id
        }
    };

    const createdPoint = await pointService.createPoint(pointData);
    return createdPoint;
}

async function deleteAllAttendancesByStudentId(id) {
    const deleted = await Attendance.deleteMany({ student: id });
    return deleted;
}



const StudentYearSummary = require('../models/StudentYearSummary');
let studentService;
const batchYearService = require('../services/batchYearService');

//Constants
const { STUDENT, BATCH_YEAR } = require('../utils/constants');

async function createStudentYearSummary(data) {
    const studentYearSummaryData = (await StudentYearSummary.create(data))
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'batchYear', select: BATCH_YEAR }
        ]);

    return studentYearSummaryData;
}

async function getStudentYearSummaries(query) {
    const { id, student, studentid, batchyearid, academicyear } = query;
    const filter = {};

    if (id) filter._id = id;
    if (studentid) filter.student = studentid;

    if (student && !studentid) {
        studentService = require('../services/studentService');

        // get students that match student name partially
        const students = await studentService.getStudents({ q: student });
        if (!students || students.length === 0) return []; // no matching records found

        // Extract the IDs of the matched records
        const studentIds = students.map(student => student._id);

        filter.student = { $in: studentIds }; // Use $in to match any of the found records
    }

    if (batchyearid) filter.batchYear = batchyearid;

    if (academicyear && !batchyearid) {
        // get batchYears that match academicYear name partially
        const batchYears = await batchYearService.getBatchYears({ academicyear: academicyear });
        if (!batchYears || batchYears.length === 0) return []; // no matching records found

        // Extract the IDs of the matched records
        const batchYearIds = batchYears.map(batchYear => batchYear._id);

        filter.batchYear = { $in: batchYearIds }; // Use $in to match any of the found records
    }


    const studentYearSummaries = await StudentYearSummary.find(filter)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'batchYear', select: BATCH_YEAR }
        ])
        .sort({ createdAt: -1 }); // Sort newest first
    return studentYearSummaries;
}

async function getStudentYearSummaryById(id) {
    const studentYearSummaryData = await StudentYearSummary.findById(id)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'batchYear', select: BATCH_YEAR }
        ]);
    return studentYearSummaryData;
}

async function updateStudentYearSummary(id, data) {
    const updated = await StudentYearSummary.findByIdAndUpdate(id, data, { new: true })
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'batchYear', select: BATCH_YEAR }
        ]);
    return updated;
}

async function deleteStudentYearSummary(id) {
    const deleted = await StudentYearSummary.findByIdAndDelete({ _id: id });
    return deleted;
}

async function deleteAllStudentYearSummariesByStdId(id) {
    const deleted = await StudentYearSummary.deleteMany({ student: id });
    return deleted;
}

module.exports = {
    createStudentYearSummary,
    getStudentYearSummaries,
    getStudentYearSummaryById,
    updateStudentYearSummary,
    deleteStudentYearSummary,
    deleteAllStudentYearSummariesByStdId,
};  
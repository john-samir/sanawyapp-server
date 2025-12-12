const mongoose = require("mongoose");
const Points = require('../models/Points');
const studentService = require('../services/studentService');
const batchYearService = require('../services/batchYearService');
const pointTypeService = require('../services/pointTypeService');
const studentYearSummaryService = require("../services/studentYearSummaryService");

const AppError = require('../utils/AppError');

//Constants
const { STUDENT, BATCH_YEAR, POINT_TYPE, ERROR_MESSAGES } = require('../utils/constants');

async function createPoint(data) {
    const pointData = await (await Points.create(data))
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'batchYear', select: BATCH_YEAR },
            { path: 'type', select: POINT_TYPE }
        ]);

    // Update StudentYearSummary (if record exists) or Create (if not existing) 
    const updatedSummary = await updateStudentYearSummary({
        studentId: pointData.student._id.toString(),
        batchYearId: pointData.batchYear._id.toString()
    });

    return pointData;
}

async function getPoints(query) {
    const { id, studentid, student, batchyearid, academicyear, typeid, type, date, sourcetype, sourceid } = query;
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

    if (typeid) filter.type = typeid;
    if (type && !typeid) {
        // get Points with Type that match Point type name partially
        const types = await pointTypeService.getPointTypes({ q: type });
        if (!types || types.length === 0) return []; // no matching records found

        // Extract the IDs of the matched records
        const pointTypeIds = types.map(pointTypeObj => pointTypeObj._id);

        filter.type = { $in: pointTypeIds }; // Use $in to match any of the found records
    }

    if (sourcetype) {
        filter["source.sourceType"] = sourcetype;
    }

    if (sourceid) {
        filter["source.sourceId"] = sourceid;
    }

    if (date) {
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        filter.date = dateObj;
    }

    let sort = { createdAt: -1 }; //Descending

    const points = await Points.find(filter)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'batchYear', select: BATCH_YEAR },
            { path: 'type', select: POINT_TYPE }
        ])
        .sort(sort);

    return points;
}

async function getPointById(id) {
    const pointData = await Points.findById(id)
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'batchYear', select: BATCH_YEAR },
            { path: 'type', select: POINT_TYPE }
        ]);

    return pointData;
}

async function updatePoint(id, data) {
    const updated = await Points.findByIdAndUpdate(id, data, { new: true })
        .populate([
            { path: 'student', select: STUDENT },
            { path: 'batchYear', select: BATCH_YEAR },
            { path: 'type', select: POINT_TYPE }
        ]);

    // Update StudentYearSummary (if record exists) or Create (if not existing) 
    const updatedSummary = await updateStudentYearSummary({
        studentId: updated.student._id.toString(),
        batchYearId: updated.batchYear._id.toString()
    });

    return updated;
}

async function deletePoint(id) {
    const deleted = await Points.findByIdAndDelete({ _id: id });

    if (!deleted) return null;

    // Update StudentYearSummary (if record exists) or Create (if not existing) 
    const updatedSummary = await updateStudentYearSummary({
        studentId: deleted.student.toString(),
        batchYearId: deleted.batchYear.toString()
    });

    return deleted;
}

async function getStudentTotals(query) {
    const { studentid, batchyearid } = query;

    const totalPoints = await calculateStudentTotalPoints({ studentId: studentid, batchYearId: batchyearid });

    return totalPoints;
}


module.exports = {
    createPoint,
    getPoints,
    getPointById,
    updatePoint,
    deletePoint,
    getStudentTotals,
    deleteAllPointsByStudentId,
};


/// Helper Functions

async function calculateStudentTotalPoints({ studentId, batchYearId }) {

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new AppError(ERROR_MESSAGES.STUDENT.NOT_FOUND, 404);
    }

    const matchStage = {
        student: mongoose.Types.ObjectId.createFromHexString(studentId)
    };

    // Only add year filter if yearid is provided
    if (batchYearId) {
        if (!mongoose.Types.ObjectId.isValid(batchYearId)) {
            throw new AppError(ERROR_MESSAGES.BATCH_YEAR.NOT_FOUND, 404);
        }

        matchStage.batchYear = mongoose.Types.ObjectId.createFromHexString(batchYearId);
    }

    const agg = await Points.aggregate([
        {
            $match: matchStage
        },
        {
            $facet: {
                groupedByType: [
                    {
                        $group: {
                            _id: "$source.sourceType",
                            total: { $sum: "$points" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            sourceType: "$_id",
                            total: 1,
                            count: 1,
                        }
                    }
                ],
                overallTotal: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$points" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            total: 1,
                            count: 1
                        }
                    }
                ]
            }
        }
    ]);

    return agg;
}


async function updateStudentYearSummary({ studentId, batchYearId }) {
    //get Total Points for the student in the batchYear.
    const totalsAgg = await calculateStudentTotalPoints({
        studentId: studentId,
        batchYearId: batchYearId
    });

    // Extract totals
    let totalAttendance = 0;
    let totalConfessions = 0;
    let totalMass = 0;
    let totalPoints = 0;

    if (totalsAgg.length > 0) {
        const grouped = totalsAgg[0].groupedByType || [];
        const overall = totalsAgg[0].overallTotal || [];

        totalAttendance = grouped.find(g => g.sourceType === 'attendance')?.count || 0;
        totalConfessions = grouped.find(g => g.sourceType === 'confession')?.count || 0;
        totalMass = grouped.find(g => g.sourceType === 'mass')?.count || 0;

        totalPoints = overall[0]?.total || 0;
    }

    // get StudentYearSummary
    const summaries = await studentYearSummaryService.getStudentYearSummaries({
        studentid: studentId,
        batchyearid: batchYearId
    });

    let summary;

    if (summaries.length === 0) {
        // Create summary
        summary = await studentYearSummaryService.createStudentYearSummary({
            student: studentId,
            batchYear: batchYearId,
            totalAttendance: totalAttendance,
            totalConfessions: totalConfessions,
            totalMass: totalMass,
            totalPoints: totalPoints,
        });

    } else {
        // Update summary
        const existingSummary = summaries[0];

        summary = await studentYearSummaryService.updateStudentYearSummary(
            existingSummary._id,
            {
                totalAttendance: totalAttendance,
                totalConfessions: totalConfessions,
                totalMass: totalMass,
                totalPoints: totalPoints,
            }
        );
    }

    return summary;
}


async function deleteAllPointsByStudentId(id) {

    const deleted = await Points.deleteMany({ student: id });
    return deleted;

    // const points = await Points.find({ student: id });

    // for (const point of points) {
    //     await deletePoint(point._id);
    // }
    // return;
}



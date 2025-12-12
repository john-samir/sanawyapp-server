const studentYearSummaryService = require('../services/studentYearSummaryService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createStudentYearSummary(req, res, next) {
    try {
        const studentYearSummaryData = await studentYearSummaryService.createStudentYearSummary(req.body);
        return successResponse(res, studentYearSummaryData, 201);
    } catch (err) {
        next(err);
    }
}

async function getStudentYearSummaries(req, res, next) {
    try {
        const studentYearSummaries = await studentYearSummaryService.getStudentYearSummaries(req.query);
        return successResponse(res, studentYearSummaries);
    } catch (err) {
        next(err);
    }
}

async function getStudentYearSummaryById(req, res, next) {
    try {
        const studentYearSummaryData = await studentYearSummaryService.getStudentYearSummaryById(req.params.id);

        if (!studentYearSummaryData) throw new AppError(ERROR_MESSAGES.STUDENT_YEAR_SUMMARY.NOT_FOUND, 404);

        return successResponse(res, studentYearSummaryData);
    } catch (err) {
        next(err);
    }
}

async function updateStudentYearSummary(req, res, next) {
    try {
        const updated = await studentYearSummaryService.updateStudentYearSummary(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.STUDENT_YEAR_SUMMARY.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteStudentYearSummary(req, res, next) {
    try {
        const deleted = await studentYearSummaryService.deleteStudentYearSummary(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.STUDENT_YEAR_SUMMARY.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createStudentYearSummary,
    getStudentYearSummaries,
    getStudentYearSummaryById,
    updateStudentYearSummary,
    deleteStudentYearSummary,
};
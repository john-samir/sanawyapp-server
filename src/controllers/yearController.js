const yearService = require('../services/yearService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createYear(req, res, next) {
    try {
        const yearData = await yearService.createYear(req.body);
        return successResponse(res, yearData, 201);
        // {
        //     ...yearData.toObject(),
        //     //startDate: yearData.startDate.toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
        //     //endDate: yearData.endDate.toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
        // }
        // );
    } catch (err) {
        next(err);
    }
}

async function getYears(req, res, next) {
    try {
        const years = await yearService.getYears(req.query);
        return successResponse(res, years);
    } catch (err) {
        next(err);
    }
}

async function getYearById(req, res, next) {
    try {
        const yearData = await yearService.getYearById(req.params.id);

        if (!yearData) throw new AppError(ERROR_MESSAGES.YEAR.NOT_FOUND, 404);

        return successResponse(res, yearData);
    } catch (err) {
        next(err);
    }
}

async function updateYear(req, res, next) {
    try {
        const updated = await yearService.updateYear(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.YEAR.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteYear(req, res, next) {
    try {
        const deleted = await yearService.deleteYear(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.YEAR.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createYear,
    getYears,
    getYearById,
    updateYear,
    deleteYear,
};
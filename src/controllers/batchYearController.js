const batchYearService = require('../services/batchYearService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createBatchYear(req, res, next) {
    try {
        const batchYearData = await batchYearService.createBatchYear(req.body);
        return successResponse(res, batchYearData, 201);
    } catch (err) {
        next(err);
    }
}

async function getBatchYears(req, res, next) {
    try {
        const batchYears = await batchYearService.getBatchYears(req.query);
        return successResponse(res, batchYears);
    } catch (err) {
        next(err);
    }
}

async function getBatchYearById(req, res, next) {
    try {
        const batchYearData = await batchYearService.getBatchYearById(req.params.id);

        if (!batchYearData) throw new AppError(ERROR_MESSAGES.BATCH_YEAR.NOT_FOUND, 404);

        return successResponse(res, batchYearData);
    } catch (err) {
        next(err);
    }
}

async function updateBatchYear(req, res, next) {
    try {
        const updated = await batchYearService.updateBatchYear(req.params.id, req.body);
        
        if (!updated) throw new AppError(ERROR_MESSAGES.BATCH_YEAR.NOT_FOUND, 404);
        
        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteBatchYear(req, res, next) {
    try {
        const deleted = await batchYearService.deleteBatchYear(req.params.id);
        
        if (!deleted) throw new AppError(ERROR_MESSAGES.BATCH_YEAR.NOT_FOUND, 404);
        
        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}


module.exports = {
    createBatchYear,
    getBatchYears,
    getBatchYearById,
    updateBatchYear,
    deleteBatchYear,
};
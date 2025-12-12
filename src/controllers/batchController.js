const batchService = require('../services/batchService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createBatch(req, res, next) {
    try {
        const batchData = await batchService.createBatch(req.body);
        return successResponse(res, batchData, 201);
    } catch (err) {
        next(err);
    }
}

async function getBatches(req, res, next) {
    try {
        const batches = await batchService.getBatches(req.query);
        return successResponse(res, batches);
    } catch (err) {
        next(err);
    }
}

async function getBatchById(req, res, next) {
    try {
        const batchData = await batchService.getBatchById(req.params.id);

        if (!batchData) throw new AppError(ERROR_MESSAGES.BATCH.NOT_FOUND, 404);

        return successResponse(res, batchData);
    } catch (err) {
        next(err);
    }
}

async function updateBatch(req, res, next) {
    try {
        const updated = await batchService.updateBatch(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.BATCH.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteBatch(req, res, next) {
    try {
        const deleted = await batchService.deleteBatch(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.BATCH.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

async function advanceBatch(req, res, next) {
    try {
        const batch = await batchService.advanceBatch(req.params.id, req.params.nextYearId);

        if (!batch) throw new AppError(ERROR_MESSAGES.BATCH.NOT_FOUND, 404);

        return successResponse(res, batch);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createBatch,
    getBatches,
    getBatchById,
    updateBatch,
    deleteBatch,
    advanceBatch,
};
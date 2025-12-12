const pointService = require('../services/pointService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createPoint(req, res, next) {
    try {
        const pointData = await pointService.createPoint(req.body);
        return successResponse(res, pointData, 201);
    } catch (err) {
        next(err);
    }
}

async function getPoints(req, res, next) {
    try {
        const points = await pointService.getPoints(req.query);
        return successResponse(res, points);
    } catch (err) {
        next(err);
    }
}

async function getPointById(req, res, next) {
    try {
        const pointData = await pointService.getPointById(req.params.id);

        if (!pointData) throw new AppError(ERROR_MESSAGES.POINT.NOT_FOUND, 404);

        return successResponse(res, pointData);
    } catch (err) {
        next(err);
    }
}

async function updatePoint(req, res, next) {
    try {
        const updated = await pointService.updatePoint(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.POINT.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deletePoint(req, res, next) {
    try {
        const deleted = await pointService.deletePoint(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.POINT.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

async function getStudentTotals(req, res, next) {
    try {
        const result = await pointService.getStudentTotals(req.query);
        
        if (!result) throw new AppError(ERROR_MESSAGES.POINT.NOT_FOUND, 404);

        return successResponse(res, result);
    } catch (err) {
        next(err);
    }
}


module.exports = {
    createPoint,
    getPoints,
    getPointById,
    updatePoint,
    deletePoint,
    getStudentTotals,
};
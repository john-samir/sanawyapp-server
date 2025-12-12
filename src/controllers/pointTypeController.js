const pointTypeService = require('../services/pointTypeService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createPointType(req, res, next) {
    try {
        const pointTypeData = await pointTypeService.createPointType(req.body);
        return successResponse(res, pointTypeData, 201);
    } catch (err) {
        next(err);
    }
}

async function getPointTypes(req, res, next) {
    try {
        const pointTypes = await pointTypeService.getPointTypes(req.query);
        return successResponse(res, pointTypes);
    } catch (err) {
        next(err);
    }
}

async function getPointTypeById(req, res, next) {
    try {
        const pointTypeData = await pointTypeService.getPointTypeById(req.params.id);

        if (!pointTypeData) throw new AppError(ERROR_MESSAGES.POINT_TYPE.NOT_FOUND, 404);

        return successResponse(res, pointTypeData);
    } catch (err) {
        next(err);
    }
}

async function updatePointType(req, res, next) {
    try {
        const updated = await pointTypeService.updatePointType(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.POINT_TYPE.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deletePointType(req, res, next) {
    try {
        const deleted = await pointTypeService.deletePointType(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.POINT_TYPE.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createPointType,
    getPointTypes,
    getPointTypeById,
    updatePointType,
    deletePointType,
};
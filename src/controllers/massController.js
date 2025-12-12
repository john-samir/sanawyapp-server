const massService = require('../services/massService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createMass(req, res, next) {
    try {
        const massData = await massService.createMass(req.body);
        return successResponse(res, massData, 201);
    } catch (err) {
        next(err);
    }
}

async function getMasses(req, res, next) {
    try {
        const masses = await massService.getMasses(req.query);
        return successResponse(res, masses);
    } catch (err) {
        next(err);
    }
}

async function getMassById(req, res, next) {
    try {
        const massData = await massService.getMassById(req.params.id);

        if (!massData) throw new AppError(ERROR_MESSAGES.MASS.NOT_FOUND, 404);

        return successResponse(res, massData);
    } catch (err) {
        next(err);
    }
}

async function updateMass(req, res, next) {
    try {
        const updated = await massService.updateMass(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.MASS.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteMass(req, res, next) {
    try {
        const deleted = await massService.deleteMass(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.MASS.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createMass,
    getMasses,
    getMassById,
    updateMass,
    deleteMass,
};
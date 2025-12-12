const confessionService = require('../services/confessionService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createConfession(req, res, next) {
    try {
        const confessionData = await confessionService.createConfession(req.body);
        return successResponse(res, confessionData, 201);
    } catch (err) {
        next(err);
    }
}

async function getConfessions(req, res, next) {
    try {
        const confessions = await confessionService.getConfessions(req.query);
        return successResponse(res, confessions);
    } catch (err) {
        next(err);
    }
}

async function getConfessionById(req, res, next) {
    try {
        const confessionData = await confessionService.getConfessionById(req.params.id);

        if (!confessionData) throw new AppError(ERROR_MESSAGES.CONFESSION.NOT_FOUND, 404);

        return successResponse(res, confessionData);
    } catch (err) {
        next(err);
    }
}

async function updateConfession(req, res, next) {
    try {
        const updated = await confessionService.updateConfession(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.CONFESSION.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteConfession(req, res, next) {
    try {
        const deleted = await confessionService.deleteConfession(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.CONFESSION.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createConfession,
    getConfessions,
    getConfessionById,
    updateConfession,
    deleteConfession,
};
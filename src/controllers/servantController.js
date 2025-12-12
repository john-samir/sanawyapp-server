const servantService = require('../services/servantService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createServant(req, res, next) {
    try {
        const servantData = await servantService.createServant(req.body);
        return successResponse(res, servantData, 201);
    } catch (err) {
        next(err);
    }
}

async function getServants(req, res, next) {
    try {
        const servants = await servantService.getServants(req.query);
        return successResponse(res, servants);
    } catch (err) {
        next(err);
    }
}

async function getServantById(req, res, next) {
    try {
        const servantData = await servantService.getServantById(req.params.id);

        if (!servantData) throw new AppError(ERROR_MESSAGES.SERVANT.NOT_FOUND, 404);

        return successResponse(res, servantData);
    } catch (err) {
        next(err);
    }
}

async function updateServant(req, res, next) {
    try {
        const updated = await servantService.updateServant(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.SERVANT.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteServant(req, res, next) {
    try {
        const deleted = await servantService.deleteServant(req.params.id);
        if (!deleted) throw new AppError(ERROR_MESSAGES.SERVANT.NOT_FOUND, 404);
        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createServant,
    getServants,
    getServantById,
    updateServant,
    deleteServant,
};
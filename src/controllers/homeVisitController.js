const homeVisitService = require('../services/homeVisitService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createHomeVisit(req, res, next) {
    try {
        const homeVisitData = await homeVisitService.createHomeVisit(req.body);
        return successResponse(res, homeVisitData, 201);
    } catch (err) {
        next(err);
    }
}

async function getHomeVisits(req, res, next) {
    try {
        const homeVisits = await homeVisitService.getHomeVisits(req.query);
        return successResponse(res, homeVisits);
    } catch (err) {
        next(err);
    }
}

async function getHomeVisitById(req, res, next) {
    try {
        const homeVisitData = await homeVisitService.getHomeVisitById(req.params.id);

        if (!homeVisitData) throw new AppError(ERROR_MESSAGES.HOME_VISIT.NOT_FOUND, 404);

        return successResponse(res, homeVisitData);
    } catch (err) {
        next(err);
    }
}

async function updateHomeVisit(req, res, next) {
    try {
        const updated = await homeVisitService.updateHomeVisit(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.HOME_VISIT.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteHomeVisit(req, res, next) {
    try {
        const deleted = await homeVisitService.deleteHomeVisit(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.HOME_VISIT.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createHomeVisit,
    getHomeVisits,
    getHomeVisitById,
    updateHomeVisit,
    deleteHomeVisit,
};
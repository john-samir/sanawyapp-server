const classService = require('../services/classService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createClass(req, res, next) {
    try {
        const classData = await classService.createClass(req.body);
        return successResponse(res, classData, 201);
    } catch (err) {
        next(err);
    }
}

async function getClasses(req, res, next) {
    try {
        const classes = await classService.getClasses(req.query);
        return successResponse(res, classes);
    } catch (err) {
        next(err);
    }
}

async function getClassById(req, res, next) {
    try {
        const classData = await classService.getClassById(req.params.id);

        if (!classData) throw new AppError(ERROR_MESSAGES.CLASS.NOT_FOUND, 404);

        return successResponse(res, classData);
    } catch (err) {
        next(err);
    }
}

async function updateClass(req, res, next) {
    try {
        const updated = await classService.updateClass(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.CLASS.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteClass(req, res, next) {
    try {
        const deleted = await classService.deleteClass(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.CLASS.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass,
};
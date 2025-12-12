const attendanceService = require('../services/attendanceService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createAttendance(req, res, next) {
    try {
        const attendanceData = await attendanceService.createAttendance(req.body);
        return successResponse(res, attendanceData, 201);
    } catch (err) {
        next(err);
    }
}

async function getAttendances(req, res, next) {
    try {
        const attendances = await attendanceService.getAttendances(req.query);
        return successResponse(res, attendances);
    } catch (err) {
        next(err);
    }
}

async function getAttendanceById(req, res, next) {
    try {
        const attendanceData = await attendanceService.getAttendanceById(req.params.id);

        if (!attendanceData) throw new AppError(ERROR_MESSAGES.ATTENDANCE.NOT_FOUND, 404);

        return successResponse(res, attendanceData);
    } catch (err) {
        next(err);
    }
}

async function updateAttendance(req, res, next) {
    try {
        const updated = await attendanceService.updateAttendance(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.ATTENDANCE.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteAttendance(req, res, next) {
    try {
        const deleted = await attendanceService.deleteAttendance(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.ATTENDANCE.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createAttendance,
    getAttendances,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
};
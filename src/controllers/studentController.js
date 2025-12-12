const studentService = require('../services/studentService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/helpers');

//Constants
const { ERROR_MESSAGES } = require('../utils/constants');

async function createStudent(req, res, next) {
    try {
        const student = await studentService.createStudent(req.body);
        return successResponse(res, student, 201);
    } catch (err) {
        next(err);
    }
}

async function getStudents(req, res, next) {
    try {
        const students = await studentService.getStudents(req.query);
        return successResponse(res, students);
    } catch (err) {
        next(err);
    }
}

async function getStudentById(req, res, next) {
    try {
        const student = await studentService.getStudentById(req.params.id);

        if (!student) throw new AppError(ERROR_MESSAGES.STUDENT.NOT_FOUND, 404);

        return successResponse(res, student);
    } catch (err) {
        next(err);
    }
}

async function updateStudent(req, res, next) {
    try {
        const updated = await studentService.updateStudent(req.params.id, req.body);

        if (!updated) throw new AppError(ERROR_MESSAGES.STUDENT.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function deleteStudent(req, res, next) {
    try {
        const deleted = await studentService.deleteStudent(req.params.id);

        if (!deleted) throw new AppError(ERROR_MESSAGES.STUDENT.NOT_FOUND, 404);

        return successResponse(res, deleted);
    } catch (err) {
        next(err);
    }
}

async function excludeStudent(req, res, next) {
    try {
        const updated = await studentService.excludeStudent(req.params.id);

        if (!updated) throw new AppError(ERROR_MESSAGES.STUDENT.NOT_FOUND, 404);

        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}

async function includeStudent(req, res, next) {
    try {
        const updated = await studentService.includeStudent(req.params.id);
        
        if (!updated) throw new AppError(ERROR_MESSAGES.STUDENT.NOT_FOUND, 404);
        
        return successResponse(res, updated);
    } catch (err) {
        next(err);
    }
}



module.exports = {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    excludeStudent,
    includeStudent
};
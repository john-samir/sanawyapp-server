const AppError = require('../utils/AppError');
const { ERROR_MESSAGES } = require("../utils/constants");

module.exports = (err, req, res, next) => {
    console.error("🔥 ERROR:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
        ...err
    });

    // If this is an AppError → Use its message and status
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode
        });
    }

    // Joi Validation Error
    if (err.isJoi) {
        const formattedErrors = err.details.map(e => ({
            field: e.path.join("."),
            message: e.message.replace(/["]+/g, '') // remove quotes in messages
        }));

        return res.status(400).json({
            success: false,
            message: ERROR_MESSAGES.GENERAL.VALIDATION_ERROR,
            errors: formattedErrors,
            statusCode: 400
        });
    }

    // Handle Mongoose Duplicate Key
    if (err.code === 11000) {
        const fields = Object.keys(err.keyValue).join(", ");
        return res.status(400).json({
            success: false,
            message: ERROR_MESSAGES.GENERAL.DUPLICATE_KEY.replace("{fields}", fields),
            statusCode: 400
        });
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const formattedErrors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));

        return res.status(400).json({
            success: false,
            message: ERROR_MESSAGES.GENERAL.VALIDATION_ERROR,
            errors: formattedErrors,
            statusCode: 400
        });
    }

    // Handle bad Mongo IDs
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`,
            statusCode: 400
        });
    }

    // Fallback (unexpected errors)
    return res.status(500).json({
        success: false,
        message: ERROR_MESSAGES.GENERAL.SERVER_ERROR,
        statusCode: 500
    });
};
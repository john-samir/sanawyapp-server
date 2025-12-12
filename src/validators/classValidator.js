const Joi = require("joi");

// Reusable ObjectId rule
const objectId = Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid ID format");

// Create Class (POST /class)
exports.createClassSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().min(2).max(50).required().messages({
            "string.base": "Class name must be a string",
            "string.empty": "Class name cannot be empty",
            "string.min": "Class name must be at least 2 characters long",
            "string.max": "Class name must be at most 50 characters long",
            "any.required": "Class name is required"
        })
    })
        .unknown(false)
        .messages({
            "object.unknown": "Unexpected fields in request body"
        }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this endpoint"
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    })
});


// Update Class (PUT /class/:id)
exports.updateClassSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().min(2).max(50).messages({
            "string.base": "Class name must be a string",
            "string.min": "Class name must be at least 2 characters long",
            "string.max": "Class name must be at most 50 characters long"
        })
    })
        .unknown(false)
        .messages({
            "object.unknown": "Unexpected fields in request body"
        }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Class ID is required"
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    })
});


// Query Classes (GET /class)
exports.classQuerySchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "Request body is not allowed for this endpoint"
    }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this endpoint"
    }),

    query: Joi.object({
        id: objectId.messages({
            "string.pattern.base": "id must be a valid MongoDB ObjectId"
        }),
        q: Joi.string().trim().messages({
            "string.base": "Search keyword must be a string"
        })
    })
        .unknown(false)
        .messages({
            "object.unknown": "Unexpected query parameters"
        })
});


// Param-only (GET /class/:id, DELETE /class/:id)
exports.classParamOnlySchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "Request body is not allowed for this endpoint"
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Class ID is required"
        })
    })
});
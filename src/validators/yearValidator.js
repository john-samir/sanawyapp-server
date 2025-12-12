const Joi = require("joi");

// Reusable ObjectId validation rule
const objectId = Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid ID format");


// Create Year (POST /year)
exports.createYearSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().min(2).max(50).required().messages({
            "string.base": "Year name must be a string",
            "string.empty": "Year name cannot be empty",
            "string.min": "Year name must be at least 2 characters long",
            "string.max": "Year name must be at most 50 characters long",
            "any.required": "Year name is required"
        }),

        description: Joi.string().trim().max(200).optional().messages({
            "string.base": "Description must be a string",
            "string.max": "Description cannot exceed 200 characters"
        })
    })
        .unknown(false).messages({
            "object.unknown": "Unexpected fields in request body"
        }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this endpoint"
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    })
});


// Update Year (PUT /year/:id)
exports.updateYearSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().min(2).max(50).messages({
            "string.base": "Year name must be a string",
            "string.min": "Year name must be at least 2 characters long",
            "string.max": "Year name must be at most 50 characters long"
        }),

        description: Joi.string().trim().max(200).messages({
            "string.base": "Description must be a string",
            "string.max": "Description cannot exceed 200 characters"
        })
    })
        .unknown(false).messages({
            "object.unknown": "Unexpected fields in request body"
        }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Year ID is required"
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    })
});


// Query Years (GET /year)
exports.yearQuerySchema = Joi.object({
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
        .unknown(false).messages({
            "object.unknown": "Unexpected query parameters"
        })
});


// Param-only (GET /year/:id, DELETE /year/:id)
exports.yearParamOnlySchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "Request body is not allowed for this endpoint"
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Year ID is required"
        })
    })
});

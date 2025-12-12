const Joi = require("joi");

// Reusable ObjectId validator
const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "Invalid ID format — must be a valid MongoDB ObjectId."
    });


// Create PointType Validator (POST /)
exports.createPointTypeSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().min(2).max(60).required().messages({
            "any.required": "Point Type name is required.",
            "string.min": "Point Type name must be at least 2 characters.",
            "string.max": "Point Type name cannot exceed 60 characters."
        }),

        value: Joi.number().integer().min(1).required().messages({
            "any.required": "Value field is required.",
            "number.base": "Value must be numeric.",
            "number.integer": "Value must be a whole number (no decimals).",
            "number.min": "Value must be a positive number greater than 0."
        }),

        description: Joi.string().max(500).optional().allow("").messages({
            "string.max": "Description cannot exceed 500 characters."
        })
    }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed when creating a Point Type."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed when creating a Point Type."
    })
});


// Query PointType Validator (GET /)
exports.pointTypeQuerySchema = Joi.object({
    query: Joi.object({
        id: objectId.optional().messages({
            "string.pattern.base": "Point Type ID must be a valid ObjectId."
        }),

        q: Joi.string().optional().messages({
            "string.base": "Search value (q) must be a string."
        })
    }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed when creating a Point Type."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this endpoint."
    })
});


// Update PointType Validator (PUT /:id)
exports.updatePointTypeSchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Point Type ID is required for update.",
            "string.pattern.base": "Point Type ID is invalid."
        })
    }),

    body: Joi.object({
        name: Joi.string().min(2).max(60).optional().messages({
            "string.min": "Point Type name must be at least 2 characters.",
            "string.max": "Point Type name cannot exceed 60 characters."
        }),

        value: Joi.number().integer().min(1).optional().messages({
            "number.base": "Value must be numeric.",
            "number.integer": "Value must be a whole number.",
            "number.min": "Value must be a positive number greater than 0."
        }),

        description: Joi.string().max(500).optional().allow("")
            .messages({
                "string.max": "Description cannot exceed 500 characters."
            })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed in update Point Type."
    })
});


// Get/Delete by ID (Reusable for GET /:id, DELETE /:id)
exports.pointTypeParamOnlySchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Point Type ID is required.",
            "string.pattern.base": "Point Type ID must be a valid MongoDB ObjectId."
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed in update Point Type."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this endpoint."
    })
});

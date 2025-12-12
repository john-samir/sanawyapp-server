const Joi = require("joi");

// Reusable ObjectId validation rule
const objectId = Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid ID format");


// Create Batch (POST /batch)
exports.createBatchSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().min(2).max(50).required().messages({
            "string.base": "Batch name must be a string",
            "string.empty": "Batch name cannot be empty",
            "string.min": "Batch name must be at least 2 characters long",
            "string.max": "Batch name must be at most 50 characters long",
            "any.required": "Batch name is required"
        }),

        description: Joi.string().trim().max(200).optional().messages({
            "string.base": "Description must be a string",
            "string.max": "Description cannot exceed 200 characters"
        }),

        currYear: objectId.required().messages({
            "any.required": "Current year ID is required",
            "string.pattern.base": "currYear must be a valid MongoDB ObjectId"
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


// Update Batch (PUT /batch/:id)
exports.updateBatchSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().min(2).max(50).messages({
            "string.base": "Batch name must be a string",
            "string.min": "Batch name must be at least 2 characters long",
            "string.max": "Batch name must be at most 50 characters long"
        }),

        description: Joi.string().trim().max(200).messages({
            "string.base": "Description must be a string",
            "string.max": "Description cannot exceed 200 characters"
        }),

        currYear: objectId.messages({
            "string.pattern.base": "currYear must be a valid MongoDB ObjectId"
        })
    })
        .unknown(false).messages({
            "object.unknown": "Unexpected fields in request body"
        }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Batch ID is required"
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    })
});


// Query Batches (GET /batch)
exports.batchQuerySchema = Joi.object({
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
            "string.base": "Search keyword must be a string (batch name)"
        }),

        curryear: Joi.string()
            .trim()
            .messages({
                "string.base": "curryear must be a string (year name)"
            })
    })
        .unknown(false).messages({
            "object.unknown": "Unexpected query parameters"
        })
});


// Param-only (GET /batch/:id, DELETE)
exports.batchParamOnlySchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "Request body is not allowed for this endpoint"
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Batch ID is required"
        })
    })
});


// Advance Batch (PUT /advance-batch/:id/:nextYearId)
exports.advanceBatchSchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "Request body is not allowed for this endpoint"
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Batch ID is required"
        }),

        nextYearId: objectId.required().messages({
            "any.required": "Next year ID is required"
        })
    })
});

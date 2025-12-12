const Joi = require("joi");

// Reusable ObjectId validator
const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "Invalid ID format — must be a valid MongoDB ObjectId."
    });

// Create HomeVisit Validator (POST)
exports.createHomeVisitSchema = Joi.object({
    body: Joi.object({
        student: objectId.required().messages({
            "any.required": "Student ID is required.",
            "string.pattern.base": "Student ID must be a valid ObjectId."
        }),

        visitDate: Joi.date().required().messages({
            "any.required": "Visit date is required.",
            "date.base": "Visit date must be a valid date."
        }),

        servants: Joi.array().items(objectId).required().min(1).messages({
            "any.required": "At least one servant is required.",
            "array.base": "Servants field must be an array.",
            "array.min": "At least one servant is required.",
            "string.pattern.base": "Each servant ID must be a valid ObjectId."
        }),

        notes: Joi.string().optional().messages({
            "string.base": "Notes must be a string."
        }),

        batchYear: Joi.forbidden().messages({
            "any.unknown": "BatchYear field is not allowed. It is automatically set based on student data."
        }),

        class: Joi.forbidden().messages({
            "any.unknown": "Class field is not allowed. It is automatically set based on student data."
        })
    }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed for creating a HomeVisit record."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for creating a HomeVisit record."
    })
});

// HomeVisit Query Validator (GET /)
exports.homeVisitQuerySchema = Joi.object({
    query: Joi.object({
        id: objectId.optional().messages({
            "string.pattern.base": "HomeVisit ID must be a valid ObjectId."
        }),

        studentid: objectId.optional().messages({
            "string.pattern.base": "Student ID filter must be a valid ObjectId."
        }),

        student: Joi.string().optional().messages({
            "string.base": "Student search value must be a string."
        }),

        batchyearid: objectId.optional().messages({
            "string.pattern.base": "BatchYear ID must be a valid ObjectId."
        }),

        academicyear: Joi.string().optional().messages({
            "string.base": "Academic year filter must be a string."
        }),

        classname: Joi.string().optional().messages({
            "string.base": "Class name filter must be a string."
        }),

        servantid: objectId.optional().messages({
            "string.pattern.base": "Servant ID filter must be a valid ObjectId."
        }),

        servant: Joi.string().optional().messages({
            "string.base": "Servant name filter must be a string."
        }),

        date: Joi.date().optional().messages({
            "date.base": "Date filter must be a valid date."
        })
    }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed while filtering HomeVisit records."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this endpoint."
    })
});

// Update HomeVisit Validator (PUT /:id)
exports.updateHomeVisitSchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "HomeVisit ID is required for update.",
            "string.pattern.base": "HomeVisit ID is invalid."
        })
    }),

    body: Joi.object({
        visitDate: Joi.date().optional().messages({
            "date.base": "Updated visit date must be a valid date."
        }),

        student: Joi.forbidden().messages({
            "any.unknown": "Updating the Student field is not allowed."
        }),

        batchYear: Joi.forbidden().messages({
            "any.unknown": "Updating the BatchYear field is not allowed."
        }),

        class: Joi.forbidden().messages({
            "any.unknown": "You cannot update class. It is automatically updated."
        }),

        servants: Joi.array().items(objectId).optional().messages({
            "array.base": "Servants field must be an array of ObjectIds.",
            "string.pattern.base": "Each servant ID must be a valid ObjectId."
        }),

        notes: Joi.string().optional().messages({
            "string.base": "Notes must be a string."
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for update."
    })
});

// Reusable Param ID Schema (GET /:id & DELETE /:id)
exports.homeVisitParamOnlySchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "HomeVisit ID is required.",
            "string.pattern.base": "HomeVisit ID must be a valid MongoDB ObjectId."
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this operation."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this operation."
    })
});

const Joi = require("joi");

// 🔹 ObjectId reusable validator
const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "The provided ID is invalid — must be a valid MongoDB ObjectId."
    });

// Create Confession Validator
exports.createConfessionSchema = Joi.object({
    body: Joi.object({
        student: objectId.optional().messages({
            "string.pattern.base": "Student ID must be a valid ObjectId."
        }),

        mobileNumber: Joi.string().optional().messages({
            "string.base": "Mobile number must be a valid string."
        }),

        date: Joi.date().required().messages({
            "any.required": "Confession date is required.",
            "date.base": "Confession date must be a valid date."
        }),

        class: Joi.forbidden().messages({
            "any.unknown": "You cannot specify class. It is automatically derived from the student."
        }),

        batchYear: Joi.forbidden().messages({
            "any.unknown": "You cannot specify batchYear. It is automatically computed internally."
        }),
    })
        .xor("student", "mobileNumber") // student OR mobileNumber (same logic as service)
        .messages({
            "object.missing": "You must provide either a Student ID or a Mobile Number."
        }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed for this endpoint."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint."
    })
});


// Confession Query Validator (GET /)
exports.confessionQuerySchema = Joi.object({
    query: Joi.object({
        id: objectId.optional().messages({
            "string.pattern.base": "Confession ID must be a valid ObjectId."
        }),

        studentid: objectId.optional().messages({
            "string.pattern.base": "Student ID must be a valid ObjectId."
        }),

        student: Joi.string().optional().messages({
            "string.base": "Student name search must be a string."
        }),

        batchyearid: objectId.optional().messages({
            "string.pattern.base": "BatchYear ID must be a valid ObjectId."
        }),

        academicyear: Joi.string().optional().messages({
            "string.base": "Academic year must be a string value."
        }),

        classname: Joi.string().optional().messages({
            "string.base": "Class name must be a string."
        }),

        date: Joi.date().optional().messages({
            "date.base": "Date filter must be a valid date."
        })
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed when filtering Confessions."
    }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed for this endpoint."
    })
});


// Update Confession Validator (PUT /:id)
exports.updateConfessionSchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Confession ID is required.",
            "string.pattern.base": "Confession ID must be a valid MongoDB ObjectId."
        })
    }),

    body: Joi.object({
        date: Joi.date().optional().messages({
            "date.base": "Updated date must be a valid date."
        }),

        // student & batchYear cannot be updated (service-level rule)
        student: Joi.forbidden().messages({
            "any.unknown": "You cannot update the Student field of a confession."
        }),

        batchYear: Joi.forbidden().messages({
            "any.unknown": "You cannot update the BatchYear field of a confession."
        }),

        class: Joi.forbidden().messages({
            "any.unknown": "You cannot specify class. It is automatically derived from the student."
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint."
    })
});


// Reusable ID Param Validator (GET /:id, DELETE /:id)
exports.confessionParamOnlySchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Confession ID is required.",
            "string.pattern.base": "Confession ID must be a valid MongoDB ObjectId."
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this endpoint."
    })
});



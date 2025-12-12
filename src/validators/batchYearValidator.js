const Joi = require("joi");
const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

// CREATE BatchYear (POST /)
exports.createBatchYearSchema = Joi.object({
    body: Joi.object({
        batch: objectId.required().messages({
            "any.required": "Batch ID is required.",
            "string.empty": "Batch cannot be empty.",
            "string.pattern.base": "Batch ID format is invalid."
        }),

        year: objectId.required().messages({
            "any.required": "Year ID is required.",
            "string.empty": "Year cannot be empty.",
            "string.pattern.base": "Year ID format is invalid."
        }),

        academicYear: Joi.string().required().messages({
            "any.required": "Academic year is required.",
            "string.empty": "Academic Year cannot be empty.",
            "string.base": "Academic year must be a valid string."
        }),

        totalAttendanceCount: Joi.number().integer().min(0).messages({
            "number.base": "Total attendance count must be a number.",
            "number.min": "Total attendance count cannot be negative.",
            "number.integer": "Total attendance count must be a whole number."
        }),

        maxNoOfConfessions: Joi.number().integer().min(0).messages({
            "number.base": "Maximum number of confessions must be a number.",
            "number.min": "Maximum number of confessions cannot be negative.",
            "number.integer": "Maximum number of confessions must be a whole number."
        }),

        startDate: Joi.date().messages({
            "date.base": "Start date must be a valid date."
        }),

        endDate: Joi.date().messages({
            "date.base": "End date must be a valid date."
        })
    }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this request."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed while creating a Batch Year."
    })
});



// GET BatchYears (GET /)
exports.batchYearQuerySchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "This request does not accept a body payload."
    }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this request."
    }),

    query: Joi.object({
        id: objectId.messages({
            "string.pattern.base": "BatchYear ID format is invalid."
        }),

        batchid: objectId.messages({
            "string.pattern.base": "Batch ID format is invalid."
        }),

        batch: Joi.string().messages({
            "string.base": "Batch search text must be a valid string."
        }),

        yearid: objectId.messages({
            "string.pattern.base": "Year ID format is invalid."
        }),

        year: Joi.string().messages({
            "string.base": "Year search text must be a valid string."
        }),

        academicyear: Joi.string().messages({
            "string.base": "Academic year search text must be a string."
        })
    })
});



// UPDATE /:id
exports.updateBatchYearSchema = Joi.object({
    body: Joi.object({
        batch: Joi.forbidden().messages({
            "any.unknown": "Updating the batch is not allowed."
        }),
        
        year: Joi.forbidden().messages({
            "any.unknown": "Updating the year is not allowed."
        }),

        academicYear: Joi.string().messages({
            "string.base": "Academic year must be a valid string."
        }),

        totalAttendanceCount: Joi.number().integer().min(0).messages({
            "number.base": "Total attendance count must be a number.",
            "number.min": "Total attendance count cannot be negative.",
            "number.integer": "Total attendance count must be a whole number."
        }),

        maxNoOfConfessions: Joi.number().integer().min(0).messages({
            "number.base": "Maximum number of confessions must be a number.",
            "number.min": "Maximum number of confessions cannot be negative.",
            "number.integer": "Maximum number of confessions must be a whole number."
        }),

        startDate: Joi.date().messages({
            "date.base": "Start date must be a valid date."
        }),

        endDate: Joi.date().messages({
            "date.base": "End date must be a valid date."
        })

    }).min(1).messages({
        "object.min": "At least one field must be provided to update Batch Year."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed while updating Batch Year."
    }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Batch Year ID is required.",
            "string.pattern.base": "Batch Year ID format is invalid."
        })
    })
});


// GET /:id & DELETE /:id
exports.batchYearParamOnlySchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "Body payload is not allowed for this request."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this request."
    }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Batch Year ID is required.",
            "string.pattern.base": "Batch Year ID format is invalid."
        })
    })
});

const Joi = require("joi");

const objectId = Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid ID format.");


// CREATE
exports.createStudentYearSummarySchema = Joi.object({
    body: Joi.object({
        student: objectId.required().messages({
            "any.required": "Student ID is required.",
            "string.pattern.base": "Student ID is invalid format."
        }),

        batchYear: objectId.required().messages({
            "any.required": "Batch Year ID is required.",
            "string.pattern.base": "Batch Year ID is invalid format."
        }),

        totalAttendance: Joi.number().integer().min(0).messages({
            "number.base": "Total attendance must be a number.",
            "number.min": "Total attendance cannot be negative."
        }),

        totalConfessions: Joi.number().integer().min(0).messages({
            "number.base": "Total confessions must be a number.",
            "number.min": "Total confessions cannot be negative."
        }),

        totalMass: Joi.number().integer().min(0).messages({
            "number.base": "Total mass must be a number.",
            "number.min": "Total mass cannot be negative."
        }),

        totalPoints: Joi.number().integer().messages({
            "number.base": "Total points must be a whole number."
        }),
    }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this request."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for creating summary."
    })
});


// FETCH LIST (GET /)
exports.studentYearSummaryQuerySchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "This request does not accept a body payload."
    }),

    params: Joi.object().max(0).messages({
        "object.max": "This request does not accept URL parameters."
    }),

    query: Joi.object({
        id: objectId.messages({
            "string.pattern.base": "Summary ID format is invalid."
        }),

        studentid: objectId.messages({
            "string.pattern.base": "Student ID format is invalid."
        }),

        student: Joi.string().messages({
            "string.base": "Student search text must be a string."
        }),

        batchyearid: objectId.messages({
            "string.pattern.base": "Batch Year ID format is invalid."
        }),

        academicyear: Joi.string().messages({
            "string.base": "Academic year must be a string."
        })
    })
});



// UPDATE /:id
exports.updateStudentYearSummarySchema = Joi.object({
    body: Joi.object({
        totalAttendance: Joi.number().integer().min(0).messages({
            "number.base": "Total attendance must be a number.",
            "number.min": "Total attendance cannot be negative."
        }),

        totalConfessions: Joi.number().integer().min(0).messages({
            "number.base": "Total confessions must be a number.",
            "number.min": "Total confessions cannot be negative."
        }),

        totalMass: Joi.number().integer().min(0).messages({
            "number.base": "Total mass must be a number.",
            "number.min": "Total mass cannot be negative."
        }),

        totalPoints: Joi.number().integer().messages({
            "number.base": "Total points must be a whole number."
        }),

        batchYear: Joi.forbidden().messages({
            "any.unknown": "You cannot update batch Year. It is locked and managed internally."
        }),

        student: Joi.forbidden().messages({
            "any.unknown": "Student cannot be changed."
        })

    }).min(1).messages({
        "object.min": "At least one field must be provided to update the summary."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for updating summary."
    }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Summary ID is required.",
            "string.pattern.base": "Summary ID format is invalid."
        })
    })
});


// GET /:id
exports.studentYearSummaryParamOnlySchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "Body payload is not allowed in this request."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this request."
    }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Summary ID is required.",
            "string.pattern.base": "Summary ID format is invalid."
        })
    })
});
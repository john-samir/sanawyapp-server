const Joi = require("joi");

// 🔹 Reusable ObjectId validator
const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "Invalid ID format — must be a valid MongoDB ObjectId."
    });


// Create Point Validator (POST /)
exports.createPointSchema = Joi.object({
    body: Joi.object({
        student: objectId.required().messages({
            "any.required": "Student ID is required.",
            "string.pattern.base": "Student ID must be a valid ObjectId."
        }),

        batchYear: objectId.required().messages({
            "any.required": "Batch Year ID is required.",
            "string.pattern.base": "Batch Year ID must be a valid ObjectId."
        }),

        type: objectId.required().messages({
            "any.required": "Point Type ID is required.",
            "string.pattern.base": "Point Type ID must be a valid ObjectId."
        }),

        points: Joi.number()
            .integer()
            .not(0)
            .required()
            .messages({
                "any.required": "Points value is required.",
                "number.base": "Points must be a numeric value.",
                "number.integer": "Points must be a whole number.",
                "any.invalid": "Points cannot be zero."
            }),

        date: Joi.date().required().messages({
            "any.required": "Points date is required.",
            "date.base": "Date must be a valid date."
        }),

        source: Joi.object({
            sourceType: Joi.string()
                .valid("attendance", "confession", "mass", "bonus")
                .required()
                .messages({
                    "any.required": "Source type is required.",
                    "any.only": "Source type must be one of: attendance, confession, mass, bonus."
                }),

            sourceId: objectId.when("sourceType", {
                is: Joi.string().valid("bonus"),
                then: Joi.forbidden().messages({
                    "any.unknown": "sourceId is not allowed when sourceType is 'bonus'."
                }),
                otherwise: objectId.required().messages({
                    "any.required": "sourceId is required for attendance, confession, or mass."
                })
            })
        })
            .required()
            .messages({
                "any.required": "Source details must be provided."
            })
    }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed for creating a point record."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for creating a point record."
    })
});


// Query Points Validator (GET /)
exports.pointQuerySchema = Joi.object({
    query: Joi.object({
        id: objectId.optional().messages({
            "string.pattern.base": "Point ID filter must be a valid ObjectId."
        }),

        studentid: objectId.optional().messages({
            "string.pattern.base": "Student ID filter must be a valid ObjectId."
        }),

        student: Joi.string().optional().messages({
            "string.base": "Student search value must be a string."
        }),

        batchyearid: objectId.optional().messages({
            "string.pattern.base": "Batch Year ID filter must be a valid ObjectId."
        }),

        academicyear: Joi.string().optional().messages({
            "string.base": "Academic year filter must be a string."
        }),

        typeid: objectId.optional().messages({
            "string.pattern.base": "Point Type ID must be a valid ObjectId."
        }),

        type: Joi.string().optional().messages({
            "string.base": "Type search value must be a string."
        }),

        sourcetype: Joi.string()
            .valid("attendance", "confession", "mass", "bonus")
            .optional()
            .messages({
                "any.only": "Source type must be one of: attendance, confession, mass, bonus."
            }),

        sourceid: objectId.optional().messages({
            "string.pattern.base": "Source ID must be a valid ObjectId."
        }),

        date: Joi.date().optional().messages({
            "date.base": "Date filter must be a valid date."
        })
    }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed while filtering point records."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this endpoint."
    })
});


// Update Point Validator (PUT /:id)
// Cannot update student, type, batchYear
exports.updatePointSchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Point ID is required for update.",
            "string.pattern.base": "Point ID is invalid."
        })
    }),

    body: Joi.object({
        points: Joi.number()
            .integer()
            .not(0)
            .optional()
            .messages({
                "number.base": "Points must be a number.",
                "number.integer": "Points must be a whole number.",
                "any.invalid": "Points cannot be zero."
            }),

        date: Joi.date().optional().messages({
            "date.base": "Updated date must be a valid date."
        }),

        source: Joi.object({
            sourceType: Joi.string()
                .valid("attendance", "confession", "mass", "bonus")
                .optional()
                .messages({
                    "any.only": "Source type must be attendance, confession, mass, or bonus."
                }),

            sourceId: objectId.optional().messages({
                "string.pattern.base": "Source ID must be a valid ObjectId."
            })
        }).optional(),

        student: Joi.forbidden().messages({
            "any.unknown": "Updating the Student field is not allowed."
        }),

        batchYear: Joi.forbidden().messages({
            "any.unknown": "Updating the BatchYear field is not allowed."
        }),

        type: Joi.forbidden().messages({
            "any.unknown": "Updating the Point Type is not allowed."
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for update."
    })
});


// Reusable Param Schema for GET /:id & DELETE /:id
exports.pointParamOnlySchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Point ID is required.",
            "string.pattern.base": "Point ID must be a valid MongoDB ObjectId."
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this operation."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this operation."
    })
});


// Totals /points/totals Query Validator
exports.pointTotalsQuerySchema = Joi.object({
    query: Joi.object({
        studentid: objectId.required().messages({
            "any.required": "Student ID is required to calculate totals.",
            "string.pattern.base": "Student ID must be a valid ObjectId."
        }),

        batchyearid: objectId.optional().messages({
            "string.pattern.base": "BatchYear ID must be a valid ObjectId."
        })
    }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed while filtering point records."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this endpoint."
    })
});

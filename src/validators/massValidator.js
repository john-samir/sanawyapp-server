const Joi = require("joi");

// Reusable ObjectId validator
const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "Invalid ID format — must be a valid MongoDB ObjectId."
    });


// Create Mass Validator (POST)
// student OR mobileNumber required
exports.createMassSchema = Joi.object({
    body: Joi.object({
        student: objectId.optional().messages({
            "string.pattern.base": "Student ID must be a valid ObjectId."
        }),

        mobileNumber: Joi.string().optional().messages({
            "string.base": "Mobile number must be a string."
        }),

        date: Joi.date().required().messages({
            "any.required": "Mass date is required.",
            "date.base": "Mass date must be a valid date value."
        }),
        
        batchYear: Joi.forbidden().messages({
            "any.unknown": "Updating the BatchYear field is not allowed."
        }),

        class: Joi.forbidden().messages({
            "any.unknown": "You cannot update class. It is automatically updated."
        }),
    })
        .xor("student", "mobileNumber")
        .messages({
            "object.missing": "You must provide either Student ID or Mobile Number."
        }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed for creating a Mass record."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for creating a Mass record."
    })
});


// Mass Query Validator (GET /)
exports.massQuerySchema = Joi.object({
    query: Joi.object({
        id: objectId.optional().messages({
            "string.pattern.base": "Mass ID must be a valid ObjectId."
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

        date: Joi.date().optional().messages({
            "date.base": "Date filter must be a valid date value."
        })
    }),

    params: Joi.object().max(0).messages({
        "object.max": "Params are not allowed while filtering Mass records."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this endpoint."
    })
});


// Update Mass Validator (PUT /:id)
exports.updateMassSchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Mass ID is required for update.",
            "string.pattern.base": "Mass ID is invalid."
        })
    }),

    body: Joi.object({
        date: Joi.date().optional().messages({
            "date.base": "Updated date must be a valid date."
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
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for update."
    })
});

// Reusable Param ID Schema (GET /:id & DELETE /:id)
exports.massParamOnlySchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Mass ID is required.",
            "string.pattern.base": "Mass ID must be a valid MongoDB ObjectId."
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this operation."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this operation."
    })
});
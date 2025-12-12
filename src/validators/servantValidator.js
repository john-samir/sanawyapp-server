const Joi = require("joi");

// ---------------------------------------------------------
// Reusable ObjectId Validator
// ---------------------------------------------------------
const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "Invalid ID format — must be a valid MongoDB ObjectId."
    });


// Create Servant Validator (POST /)
exports.createServantSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().min(2).max(60).required().messages({
            "any.required": "Servant name is required.",
            "string.min": "Servant name must be at least 2 characters.",
            "string.max": "Servant name cannot exceed 60 characters."
        }),

        email: Joi.string().email().required().messages({
            "any.required": "Email is required.",
            "string.email": "Email format is invalid."
        }),

        mobileNumber: Joi.string().pattern(/^[0-9]{11}$/).required().messages({
            "any.required": "Mobile number is required.",
            "string.pattern.base":
                "Mobile number must contain only numbers with 11 digits."
        }),

        birthDate: Joi.date().optional().messages({
            "date.base": "Birth date must be a valid date."
        }),

        assignedClass: objectId.optional().messages({
            "string.pattern.base": "Assigned Class must be a valid ObjectId."
        }),

        isAdmin: Joi.boolean().optional().messages({
            "boolean.base": "isAdmin must be true or false."
        }),

        isAmin: Joi.boolean().optional().messages({
            "boolean.base": "isAmin must be true or false."
        }),

        passwordHash: Joi.forbidden().messages({
            "any.unknown": "Password cannot be provided manually."
        })
    }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this endpoint"
    }),
    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    })
});


// Query Servants Validator (GET /)
exports.servantQuerySchema = Joi.object({
    query: Joi.object({
        id: objectId.optional(),

        q: Joi.string().optional().messages({
            "string.base": "q must be text."
        }),

        email: Joi.string().optional().messages({
            "string.base": "Email search must be text."
        }),

        mobile: Joi.string().optional().messages({
            "string.base": "Mobile filter must be a string."
        }),

        isadmin: Joi.boolean().truthy('true', '1').falsy('false', '0').optional().messages({
            "boolean.base": "isadmin must be true or false."
        }),

        isamin: Joi.boolean().truthy('true', '1').falsy('false', '0').optional().messages({
            "boolean.base": "isamin must be true or false."
        }),

        assignedclass: Joi.string().optional().messages({
            "string.base": "assignedclass filter must be text (class name)."
        })
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Request body is not allowed for this endpoint"
    }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this endpoint"
    })
});


// Update Servant Validator (PUT /:id)
exports.updateServantSchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Servant ID is required for update.",
            "string.pattern.base": "Servant ID is invalid."
        })
    }),

    body: Joi.object({
        name: Joi.string().min(2).max(60).optional().messages({
            "string.min": "Servant name must be at least 2 characters.",
            "string.max": "Servant name cannot exceed 60 characters."
        }),

        email: Joi.string().email().optional().messages({
            "string.email": "Email format is invalid."
        }),

        mobileNumber: Joi.string().pattern(/^[0-9]{11}$/).optional().messages({
            "string.pattern.base":
                "Mobile number must contain only numbers with 11 digits."
        }),

        birthDate: Joi.date().optional().messages({
            "date.base": "Birth date must be a valid date."
        }),

        assignedClass: objectId.optional().messages({
            "string.pattern.base": "Assigned Class must be a valid ObjectId."
        }),

        isAdmin: Joi.boolean().optional().messages({
            "boolean.base": "isAdmin must be true or false."
        }),

        isAmin: Joi.boolean().optional().messages({
            "boolean.base": "isAmin must be true or false."
        }),

        passwordHash: Joi.forbidden().messages({
            "any.unknown": "Password cannot be updated from this endpoint."
        }),
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    })
});


// Get/Delete By ID Validator (Reused in GET/:id and DELETE/:id)
exports.servantParamOnlySchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Servant ID is required.",
            "string.pattern.base": "Servant ID must be a valid ObjectId."
        })
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Request body is not allowed for this endpoint"
    })
});
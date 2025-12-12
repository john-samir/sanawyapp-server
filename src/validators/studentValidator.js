const Joi = require("joi");

const objectId = Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid ID format.");

// Address Validator
const addressSchema = Joi.object({
    region: Joi.string().required().messages({
        "string.empty": "Region is required"
    }),
    street: Joi.string().required().messages({
        "string.empty": "Street is required"
    }),
    building: Joi.string().required().messages({
        "string.empty": "Building is required"
    }),
    floor: Joi.string().required().messages({
        "string.empty": "Floor is required"
    }),
    apartment: Joi.string().required().messages({
        "string.empty": "Apartment is required"
    }),
    addressDescription: Joi.string().allow(""),
    gpsLocationURL: Joi.string().uri().allow("").messages({
        "string.uri": "GPS Location URL must be a valid URL"
    }),
    latitude: Joi.string().allow(""),
    longitude: Joi.string().allow("")
});


// Create Student Schema
exports.createStudentSchema = Joi.object({
    body: Joi.object({
        fullName: Joi.string().required().messages({
            "string.empty": "Full name is required"
        }),

        image: Joi.string().allow(""),

        class: objectId.required().messages({
            "any.required": "Class ID is required"
        }),

        servant: objectId.required().messages({
            "any.required": "Servant ID is required"
        }),

        batch: objectId.required().messages({
            "any.required": "Batch ID is required"
        }),

        mobileNumber: Joi.string().required().messages({
            "string.empty": "Mobile number is required"
        }),

        whatsAppNumber: Joi.string().allow(""),

        motherName: Joi.string().allow(""),

        frMobileNumber: Joi.string().required().messages({
            "string.empty": "Father mobile number is required"
        }),

        mrMobileNumber: Joi.string().required().messages({
            "string.empty": "Mother mobile number is required"
        }),

        birthDate: Joi.date().required().messages({
            "date.base": "Birth date must be a valid date",
            "any.required": "Birthdate is required"
        }),

        school: Joi.string().allow(""),

        frOfConfession: Joi.string().allow(""),

        isDeacon: Joi.boolean(),

        address: addressSchema.required().messages({
            "any.required": "Address is required"
        }),

        notes: Joi.string().allow(""),

        isExcluded: Joi.boolean()
    })
        .unknown(false)
        .messages({
            "object.unknown": "Unexpected fields in request body"
        }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this endpoint"
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    })
});

// Update Student Schema
exports.updateStudentSchema = Joi.object({
    body: Joi.object({
        fullName: Joi.string(),
        image: Joi.string().allow(""),
        class: objectId,
        servant: objectId,
        mobileNumber: Joi.string(),
        whatsAppNumber: Joi.string().allow(""),
        motherName: Joi.string().allow(""),
        frMobileNumber: Joi.string(),
        mrMobileNumber: Joi.string(),
        birthDate: Joi.date(),
        school: Joi.string().allow(""),
        frOfConfession: Joi.string().allow(""),
        isDeacon: Joi.boolean(),
        address: addressSchema,
        notes: Joi.string().allow(""),
        isExcluded: Joi.boolean()
    })
        .unknown(false)
        .messages({
            "object.unknown": "Unexpected fields in request body"
        }),

    params: Joi.object({
        id: objectId.required()
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    })
});


exports.studentQuerySchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "Request body is not allowed for this endpoint"
    }),

    params: Joi.object().max(0),

    query: Joi.object({
        id: objectId,
        q: Joi.string().allow(""),

        batch: Joi.string().allow("").messages({
            "string.base": "Batch search must be a string"
        }),

        classname: Joi.string().allow("").messages({
            "string.base": "Class name search must be a string"
        }),

        servant: Joi.string().allow("").messages({
            "string.base": "Servant search must be a string"
        }),

        mobile: Joi.string()
            .allow("")
            .messages({ "string.base": "Mobile must be a string" }),

        mobilenumber: Joi.string()
            .allow("")
            .messages({ "string.base": "Mobile number must be a string" }),

        birthmonth: Joi.number()
            .min(1)
            .max(12)
            .messages({
                "number.base": "Birth month must be a number",
                "number.min": "Birth month must be between 1 and 12",
                "number.max": "Birth month must be between 1 and 12"
            }),

        isexcluded: Joi.boolean().messages({
            "boolean.base": "isexcluded must be true or false"
        })
    })
        .unknown(false)
        .messages({
            "object.unknown": "Unexpected query parameters"
        })
});


exports.studentParamOnlySchema = Joi.object({
    body: Joi.object().max(0).messages({
        "object.max": "Request body is not allowed for this endpoint"
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint"
    }),

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Student ID is required"
        })
    })
});
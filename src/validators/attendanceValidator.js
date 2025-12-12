const Joi = require("joi");

const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message("Invalid ID format — must be a valid MongoDB ObjectId");

// CREATE ATTENDANCE
exports.createAttendanceSchema = Joi.object({

    body: Joi.object({

        student: objectId.optional().messages({
            "string.pattern.base": "Student ID is invalid (must be a MongoDB ObjectId)."
        }),

        mobileNumber: Joi.string().trim().optional().messages({
            "string.empty": "Mobile number cannot be empty.",
            "string.base": "Mobile number must be a text value."
        }),

        date: Joi.date().required().messages({
            "any.required": "Attendance date is required.",
            "date.base": "Attendance date must be a valid date."
        }),

        class: Joi.forbidden().messages({
            "any.unknown": "You cannot specify class. It is automatically derived from the student."
        }),

        batchYear: Joi.forbidden().messages({
            "any.unknown": "You cannot specify batchYear. It is automatically computed internally."
        }),

    })
        .custom((body, helpers) => {
            if (!body.student && !body.mobileNumber) {
                return helpers.error("any.custom", {
                    message:
                        "You must provide either a student ID OR a mobile number to identify the student."
                });
            }
            return body;
        })
        .messages({
            "any.custom": "You must provide either a valid student ID or a mobile number.",
            "object.unknown": "Your request contains unrecognized fields. Please remove invalid keys."
        }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this request."
    }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this request."
    })
});



// ATTENDANCE QUERY VALIDATOR (GET MANY)
exports.attendanceQuerySchema = Joi.object({
    query: Joi.object({
        id: objectId.optional().messages({
            "string.pattern.base": "ID filter is invalid (must be ObjectId)."
        }),

        studentid: objectId.optional().messages({
            "string.pattern.base": "studentid must be a valid ObjectId."
        }),

        student: Joi.string().optional().messages({
            "string.base": "student must be text (Student Name)",
            "string.empty": "student cannot be empty."
        }),

        batchyearid: objectId.optional().messages({
            "string.pattern.base": "batchyearid must be a valid ObjectId."
        }),

        academicyear: Joi.string().optional().messages({
            "string.base": "Academic year must be text.",
            "string.empty": "Academic year cannot be empty."
        }),

        classname: Joi.string().optional().messages({
            "string.base": "Class name must be text.",
            "string.empty": "Class name cannot be empty."
        }),

        date: Joi.date().optional().messages({
            "date.base": "Date filter must be a valid date."
        })
    })
        .messages({
            "object.unknown": "Invalid query parameter detected."
        }),

    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this request."
    }),

    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for GET requests."
    })
});



// UPDATE ATTENDANCE
exports.updateAttendanceSchema = Joi.object({

    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Attendance ID is required.",
            "string.pattern.base": "Attendance ID is invalid (must be ObjectId)."
        })
    }),

    body: Joi.object({

        date: Joi.date().optional().messages({
            "date.base": "Date must be a valid date."
        }),

        class: Joi.forbidden().messages({
            "any.unknown": "You cannot update class. It is automatically updated."
        }),

        batchYear: Joi.forbidden().messages({
            "any.unknown": "You cannot update batch Year. It is locked and managed internally."
        }),

        student: Joi.forbidden().messages({
            "any.unknown": "Student cannot be changed for an existing attendance record."
        })

    })
        .messages({
            "object.unknown": "Your request contains invalid fields."
        }),

    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed."
    })
});



// Params Only Validator (for GET by ID, DELETE)
exports.attendanceParamOnlySchema = Joi.object({
    params: Joi.object({
        id: objectId.required().messages({
            "any.required": "Attendance ID is required.",
            "string.pattern.base": "Attendance ID is invalid (must be ObjectId)."
        })
    }),
    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed."
    }),
    body: Joi.object().max(0).messages({
        "object.max": "Body is not allowed for this request."
    })
});

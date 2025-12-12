const Joi = require("joi");

exports.loginSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Please enter a valid email address.",
            "any.required": "Email is required.",
            "string.empty": "Email cannot be empty.",
        }),
        password: Joi.string().min(6).required().messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
            "string.min": "Password must be at least 6 characters long."
        })
    }),
    params: Joi.object().max(0).messages({
        "object.max": "URL parameters are not allowed for this endpoint."
    }),
    query: Joi.object().max(0).messages({
        "object.max": "Query parameters are not allowed for this endpoint."
    }), //query is forbidden
});

exports.changePasswordSchema = Joi.object({
    body: Joi.object({
        currPassword: Joi.string().required().messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
        }),
        newPassword: Joi.string().min(6).required().messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
            "string.min": "Password must be at least 6 characters long."
        })
    }),
    params: Joi.object(),
    query: Joi.object()
});
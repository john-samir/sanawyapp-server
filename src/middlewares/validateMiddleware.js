const AppError = require("../utils/AppError");

module.exports = (schema) => {
    return (req, res, next) => {
        const data = {
            body: req.body,
            params: req.params,
            query: req.query
        };

        const { error } = schema.validate(data, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        });

        if (error) {

            error.isJoi = true; // Mark as Joi
            return next(error);
            // const msg = error.details.map(d => d.message).join(", ");
            // return next(new AppError(msg, 400));
        }

        next();
    };
};
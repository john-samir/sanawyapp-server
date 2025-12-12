const mongoose = require('mongoose');
const pointTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: {
        type: Number,
        required: true,
        min: [1, 'Value must be a positive number'],
        validate: {
            validator: Number.isInteger,
            message: 'Value must be a whole number (no decimals)'
        }
    },
    description: { type: String }
},
    { timestamps: true }
);

pointTypeSchema.index({ name: 1 }, { unique: true });
module.exports = mongoose.model('PointType', pointTypeSchema);

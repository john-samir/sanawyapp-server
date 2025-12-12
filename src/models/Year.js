const mongoose = require('mongoose');
const yearSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
},
    { timestamps: true }
);


yearSchema.index({ name: 1 }, { unique: true });
module.exports = mongoose.model('Year', yearSchema);
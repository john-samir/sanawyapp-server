const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    currYear: { type: mongoose.Schema.Types.ObjectId, ref: 'Year', required: true },
},
    { timestamps: true }
);


batchSchema.index({ name: 1 }, { unique: true });
module.exports = mongoose.model('Batch', batchSchema);
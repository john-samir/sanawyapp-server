const mongoose = require('mongoose');
const studentYearSummarySchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    batchYear: { type: mongoose.Schema.Types.ObjectId, ref: 'BatchYear', required: true },
    totalAttendance: { type: Number, default: 0 },
    totalConfessions: { type: Number, default: 0 },
    totalMass: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 }
},
    { timestamps: true }
);

studentYearSummarySchema.index({ student: 1, batchYear: 1 }, { unique: true });
module.exports = mongoose.model('StudentYearSummary', studentYearSummarySchema);
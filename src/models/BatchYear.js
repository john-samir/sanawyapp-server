const mongoose = require('mongoose');

const batchYearSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year', required: true },
    // Example: "2024-2025" or "2025"
    academicYear: { type: String, required: true },
    totalAttendanceCount: { type: Number, default: 0 },
    maxNoOfConfessions: { type: Number, default: 0 },
    //totalConfessionSessions: { type: Number, default: 0 },

    startDate: { type: Date },
    endDate: { type: Date }
},
    { timestamps: true }
);


batchYearSchema.pre('save', function (next) {
    if (this.startDate) {
        this.startDate.setHours(0, 0, 0, 0); // remove time
    }
    if (this.endDate) {
        this.endDate.setHours(0, 0, 0, 0); // remove time
    }
    next();
});

batchYearSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update.startDate) {
        const date = new Date(update.startDate);
        date.setHours(0, 0, 0, 0); // remove time
        update.startDate = date;
    }
    if (update.endDate) {
        const date = new Date(update.endDate);
        date.setHours(0, 0, 0, 0); // remove time
        update.endDate = date;
    }
    next();
});

batchYearSchema.index({ batch: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('BatchYear', batchYearSchema);
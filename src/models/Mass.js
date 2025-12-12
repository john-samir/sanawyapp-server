const mongoose = require('mongoose');
const massSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },
    batchYear: { type: mongoose.Schema.Types.ObjectId, ref: 'BatchYear', required: true },
},
    { timestamps: true }
);

massSchema.pre('save', function (next) {
    if (this.date) {
        this.date.setHours(0, 0, 0, 0); // remove time
    }
    next();
});

massSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update.date) {
        const date = new Date(update.date);
        date.setHours(0, 0, 0, 0); // remove time
        update.date = date;
    }
    next();
});

massSchema.index({ student: 1, date: 1, batchYear: 1 }, { unique: true });
module.exports = mongoose.model('Mass', massSchema);
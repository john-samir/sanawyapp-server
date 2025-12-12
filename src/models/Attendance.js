const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },
    batchYear: { type: mongoose.Schema.Types.ObjectId, ref: 'BatchYear', required: true },
},
    { timestamps: true }
);

attendanceSchema.pre('save', function (next) {
    if (this.date) {
        this.date.setHours(0, 0, 0, 0); // remove time
    }
    next();
});

attendanceSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update.date) {
        const date = new Date(update.date);
        date.setHours(0, 0, 0, 0); // remove time
        update.date = date;
    }
    next();
});


attendanceSchema.index({ student: 1, date: 1, batchYear: 1 }, { unique: true }); // prevent duplicates
module.exports = mongoose.model('Attendance', attendanceSchema);



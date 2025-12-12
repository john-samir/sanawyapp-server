const mongoose = require('mongoose');
const homeVisitSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    batchYear: { type: mongoose.Schema.Types.ObjectId, ref: 'BatchYear', required: true },
    servants: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Servant' }],
        required: true,
        validate: {
            validator: function (arr) {
                return Array.isArray(arr) && arr.length > 0;
            },
            message: 'At least one servant is required.'
        }
    },
    visitDate: { type: Date, required: true },
    notes: { type: String }
},
    { timestamps: true }
);

homeVisitSchema.pre('save', function (next) {
    if (this.visitDate) {
        this.visitDate.setHours(0, 0, 0, 0); // remove time
    }
    next();
});

homeVisitSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update.visitDate) {
        const date = new Date(update.visitDate);
        date.setHours(0, 0, 0, 0); // remove time
        update.visitDate = date;
    }
    next();
});


homeVisitSchema.index({ student: 1, visitDate: 1 }, { unique: true });
module.exports = mongoose.model('HomeVisit', homeVisitSchema);
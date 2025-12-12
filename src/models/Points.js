const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
    sourceType: {
        type: String,
        enum: ["attendance", "confession", "mass", "bonus"],
        required: true
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: function () {
            return this.sourceType !== "bonus";
        }
    }
}, { _id: false });


const pointsSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    batchYear: { type: mongoose.Schema.Types.ObjectId, ref: 'BatchYear', required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'PointType', required: true },
    points: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return Number.isInteger(v) && v !== 0;
            },
            message: 'Points must be a whole number and cannot be zero.'
        }
    },
    date: { type: Date, required: true },
    source: sourceSchema,
},
    { timestamps: true }
);

pointsSchema.pre('save', function (next) {
    if (this.date) {
        this.date.setHours(0, 0, 0, 0); // remove time
    }
    next();
});

pointsSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update.date) {
        const date = new Date(update.date);
        date.setHours(0, 0, 0, 0); // remove time
        update.date = date;
    }
    next();
});

pointsSchema.index(
    { student: 1, date: 1, batchYear: 1, type: 1 },
    {
        unique: true,
        partialFilterExpression: {
            "source.sourceType": { $in: ["attendance", "confession", "mass"] }
        }
    }
); // Unique index to prevent duplicate points for same student, date, batchYear, and type except for bonus points


module.exports = mongoose.model('Points', pointsSchema);

//const Points = module.exports = mongoose.model('Points', pointsSchema);

// Auto sync indexes in development
// if (process.env.NODE_ENV !== "production") {
//     Points.syncIndexes()
//         .then(() => console.log("Points indexes synced ✔"))
//         .catch(err => console.error("Index sync failed ❌", err));
// }

// module.exports = Points;
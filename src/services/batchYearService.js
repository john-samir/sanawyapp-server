const BatchYear = require('../models/BatchYear');
const yearService = require('../services/yearService');
const batchService = require('../services/batchService');

//Constants
const { BATCH, YEAR } = require('../utils/constants');

async function createBatchYear(data) {
    const batchYearData = (await BatchYear.create(data))
        .populate([
            { path: 'batch', select: BATCH },
            { path: 'year', select: YEAR }
        ]);

    return batchYearData;
}

async function getBatchYears(query) {
    const { id, batchid, batch, yearid, year, academicyear } = query;
    const filter = {};

    if (id) filter._id = id;

    if (batchid) filter.batch = batchid;
    if (batch && !batchid) {
        // get batches that match batch name partially
        const batches = await batchService.getBatches({ q: batch });
        if (!batches || batches.length === 0) return []; // no matching batches found

        // Extract the IDs of the matched batches
        const batchIds = batches.map(batch => batch._id);

        filter.batch = { $in: batchIds }; // Use $in to match any of the found batches
    }

    if (yearid) filter.year = yearid;
    if (year && !yearid) {
        // get years that match currYear name partially
        const years = await yearService.getYears({ q: year });
        if (!years || years.length === 0) return []; // no matching years found

        // Extract the IDs of the matched years
        const yearIds = years.map(year => year._id);

        filter.year = { $in: yearIds }; // Use $in to match any of the found years
    }

    if (academicyear) filter.academicYear = { $regex: academicyear, $options: 'i' };

    const batchYears = await BatchYear.find(filter)
        .populate([
            { path: 'batch', select: BATCH },
            { path: 'year', select: YEAR }
        ])
        .sort({ createdAt: -1 }); // Sort newest first

    return batchYears;
}

async function getBatchYearById(id) {
    const batchYearData = await BatchYear.findById(id)
        .populate([
            { path: 'batch', select: BATCH },
            { path: 'year', select: YEAR }
        ]);
    return batchYearData;
}

async function updateBatchYear(id, data) {
    const updated = await BatchYear.findByIdAndUpdate(id, data, { new: true })
        .populate([
            { path: 'batch', select: BATCH },
            { path: 'year', select: YEAR }
        ]);
    return updated;
}

async function deleteBatchYear(id) {
    const deleted = await BatchYear.findByIdAndDelete({ _id: id });
    return deleted;
}



module.exports = {
    createBatchYear,
    getBatchYears,
    getBatchYearById,
    updateBatchYear,
    deleteBatchYear,
    deleteBatchYearsByBatchId,
};


//Helper functions 

async function deleteBatchYearsByBatchId(batchId) {
    const deleted = await BatchYear.deleteMany({ batch: batchId });
    return deleted;
}
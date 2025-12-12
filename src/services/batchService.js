const Batch = require('../models/Batch');
const yearService = require('../services/yearService');


//Constants
const { YEAR } = require('../utils/constants');

async function createBatch(data) {
    const batchData = await (await Batch.create(data))
        .populate({ path: 'currYear', select: YEAR });

    if (!batchData) return null;

    // create a new BatchYear entry
    const batchYearService = require('../services/batchYearService');
    const currYear = new Date().getFullYear();
    const startDate = new Date();
    const nextYearDate = new Date(startDate);
    nextYearDate.setFullYear(startDate.getFullYear() + 1);
    await batchYearService.createBatchYear({
        batch: batchData._id,
        year: batchData.currYear._id || batchData.currYear,
        academicYear: currYear.toString() + "-" + (currYear + 1).toString(),
        startDate: startDate,
        endDate: nextYearDate
    });

    return batchData;
}

async function getBatches(query) {
    const { id, q, curryear } = query;
    const filter = {};

    if (id) filter._id = id;
    if (curryear) {
        // get years that match currYear name partially
        const years = await yearService.getYears({ q: curryear });
        if (!years || years.length === 0) return []; // no matching years found

        // Extract the IDs of the matched years
        const yearIds = years.map(year => year._id);

        filter.currYear = { $in: yearIds }; // Use $in to match any of the found years
    }
    if (q) filter.name = { $regex: q, $options: 'i' };

    const batches = await Batch.find(filter)
        .populate({ path: 'currYear', select: YEAR })
        .sort({ name: 1 }); // Sort by name ascending order
    return batches;
}

async function getBatchById(id) {
    const batchData = await Batch.findById(id)
        .populate({ path: 'currYear', select: YEAR });
    return batchData;
}

async function updateBatch(id, data) {
    const updated = await Batch.findByIdAndUpdate(id, data, { new: true })
        .populate({ path: 'currYear', select: YEAR });
    return updated;
}

async function deleteBatch(id) {
    const deleted = await Batch.findByIdAndDelete({ _id: id });

    if (!deleted) return null;

    // delete BatchYear entries for the batch
    const batchYearService = require('../services/batchYearService');
    await batchYearService.deleteBatchYearsByBatchId(id);

    return deleted;
}

async function advanceBatch(id, newYearId) {
    const batch = await Batch.findByIdAndUpdate(id, { currYear: newYearId }, { new: true })
        .populate({ path: 'currYear', select: YEAR });

    if (!batch) return null;

    // create a new BatchYear entry
    const batchYearService = require('../services/batchYearService');
    const currYear = new Date().getFullYear();
    const startDate = new Date();
    const nextYearDate = new Date(startDate);
    nextYearDate.setFullYear(startDate.getFullYear() + 1);
    await batchYearService.createBatchYear({
        batch: id,
        year: newYearId,
        academicYear: currYear.toString() + "-" + (currYear + 1).toString(),
        startDate: startDate,
        endDate: nextYearDate
    });

    return batch;
}

module.exports = {
    createBatch,
    getBatches,
    getBatchById,
    updateBatch,
    deleteBatch,
    advanceBatch,
};
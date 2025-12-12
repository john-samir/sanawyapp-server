const Year = require('../models/Year');


async function createYear(data) {
    const yearData = await Year.create(data);
    return yearData;
}

async function getYears(query) {
    const { id, q } = query;
    const filter = {};

    if (id) filter._id = id;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const years = await Year.find(filter).populate('').sort({ name: 1 }); // Sort by name ascending order
    return years;
}

async function getYearById(id) {
    const yearData = await Year.findById(id).populate('');
    return yearData;
}

async function updateYear(id, data) {
    const updated = await Year.findByIdAndUpdate(id, data, { new: true });
    return updated;
}

async function deleteYear(id) {
    const deleted = await Year.findByIdAndDelete({ _id: id });
    return deleted;
}

module.exports = {
    createYear,
    getYears,
    getYearById,
    updateYear,
    deleteYear,
};  
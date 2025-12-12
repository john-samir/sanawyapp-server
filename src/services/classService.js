const Class = require('../models/Class');


async function createClass(data) {
    const classData = await Class.create(data);
    return classData;
}

async function getClasses(query) {
    const { id, q } = query;
    const filter = {};

    if (id) filter._id = id;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const classes = await Class.find(filter).populate('').sort({ name: 1 }); //sort by name ascending
    return classes;
}

async function getClassById(id) {
    const classData = await Class.findById(id).populate('');
    return classData;
}

async function updateClass(id, data) {
    const updated = await Class.findByIdAndUpdate(id, data, { new: true });
    return updated;
}

async function deleteClass(id) {
    const deleted = await Class.findByIdAndDelete({ _id: id });
    return deleted;
}

module.exports = {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass,
};  
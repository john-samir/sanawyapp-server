const Servant = require('../models/Servant');
const classService = require('../services/classService');

//Constants
const { CLASS } = require('../utils/constants');


async function createServant(data) {
    const servantData = await (await Servant.create(data))
        .populate({ path: 'assignedClass', select: CLASS });

    if (!servantData) return null;

    const servant = servantData.toObject();

    //Remove fields from the returned object
    delete servant.passwordHash;

    return servant;
}

async function getServants(query) {
    const { id, q, email, mobile, isadmin, isamin, assignedclass } = query;
    const filter = {};

    if (id) filter._id = id;
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (mobile) filter.mobileNumber = { $regex: mobile, $options: 'i' };
    if (isadmin) filter.isAdmin = isadmin;
    if (isamin) filter.isAmin = isamin;
    if (q) filter.name = { $regex: q, $options: 'i' };

    if (assignedclass) {
        // get classes that match class name partially
        const classes = await classService.getClasses({ q: assignedclass });
        if (!classes || classes.length === 0) return []; // no matching records found

        // Extract the IDs of the matched records
        const classIds = classes.map(classObj => classObj._id);

        filter.assignedClass = { $in: classIds }; // Use $in to match any of the found records
    }

    const servants = await Servant.find(filter)
        .populate({ path: 'assignedClass', select: CLASS })
        .sort({ name: 1 })
        .lean();

    if (!servants) return null;

    servants.forEach(s => {
        delete s.passwordHash;
    });

    return servants;
}

async function getServantById(id) {
    const servantData = await Servant.findById(id)
        .populate({ path: 'assignedClass', select: CLASS })
        .lean();

    if (!servantData) return null;

    delete servantData.passwordHash;
    return servantData;
}

async function updateServant(id, data) {
    const updated = await Servant.findByIdAndUpdate(id, data, { new: true })
        .populate({ path: 'assignedClass', select: CLASS })
        .lean();

    if (!updated) return null;

    delete updated.passwordHash;
    return updated;
}

async function deleteServant(id) {
    const deleted = await Servant.findByIdAndDelete({ _id: id })
        .lean();

    delete deleted.passwordHash;
    return deleted;
}

module.exports = {
    createServant,
    getServants,
    getServantById,
    updateServant,
    deleteServant,
};  
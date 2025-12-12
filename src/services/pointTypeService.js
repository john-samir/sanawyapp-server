const PointType = require('../models/PointType');
const { ATTENDANCE_POINT_TYPES_CONFIG } = require('../utils/constants');

async function createPointType(data) {
    const PointTypeData = await PointType.create(data);
    return PointTypeData;
}

async function getPointTypes(query) {
    const { id, q } = query;
    const filter = {};

    if (id) filter._id = id;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const pointTypes = await PointType.find(filter).populate('').sort({ name: 1 }); // sort by name ascending
    return pointTypes;
}

async function getPointTypeById(id) {
    const PointTypeData = await PointType.findById(id).populate('');
    return PointTypeData;
}

async function updatePointType(id, data) {
    const updated = await PointType.findByIdAndUpdate(id, data, { new: true });
    return updated;
}

async function deletePointType(id) {
    const deleted = await PointType.findByIdAndDelete({ _id: id });
    return deleted;
}

module.exports = {
    createPointType,
    getPointTypes,
    getPointTypeById,
    updatePointType,
    deletePointType,
    getAttendancePointTypeForDateTime,
};  


/// Helper functions
function getAttendancePointTypeForDateTime(date){
    for(const config of ATTENDANCE_POINT_TYPES_CONFIG){
        if(isDateBetween(date, config.start, config.end)){
            return config.pointTypeId;
        }
    }
}

function isDateBetween(date, start, end) {
    const day = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const startTime = new Date(`${day} ${start}`);
    const endTime = new Date(`${day} ${end}`);

    return date >= startTime && date <= endTime;
}
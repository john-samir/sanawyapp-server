const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    region: { type: String, required: true },  // المنطقة
    street: { type: String, required: true },  // الشارع
    building: { type: String, required: true }, // عمارة
    floor: { type: String, required: true },   // الدور
    apartment: { type: String, required: true }, // الشقة
    addressDescription: { type: String },   // تفاصيل اخرى للعنوان
    gpsLocationURL: { type: String }, // GPS Location URL
    latitude: { type: String },  // Latitude
    longitude: { type: String }  // Longitude
}, { _id: false });

const studentSchema = new mongoose.Schema({
    fullName: { type: String, required: true }, // الاسم ثلاثي
    image: { type: String },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    servant: { type: mongoose.Schema.Types.ObjectId, ref: 'Servant', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    mobileNumber: { type: String, required: true }, // رقم المخدوم
    whatsAppNumber: { type: String },    // رقم WhatsApp
    motherName: { type: String },  // اسم الأم
    frMobileNumber: { type: String, required: true },  // الأب
    mrMobileNumber: { type: String, required: true }, // الأم
    birthDate: { type: Date, required: true },     // تاريخ الميلاد
    school: { type: String },      // المدرسة
    frOfConfession: { type: String }, // اب الاعتراف
    isDeacon: { type: Boolean, default: false }, // شماس
    address: addressSchema,
    notes: { type: String },
    isExcluded: { type: Boolean, default: false }
},
    { timestamps: true }
);


studentSchema.pre('save', async function (next) {
    if (this.birthDate) {
        this.birthDate.setHours(0, 0, 0, 0); // remove time
    }

    // Set WhatsApp number same as mobile number
    if (!this.whatsAppNumber && this.mobileNumber) {
        this.whatsAppNumber = this.mobileNumber;
    }

    // Extract latitude & longitude
    if (this.address && this.address.gpsLocationURL) {
        const url = this.address.gpsLocationURL;
        const regex = /([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/;
        const match = url.match(regex);

        if (match) {
            this.address.latitude = match[1];
            this.address.longitude = match[2];
        }else{
            this.address.latitude = undefined;
            this.address.longitude = undefined;
        }
    }

    next();
});

studentSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    if (update.birthDate) {
        const date = new Date(update.birthDate);
        date.setHours(0, 0, 0, 0); // remove time
        update.birthDate = date;
    }

    // Set WhatsApp number same as mobile number
    if (!update.whatsAppNumber && update.mobileNumber) {
        update.whatsAppNumber = update.mobileNumber;
    }

    // Extract latitude & longitude
    if (update.address && update.address.gpsLocationURL) {
        const url = update.address.gpsLocationURL;
        const regex = /([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/;
        const match = url.match(regex);

        if (match) {
            update.address.latitude = match[1];
            update.address.longitude = match[2];
        }else{
            update.address.latitude = undefined;
            update.address.longitude = undefined;
        }
    }
    next();
});


studentSchema.index({ mobileNumber: 1 }, { unique: true });
studentSchema.index({ fullName: 1 }, { unique: true });
module.exports = mongoose.model('Student', studentSchema);
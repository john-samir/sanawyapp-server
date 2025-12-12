const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const servantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobileNumber: { type: String, required: true },
  birthDate: { type: Date },
  assignedClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  isAdmin: { type: Boolean, default: false },
  isAmin: { type: Boolean, default: false },
  passwordHash: { type: String, select: false },
},
  { timestamps: true }
);

// method to set password
servantSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};


// method to check password
servantSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};


servantSchema.pre('save', async function (next) {
  if (this.birthDate) {
    this.birthDate.setHours(0, 0, 0, 0); // remove time
  }

  // if passwordHash is not set, auto-generate based on mobileNumber
  if (!this.passwordHash && this.mobileNumber) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.mobileNumber, salt);
  }

  next();
});

servantSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (update.birthDate) {
    const date = new Date(update.birthDate);
    date.setHours(0, 0, 0, 0); // remove time
    update.birthDate = date;
  }

  if ("passwordHash" in update) {
    delete update.passwordHash;
  }

  next();
});


servantSchema.index({ name: 1 }, { unique: true });
servantSchema.index({ email: 1 }, { unique: true });
servantSchema.index({ mobileNumber: 1 }, { unique: true });
module.exports = mongoose.model('Servant', servantSchema);
const mongoose = require('mongoose');

const designationCountSchema = new mongoose.Schema({
  designation: { type: String, required: true },
  count: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  memtypeCounts: {
    base: { type: Number, default: 0 },
    silver: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    diamond: { type: Number, default: 0 }
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true }
});

designationCountSchema.index({ designation: 1, month: 1, year: 1 }, { unique: true }); // Unique index for combination

const DesignationCount = mongoose.model('DesignationCount', designationCountSchema);

module.exports = DesignationCount;

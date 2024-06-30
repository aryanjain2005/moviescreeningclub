const mongoose = require('mongoose')

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  memtype: {
    type: String,
    enum: ['base', 'silver', 'gold', 'diamond']
  },
  isValid: {
    type: Boolean,
    default: true
  },
  txnId: {
    type: String,
    required: true
  },
  // seconds
  validity: Number,
  availQR: {
    type: Number,
    default: 0
  },
  purchasedate: {
    type: Date,
    default: Date.now
  },
  validitydate: {
    type: Date,
    default: () => new Date(Date.now() + this.validity * 1000)
  }
})

if (!mongoose.models.Membership) {
  mongoose.model('Membership', membershipSchema)
}

module.exports = mongoose.models.Membership

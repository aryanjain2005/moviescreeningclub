const mongoose = require('mongoose')

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  memtype: {
    type: String,
    enum: ['base', 'silver', 'gold', 'diamond', 'filmFest']
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
  amount: {
    type: Number,
    required: true
  },
  purchasedate: {
    type: Date,
    default: Date.now
  },
  validitydate: {
    type: Date,
    default: () => new Date(Date.now() + this.validity * 1000)
  },
  // For Film Fest Pass: tracks which movies have been used
  moviesUsed: {
    type: [mongoose.Schema.Types.ObjectId], // Array of movie IDs (showtimes)
    default: [],
    required: function () {
      return this.memtype === 'filmFest' || this.memtype === 'foodieFilmFest'
    }
  },
  movieCount: {
    type: Number, // Total number of movies allowed for Film Fest Pass
    required: function () {
      return this.memtype === 'filmFest' || this.memtype === 'foodieFilmFest'
    }
  }
})

if (!mongoose.models.Membership) {
  mongoose.model('Membership', membershipSchema)
}

module.exports = mongoose.models.Membership

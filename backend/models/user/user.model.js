const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  usertype: {
    type: String,
    default: 'standard'
  }
})

if (!mongoose.models.User) {
  mongoose.model('User', UserSchema)
}

module.exports = mongoose.models.User

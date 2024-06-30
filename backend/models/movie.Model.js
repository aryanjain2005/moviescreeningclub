const mongoose = require('mongoose')

const ShowtimeSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  date: { type: Date, required: true }
})

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String },
  description: { type: String },
  releaseDate: { type: Date, required: true },
  genre: { type: String, required: true },
  currentscreening: { type: Boolean },
  showtimes: {
    type: [ShowtimeSchema]
  },
  trailer: { type: String }
})

if (!mongoose.models.Movie) {
  mongoose.model('Movie', MovieSchema)
}

module.exports = mongoose.models.Movie

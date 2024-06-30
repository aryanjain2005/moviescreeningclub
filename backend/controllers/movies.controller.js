const Movie = require('@/models/movie.model')
const SeatMap = require('@/models/seatmap.model')

const addMovie = (req, res) => {
  const {
    title,
    poster,
    description,
    releaseDate,
    genre,
    trailer,
    currentscreening
  } = req.body
  const newMovie = new Movie({
    title,
    poster,
    description,
    releaseDate,
    genre,
    trailer,
    currentscreening
  })
  newMovie
    .save()
    .then((movie) => res.status(201).json(movie))
    .catch((err) => res.status(400).json({ error: err.message }))
}

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
    res.set('Cache-Control', 'public, max-age=60, s-maxage=0')
    res.json(movies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateMovie = async (req, res) => {
  const { id } = req.params
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true
    })
    res.json(updatedMovie)
  } catch (error) {
    console.error('Error updating movie:', error)
    res.status(500).json({ error: 'Error updating movie' })
  }
}

const deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id
    const result = await Movie.findByIdAndDelete(movieId)
    res.json(result)
  } catch (error) {
    console.error('Error deleting movie:', error)
    res.status(500).json({ error: 'Error deleting movie' })
  }
}

const getMovieById = async (req, res) => {
  try {
    const { movieId } = req.params
    const movie = await Movie.findById(movieId)
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' })
    }
    if (movie.showtimes.some((showtime) => showtime.date < new Date())) {
      // remove past showtimes that are before 3hours from now
      const showsToRemove = movie.showtimes.filter(
        (showtime) => showtime.date < new Date() - 3 * 60 * 60 * 1000
      )
      movie.showtimes = movie.showtimes.filter(
        (showtime) => showtime.date >= new Date()
      )
      // delete all other showtimes and seatmaps
      const seatmaps = await SeatMap.find({
        showtimeId: { $in: showsToRemove.map((showtime) => showtime._id) }
      })
      await Promise.all(
        seatmaps.map(async (seatmap) => {
          await seatmap.remove()
        })
      )
      await movie.save()
    }
    res.json(movie)
  } catch (error) {
    console.error('Error fetching trailer:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const addMovieShowtimes = async (req, res) => {
  try {
    const { movieId } = req.params

    const movie = await Movie.findById(movieId)
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    const { date } = req.body
    const inpShowtime = { date: new Date(date) }
    if (inpShowtime.date < new Date()) {
      return res
        .status(400)
        .json({ error: 'Showtime date must be in the future' })
    }
    movie.showtimes.push(inpShowtime)

    await movie.save()

    const showtime = movie.showtimes[movie.showtimes.length - 1]
    const seatMap = new SeatMap({ showtimeId: showtime._id })
    await seatMap.save()

    res.json(movie)
  } catch (error) {
    console.error('Error adding showtime:', error)
    res.status(500).json({ error: 'Error adding showtime' })
  }
}

const deleteMovieShowtimes = async (req, res) => {
  try {
    const { movieId, showtimeId } = req.params
    const movie = await Movie.findById(movieId)
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' })
    }
    movie.showtimes.pull({ _id: showtimeId })
    await movie.save()
    res.json({ message: 'Showtime deleted successfully' })
  } catch (error) {
    console.error('Error deleting showtime:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  addMovie,
  getMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
  addMovieShowtimes,
  deleteMovieShowtimes
}

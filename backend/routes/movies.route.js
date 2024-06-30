const express = require('express')
const {
  addMovie,
  getMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
  addMovieShowtimes,
  deleteMovieShowtimes
} = require('@/controllers/movies.controller')
const verifyJWTWithRole = require('@/middleware')

const router = express.Router()

router.get('/', getMovies)
router.get('/:movieId', getMovieById)
router.post('/add', verifyJWTWithRole('movievolunteer'), addMovie)
router.put('/:id', verifyJWTWithRole('movievolunteer'), updateMovie)
router.delete('/:id', verifyJWTWithRole('movievolunteer'), deleteMovie)
router.post(
  '/:movieId/showtimes',
  verifyJWTWithRole('movievolunteer'),
  addMovieShowtimes
)
router.delete(
  '/:movieId/:showtimeId',
  verifyJWTWithRole('movievolunteer'),
  deleteMovieShowtimes
)

module.exports = router

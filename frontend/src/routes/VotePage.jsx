import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/utils/api'
import { isAllowedLvl } from '@/utils/levelCheck'
import { useLogin } from '@/components/LoginContext'

const MovieList = () => {
  const navigate = useNavigate()
  const { user } = useLogin()
  const [movies, setMovies] = useState([])
  const [userVotes, setUserVotes] = useState([])
  const userType = localStorage.getItem('userType')
  const [newMovieData, setNewMovieData] = useState({
    title: '',
    poster: '',
    genre: ''
  })

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await api.get(`/voterouter/movies`)
      if (response.status !== 200) {
        throw new Error('Failed to fetch movies')
      }
      const fetchedMovies = response.data.movies.map((movie) => {
        const voted = movie.voters.includes(user?.email)
        return { ...movie, voted }
      })
      setMovies(fetchedMovies)
    } catch (error) {
      console.error('Error fetching movies:', error)
      setMovies([])
    }
  }

  const handleVoteClick = async (movieId, voteType) => {
    try {
      const response = await api.post(`/voterouter/vote`, {
        movieId,
        voteType,
        userEmail: user?.email
      })
      if (response.status !== 200) {
        throw new Error('Failed to record vote')
      }
      fetchMovies()
    } catch (error) {
      console.error('Error voting for movie:', error)
    }
  }

  const handleAddMovie = async () => {
    try {
      const response = await api.post(`/voterouter/addvotemovie`, newMovieData)
      if (response.status !== 200) {
        throw new Error('Failed to add movie')
      }
      setNewMovieData({
        title: '',
        poster: '',
        genre: ''
      })
      fetchMovies()
    } catch (error) {
      console.error('Error adding movie:', error)
    }
  }

  const handleDeleteMovie = async (movieId) => {
    try {
      const response = await api.delete(
        `/voterouter/deletevotemovie/${movieId}`
      )
      if (response.status !== 200) {
        throw new Error('Failed to delete movie')
      }
      fetchMovies()
    } catch (error) {
      console.error('Error deleting movie:', error)
    }
  }
  const MovieCard = ({ movie }) => {
    const totalVotes = movie.yesCount + movie.noCount
    const yesPercentage =
      totalVotes === 0 ? 0 : (movie.yesCount / totalVotes) * 100
    const noPercentage =
      totalVotes === 0 ? 0 : (movie.noCount / totalVotes) * 100
    return (
      <div className="flex bg-white rounded-lg shadow-md w-full h-full">
        <div className="flex flex-col w-2/3 ml-2">
          <div className="w-2/3 mb-2 rounded">
            <img
              className="w-2/3  rounded-md"
              src={movie.poster}
              alt={movie.title}
            />
          </div>
          <div className="flex flex-col mt-1">
            <p className="font-semibold text-2xl max-lg:text-base">
              {movie.title}
            </p>
            <p className="max-sm:text-sm">{movie.genre}</p>
          </div>
        </div>
        <div className="flex flex-col justify-between mr-2 w-full">
          {(userType === 'admin' ||
            userType === 'movievolunteer' ||
            userType === 'volunteer') && (
            <div className="flex justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleDeleteMovie(movie._id)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
          )}

          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-2">
              <div className="flex flex-row ">
                {/* <span className="font-semibold text-gray-600 px-2">Yes</span> */}
                <div className="bg-green-200 h-8 rounded-xl w-60 max-lg:w-40 max-sm:w-32 text-center">
                  <div
                    className="bg-green-500 h-8 rounded-xl"
                    style={{ width: `${yesPercentage}%` }}
                  >
                    YES
                  </div>
                </div>
                {!movie.voters.includes(user?.email) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="green"
                    className="w-8 h-8"
                    onClick={() => handleVoteClick(movie._id, 'yes')}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}
              </div>
              <div className="flex flex-row pt-2">
                {/* <span className="font-semibold text-gray-600 px-2">No</span> */}
                <div className="bg-red-200 h-8 rounded-xl w-60 max-lg:w-40 max-sm:w-32 text-center">
                  <div
                    className="bg-red-500 h-8 rounded-xl"
                    style={{ width: `${noPercentage}%` }}
                  >
                    NO
                  </div>
                </div>
                {!movie.voters.includes(user?.email) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="w-8 h-8 "
                    onClick={() => handleVoteClick(movie._id, 'no')}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center font-monts">
      <div className="text-2xl my-3 capitalize font-bold">
        vote the movies you want to watch next
      </div>
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-10 w-[95%] my-6">
        {/* Render existing movies */}
        {movies.map((movie) => (
          <div key={movie._id} className="w-full h-full">
            <MovieCard movie={movie} />
          </div>
        ))}
        {isAllowedLvl('movievolunteer', user?.usertype || 'standard') && (
          <div className="flex flex-col items-center rounded-lg shadow-md w-full gap-2 py-2">
            <h2 className="font-semibold text-lg">Add New Movie</h2>
            <input
              type="text"
              placeholder="Title"
              value={newMovieData.title}
              className="border-2 border-black rounded-md"
              onChange={(e) =>
                setNewMovieData({ ...newMovieData, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Poster URL"
              value={newMovieData.poster}
              className="border-2 border-black rounded-md"
              onChange={(e) =>
                setNewMovieData({ ...newMovieData, poster: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Genre"
              value={newMovieData.genre}
              className="border-2 border-gray-950 rounded-md"
              onChange={(e) =>
                setNewMovieData({ ...newMovieData, genre: e.target.value })
              }
            />
            <button onClick={handleAddMovie}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="green"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieList

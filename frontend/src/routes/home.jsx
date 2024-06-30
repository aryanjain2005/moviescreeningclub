import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/utils/api'
import useDeviceSize from '@/utils/useDeviceSize'

const Home = () => {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [showMoreUpcoming, setShowMoreUpcoming] = useState(false)
  const [showMoreOngoing, setShowMoreOngoing] = useState(false)
  const deviceSize = useDeviceSize()
  const limit = ['xs', 'sm'].includes(deviceSize)
    ? 2
    : ['md', 'lg'].includes(deviceSize)
      ? 3
      : 4
  useEffect(() => {
    api
      .get(`/movie`)
      .then((response) => {
        setMovies(response.data)
      })
      .catch((error) => {
        console.error('Error fetching movies:', error)
      })
  }, [])

  const ongoingMovies = showMoreOngoing
    ? movies.filter((movie) => movie.currentscreening)
    : movies.filter((movie) => movie.currentscreening).slice(0, limit)

  const upcomingMovies = showMoreUpcoming
    ? movies.filter((movie) => !movie.currentscreening)
    : movies.filter((movie) => !movie.currentscreening).slice(0, limit)

  const toggleShowMoreUpcoming = () => {
    setShowMoreUpcoming(!showMoreUpcoming)
  }

  const toggleShowMoreOngoing = () => {
    setShowMoreOngoing(!showMoreOngoing)
  }
  const scrollToElement = (elementId, additionalOffset = 0) => {
    const element = document.getElementById(elementId)
    if (!element) return
    const elementPosition = element.offsetTop - additionalOffset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
  return (
    <div className="bg-gray-200 flex flex-col items-center font-monts">
      <div
        id="ongoing"
        className="flex flex-col items-between justify-center bg-white h-1/2 w-4/5 max-sm:w-[95%] my-10 rounded-xl shadow-lg p-2"
      >
        <div className="flex justify-between my-3 mx-5 max-sm:mx-2">
          <p className="text-xl font-semibold">Ongoing Movies</p>
          {movies.length > limit && (
            <p
              className="font-inter text-sm cursor-pointer"
              onClick={toggleShowMoreOngoing}
            >
              {showMoreOngoing ? 'Show Less' : 'Show More'}
            </p>
          )}
        </div>
        <div className="grid gap-6 max-sm:gap-2 mb-8 max-sm:mb-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-5 max-sm:mx-2 max-h-[fit-content] ">
          {ongoingMovies.map((movie) => (
            <Link
              to={`/showtime?movieId=${movie._id}`}
              key={movie._id}
              className="flex items-center justify-center"
            >
              <div className="w-full h-full object-cover">
                <div className="w-full h-4/5 max-sm:h-2/3">
                  <img
                    className="object-cover w-full h-full rounded-md"
                    src={movie.poster}
                    alt={movie.title}
                  />
                </div>
                <div className="flex flex-col mt-1">
                  <p className="font-semibold text-2xl max-sm:text-lg">
                    {movie.title}
                  </p>
                  <p className="max-sm:text-sm">{movie.genre}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {movies.length > limit && (
          <p
            className="w-full text-center  font-inter text-sm cursor-pointer"
            onClick={() => {
              toggleShowMoreOngoing()
              showMoreOngoing && scrollToElement('ongoing', 120)
            }}
          >
            {showMoreOngoing ? 'Show Less' : 'Show More'}
          </p>
        )}
      </div>
      {upcomingMovies.length > 0 && (
        <div
          id="upcoming"
          className="flex flex-col bg-white h-1/2 w-4/5 max-sm:w-[95%] my-10 rounded-xl shadow-lg p-2"
        >
          <div className="flex justify-between my-3 mx-5 max-sm:mx-2">
            <p className="text-xl font-semibold">Upcoming Movies</p>
            <p
              className="font-inter text-sm cursor-pointer"
              onClick={toggleShowMoreUpcoming}
            >
              {showMoreUpcoming ? 'Show Less' : 'Show More'}
            </p>
          </div>
          <div className="grid gap-6 max-sm:gap-2 mb-8 max-sm:mb-4 max-sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-5 max-sm:mx-2">
            {upcomingMovies.map((movie) => (
              <Link
                to={`/showtime?movieId=${movie._id}`}
                key={movie._id}
                className="flex items-center justify-center"
              >
                <div className="w-full h-full object-cover">
                  <div className="w-full h-4/5 max-sm:h-2/3">
                    <img
                      className="object-cover w-full h-full rounded-md"
                      src={movie.poster}
                      alt={movie.title}
                    />
                  </div>
                  <div className="flex flex-col mt-1">
                    <p className="font-semibold text-2xl max-sm:text-lg">
                      {movie.title}
                    </p>
                    <p className="max-sm:text-sm">{movie.genre}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {movies.filter((m) => !m.currentscreening).length > limit && (
            <p
              className="w-full text-center  font-inter text-sm cursor-pointer"
              onClick={() => {
                toggleShowMoreUpcoming()
                showMoreUpcoming && scrollToElement('upcoming', 120)
              }}
            >
              {showMoreUpcoming ? 'Show Less' : 'Show More'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Home

import { useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@nextui-org/react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment' // Import moment library for date and time formatting
import { SERVERIP } from '../config'
import { Button } from '@material-tailwind/react'

const ShowtimePage = () => {
  const { paymentId } = useParams()
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])

  useEffect(() => {
    const userType = localStorage.getItem('userType')
    if (!userType) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    axios
      .get(`/QR/qrData/${paymentId}`)
      .then((response) => {
        const qrData = response.data
        if (qrData && !qrData.used) {
          return
        } else {
          // Redirect to QR page if QR data is used or does not exist
          navigate('/QR')
        }
      })
      .catch((error) => {
        console.error('Error fetching QR data:', error)
        // Redirect to QR page if there's an error fetching QR data
        navigate('/QR')
      })
  }, [paymentId, navigate])

  useEffect(() => {
    axios
      .get(`/movie/movies`)
      .then((response) => {
        setMovies(response.data)
      })
      .catch((error) => {
        console.error('Error fetching movies:', error)
      })
  }, [])

  const handleShowtimeSelection = (showtimeId, MovieTitle, date, time) => {
    navigate(
      `/seatmap/${showtimeId}?paymentId=${paymentId}&movie=${encodeURIComponent(
        MovieTitle
      )}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`
    )
  }

  const columns = [
    {
      key: 'movie',
      label: 'MOVIE'
    },
    {
      key: 'Showtime',
      label: 'SHOWTIME'
    },
    {
      key: 'action',
      label: 'ACTION'
    }
  ]

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e5e8f0] font-monts">
      <div className="w-[90%] flex flex-col bg-white min-h-screen my-4 rounded-xl shadow-lg items-center">
        <h1 className="text-2xl font-semibold my-4 text-center">
          Please select a Showtime from below
        </h1>
        {movies.length > 0 && (
          <Table
            aria-label="Example table with dynamic content"
            className="w-[90%]"
            // isStriped
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody>
              {movies.map((movie) =>
                movie.showtimes.map((showtime, index) => (
                  <TableRow
                    key={`${movie._id}-${index}`}
                    className="even:bg-[#f4f4f5]"
                  >
                    <TableCell>{movie.title}</TableCell>
                    <TableCell>
                      {moment(showtime.date).format('DD-MM-YYYY')} -{' '}
                      {moment(showtime.time, 'HH:mm').format('hh:mm A')}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="green"
                        className="text-white capitalize"
                        onClick={() =>
                          handleShowtimeSelection(
                            showtime._id,
                            movie.title,
                            showtime.date,
                            showtime.time
                          )
                        }
                      >
                        book seat
                      </Button>
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="green"
                        className="w-8 h-8 cursor-pointer"
                        onClick={() =>
                          handleShowtimeSelection(
                            showtime._id,
                            movie.title,
                            showtime.date,
                            showtime.time
                          )
                        }
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg> */}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

export default ShowtimePage

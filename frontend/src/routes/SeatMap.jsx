import React, { useState, useEffect } from 'react'
import { api } from '@/utils/api'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
const SeatMapPage = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const paymentId = searchParams.get('paymentId')
  const showtimeId = location.pathname.split('/')[2]
  const movie = searchParams.get('movie')
  const date = searchParams.get('date')
  const time = searchParams.get('time')
  const date1 = moment(date).format('DD-MM-YYYY')
  const time1 = moment(time, 'HH:mm').format('hh:mm A')

  const [selectedSeat, setSelectedSeat] = useState(null)
  const [assignedSeat, setAssignedSeat] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [seatOccupancy, setSeatOccupancy] = useState({})
  let column = 0
  const navigate = useNavigate()

  useEffect(() => {
    const initialValue = document.body.style.zoom
    document.body.style.zoom = '75%'
    return () => {
      document.body.style.zoom = initialValue
    }
  }, [])

  useEffect(() => {
    const fetchSeatOccupancy = async () => {
      try {
        const response = await api.get(
          `/seatmaprouter/seatmap/${showtimeId}/seats`
        )
        setSeatOccupancy(response.data)
      } catch (error) {
        console.error('Error fetching seat occupancy:', error)
      }
    }

    fetchSeatOccupancy()
  }, [showtimeId])

  useEffect(() => {
    api
      .get(`/QR/qrData/${paymentId}`)
      .then((response) => {
        if (response.status === 200) {
          return
        } else {
          navigate('/QR')
        }
      })
      .catch((error) => {
        console.error('Error fetching QR data:', error)
        navigate('/QR')
      })
  }, [paymentId, navigate])

  const sendEmail = async () => {
    try {
      const emailData = {
        email: localStorage.getItem('loggedInUserEmail'),
        seatNumber: selectedSeat,
        movie: movie,
        date: date1,
        time: time1,
        qr: paymentId
      }
      const response = await api.post(`/QR/sendEmail`, emailData)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  const handleSeatSelection = (seat) => {
    if (assignedSeat || seatOccupancy[seat]) {
      setErrorMessage(
        'This seat is already occupied. Please select another seat.'
      )
      return
    }
    setSelectedSeat(seat)
    setErrorMessage(null)
  }

  const handleConfirmSeat = async () => {
    try {
      await api.put(`/seatmaprouter/seatmap/${showtimeId}/${selectedSeat}`)
      setAssignedSeat(true)
      await api.put(`/QR/markUsed/${paymentId}/${selectedSeat}`, {
        showtime: time1,
        date: date1
      })

      // Send email
      await sendEmail()

      setErrorMessage(
        `The seat ${selectedSeat} is successfully assigned to you. Redirecting to QRs...`
      )
      localStorage.setItem('seatassignment', 'false')
      setTimeout(() => {
        window.location.href = '/QR'
      }, 5000)
    } catch (error) {
      console.error('Error assigning seat:', error)
      if (error.response && error.response.status === 400) {
        setErrorMessage(`Seat ${selectedSeat} is already occupied`)
      } else {
        setErrorMessage('An error occurred while assigning the seat')
      }
    }
  }

  return (
    <div className="seat-booking font-monts overflow-auto mb-3">
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {assignedSeat && (
        <div className="flex justify-center items-center h-screen">
          <h6 className="text-3xl">Assigning seat....</h6>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            viewBox="0 0 24 24"
          >
            <defs>
              <filter id="svgSpinnersGooeyBalls20">
                <feGaussianBlur
                  in="SourceGraphic"
                  result="y"
                  stdDeviation={1}
                ></feGaussianBlur>
                <feColorMatrix
                  in="y"
                  result="z"
                  values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"
                ></feColorMatrix>
                <feBlend in="SourceGraphic" in2="z"></feBlend>
              </filter>
            </defs>
            <g filter="url(#svgSpinnersGooeyBalls20)">
              <circle cx={5} cy={12} r={4} fill="currentColor">
                <animate
                  attributeName="cx"
                  calcMode="spline"
                  dur="2s"
                  keySplines=".36,.62,.43,.99;.79,0,.58,.57"
                  repeatCount="indefinite"
                  values="5;8;5"
                ></animate>
              </circle>
              <circle cx={19} cy={12} r={4} fill="currentColor">
                <animate
                  attributeName="cx"
                  calcMode="spline"
                  dur="2s"
                  keySplines=".36,.62,.43,.99;.79,0,.58,.57"
                  repeatCount="indefinite"
                  values="19;16;19"
                ></animate>
              </circle>
              <animateTransform
                attributeName="transform"
                dur="0.75s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              ></animateTransform>
            </g>
          </svg>
        </div>
      )}
      {!assignedSeat && (
        <div className="flex flex-col flex-wrap mx-2">
          <div className="flex flex-row-reverse justify-evenly gap-4">
            <div className="flex flex-col gap-2 items-center">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col items-start justify-center mb-8 w-full mt-4">
                  <div>
                    <span className="font-semibold mr-3">Movie:</span>
                    <span>{movie}</span>
                  </div>
                  <div>
                    <span className="font-semibold mr-3">Date:</span>
                    <span>{date1}</span>
                  </div>
                  <div>
                    <span className="font-semibold mr-3">Time:</span>
                    <span>{time1}</span>
                  </div>
                </div>
              </div>

              {[...Array(1).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(10).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    seatNumber = `A${seatNumber}`
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(2).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(11).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 22
                        ? (seatNumber = `B${seatNumber - 10}`)
                        : (seatNumber = `C${seatNumber - 21}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(2).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(12).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 45
                        ? (seatNumber = `D${seatNumber - 32}`)
                        : (seatNumber = `E${seatNumber - 44}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(2).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(13).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 70
                        ? (seatNumber = `F${seatNumber - 56}`)
                        : (seatNumber = `G${seatNumber - 69}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(2).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(14).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 97
                        ? (seatNumber = `H${seatNumber - 82}`)
                        : (seatNumber = `I${seatNumber - 96}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="w-4"></div> {/* Entrance space */}
            <div className="flex flex-col gap-2 items-center">
              <div className="flex flex-col items-center justify-center mb-4 w-full mt-7">
                <svg
                  className="w-full mx-auto mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 10"
                >
                  <path
                    d="M0 5 C 25 -2, 75 -2, 100 5"
                    fill="none"
                    stroke="black"
                    strokeWidth="1"
                  />
                </svg>
                <span className="font-semibold text-lg">Screen</span>
              </div>
              {[...Array(1).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(7).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    seatNumber = `A${seatNumber - 100}`
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(2).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(8).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 126
                        ? (seatNumber = `B${seatNumber - 106}`)
                        : (seatNumber = `C${seatNumber - 114}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(1).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(9).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    seatNumber = `D${seatNumber - 121}`
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(2).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(10).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 153
                        ? (seatNumber = `E${seatNumber - 130}`)
                        : (seatNumber = `F${seatNumber - 139}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(1).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(11).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    seatNumber = `G${seatNumber - 149}`
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(2).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(12).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 186
                        ? (seatNumber = `H${seatNumber - 159}`)
                        : (seatNumber = `I${seatNumber - 171}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="w-4"></div> {/* Entrance space */}
            <div className="flex justify-between gap-4">
              {/* Container for the 5x5 block */}
              <div className="flex flex-col gap-2 items-center">
                <div className="flex flex-col items-start mb-8 w-full mt-4 text-lg mr-4">
                  <div>
                    <span
                      className={`bg-white-50 border border-green-600 bg-green-600 px-2 text-center cursor-pointer font-roboto text-10 mr-2`}
                    ></span>
                    <span className="text-lg">Selected Seat</span>
                  </div>
                  <div>
                    <span
                      className={`seat bg-white-50 border border-red-400 bg-red-400 px-2 text-center cursor-pointer font-roboto text-10 mr-2`}
                    ></span>
                    <span className="text-lg">Seat Already Booked</span>
                  </div>
                  <div>
                    <span
                      className={`seat bg-white-50 border border-gray-400 px-2 text-center cursor-pointer font-roboto text-10 mr-2`}
                    ></span>
                    <span className="text-lg">Seat Not Booked Yet</span>
                  </div>
                </div>
                {[...Array(1).keys()].map((row) => (
                  <div key={row} className="flex flex-row-reverse gap-2">
                    {[...Array(10).keys()].map((col) => {
                      let seatNumber = column + 1
                      column = seatNumber
                      seatNumber = `A${seatNumber - 180}`
                      return (
                        <div
                          key={col}
                          className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                            selectedSeat === seatNumber
                              ? 'bg-green-600 text-white'
                              : seatOccupancy[seatNumber]
                                ? 'bg-gray-200'
                                : ''
                          }`}
                          onClick={() => handleSeatSelection(seatNumber)}
                          disabled={assignedSeat || seatOccupancy[seatNumber]}
                          style={{
                            color: seatOccupancy[seatNumber] ? 'red' : 'black'
                          }}
                        >
                          <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                            {seatNumber}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
                {[...Array(2).keys()].map((row) => (
                  <div key={row} className="flex flex-row-reverse gap-2">
                    {[...Array(11).keys()].map((col) => {
                      let seatNumber = column + 1
                      column = seatNumber
                      {
                        seatNumber < 219
                          ? (seatNumber = `B${seatNumber - 188}`)
                          : (seatNumber = `C${seatNumber - 199}`)
                      }
                      return (
                        <div
                          key={col}
                          className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                            selectedSeat === seatNumber
                              ? 'bg-green-600 text-white'
                              : seatOccupancy[seatNumber]
                                ? 'bg-gray-200'
                                : ''
                          }`}
                          onClick={() => handleSeatSelection(seatNumber)}
                          disabled={assignedSeat || seatOccupancy[seatNumber]}
                          style={{
                            color: seatOccupancy[seatNumber] ? 'red' : 'black'
                          }}
                        >
                          <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                            {seatNumber}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
                {[...Array(2).keys()].map((row) => (
                  <div key={row} className="flex flex-row-reverse gap-2">
                    {[...Array(12).keys()].map((col) => {
                      let seatNumber = column + 1
                      column = seatNumber
                      {
                        seatNumber < 242
                          ? (seatNumber = `D${seatNumber - 208}`)
                          : (seatNumber = `E${seatNumber - 219}`)
                      }
                      return (
                        <div
                          key={col}
                          className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                            selectedSeat === seatNumber
                              ? 'bg-green-600 text-white'
                              : seatOccupancy[seatNumber]
                                ? 'bg-gray-200'
                                : ''
                          }`}
                          onClick={() => handleSeatSelection(seatNumber)}
                          disabled={assignedSeat || seatOccupancy[seatNumber]}
                          style={{
                            color: seatOccupancy[seatNumber] ? 'red' : 'black'
                          }}
                        >
                          <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                            {seatNumber}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
                {[...Array(1).keys()].map((row) => (
                  <div key={row} className="flex flex-row-reverse gap-2">
                    {[...Array(13).keys()].map((col) => {
                      let seatNumber = column + 1
                      column = seatNumber
                      seatNumber = `F${seatNumber - 230}`
                      return (
                        <div
                          key={col}
                          className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                            selectedSeat === seatNumber
                              ? 'bg-green-600 text-white'
                              : seatOccupancy[seatNumber]
                                ? 'bg-gray-200'
                                : ''
                          }`}
                          onClick={() => handleSeatSelection(seatNumber)}
                          disabled={assignedSeat || seatOccupancy[seatNumber]}
                          style={{
                            color: seatOccupancy[seatNumber] ? 'red' : 'black'
                          }}
                        >
                          <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                            {seatNumber}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
                {[...Array(2).keys()].map((row) => (
                  <div key={row} className="flex flex-row-reverse gap-2">
                    {[...Array(14).keys()].map((col) => {
                      let seatNumber = column + 1
                      column = seatNumber
                      {
                        seatNumber < 281
                          ? (seatNumber = `G${seatNumber - 242}`)
                          : (seatNumber = `H${seatNumber - 254}`)
                      }
                      return (
                        <div
                          key={col}
                          className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                            selectedSeat === seatNumber
                              ? 'bg-green-600 text-white'
                              : seatOccupancy[seatNumber]
                                ? 'bg-gray-200'
                                : ''
                          }`}
                          onClick={() => handleSeatSelection(seatNumber)}
                          disabled={assignedSeat || seatOccupancy[seatNumber]}
                          style={{
                            color: seatOccupancy[seatNumber] ? 'red' : 'black'
                          }}
                        >
                          <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                            {seatNumber}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
                {[...Array(1).keys()].map((row) => (
                  <div key={row} className="flex flex-row-reverse gap-2">
                    {[...Array(15).keys()].map((col) => {
                      let seatNumber = column + 1
                      column = seatNumber
                      seatNumber = `I${seatNumber - 268}`
                      return (
                        <div
                          key={col}
                          className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                            selectedSeat === seatNumber
                              ? 'bg-green-600 text-white'
                              : seatOccupancy[seatNumber]
                                ? 'bg-gray-200'
                                : ''
                          }`}
                          onClick={() => handleSeatSelection(seatNumber)}
                          disabled={assignedSeat || seatOccupancy[seatNumber]}
                          style={{
                            color: seatOccupancy[seatNumber] ? 'red' : 'black'
                          }}
                        >
                          <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                            {seatNumber}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-8"></div> {/* Vertical spacing */}
          <div className="flex flex-row-reverse justify-evenly gap-4 mb-4">
            <div className="flex flex-col gap-2 items-center mt-16">
              {[...Array(11).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(15).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 325
                        ? (seatNumber = `J${seatNumber - 309}`)
                        : seatNumber < 340
                          ? (seatNumber = `K${seatNumber - 324}`)
                          : seatNumber < 355
                            ? (seatNumber = `L${seatNumber - 339}`)
                            : seatNumber < 370
                              ? (seatNumber = `M${seatNumber - 354}`)
                              : seatNumber < 385
                                ? (seatNumber = `N${seatNumber - 369}`)
                                : seatNumber < 400
                                  ? (seatNumber = `O${seatNumber - 384}`)
                                  : seatNumber < 415
                                    ? (seatNumber = `P${seatNumber - 399}`)
                                    : seatNumber < 430
                                      ? (seatNumber = `Q${seatNumber - 414}`)
                                      : seatNumber < 445
                                        ? (seatNumber = `R${seatNumber - 429}`)
                                        : seatNumber < 460
                                          ? (seatNumber = `S${seatNumber - 444}`)
                                          : (seatNumber = `T${seatNumber - 459}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {/* {seatNumber < 10 ? "A" : seatNumber < 20 ? "B" : seatNumber < 70 ? "C" : null} */}
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="w-4"></div> {/* Entrance space */}
            <div className="flex flex-col gap-2 items-center">
              <div className="flex justify-center mt-4 mb-4">
                <span className="font-semibold text-lg">Entrance</span>
              </div>
              <div className="flex flex-row-reverse gap-64">
                <div className="flex flex-col gap-2">
                  {[...Array(7).keys()].map((row) => (
                    <div key={row} className="flex flex-row-reverse gap-2">
                      {[...Array(3).keys()].map((col) => {
                        let seatNumber = column + 1
                        column = seatNumber
                        {
                          seatNumber < 478
                            ? (seatNumber = `J${seatNumber - 459}`)
                            : seatNumber < 481
                              ? (seatNumber = `K${seatNumber - 462}`)
                              : seatNumber < 484
                                ? (seatNumber = `L${seatNumber - 465}`)
                                : seatNumber < 487
                                  ? (seatNumber = `M${seatNumber - 468}`)
                                  : seatNumber < 490
                                    ? (seatNumber = `N${seatNumber - 471}`)
                                    : seatNumber < 493
                                      ? (seatNumber = `O${seatNumber - 474}`)
                                      : (seatNumber = `P${seatNumber - 477}`)
                        }
                        return (
                          <div
                            key={col}
                            className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                              selectedSeat === seatNumber
                                ? 'bg-green-600 text-white'
                                : seatOccupancy[seatNumber]
                                  ? 'bg-gray-200'
                                  : ''
                            }`}
                            onClick={() => handleSeatSelection(seatNumber)}
                            disabled={assignedSeat || seatOccupancy[seatNumber]}
                            style={{
                              color: seatOccupancy[seatNumber] ? 'red' : 'black'
                            }}
                          >
                            <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                              {seatNumber}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {[...Array(7).keys()].map((row) => (
                    <div key={row} className="flex flex-row-reverse gap-2">
                      {[...Array(3).keys()].map((col) => {
                        let seatNumber = column + 1
                        column = seatNumber
                        {
                          seatNumber < 499
                            ? (seatNumber = `J${seatNumber - 477}`)
                            : seatNumber < 502
                              ? (seatNumber = `K${seatNumber - 480}`)
                              : seatNumber < 505
                                ? (seatNumber = `L${seatNumber - 483}`)
                                : seatNumber < 508
                                  ? (seatNumber = `M${seatNumber - 486}`)
                                  : seatNumber < 511
                                    ? (seatNumber = `N${seatNumber - 489}`)
                                    : seatNumber < 514
                                      ? (seatNumber = `O${seatNumber - 492}`)
                                      : (seatNumber = `P${seatNumber - 495}`)
                        }
                        return (
                          <div
                            key={col}
                            className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                              selectedSeat === seatNumber
                                ? 'bg-green-600 text-white'
                                : seatOccupancy[seatNumber]
                                  ? 'bg-gray-200'
                                  : ''
                            }`}
                            onClick={() => handleSeatSelection(seatNumber)}
                            disabled={assignedSeat || seatOccupancy[seatNumber]}
                            style={{
                              color: seatOccupancy[seatNumber] ? 'red' : 'black'
                            }}
                          >
                            <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                              {seatNumber}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
              {[...Array(1).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(13).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    seatNumber = `Q${seatNumber - 501}`
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(2).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(14).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 544
                        ? (seatNumber = `R${seatNumber - 514}`)
                        : (seatNumber = `S${seatNumber - 528}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(1).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(15).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    seatNumber = `T${seatNumber - 542}`
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="w-4"></div>
            <div className="flex flex-col gap-2 items-center mt-16 ">
              {[...Array(7).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(15).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 588
                        ? (seatNumber = `J${seatNumber - 551}`)
                        : seatNumber < 603
                          ? (seatNumber = `K${seatNumber - 566}`)
                          : seatNumber < 618
                            ? (seatNumber = `L${seatNumber - 581}`)
                            : seatNumber < 633
                              ? (seatNumber = `M${seatNumber - 596}`)
                              : seatNumber < 648
                                ? (seatNumber = `N${seatNumber - 611}`)
                                : seatNumber < 663
                                  ? (seatNumber = `O${seatNumber - 626}`)
                                  : (seatNumber = `P${seatNumber - 641}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {[...Array(4).keys()].map((row) => (
                <div key={row} className="flex flex-row-reverse gap-2">
                  {[...Array(14).keys()].map((col) => {
                    let seatNumber = column + 1
                    column = seatNumber
                    {
                      seatNumber < 692
                        ? (seatNumber = `Q${seatNumber - 649}`)
                        : seatNumber < 706
                          ? (seatNumber = `R${seatNumber - 662}`)
                          : seatNumber < 720
                            ? (seatNumber = `S${seatNumber - 676}`)
                            : (seatNumber = `T${seatNumber - 689}`)
                    }
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${
                          selectedSeat === seatNumber
                            ? 'bg-green-600 text-white'
                            : seatOccupancy[seatNumber]
                              ? 'bg-gray-200'
                              : ''
                        }`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{
                          color: seatOccupancy[seatNumber] ? 'red' : 'black'
                        }}
                      >
                        <span className="flex justify-center items-center w-3 h-3 text-sm max-sm:size-0 max-sm:text-xs ">
                          {seatNumber}
                          {/* {seatNumber < 692
                            ? `Q${seatNumber - 649}`
                            : seatNumber < 706
                            ? `R${seatNumber - 662}`
                            : seatNumber < 720
                            ? `S${seatNumber - 676}`
                            : `T${seatNumber - 689}`} */}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          {selectedSeat && (
            <div className="flex justify-center items-center py-2 text-green-600">
              <p className="text-center text-2xl capitalize">
                You have selected Selected Seat {selectedSeat} --
              </p>
              <button
                onClick={handleConfirmSeat}
                className="flex justify-center mx-2 p-2 bg-green-400 text-white rounded-lg font-bold text-lg"
              >
                Proceed
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SeatMapPage

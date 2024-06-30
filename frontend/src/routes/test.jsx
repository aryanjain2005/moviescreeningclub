import React, { useState } from 'react'
import { SERVERIP } from '../config'

const Test = () => {
  const [selectedSeat, setSelectedSeat] = useState(null)

  const handleSeatClick = (seatNumber) => {
    setSelectedSeat(seatNumber)
  }

  return (
    <div className="seat-booking font-monts">
      <h1 className="text-3xl font-semibold mb-4">
        Movie Theatre Seat Booking
      </h1>
      <div className="flex justify-center mb-4">
        <span
          className="font-semibold text-lg"
          style={{ marginBottom: '20px' }}
        >
          Screen
        </span>
      </div>
      <svg
        className="w-3/4 mx-auto mb-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 10"
      >
        <path
          d="M0 5 C 25 -2, 75 -2, 100 5"
          fill="none"
          stroke="black"
          strokeWidth="0.3"
        />
      </svg>
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-2">
          {[...Array(9).keys()].map((row) => (
            <div key={row} className="flex gap-2">
              {[...Array(6).keys()].map((col) => {
                const seatNumber = row * 6 + col + 1
                return (
                  <div
                    key={col}
                    className={`seat bg-gray-200 border border-gray-400 p-2 text-center cursor-pointer ${selectedSeat === seatNumber ? 'bg-yellow-400' : ''}`}
                    onClick={() => handleSeatClick(seatNumber)}
                  >
                    <span className="block w-4 h-5">{seatNumber}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="w-4"></div> {/* Entrance space */}
        <div className="flex flex-col gap-2">
          {[...Array(10).keys()].map((row) => (
            <div key={row} className="flex gap-2">
              {[...Array(12).keys()].map((col) => {
                const seatNumber = 54 + row * 12 + col + 1
                return (
                  <div
                    key={col}
                    className={`seat bg-gray-200 border border-gray-400 p-2 text-center cursor-pointer ${selectedSeat === seatNumber ? 'bg-yellow-400' : ''}`}
                    onClick={() => handleSeatClick(seatNumber)}
                  >
                    <span className="block w-4 h-5">{seatNumber}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="w-4"></div> {/* Entrance space */}
        <div className="flex flex-col gap-2">
          {/* Container for the 5x5 block */}
          <div style={{ marginTop: '50px' }}>
            {[...Array(9).keys()].map((row) => (
              <div key={row} className="flex gap-2">
                {[...Array(6).keys()].map((col) => {
                  const seatNumber = 174 + row * 6 + col + 1
                  return (
                    <div
                      key={col}
                      className={`seat bg-gray-200 border border-gray-400 p-2 text-center cursor-pointer ${selectedSeat === seatNumber ? 'bg-yellow-400' : ''}`}
                      onClick={() => handleSeatClick(seatNumber)}
                    >
                      <span className="block w-4 h-5">{seatNumber}</span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-8"></div> {/* Vertical spacing */}
      <div className="flex justify-center mt-4 mb-4">
        <span className="font-semibold text-lg">Entrance</span>
      </div>
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-2">
          {[...Array(7).keys()].map((row) => (
            <div key={row} className="flex gap-2">
              {[...Array(7).keys()].map((col) => {
                const seatNumber = 228 + row * 7 + col + 1
                return (
                  <div
                    key={col}
                    className={`seat bg-gray-200 border border-gray-400 p-2 text-center cursor-pointer ${selectedSeat === seatNumber ? 'bg-yellow-400' : ''}`}
                    onClick={() => handleSeatClick(seatNumber)}
                  >
                    <span className="block w-4 h-5">{seatNumber}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="w-4"></div> {/* Entrance space */}
        <div className="flex flex-col gap-2" style={{ marginTop: '80px' }}>
          {[...Array(5).keys()].map((row) => (
            <div key={row} className="flex gap-2">
              {[...Array(5).keys()].map((col) => {
                const seatNumber = 277 + row * 5 + col + 1
                return (
                  <div
                    key={col}
                    className={`seat bg-gray-200 border border-gray-400 p-2 text-center cursor-pointer ${selectedSeat === seatNumber ? 'bg-yellow-400' : ''}`}
                    onClick={() => handleSeatClick(seatNumber)}
                  >
                    <span className="block w-4 h-5">{seatNumber}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="w-4"></div> {/* Entrance space */}
        <div className="flex flex-col gap-2">
          {[...Array(7).keys()].map((row) => (
            <div key={row} className="flex gap-2">
              {[...Array(7).keys()].map((col) => {
                const seatNumber = 332 + row * 7 + col + 1
                return (
                  <div
                    key={col}
                    className={`seat bg-gray-200 border border-gray-400 p-2 text-center cursor-pointer ${selectedSeat === seatNumber ? 'bg-yellow-400' : ''}`}
                    onClick={() => handleSeatClick(seatNumber)}
                  >
                    <span className="block w-4 h-5">{seatNumber}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Test

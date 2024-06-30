import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import jsQR from 'jsqr'
import { api } from '@/utils/api'
import { useLogin } from '@/components/LoginContext'

export const Scanner = () => {
  const [scanResult, setScanResult] = useState(null)
  const [scanResultInfo, setScanResultInfo] = useState(null)
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const { user } = useLogin()

  useEffect(() => {
    initializeScanner()
    return () => {
      stopCamera()
    }
  }, [navigate])

  const initializeScanner = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.addEventListener('loadedmetadata', () => {
            videoRef.current.play()
            scanQRCode()
          })
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err)
      })
  }

  const scanQRCode = () => {
    const checkQRCode = () => {
      if (!videoRef.current || videoRef.current.videoWidth === 0) {
        requestAnimationFrame(checkQRCode)
        return
      }

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        setScanResult(code.data)
        sendApiRequest(code.data)
        stopCamera()
      } else {
        requestAnimationFrame(checkQRCode)
      }
    }
    checkQRCode()
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject
      const tracks = stream.getTracks()

      tracks.forEach((track) => {
        track.stop()
      })
      videoRef.current.srcObject = null
    }
  }

  const sendApiRequest = async (result) => {
    try {
      const response = await api.post(`/payment/checkPayment`, {
        paymentId: result
      })
      if (response.status !== 200) {
        throw new Error('Failed to fetch data')
      }
      const data = await response.data
      setScanResultInfo(data)
      if (
        data &&
        data.exists &&
        !data.verified &&
        !data.validityPassed &&
        data.seatbooked
      ) {
        printTicket(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const printTicket = (data) => {
    const printContent = `
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            @page {
                size: 58mm 85mm;
                margin: 0;
            }
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: start;
                align-items: center;
            }
            .container {
                width: 48mm; /* 44mm - (5mm * 2) */
                height: 75mm; /* 72mm - (5mm * 2) */
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 4mm;
                border: 1mm solid #000;
            }
            .header {
                text-align: center; 
            }
            .logo {
                width: 20mm; /* Reduced logo size */
                height: 20mm; /* Reduced logo size */
                margin: auto;
                display: block;
            }
            .title {
                font-weight: bold;
                font-size: 4.5mm; /* Reduced font size */
                margin-top: 1mm; /* Reduced spacing */
                margin-bottom: 0.5mm; /* Reduced spacing */
            }
            .subtitle {
                font-size: 4mm; /* Reduced font size */
                margin-top: 0.5mm; /* Reduced spacing */
                margin-bottom: 1mm; /* Reduced spacing */
            }
            .seat-number {
                padding: 0.5mm; /* Reduced padding */
                text-align: center;
                font-weight: bold;
                font-size: 4mm; /* Reduced font size */
                margin-top: 1mm; /* Reduced spacing */
                margin-bottom: 1mm;
            }
            .footer {
                text-align: center;
                font-size: 4mm; /* Reduced font size */
            }
            .name {
                font-weight: bold;
                color: #333;
                font-size: 4.5mm; /* Reduced font size */
            }
            .line-between {
                border-bottom: 1px solid #000; /* Add line between "Movie Name" and "IIT Mandi" */
                margin-left: 1mm; /* Add margin from the left border */
                margin-right: 1mm; /* Add margin from the right border */
            }
        </style>
    </head>
    <body>
        <div class="container ticket w-54 h-72">
                    <div class="header">
                        <img id="logoImage" src="https://github.com/aryanjain2005/repo1/blob/main/logo2-DANloDCY-Photoroom.png?raw=true" alt="Film Screening Logo" class="logo">
                        <h2 class="title">IIT Mandi</h2> 
                        <p class="line-between"></p>
                        <p class="subtitle">Srikanth</p>
                        <p class="subtitle">${formatDate(data.showdate)}</p>
                        <p class="subtitle">${convertTo12HourFormat(
                          data.showtime
                        )}</p>
                    </div>
                    <div class="seat-number">Seat Number: ${data.seat}</div>
                    <div class="footer">
                        <p class="subtitle">Thanks for being a Valuable Member!</p>
                        <p class="subtitle">${data.name}</p>
                    </div>
                </ticket>
            </body>
            </html>        
    `

    // Create a new window
    const printWindow = window.open('', '_self')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()

      // Wait for the logo image to load completely before printing
      const logoImage = printWindow.document.getElementById('logoImage')
      if (logoImage) {
        logoImage.onload = () => {
          printWindow.print()
        }
      } else {
        console.error('Failed to find logo image element')
        printWindow.print() // Print even if logo image fails to load
      }
    } else {
      console.error('Failed to open print window')
    }
  }

  const convertTo12HourFormat = (time) => {
    // Extract hours and minutes
    const [hours, minutes] = time.split(':')

    // Convert hours to 12-hour format
    const ampm = hours >= 12 ? 'pm' : 'am'
    const adjustedHours = hours % 12 || 12

    // Construct the formatted time
    return `${adjustedHours}:${minutes.padStart(2, '0')} ${ampm}`
  }

  const formatDate = (dateString) => {
    const dateParts = dateString.split('/')
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    const day = parseInt(dateParts[0], 10)
    const monthIndex = parseInt(dateParts[1], 10) - 1
    const year = parseInt(dateParts[2], 10)

    return `${day} ${monthNames[monthIndex]}, ${year}`
  }

  return (
    <div className="flex justify-center w-full h-full mt-6 font-monts">
      <div style={{ maxWidth: '100%', height: 'auto' }}>
        {scanResult ? (
          <div>
            {scanResultInfo === null ? (
              <div>Scanning...</div>
            ) : (
              <div>
                {scanResultInfo.exists ? (
                  <div>
                    {scanResultInfo.validityPassed ? (
                      <div>
                        {' '}
                        Access denied: Validity of this QR has expired.
                      </div>
                    ) : (
                      <div>
                        {!scanResultInfo.seatbooked ? (
                          <div>
                            {' '}
                            Access denied: Please book a seat with this QR.
                          </div>
                        ) : (
                          <div>
                            {scanResultInfo.verified ? (
                              <div>
                                {' '}
                                Access denied: This QR is already verified and
                                used to watch a movie.
                              </div>
                            ) : (
                              <div>
                                Access granted for {scanResultInfo.email}.
                                Printing your ticket.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>Access denied: Invalid QR.</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <video ref={videoRef} width="100%" height="auto"></video>
        )}
      </div>
    </div>
  )
}

export default Scanner

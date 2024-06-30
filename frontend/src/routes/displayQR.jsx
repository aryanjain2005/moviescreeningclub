import { useState, useEffect } from 'react'
import { api } from '@/utils/api'
import QRCode from 'qrcode'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '@/components/LoginContext'
const QR = () => {
  const [validQRs, setValidQRs] = useState([])
  const [openedIndex, setOpenedIndex] = useState(null)
  const [isClicked, setClicked] = useState(true)
  const navigate = useNavigate()
  const { user } = useLogin()
  useEffect(() => {
    const fetchValidQRs = async () => {
      try {
        const response = await api.get(`/QR/${user?.email}`)
        const qrCodes = await Promise.all(
          response.data.qrCodes.map((qr) => generateQRCode(qr))
        )
        const filteredQRs = qrCodes.filter(
          (qr) => new Date(qr.expirationDate) > new Date()
        )
        setValidQRs(filteredQRs)
      } catch (error) {
        console.error('Error fetching valid QR codes:', error)
      }
    }

    fetchValidQRs()
  }, [user?.email])

  const generateQRCode = async (qr) => {
    try {
      const dataURL = await QRCode.toDataURL(qr.paymentId)
      return { ...qr, dataURL }
    } catch (error) {
      console.error('Error generating QR code:', error)
      return { ...qr, dataURL: '' }
    }
  }

  const handleUseQR = (qr) => {
    localStorage.setItem('seatassignment', 'true')
    navigate(`/allshowtime/${qr.paymentId}`)
  }

  const handleShowDialog = (index) => {
    setOpenedIndex(index === openedIndex ? null : index)
    if (index === null) setClicked(true)
    else if (openedIndex !== index) setClicked(false)
    else setClicked(true)
  }

  const renderQRStatus = (qr) => {
    if (qr.verified) {
      return (
        <div className="flex flex-col capitalize mt-3 font-monts ">
          <p className="flex">
            Seat Booked :{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="green"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </p>
          <p className="flex">
            Ticket Scanned :{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="green"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </p>
        </div>
      )
    } else {
      if (qr.used) {
        return (
          <div className="flex flex-col capitalize mt-3">
            <p className="flex">
              Seat Booked :{' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="green"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </p>
            <p className="flex">
              Ticket Scanned :{' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </p>
          </div>
        )
      } else {
        return (
          <div className="flex flex-col capitalize mt-3">
            <button
              className="flex justify-center bg-primary-600 p-2 text-white rounded-md mb-2"
              onClick={() => handleUseQR(qr)}
            >
              book seat
            </button>
            <p className="flex">
              Seat Booked :{' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </p>
            <p className="flex">
              Ticket Scanned :{' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </p>
          </div>
        )
      }
    }
  }

  return (
    <div>
      <div className={`bg-gray-200 flex flex-col items-center min-h-screen`}>
        <h2 className="text-2xl font-semibold mb-4 mt-7">Valid QR Codes</h2>
        <div className="flex flex-col bg-white h-1/2 w-4/5 max-sm:w-[95%] my-10 rounded-xl shadow-lg">
          {validQRs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg">You don't have any valid QR codes left.</p>
            </div>
          ) : (
            <div className="grid gap-6 my-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-5">
              {validQRs.map((qr, index) => (
                <div
                  key={index}
                  className={`even:bg-white odd:bg-slate-200 p-3 text-center flex flex-col items-center justify-center`}
                >
                  <img
                    className={`small ${isClicked ? 'blur-none' : 'blur-md'}`}
                    src={qr.dataURL}
                    onClick={() => handleShowDialog(index)}
                    alt={`QR Code ${index}`}
                  />
                  {openedIndex === index && (
                    <dialog
                      className={`absolute w-[30%] z-10 max-sm:w-[90%] ${
                        isClicked ? 'blur-md' : 'blur-none'
                      }`}
                      open
                      onClick={() => handleShowDialog(null)}
                    >
                      <img
                        className={`w-full h-full`}
                        src={qr.dataURL}
                        // onClick={()=>handleShowDialog(index)}
                        alt={`QR Code ${index}`}
                      />
                    </dialog>
                  )}
                  <p>{renderQRStatus(qr)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QR

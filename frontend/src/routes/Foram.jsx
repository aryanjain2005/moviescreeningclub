import { useState, useEffect } from 'react'
//import Razorpay  from 'razorpay';
import QRCode from 'qrcode'
import axios from 'axios'
import { useMembershipContext } from '@/components/MembershipContext'
import { getToken } from '../utils/getToken'
import { useNavigate } from 'react-router-dom'
import { SERVERIP } from '../config'
import Swal from 'sweetalert2'
import Image from '../images/camera.svg'

export const Foram = () => {
  const [amount, setAmount] = useState('')
  const { hasMembership, updateMembershipStatus } = useMembershipContext()
  const [membership, setMembership] = useState('')
  const [degree, setDegree] = useState('')
  const [email, setEmail] = useState('')
  const [openRazorpay, setOpenRazorpay] = useState(false)
  const name = localStorage.getItem('userName')

  const token = getToken()
  const navigate = useNavigate()

  useEffect(() => {
    const storedEmail = localStorage.getItem('loggedInUserEmail')
    if (!storedEmail) {
      navigate('/')
    } else {
      setEmail(storedEmail)
      setDegree(getDegreeFromEmail(storedEmail))
    }
  }, [navigate])

  const getDegreeFromEmail = (email) => {
    const emailDomain = email.substring(email.lastIndexOf('@') + 1)
    if (emailDomain === 'students.iitmandi.ac.in') {
      if (email.charAt(0).toLowerCase() === 'b') {
        return 'B-Tech'
      } else {
        return 'PHD/M-Tech'
      }
    } else if (
      emailDomain === 'iitmandi.ac.in' ||
      emailDomain === 'projects.iitmandi.ac.in'
    ) {
      return 'Faculty/Staff'
    } else {
      return 'Faculty/Staff'
    }
  }

  useEffect(() => {
    if (membership !== '' && amount !== '' && openRazorpay) {
      const options = {
        key: 'rzp_test_raxyaoALaCjvBM',
        amount: amount * 100,
        currency: 'INR',
        name: 'Chalchitra',
        description: 'for testing purpose',
        prefill: {
          name: 'Aryan'
        },
        notes: {
          address: 'Razorpay Corporate office'
        },
        theme: {
          color: '#3399cc'
        },
        handler: function (response) {
          updateMembershipStatus(true)

          // Process membership based on the selected membership type
          if (membership === 'base') {
            saveuserData(email, 'base', 7)
            saveData(response.razorpay_payment_id, 1, 'base', 7)
            generateAndSendEmail('base', response.razorpay_payment_id, 1)
          } else if (membership === 'silver') {
            saveuserData(email, 'silver', 15)
            saveData(response.razorpay_payment_id, 2, 'silver', 15)
            generateAndSendEmail('silver', response.razorpay_payment_id, 2)
          } else if (membership === 'gold') {
            saveuserData(email, 'gold', 30)
            saveData(response.razorpay_payment_id, 3, 'gold', 30)
            generateAndSendEmail('gold', response.razorpay_payment_id, 3)
          } else if (membership === 'diamond') {
            saveuserData(email, 'diamond', 30)
            saveData(response.razorpay_payment_id, 4, 'diamond', 30)
            generateAndSendEmail('diamond', response.razorpay_payment_id, 4)
          }
        }
      }
      const pay = new window.Razorpay(options)
      pay.open()
      setOpenRazorpay(false)
    }
  }, [membership, amount, openRazorpay])

  const handleSubmit = (e, selectedMembership) => {
    e.preventDefault()
    setMembership('')
    setAmount('')
    setOpenRazorpay(false)

    const amounts = {
      // "B-Tech": { base: 1, silver: 300, gold: 420, diamond: 520 },
      'B-Tech': { base: 1, silver: 1, gold: 1, diamond: 1 },
      // "PHD/M-Tech": { base: 1, silver: 340, gold: 480, diamond: 600 },
      'PHD/M-Tech': { base: 1, silver: 1, gold: 1, diamond: 1 },
      // "Faculty/Staff": { base: 1, silver: 380, gold: 540, diamond: 680 },
      'Faculty/Staff': { base: 1, silver: 1, gold: 1, diamond: 1 }
    }
    setMembership(selectedMembership)
    setAmount(amounts[degree][selectedMembership])
    setOpenRazorpay(true)
  }

  const generateAndSendEmail = (membership, paymentId, totalTickets) => {
    let qrCodes = []

    for (let i = 1; i <= totalTickets; i++) {
      QRCode.toDataURL(paymentId + i)
        .then((qrCodeData) => {
          qrCodes.push(qrCodeData)
          if (qrCodes.length === totalTickets) {
            sendEmail(membership, paymentId, qrCodes)
          }
        })
        .catch((error) => {
          console.error('Error generating QR code:', error)
        })
    }
  }

  const sendEmail = (membership, paymentId, qrCodes) => {
    const emailContent = {
      email,
      membership,
      paymentId,
      qrCodes
    }
    axios
      .post(`/QR/send-email`, emailContent)
      .then((response) => {
        // Swal.fire({
        //   title: "Error",
        //   text: `Email sent successfully for ${membership} membership.`,
        //   icon: "error",
        // });
      })
      .catch((error) => {
        console.error('Error sending email:', error)
        Swal.fire({
          title: 'Error',
          text: 'Error sending email. Please try again later.',
          icon: 'error'
        })
      })
  }

  const saveuserData = (email, memtype, validity) => {
    const userData = { email, memtype, validity }
    axios
      .post(`/memrouter/saveusermem`, userData)
      .then((response) => {
        // Swal.fire({
        //   title: "Error",
        //   text: `Usermem data saved successfully for ${(memtype, email)}`,
        //   icon: "error",
        // });
      })
      .catch((error) => {
        console.error('Error saving Usermemdata:', error)
        Swal.fire({
          title: 'Error',
          text: 'Error saving Usermemdata. Please try again later.',
          icon: 'error'
        })
      })
  }

  const saveData = (basePaymentId, totalTickets, memtype, validity) => {
    let ticketsGenerated = 0

    const saveTicket = (ticketNumber) => {
      const paymentId = basePaymentId + ticketNumber // Append ticket number to basePaymentId
      const QRData = { name, email, paymentId, validity, memtype }
      axios
        .post(`/QR/saveQR`, QRData)
        .then((response) => {
          ticketsGenerated++
          if (ticketsGenerated === totalTickets) {
            Swal.fire({
              title: 'Success',
              text: `${memtype} membership purchase successful`,
              icon: 'success',
              customClass: {
                icon: 'swal2-success-icon' // Class for the success icon
              }
            })
          } else {
            const nextTicketNumber = ticketNumber + 1
            saveTicket(nextTicketNumber) // Call the function recursively until all tickets are generated
          }
        })
        .catch((error) => {
          console.error('Error saving QR data:', error)
          Swal.fire({
            title: 'Error',
            text: 'Error saving QR data. Please try again later.',
            icon: 'error'
          })
        })
    }
    saveTicket(1) // Start with ticket number 1
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  })

  if (!hasMembership) {
    return (
      <div className="flex justify-center items-center bg-gray-200 min-h-screen font-monts pb-3">
        <div className="flex flex-col items-center lg:w-[90%] h-[95%] border rounded-md">
          <h2 className="text-3xl text-center font-bold mt-4">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-4 max-sm:grid-cols-1 max-lg:grid-cols-2 gap-4 w-full justify-items-center h-[85%] pt-10">
            <div className="bg-gradient-to-bl from-red-400 to-red-100 w-full max-sm:w-[90%] border-2 border-gray-200 hover:border-2 hover:border-[#332941] rounded-lg flex flex-col justify-around gap-5 mt-10 hover:scale-110 transition-transform duration-300">
              <div className="flex justify-evenly my-8">
                <img src={Image} alt="not found" className="w-[30%]" />
                <div className="flex flex-col justify-between">
                  <span className="text-2xl mt-2 font-semibold">Base</span>
                  <span className="text-lg mt-2 font-md">Subscription</span>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <ul className="flex flex-col gap-2 w-[90%]">
                  <li className="flex gap-5 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                    <span>1 Pass</span>
                  </li>
                  {degree === 'B-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  {degree === 'PHD/M-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  {degree !== 'B-Tech' && degree !== 'PHD/M-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  <li className="flex gap-5 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                    <span className="flex items-end">
                      <p>Validity: </p>
                      <p className="text-lg ml-2 font-semibold">7 </p>
                      <p>Days</p>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center items-center h-[15%]">
                <button
                  onClick={(e) => handleSubmit(e, 'base')}
                  className=" w-4/5 h-[60%] max-sm:h-full max-sm:mb-3 bg-gray-800 text-white flex justify-center items-center rounded-lg py-4"
                >
                  subscribe
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-bl from-gray-400 to-gray-50 w-full max-sm:w-[90%] border-2 border-gray-200 hover:border-2 hover:border-[#332941] rounded-lg flex flex-col justify-around gap-5 mb-10 hover:scale-110 transition-transform duration-300 ">
              <div className="flex justify-evenly my-8">
                <img src={Image} alt="not found" className="w-[30%]" />
                <div className="flex flex-col justify-between">
                  <span className="text-2xl mt-2 font-semibold">Silver</span>
                  <span className="text-lg mt-2 font-md">Subscription</span>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <ul className="flex flex-col gap-2 w-[90%]">
                  <li className="flex gap-5 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                    <span>2 Passes</span>
                  </li>

                  {degree === 'B-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  {degree === 'PHD/M-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  {degree !== 'B-Tech' && degree !== 'PHD/M-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  <li className="flex gap-5 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                    <span className="flex items-end">
                      <p>Validity: </p>
                      <p className="text-lg ml-2 font-semibold">15 </p>
                      <p>Days</p>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center items-center h-[15%]">
                <button
                  onClick={(e) => handleSubmit(e, 'silver')}
                  className=" w-4/5 h-[60%] max-sm:h-full max-sm:mb-3 bg-gray-800 text-white flex justify-center items-center rounded-lg py-4"
                >
                  subscribe
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-bl from-amber-400 to-yellow-100 w-full max-sm:w-[90%] border-2 border-gray-200 hover:border-2 hover:border-[#332941] rounded-lg flex flex-col justify-around gap-5 mt-10 max-sm:mt-0 hover:scale-110 transition-transform duration-300">
              <div className="flex justify-evenly my-8">
                <img src={Image} alt="not found" className="w-[30%]" />
                <div className="flex flex-col justify-between">
                  <span className="text-2xl mt-2 font-semibold">Gold</span>
                  <span className="text-lg mt-2 font-md">Subscription</span>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <ul className="flex flex-col gap-2 w-[90%]">
                  <li className="flex gap-5 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                    <span>3 Passes</span>
                  </li>
                  {degree === 'B-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  {degree === 'PHD/M-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  {degree !== 'B-Tech' && degree !== 'PHD/M-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  <li className="flex gap-5 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                    <span className="flex items-end">
                      <p>Validity: </p>
                      <p className="text-lg ml-2 font-semibold">30 </p>
                      <p>Days</p>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center items-center h-[15%] ">
                <button
                  onClick={(e) => handleSubmit(e, 'gold')}
                  className=" w-4/5 h-[60%] max-sm:h-full max-sm:mb-3 bg-gray-800 text-white flex justify-center items-center rounded-lg py-4"
                >
                  subscribe
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-bl from-blue-400 to-cyan-50 w-full max-sm:w-[90%] border-2 border-gray-200 hover:border-2 hover:border-[#332941] rounded-lg flex flex-col justify-around gap-5 mb-10 hover:scale-110 transition-transform duration-300">
              <div className="flex justify-evenly my-8">
                <img src={Image} alt="not found" className="w-[30%]" />
                <div className="flex flex-col justify-between">
                  <span className="text-2xl mt-2 font-semibold">Diamond</span>
                  <span className="text-lg mt-2 font-md">Subscription</span>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <ul className="flex flex-col gap-2 w-[90%]">
                  <li className="flex gap-5 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                    <span>4 Passes</span>
                  </li>
                  {degree === 'B-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  {degree === 'PHD/M-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  {degree !== 'B-Tech' && degree !== 'PHD/M-Tech' && (
                    <li className="flex gap-5 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <span className="flex items-end">
                        <p>Price: </p>
                        <p className="text-xl ml-2 font-semibold">₹1/</p>
                        <p>Month </p>
                      </span>
                    </li>
                  )}
                  <li className="flex gap-5 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                      />
                    </svg>
                    <span className="flex items-end">
                      <p>Validity: </p>
                      <p className="text-lg ml-2 font-semibold">30 </p>
                      <p>Days</p>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center items-center h-[15%]">
                <button
                  onClick={(e) => handleSubmit(e, 'diamond')}
                  className=" w-4/5 h-[60%] max-sm:h-full max-sm:mb-3 bg-gray-800 text-white flex justify-center items-center rounded-lg py-4"
                >
                  subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    navigate('/')
    return null
  }
}

export default Foram

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '@/utils/api'
import imageOne from '@/images/forgotPassword.svg'
import { SERVERIP } from '@/config'
import Swal from 'sweetalert2'

export default function UpdatePassword() {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('forgotpassEmail') || '',
    password: '',
    otp: ''
  })

  const { email, password, otp } = formData
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post(`/login/update`, formData)
      if (res.data.success) {
        localStorage.removeItem('forgotpassEmail')
        navigate('/login')
      } else {
        console.error('failed to save')
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'invalid otp', icon: 'error' })
    }
  }

  // Check if forgotpassEmail exists in localStorage, if not, redirect to /forgot
  if (!localStorage.getItem('forgotpassEmail')) {
    navigate('/forgot')
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-[#e5e8f0] capitalize font-monts">
        <div className="flex items-center justify-center w-[80%] h-[90%] bg-white rounded-3xl max-sm:h-[70%] max-sm:w-[90%]">
          <div className="flex w-[99.5%] h-[99%] bg-gradient-to-r from-white to-gray-100 rounded-3xl">
            <div className="w-[50%] h-full flex justify-center items-center max-sm:hidden">
              <div className="w-[98%] h-[98%] rounded-2xl flex justify-center items-center bg-[#da9afe]">
                <img
                  src={imageOne}
                  className="h-2/3 w-2/3 rounded-2xl"
                  alt="Login"
                />
              </div>
            </div>
            <div className="flex justify-center items-center w-1/2 max-sm:w-full">
              <div className="flex flex-col justify-center gap-6 h-full w-[90%] max-sm:text-sm">
                <div className="h-[20%] max-sm:h-[30%]">
                  <p className="text-center font-bold text-3xl max-sm:text-lg">
                    Enter the new details here
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 h-[60%]">
                  <div className="flex-col justify-center text-lg h-[50%] w-[90%] border rounded-2xl">
                    <div className="flex-col justify-start w-[90%]">
                      <div className="flex items-center py-1 w-[100%]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          strokeOpacity={0.5}
                          className="w-8 h-8 mx-2 max-sm:w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                          />
                        </svg>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="border w-full rounded-2xl text-center max-sm:text-sm"
                          required
                          value={email}
                          onChange={handleChange}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex-col justify-start w-[90%]">
                      <div className="flex items-center py-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          strokeOpacity={0.5}
                          class="w-8 h-8 mx-2 max-sm:w-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                          />
                        </svg>
                        <input
                          type="password"
                          id="otp"
                          name="otp"
                          className="border w-full rounded-2xl text-center max-sm:text-sm"
                          required
                          value={otp}
                          placeholder="OTP"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="flex-col justify-start w-[90%]">
                      <div className="flex items-centre py-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          strokeOpacity={0.5}
                          class="w-8 h-8 mx-2 max-sm:w-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                          />
                        </svg>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="border w-full rounded-2xl text-center max-sm:text-sm"
                          required
                          value={password}
                          placeholder="New Password"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="flex justify-center items-center bg-[#fe6b68] w-4/5 h-[15%] p-2 text-white rounded-xl "
                    type="button"
                  >
                    Submit
                  </button>
                  <span className="form-text border-t-2 w-4/5 text-center mt-2 py-2">
                    Already have an account --{' '}
                    <Link className="text-blue-600" to="/login">
                      Login
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import imageOne from "../images/forgotPassword.svg";
import { SERVERIP } from "../config";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { email } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${SERVERIP}/otp/user-otp1`, {
        email,
      });
      if (res.status === 200) {
        setIsSubmitting(true);
        const res1 = await axios.post(
          `${SERVERIP}/otp/send-otp-forgot`,
          formData
        );
        if (res1.data.success) {
          
          localStorage.setItem("forgotpassEmail", formData.email); // Store email in local storage
          navigate("/update");
        } 
        // else{}
      }
    } catch (err) {
      if (err.response.status === 401) {
        Swal.fire({ title: "Error", text: "User does not exist please sign up", icon: "error" });
      } else if (err.response.status === 500) {
        Swal.fire({ title: "Error", text: "Internal server error", icon: "error" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
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
                  Forgot password?
                </p>
                <p className="text-center font-normal text-2xl mt-4 max-sm:text-medium">
                  No problem we got that covered
                </p>
                <p className="text-center font-normal text-2xl mt-4 max-sm:text-medium">
                  enter email to recieve OTP
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 h-[60%]">
                <div className="flex justify-center text-lg h-[15%] w-[82%] border rounded-2xl">
                  <div className="flex items-center">
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
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="border w-full rounded-2xl text-center max-sm:text-sm"
                    placeholder="enter your email"
                    required
                    value={email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                <Link
                  className="flex justify-end text-blue-600 w-4/5 mb-3"
                  to="/forgot"
                >
                  resend otp
                </Link>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex justify-center items-center bg-[#fe6b68] w-4/5 h-[15%] p-2 text-white rounded-xl "
                  type="button"
                >
                  {isSubmitting ? "Submitting ..." : "Submit"}
                </button>
                <span className="form-text border-t-2 w-4/5 text-center mt-2 py-2">
                  Already have an account --{" "}
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
  );
}

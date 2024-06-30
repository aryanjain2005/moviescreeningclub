import  { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import imageOne from "../images/signupImg.svg";
import { SERVERIP } from "../config";
import Swal from "sweetalert2";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    designation: "",
    password: "",
    otp: "",
  });

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("getotpEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      parseEmail(storedEmail);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value 
    });
    if (name === "email") {
      parseEmail(value);
    }
  };

  const parseEmail = (email) => {
    email = email.trim();
    console.log(email);
    if (email.endsWith("@students.iitmandi.ac.in")) {
      setIsValidEmail(true);
      if (email.toLowerCase().startsWith("b")) {
        setFormData({ ...formData, designation: "B-Tech" });
      } else {
        setFormData({ ...formData, designation: "PHD/M-Tech" });
      }
    } else if ((email.endsWith("@iitmandi.ac.in"))|| (email.endsWith("@projects.iitmandi.ac.in"))) {
      setIsValidEmail(true);
      setFormData({ ...formData, designation: "Faculty/Staff" });
    } else {
      setIsValidEmail(false);
      setFormData({ ...formData, designation: "Faculty/Staff" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail) {
      Swal.fire({ title: "Error", text: "Please enter a valid college email ID.", icon: "error" });
      return;
    }

    try {
      const res = await axios.post(`${SERVERIP}/auth/signup`, {
        ...formData,
        email,
      });
      localStorage.setItem("signupEmail", email);
      localStorage.removeItem("getotpEmail");
      navigate("/login");
    } catch (err) {
      Swal.fire({ title: "Error", text: "Email already registered", icon: "error" });
      console.error("Error occurred:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleOTPVisibility = () => {
    setShowOTP(!showOTP);
  };

  if (!localStorage.getItem("getotpEmail")) {
    navigate("/getOTP");
  }

  const { name, phoneNumber, password, otp } = formData;

  return (
    <div className="flex justify-center items-center h-screen bg-[#e5e8f0] font-monts">
      <div className="flex items-center justify-center w-[80%] h-[90%] bg-white rounded-3xl max-sm:h-[80%] max-sm:w-[90%]">
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
          <div className="flex justify-center items-center mt-4 w-1/2 max-sm:w-full">
            <div className="flex flex-col justify-center gap-6 h-full w-[90%] max-sm:text-sm">
              <div className="h-[15%]">
                <p className="text-center font-bold text-3x max-sm:text-lg">
                  New User Sign-up
                </p>
                <p className="text-center font-normal text-2xl mt-4 max-sm:text-medium">
                  Please sign-up to continue
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 h-[80%]">
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
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={handleChange}
                    className="border w-full rounded-2xl text-center max-sm:text-sm"
                  />
                </div>
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
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={handleChange}
                    className="border w-full rounded-2xl text-center max-sm:text-sm"
                  />
                </div>

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
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    placeholder="Enter your Degree"
                    required
                    value={formData.designation}
                    readOnly
                    className="border w-full rounded-2xl text-center max-sm:text-sm"
                  />
                </div>

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
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={handleChange}
                    readOnly
                    className="border w-full rounded-2xl text-center max-sm:text-sm"
                  />
                </div>

                <div className="flex justify-center text-lg h-[15%] w-[82%] border rounded-2xl">
                  <div
                    className="flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
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
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.2}
                        stroke="currentColor"
                        strokeOpacity={0.5}
                        className="w-8 h-8 mx-2 max-sm:w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={handleChange}
                    className="border w-full rounded-2xl text-center max-sm:text-sm"
                  />
                </div>

                <div className="flex justify-center text-lg h-[15%] w-[82%] border rounded-2xl">
                  <div
                    className="flex items-center"
                    onClick={toggleOTPVisibility}
                  >
                    {showOTP ? (
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
                          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                    ) : (
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
                          d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                    )}
                  </div>
                  <input
                    type={showOTP ? "password" : "text"}
                    id="otp"
                    name="otp"
                    placeholder="Enter OTP"
                    required
                    value={otp}
                    onChange={handleChange}
                    className="border w-full rounded-2xl text-center max-sm:text-sm"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!isValidEmail}
                  className="flex justify-center items-center bg-[#fe6b68] w-4/5 h-[15%] p-2 text-white rounded-xl"
                >
                  Submit
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
};

export default Signup;

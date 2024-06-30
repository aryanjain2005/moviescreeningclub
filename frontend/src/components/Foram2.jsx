import { useState, useEffect } from "react";
import { useMembershipContext } from "./MembershipContext";
import { getToken } from "../utils/getToken";
import { useNavigate } from "react-router-dom";
import { SERVERIP } from "../config";
import UploadWidget from "../utils/uploadWidget";
import Swal from "sweetalert2";
import { Button, user } from "@nextui-org/react";
import Qr1 from "../images/QR1.png";
import Qr2 from "../images/QR2.png";
import Qr3 from "../images/QR3.png";
import Qr4 from "../images/QR4.png";
import Qr5 from "../images/QR5.png";
import Qr6 from "../images/QR6.png";
import Qr7 from "../images/QR7.png";
import Qr8 from "../images/QR8.png";
import Qr9 from "../images/QR9.png";
import Qr10 from "../images/QR10.png";
import Qr11 from "../images/QR11.png";
import Qr12 from "../images/QR12.png";

const Foram2 = () => {
  const { hasMembership, updateMembershipStatus } = useMembershipContext();
  const [degree, setDegree] = useState("");
  const [email, setEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [membership, setMembership] = useState("");
  const [qrImages, setQrImages] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const mem = ["Base", "Silver", "Gold", "Diamond"];
  const passes = ["1", "2", "3", "4"];
  const interval = ["4 Years", "4 Years", "4 Years", "4 Years"];
  const name = localStorage.getItem("userName");
  const phoneNumber = localStorage.getItem("userPhone");
  const imageUrl=localStorage.getItem('imgurl');


  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("loggedInUserEmail");
    if (!storedEmail) {
      navigate("/");
    } else {
      setEmail(storedEmail);
      const degreeInfo = getDegreeFromEmail(storedEmail);
      setDegree(degreeInfo.degree);
      setQrImages(degreeInfo.qrImages);
      setAmounts(degreeInfo.amounts);
    }
  }, [navigate]);

  const getDegreeFromEmail = (email) => {
    let degree, qrImages, amounts;
    const emailDomain = email.substring(email.lastIndexOf("@") + 1);
    if (emailDomain === "students.iitmandi.ac.in") {
      if (email.charAt(0).toLowerCase() === "b") {
        qrImages = [Qr1, Qr2, Qr3, Qr4];
        amounts = [100, 200, 300, 400];
        degree = "B-Tech";
      } else {
        qrImages = [Qr5, Qr6, Qr7, Qr8];
        amounts = [110, 220, 330, 440];
        degree = "PHD/M-Tech";
      }
    } else if ((emailDomain === "iitmandi.ac.in")|| (emailDomain === "projects.iitmandi.ac.in")) {
      qrImages = [Qr9, Qr10, Qr11, Qr12];
      amounts = [120, 240, 360, 480];
      degree = "Faculty/Staff";
    } else {
      qrImages = [Qr9, Qr10, Qr11, Qr12];
      amounts = [200, 380, 540, 680];
      degree = "Faculty/Staff";
    }
    return { degree, qrImages, amounts };
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Define the data to be sent to the backend
    const data = {
      name,
      phoneNumber,
      degree,
      email,
      membership,
      transactionId,
      imageUrl,
    };

    try {
      const response = await fetch(`${SERVERIP}/payment/tempPayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the JSON response data
      const responseData = await response.json();
      Swal.fire({
        title:'success',
        text:'we will verify your transaction and inform you about confirmation',
        icon:'success',
      })
      updateMembershipStatus(true);
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("There was a problem saving the data:", error);
    }
  };


  if (!hasMembership) {
    return (
      <div className="flex justify-center items-center bg-gray-200 min-h-screen font-monts pb-3">
        <div className="flex flex-col items-center lg:w-[90%] h-[95%] border rounded-md">
          <h2 className="text-3xl text-center font-bold mt-4">
            Choose Your Plan
          </h2>
          {qrImages.map((qr, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 w-full items-center pt-10"
            >
              <div
                className={`bg-gradient-to-bl from-${
                  index === 0
                    ? "red"
                    : index === 1
                    ? "gray"
                    : index === 2
                    ? "amber"
                    : "blue"
                }-400 to-${
                  index === 0
                    ? "red"
                    : index === 1
                    ? "gray"
                    : index === 2
                    ? "yellow"
                    : "cyan"
                }-100 w-1/3 max-sm:w-[90%] border-2 border-gray-200 hover:border-2 hover:border-[#332941] rounded-lg flex flex-col justify-around gap-5 mt-10 ${
                  index !== 0 ? "mb-10" : ""
                } hover:scale-110 transition-transform duration-300`}
              >
                <div className="flex justify-evenly my-8">
                  <img src={qr} alt="not found" className="w-[40%]" />
                  <div className="flex flex-col justify-between w-1/2">
                    <span className="text-2xl mt-2 font-semibold">
                      {mem[index]}
                    </span>
                    <span className="text-lg mt-2 font-md">Subscription</span>
                    <span className="text-sm mt-4">
                      *scan the QR code to get the subscription and then fill the form at the bottom of the page to verify the membership
                    </span>
                  </div>
                </div>
                <div className="flex justify-center mt-6 mb-10">
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
                      <span>{passes[index]} Passes</span>
                    </li>
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
                        <p className="text-xl ml-2 font-semibold">
                          ₹{amounts[index]}
                        </p>
                      </span>
                    </li>
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
                        <p className="text-lg ml-2 font-semibold">
                          {interval[index]}{" "}
                        </p>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
          {/* {qrImages.map((qr, index) => (
            <div
              key={index}
              className="grid grid-cols-4 max-sm:grid-cols-1 max-lg:grid-cols-2 gap-4 w-full justify-items-center h-[85%] pt-10"
            >
              <div
                className={`bg-gradient-to-bl from-${
                  index === 0
                    ? "red"
                    : index === 1
                    ? "gray"
                    : index === 2
                    ? "amber"
                    : "blue"
                }-400 to-${
                  index === 0
                    ? "red"
                    : index === 1
                    ? "gray"
                    : index === 2
                    ? "yellow"
                    : "cyan"
                }-100 w-full max-sm:w-[90%] border-2 border-gray-200 hover:border-2 hover:border-[#332941] rounded-lg flex flex-col justify-around gap-5 mt-10 ${
                  index !== 0 ? "mb-10" : ""
                } hover:scale-110 transition-transform duration-300`}
              >
                <div className="flex justify-evenly my-8">
                  <img src={qr} alt="not found" className="w-[40%]" />
                  <div className="flex flex-col justify-start w-1/2">
                    <span className="text-2xl mt-2 font-semibold">Base</span>
                    <span className="text-lg font-md">Subscription</span>
                    <span className="text-sm mt-4">
                      *scan the QR code to get the subscription
                    </span>
                  </div>
                </div>
                <div className="flex justify-center mt-6 mb-10">
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
                        <p className="text-xl ml-2 font-semibold">
                          ₹{amounts[index]}/
                        </p>
                        <p>Month </p>
                      </span>
                    </li>
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
              </div>
              <div className="bg-gradient-to-bl from-gray-400 to-gray-50 w-full max-sm:w-[90%] border-2 border-gray-200 hover:border-2 hover:border-[#332941] rounded-lg flex flex-col justify-around gap-5 mb-10 hover:scale-110 transition-transform duration-300 ">
                <div className="flex justify-evenly my-8">
                  <img src={qr} alt="not found" className="w-[40%]" />
                  <div className="flex flex-col justify-between w-1/2">
                    <span className="text-2xl mt-2 font-semibold">Silver</span>
                    <span className="text-lg mt-2 font-md">Subscription</span>
                    <span className="text-sm mt-4">
                      *scan the QR code to get the subscription
                    </span>
                  </div>
                </div>
                <div className="flex justify-center mt-6 mb-10">
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
                        <p className="text-xl ml-2 font-semibold">
                          ₹{amounts[index]}/
                        </p>
                        <p>Month </p>
                      </span>
                    </li>
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
              </div>
              <div className="bg-gradient-to-bl from-amber-400 to-yellow-100 w-full max-sm:w-[90%] border-2 border-gray-200 hover:border-2 hover:border-[#332941] rounded-lg flex flex-col justify-around gap-5 mt-10 max-sm:mt-0 hover:scale-110 transition-transform duration-300">
                <div className="flex justify-evenly my-8">
                  <img src={qr} alt="not found" className="w-[40%]" />
                  <div className="flex flex-col justify-between w-1/2">
                    <span className="text-2xl mt-2 font-semibold">Gold</span>
                    <span className="text-lg mt-2 font-md">Subscription</span>
                    <span className="text-sm mt-4">
                      *scan the QR code to get the subscription
                    </span>
                  </div>
                </div>
                <div className="flex justify-center mt-6 mb-10">
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
                        <p className="text-xl ml-2 font-semibold">
                          ₹{amounts[index]}/
                        </p>
                        <p>Month </p>
                      </span>
                    </li>
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
              </div>

              <div className="bg-gradient-to-bl from-blue-400 to-cyan-50 w-full max-sm:w-[90%] border-2 border-gray-200 hover:border-2 hover:border-[#332941] rounded-lg flex flex-col justify-around gap-5 mb-10 hover:scale-110 transition-transform duration-300">
                <div className="flex justify-evenly my-8">
                  <img src={qr} alt="not found" className="w-[40%]" />
                  <div className="flex flex-col justify-between w-1/2">
                    <span className="text-2xl mt-2 font-semibold">Diamond</span>
                    <span className="text-lg mt-2 font-md">Subscription</span>
                    <span className="text-sm mt-4">
                      *scan the QR code to get the subscription
                    </span>
                  </div>
                </div>
                <div className="flex justify-center mt-6 mb-10">
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
                        <p className="text-xl ml-2 font-semibold">
                          ₹{amounts[index]}/
                        </p>
                        <p>Month </p>
                      </span>
                    </li>
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
                        <p className="text-lg ml-2 font-semibold">4 </p>
                        <p>Years</p>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))} */}
          <div className="mt-10 capitalize flex flex-col items-center gap-3">
            <h2 className="font-semibold text-xl">
              Fill out this form after payment
            </h2>
              <UploadWidget /> 
            <div>
              <span className="mr-3">Membership chosen:</span>
              
              <select
                value={membership}
                onChange={(e) => {
                  setMembership(e.target.value);
                }}
                required
              >
                <option value="">Select Membership</option>
                <option value="Base">Base</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
            <div>
              <span className="mr-3">Transaction ID (UPI TID):</span>
              <input
                type="text"
                placeholder="Your transaction ID (UTI)"
                value={transactionId}
                required
                onChange={(e) => {
                  setTransactionId(e.target.value);
                }}
              />
            </div>
            <Button
              color="success"
              type="submit"
              onClick={submitHandler}
              disabled={!membership || !transactionId}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    navigate("/");
    return null;
  }
};

export default Foram2;

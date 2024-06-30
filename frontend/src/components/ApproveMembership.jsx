import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SERVERIP } from "../config";
import { getToken } from "../utils/getToken";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  chip,
} from "@nextui-org/react";

export default function ApproveMembership() {
  const [membershipData, setMembershipData] = useState([]);
  const token = getToken();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (
      !userType ||
      userType === "standard" ||
      userType === "ticketvolunteer" ||
      userType === "movievolunteer" ||
      userType === "volunteer"
    ) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    fetchMembershipData();
  }, []);

  const generateAndSendEmail = (membership, paymentId, totalTickets, email) => {
    let qrCodes = [];
    for (let i = 1; i <= totalTickets; i++) {
      QRCode.toDataURL(paymentId + i)
        .then((qrCodeData) => {
          qrCodes.push(qrCodeData);
          if (qrCodes.length === totalTickets) {
            sendEmail(membership,paymentId,qrCodes,email);
          }
        })
        .catch((error) => {
          console.error("Error generating QR code:", error);
        });
    }
  };

  const sendEmail = (membership, paymentId, qrCodes, email) => {
    const emailContent = {
      email,
      membership,
      paymentId,
      qrCodes,
    };
    axios
      .post(`${SERVERIP}/QR/send-email`, emailContent)
      .then((response) => {
        console.log(`Email sent for ${membership} membership.`);
        // Swal.fire({
        //   title: "Error",
        //   text: `Email sent successfully for ${membership} membership.`,
        //   icon: "error",
        // });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        Swal.fire({
          title: "Error",
          text: "Error sending email. Please try again later.",
          icon: "error",
        });
      });
  };

  const saveuserData = (email, memtype, validity) => {
    const userData = { email, memtype, validity };
    axios.post(`${SERVERIP}/memrouter/saveusermem`, userData)
      .then((response) => {
        console.log(`Usermem data saved successfully for ${(memtype, email)}`);
        axios.post('http://localhost:27017/designation/update-designation-counts');
        // Swal.fire({
        //   title: "Error",
        //   text: `Usermem data saved successfully for ${(memtype, email)}`,
        //   icon: "error",
        // });
      })
      .catch((error) => {
        console.error("Error saving Usermemdata:", error);
        Swal.fire({
          title: "Error",
          text: "Error saving Usermemdata. Please try again later.",
          icon: "error",
        });
      });

      
  };

  const saveData = (
    basePaymentId,
    totalTickets,
    memtype,
    validity,
    name,
    email
  ) => {
    let ticketsGenerated = 0;

    const saveTicket = (ticketNumber) => {
      const paymentId = basePaymentId + ticketNumber;
      const QRData = { name, email, paymentId, validity, memtype };
      axios
        .post(`${SERVERIP}/QR/saveQR`, QRData)
        .then((response) => {
          ticketsGenerated++;
          if (ticketsGenerated === totalTickets) {
            Swal.fire({
              title: "Success",
              text: `${memtype} membership purchase successful`,
              icon: "success",
              customClass: {
                icon: "swal2-success-icon", // Class for the success icon
              },
            });
          } else {
            const nextTicketNumber = ticketNumber + 1;
            saveTicket(nextTicketNumber); // Call the function recursively until all tickets are generated
          }
        })
        .catch((error) => {
          console.error("Error saving QR data:", error);
          Swal.fire({
            title: "Error",
            text: "Error saving QR data. Please try again later.",
            icon: "error",
          });
        });
    };
    saveTicket(1); // Start with ticket number 1
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  });

  const fetchMembershipData = async () => {
    try {
      const response = await axios.get(`${SERVERIP}/payment/membershipData`);
      setMembershipData(response.data);
    } catch (error) {
      console.error("Error fetching membership data:", error);
    }
  };

  const handleConfirm = async (id, payment_id, email, membership, name) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, confirm it!",
        cancelButtonText: "No, cancel!",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`${SERVERIP}/payment/confirmMembership/${id}`);
          Swal.fire("Confirmed!", "Membership has been confirmed.", "success");
          // Now, call the subsequent functions after membership confirmation
          await fetchMembershipData();
          if (membership === "Base") {
            await saveuserData(email, "base", 9999);
            await saveData(payment_id, 1, "base", 9999, name, email);
            await generateAndSendEmail("base", payment_id, 1, email);
          } else if (membership === "Silver") {
            await saveuserData(email, "silver", 9999);
            await saveData(payment_id, 2, "silver", 9999, name, email);
            await generateAndSendEmail("silver", payment_id, 2, email);
          } else if (membership === "Gold") {
            await saveuserData(email, "gold", 9999);
            await saveData(payment_id, 3, "gold", 9999, name, email);
            await generateAndSendEmail("gold", payment_id, 3, email);
          } else if (membership === "Diamond") {
            await saveuserData(email, "diamond", 9999);
            await saveData(payment_id, 4, "diamond", 9999, name, email);
            await generateAndSendEmail("diamond", payment_id, 4, email);
          }
        }
      });
    } catch (error) {
      console.error("Error confirming membership:", error);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`${SERVERIP}/payment/deleteMembership/${id}`);
          Swal.fire("Deleted!", "Membership has been deleted.", "success").then(
            fetchMembershipData()
          );

        }
      });
      fetchMembershipData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting membership:", error);
    }
  };

  const columns = [
    "name",
    "email",
    "phone Number",
    "designation",
    "membership",
    "transaction id",
    "imageurl",
    "confirm",
    "delete",
  ];

  const topContent = useMemo(() => {
    return (
      <div>
        <h1 className="text-2xl mb-2">Approve Membership</h1>
      </div>
    );
  });

  return (
    // <div className="flex flex-col items-center">
    <div className="flex justify-center h-1/2 font-monts">
      <Table
        isStriped
        className="w-4/5 max-sm:w-[95%] my-5"
        aria-label="Membership Table"
        topContent={topContent}
      >
        <TableHeader
          className="capitalize"
          columns={columns.map((column) => ({ key: column, label: column }))}
        >
          {(column) => (
            <TableColumn className="capitalize" key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {membershipData.map((member, index) => (
            <TableRow key={index}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phoneNumber}</TableCell>
              <TableCell>{member.degree}</TableCell>
              <TableCell>
                {member.membership === "Base" ? (
                  <Chip variant="solid" color="secondary">{member.membership}</Chip>
                ) : member.membership==='Silver'? (
                  <Chip variant="solid" color="default">{member.membership}</Chip>
                  ) :member.membership==="Gold"?(
                    <Chip variant="solid" color="warning">{member.membership}</Chip>
                  ):member.membership==='Diamond'?(
                    <Chip variant="solid" color="primary">{member.membership}</Chip>
                  ):''
                }
                </TableCell>
              <TableCell>{member.transactionId}</TableCell>
              <TableCell>
                <img src={member.imageUrl} alt="not uploaded" />
              </TableCell>
              <TableCell>
                {
                  member.flag === "Yes" ? (
                    <Chip
                      // startContent={ size={18} />}
                      variant="bordered"
                      color="success"
                    >
                      Confirmed
                    </Chip>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="green"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() =>
                        handleConfirm(
                          member._id,
                          member.transactionId,
                          member.email,
                          member.membership,
                          member.name
                        )
                      }
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
                  )
                  //  <button onClick={() => handleConfirm(member._id, member.transactionId, member.email, member.membership, member.name)}>Confirm</button>
                }
              </TableCell>
              <TableCell>
                {member.flag === "Yes" ? (
                  <Chip
                    // startContent={ size={18} />}
                    variant="bordered"
                    color="default"
                  >
                    Disabled
                  </Chip>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => handleDelete(member._id)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>

                  // <button onClick={() => handleDelete(member._id)}>
                  //   Delete
                  // </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    // </div>
  );
}

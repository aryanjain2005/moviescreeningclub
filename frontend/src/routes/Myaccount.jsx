import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMembershipContext } from '@/components/MembershipContext'
import { api } from '@/utils/api'
import { useLogin } from '@/components/LoginContext' // Import useLogin hook
import { SERVERIP } from '../config'

const Myaccount = () => {
  const { loggedIn } = useLogin() // Use loggedIn state from context
  const { hasMembership, updateMembershipStatus } = useMembershipContext()
  const navigate = useNavigate()
  const [currentMemberships, setCurrentMemberships] = useState([])
  const [previousMemberships, setPreviousMemberships] = useState([])
  const [allQRsUsed, setAllQRsUsed] = useState(true)

  useEffect(() => {
    const loggedInUseremail = localStorage.getItem('loggedInUserEmail')
    if (!loggedInUseremail) {
      navigate('/')
    } else {
      axios
        .get(`/memrouter/${loggedInUseremail}`)
        .then((response) => {
          // Sort memberships based on purchase date in ascending order
          const sortedMemberships = response.data.memberships.sort((a, b) => {
            return (
              new Date(a.purchasedate.split('-').reverse().join('-')) -
              new Date(b.purchasedate.split('-').reverse().join('-'))
            )
          })

          // Filter memberships into current and previous
          const currentDate = new Date()
          const current = sortedMemberships.filter(
            (membership) =>
              new Date(
                membership.validitydate.split('-').reverse().join('-')
              ) >= currentDate
          )
          const previous = sortedMemberships.filter(
            (membership) =>
              new Date(membership.validitydate.split('-').reverse().join('-')) <
              currentDate
          )
          setCurrentMemberships(current)
          setPreviousMemberships(previous)
          if (current.length > 0) {
            // Fetch the status of all QRs and update the state accordingly
            axios
              .post(`/QR/areallQRused/${loggedInUseremail}`)
              .then((response) => {
                if (
                  response.data.message === 'All valid QRs are already used'
                ) {
                  setAllQRsUsed(true)
                } else {
                  // Set allQRsUsed to false or handle the case accordingly
                  setAllQRsUsed(false)
                }
              })
              .catch((error) => {
                console.error('Error fetching QR data:', error)
              })
          }
        })
        .catch((error) => {
          console.error('Error fetching memberships:', error)
        })
    }
  }, [loggedIn, navigate])

  // Function to assign color to membership type
  const getColor = (memType) => {
    switch (memType.toLowerCase()) {
      case 'gold':
        return 'bg-gradient-to-t from-yellow-100 to-yellow-200'
      case 'silver':
        return 'bg-gradient-to-t from-gray-300 to-gray-400'
      case 'base':
        return 'bg-gradient-to-t from-orange-100 to-orange-300'
      default:
        return 'bg-gradient-to-t from-blue-200 to-blue-300'
    }
  }

  const suspendMembership = async () => {
    try {
      const loggedInUserEmail = localStorage.getItem('loggedInUserEmail')
      const res = await api.put(`/memrouter/suspend`, {
        email: loggedInUserEmail
      })
      if (res.status === 200) {
        // Reload memberships after updating
        // You can also consider updating the state directly if the backend returns the updated memberships
        window.location.reload()
      }
    } catch (error) {
      console.error('Error suspending membership:', error)
    }
  }

  // Function to convert string to title case
  const toTitleCase = (str) => {
    return str.replace(/\b\w+/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }
  if (hasMembership && currentMemberships.length === 0) {
    return (
      <div className="bg-gray-200 flex flex-col items-center min-h-screen font-monts">
        <h2 className="text-xl lg:text-2xl font-semibold mt-4 mb-4">
          Membership Verification Under Process
        </h2>
        <p>
          Your membership verification is under process at our end. Please check
          back later.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-gray-200 flex flex-col items-center min-h-screen font-monts">
        <h2 className="text-2xl lg:text-3xl font-semibold mb-4 mt-7">
          Your Memberships
        </h2>
        <div className="flex flex-col items-start w-4/5 max-sm:w-[90%] my-10 max-sm:my-4">
          <div className="flex flex-col w-full justify-start my-3 mx-5 max-sm:mx-2 ">
            <h3 className="text-xl lg:text-2xl font-semibold mb-2">
              Active Memberships
            </h3>
            <div className="flex gap-6 my-4 flex-wrap">
              {currentMemberships.map((membership, index) => (
                <Link key={index} to={`/QR`} className="object-cover">
                  <div className="flex flex-col py-3 px-3 justify-center bg-white rounded-lg">
                    <div
                      className={`rounded-md ${getColor(
                        membership.memtype
                      )} text-center w-[230px] lg:w-[250px] h-[280px] max-sm:h-[200px] mb-5`}
                      // style={getCardStyle(230, 180)}
                    >
                      {/* <p>
                        <strong className="lg:text-lg">Purchase Date -</strong>{" "}
                        {new Date(
                          membership.purchasedate.split("-").reverse().join("-")
                        ).toLocaleDateString()}
                      </p> */}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-semibold mb-2">
                      {toTitleCase(membership.memtype)}
                    </h3>
                    <p>
                      <div className="flex capitalize">
                        Validity till :{' '}
                        {new Date(
                          membership.validitydate.split('-').reverse().join('-')
                        ).toLocaleDateString()}
                      </div>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {currentMemberships.length > 0 && allQRsUsed && (
              <button
                onClick={suspendMembership}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-48 mt-8 ml-9 rounded"
              >
                Suspend Current Membership
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start w-4/5 max-sm:w-[90%] my-10 max-sm:my-4 font-monts">
          <div className="flex flex-col w-full justify-start my-3 mx-5 max-sm:mx-2 ">
            <h3 className="text-xl lg:text-2xl font-semibold mb-2">
              Previous Memberships
            </h3>
            <div className="flex gap-6 my-4 flex-wrap">
              {previousMemberships.map((membership, index) => (
                <div
                  key={index}
                  className="flex flex-col py-3 px-3 justify-center bg-white rounded-lg"
                >
                  <div
                    className={`rounded-md ${getColor(
                      membership.memtype
                    )} text-center w-[230px] lg:w-[250px] h-[280px] max-sm:h-[200px] mb-5`}
                    // style={getCardStyle(150, 180)}
                  ></div>
                  <h3 className="text-xl lg:text-2xl font-semibold mb-2">
                    {toTitleCase(membership.memtype)}
                  </h3>
                  {/* <p>
                      <strong className="lg:text-lg">Purchase Date -</strong>{" "}
                      {new Date(
                        membership.purchasedate.split("-").reverse().join("-")
                      ).toLocaleDateString()}
                    </p> */}
                  <p>
                    <div className="flex capitalize">
                      Valid till :{' '}
                      {new Date(
                        membership.validitydate.split('-').reverse().join('-')
                      ).toLocaleDateString()}
                    </div>{' '}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Myaccount

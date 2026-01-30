import * as Dialog from '@radix-ui/react-dialog'

export default function Footer() {
  const copyright = String.fromCodePoint(0x00a9)

  return (
    <div className="relative z-10 flex justify-center bg-[#FFFEF9] dark:bg-[#141414] p-4 font-monts ">
      <div className="w-4/5 max-sm:w-[90%]">
        <p className="flex items-center gap-1 border-b-2 py-4 font-bn text-3xl font-bold text-[#FB2A25] sm:text-4xl">
          CHALCHITRA
        </p>
        <div className="mb-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="my-4 flex flex-col gap-1">
            <span className="mb-2 text-lg font-semibold capitalize sm:text-2xl">
              contact us
            </span>
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <span>Chalchitra@iitmandi.ac.in</span>
            </div>
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>

              <span>+91-9318328749</span>
            </div>
          </div>
          <div className="my-4 flex flex-col gap-1">
            <span className="text-md mb-2 text-lg font-semibold capitalize sm:text-2xl">
              Legal
            </span>
            <div className="text-md capitalize sm:text-xl">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button>Privacy Policy</button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50  z-[1000]" />
                  <Dialog.Content className="DialogContent rounded-sm shadow-xl fixed top-[50%] left-[50%] w-[90vw] max-w-[800px] max-h-[85vh] p-6 bg-white dark:bg-[#141414] z-[1001] dark:text-white overflow-y-auto">
                    <Dialog.Title className="DialogTitle">
                      Our Privacy Policy
                    </Dialog.Title>
                    <div className="flex flex-col gap-6">
                      <p className=" text-lg font-bold">Rules and Regulation</p>
                      <div className="flex flex-col gap-4">
                        <p>
                          <span className="mr-2 font-semibold">
                            1. Resspanectful Behavior:
                          </span>
                          All attendees must behave respectfully towards others,
                          including fellow audience members, organizers, and
                          staff.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            2. No Outside Food or Drink:
                          </span>
                          For cleanliness and safety reasons, attendees should
                          not bring outside food or drink into the auditorium.
                          Food items purchased in lobby are also not allowed
                          inside auditorium.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            3. Arrival Time:
                          </span>
                          Attendees are encouraged to arrive 15 minutes before
                          the screening time to minimize waiting
                          times/disruptions once the movie starts.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            4. No Talking During the Movie:
                          </span>
                          Attendees are requested to refrain from talking during
                          the movie to ensure everyone can enjoy the film
                          without distractions.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            5. Silence Mobile Devices:
                          </span>
                          Attendees are asked to silence their mobile phones or
                          set them to vibrate mode to avoid disruptions.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            6. Respect the Seating Arrangement:
                          </span>
                          Attendees should sit only in designated seats and not
                          block aisles or exits. Strict action would be taken if
                          attendees are found to be sitting on seats not
                          assigned to them.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            7. No Recording or Photography:
                          </span>
                          The recording or photography of the movie screen
                          during the screening is strictly prohibited. Legal
                          action would be initiated against violators.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            8. Follow Instructions from Staff:
                          </span>
                          Attendees should comply with any instructions given by
                          event staff or volunteers.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            9. Children&lsquo;s Supervision:
                          </span>
                          Parents are requested to supervise their children to
                          ensure they do not disturb other attendees.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            10. Cleanliness:
                          </span>
                          Attendees to keep the auditorium clean by disposing of
                          trash properly and respecting the facility.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            11. Respect Intellectual Property:
                          </span>
                          Movie being screened is for personal enjoyment only
                          and not for any commercial purposes or distribution.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            12. Ticket Validity:
                          </span>
                          Once a ticket is scanned you are not allowed to exit
                          the auditorium premises, once exited ticket will not
                          be valid.
                        </p>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        className="bg-red-600 py-2 px-4 rounded-lg text-white mt-2"
                        aria-label="Close"
                      >
                        Close
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
            <div className="text-md capitalize sm:text-xl">cookie settings</div>
            <div className="text-md capitalize sm:text-xl">contracts</div>
          </div>
          <div className="my-4 flex flex-col gap-1">
            <span className="mb-2 text-lg font-semibold capitalize sm:text-2xl">
              connect with us
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                className="text-gray-500 hover:text-[#0866ff] dark:text-gray-400 dark:hover:"
              >
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a href="https://facebook.com">
                <span className="text-md capitalize hover:text-[#0866ff] sm:text-xl">
                  Facebook
                </span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                className="text-gray-500 hover:text-[#d62976] dark:text-gray-400 dark:hover:"
              >
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/chalchitra.iitmandi/">
                <span className="text-md capitalize hover:text-[#d62976] sm:text-xl">
                  instagram
                </span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com"
                className="text-gray-500 hover: dark:text-gray-400 dark:hover:"
              >
                <svg
                  className="ml-[2px] h-7 w-7"
                  viewBox="0 0 357 322"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M281.026 0.125H335.608L216.362 136.415L356.645 321.875H246.805L160.774 209.395L62.335 321.875H7.71996L135.265 176.098L0.690964 0.125H113.32L191.084 102.937L281.026 0.125ZM261.869 289.205H292.114L96.886 31.079H64.4305L261.869 289.205Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="https://twitter.com">
                <span className="text-md capitalize sm:text-xl">Twitter</span>
              </a>
            </div>
          </div>
          {/* <div className="my-4 flex flex-col gap-1">
            <span className="text-lg sm:text-xl font-semibold text-md sm:text-xl capitalize mb-2">
            meet the team
            </span>
            <div className="text-md sm:text-xl capitalize">aryan jain</div>
            <div className="text-md sm:text-xl capitalize">tarun srivastava</div>
            <div className="text-md sm:text-xl capitalize">siddharth shainesh</div>
            </div> */}
        </div>

        <div className="flex justify-between border-t-2 pt-2 max-sm:flex-col">
          <p>All rights reserved. </p>
          <p>{copyright} 2024 Chalchitra IIT Mandi</p>
        </div>
      </div>
    </div>
  )
}

import img1 from '../images/guideimg1.png'
import img2 from '../images/guideimg2.png'
import img3 from '../images/guideimg3.png'
import img4 from '../images/guideimg4.png'
import img5 from '../images/guideimg5.png'
import img6 from '../images/guideimg6.png'
import img7 from '../images/guideimg7.png'
import img8 from '../images/guideimg8.png'
import img9 from '../images/guideimg9.png'
import img10 from '../images/guideimg10.png'
import img11 from '../images/guideimg11.png'
import img12 from '../images/guideimg12.png'
import img13 from '../images/guideimg13.png'
import img14 from '../images/guideimg14.png'

export default function Guidelines() {
  return (
    <div className="font-monts flex flex-col gap-6">
      <h2 className="flex justify-center text-2xl font-bold my-4">
        How to watch a movie at IIT Mandi: A Quick Guide
      </h2>
      <span className="border-b-2">
        <p className="ml-4">
          1. Begin by visiting
          <a href="chalchitra.iitmandi.ac.in" className="text-blue-500">
            {' '}
            chalchitra.iitmandi.ac.in
          </a>
          . Once there, proceed by clicking on the &quot;Signup&quot; button,
          and use your institute email id for registration.
        </p>
        <div className="flex justify-center my-3">
          <img src={img1} alt="not found" />
        </div>
      </span>
      <span className="border-b-2">
        <p className="ml-4">
          2. Complete the registration process by entering details such as your
          name, phone number, chosen password, and the received OTP for email
          verification. Upon completion, click &quot;Submit&quot;.
        </p>
        <div className="flex justify-center my-3">
          <img src={img2} alt="not found" />
        </div>
      </span>
      <span>
        <p className="ml-4">
          3. Your account has been created, now return to the homepage and log
          in using your registered email id and password.
        </p>
      </span>
      <span className="border-b-2">
        <p className="ml-4">
          4. Once logged in, you&lsquo;ll be greeted with posters featuring the
          movies scheduled for the screening. Click on any movie poster to view
          details about its scheduled dates and showtimes.
        </p>
        <div className="flex justify-center my-3">
          <img src={img3} alt="not found" />
        </div>
      </span>
      <span className="border-b-2">
        <p className="ml-4">
          5. To gain access to the screenings, a membership purchase is
          necessary. Simply click on the “options icon” at the website&lsquo;s
          top right corner, then select &quot;Buy a new membership&quot; to
          proceed with your purchase.
        </p>
        <div className="flex justify-center my-3">
          <img src={img4} alt="not found" />
        </div>
      </span>
      <span className="border-b-2">
        <p className="ml-4">
          6. Various membership plans are available to suit your preferences,
          each offering a specific number of tickets. Select the plan that fits
          your needs, then with any upi payments app scan the required
          membership's QR code and pay the said amount in it, further you need
          to enter the transaction ID of your payment and the screenshot as a
          proof of your payment there in the form given at the bottom of the
          page and click submit. After this is done at your end we will verfiy
          your payemnt at our end and assign you the required membership or if
          there is any disperency in the payment or your membership is assigned
          to you, we will contact you on your mail ID.
        </p>
        <div className="flex flex-col items-center gap-3 my-3">
          <img src={img5} alt="not found" />
          <img src={img6} alt="not found" />
          <img src={img7} alt="not found" />
        </div>
      </span>
      <span className="border-b-2">
        <p className="ml-4">
          7. On the homepage, access the “options icon” located at the top right
          corner. From the dropdown menu, select &quot;My Profile.&quot; Here,
          you&lsquo;ll find details of your active memberships. Click on the
          purchased membership tag to view the allocated number of tickets
          available for booking within your chosen plan.
        </p>
        <div className="flex flex-col items-center gap-3 my-3">
          <img src={img8} alt="not found" />
          <img src={img9} alt="not found" />
        </div>
      </span>
      <span className="border-b-2">
        <p className="ml-4">
          8. To reserve a seat, navigate to the &quot;Book Seat&quot; option and
          click on it. Now, below the &quot;Actions&quot; tab, select the
          proceed button. This will reveal the seating arrangement within the
          Auditorium. Choose your preferred seat and confirm your selection by
          clicking the proceed button. A confirmation email containing a QR code
          will be dispatched to your registered email address.
        </p>
        <div className="flex flex-col items-center gap-3 my-3">
          <img src={img10} alt="not found" />
          <img src={img11} alt="not found" />
          <img src={img12} alt="not found" />
          <img src={img13} alt="not found" />
          <img src={img14} alt="not found" />
        </div>
      </span>
      <span>
        <p className="ml-4">
          9. The QR code included in the email will be verified at the counter
          outside the auditorium on the day of the screening. Once verified,
          you&lsquo;ll be issued a physical ticket at the counter, granting you
          access to the movie screening.
        </p>
      </span>
      <span className="mb-10">
        <p className="ml-4">
          10. Now, you&lsquo;re all set to enjoy the movie screening! Remember
          to adhere to the rules and regulations outlined in the confirmation
          email for a seamless experience.
        </p>
      </span>
    </div>
  )
}

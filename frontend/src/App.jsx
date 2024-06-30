// import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Foram2 from "./components/Foram2";
import Scanner from "./components/Scanner";
import Myaccount from "./components/Myaccount";
import Login from "./components/login";
import MovieForm from "./components/addmovie";
import ModifyMovie from "./components/modifymovie";
import Home from "./components/home";
import GetOTP from "./components/getOTP";
import Signup from "./components/Signup";
import AdddropVolunteer from "./components/adddropvolunteer";
import { LoginProvider } from './components/LoginContext';
import ForgotPassword from "./components/forgotPassword";
import UpdatePassword from "./components/updatePassowrd";
import Showtime from "./components/showtime";
import Showtimepage from "./components/AllShowTimings";
import SeatMapPage from "./components/SeatMap";
import Test from "./components/test";
import QR from "./components/displayQR";
import Footer from "./components/footer";
import MovieList from "./components/VotePage";
// import { SERVERIP } from "./config";
// import Foram from "./components/Foram";
import Guidelines from "./components/guidelines";
import ApproveMembership from "./components/ApproveMembership";
import DesignationCounts from "./components/MemberShipsSold";

function App() {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Navbar/>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/form" element={<Foram />} /> */}
          <Route path="/form2" element={<Foram2 />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/getOTP" element={<GetOTP />} />
          <Route path="/addmovie" element={<MovieForm />} />
          <Route path="/modifymovie" element={<ModifyMovie />} />
          <Route path="/myaccount" element={<Myaccount />} />
          <Route path="/adddropvolunteer" element={<AdddropVolunteer/>} />
          <Route path="/forgot" element={<ForgotPassword/>}/>
          <Route path="/update" element={<UpdatePassword/>}/>
          <Route path="/showtime" element={<Showtime/>}/>
          <Route path = "/test" element={<Test/>}/>
          <Route path="/allshowtime/:paymentId" element={<Showtimepage/>}/>
          <Route path="/seatmap/:showtimeId" element={<SeatMapPage />} />
          <Route path="/QR" element={<QR />} />
          <Route path="/VotePage" element={<MovieList />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/approveMembership" element={<ApproveMembership />} />
          <Route path="/designationCount" element={<DesignationCounts />} />
        </Routes>
        <Footer/>
      </LoginProvider>
    </BrowserRouter>
  );
}

export default App;




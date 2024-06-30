// import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

import Home from '@/routes/home'
import Foram2 from '@/routes/Foram2'
import Scanner from '@/routes/Scanner'
import Myaccount from '@/routes/Myaccount'
import MovieForm from '@/routes/addmovie'
import ModifyMovie from '@/routes/modifymovie'
import Login from '@/routes/auth/login'
import GetOTP from '@/routes/auth/getOTP'
import Signup from '@/routes/auth/Signup'
import AdddropVolunteer from '@/routes/adddropvolunteer'
import ForgotPassword from '@/routes/forgotPassword'
import UpdatePassword from '@/routes/auth/updatePassowrd'
import Showtime from '@/routes/showtime'
import Showtimepage from '@/routes/AllShowTimings'
import SeatMapPage from '@/routes/SeatMap'
import Test from '@/routes/test'
import QR from '@/routes/displayQR'
import MovieList from '@/routes/VotePage'
import Foram from '@/routes/Foram'
import Guidelines from '@/routes/guidelines'
import ApproveMembership from '@/routes/ApproveMembership'

import AuthenticatedRoute from '@/components/protectedRoute'
import { LoginProvider } from '@/components/LoginContext'

function App() {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/getOTP" element={<GetOTP />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/update" element={<UpdatePassword />} />
          {/* <Route path="/form" element={<Foram />} /> */}
          <Route
            path="/form2"
            element={
              <AuthenticatedRoute>
                <Foram2 />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/scanner"
            element={
              <AuthenticatedRoute minLevel="ticketvolunteer">
                <Scanner />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/addmovie"
            element={
              <AuthenticatedRoute minLevel="movievolunteer">
                <MovieForm />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/modifymovie"
            element={
              <AuthenticatedRoute minLevel="movievolunteer">
                <ModifyMovie />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/myaccount"
            element={
              <AuthenticatedRoute>
                <Myaccount />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/adddropvolunteer"
            element={
              <AuthenticatedRoute minLevel="admin">
                <AdddropVolunteer />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/showtime"
            element={
              <AuthenticatedRoute>
                <Showtime />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/test"
            element={
              <AuthenticatedRoute>
                <Test />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/allshowtime/:paymentId"
            element={
              <AuthenticatedRoute>
                <Showtimepage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/seatmap/:showtimeId"
            element={
              <AuthenticatedRoute>
                <SeatMapPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/QR"
            element={
              <AuthenticatedRoute>
                <QR />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/VotePage"
            element={
              <AuthenticatedRoute>
                <MovieList />
              </AuthenticatedRoute>
            }
          />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route
            path="/approveMembership"
            element={
              <AuthenticatedRoute minLevel="admin">
                <ApproveMembership />
              </AuthenticatedRoute>
            }
          />
        </Routes>
        <Footer />
      </LoginProvider>
    </BrowserRouter>
  )
}

export default App

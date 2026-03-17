import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import About from './components/About'
import Contactus from './components/Contactus'
import AdminDashboard from './pages/admin/AdminDashboard'
import ViewProviders from './pages/admin/ViewProviders'
import ManageUser from './pages/admin/ManageUser'
import SettlementHistory from './pages/admin/SettlementHistory'
import Security from './pages/admin/Security'
import AdminLayout from './pages/admin/AdminLayout'
import ProviderLayout from './pages/serviceProvider/ProviderLayout'
import ProviderDashboard from './pages/serviceProvider/ProviderDashboard'
import Bookingdetails from './pages/serviceProvider/Bookingdetails'
import AddService from './pages/serviceProvider/addService'
import Review from './pages/serviceProvider/review'
import FAQ from './pages/serviceProvider/FAQ'
import Footer from './components/Footer'
import AuditoriumCreation from './pages/serviceProvider/AuditoriumCreation'
import CateringCreation from './pages/serviceProvider/CateringCreation'
import StageDecorationCreation from './pages/serviceProvider/StageDecorationCreation'
import PhotographyCreation from './pages/serviceProvider/PhotographyCreation'
import UserLayout from './pages/user/UserLayout'
import ServicesCategory from './pages/user/ServicesCategory'
import UserBookings from './pages/user/UserBookings'
import MyProfile from './pages/user/MyProfile'
import UserFAQ from './pages/user/UserFAQ'

import MyServices from './pages/serviceProvider/MyServices'
import EditPhotography from './pages/serviceProvider/EditPhotography'
import EditAuditorium from './pages/serviceProvider/EditAuditorium'
import EditCatering from './pages/serviceProvider/EditCatering'
import EditStageDecoration from './pages/serviceProvider/EditStageDecoration'
import EventShowcasebyCategory from './components/EventShowcasebyCategory'
import EventDetailsPage from './components/EventDetailsPage'
import EventBookingPage from './components/EventBookingPage'
import Payment from './components/Payment'
import BookingSuccess from './components/BookingSuccess'
import ScrollToTop from './components/ScrollToTop'
import Analytics from './pages/admin/Analytics'
import AdminNotification from './pages/admin/AdminNotification'
import ProviderNotification from './pages/serviceProvider/ProviderNotification'
import Transactions from './pages/user/Transactions'

const App = () => {
  const { pathname } = useLocation();

  // Hide navbar + footer on admin or provider routes
  const hideLayout = pathname.includes("admin") || pathname.includes("provider") || pathname.includes("user");

  const { showUserLogin, user } = useAppContext()
  return (
    <div>
      <ScrollToTop />
      {/* Navbar */}
      {!hideLayout && <Navbar />}

      {/* Login Popup */}
      {showUserLogin && <Login />}

      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contactus />} />
          {/* <Route path="/services/:category" element={<ServicesCategory />} /> */}
          <Route path="/services/:category" element={<EventShowcasebyCategory />} />
          <Route path="/service/:category/:id" element={<EventDetailsPage />} />
          <Route path="/book/:category/:serviceId" element={<EventBookingPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/myprofile" element={<MyProfile />} />

          {/* user Route */}

          <Route path="/user-dashboard" element={<UserLayout />}>
            <Route index element={<UserBookings />} />
            <Route path="faq" element={<UserFAQ />} />
            <Route path="transactions" element={<Transactions />} />
            {/* <Route path="userbookings" element={} /> */}
            {/* <Route path="manage-user" element={<ManageUser />} />
            <Route path="settlement-history" element={<SettlementHistory />} />
            <Route path="security" element={<Security />} /> */}
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="add-provider" element={<ViewProviders />} />
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="settlement-history" element={<SettlementHistory />} />
            <Route path="security" element={<Security />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notification" element={<AdminNotification />} />
          </Route>

          {/* Provider Routes */}
          <Route path="/provider" element={<ProviderLayout />}>
            <Route index element={<ProviderDashboard />} />
            <Route path="add-service" element={<AddService />} />
            <Route path="add-service/auditorium" element={<AuditoriumCreation />} />
            <Route path="add-service/catering" element={<CateringCreation />} />
            <Route path="add-service/stage-decoration" element={<StageDecorationCreation />} />
            <Route path="add-service/photography" element={<PhotographyCreation />} />
            <Route path="booking-details" element={<Bookingdetails />} />
            <Route path="review" element={<Review />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="notification" element={<ProviderNotification/>} />
            <Route path="/provider/my-services" element={<MyServices />} />
            <Route path="/provider/edit/photography/:serviceId" element={<EditPhotography />} />
            <Route path="/provider/edit/auditorium/:serviceId" element={<EditAuditorium />} />
            <Route path="/provider/edit/catering/:serviceId" element={<EditCatering />} />
            <Route path="/provider/edit/stage-decoration/:serviceId" element={<EditStageDecoration />} />
          </Route>
        </Routes>

        {/* Footer only on non-admin & non-provider pages */}
        {user && (
          <>

          </>
        )}
        {!hideLayout && <Footer />}
      </div>
    </div>
  )
}

export default App

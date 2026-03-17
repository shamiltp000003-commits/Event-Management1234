import React, { useState, useEffect } from "react";
import BookingDetailsModal from "./BookingDetailsModal";
import Loader from "../../components/Loader";
import { IoCalendarOutline, IoTimeOutline, IoPersonOutline, IoEye, IoTrendingUp } from "react-icons/io5";
import axios from "axios";

const Bookingdetails = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        alert("Please login to see bookings");
        setLoading(false);
        return;
      }

      const response = await axios.get("https://event-management-szqn.onrender.com/api/provider-bookings", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        alert("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getTotalRevenue = () => {
    return bookings
      .reduce((sum, booking) => {
        if (booking.status === "cancelled") {
          return sum + (booking.cancellationFee || 0);
        }
        return sum + (booking.totalPrice || 0);
      }, 0);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 md:p-8 lg:p-12 bg-gray-50 min-h-full w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Details</h1>
              <p className="text-gray-600">Manage and track all your service bookings</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-800">{bookings.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <IoCalendarOutline className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹{getTotalRevenue().toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <IoTrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700">Booking ID</th>
                  <th className="p-4 font-semibold text-gray-700">Customer</th>
                  <th className="p-4 font-semibold text-gray-700">Service Type</th>
                  <th className="p-4 font-semibold text-gray-700">Event Date</th>
                  <th className="p-4 font-semibold text-gray-700">Amount</th>
                  <th className="p-4 font-semibold text-gray-700">Status</th>
                  <th className="p-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <IoCalendarOutline className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No bookings found</p>
                        <p className="text-sm">Your booking details will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-mono text-sm font-semibold text-gray-800">
                          {booking._id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {booking.customerName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {booking.customerName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <IoPersonOutline className="w-3 h-3" />
                              {booking.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {booking.serviceName}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <IoCalendarOutline className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-semibold text-gray-800">
                              {new Date(booking.eventDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <IoTimeOutline className="w-3 h-3" />
                              {new Date(`1970-01-01T${booking.eventTime}`).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className={`text-lg font-bold ${booking.status === "cancelled" ? "text-red-600" : "text-green-600"}`}>
                          ₹{booking.status === "cancelled"
                            ? (booking.cancellationFee || 0).toLocaleString()
                            : (booking.totalPrice || 0).toLocaleString()}
                        </div>
                        {booking.status === "cancelled" && (
                          <div className="text-[10px] text-gray-500 font-medium">
                            Retained Fee
                          </div>
                        )}
                        {booking.guests > 0 && booking.status !== "cancelled" && (
                          <div className="text-xs text-gray-500">
                            {booking.guests} guests
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === "cancelled"
                          ? "bg-red-100 text-red-600"
                          : booking.status === "confirmed"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                          }`}>
                          {booking.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                        >
                          <IoEye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Modal */}
        {selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Bookingdetails;

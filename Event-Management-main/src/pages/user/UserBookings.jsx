import React, { useState, useEffect } from 'react';
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoCardOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoHourglassOutline,
  IoEyeOutline,
  IoPrintOutline,
  IoStar,
  IoStarOutline
} from 'react-icons/io5';

import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

const UserBookings = () => {
  const { user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingToRate, setBookingToRate] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/getAllBookings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setBookings(response.data.data);
          setFilteredBookings(response.data.data);
        } else {
          setError('Failed to load bookings');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.message || 'Something went wrong while fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  useEffect(() => {
    // Filter bookings based on selected filter
    if (selectedFilter === 'all') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => {
        const status = getBookingStatus(booking);
        return status === selectedFilter;
      });
      setFilteredBookings(filtered);
    }
  }, [selectedFilter, bookings]);

  const getBookingStatus = (booking) => {
    // If booking is cancelled, return cancelled status
    if (booking.status === 'cancelled') {
      return 'cancelled';
    }

    const eventDate = new Date(booking.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return 'completed';
    } else if (eventDate.getTime() === today.getTime()) {
      return 'today';
    } else {
      return 'upcoming';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <IoCheckmarkCircleOutline className="w-5 h-5 text-green-600" />;
      case 'today':
        return <IoHourglassOutline className="w-5 h-5 text-blue-600" />;
      case 'upcoming':
        return <IoCheckmarkCircleOutline className="w-5 h-5 text-blue-600" />;
      case 'cancelled':
        return <IoCloseCircleOutline className="w-5 h-5 text-red-600" />;
      default:
        return <IoHourglassOutline className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'today':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryInfo = (category) => {
    switch (category) {
      case 'auditorium':
        return { name: 'Auditorium', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' };
      case 'catering':
        return { name: 'Catering', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' };
      case 'photography':
        return { name: 'Photography', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' };
      case 'stage-decoration':
        return { name: 'Stage Decoration', color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50' };
      default:
        return { name: category.replace('-', ' '), color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  const handleCancelBookingClick = (booking) => {
    setBookingToCancel(booking);
    setCancelReason('');
    setCustomReason('');
    setShowCancelModal(true);
  };

  const calculateRefund = (eventDate, totalPrice) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);

    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let refundPercent = 0;
    if (diffDays >= 7) {
      refundPercent = 100;
    } else if (diffDays >= 3) {
      refundPercent = 50;
    } else {
      refundPercent = 0;
    }

    const refundAmount = (totalPrice * refundPercent) / 100;
    const cancellationFee = totalPrice - refundAmount;

    return { refundPercent, refundAmount, cancellationFee };
  };

  const handleConfirmCancellation = async () => {
    if (!cancelReason) {
      alert('Please select a reason for cancellation.');
      return;
    }

    const finalReason = cancelReason === 'other' ? customReason : cancelReason;

    if (cancelReason === 'other' && !finalReason.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    const { refundAmount, cancellationFee } = calculateRefund(bookingToCancel.eventDate, bookingToCancel.totalPrice);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/cancel/${bookingToCancel._id}`,
        {
          status: 'cancelled',
          refundAmount,
          cancellationFee,
          cancellationReason: finalReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success || response.status === 200) {
        const updatedBookings = bookings.map(booking => {
          if (booking._id === bookingToCancel._id) {
            return {
              ...booking,
              status: 'cancelled',
              cancellationReason: finalReason,
              refundAmount,
              cancellationFee,
              cancelledAt: new Date().toISOString()
            };
          }
          return booking;
        });

        setBookings(updatedBookings);
        setShowCancelModal(false);
        setBookingToCancel(null);
        setCancelReason('');
        setCustomReason('');

        alert(`Booking cancelled successfully.\nRefund Amount: ₹${refundAmount.toLocaleString()}\nCancellation Fee: ₹${cancellationFee.toLocaleString()}`);
      } else {
        alert('Failed to cancel booking. Please try again.');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err.response?.data?.message || 'Error occurred while cancelling. Please try again.');
    }
  };


  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleRateServiceClick = (booking) => {
    setBookingToRate(booking);
    setRating(5);
    setComment('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');
      const response = await axios.post('/reviews', {
        bookingId: bookingToRate._id,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Review submitted successfully!');
        setShowReviewModal(false);
        // Mark as reviewed in local state if needed (not strictly required if we just show the button based on status)
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'TBD';
    return timeString;
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 bg-gray-50 min-h-full w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your event bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-3">
          {['all', 'upcoming', 'today', 'completed', 'cancelled'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${selectedFilter === filter
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Messaging */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your bookings...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center mb-8">
            <IoCloseCircleOutline className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Bookings</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <IoCardOutline className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">
              {selectedFilter === 'all'
                ? "You haven't made any bookings yet. Start booking services for your events!"
                : selectedFilter === 'cancelled'
                  ? "No cancelled bookings found."
                  : `No ${selectedFilter} bookings found.`}
            </p>
          </div>
        ) : !loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => {
              const status = getBookingStatus(booking);
              const categoryInfo = getCategoryInfo(booking.category);

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Status Badge */}
                  <div className={`px-4 py-2 border-b flex items-center justify-between ${getStatusColor(status)}`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="font-semibold capitalize">{status}</span>
                    </div>
                    <span className="text-xs font-mono">#{booking._id?.slice(-6) || 'N/A'}</span>
                  </div>

                  {/* Booking Content */}
                  <div className="p-6">
                    {/* Service Name */}
                    <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${categoryInfo.color} text-white`}>
                      <h3 className="font-bold text-lg">{booking.serviceName || `Booking for ${categoryInfo.name}`}</h3>
                      <p className="text-sm opacity-90 capitalize">{categoryInfo.name}</p>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <IoCalendarOutline className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(booking.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <IoTimeOutline className="w-4 h-4 text-gray-500" />
                        <span>{formatTime(booking.eventTime)}</span>
                      </div>
                      {booking.guests > 0 && booking.category !== 'auditorium' && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <IoPersonOutline className="w-4 h-4 text-gray-500" />
                          <span>{booking.guests} guests</span>
                        </div>
                      )}
                      {booking.category === 'auditorium' && booking.auditoriumPricing === 'hourly' && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <IoTimeOutline className="w-4 h-4 text-gray-500" />
                          <span>{booking.hours} hours</span>
                        </div>
                      )}
                    </div>

                    {/* Package Info */}
                    {booking.selectedPackage && (
                      <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Package</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {booking.selectedPackage.packageName ||
                            booking.selectedPackage.name ||
                            booking.selectedPackage.title}
                        </p>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{booking.totalPrice?.toLocaleString() || '0'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium"
                      >
                        <IoEyeOutline className="w-4 h-4" />
                        View Details
                      </button>
                      {status === 'completed' && (
                        <button
                          onClick={() => handleRateServiceClick(booking)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm font-medium"
                        >
                          <IoStar className="w-4 h-4" />
                          Rate Service
                        </button>
                      )}
                      {(status === 'upcoming' || status === 'today') && (
                        <button
                          onClick={() => handleCancelBookingClick(booking)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
                          title="Cancel this booking with refund policy"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoCloseCircleOutline className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Service Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Name:</span>
                      <span className="font-semibold">{selectedBooking.serviceName || selectedBooking.category.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold capitalize">{selectedBooking.category.replace('-', ' ')}</span>
                    </div>
                    {selectedBooking.selectedPackage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package:</span>
                        <span className="font-semibold">
                          {selectedBooking.selectedPackage.packageName ||
                            selectedBooking.selectedPackage.name ||
                            selectedBooking.selectedPackage.title}
                        </span>
                      </div>
                    )}
                    {selectedBooking.auditoriumPricing && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pricing Type:</span>
                        <span className="font-semibold capitalize">{selectedBooking.auditoriumPricing}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Event Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event Date:</span>
                      <span className="font-semibold">{formatDate(selectedBooking.eventDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event Time:</span>
                      <span className="font-semibold">{formatTime(selectedBooking.eventTime)}</span>
                    </div>
                    {selectedBooking.guests > 0 && selectedBooking.category !== 'auditorium' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Guests:</span>
                        <span className="font-semibold">{selectedBooking.guests}</span>
                      </div>
                    )}
                    {selectedBooking.category === 'auditorium' && selectedBooking.auditoriumPricing === 'hourly' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold">{selectedBooking.hours} hours</span>
                      </div>
                    )}
                    {selectedBooking.specialRequests && (
                      <div>
                        <span className="text-gray-600">Special Requests:</span>
                        <p className="font-semibold mt-1">{selectedBooking.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold">{selectedBooking.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold">{selectedBooking.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold">{selectedBooking.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Information</h3>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Total Amount Paid:</span>
                      <span className="text-2xl font-bold">₹{selectedBooking.totalPrice?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="mt-2 text-sm opacity-90">
                      Booking ID: {selectedBooking._id || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  <IoPrintOutline className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Modal */}
        {showCancelModal && bookingToCancel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Cancel Booking</h2>
                <p className="text-gray-600 mt-1">
                  Booking ID: {bookingToCancel._id}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Cancellation Policy */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ Cancellation Policy</h3>
                  <div className="text-sm text-red-700 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span><strong>7+ days before event:</strong> Full refund (100%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span><strong>3-7 days before event:</strong> 50% refund</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span><strong>Less than 3 days:</strong> No refund</span>
                    </div>
                  </div>
                  <p className="text-xs text-red-600 mt-3 italic">
                    * Refunds will be processed within 5-7 business days after cancellation approval.
                  </p>
                </div>

                {/* Booking Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Booking Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Service:</span>
                      <p className="font-semibold">{bookingToCancel.serviceName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Event Date:</span>
                      <p className="font-semibold">{formatDate(bookingToCancel.eventDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount Paid:</span>
                      <p className="font-semibold text-green-600">₹{bookingToCancel.totalPrice?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Event Time:</span>
                      <p className="font-semibold">{formatTime(bookingToCancel.eventTime)}</p>
                    </div>
                  </div>

                  {/* Estimated Refund Calculation */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Estimated Refund ({calculateRefund(bookingToCancel.eventDate, bookingToCancel.totalPrice).refundPercent}%):</span>
                      <span className="font-bold text-green-600">₹{calculateRefund(bookingToCancel.eventDate, bookingToCancel.totalPrice).refundAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cancellation Fee:</span>
                      <span className="font-bold text-red-600">₹{calculateRefund(bookingToCancel.eventDate, bookingToCancel.totalPrice).cancellationFee.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Cancellation Reason */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Reason for Cancellation *</h4>

                  {/* Radio Button Options */}
                  <div className="space-y-3 mb-4">
                    {[
                      { value: 'change_of_plans', label: 'Change of plans' },
                      { value: 'emergency', label: 'Emergency situation' },
                      { value: 'better_alternative', label: 'Found better alternative' },
                      { value: 'weather_concerns', label: 'Weather concerns' },
                      { value: 'health_issues', label: 'Health issues' },
                      { value: 'financial_issues', label: 'Financial constraints' },
                      { value: 'travel_issues', label: 'Travel/Transportation issues' },
                      { value: 'other', label: 'Other (please specify)' }
                    ].map((reason) => (
                      <label key={reason.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="cancelReason"
                          value={reason.value}
                          checked={cancelReason === reason.value}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-gray-700">{reason.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Custom Reason Text Area */}
                  {cancelReason === 'other' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Please specify your reason:
                      </label>
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Please provide details about why you're cancelling this booking..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                        rows={3}
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {customReason.length}/500 characters
                      </p>
                    </div>
                  )}
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 text-lg">⚠️</span>
                    <div>
                      <h5 className="font-semibold text-yellow-800 mb-1">Important Notice</h5>
                      <p className="text-sm text-yellow-700">
                        Once cancelled, this booking cannot be restored. You may need to create a new booking if you change your mind.
                        Service providers will be notified of this cancellation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setBookingToCancel(null);
                    setCancelReason('');
                    setCustomReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleConfirmCancellation}
                  disabled={!cancelReason || (cancelReason === 'other' && !customReason.trim())}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Review Modal */}
        {showReviewModal && bookingToRate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Rate Service</h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoCloseCircleOutline className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">How was your experience with <span className="font-semibold">{bookingToRate.serviceName}</span>?</p>

                  {/* Star Rating */}
                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setRating(s)}
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        {s <= rating ? (
                          <IoStar className="w-10 h-10 text-amber-400" />
                        ) : (
                          <IoStarOutline className="w-10 h-10 text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience (e.g., service quality, staff behavior, etc.)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={!comment.trim() || submittingReview}
                  className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;

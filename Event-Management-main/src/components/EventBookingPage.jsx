import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
// removed legacy dummy data imports
import {
  IoLocationOutline,
  IoPeopleOutline,
  IoSnowOutline,
  IoTimeOutline,
  IoCallOutline,
  IoMailOutline,
  IoRestaurantOutline,
  IoCameraOutline,
  IoFlowerOutline,
  IoStarOutline,
  IoChevronBack,
  IoCalendarOutline,
  IoPersonOutline,
  IoCheckmarkCircleOutline,
  IoAdd,
  IoRemove,
  IoTime,
  IoBriefcaseOutline,
  IoShieldCheckmarkOutline,
  IoLockClosedOutline
} from "react-icons/io5";
import { IndianRupee } from "lucide-react";

const EventBookingPage = () => {
  const { category, serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAppContext();
  const [service, setService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [auditoriumPricing, setAuditoriumPricing] = useState(""); // 'daily' or 'hourly'
  const [bookingData, setBookingData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    eventDate: "",
    eventTime: "",
    guests: 50,
    hours: 4,
    specialRequests: "",
  });

  // Pre-fill user data when it becomes available
  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const [totalPrice, setTotalPrice] = useState(0);
  const [isDateAvailable, setIsDateAvailable] = useState(true);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  console.log(category, serviceId, "booking params");
  const { pricingType } = location.state || {};
  console.log(selectedPackage, "sle");


  // if (pricingType) {
  //   setAuditoriumPricing(pricingType);
  // }

  console.log(pricingType, "ppp", auditoriumPricing, "auid");

  // Combine all services - legacy dummy data removed

  useEffect(() => {
    if (pricingType) {
      setAuditoriumPricing(pricingType);
    }
    const fetchService = async () => {
      const id = serviceId; // Assuming serviceId is the unique identifier for all services
      try {
        const token = localStorage.getItem("token");
        let url = "";

        if (category === "auditorium") {
          url = `/fetchAuditoriumById/${id}`;
        } else if (category === "catering") {
          url = `/fetchCateringById/${id}`;
        } else if (category === "photography") {
          url = `/fetchPhotographyById/${id}`;
        } else if (category === "stage-decoration") {
          url = `/fetchDecerationById/${id}`;
        } else {
          console.log("Invalid category");
          return;
        }

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res, "resss");

        setService(res.data?.data);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    if (serviceId && category) {
      fetchService();
    }
  }, [category, serviceId]);

  // Check date availability
  useEffect(() => {
    const checkDateAvailability = async () => {
      if (!bookingData.eventDate || !serviceId) return;

      setCheckingAvailability(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/checkAvailability/${serviceId}/${bookingData.eventDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsDateAvailable(res.data.available);
        setAvailabilityMessage(res.data.message);
      } catch (error) {
        console.error("Error checking availability:", error);
        // Default to available if check fails, or handle error
        setIsDateAvailable(true);
        setAvailabilityMessage("");
      } finally {
        setCheckingAvailability(false);
      }
    };

    const timeoutId = setTimeout(() => {
      checkDateAvailability();
    }, 500); // Debounce if needed, though date picker usually triggers once

    return () => clearTimeout(timeoutId);
  }, [bookingData.eventDate, serviceId]);

  console.log(service, "ser");


  // Calculate total price based on selected package and inputs
  useEffect(() => {
    let price = 0;

    if (category === "catering" && selectedPackage) {
      // Per person pricing
      price = selectedPackage.pricePerPerson * bookingData.guests;
    } else if (category === "photography" && selectedPackage) {
      // Per hour pricing
      price = selectedPackage.pricePerHour * bookingData.hours;
    } else if (category === "stage-decoration" && selectedPackage) {
      // Per day pricing (fixed)
      price = selectedPackage.pricePerDay || 0;
    } else if (category === "auditorium" && service) {
      // For auditorium, use selected pricing type
      if (auditoriumPricing === "daily") {
        price = service.price;
      } else if (auditoriumPricing === "hourly") {
        price = service.pricePerHour * bookingData.hours;
      }
    }

    setTotalPrice(price);
  }, [
    selectedPackage,
    bookingData.guests,
    bookingData.hours,
    category,
    service,
    auditoriumPricing,
  ]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Prepare booking details to pass to payment page
    const bookingDetails = {
      serviceId,
      providerId: service.providerId,
      serviceName: service.auditoriumName || service.companyName || service.studioName,
      selectedPackage,
      bookingData,
      totalPrice,
      category,
      auditoriumPricing: category === "auditorium" ? auditoriumPricing : null,
    };

    console.log("Proceeding to payment:", bookingDetails);
    // Navigate to payment page with booking details
    navigate("/payment", { state: { bookingDetails } });
  };

  const getCategoryInfo = (category) => {
    switch (category) {
      case "auditorium":
        return {
          name: "Auditorium",
          icon: IoPeopleOutline,
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
        };
      case "catering":
        return {
          name: "Catering",
          icon: IoRestaurantOutline,
          color: "from-green-500 to-green-600",
          bgColor: "bg-green-50",
        };
      case "photography":
        return {
          name: "Photography",
          icon: IoCameraOutline,
          color: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50",
        };
      case "stage-decoration":
        return {
          name: "Stage Decoration",
          icon: IoFlowerOutline,
          color: "from-pink-500 to-pink-600",
          bgColor: "bg-pink-50",
        };
      default:
        return {
          name: category.replace("-", " "),
          icon: IoStarOutline,
          color: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-50",
        };
    }
  };

  const categoryInfo = getCategoryInfo(category);
  const CategoryIcon = categoryInfo.icon;


  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 sm:pt-20 p-4 sm:p-6">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/70 shadow-lg border border-white/20 w-fit rounded-2xl sticky top-20 sm:top-24 z-20 mx-auto lg:mx-0">
        <div className="px-4 sm:px-6 py-2 sm:py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 text-sm sm:text-base"
          >
            <IoChevronBack className="w-4 h-4 sm:w-5 h-5" />
            Back to Service
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Service Info & Packages */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <div className="backdrop-blur-xl bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl border border-white/40 p-5 sm:p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:rotate-12 transition-transform duration-700 hidden sm:block">
                <CategoryIcon className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 mb-6">
                  <div
                    className={`p-3 sm:p-4 bg-gradient-to-br ${categoryInfo.color} text-white rounded-xl sm:rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <CategoryIcon className="w-8 h-8 sm:w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      {service.auditoriumName ||
                        service.companyName ||
                        service.studioName}
                    </h1>
                    <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2 mt-1 font-medium italic text-sm sm:text-base">
                      <IoLocationOutline className="w-4 h-4 text-blue-500" />
                      {service.location}
                    </p>
                  </div>
                </div>

                {service.description && (
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg italic border-l-4 border-blue-500/30 pl-4 py-1">
                    "{service.description}"
                  </p>
                )}
              </div>
            </div>

            {/* Auditorium Pricing Type Selection */}
            {category === "auditorium" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Select Pricing Type
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => setAuditoriumPricing("daily")}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 ${auditoriumPricing === "daily"
                      ? "border-green-500 bg-green-50 text-green-700 shadow-md scale-[1.02]"
                      : "border-gray-100 hover:border-gray-200 text-gray-600"
                      }`}
                  >
                    <div className="text-center">
                      <h3 className="font-bold text-lg">Daily</h3>
                      <p className="text-xs opacity-75">Full day booking</p>
                      <p className="text-xl sm:text-2xl font-black mt-2">
                        ₹{service.price?.toLocaleString()}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setAuditoriumPricing("hourly")}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 ${auditoriumPricing === "hourly"
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-[1.02]"
                      : "border-gray-100 hover:border-gray-200 text-gray-600"
                      }`}
                  >
                    <div className="text-center">
                      <h3 className="font-bold text-lg">Hourly</h3>
                      <p className="text-xs opacity-75">Flexible hours</p>
                      <p className="text-xl sm:text-2xl font-black mt-2">
                        ₹{service.pricePerHour}
                      </p>
                      <p className="text-[10px] font-bold uppercase opacity-75">per hour</p>
                    </div>
                  </button>
                </div>

                {auditoriumPricing === "hourly" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Hours
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={bookingData.hours}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          hours: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Minimum 1 hour. Overtime charges: ₹{service.overtimePrice}
                      /hour
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Package Selection */}
            {(category === "catering" ||
              category === "photography" ||
              category === "stage-decoration") &&
              (service.packages || service.decorations) && (
                <div className="backdrop-blur-xl bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl border border-white/40 p-5 sm:p-8">
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <IoBriefcaseOutline className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                      Explore Tiers
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {(service.packages || service.decorations).map((pkg) => (
                      <div
                        key={pkg._id}
                        onClick={() => handlePackageSelect(pkg)}
                        className={`group cursor-pointer transition-all duration-500 relative ${selectedPackage?._id === pkg._id
                          ? "scale-[1.02]"
                          : "hover:scale-[1.01]"
                          }`}
                      >
                        <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${selectedPackage?._id === pkg._id
                          ? "bg-gradient-to-br from-blue-50 to-white border-blue-500 shadow-blue-100 shadow-lg"
                          : "bg-white/50 border-gray-100 hover:border-blue-200 hover:shadow-xl"
                          }`}>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1 w-full">
                              <div className="flex items-center justify-between sm:justify-start gap-3 mb-2">
                                <h3 className="font-black text-lg sm:text-xl text-gray-900">
                                  {pkg.packageName || pkg.name || pkg.title}
                                </h3>
                                {selectedPackage?._id === pkg._id && (
                                  <span className="flex items-center gap-1 text-[8px] sm:text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse text-center">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xl">
                                {pkg.description}
                              </p>

                              {/* Package tags */}
                              <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                                {category === "catering" && (
                                  <span
                                    className={`px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold uppercase tracking-wider ${pkg.foodType === "veg"
                                      ? "bg-green-100/50 text-green-700 border border-green-200"
                                      : pkg.foodType === "non-veg"
                                        ? "bg-red-100/50 text-red-700 border border-red-200"
                                        : "bg-blue-100/50 text-blue-700 border border-blue-200"
                                      }`}
                                  >
                                    {pkg.foodType === "both"
                                      ? "Hybrid (Veg + Non)"
                                      : pkg.foodType || "Standard"}
                                  </span>
                                )}
                                {category === "stage-decoration" && (
                                  <span
                                    className={`px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold uppercase tracking-wider ${pkg.category === "Luxury"
                                      ? "bg-amber-100/50 text-amber-700 border border-amber-200"
                                      : pkg.category === "Premium"
                                        ? "bg-indigo-100/50 text-indigo-700 border border-indigo-200"
                                        : "bg-gray-100/50 text-gray-700 border border-gray-200"
                                      }`}
                                  >
                                    {pkg.category} Experience
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                              {category === "catering" && (
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-3 bg-gray-50/50 rounded-xl group-hover:bg-blue-50/50 transition-colors">
                                  <p className="text-xl sm:text-2xl font-black text-blue-600 tracking-tighter">
                                    ₹{pkg.pricePerPerson}
                                  </p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                                    / Plate
                                  </p>
                                </div>
                              )}
                              {category === "photography" && (
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-3 bg-gray-50/50 rounded-xl group-hover:bg-purple-50/50 transition-colors text-center sm:min-w-[100px]">
                                  <p className="text-xl sm:text-2xl font-black text-purple-600 tracking-tighter">
                                    ₹{pkg.pricePerHour}
                                  </p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                                    / Hour
                                  </p>
                                </div>
                              )}
                              {category === "stage-decoration" && (
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-3 bg-gray-50/50 rounded-xl group-hover:bg-pink-50/50 transition-colors">
                                  <p className="text-xl sm:text-2xl font-black text-pink-600 tracking-tighter">
                                    ₹{pkg.pricePerDay?.toLocaleString()}
                                  </p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                                    / Event
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Quantity Selection */}
            {(category === "catering" || category === "photography") &&
              selectedPackage && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {category === "catering" ? "Number of Guests" : "Duration"}
                  </h2>

                  {category === "catering" && (
                    <div className="max-w-md mx-auto">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <IoPeopleOutline className="w-5 h-5 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input
                          type="number"
                          id="guestInput"
                          min="1"
                          value={bookingData.guests || ""}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setBookingData({
                              ...bookingData,
                              guests: isNaN(val) ? 0 : Math.max(0, val),
                            });
                          }}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-xl font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                          placeholder="Enter number of guests"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <span className="text-gray-400 font-medium">guests</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Tip: You can type the exact number of guests directly
                      </p>
                    </div>
                  )}

                  {category === "photography" && (
                    <div className="max-w-md mx-auto">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <IoTime className="w-5 h-5 text-purple-500 group-focus-within:text-purple-600 transition-colors" />
                        </div>
                        <input
                          type="number"
                          id="durationInput"
                          min="1"
                          value={bookingData.hours || ""}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setBookingData({
                              ...bookingData,
                              hours: isNaN(val) ? 0 : Math.max(0, val),
                            });
                          }}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-xl font-bold focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                          placeholder="Enter duration"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <span className="text-gray-400 font-medium">hours</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Tip: Enter the total estimated duration in hours
                      </p>
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Right Column - Booking Form & Summary */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="backdrop-blur-xl bg-white/90 rounded-2xl sm:rounded-3xl shadow-xl border border-white/40 p-5 sm:p-8 lg:sticky top-24 hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <IoCheckmarkCircleOutline className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Fare Breakdown
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center group">
                  <span className="text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Service Identity</span>
                  <span className="font-bold text-gray-900">
                    {service.auditoriumName ||
                      service.companyName ||
                      service.studioName}
                  </span>
                </div>

                {selectedPackage && (
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Selected Tier</span>
                    <span className="font-bold text-blue-600 underline decoration-blue-200 underline-offset-4">
                      {selectedPackage.packageName ||
                        selectedPackage.name ||
                        selectedPackage.title}
                    </span>
                  </div>
                )}

                {category === "catering" && (
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Headcount</span>
                    <span className="font-extrabold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                      {bookingData.guests} <span className="text-[10px] text-gray-400 font-normal">PERSONS</span>
                    </span>
                  </div>
                )}

                {category === "photography" && (
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Session Duration</span>
                    <span className="font-extrabold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                      {bookingData.hours} <span className="text-[10px] text-gray-400 font-normal">HOURS</span>
                    </span>
                  </div>
                )}

                {category === "auditorium" && (
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Billing Model</span>
                    <span className="font-extrabold text-gray-900 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg capitalize">
                      {auditoriumPricing} Basis
                    </span>
                  </div>
                )}

                {category === "auditorium" &&
                  auditoriumPricing === "hourly" && (
                    <div className="flex justify-between items-center group">
                      <span className="text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Reserved Time</span>
                      <span className="font-extrabold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                        {bookingData.hours} <span className="text-[10px] text-gray-400 font-normal">HOURS</span>
                      </span>
                    </div>
                  )}

                <div className="relative pt-4">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Payable</p>
                      <span className="text-3xl font-black text-emerald-600 tracking-tighter">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">INC. TAXES</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                <div className="flex gap-2 text-blue-700">
                  <IoCheckmarkCircleOutline className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-relaxed">
                    By proceeding, you agree to our <span className="font-bold underline cursor-pointer">Cancellation & Refund Policy</span> based on the proximity to the event date.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="backdrop-blur-xl bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl border border-white/40 p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <IoPersonOutline className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Personal Details
                </h2>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid gap-6">
                  <div className="relative group">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Full Identity
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <IoPersonOutline className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={bookingData.name}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, name: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Electronic Mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <IoMailOutline className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={bookingData.email}
                        readOnly={!!user?.email}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, email: e.target.value })
                        }
                        className={`w-full pl-12 pr-4 py-4 ${user?.email ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'} border-2 border-gray-100 rounded-2xl text-sm font-semibold transition-all outline-none`}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Contact Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <IoCallOutline className="w-5 h-5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={bookingData.phone}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, phone: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div className="relative group">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Event Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={bookingData.eventDate}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            eventDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      />
                    </div>
                    {bookingData.eventDate && (
                      <div className="mt-2 text-center">
                        {checkingAvailability ? (
                          <span className="text-[10px] font-bold text-blue-500 animate-pulse flex items-center justify-center gap-1 uppercase tracking-tighter">
                            Checking Slots...
                          </span>
                        ) : !isDateAvailable ? (
                          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 flex items-center justify-center gap-1 uppercase tracking-tighter">
                            Already Reserved
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center justify-center gap-1 uppercase tracking-tighter">
                            Date Available
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Event Time
                    </label>
                    <input
                      type="time"
                      value={bookingData.eventTime}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          eventTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Special Inquiries
                  </label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        specialRequests: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                    placeholder="Describe your vision or mention any dietary restrictions..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={
                      (category === "auditorium" ? false : !selectedPackage) || !isDateAvailable || checkingAvailability || isAdmin || user?.role === "provider"
                    }
                    className={`w-full py-4 sm:py-5 px-6 sm:px-8 bg-gradient-to-r ${isAdmin || user?.role === "provider" ? "from-gray-400 to-gray-500" : categoryInfo.color} text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-blue-200 hover:shadow-2xl transition-all duration-300 transform ${!(isAdmin || user?.role === "provider") && "hover:scale-[1.02] active:scale-95"} flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {checkingAvailability ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/20 border-t-white"></div>
                        Validating...
                      </>
                    ) : !isDateAvailable ? (
                      "Slot Occupied"
                    ) : isAdmin || user?.role === "provider" ? (
                      "Restricted Access"
                    ) : (
                      <>
                        <IoShieldCheckmarkOutline className="w-5 h-5 sm:w-6 sm:h-6" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                  <p className="text-[8px] sm:text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <IoLockClosedOutline className="w-3 h-3 text-emerald-500" />
                    Secure SSL Encrypted
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBookingPage;

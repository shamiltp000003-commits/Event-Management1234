import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/Loader";
import {
  IoLocationOutline,
  IoCalendarOutline,
  IoPricetagOutline,
  IoEye,
  IoTrash,
  IoAdd,
  IoBusiness,
  IoRestaurant,
  IoCamera,
  IoFlower
} from "react-icons/io5";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = "https://event-management-szqn.onrender.com";

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'auditorium':
        return <IoBusiness className="w-6 h-6" />;
      case 'catering':
        return <IoRestaurant className="w-6 h-6" />;
      case 'photography':
        return <IoCamera className="w-6 h-6" />;
      case 'stage-decoration':
        return <IoFlower className="w-6 h-6" />;
      default:
        return <IoBusiness className="w-6 h-6" />;
    }
  };

  const getServiceColor = (serviceType) => {
    switch (serviceType) {
      case 'auditorium':
        return 'from-blue-500 to-blue-600';
      case 'catering':
        return 'from-green-500 to-green-600';
      case 'photography':
        return 'from-purple-500 to-purple-600';
      case 'stage-decoration':
        return 'from-pink-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getServiceBadgeColor = (serviceType) => {
    switch (serviceType) {
      case 'auditorium':
        return 'bg-blue-100 text-blue-800';
      case 'catering':
        return 'bg-green-100 text-green-800';
      case 'photography':
        return 'bg-purple-100 text-purple-800';
      case 'stage-decoration':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (service) => {
    const category = service.serviceType; // Use serviceType as category
    const id = service._id;

    // Map category to route
    const routeMap = {
      'auditorium': 'auditorium',
      'catering': 'catering',
      'photography': 'photography',
      'stage-decoration': 'stage-decoration'
    };

    const target = routeMap[category];
    if (target) {
      navigate(`/provider/edit/${target}/${id}`);
    } else {
      alert("Unknown service category for editing");
    }
  };

  const handleDelete = async (id, serviceType, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let endpoint = "";

      switch (serviceType) {
        case 'auditorium':
          endpoint = `/delete-auditorium/${id}`;
          break;
        case 'catering':
          endpoint = `/delete-catering/${id}`;
          break;
        case 'photography':
          endpoint = `/delete-photography/${id}`;
          break;
        case 'stage-decoration':
          endpoint = `/delete-deceration/${id}`;
          break;
        default:
          return;
      }

      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setServices(prev => prev.filter(s => s._id !== id));
        alert("Service deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service.");
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get("/provider-services", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response);


        if (response.data.success) {
          setServices(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [navigate]);
  console.log(services, "serv");

  if (loading) return <Loader />;

  return (
    <div className="p-6 md:p-8 lg:p-12 bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">My Services</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your service listings and packages</p>
            </div>
            <button
              onClick={() => navigate('/provider/addService')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 sm:self-center"
            >
              <IoAdd className="w-5 h-5" />
              Add New Service
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Services</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{services.length}</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-50 rounded-xl self-start sm:self-center">
                  <IoBusiness className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Auditoriums</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    {services.filter(s => s.serviceType === 'auditorium').length}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-green-50 rounded-xl self-start sm:self-center">
                  <IoBusiness className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Catering</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    {services.filter(s => s.serviceType === 'catering').length}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-purple-50 rounded-xl self-start sm:self-center">
                  <IoRestaurant className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Photography</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    {services.filter(s => s.serviceType === 'photography').length}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-pink-50 rounded-xl self-start sm:self-center">
                  <IoCamera className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Decoration</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    {services.filter(s => s.serviceType === 'stage-decoration').length}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-amber-50 rounded-xl self-start sm:self-center">
                  <IoFlower className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoBusiness className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Services Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start building your business by adding your first service. Create auditoriums, catering services, photography packages, or decoration services.
            </p>
            <button
              onClick={() => navigate('/provider/add-service')}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Add Your First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => {
              const serviceName = service.auditoriumName || service.companyName || service.studioName;
              return (
                <div
                  key={service._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  {/* Service Image/Header */}
                  <div className="relative h-48 overflow-hidden">
                    {service.images && service.images.length > 0 ? (
                      <img
                        src={`${backendUrl}/${service.images[0].replace(/\\/g, '/').replace('public/', '')}`}
                        alt={serviceName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-r ${getServiceColor(service.serviceType)} flex items-center justify-center text-white`}>
                        {getServiceIcon(service.serviceType)}
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getServiceBadgeColor(service.serviceType)} shadow-sm`}>
                        {service.serviceType.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1 text-gray-800 truncate">
                      {serviceName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <IoLocationOutline className="w-4 h-4" />
                      <span className="truncate">{service.location}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                      {service.description}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">Starting from</p>

                      {(() => {
                        const price =
                          service.pricePerDay ||
                          service.pricePerHour ||
                          service.price ||
                          service.packages?.[0]?.pricePerHour ||
                          service.packages?.[0]?.pricePerPerson ||
                          service.decorations?.[0]?.pricePerDay;

                        const unit =
                          service.pricePerDay
                            ? "/day"
                            : service.pricePerHour
                              ? "/hour"
                              : service.packages?.[0]?.pricePerHour
                                ? "/hour"
                                : service.packages?.[0]?.pricePerPerson
                                  ? "/person"
                                  : service.decorations?.[0]?.pricePerDay
                                    ? "/day"
                                    : "";

                        return (
                          <p className="text-lg font-bold text-green-600">
                            {price ? `₹${price}${unit}` : "Contact"}
                          </p>
                        );
                      })()}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(service)}
                        className="flex-1 bg-cyan-600 text-white py-2.5 rounded-xl font-medium hover:bg-cyan-700 transition-colors"
                      >
                        View / Edit
                      </button>

                      <button
                        onClick={() => handleDelete(service._id, service.serviceType, serviceName)}
                        className="px-3 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                        title="Delete this service"
                      >
                        <IoTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;

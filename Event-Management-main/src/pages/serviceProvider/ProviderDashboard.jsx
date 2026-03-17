import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  IoCalendarOutline,
  IoTrendingUp,
  IoListOutline,
  IoArrowForwardOutline,
  IoPersonOutline,
  IoTimeOutline
} from 'react-icons/io5';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalServices: 0,
    latestBookings: [],
    chartData: []
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get("https://event-management-szqn.onrender.com/api/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className='flex-1 p-6 md:p-10 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* Welcome Header */}
        <div className='mb-8'>
          <h1 className='text-xl md:text-3xl font-bold text-gray-800'>Dashboard Overview</h1>
          <p className='text-gray-500 mt-1'>Welcome back! Here's what's happening with your services today.</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
          {/* Total Bookings */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5'>
            <div className='p-4 bg-blue-50 rounded-xl'>
              <IoCalendarOutline className='w-8 h-8 text-blue-600' />
            </div>
            <div>
              <p className='text-gray-400 text-sm font-medium'>Total Bookings</p>
              <h3 className='text-2xl font-bold text-gray-800'>{stats.totalBookings}</h3>
            </div>
          </div>

          {/* Total Revenue */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5'>
            <div className='p-4 bg-green-50 rounded-xl'>
              <IoTrendingUp className='w-8 h-8 text-green-600' />
            </div>
            <div>
              <p className='text-gray-400 text-sm font-medium'>Total Revenue</p>
              <h3 className='text-2xl font-bold text-gray-800'>₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Total Services */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5'>
            <div className='p-4 bg-purple-50 rounded-xl'>
              <IoListOutline className='w-8 h-8 text-purple-600' />
            </div>
            <div>
              <p className='text-gray-400 text-sm font-medium'>Active Services</p>
              <h3 className='text-2xl font-bold text-gray-800'>{stats.totalServices}</h3>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Revenue Chart */}
          <div className='lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='font-bold text-gray-800 text-lg'>Revenue Trend</h3>
              <select className='text-sm border-none bg-gray-50 rounded-lg p-1 px-2 text-gray-500 outline-none cursor-pointer'>
                <option>Last 6 Months</option>
              </select>
            </div>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latest Bookings Table */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col'>
            <div className='p-6 border-b border-gray-50 flex items-center justify-between'>
              <h3 className='font-bold text-gray-800 text-lg'>Latest Bookings</h3>
              <button
                onClick={() => navigate('/provider/booking-details')}
                className='text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline'
              >
                View All <IoArrowForwardOutline />
              </button>
            </div>

            <div className='flex-1'>
              {stats.latestBookings.length === 0 ? (
                <div className='p-10 text-center text-gray-400'>
                  <p>No bookings yet</p>
                </div>
              ) : (
                <div className='divide-y divide-gray-50'>
                  {stats.latestBookings.map((booking, idx) => (
                    <div key={booking._id} className='p-4 hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-xs font-mono text-gray-400'>#{booking._id.slice(-6).toUpperCase()}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full text-center ${booking.status === 'cancelled'
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-green-600 bg-green-50'
                          }`}>
                          ₹{(booking.status === 'cancelled' ? (booking.cancellationFee || 0) : (booking.totalPrice || 0)).toLocaleString()}
                        </span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs'>
                          {booking.customerName?.charAt(0) || 'U'}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-semibold text-gray-800 truncate'>{booking.customerName}</p>
                          <div className='flex items-center gap-3 text-[10px] text-gray-400 mt-0.5'>
                            <span className='flex items-center gap-1'><IoCalendarOutline /> {new Date(booking.eventDate).toLocaleDateString()}</span>
                            <span className='flex items-center gap-1'><IoTimeOutline /> {booking.eventTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
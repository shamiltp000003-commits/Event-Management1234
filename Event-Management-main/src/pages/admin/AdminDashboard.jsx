// import React, { useEffect, useState } from 'react'
// import { adminDashboard_data } from '../../constants/data'

// const AdminDashboard = () => {

//   const [dashboardData, setDashboardData] = useState({
//     Totalusers: 0,
//     Totalproviders: 0,
//     Totalbookings: 0,
//     registrations: 0,
//     feedbackReceived: 0
//   })

//   const fetchDashboard = async () => {
//     setDashboardData(adminDashboard_data)
//   }

//   useEffect(() => {
//     fetchDashboard()
//   }, [])

//   return (
//     <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>

//       <div className='flex flex-wrap gap-4'>

//         {/* Total Users */}
//         <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
//           <div>
//             <p className='text-xl font-semibold text-gray-600'>{dashboardData.Totalusers}</p>
//             <p className='text-gray-400 font-light'>Total Users</p>
//           </div>
//         </div>

//         {/* Total Providers */}
//         <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
//           <div>
//             <p className='text-xl font-semibold text-gray-600'>{dashboardData.Totalproviders}</p>
//             <p className='text-gray-400 font-light'>Total Providers</p>
//           </div>
//         </div>

//         {/* Total Bookings */}
//         <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
//           <div>
//             <p className='text-xl font-semibold text-gray-600'>{dashboardData.Totalbookings}</p>
//             <p className='text-gray-400 font-light'>Total Bookings</p>
//           </div>
//         </div>

//         {/* Registrations */}
//         <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
//           <div>
//             <p className='text-xl font-semibold text-gray-600'>{dashboardData.registrations}</p>
//             <p className='text-gray-400 font-light'>Registrations</p>
//           </div>
//         </div>

//         {/* Feedback Received */}
//         <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
//           <div>
//             <p className='text-xl font-semibold text-gray-600'>{dashboardData.feedbackReceived}</p>
//             <p className='text-gray-400 font-light'>Feedback Received</p>
//           </div>
//         </div>

//       </div>

//       {/* ------- Latest Blogs Table ------- */}
//       <div>
//         <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
//           <p>Latest Bookings</p>
//         </div>

//         <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg bg-white'>
//           <table className='w-full text-sm text-gray-500'>
//             <thead className='text-xs text-gray-600 text-left uppercase'>
//               <tr>
//                 <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
//                 <th scope='col' className='px-2 py-4'>Bookings</th>
//                 <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
//                 <th scope='col' className='px-2 py-4 max-sm:hidden'>Status</th>
//                 <th scope='col' className='px-2 py-4'>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Dynamic blog table goes here */}
//             </tbody>
//           </table>
//         </div>
//       </div>

//     </div>
//   )
// }

// export default AdminDashboard

import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import {
  ChevronsRight, Users, UserCheck, CalendarDays, IndianRupee,
  Clock, ShieldAlert, MessageSquare, ArrowRight, Activity
} from "lucide-react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);

  const [latestBookings, setLatestBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token"); // or wherever you store it

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Dashboard data
        const res = await axios.get(
          "/dashboardData",
          config
        );
        console.log(res, "res111");


        setDashboardData(res.data);

        // Derive latest bookings directly from the dashboard data
        // Admin dashboard data returns bookings pre-sorted by createdAt descending
        const bookingsData = res.data.bookings || [];
        setLatestBookings(bookingsData.slice(0, 5));

      } catch (err) {
        console.error("Dashboard fetch error:", err.response?.data || err.message);

        // Fallback mock data



        setLatestBookings([]); // safer fallback
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 font-medium">Total Users</p>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{dashboardData.users?.length ?? 0}</p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1 font-medium"><Activity size={14} /> Active accounts</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 font-medium">Total Providers</p>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <UserCheck size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{dashboardData.providers?.length ?? 0}</p>
          <p className="text-sm text-indigo-500 mt-2 flex items-center gap-1 font-medium"><Activity size={14} /> Registered services</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 font-medium">Total Bookings</p>
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <CalendarDays size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{dashboardData.bookings?.length ?? 0}</p>
          <p className="text-sm text-orange-500 mt-2 flex items-center gap-1 font-medium"><Activity size={14} /> Platform orders</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 font-medium">Total Revenue</p>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <IndianRupee size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            ₹{dashboardData.bookings?.reduce((sum, booking) => {
              if (booking.status === "cancelled") {
                return sum + (booking.cancellationFee || 0);
              }
              return sum + (booking.totalPrice || 0);
            }, 0)?.toLocaleString() ?? 0}
          </p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1 font-medium"><Activity size={14} /> Platform growth</p>
        </div>
      </div>

      {/* Second Row */}
      <h3 className="text-xl font-bold text-gray-800 tracking-tight mt-10 mb-5 pl-1">Action Center</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-2xl shadow-sm border border-yellow-100 hover:shadow-md transition duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-yellow-800 font-semibold mb-1">Provider Approvals</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{dashboardData.providers?.filter(p => p.status === "Pending").length ?? 0}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100/50 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
              <ShieldAlert size={24} />
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500 z-0">
            <ShieldAlert size={100} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-2xl shadow-sm border border-red-100 hover:shadow-md transition duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-red-800 font-semibold mb-1">Pending Bookings</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{dashboardData.bookings?.filter(b => b.status === "Pending").length ?? 0}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100/50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 z-0">
            <Clock size={100} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-blue-800 font-semibold mb-1">Feedback Received</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardData.totalFeedback ?? 0}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <MessageSquare size={24} />
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500 z-0">
            <MessageSquare size={100} />
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="mt-12 mb-6">
        <div className="flex justify-between items-center mb-5 pl-1">
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Latest Bookings</h3>
          <NavLink to="/admin/settlement-history" className="text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:underline transition-colors flex items-center gap-1">
            View All <ChevronsRight className="w-4 h-4" />
          </NavLink>
        </div>

        <div className="overflow-x-auto shadow-sm shadow-gray-200/50 rounded-2xl bg-white border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Provider / Service</th>
                <th className="px-6 py-4">Event Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 rounded-tr-2xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {latestBookings.map((b, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition duration-200 ease-in-out">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    #{b._id ? b._id.slice(-6).toUpperCase() : `ID-${i + 1}`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 font-semibold rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 border border-blue-300 shadow-sm">
                        {b.customerName ? b.customerName.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{b.customerName || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{b.phone || "No phone"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{b.providerName || "N/A"}</p>
                    <p className="text-xs text-gray-500 max-w-[180px] truncate">{b.categoryModel || "Unknown"} - {b.serviceName || "Service"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {b.eventDate ? new Date(b.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
                    </p>
                    <p className="text-xs text-gray-500">{b.eventTime || "Time not set"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800">₹{b.totalPrice ?? "-"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm ${(b.status || "").toLowerCase() === "completed" || (b.status || "").toLowerCase() === "confirmed"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : (b.status || "").toLowerCase() === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${(b.status || "").toLowerCase() === "completed" || (b.status || "").toLowerCase() === "confirmed" ? "bg-green-500" :
                        (b.status || "").toLowerCase() === "pending" ? "bg-yellow-500" : "bg-red-500"
                        }`}></span>
                      {b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : "Unknown"}
                    </span>
                  </td>
                </tr>
              ))}
              {latestBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                      <p className="text-lg font-medium text-gray-600">No recent bookings</p>
                      <p className="text-sm mt-1">New bookings will appear here once users make a reservation.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <h3 className="text-xl font-bold text-gray-800 tracking-tight mt-10 mb-5 pl-1">Quick Links</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10">
        <NavLink to="/admin/add-provider" className="group bg-white hover:bg-cyan-50 border border-gray-100 transition-all duration-300 shadow-sm p-5 rounded-2xl hover:shadow-md flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors"><UserCheck size={20} /></div>
            <span className="font-semibold text-gray-700 group-hover:text-cyan-800 transition-colors">Manage Providers</span>
          </div>
          <ArrowRight className="text-gray-300 group-hover:text-cyan-600 transition-colors group-hover:translate-x-1 duration-300" size={20} />
        </NavLink>

        <NavLink to="/admin/manage-user" className="group bg-white hover:bg-cyan-50 border border-gray-100 transition-all duration-300 shadow-sm p-5 rounded-2xl hover:shadow-md flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors"><Users size={20} /></div>
            <span className="font-semibold text-gray-700 group-hover:text-cyan-800 transition-colors">Manage Users</span>
          </div>
          <ArrowRight className="text-gray-300 group-hover:text-cyan-600 transition-colors group-hover:translate-x-1 duration-300" size={20} />
        </NavLink>

        <NavLink to="/admin/settlement-history" className="group bg-white hover:bg-cyan-50 border border-gray-100 transition-all duration-300 shadow-sm p-5 rounded-2xl hover:shadow-md flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors"><CalendarDays size={20} /></div>
            <span className="font-semibold text-gray-700 group-hover:text-cyan-800 transition-colors">All Bookings</span>
          </div>
          <ArrowRight className="text-gray-300 group-hover:text-cyan-600 transition-colors group-hover:translate-x-1 duration-300" size={20} />
        </NavLink>
      </div>
    </div>
  );
};

export default AdminDashboard;

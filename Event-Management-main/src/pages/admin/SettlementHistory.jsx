import React, { useEffect, useState } from "react";
import {
  Banknote,
  Search,
  Loader2,
  Wallet,
  TrendingUp,
  User,
  Briefcase,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import axios from "axios";

const SettlementHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("/dashboardData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data?.bookings || [];
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate metrics
  const totalRevenue = bookings
    .reduce((sum, b) => {
      if (b.status === "confirmed" || b.status === "completed") {
        return sum + (b.totalPrice || 0);
      }
      if (b.status === "cancelled") {
        return sum + (b.cancellationFee || 0);
      }
      return sum;
    }, 0);

  const pendingRevenue = bookings
    .filter((b) => b.status === "pending")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  // Filter bookings based on search
  const filteredBookings = bookings.filter((b) => {
    const term = search.toLowerCase();
    return (
      b.customerName?.toLowerCase().includes(term) ||
      b.providerName?.toLowerCase().includes(term) ||
      b.serviceName?.toLowerCase().includes(term) ||
      b.categoryModel?.toLowerCase().includes(term) ||
      b._id?.toLowerCase().includes(term) ||
      b.status?.toLowerCase().includes(term)
    );
  });

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading settlement data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border border-emerald-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <Banknote className="text-2xl text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Settlement History
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Track platform revenue, transactions, and provider payouts
            </p>
          </div>
        </div>
        <div className="absolute -right-6 -top-10 opacity-[0.03] transform rotate-12 pointer-events-none">
          <Banknote size={200} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Realized Revenue</p>
              <p className="text-3xl font-bold text-gray-800 tracking-tight">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
              <TrendingUp className="text-xl text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1 font-medium">
            <CheckCircle2 size={12} /> Confirmed & Completed
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Pending Settlements</p>
              <p className="text-3xl font-bold text-gray-800 tracking-tight">
                ₹{pendingRevenue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
              <Wallet className="text-xl text-amber-500" />
            </div>
          </div>
          <p className="text-xs text-amber-600 mt-3 flex items-center gap-1 font-medium">
            <Clock size={12} /> Awaiting Confirmation
          </p>
        </div>
      </div>

      {/* Search and Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        {/* Search Section */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, customer, provider, or status..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Transaction Info
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer & Provider
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Service Details
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((b, i) => (
                <tr
                  key={b._id || i}
                  className="hover:bg-emerald-50/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-mono font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 inline-block w-fit">
                        #{b._id ? b._id.slice(-6).toUpperCase() : `TXN-${i + 1}`}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(b.eventDate || b.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{b.customerName || "Unknown Customer"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{b.providerName || "Unknown Provider"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-800">
                        {b.serviceName || b.categoryModel || "Service Booking"}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {b.categoryModel || "General Category"}
                      </span>
                    </div>
                  </td>

                   <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-gray-800 font-bold">
                        <IndianRupee className="w-4 h-4 text-gray-500" />
                        {b.status === "cancelled" 
                          ? (b.cancellationFee || 0).toLocaleString('en-IN') 
                          : (b.totalPrice || 0).toLocaleString('en-IN')}
                      </div>
                      {b.status === "cancelled" && (
                        <div className="text-[10px] text-red-500 font-medium">
                          Refund: ₹{(b.refundAmount || 0).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(b.status)}`}>
                      {getStatusIcon(b.status)}
                      {b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : "Unknown"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-3">
              <Banknote className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-1">No settlements found</p>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              We couldn't find any booking records matching your search. Try adjusting your filters.
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettlementHistory;

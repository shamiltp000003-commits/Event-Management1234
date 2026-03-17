import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    TrendingUp, Users, Calendar, IndianRupee, Loader2, ArrowUpRight, ArrowDownRight,
    UserCheck, Briefcase
} from 'lucide-react';

const COLORS = ['#0891b2', '#0284c7', '#2563eb', '#4f46e5', '#7c3aed', '#9333ea'];

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/dashboardData', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error("Analytics Fetch Error:", err);
                setError("Failed to load analytics data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Analyzing data patterns...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="p-10 text-center text-red-500 font-medium">{error}</div>;
    }

    const { users, providers, bookings } = data;

    // 📈 Process Data for Charts

    // 1. Revenue Trends (Monthly)
    const revenueByMonth = bookings.reduce((acc, b) => {
        const date = new Date(b.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });
        const amount = b.status === 'cancelled' ? (b.cancellationFee || 0) : (b.totalPrice || 0);
        acc[month] = (acc[month] || 0) + amount;
        return acc;
    }, {});
    const revenueChartData = Object.keys(revenueByMonth).map(month => ({
        name: month,
        revenue: revenueByMonth[month]
    }));

    // 2. Category Distribution
    const categoryCount = bookings.reduce((acc, b) => {
        acc[b.category] = (acc[b.category] || 0) + 1;
        return acc;
    }, {});
    const categoryChartData = Object.keys(categoryCount).map(cat => ({
        name: cat,
        value: categoryCount[cat]
    }));

    // 3. Booking Status counts
    const statusCount = bookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
    }, {});
    const statusChartData = Object.keys(statusCount).map(status => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        count: statusCount[status]
    }));

    const totalRevenue = bookings.reduce((sum, b) => {
        if (b.status === 'cancelled') {
            return sum + (b.cancellationFee || 0);
        }
        return sum + (b.totalPrice || 0);
    }, 0);
    const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;

    return (
        <div className="p-4 sm:p-6 space-y-6 sm:y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Business Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time performance metrics and data insights</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 self-start md:self-center">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Live Metrics Tracking
                </div>
            </div>

            {/* Summary Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Providers', value: providers.length, icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Active Bookings', value: activeBookings, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors`}>
                                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3" />
                                +12%
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium">{stat.label}</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Area Chart */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base">Revenue Growth</h3>
                        <select className="text-xs bg-gray-50 border-none rounded-lg px-2 sm:px-3 py-1 text-gray-600 focus:ring-0">
                            <option>Monthly</option>
                            <option>Yearly</option>
                        </select>
                    </div>
                    <div className="h-[250px] sm:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36}/>
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#0891b2" 
                                    strokeWidth={4} 
                                    dot={{ r: 6, fill: '#0891b2', strokeWidth: 2, stroke: '#fff' }} 
                                    activeDot={{ r: 8, strokeWidth: 0 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Bar Chart */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-8 text-sm sm:text-base">Booking Fulfillment</h3>
                    <div className="h-[250px] sm:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Pie */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 sm:mb-8 text-sm sm:text-base">Service Category Share</h3>
                    <div className="h-[300px] sm:h-[320px] md:h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryChartData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={window.innerWidth < 640 ? 50 : 60}
                                    outerRadius={window.innerWidth < 640 ? 80 : 100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend
                                    layout={window.innerWidth < 640 ? "horizontal" : "vertical"}
                                    verticalAlign={window.innerWidth < 640 ? "bottom" : "middle"}
                                    align={window.innerWidth < 640 ? "center" : "right"}
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '12px', paddingTop: window.innerWidth < 640 ? '20px' : '0' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 text-sm sm:text-base">Recent Transactions</h3>
                    <div className="space-y-4 sm:space-y-5">
                        {bookings.slice(0, 5).map((booking, idx) => (
                            <div key={idx} className="flex items-center justify-between group gap-2">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-cyan-50 group-hover:border-cyan-100 transition-colors flex-shrink-0">
                                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-cyan-600" />
                                    </div>
                                    <div className="truncate">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-gray-800 truncate">{booking.serviceName}</h4>
                                            {booking.status === 'cancelled' && (
                                                <span className="text-[8px] bg-red-50 text-red-500 px-1 rounded border border-red-100 font-bold uppercase">Cancelled</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{booking.customerName}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className={`text-sm font-bold ${booking.status === 'cancelled' ? 'text-red-500' : 'text-gray-800'}`}>
                                        ₹{booking.status === 'cancelled' 
                                            ? (booking.cancellationFee || 0).toLocaleString() 
                                            : (booking.totalPrice || 0).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{new Date(booking.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 sm:mt-8 py-2.5 text-sm font-semibold text-cyan-600 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors">
                        View All Transactions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
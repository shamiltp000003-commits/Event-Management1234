import Booking from "../../models/Booking/bookingSchema.js";
import AuditoriumSchema from "../../models/Services/AuditoriumSchema.js";
import CateringService from "../../models/Services/Catering&FoodsSchema.js";
import PhotographySchema from "../../models/Services/PhotographySchema.js";
import DecorationService from "../../models/Services/Stage&Decerations.js";

export const getDashboardStats = async (req, res) => {
    try {
        const providerId = req.provider._id;

        // 1. Get counts and sums
        const [bookingsCount, confirmedBookings, servicesCount] = await Promise.all([
            Booking.countDocuments({ provider: providerId }),
            Booking.find({ provider: providerId }),
            Promise.all([
                AuditoriumSchema.countDocuments({ providerId }),
                CateringService.countDocuments({ providerId }),
                PhotographySchema.countDocuments({ providerId }),
                DecorationService.countDocuments({ providerId }),
            ]).then(counts => counts.reduce((a, b) => a + b, 0))
        ]);

        // 2. Calculate Total Revenue (Include confirmed/completed totalPrice + cancelled cancellationFee)
        const totalRevenue = confirmedBookings
            .reduce((sum, b) => {
                if (b.status === "cancelled") {
                    return sum + (b.cancellationFee || 0);
                }
                return sum + (b.totalPrice || 0);
            }, 0);

        // 3. Get Latest 5 Bookings
        const latestBookings = await Booking.find({ provider: providerId })
            .sort({ createdAt: -1 })
            .limit(5);

        // 4. Generate Chart Data (Last 6 Months Revenue)
        const chartData = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = d.toLocaleString('default', { month: 'short' });

            const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
            const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

            const monthRevenue = confirmedBookings
                .filter(b => b.createdAt >= startOfMonth && b.createdAt <= endOfMonth)
                .reduce((sum, b) => {
                    if (b.status === "cancelled") {
                        return sum + (b.cancellationFee || 0);
                    }
                    return sum + (b.totalPrice || 0);
                }, 0);

            chartData.push({ month: monthName, revenue: monthRevenue });
        }

        res.status(200).json({
            success: true,
            data: {
                totalBookings: bookingsCount,
                totalRevenue,
                totalServices: servicesCount,
                latestBookings,
                chartData
            }
        });
    } catch (error) {
        console.error("getDashboardStats error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching dashboard stats",
            error: error.message,
        });
    }
};

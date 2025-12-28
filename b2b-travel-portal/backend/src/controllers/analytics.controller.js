/**
 * Analytics Controller
 * Handles reports and analytics operations
 */

const catchAsync = require('../utils/catchAsync');

// Sample data for demo
const generateSampleData = (agentId, period) => {
    const now = new Date();
    let days;
    switch (period) {
        case 'week': days = 7; break;
        case 'month': days = 30; break;
        case 'quarter': days = 90; break;
        case 'year': days = 365; break;
        default: days = 30;
    }

    // Generate random data for demo
    const bookings = Math.floor(Math.random() * 100) + 50;
    const revenue = Math.floor(Math.random() * 500000) + 100000;
    const commission = Math.floor(revenue * 0.05);

    return {
        period,
        days,
        bookings,
        revenue,
        commission,
        averageBookingValue: Math.round(revenue / bookings),
        cancelledBookings: Math.floor(bookings * 0.08),
        refundedAmount: Math.floor(revenue * 0.04)
    };
};

/**
 * Get dashboard overview
 */
exports.getDashboardStats = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { period = 'month' } = req.query;

    const data = generateSampleData(agentId, period);

    res.json({
        success: true,
        data: {
            overview: {
                totalBookings: data.bookings,
                totalRevenue: data.revenue,
                totalCommission: data.commission,
                pendingBookings: Math.floor(data.bookings * 0.1),
                cancelledBookings: data.cancelledBookings
            },
            comparison: {
                bookingsChange: Math.floor(Math.random() * 30) - 10,
                revenueChange: Math.floor(Math.random() * 25) - 5,
                commissionChange: Math.floor(Math.random() * 20) - 8
            },
            period
        }
    });
});

/**
 * Get booking analytics
 */
exports.getBookingAnalytics = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { period = 'month', groupBy = 'day' } = req.query;

    // Generate daily booking data for chart
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const chartData = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        chartData.push({
            date: date.toISOString().split('T')[0],
            bookings: Math.floor(Math.random() * 15) + 2,
            revenue: Math.floor(Math.random() * 50000) + 10000,
            cancellations: Math.floor(Math.random() * 2)
        });
    }

    res.json({
        success: true,
        data: {
            chartData,
            summary: {
                totalBookings: chartData.reduce((sum, d) => sum + d.bookings, 0),
                totalRevenue: chartData.reduce((sum, d) => sum + d.revenue, 0),
                averageDaily: Math.round(chartData.reduce((sum, d) => sum + d.bookings, 0) / days)
            }
        }
    });
});

/**
 * Get revenue analytics
 */
exports.getRevenueAnalytics = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { period = 'month' } = req.query;

    const data = generateSampleData(agentId, period);

    res.json({
        success: true,
        data: {
            revenue: {
                total: data.revenue,
                commission: data.commission,
                netRevenue: data.revenue - data.commission,
                refunds: data.refundedAmount,
                collected: data.revenue - data.refundedAmount
            },
            breakdown: {
                domestic: Math.floor(data.revenue * 0.65),
                international: Math.floor(data.revenue * 0.35),
                economy: Math.floor(data.revenue * 0.75),
                business: Math.floor(data.revenue * 0.25)
            }
        }
    });
});

/**
 * Get top routes
 */
exports.getTopRoutes = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { period = 'month', limit = 10 } = req.query;

    const routes = [
        { origin: 'DEL', destination: 'BOM', originCity: 'New Delhi', destinationCity: 'Mumbai', bookings: 45, revenue: 450000 },
        { origin: 'BLR', destination: 'DEL', originCity: 'Bangalore', destinationCity: 'New Delhi', bookings: 38, revenue: 380000 },
        { origin: 'CCU', destination: 'BLR', originCity: 'Kolkata', destinationCity: 'Bangalore', bookings: 32, revenue: 320000 },
        { origin: 'MAA', destination: 'DEL', originCity: 'Chennai', destinationCity: 'New Delhi', bookings: 28, revenue: 280000 },
        { origin: 'HYD', destination: 'BOM', originCity: 'Hyderabad', destinationCity: 'Mumbai', bookings: 25, revenue: 250000 },
        { origin: 'DEL', destination: 'GOI', originCity: 'New Delhi', destinationCity: 'Goa', bookings: 22, revenue: 220000 },
        { origin: 'PNQ', destination: 'DEL', originCity: 'Pune', destinationCity: 'New Delhi', bookings: 18, revenue: 180000 },
        { origin: 'AMD', destination: 'BOM', originCity: 'Ahmedabad', destinationCity: 'Mumbai', bookings: 15, revenue: 150000 },
        { origin: 'COK', destination: 'DEL', originCity: 'Kochi', destinationCity: 'New Delhi', bookings: 12, revenue: 120000 },
        { origin: 'JAI', destination: 'BOM', originCity: 'Jaipur', destinationCity: 'Mumbai', bookings: 10, revenue: 100000 }
    ];

    res.json({
        success: true,
        data: routes.slice(0, parseInt(limit))
    });
});

/**
 * Get top airlines
 */
exports.getTopAirlines = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { period = 'month' } = req.query;

    const airlines = [
        { code: '6E', name: 'IndiGo', bookings: 52, revenue: 520000, share: 32 },
        { code: 'AI', name: 'Air India', bookings: 45, revenue: 560000, share: 28 },
        { code: 'UK', name: 'Vistara', bookings: 28, revenue: 350000, share: 17 },
        { code: 'SG', name: 'SpiceJet', bookings: 22, revenue: 180000, share: 14 },
        { code: 'G8', name: 'Go First', bookings: 15, revenue: 120000, share: 9 }
    ];

    res.json({
        success: true,
        data: airlines
    });
});

/**
 * Get performance metrics
 */
exports.getPerformanceMetrics = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { period = 'month' } = req.query;

    res.json({
        success: true,
        data: {
            conversionRate: 68.5,
            averageBookingTime: 4.2, // minutes
            repeatCustomerRate: 45.2,
            customerSatisfaction: 4.6,
            responseTime: 2.1, // hours
            bookingSuccessRate: 96.8,
            cancellationRate: 8.2,
            refundProcessingTime: 5.5 // days
        }
    });
});

/**
 * Get monthly summary
 */
exports.getMonthlySummary = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { year = new Date().getFullYear() } = req.query;

    const months = [];
    for (let i = 0; i < 12; i++) {
        months.push({
            month: i + 1,
            monthName: new Date(year, i).toLocaleString('default', { month: 'short' }),
            bookings: Math.floor(Math.random() * 80) + 30,
            revenue: Math.floor(Math.random() * 400000) + 100000,
            commission: Math.floor(Math.random() * 20000) + 5000
        });
    }

    res.json({
        success: true,
        data: {
            year: parseInt(year),
            months,
            totals: {
                bookings: months.reduce((sum, m) => sum + m.bookings, 0),
                revenue: months.reduce((sum, m) => sum + m.revenue, 0),
                commission: months.reduce((sum, m) => sum + m.commission, 0)
            }
        }
    });
});

/**
 * Export report
 */
exports.exportReport = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { type = 'bookings', format = 'pdf', period = 'month' } = req.query;

    // In production, this would generate actual PDF/Excel
    res.json({
        success: true,
        data: {
            message: `${type} report for ${period} will be generated and sent to your email`,
            format,
            estimatedTime: '2-5 minutes'
        }
    });
});

/**
 * Get commission report
 */
exports.getCommissionReport = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { period = 'month' } = req.query;

    const commissions = [
        { date: '2025-12-26', bookingRef: 'TRP001', airline: 'Air India', route: 'DEL-BOM', fare: 12450, commission: 450, status: 'credited' },
        { date: '2025-12-25', bookingRef: 'TRP002', airline: 'IndiGo', route: 'BLR-DEL', fare: 8900, commission: 320, status: 'credited' },
        { date: '2025-12-24', bookingRef: 'TRP003', airline: 'Vistara', route: 'CCU-MAA', fare: 15200, commission: 580, status: 'pending' },
        { date: '2025-12-23', bookingRef: 'TRP004', airline: 'SpiceJet', route: 'HYD-GOI', fare: 6800, commission: 245, status: 'credited' },
        { date: '2025-12-22', bookingRef: 'TRP005', airline: 'Air India', route: 'DEL-CCU', fare: 9500, commission: 380, status: 'credited' }
    ];

    const totals = {
        totalFare: commissions.reduce((sum, c) => sum + c.fare, 0),
        totalCommission: commissions.reduce((sum, c) => sum + c.commission, 0),
        credited: commissions.filter(c => c.status === 'credited').reduce((sum, c) => sum + c.commission, 0),
        pending: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commission, 0)
    };

    res.json({
        success: true,
        data: {
            commissions,
            totals
        }
    });
});

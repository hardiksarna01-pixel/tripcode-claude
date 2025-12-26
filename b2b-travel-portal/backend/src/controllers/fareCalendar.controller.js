/**
 * Fare Calendar Controller
 * Handles fare calendar and price alerts
 */

const catchAsync = require('../utils/catchAsync');

// In-memory storage for demo
let priceAlerts = new Map();
let alertIdCounter = 1;

/**
 * Get fare calendar for route
 */
exports.getFareCalendar = catchAsync(async (req, res) => {
    const { origin, destination, month, year, cabinClass = 0 } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({
            success: false,
            error: 'Origin and destination are required'
        });
    }

    const targetMonth = parseInt(month) || new Date().getMonth() + 1;
    const targetYear = parseInt(year) || new Date().getFullYear();

    // Generate calendar data
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const calendarData = [];

    // Generate random fares for each day
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(targetYear, targetMonth - 1, day);
        const dayOfWeek = date.getDay();

        // Higher prices on weekends and holidays
        let baseFare = 3500 + Math.floor(Math.random() * 2000);
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            baseFare += 800;
        }

        // Add some high/low fare days
        if (Math.random() > 0.85) {
            baseFare += 1500; // High fare day
        } else if (Math.random() < 0.15) {
            baseFare -= 800; // Low fare day
        }

        calendarData.push({
            date: date.toISOString().split('T')[0],
            day,
            dayOfWeek,
            lowestFare: baseFare,
            availability: Math.random() > 0.1 ? 'available' : 'limited',
            fareLevel: baseFare < 4000 ? 'low' : baseFare > 5000 ? 'high' : 'medium'
        });
    }

    // Find lowest and highest fares
    const fares = calendarData.map(d => d.lowestFare);
    const lowestFare = Math.min(...fares);
    const highestFare = Math.max(...fares);
    const averageFare = Math.round(fares.reduce((a, b) => a + b, 0) / fares.length);

    res.json({
        success: true,
        data: {
            route: { origin, destination },
            month: targetMonth,
            year: targetYear,
            cabinClass,
            calendar: calendarData,
            summary: {
                lowestFare,
                highestFare,
                averageFare,
                cheapestDays: calendarData.filter(d => d.lowestFare === lowestFare).map(d => d.date),
                expensiveDays: calendarData.filter(d => d.lowestFare === highestFare).map(d => d.date)
            }
        }
    });
});

/**
 * Get fare trend for route
 */
exports.getFareTrend = catchAsync(async (req, res) => {
    const { origin, destination, days = 30 } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({
            success: false,
            error: 'Origin and destination are required'
        });
    }

    const trendData = [];
    let baseFare = 4000;

    for (let i = parseInt(days); i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Random price fluctuation
        baseFare += Math.floor(Math.random() * 400) - 200;
        if (baseFare < 3000) baseFare = 3000;
        if (baseFare > 6000) baseFare = 6000;

        trendData.push({
            date: date.toISOString().split('T')[0],
            fare: baseFare
        });
    }

    const currentFare = trendData[trendData.length - 1].fare;
    const weekAgoFare = trendData[Math.max(0, trendData.length - 8)]?.fare || currentFare;
    const monthAgoFare = trendData[0].fare;

    res.json({
        success: true,
        data: {
            route: { origin, destination },
            trend: trendData,
            analysis: {
                currentFare,
                weekChange: Math.round(((currentFare - weekAgoFare) / weekAgoFare) * 100),
                monthChange: Math.round(((currentFare - monthAgoFare) / monthAgoFare) * 100),
                recommendation: currentFare < 4000 ? 'Good time to book' :
                    currentFare > 5000 ? 'Consider waiting' : 'Average pricing'
            }
        }
    });
});

/**
 * Create price alert
 */
exports.createAlert = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const {
        origin, destination, departureDate,
        targetPrice, notifyVia = ['email']
    } = req.body;

    if (!origin || !destination || !targetPrice) {
        return res.status(400).json({
            success: false,
            error: 'Origin, destination, and target price are required'
        });
    }

    const alert = {
        id: alertIdCounter++,
        agentId,
        origin,
        destination,
        departureDate: departureDate || null,
        targetPrice: parseInt(targetPrice),
        currentPrice: 4500, // Would be fetched from API
        notifyVia,
        isActive: true,
        triggeredCount: 0,
        lastTriggered: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    priceAlerts.set(alert.id, alert);

    res.status(201).json({
        success: true,
        data: alert,
        message: `Alert created. We'll notify you when fare drops below ₹${targetPrice}`
    });
});

/**
 * Get all price alerts for agent
 */
exports.getAlerts = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { active } = req.query;

    let agentAlerts = Array.from(priceAlerts.values()).filter(a => a.agentId === agentId);

    if (active !== undefined) {
        agentAlerts = agentAlerts.filter(a => a.isActive === (active === 'true'));
    }

    // Sort by creation date
    agentAlerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
        success: true,
        data: agentAlerts
    });
});

/**
 * Get single alert
 */
exports.getAlert = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const alert = priceAlerts.get(parseInt(id));

    if (!alert || alert.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Alert not found'
        });
    }

    res.json({
        success: true,
        data: alert
    });
});

/**
 * Update price alert
 */
exports.updateAlert = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;
    const { targetPrice, notifyVia, isActive } = req.body;

    const alert = priceAlerts.get(parseInt(id));

    if (!alert || alert.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Alert not found'
        });
    }

    if (targetPrice !== undefined) alert.targetPrice = parseInt(targetPrice);
    if (notifyVia !== undefined) alert.notifyVia = notifyVia;
    if (isActive !== undefined) alert.isActive = isActive;
    alert.updatedAt = new Date().toISOString();

    priceAlerts.set(alert.id, alert);

    res.json({
        success: true,
        data: alert
    });
});

/**
 * Delete price alert
 */
exports.deleteAlert = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const alert = priceAlerts.get(parseInt(id));

    if (!alert || alert.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Alert not found'
        });
    }

    priceAlerts.delete(parseInt(id));

    res.json({
        success: true,
        message: 'Alert deleted successfully'
    });
});

/**
 * Toggle alert active status
 */
exports.toggleAlert = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const alert = priceAlerts.get(parseInt(id));

    if (!alert || alert.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Alert not found'
        });
    }

    alert.isActive = !alert.isActive;
    alert.updatedAt = new Date().toISOString();
    priceAlerts.set(alert.id, alert);

    res.json({
        success: true,
        data: alert
    });
});

/**
 * Get lowest fares for flexible dates
 */
exports.getFlexibleFares = catchAsync(async (req, res) => {
    const { origin, destination, departureDate, flexDays = 3 } = req.query;

    if (!origin || !destination || !departureDate) {
        return res.status(400).json({
            success: false,
            error: 'Origin, destination, and departure date are required'
        });
    }

    const centerDate = new Date(departureDate);
    const fares = [];

    for (let i = -parseInt(flexDays); i <= parseInt(flexDays); i++) {
        const date = new Date(centerDate);
        date.setDate(date.getDate() + i);

        const baseFare = 3500 + Math.floor(Math.random() * 2000);
        const dayOfWeek = date.getDay();

        fares.push({
            date: date.toISOString().split('T')[0],
            dayOfWeek,
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            fare: baseFare + (dayOfWeek === 0 || dayOfWeek === 6 ? 500 : 0),
            isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
            isSelected: i === 0
        });
    }

    const lowestFare = Math.min(...fares.map(f => f.fare));
    const cheapestDate = fares.find(f => f.fare === lowestFare);

    res.json({
        success: true,
        data: {
            route: { origin, destination },
            selectedDate: departureDate,
            flexDays: parseInt(flexDays),
            fares,
            cheapestOption: cheapestDate,
            savings: fares.find(f => f.isSelected).fare - lowestFare
        }
    });
});

/**
 * Compare prices across dates
 */
exports.comparePrices = catchAsync(async (req, res) => {
    const { origin, destination, dates } = req.body;

    if (!origin || !destination || !dates || !Array.isArray(dates)) {
        return res.status(400).json({
            success: false,
            error: 'Origin, destination, and dates array are required'
        });
    }

    const comparison = dates.map(date => ({
        date,
        fare: 3500 + Math.floor(Math.random() * 2000),
        availability: Math.random() > 0.2 ? 'available' : 'limited'
    }));

    comparison.sort((a, b) => a.fare - b.fare);

    res.json({
        success: true,
        data: {
            route: { origin, destination },
            comparison,
            cheapest: comparison[0],
            mostExpensive: comparison[comparison.length - 1]
        }
    });
});

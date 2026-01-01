/**
 * Fare Calendar Controller
 */

class FareCalendarController {
    async getFlightFares(req, res) {
        try {
            const { origin, destination, month, year } = req.query;

            const daysInMonth = new Date(year, month, 0).getDate();
            const fares = [];

            for (let day = 1; day <= daysInMonth; day++) {
                const basePrice = 4000 + Math.floor(Math.random() * 3000);
                const isWeekend = [0, 6].includes(new Date(year, month - 1, day).getDay());
                const price = isWeekend ? basePrice * 1.2 : basePrice;

                fares.push({
                    date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
                    price: Math.round(price),
                    available: Math.random() > 0.1,
                    cheapest: price < 4500
                });
            }

            res.json({
                success: true,
                data: {
                    origin,
                    destination,
                    month,
                    year,
                    fares,
                    lowestFare: Math.min(...fares.map(f => f.price)),
                    currency: 'INR'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get fare calendar' });
        }
    }

    async getHotelFares(req, res) {
        try {
            const { hotelId, month, year } = req.query;

            const daysInMonth = new Date(year, month, 0).getDate();
            const fares = [];

            for (let day = 1; day <= daysInMonth; day++) {
                const basePrice = 5000 + Math.floor(Math.random() * 5000);
                const isWeekend = [0, 6].includes(new Date(year, month - 1, day).getDay());
                const price = isWeekend ? basePrice * 1.3 : basePrice;

                fares.push({
                    date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
                    price: Math.round(price),
                    available: Math.random() > 0.15,
                    roomsLeft: Math.floor(Math.random() * 10) + 1
                });
            }

            res.json({
                success: true,
                data: {
                    hotelId,
                    month,
                    year,
                    fares,
                    lowestFare: Math.min(...fares.map(f => f.price)),
                    currency: 'INR'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get hotel fare calendar' });
        }
    }

    async getLowestFares(req, res) {
        try {
            const { origin, destination, months } = req.query;

            const lowestFares = [];
            const startDate = new Date();

            for (let i = 0; i < (months || 3); i++) {
                const date = new Date(startDate);
                date.setMonth(date.getMonth() + i);

                lowestFares.push({
                    month: date.toLocaleString('default', { month: 'long' }),
                    year: date.getFullYear(),
                    lowestFare: 3500 + Math.floor(Math.random() * 2000),
                    averageFare: 5000 + Math.floor(Math.random() * 2000)
                });
            }

            res.json({
                success: true,
                data: {
                    origin,
                    destination,
                    lowestFares,
                    currency: 'INR'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get lowest fares' });
        }
    }

    async getPriceAlerts(req, res) {
        try {
            const alerts = [
                { id: 1, origin: 'DEL', destination: 'BOM', targetPrice: 4000, currentPrice: 4500, status: 'active' },
                { id: 2, origin: 'BLR', destination: 'GOI', targetPrice: 3500, currentPrice: 3200, status: 'triggered' }
            ];
            res.json({ success: true, data: alerts });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to get price alerts' });
        }
    }

    async createPriceAlert(req, res) {
        try {
            const { origin, destination, targetPrice, email, travelDates } = req.body;
            res.status(201).json({
                success: true,
                message: 'Price alert created successfully',
                data: {
                    alertId: `ALRT${Date.now()}`,
                    status: 'active'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to create price alert' });
        }
    }

    async deletePriceAlert(req, res) {
        try {
            const { alertId } = req.params;
            res.json({
                success: true,
                message: 'Price alert deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to delete price alert' });
        }
    }
}

module.exports = new FareCalendarController();

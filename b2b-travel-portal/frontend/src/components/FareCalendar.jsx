import React, { useState, useEffect } from 'react';
import { fareCalendarApi } from '../services/api';

const FareCalendar = () => {
    const [origin, setOrigin] = useState('DEL');
    const [destination, setDestination] = useState('BOM');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [calendarData, setCalendarData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertForm, setAlertForm] = useState({ targetPrice: '', notifyVia: ['email'] });

    useEffect(() => {
        fetchCalendar();
        fetchAlerts();
    }, [origin, destination, currentMonth, currentYear]);

    const fetchCalendar = async () => {
        setLoading(true);
        try {
            // Generate mock calendar data
            const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
            const data = [];
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(currentYear, currentMonth - 1, day);
                const dayOfWeek = date.getDay();
                let baseFare = 3500 + Math.floor(Math.random() * 2000);
                if (dayOfWeek === 0 || dayOfWeek === 6) baseFare += 800;
                data.push({
                    date: date.toISOString().split('T')[0],
                    day,
                    dayOfWeek,
                    lowestFare: baseFare,
                    fareLevel: baseFare < 4000 ? 'low' : baseFare > 5000 ? 'high' : 'medium'
                });
            }
            setCalendarData(data);
        } catch (error) {
            console.error('Error fetching calendar:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAlerts = async () => {
        try {
            // Mock alerts data
            setAlerts([
                { id: 1, origin: 'DEL', destination: 'BOM', targetPrice: 4000, currentPrice: 4500, isActive: true },
                { id: 2, origin: 'BLR', destination: 'DEL', targetPrice: 3500, currentPrice: 4200, isActive: true }
            ]);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    const handleCreateAlert = async () => {
        if (!alertForm.targetPrice) return;
        try {
            const newAlert = {
                id: Date.now(),
                origin,
                destination,
                targetPrice: parseInt(alertForm.targetPrice),
                currentPrice: 4500,
                isActive: true
            };
            setAlerts([...alerts, newAlert]);
            setShowAlertModal(false);
            setAlertForm({ targetPrice: '', notifyVia: ['email'] });
        } catch (error) {
            console.error('Error creating alert:', error);
        }
    };

    const handleDeleteAlert = async (id) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const navigateMonth = (direction) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;
        if (newMonth > 12) { newMonth = 1; newYear++; }
        if (newMonth < 1) { newMonth = 12; newYear--; }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const getFareColor = (level) => {
        switch (level) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'high': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
    const lowestFare = calendarData.length > 0 ? Math.min(...calendarData.map(d => d.lowestFare)) : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Fare Calendar</h1>
                    <p className="text-gray-500">Find the best dates to book flights</p>
                </div>

                {/* Route Selection */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                            <select
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="DEL">New Delhi (DEL)</option>
                                <option value="BOM">Mumbai (BOM)</option>
                                <option value="BLR">Bangalore (BLR)</option>
                                <option value="MAA">Chennai (MAA)</option>
                                <option value="CCU">Kolkata (CCU)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                            <select
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="BOM">Mumbai (BOM)</option>
                                <option value="DEL">New Delhi (DEL)</option>
                                <option value="BLR">Bangalore (BLR)</option>
                                <option value="MAA">Chennai (MAA)</option>
                                <option value="GOI">Goa (GOI)</option>
                            </select>
                        </div>
                        <div>
                            <button
                                onClick={() => setShowAlertModal(true)}
                                className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                            >
                                Set Price Alert
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={fetchCalendar}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Refresh Prices
                            </button>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-green-100 rounded"></span> Low Fare
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-yellow-100 rounded"></span> Average
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-red-100 rounded"></span> High Fare
                    </span>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold">{monthName}</h2>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 bg-gray-50 text-center text-sm font-medium text-gray-500">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-2">{day}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-7">
                            {/* Empty cells for days before first day of month */}
                            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                                <div key={`empty-${idx}`} className="p-4 border-t border-r bg-gray-50"></div>
                            ))}

                            {/* Calendar days */}
                            {calendarData.map((dayData) => (
                                <div
                                    key={dayData.day}
                                    className={`p-3 border-t border-r cursor-pointer hover:bg-gray-50 transition ${
                                        dayData.lowestFare === lowestFare ? 'ring-2 ring-green-500 ring-inset' : ''
                                    }`}
                                >
                                    <div className="text-sm text-gray-500">{dayData.day}</div>
                                    <div className={`mt-1 text-center py-1 rounded text-sm font-medium ${getFareColor(dayData.fareLevel)}`}>
                                        ₹{dayData.lowestFare.toLocaleString()}
                                    </div>
                                    {dayData.lowestFare === lowestFare && (
                                        <div className="text-xs text-green-600 text-center mt-1">Best</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Alerts */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold">Your Price Alerts</h3>
                        <button
                            onClick={() => setShowAlertModal(true)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            + Add Alert
                        </button>
                    </div>
                    {alerts.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No price alerts set. Create one to get notified when fares drop.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{alert.origin} → {alert.destination}</p>
                                        <p className="text-sm text-gray-500">
                                            Alert when fare drops below ₹{alert.targetPrice.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Current</p>
                                            <p className={`font-medium ${alert.currentPrice <= alert.targetPrice ? 'text-green-600' : 'text-gray-900'}`}>
                                                ₹{alert.currentPrice.toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteAlert(alert.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Alert Modal */}
            {showAlertModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold mb-4">Create Price Alert</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Route: {origin} → {destination}</p>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alert me when fare drops below (₹)
                            </label>
                            <input
                                type="number"
                                value={alertForm.targetPrice}
                                onChange={(e) => setAlertForm({ ...alertForm, targetPrice: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 4000"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notify via</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={alertForm.notifyVia.includes('email')}
                                        onChange={(e) => {
                                            const newNotify = e.target.checked
                                                ? [...alertForm.notifyVia, 'email']
                                                : alertForm.notifyVia.filter(n => n !== 'email');
                                            setAlertForm({ ...alertForm, notifyVia: newNotify });
                                        }}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    Email
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={alertForm.notifyVia.includes('sms')}
                                        onChange={(e) => {
                                            const newNotify = e.target.checked
                                                ? [...alertForm.notifyVia, 'sms']
                                                : alertForm.notifyVia.filter(n => n !== 'sms');
                                            setAlertForm({ ...alertForm, notifyVia: newNotify });
                                        }}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    SMS
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAlertModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAlert}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Create Alert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FareCalendar;

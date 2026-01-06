import React, { useState } from 'react';
import { Download, Calendar, Filter, BarChart3 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingReports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  const [filters, setFilters] = useState({
    status: 'all',
    agent: 'all',
  });

  const stats = {
    totalBookings: 1245,
    confirmedBookings: 1089,
    cancelledBookings: 156,
    totalRevenue: 15678900,
  };

  const bookings = [
    { id: 1, pnr: 'ABC123', agent: 'TravelMax', route: 'DEL-BOM', date: '2024-01-15', amount: 12500, status: 'CONFIRMED' },
    { id: 2, pnr: 'DEF456', agent: 'FlightBook', route: 'BLR-DEL', date: '2024-01-15', amount: 8900, status: 'CONFIRMED' },
    { id: 3, pnr: 'GHI789', agent: 'TravelMax', route: 'MAA-HYD', date: '2024-01-14', amount: 5600, status: 'CANCELLED' },
    { id: 4, pnr: 'JKL012', agent: 'SkyWays', route: 'DEL-CCU', date: '2024-01-14', amount: 9800, status: 'CONFIRMED' },
  ];

  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Reports</h1>
          <p className="text-gray-500">View and analyze booking data</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <DatePicker
              selected={dateRange.startDate}
              onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              dateFormat="dd MMM yyyy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <DatePicker
              selected={dateRange.endDate}
              onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              dateFormat="dd MMM yyyy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Bookings</p>
          <p className="text-2xl font-bold mt-1">{stats.totalBookings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.confirmedBookings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Cancelled</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelledBookings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">PNR</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{booking.pnr}</td>
                  <td className="px-6 py-4">{booking.agent}</td>
                  <td className="px-6 py-4">{booking.route}</td>
                  <td className="px-6 py-4 text-gray-500">{booking.date}</td>
                  <td className="px-6 py-4 font-medium">₹{booking.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingReports;

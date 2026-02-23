import React, { useState } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RevenueReports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  const stats = {
    totalRevenue: 15678900,
    commission: 784500,
    growth: 12.5,
    avgBookingValue: 12580,
  };

  const agentRevenue = [
    { agent: 'TravelMax India', bookings: 234, revenue: 2956000, commission: 147800 },
    { agent: 'FlightDeals Pro', bookings: 189, revenue: 2345000, commission: 117250 },
    { agent: 'SkyWays Travel', bookings: 156, revenue: 1890000, commission: 94500 },
    { agent: 'BookMyTrip', bookings: 134, revenue: 1678000, commission: 83900 },
    { agent: 'GlobalFlights', bookings: 98, revenue: 1234000, commission: 61700 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Reports</h1>
          <p className="text-gray-500">Analyze revenue and commission data</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-4">
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
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Commission</p>
              <p className="text-2xl font-bold text-green-600 mt-1">₹{(stats.commission / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Growth</p>
              <p className="text-2xl font-bold text-green-600 mt-1">+{stats.growth}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Booking Value</p>
              <p className="text-2xl font-bold mt-1">₹{stats.avgBookingValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Agent */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Revenue by Agent</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Bookings</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agentRevenue.map((agent, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{agent.agent}</td>
                  <td className="px-6 py-4">{agent.bookings}</td>
                  <td className="px-6 py-4 font-medium">₹{(agent.revenue / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-green-600">₹{(agent.commission / 1000).toFixed(0)}K</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(agent.revenue / stats.totalRevenue) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {((agent.revenue / stats.totalRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
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

export default RevenueReports;

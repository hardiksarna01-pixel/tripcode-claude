import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { bookingAPI } from '../../services/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingAPI.getBookings();
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.pnr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passengerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      CONFIRMED: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      CANCELLED: 'bg-red-100 text-red-700',
      TICKETED: 'bg-blue-100 text-blue-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500">View and manage all your bookings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by PNR or passenger name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="TICKETED">Ticketed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found</p>
            <Link to="/flights" className="text-blue-600 hover:underline mt-2 inline-block">
              Search for flights
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">PNR</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Passenger</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Travel Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{booking.pnr}</td>
                    <td className="px-6 py-4">{booking.passengerName}</td>
                    <td className="px-6 py-4">
                      {booking.origin} → {booking.destination}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{booking.travelDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{booking.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;

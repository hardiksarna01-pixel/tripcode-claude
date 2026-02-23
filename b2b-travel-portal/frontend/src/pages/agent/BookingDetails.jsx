import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI } from '../../services/api';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingAPI.getBooking(id);
        setBooking(response.data.booking || response.data);
      } catch (error) {
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancelBooking(id, 'User requested cancellation');
      toast.success('Booking cancelled successfully');
      setBooking({ ...booking, status: 'CANCELLED' });
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Booking not found</p>
        <Link to="/bookings" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/bookings" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking #{booking.pnr}</h1>
            <p className="text-gray-500">View booking details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            Print
          </button>
          {booking.status !== 'CANCELLED' && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Flight Details</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{booking.departureTime}</p>
                <p className="text-gray-500">{booking.origin}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">{booking.duration}</p>
                <div className="w-32 h-px bg-gray-300 my-2"></div>
                <p className="text-sm text-gray-400">
                  {booking.stops === 0 ? 'Non-stop' : `${booking.stops} stop`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{booking.arrivalTime}</p>
                <p className="text-gray-500">{booking.destination}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-gray-500">
                <span className="font-medium">Airline:</span> {booking.airline}
              </p>
              <p className="text-gray-500">
                <span className="font-medium">Flight:</span> {booking.flightNumber}
              </p>
              <p className="text-gray-500">
                <span className="font-medium">Date:</span> {booking.travelDate}
              </p>
            </div>
          </div>

          {/* Passengers */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Passengers</h2>
            <div className="space-y-3">
              {(booking.passengers || [{ name: booking.passengerName, type: 'Adult' }]).map((passenger, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{passenger.name}</p>
                    <p className="text-sm text-gray-500">{passenger.type}</p>
                  </div>
                  <span className="text-sm text-gray-500">Seat: {passenger.seat || 'TBA'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Booking Status</h2>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {booking.status}
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="text-gray-500">PNR:</span> <span className="font-medium">{booking.pnr}</span></p>
              <p><span className="text-gray-500">Booked on:</span> {booking.createdAt || 'N/A'}</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Base Fare</span>
                <span>₹{(booking.amount * 0.85)?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taxes & Fees</span>
                <span>₹{(booking.amount * 0.15)?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{booking.amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;

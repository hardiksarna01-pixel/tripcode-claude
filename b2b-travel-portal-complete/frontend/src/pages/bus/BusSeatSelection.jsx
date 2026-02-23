import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    UserIcon,
    XMarkIcon,
    CheckIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const BusSeatSelection = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [bus] = useState(location.state?.bus || null);
    const [searchParams] = useState(location.state?.searchParams || {});
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [boardingPoint, setBoardingPoint] = useState('');
    const [droppingPoint, setDroppingPoint] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock seat layout
    const lowerDeck = [
        [
            { id: 'L1', type: 'sleeper', status: 'available', price: 1299 },
            { id: 'L2', type: 'sleeper', status: 'booked', price: 1299 },
            { id: 'L3', type: 'sleeper', status: 'available', price: 1299 },
            { id: 'L4', type: 'sleeper', status: 'available', price: 1299 },
            { id: 'L5', type: 'sleeper', status: 'ladies', price: 1299 },
            { id: 'L6', type: 'sleeper', status: 'available', price: 1299 }
        ],
        [
            { id: 'L7', type: 'sleeper', status: 'available', price: 1299 },
            { id: 'L8', type: 'sleeper', status: 'available', price: 1299 },
            { id: 'L9', type: 'sleeper', status: 'booked', price: 1299 },
            { id: 'L10', type: 'sleeper', status: 'booked', price: 1299 },
            { id: 'L11', type: 'sleeper', status: 'available', price: 1299 },
            { id: 'L12', type: 'sleeper', status: 'available', price: 1299 }
        ]
    ];

    const upperDeck = [
        [
            { id: 'U1', type: 'sleeper', status: 'available', price: 1199 },
            { id: 'U2', type: 'sleeper', status: 'available', price: 1199 },
            { id: 'U3', type: 'sleeper', status: 'booked', price: 1199 },
            { id: 'U4', type: 'sleeper', status: 'available', price: 1199 },
            { id: 'U5', type: 'sleeper', status: 'available', price: 1199 },
            { id: 'U6', type: 'sleeper', status: 'ladies', price: 1199 }
        ],
        [
            { id: 'U7', type: 'sleeper', status: 'available', price: 1199 },
            { id: 'U8', type: 'sleeper', status: 'booked', price: 1199 },
            { id: 'U9', type: 'sleeper', status: 'available', price: 1199 },
            { id: 'U10', type: 'sleeper', status: 'available', price: 1199 },
            { id: 'U11', type: 'sleeper', status: 'booked', price: 1199 },
            { id: 'U12', type: 'sleeper', status: 'available', price: 1199 }
        ]
    ];

    const toggleSeat = (seat) => {
        if (seat.status === 'booked') return;

        if (selectedSeats.find(s => s.id === seat.id)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            if (selectedSeats.length < (searchParams.passengers || 6)) {
                setSelectedSeats([...selectedSeats, seat]);
            }
        }
    };

    const getSeatColor = (seat) => {
        if (selectedSeats.find(s => s.id === seat.id)) {
            return 'bg-orange-500 text-white border-orange-500';
        }
        switch (seat.status) {
            case 'booked':
                return 'bg-gray-300 text-gray-500 cursor-not-allowed';
            case 'ladies':
                return 'bg-pink-100 border-pink-400 text-pink-600 hover:bg-pink-200';
            default:
                return 'bg-green-50 border-green-400 text-green-600 hover:bg-green-100';
        }
    };

    const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }
        if (!boardingPoint) {
            alert('Please select a boarding point');
            return;
        }
        if (!droppingPoint) {
            alert('Please select a dropping point');
            return;
        }

        navigate('/bus/booking', {
            state: {
                bus,
                searchParams,
                selectedSeats,
                boardingPoint,
                droppingPoint,
                totalAmount
            }
        });
    };

    if (!bus) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Bus not found</h2>
                    <button
                        onClick={() => navigate('/bus')}
                        className="text-orange-600 hover:underline"
                    >
                        Go back to search
                    </button>
                </div>
            </div>
        );
    }

    const renderSeatLayout = (deck, deckName) => (
        <div className="mb-6">
            <h4 className="font-medium mb-3 text-sm text-gray-600">{deckName}</h4>
            <div className="space-y-2">
                {deck.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2 justify-center">
                        {row.map((seat) => (
                            <button
                                key={seat.id}
                                onClick={() => toggleSeat(seat)}
                                disabled={seat.status === 'booked'}
                                className={`w-14 h-24 rounded-lg border-2 flex flex-col items-center justify-center transition ${getSeatColor(seat)}`}
                            >
                                <span className="text-xs font-medium">{seat.id}</span>
                                <span className="text-xs">₹{seat.price}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-xl font-bold">{bus.operator}</h1>
                    <p className="text-sm text-gray-600">
                        {bus.from} → {bus.to} • {searchParams.departDate} • {bus.departureTime}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Seat Layout */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Select Your Seats</h3>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-green-50 border-2 border-green-400 rounded" />
                                    <span className="text-sm">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-300 rounded" />
                                    <span className="text-sm">Booked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-orange-500 rounded" />
                                    <span className="text-sm">Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-pink-100 border-2 border-pink-400 rounded" />
                                    <span className="text-sm">Ladies</span>
                                </div>
                            </div>

                            {/* Bus Layout */}
                            <div className="relative">
                                {/* Driver Area */}
                                <div className="absolute right-0 top-0 bg-gray-200 w-16 h-16 rounded-lg flex items-center justify-center">
                                    <span className="text-xs text-gray-500">Driver</span>
                                </div>

                                <div className="pt-20">
                                    {renderSeatLayout(lowerDeck, 'Lower Deck')}
                                    {renderSeatLayout(upperDeck, 'Upper Deck')}
                                </div>
                            </div>

                            {/* Boarding & Dropping Points */}
                            <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Boarding Point *
                                    </label>
                                    <select
                                        value={boardingPoint}
                                        onChange={(e) => setBoardingPoint(e.target.value)}
                                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value="">Select boarding point</option>
                                        {bus.boardingPoints?.map((point, i) => (
                                            <option key={i} value={point.name}>
                                                {point.time} - {point.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dropping Point *
                                    </label>
                                    <select
                                        value={droppingPoint}
                                        onChange={(e) => setDroppingPoint(e.target.value)}
                                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value="">Select dropping point</option>
                                        {bus.droppingPoints?.map((point, i) => (
                                            <option key={i} value={point.name}>
                                                {point.time} - {point.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                            <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

                            {/* Bus Details */}
                            <div className="border-b pb-4 mb-4">
                                <div className="font-medium">{bus.operator}</div>
                                <div className="text-sm text-gray-600">{bus.busType}</div>
                                <div className="text-sm text-gray-600 mt-2">
                                    {bus.departureTime} - {bus.arrivalTime}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {bus.from} → {bus.to}
                                </div>
                            </div>

                            {/* Selected Seats */}
                            <div className="border-b pb-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Selected Seats</span>
                                    <span className="text-sm text-gray-600">{selectedSeats.length} seat(s)</span>
                                </div>
                                {selectedSeats.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSeats.map(seat => (
                                            <span
                                                key={seat.id}
                                                className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                                            >
                                                {seat.id}
                                                <button
                                                    onClick={() => toggleSeat(seat)}
                                                    className="hover:text-orange-800"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No seats selected</p>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            {selectedSeats.length > 0 && (
                                <div className="border-b pb-4 mb-4 space-y-2">
                                    {selectedSeats.map(seat => (
                                        <div key={seat.id} className="flex justify-between text-sm">
                                            <span>Seat {seat.id}</span>
                                            <span>₹{seat.price.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Total */}
                            <div className="flex justify-between font-semibold text-lg mb-4">
                                <span>Total Amount</span>
                                <span>₹{totalAmount.toLocaleString()}</span>
                            </div>

                            {/* Continue Button */}
                            <button
                                onClick={handleContinue}
                                disabled={selectedSeats.length === 0}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue to Passenger Details
                            </button>

                            {/* Info */}
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-start gap-2 text-sm text-blue-700">
                                    <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{bus.cancellationPolicy}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusSeatSelection;

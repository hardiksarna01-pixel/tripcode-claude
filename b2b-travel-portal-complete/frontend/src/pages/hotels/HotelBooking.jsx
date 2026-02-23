import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    StarIcon,
    MapPinIcon,
    CheckCircleIcon,
    UserIcon,
    CalendarIcon,
    CreditCardIcon,
    ShieldCheckIcon,
    InformationCircleIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';

const HotelBooking = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(location.state?.hotel || null);
    const [selectedRoom, setSelectedRoom] = useState(location.state?.selectedRoom || null);
    const [searchParams] = useState(location.state?.searchParams || {});
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Guest Details, 2: Review, 3: Payment
    const [guestDetails, setGuestDetails] = useState([
        { title: 'Mr', firstName: '', lastName: '', email: '', phone: '', isPrimary: true }
    ]);
    const [specialRequests, setSpecialRequests] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('pay_now');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        if (!hotel) {
            fetchHotelDetails();
        }
    }, [id]);

    const fetchHotelDetails = async () => {
        try {
            const response = await api.get(`/hotels/${id}`);
            setHotel(response.data.hotel);
        } catch (error) {
            console.error('Error fetching hotel:', error);
        }
    };

    const calculateNights = () => {
        if (!searchParams.checkIn || !searchParams.checkOut) return 1;
        const checkIn = new Date(searchParams.checkIn);
        const checkOut = new Date(searchParams.checkOut);
        return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    };

    const nights = calculateNights();
    const roomPrice = selectedRoom?.price || hotel?.price || 0;
    const totalRoomPrice = roomPrice * nights * (searchParams.rooms || 1);
    const taxes = Math.round(totalRoomPrice * 0.18);
    const discount = appliedCoupon ? Math.round(totalRoomPrice * (appliedCoupon.discount / 100)) : 0;
    const totalAmount = totalRoomPrice + taxes - discount;

    const handleGuestChange = (index, field, value) => {
        const newGuests = [...guestDetails];
        newGuests[index][field] = value;
        setGuestDetails(newGuests);
    };

    const addGuest = () => {
        setGuestDetails([
            ...guestDetails,
            { title: 'Mr', firstName: '', lastName: '', email: '', phone: '', isPrimary: false }
        ]);
    };

    const removeGuest = (index) => {
        if (guestDetails.length > 1 && !guestDetails[index].isPrimary) {
            setGuestDetails(guestDetails.filter((_, i) => i !== index));
        }
    };

    const applyCoupon = async () => {
        try {
            const response = await api.post('/coupons/validate', {
                code: couponCode,
                amount: totalRoomPrice,
                type: 'hotel'
            });
            if (response.data.valid) {
                setAppliedCoupon(response.data.coupon);
            }
        } catch (error) {
            // Mock coupon for demo
            if (couponCode.toUpperCase() === 'HOTEL10') {
                setAppliedCoupon({ code: 'HOTEL10', discount: 10 });
            } else {
                alert('Invalid coupon code');
            }
        }
    };

    const handleBooking = async () => {
        setLoading(true);
        try {
            const bookingData = {
                hotelId: hotel.id,
                roomId: selectedRoom?.id,
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
                rooms: searchParams.rooms,
                guests: guestDetails,
                specialRequests,
                paymentMethod,
                totalAmount,
                couponCode: appliedCoupon?.code
            };

            const response = await api.post('/bookings/hotel', bookingData);

            if (paymentMethod === 'pay_now') {
                // Redirect to payment
                navigate('/payment', {
                    state: {
                        booking: response.data.booking,
                        amount: totalAmount,
                        type: 'hotel'
                    }
                });
            } else {
                // Pay at hotel - direct confirmation
                navigate('/booking-confirmation', {
                    state: { booking: response.data.booking }
                });
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (count) => (
        <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
                <StarSolidIcon
                    key={i}
                    className={`w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Progress Steps */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-4">
                        {[
                            { num: 1, label: 'Guest Details' },
                            { num: 2, label: 'Review' },
                            { num: 3, label: 'Payment' }
                        ].map((s, index) => (
                            <React.Fragment key={s.num}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                        step >= s.num
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {step > s.num ? <CheckCircleIcon className="w-5 h-5" /> : s.num}
                                    </div>
                                    <span className={`text-sm ${step >= s.num ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {index < 2 && (
                                    <div className={`w-24 h-0.5 ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hotel Summary */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex gap-4">
                                <div className="w-32 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">{hotel.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {renderStars(hotel.starRating)}
                                    </div>
                                    <h2 className="text-xl font-semibold">{hotel.name}</h2>
                                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                        <MapPinIcon className="w-4 h-4" />
                                        {hotel.location}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                                <div>
                                    <div className="text-xs text-gray-500">Check-in</div>
                                    <div className="font-medium">{searchParams.checkIn}</div>
                                    <div className="text-xs text-gray-500">2:00 PM</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Check-out</div>
                                    <div className="font-medium">{searchParams.checkOut}</div>
                                    <div className="text-xs text-gray-500">12:00 PM</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Duration</div>
                                    <div className="font-medium">{nights} Night(s)</div>
                                    <div className="text-xs text-gray-500">{searchParams.rooms} Room(s)</div>
                                </div>
                            </div>
                        </div>

                        {/* Step 1: Guest Details */}
                        {step === 1 && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <UserIcon className="w-5 h-5" />
                                    Guest Details
                                </h3>

                                {guestDetails.map((guest, index) => (
                                    <div key={index} className="border rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium">
                                                Guest {index + 1} {guest.isPrimary && '(Primary)'}
                                            </h4>
                                            {!guest.isPrimary && (
                                                <button
                                                    onClick={() => removeGuest(index)}
                                                    className="text-red-500 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Title</label>
                                                <select
                                                    value={guest.title}
                                                    onChange={(e) => handleGuestChange(index, 'title', e.target.value)}
                                                    className="w-full border rounded-lg px-3 py-2"
                                                >
                                                    <option value="Mr">Mr</option>
                                                    <option value="Mrs">Mrs</option>
                                                    <option value="Ms">Ms</option>
                                                    <option value="Dr">Dr</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">First Name *</label>
                                                <input
                                                    type="text"
                                                    value={guest.firstName}
                                                    onChange={(e) => handleGuestChange(index, 'firstName', e.target.value)}
                                                    className="w-full border rounded-lg px-3 py-2"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Last Name *</label>
                                                <input
                                                    type="text"
                                                    value={guest.lastName}
                                                    onChange={(e) => handleGuestChange(index, 'lastName', e.target.value)}
                                                    className="w-full border rounded-lg px-3 py-2"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {guest.isPrimary && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Email *</label>
                                                    <input
                                                        type="email"
                                                        value={guest.email}
                                                        onChange={(e) => handleGuestChange(index, 'email', e.target.value)}
                                                        className="w-full border rounded-lg px-3 py-2"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-600 mb-1">Phone *</label>
                                                    <input
                                                        type="tel"
                                                        value={guest.phone}
                                                        onChange={(e) => handleGuestChange(index, 'phone', e.target.value)}
                                                        className="w-full border rounded-lg px-3 py-2"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={addGuest}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    + Add Another Guest
                                </button>

                                {/* Special Requests */}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        value={specialRequests}
                                        onChange={(e) => setSpecialRequests(e.target.value)}
                                        rows={3}
                                        placeholder="E.g., high floor, late check-in, extra bed..."
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Special requests are subject to availability and may incur additional charges.
                                    </p>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                                    >
                                        Continue to Review
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Review */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold mb-4">Review Your Booking</h3>

                                    <div className="space-y-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-medium mb-2">Guest Information</h4>
                                            {guestDetails.map((guest, index) => (
                                                <div key={index} className="text-sm text-gray-600">
                                                    {guest.title} {guest.firstName} {guest.lastName}
                                                    {guest.isPrimary && ` • ${guest.email} • ${guest.phone}`}
                                                </div>
                                            ))}
                                        </div>

                                        {selectedRoom && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium mb-2">Room Details</h4>
                                                <p className="text-sm text-gray-600">{selectedRoom.name}</p>
                                                <p className="text-sm text-gray-600">{selectedRoom.bedType}</p>
                                            </div>
                                        )}

                                        {specialRequests && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium mb-2">Special Requests</h4>
                                                <p className="text-sm text-gray-600">{specialRequests}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-between">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-gray-600 hover:text-gray-800"
                                        >
                                            Back to Guest Details
                                        </button>
                                        <button
                                            onClick={() => setStep(3)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <CreditCardIcon className="w-5 h-5" />
                                    Payment Options
                                </h3>

                                <div className="space-y-4">
                                    <label className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="pay_now"
                                            checked={paymentMethod === 'pay_now'}
                                            onChange={() => setPaymentMethod('pay_now')}
                                            className="mt-1"
                                        />
                                        <div>
                                            <div className="font-medium">Pay Now</div>
                                            <div className="text-sm text-gray-600">
                                                Pay the full amount now and secure your booking instantly
                                            </div>
                                            <div className="text-sm text-green-600 mt-1">
                                                Get additional 5% discount on online payment
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="pay_at_hotel"
                                            checked={paymentMethod === 'pay_at_hotel'}
                                            onChange={() => setPaymentMethod('pay_at_hotel')}
                                            className="mt-1"
                                        />
                                        <div>
                                            <div className="font-medium">Pay at Hotel</div>
                                            <div className="text-sm text-gray-600">
                                                Reserve now and pay directly at the hotel during check-in
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="partial"
                                            checked={paymentMethod === 'partial'}
                                            onChange={() => setPaymentMethod('partial')}
                                            className="mt-1"
                                        />
                                        <div>
                                            <div className="font-medium">Pay Partial Amount</div>
                                            <div className="text-sm text-gray-600">
                                                Pay 30% now and the rest at the hotel
                                            </div>
                                            <div className="text-sm text-blue-600 mt-1">
                                                Pay ₹{Math.round(totalAmount * 0.3).toLocaleString()} now
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <div className="font-medium text-blue-900">Secure Booking</div>
                                            <div className="text-sm text-blue-700">
                                                Your payment information is encrypted and secure. We never store your card details.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        Back to Review
                                    </button>
                                    <button
                                        onClick={handleBooking}
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {paymentMethod === 'pay_now' ? 'Proceed to Pay' : 'Confirm Booking'}
                                                <span>₹{totalAmount.toLocaleString()}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pricing Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                            <h3 className="text-lg font-semibold mb-4">Price Summary</h3>

                            {/* Room Selection Summary */}
                            <div className="border-b pb-4 mb-4">
                                <div className="text-sm text-gray-600 mb-2">
                                    {selectedRoom?.name || 'Standard Room'}
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Room Price × {nights} Night(s)</span>
                                    <span>₹{(roomPrice * nights).toLocaleString()}</span>
                                </div>
                                {(searchParams.rooms || 1) > 1 && (
                                    <div className="flex justify-between text-sm mt-1">
                                        <span>× {searchParams.rooms} Room(s)</span>
                                        <span>₹{totalRoomPrice.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Coupon */}
                            <div className="border-b pb-4 mb-4">
                                <label className="text-sm font-medium text-gray-700">Have a coupon?</label>
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                        disabled={appliedCoupon}
                                    />
                                    {appliedCoupon ? (
                                        <button
                                            onClick={() => {
                                                setAppliedCoupon(null);
                                                setCouponCode('');
                                            }}
                                            className="text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            onClick={applyCoupon}
                                            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Apply
                                        </button>
                                    )}
                                </div>
                                {appliedCoupon && (
                                    <div className="text-green-600 text-sm mt-2">
                                        Coupon {appliedCoupon.code} applied! {appliedCoupon.discount}% off
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Room Charges</span>
                                    <span>₹{totalRoomPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes & Fees (18%)</span>
                                    <span>₹{taxes.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-₹{discount.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t mt-4 pt-4">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total Amount</span>
                                    <span>₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Policies */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-start gap-2 text-sm">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Free cancellation before {searchParams.checkIn}</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                    <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <span>Confirmation within 5 minutes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelBooking;

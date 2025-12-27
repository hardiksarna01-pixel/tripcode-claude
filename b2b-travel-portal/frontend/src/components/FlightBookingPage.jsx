import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Flight Booking Details Component - Matches Flyshop UI
const FlightBookingPage = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  
  // Sample data based on your screenshots
  const bookingData = {
    onwardJourney: {
      baggage: { checkIn: '15 KG', handBaggage: '7 KG' },
      refundable: 'Partially Refundable',
      segments: [
        {
          airline: { code: '6E', name: 'Indigo', flightNumber: '6474', class: 'J(MAIN)' },
          departure: { time: '16:55', airport: 'NEW DELHI', code: 'DEL', date: 'Sun, 21 Dec 2025' },
          arrival: { time: '18:45', airport: 'AURANGABAD', code: 'IXU', date: 'Sun, 21 Dec 2025' },
          duration: '01:50'
        },
        {
          layover: { airport: 'Aurangabad (IXU)-IXU', duration: '02hrs, 30mins' }
        },
        {
          airline: { code: '6E', name: 'Indigo', flightNumber: '5383', class: 'J(MAIN)' },
          departure: { time: '21:15', airport: 'AURANGABAD', code: 'IXU', date: 'Sun, 21 Dec 2025' },
          arrival: { time: '22:10', airport: 'MUMBAI', code: 'BOM', date: 'Sun, 21 Dec 2025' },
          duration: '00:55'
        }
      ]
    },
    returnJourney: {
      baggage: { checkIn: '15 KG', handBaggage: '7 KG' },
      refundable: 'Non Refundable',
      segments: [
        {
          airline: { code: '6E', name: 'IndiGo', flightNumber: '651', class: 'G1(OFF_PNR-G1)' },
          departure: { time: '22:15', airport: 'Mumbai', code: 'BOM', date: 'Fri, 26 Dec 2025' },
          arrival: { time: '00:30', airport: 'Delhi', code: 'DEL', date: 'Sat, 27 Dec 2025' },
          duration: '02:15'
        }
      ]
    },
    fareSummary: {
      baseFare: 12922.00,
      otherTaxes: 1364.77,
      commission: 196.36,
      gstOnCommission: 0.00,
      tdsOnCommission: 3.93,
      netFare: 14094.34,
      totalFare: 14287
    },
    notices: [
      'Seats are subject to availability, In case of non-availability of the seats, We will refund the full amount.',
      'This exclusive Fare is 100% Non-Refundable, Non-Changeable & Non-Cancellable.',
      'You will be able check the status of your PNR on airline website or call center but names will be update 12 to 24 hrs prior to the flight departure.',
      'Web check-in is mandatory to board flights.'
    ]
  };

  // Handle booking completion and navigate to ticket confirmation
  const handleBookingComplete = async () => {
    setIsBooking(true);

    try {
      // Simulate API call for booking
      // const response = await bookingApi.createBooking(bookingData);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a booking reference
      const bookingRef = `TC${Date.now().toString().slice(-10)}`;

      // Navigate to ticket confirmation page
      navigate(`/ticket/${bookingRef}`);

    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-10" />
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="flex items-center space-x-1 bg-blue-600 px-4 py-2 rounded">
                <span>✈️</span><span>FLIGHT</span>
              </a>
              <a href="#" className="flex items-center space-x-1 hover:bg-green-500 px-4 py-2 rounded">
                <span>🏨</span><span>HOTEL</span>
              </a>
              <a href="#" className="flex items-center space-x-1 hover:bg-green-500 px-4 py-2 rounded">
                <span>🚌</span><span>BUS</span>
              </a>
              <a href="#" className="flex items-center space-x-1 hover:bg-green-500 px-4 py-2 rounded">
                <span>🏝️</span><span>HOLIDAYS</span>
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold">
              💰 ₹ 684.40
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <span>Hardik Sarna</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Column - Flight Details */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">✈️</span> FLIGHT DETAILS
                </h2>
                <button className="text-blue-600 hover:underline">Change Flight</button>
              </div>

              {/* Onward Journey */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <span className="mr-2">↗️</span> Onward Journey
                  </h3>
                  <div className="text-right">
                    <span className="text-green-600 font-medium">{bookingData.onwardJourney.refundable}</span>
                    <button className="text-blue-600 hover:underline ml-4 text-sm">Fare Rules</button>
                  </div>
                </div>
                
                {/* Baggage Info */}
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-4">
                  🧳 {bookingData.onwardJourney.baggage.checkIn} / {bookingData.onwardJourney.baggage.handBaggage}
                </div>

                {/* Flight Segments */}
                {bookingData.onwardJourney.segments.map((segment, index) => (
                  <div key={index}>
                    {segment.layover ? (
                      <div className="bg-gray-100 text-center py-2 my-4 rounded text-sm text-gray-600">
                        Layover at {segment.layover.airport}<br />
                        Layover Time: {segment.layover.duration}
                      </div>
                    ) : (
                      <FlightSegment segment={segment} />
                    )}
                  </div>
                ))}
              </div>

              {/* Return Journey */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <span className="mr-2">↙️</span> Return Journey
                  </h3>
                  <div className="text-right">
                    <span className="text-red-600 font-medium">{bookingData.returnJourney.refundable}</span>
                    <button className="text-blue-600 hover:underline ml-4 text-sm">Fare Rules</button>
                  </div>
                </div>

                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-4">
                  🧳 {bookingData.returnJourney.baggage.checkIn} / {bookingData.returnJourney.baggage.handBaggage}
                </div>

                {bookingData.returnJourney.segments.map((segment, index) => (
                  <FlightSegment key={index} segment={segment} />
                ))}
              </div>

              {/* Notices */}
              <div className="mt-6 space-y-2">
                {bookingData.notices.map((notice, index) => (
                  <div key={index} className="flex items-start text-sm text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {notice}
                  </div>
                ))}
              </div>
            </div>

            {/* Passenger Contact Information */}
            <PassengerContactForm />

            {/* Traveller Details */}
            <TravellerDetailsForm
              onBookingComplete={handleBookingComplete}
              isBooking={isBooking}
            />

            {/* Payment Mode */}
            <PaymentModeSection />
          </div>

          {/* Right Column - Fare Summary */}
          <div className="w-80">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">FARE SUMMARY</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>₹ {bookingData.fareSummary.baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Taxes</span>
                  <span>₹ {bookingData.fareSummary.otherTaxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>(-) Commission</span>
                  <span>₹ {bookingData.fareSummary.commission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>(+) GST On Commission</span>
                  <span>₹ {bookingData.fareSummary.gstOnCommission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>(+) TDS On Commission</span>
                  <span>₹ {bookingData.fareSummary.tdsOnCommission.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-green-600">
                    <span>Net Fare</span>
                    <span>₹ {bookingData.fareSummary.netFare.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Fare</span>
                  <span>₹ {bookingData.fareSummary.totalFare}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6 bg-teal-500 text-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">HAVE A PROMOCODE ?</h4>
                <div className="flex">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-l text-black"
                    placeholder="Enter code"
                  />
                  <button className="bg-teal-600 px-4 py-2 rounded-r hover:bg-teal-700">
                    APPLY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Flight Segment Component
const FlightSegment = ({ segment }) => (
  <div className="flex items-center py-4">
    <div className="w-20 text-center">
      <div className="w-12 h-12 bg-blue-600 rounded mx-auto mb-1 flex items-center justify-center text-white font-bold text-xs">
        {segment.airline.code}
      </div>
      <div className="text-xs text-gray-600">{segment.airline.name}</div>
      <div className="text-xs text-gray-500">{segment.airline.code} - {segment.airline.flightNumber}</div>
      <div className="text-xs text-gray-500">{segment.airline.class}</div>
    </div>
    
    <div className="flex-1 flex items-center justify-between px-6">
      <div className="text-center">
        <div className="text-2xl font-bold">{segment.departure.time}</div>
        <div className="text-sm font-medium">{segment.departure.airport} - {segment.departure.code}</div>
        <div className="text-xs text-gray-500">{segment.departure.date}</div>
      </div>
      
      <div className="flex-1 px-6">
        <div className="text-center text-sm text-gray-500 mb-1">{segment.duration}</div>
        <div className="relative">
          <div className="h-0.5 bg-gray-300 w-full"></div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold">{segment.arrival.time}</div>
        <div className="text-sm font-medium">{segment.arrival.airport} - {segment.arrival.code}</div>
        <div className="text-xs text-gray-500">{segment.arrival.date}</div>
      </div>
    </div>
  </div>
);

// Passenger Contact Form
const PassengerContactForm = () => (
  <div className="bg-white rounded-lg shadow-md p-6 mt-6">
    <h3 className="text-lg font-semibold mb-4">
      Passenger Contact Information
      <span className="text-sm font-normal text-gray-500 ml-2">
        (Your ticket and flight info will be sent here)
      </span>
    </h3>
    
    <div className="flex items-center mb-4">
      <input type="checkbox" id="fillDetails" className="mr-2" />
      <label htmlFor="fillDetails">Fill My Details</label>
    </div>
    
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">Mobile Number *</label>
        <div className="flex">
          <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l">+ 91</span>
          <input
            type="text"
            className="flex-1 border rounded-r px-3 py-2"
            placeholder="Mobile Number"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email ID *</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="Email ID"
        />
      </div>
    </div>
  </div>
);

// Traveller Details Form
const TravellerDetailsForm = ({ onBookingComplete, isBooking }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mt-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <span className="mr-2">👥</span> TRAVELLER DETAILS
    </h3>
    
    <p className="text-sm text-gray-500 mb-4">
      Enter traveller details (Name must be entered as shown on Passport/ID Proof)
    </p>
    
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-4">Adult 1</h4>
      
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <select className="w-full border rounded px-3 py-2">
            <option>Select</option>
            <option>Mr</option>
            <option>Mrs</option>
            <option>Ms</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input type="text" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input type="text" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input type="date" className="w-full border rounded px-3 py-2" />
        </div>
      </div>
    </div>
    
    {/* Additional Services */}
    <div className="mt-6">
      <h4 className="font-medium mb-4">Additional Services</h4>
      <div className="flex flex-wrap gap-3">
        {['WHEELCHAIR', 'SEAT', 'FREQUENT FLYER', 'FASTFORWARD', 'MEALS', 'ADDITIONALBAGGAGE', 'BAGGAGE', 'SPORTS'].map((service) => (
          <button
            key={service}
            className={`px-4 py-2 rounded-full border text-sm ${
              service === 'BAGGAGE' ? 'bg-red-100 border-red-300 text-red-600' : 'bg-gray-100'
            }`}
          >
            {service}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">NEW DELHI - MUMBAI</label>
        <div className="border rounded p-3">
          <label className="block text-sm mb-1">Adult 1</label>
          <select className="w-full border rounded px-3 py-2">
            <option>Select BAGGAGE</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          Apply GST for this booking
        </label>
      </div>
    </div>
    
    <button
      onClick={onBookingComplete}
      disabled={isBooking}
      className="w-full bg-teal-500 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isBooking ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing Booking...
        </span>
      ) : 'BOOK & PAY NOW'}
    </button>
  </div>
);

// Payment Mode Section
const PaymentModeSection = () => (
  <div className="bg-white rounded-lg shadow-md p-6 mt-6">
    <h3 className="text-lg font-semibold flex items-center">
      <span className="mr-2">💳</span> PAYMENT MODE
    </h3>
  </div>
);

export default FlightBookingPage;

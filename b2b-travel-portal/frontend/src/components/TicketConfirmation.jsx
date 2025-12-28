import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

/**
 * Ticket Confirmation Component
 * Displays ticket details with options to:
 * - Add custom markup
 * - Hide fare details
 * - Hide agent details
 * - Save/Print as PDF
 */
const TicketConfirmation = () => {
    const { bookingRef } = useParams();
    const navigate = useNavigate();
    const { agent } = useAuthStore();
    const printRef = useRef(null);

    // Booking data
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Customization options
    const [customization, setCustomization] = useState({
        // Markup settings
        markupType: 'FLAT', // FLAT or PERCENTAGE
        markupValue: 0,

        // Visibility settings
        showFare: true,
        showFareBreakdown: true,
        showAgentDetails: true,
        showAgentContact: true,
        showAgentLogo: true,
        showCommission: false,

        // Custom text
        customHeader: '',
        customFooter: '',
        showTerms: true,
    });

    // Calculated values
    const [displayFare, setDisplayFare] = useState({
        baseFare: 0,
        taxes: 0,
        markup: 0,
        total: 0
    });

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingRef]);

    useEffect(() => {
        calculateDisplayFare();
    }, [booking, customization.markupType, customization.markupValue]);

    const fetchBookingDetails = async () => {
        setLoading(true);
        try {
            // const response = await bookingApi.getDetails(bookingRef);
            // setBooking(response.data);

            // Mock data for demonstration
            setTimeout(() => {
                setBooking({
                    bookingRefNo: bookingRef || 'TC2024122700001',
                    pnr: 'ABC123',
                    airlinePnr: '6E-XYZ789',
                    status: 'TICKETED',
                    bookingDate: '2024-12-27T10:30:00',

                    // Flight Details
                    flights: [
                        {
                            flightNumber: '6E 2341',
                            airline: 'IndiGo',
                            airlineCode: '6E',
                            aircraft: 'Airbus A320',
                            departure: {
                                airport: 'Indira Gandhi International Airport',
                                city: 'New Delhi',
                                code: 'DEL',
                                terminal: 'T1',
                                date: '2024-12-30',
                                time: '06:30'
                            },
                            arrival: {
                                airport: 'Chhatrapati Shivaji International Airport',
                                city: 'Mumbai',
                                code: 'BOM',
                                terminal: 'T2',
                                date: '2024-12-30',
                                time: '08:45'
                            },
                            duration: '2h 15m',
                            cabinClass: 'Economy',
                            baggage: {
                                cabin: '7 Kg',
                                checkin: '15 Kg'
                            },
                            meal: 'Not Included',
                            seatSelection: 'Available'
                        }
                    ],

                    // Passengers
                    passengers: [
                        {
                            type: 'ADULT',
                            title: 'Mr',
                            firstName: 'Rahul',
                            lastName: 'Sharma',
                            gender: 'Male',
                            dob: '1990-05-15',
                            ticketNumber: '098-1234567890',
                            seatNumber: '12A',
                            meal: 'Veg',
                            frequentFlyer: ''
                        },
                        {
                            type: 'ADULT',
                            title: 'Mrs',
                            firstName: 'Priya',
                            lastName: 'Sharma',
                            gender: 'Female',
                            dob: '1992-08-22',
                            ticketNumber: '098-1234567891',
                            seatNumber: '12B',
                            meal: 'Veg',
                            frequentFlyer: ''
                        }
                    ],

                    // Contact Details
                    contactDetails: {
                        email: 'rahul.sharma@email.com',
                        phone: '+91 9876543210',
                        alternatePhone: ''
                    },

                    // Fare Details
                    fareDetails: {
                        baseFare: 8500,
                        taxes: 1250,
                        convenienceFee: 0,
                        discount: 0,
                        totalFare: 9750,
                        currency: 'INR'
                    },

                    // E-Ticket / Barcode
                    eTicketBarcode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABkCAYAAAA8AQ3AAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANYSURBVHhe7dZBDsMgDETR3v/S7RJFIjYz+Em7ePsIm2EYX/b9fn8/AMBfnAEAYDoCgNkIAGYjAJiNAGA2AoDZCABmIwCYjQBgNgKA2QgAZiMAmI0AYDYCgNkIAGYjAJiNAGA2AoDZCABmIwCYjQBgNgKA2QgAZiMAmI0AYDYCgNkIAGYjAJiNAGA2AoDZ',

                    // Supplier Info
                    supplier: 'TBO',
                    supplierPnr: 'TBO789456',

                    // GST Details (if provided)
                    gstDetails: {
                        gstNumber: '27ABCDE1234F1Z5',
                        companyName: 'ABC Travels Pvt Ltd',
                        companyAddress: '123 Business Park, Mumbai'
                    }
                });
                setLoading(false);
            }, 500);
        } catch (err) {
            setError('Failed to load booking details');
            setLoading(false);
        }
    };

    const calculateDisplayFare = () => {
        if (!booking) return;

        const { baseFare, taxes } = booking.fareDetails;
        let markup = 0;

        if (customization.markupType === 'FLAT') {
            markup = parseFloat(customization.markupValue) || 0;
        } else {
            markup = ((baseFare + taxes) * (parseFloat(customization.markupValue) || 0)) / 100;
        }

        setDisplayFare({
            baseFare: baseFare,
            taxes: taxes,
            markup: markup,
            total: baseFare + taxes + markup
        });
    };

    const handleCustomizationChange = (field, value) => {
        setCustomization(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ticket Confirmation - ${booking?.bookingRefNo}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
                    .ticket-container { max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
                    .header h1 { color: #2563eb; font-size: 28px; }
                    .header p { color: #666; margin-top: 5px; }
                    .section { margin-bottom: 25px; page-break-inside: avoid; }
                    .section-title { font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
                    .flight-card { background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
                    .flight-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                    .airline-info { display: flex; align-items: center; gap: 10px; }
                    .airline-name { font-weight: 600; font-size: 16px; }
                    .flight-number { color: #666; font-size: 14px; }
                    .flight-route { display: flex; justify-content: space-between; align-items: center; }
                    .city-info { text-align: center; }
                    .city-code { font-size: 28px; font-weight: 700; color: #1e40af; }
                    .city-name { font-size: 12px; color: #666; }
                    .time { font-size: 18px; font-weight: 600; margin-top: 5px; }
                    .date { font-size: 12px; color: #666; }
                    .flight-line { flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 20px; }
                    .flight-line-inner { width: 100%; height: 2px; background: #d1d5db; position: relative; }
                    .flight-line-inner::before { content: '✈'; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: white; padding: 0 10px; color: #2563eb; font-size: 20px; }
                    .duration-text { text-align: center; font-size: 12px; color: #666; margin-top: 10px; }
                    .pnr-section { display: flex; gap: 30px; padding: 15px; background: #fef3c7; border-radius: 8px; margin-top: 15px; }
                    .pnr-item { text-align: center; }
                    .pnr-label { font-size: 11px; color: #92400e; text-transform: uppercase; }
                    .pnr-value { font-size: 20px; font-weight: 700; color: #92400e; letter-spacing: 2px; }
                    .passenger-table { width: 100%; border-collapse: collapse; }
                    .passenger-table th { text-align: left; padding: 10px; background: #f1f5f9; font-size: 12px; text-transform: uppercase; color: #64748b; }
                    .passenger-table td { padding: 12px 10px; border-bottom: 1px solid #e5e7eb; }
                    .fare-table { width: 100%; }
                    .fare-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
                    .fare-row.total { border-top: 2px solid #2563eb; border-bottom: none; margin-top: 10px; padding-top: 15px; font-weight: 700; font-size: 18px; color: #2563eb; }
                    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                    .contact-item label { font-size: 11px; color: #64748b; text-transform: uppercase; }
                    .contact-item p { font-weight: 500; margin-top: 3px; }
                    .barcode-section { text-align: center; margin-top: 20px; padding: 20px; background: #f8fafc; border-radius: 8px; }
                    .barcode-section img { max-width: 250px; height: auto; }
                    .terms { font-size: 10px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                    .terms ul { margin-left: 15px; margin-top: 5px; }
                    .agent-section { background: #f1f5f9; padding: 20px; border-radius: 8px; margin-top: 20px; }
                    .agent-section h3 { font-size: 14px; color: #475569; margin-bottom: 10px; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #2563eb; color: #64748b; font-size: 12px; }
                    .copyright-footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #f1f5f9; }
                    .copyright-footer p { color: #d1d5db; }
                    .copyright-footer .powered-by { font-size: 8px; }
                    .copyright-footer .all-rights { font-size: 7px; margin-top: 3px; }
                    @media print {
                        body { padding: 0; }
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const handleSavePDF = async () => {
        // Using html2pdf or similar library would be ideal
        // For now, trigger print dialog with PDF option
        handlePrint();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading ticket details...</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
                    <button
                        onClick={() => navigate('/bookings')}
                        className="text-blue-600 hover:underline"
                    >
                        Back to Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Control Panel - Not printed */}
            <div className="bg-white shadow-lg sticky top-0 z-10 no-print">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                ← Back
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">Ticket Confirmation</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.status === 'TICKETED' ? 'bg-green-100 text-green-800' :
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {booking.status}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSavePDF}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Save PDF
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print
                            </button>
                        </div>
                    </div>

                    {/* Customization Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        {/* Markup Settings */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Add Markup
                            </h3>
                            <div className="flex gap-2">
                                <select
                                    value={customization.markupType}
                                    onChange={(e) => handleCustomizationChange('markupType', e.target.value)}
                                    className="px-3 py-2 border rounded-lg text-sm"
                                >
                                    <option value="FLAT">Flat (₹)</option>
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                </select>
                                <input
                                    type="number"
                                    value={customization.markupValue}
                                    onChange={(e) => handleCustomizationChange('markupValue', e.target.value)}
                                    placeholder="0"
                                    className="w-24 px-3 py-2 border rounded-lg text-sm"
                                    min="0"
                                />
                            </div>
                            {customization.markupValue > 0 && (
                                <p className="text-xs text-green-600">
                                    Markup: ₹{displayFare.markup.toLocaleString()} | New Total: ₹{displayFare.total.toLocaleString()}
                                </p>
                            )}
                        </div>

                        {/* Visibility Settings */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Visibility Options
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={customization.showFare}
                                        onChange={(e) => handleCustomizationChange('showFare', e.target.checked)}
                                        className="rounded"
                                    />
                                    Show Fare
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={customization.showFareBreakdown}
                                        onChange={(e) => handleCustomizationChange('showFareBreakdown', e.target.checked)}
                                        className="rounded"
                                        disabled={!customization.showFare}
                                    />
                                    Fare Breakdown
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={customization.showAgentDetails}
                                        onChange={(e) => handleCustomizationChange('showAgentDetails', e.target.checked)}
                                        className="rounded"
                                    />
                                    Agent Details
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={customization.showAgentContact}
                                        onChange={(e) => handleCustomizationChange('showAgentContact', e.target.checked)}
                                        className="rounded"
                                        disabled={!customization.showAgentDetails}
                                    />
                                    Agent Contact
                                </label>
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                More Options
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={customization.showTerms}
                                        onChange={(e) => handleCustomizationChange('showTerms', e.target.checked)}
                                        className="rounded"
                                    />
                                    Terms & Conditions
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={customization.showAgentLogo}
                                        onChange={(e) => handleCustomizationChange('showAgentLogo', e.target.checked)}
                                        className="rounded"
                                        disabled={!customization.showAgentDetails}
                                    />
                                    Agent Logo
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Printable Ticket Content */}
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div ref={printRef} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Ticket Header */}
                    <div className="header bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
                        {customization.showAgentDetails && customization.showAgentLogo && (
                            <div className="mb-4">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-2xl font-bold text-blue-600">
                                        {agent?.companyName?.[0] || 'T'}
                                    </span>
                                </div>
                            </div>
                        )}
                        <h1 className="text-2xl font-bold">
                            {customization.showAgentDetails ? (agent?.companyName || 'TripCode Travels') : 'E-TICKET'}
                        </h1>
                        <p className="text-blue-100 mt-1">Electronic Ticket Confirmation</p>
                        {customization.customHeader && (
                            <p className="mt-2 text-sm">{customization.customHeader}</p>
                        )}
                    </div>

                    <div className="p-6 space-y-6">
                        {/* PNR & Reference Numbers */}
                        <div className="pnr-section bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-wrap gap-6 justify-center">
                            <div className="pnr-item text-center">
                                <div className="pnr-label text-xs text-amber-700 uppercase tracking-wider">Booking Reference</div>
                                <div className="pnr-value text-xl font-bold text-amber-800 tracking-widest">{booking.bookingRefNo}</div>
                            </div>
                            <div className="pnr-item text-center">
                                <div className="pnr-label text-xs text-amber-700 uppercase tracking-wider">Airline PNR</div>
                                <div className="pnr-value text-xl font-bold text-amber-800 tracking-widest">{booking.airlinePnr}</div>
                            </div>
                            <div className="pnr-item text-center">
                                <div className="pnr-label text-xs text-amber-700 uppercase tracking-wider">Status</div>
                                <div className="pnr-value text-xl font-bold text-green-700">{booking.status}</div>
                            </div>
                        </div>

                        {/* Flight Details */}
                        <div className="section">
                            <h2 className="section-title text-sm font-semibold text-blue-600 uppercase tracking-wider border-b pb-2 mb-4">
                                Flight Details
                            </h2>

                            {booking.flights.map((flight, index) => (
                                <div key={index} className="flight-card bg-gray-50 rounded-lg p-5 mb-4">
                                    {/* Airline Header */}
                                    <div className="flight-header flex justify-between items-center mb-4">
                                        <div className="airline-info flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-bold text-sm">{flight.airlineCode}</span>
                                            </div>
                                            <div>
                                                <div className="airline-name font-semibold">{flight.airline}</div>
                                                <div className="flight-number text-sm text-gray-500">{flight.flightNumber} • {flight.aircraft}</div>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm text-gray-500">
                                            <div className="font-medium">{flight.cabinClass}</div>
                                            <div>{flight.duration}</div>
                                        </div>
                                    </div>

                                    {/* Flight Route */}
                                    <div className="flight-route flex items-center justify-between">
                                        <div className="city-info text-center">
                                            <div className="city-code text-3xl font-bold text-blue-800">{flight.departure.code}</div>
                                            <div className="city-name text-sm text-gray-600">{flight.departure.city}</div>
                                            <div className="time text-lg font-semibold mt-2">{formatTime(flight.departure.time)}</div>
                                            <div className="date text-xs text-gray-500">{formatDate(flight.departure.date)}</div>
                                            <div className="text-xs text-gray-400 mt-1">Terminal {flight.departure.terminal}</div>
                                        </div>

                                        <div className="flight-line flex-1 flex flex-col items-center px-6">
                                            <div className="w-full flex items-center">
                                                <div className="h-0.5 flex-1 bg-gray-300"></div>
                                                <div className="mx-2 text-blue-500 text-xl">✈</div>
                                                <div className="h-0.5 flex-1 bg-gray-300"></div>
                                            </div>
                                            <div className="duration-text text-xs text-gray-500 mt-2">{flight.duration} • Non-stop</div>
                                        </div>

                                        <div className="city-info text-center">
                                            <div className="city-code text-3xl font-bold text-blue-800">{flight.arrival.code}</div>
                                            <div className="city-name text-sm text-gray-600">{flight.arrival.city}</div>
                                            <div className="time text-lg font-semibold mt-2">{formatTime(flight.arrival.time)}</div>
                                            <div className="date text-xs text-gray-500">{formatDate(flight.arrival.date)}</div>
                                            <div className="text-xs text-gray-400 mt-1">Terminal {flight.arrival.terminal}</div>
                                        </div>
                                    </div>

                                    {/* Baggage Info */}
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Cabin:</span>
                                            <span className="font-medium">{flight.baggage.cabin}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Check-in:</span>
                                            <span className="font-medium">{flight.baggage.checkin}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Meal:</span>
                                            <span className="font-medium">{flight.meal}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Passenger Details */}
                        <div className="section">
                            <h2 className="section-title text-sm font-semibold text-blue-600 uppercase tracking-wider border-b pb-2 mb-4">
                                Passenger Details
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="passenger-table w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="text-left py-3 px-4">Passenger</th>
                                            <th className="text-left py-3 px-4">Type</th>
                                            <th className="text-left py-3 px-4">Ticket Number</th>
                                            <th className="text-left py-3 px-4">Seat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {booking.passengers.map((passenger, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">
                                                        {passenger.title} {passenger.firstName} {passenger.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {passenger.gender} • DOB: {formatDate(passenger.dob)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        passenger.type === 'ADULT' ? 'bg-blue-100 text-blue-800' :
                                                        passenger.type === 'CHILD' ? 'bg-green-100 text-green-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {passenger.type}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-mono text-sm">{passenger.ticketNumber}</td>
                                                <td className="py-3 px-4 font-medium">{passenger.seatNumber || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="section">
                            <h2 className="section-title text-sm font-semibold text-blue-600 uppercase tracking-wider border-b pb-2 mb-4">
                                Contact Information
                            </h2>
                            <div className="contact-grid grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="contact-item">
                                    <label className="text-xs text-gray-500 uppercase">Email</label>
                                    <p className="font-medium">{booking.contactDetails.email}</p>
                                </div>
                                <div className="contact-item">
                                    <label className="text-xs text-gray-500 uppercase">Phone</label>
                                    <p className="font-medium">{booking.contactDetails.phone}</p>
                                </div>
                                {booking.contactDetails.alternatePhone && (
                                    <div className="contact-item">
                                        <label className="text-xs text-gray-500 uppercase">Alternate Phone</label>
                                        <p className="font-medium">{booking.contactDetails.alternatePhone}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fare Details */}
                        {customization.showFare && (
                            <div className="section">
                                <h2 className="section-title text-sm font-semibold text-blue-600 uppercase tracking-wider border-b pb-2 mb-4">
                                    Fare Details
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {customization.showFareBreakdown && (
                                        <>
                                            <div className="fare-row flex justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600">Base Fare ({booking.passengers.length} Pax)</span>
                                                <span className="font-medium">₹{displayFare.baseFare.toLocaleString()}</span>
                                            </div>
                                            <div className="fare-row flex justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600">Taxes & Fees</span>
                                                <span className="font-medium">₹{displayFare.taxes.toLocaleString()}</span>
                                            </div>
                                            {displayFare.markup > 0 && (
                                                <div className="fare-row flex justify-between py-2 border-b border-gray-200">
                                                    <span className="text-gray-600">Service Charges</span>
                                                    <span className="font-medium">₹{displayFare.markup.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="fare-row total flex justify-between pt-4 mt-2 border-t-2 border-blue-500">
                                        <span className="text-lg font-bold text-blue-700">Total Amount</span>
                                        <span className="text-lg font-bold text-blue-700">₹{displayFare.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* E-Ticket Barcode */}
                        {booking.eTicketBarcode && (
                            <div className="barcode-section bg-gray-50 rounded-lg p-6 text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">E-Ticket Barcode</p>
                                <img
                                    src={booking.eTicketBarcode}
                                    alt="E-Ticket Barcode"
                                    className="max-w-[250px] mx-auto"
                                />
                                <p className="text-xs text-gray-400 mt-3">Scan this barcode at the airport for quick check-in</p>
                            </div>
                        )}

                        {/* Agent Details */}
                        {customization.showAgentDetails && (
                            <div className="agent-section bg-gray-100 rounded-lg p-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Booked By</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <label className="text-xs text-gray-500">Agency Name</label>
                                        <p className="font-medium">{agent?.companyName || 'TripCode Travels'}</p>
                                    </div>
                                    {customization.showAgentContact && (
                                        <>
                                            <div>
                                                <label className="text-xs text-gray-500">Email</label>
                                                <p className="font-medium">{agent?.email || 'support@tripcode.in'}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Phone</label>
                                                <p className="font-medium">{agent?.phone || '+91 1800-XXX-XXXX'}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Terms & Conditions */}
                        {customization.showTerms && (
                            <div className="terms text-xs text-gray-500 border-t pt-4 mt-6">
                                <p className="font-semibold text-gray-700 mb-2">Important Information:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Please arrive at the airport at least 2 hours before departure for domestic flights and 3 hours for international flights.</li>
                                    <li>Carry a valid government-issued photo ID along with this e-ticket.</li>
                                    <li>Baggage allowance is subject to airline policies and may vary.</li>
                                    <li>Cancellation and date change fees apply as per the fare rules.</li>
                                    <li>For any assistance, please contact us at the details provided above.</li>
                                </ul>
                            </div>
                        )}

                        {/* Custom Footer */}
                        {customization.customFooter && (
                            <div className="text-center text-sm text-gray-600 mt-4">
                                {customization.customFooter}
                            </div>
                        )}

                        {/* Footer */}
                        <div className="footer text-center text-xs text-gray-400 border-t pt-4 mt-6">
                            <p>This is an electronically generated document. No signature is required.</p>
                            <p className="mt-1">Booking Date: {formatDate(booking.bookingDate)} | Generated on: {new Date().toLocaleString()}</p>
                        </div>

                        {/* Copyright & Portal URL */}
                        <div className="copyright-footer text-center mt-6 pt-4 border-t border-gray-100">
                            <p style={{ fontSize: '8px' }} className="powered-by text-gray-300">
                                Powered by TripCode | www.tripcode.in
                            </p>
                            <p style={{ fontSize: '7px' }} className="all-rights text-gray-300 mt-1">
                                © {new Date().getFullYear()} TripCode Technologies Pvt. Ltd. All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketConfirmation;

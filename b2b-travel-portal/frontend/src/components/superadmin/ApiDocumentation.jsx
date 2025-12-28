import React, { useState } from 'react';

const ApiDocumentation = () => {
    const [activeSection, setActiveSection] = useState('getting-started');
    const [activeEndpoint, setActiveEndpoint] = useState(null);

    const sections = [
        { id: 'getting-started', label: 'Getting Started' },
        { id: 'authentication', label: 'Authentication' },
        { id: 'flights', label: 'Flight Search' },
        { id: 'bookings', label: 'Bookings' },
        { id: 'ancillaries', label: 'Ancillaries' },
        { id: 'webhooks', label: 'Webhooks' },
        { id: 'errors', label: 'Error Handling' },
    ];

    const endpoints = {
        flights: [
            {
                method: 'POST',
                path: '/api/public/v1/flights/search',
                title: 'Search Flights',
                description: 'Search for available flights between two cities',
                request: {
                    origin: 'DEL',
                    destination: 'BOM',
                    departDate: '2025-01-15',
                    returnDate: '2025-01-20',
                    adults: 2,
                    children: 0,
                    infants: 0,
                    cabinClass: 'ECONOMY',
                    directOnly: false
                },
                response: {
                    success: true,
                    searchId: 'search_abc123',
                    flights: [
                        {
                            flightId: 'FL001',
                            airline: { code: '6E', name: 'IndiGo' },
                            flightNumber: '6E-2154',
                            departure: { airport: 'DEL', time: '06:00', terminal: '1D' },
                            arrival: { airport: 'BOM', time: '08:15', terminal: '1' },
                            duration: 135,
                            stops: 0,
                            fare: { base: 4500, taxes: 850, total: 5350, currency: 'INR' }
                        }
                    ],
                    filters: { airlines: ['6E', 'AI', 'UK'], stops: [0, 1], priceRange: { min: 4500, max: 12000 } }
                }
            },
            {
                method: 'POST',
                path: '/api/public/v1/flights/fare-quote',
                title: 'Get Fare Quote',
                description: 'Get real-time fare quote for a specific flight',
                request: {
                    searchId: 'search_abc123',
                    flightId: 'FL001'
                },
                response: {
                    success: true,
                    quoteId: 'quote_xyz789',
                    validUntil: '2025-01-10T12:30:00Z',
                    fare: { base: 4500, taxes: 850, total: 5350, currency: 'INR' },
                    seatsAvailable: 12
                }
            },
            {
                method: 'GET',
                path: '/api/public/v1/flights/fare-rules/{flightId}',
                title: 'Get Fare Rules',
                description: 'Get cancellation and change rules for a flight',
                response: {
                    success: true,
                    rules: {
                        cancellation: [
                            { period: '0-2 hours before', fee: 3000, refundable: false },
                            { period: '2-24 hours before', fee: 2000, refundable: true },
                            { period: '24+ hours before', fee: 1000, refundable: true }
                        ],
                        dateChange: [
                            { period: '0-24 hours before', fee: 2500 },
                            { period: '24+ hours before', fee: 1500 }
                        ],
                        baggageAllowance: { cabin: '7kg', checkin: '15kg' }
                    }
                }
            }
        ],
        bookings: [
            {
                method: 'POST',
                path: '/api/public/v1/bookings/create',
                title: 'Create Booking',
                description: 'Create a new flight booking',
                request: {
                    quoteId: 'quote_xyz789',
                    passengers: [
                        {
                            type: 'ADULT',
                            title: 'Mr',
                            firstName: 'John',
                            lastName: 'Doe',
                            dob: '1990-05-15',
                            email: 'john@example.com',
                            phone: '+919876543210',
                            passport: { number: 'A1234567', expiry: '2030-01-01', nationality: 'IN' }
                        }
                    ],
                    contact: {
                        email: 'booking@example.com',
                        phone: '+919876543210'
                    },
                    gstDetails: {
                        gstNumber: '22AAAAA0000A1Z5',
                        companyName: 'ABC Travels',
                        address: 'New Delhi'
                    }
                },
                response: {
                    success: true,
                    booking: {
                        bookingId: 'BK123456',
                        pnr: 'ABC123',
                        status: 'CONFIRMED',
                        totalAmount: 5350,
                        ticketNumber: '0989876543210'
                    }
                }
            },
            {
                method: 'GET',
                path: '/api/public/v1/bookings/{bookingId}',
                title: 'Get Booking Details',
                description: 'Retrieve details of a specific booking',
                response: {
                    success: true,
                    booking: {
                        bookingId: 'BK123456',
                        pnr: 'ABC123',
                        status: 'CONFIRMED',
                        flight: { flightNumber: '6E-2154', date: '2025-01-15' },
                        passengers: [{ name: 'John Doe', ticketNumber: '0989876543210' }],
                        fare: { total: 5350, paid: true }
                    }
                }
            },
            {
                method: 'POST',
                path: '/api/public/v1/bookings/{bookingId}/cancel',
                title: 'Cancel Booking',
                description: 'Cancel an existing booking',
                request: {
                    reason: 'Change of plans',
                    refundMode: 'ORIGINAL'
                },
                response: {
                    success: true,
                    cancellation: {
                        cancellationId: 'CAN123',
                        refundAmount: 3350,
                        cancellationFee: 2000,
                        status: 'PROCESSING',
                        expectedRefundDate: '2025-01-17'
                    }
                }
            }
        ]
    };

    const renderCodeBlock = (code, language = 'json') => (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{JSON.stringify(code, null, 2)}</code>
        </pre>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r fixed h-full overflow-y-auto">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-indigo-600">Tripcode API</h1>
                    <p className="text-sm text-gray-500 mt-1">v1.0 Documentation</p>
                </div>
                <nav className="p-4">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg mb-1 ${
                                activeSection === section.id
                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {section.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {activeSection === 'getting-started' && (
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-bold mb-6">Getting Started</h1>

                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
                            <p className="text-gray-600 mb-4">
                                The Tripcode API provides programmatic access to flight search, booking, and management capabilities.
                                Our RESTful API uses JSON for request and response bodies.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Base URL:</strong> https://api.tripcode.com/api/public/v1
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold flex-shrink-0">1</div>
                                    <div>
                                        <h3 className="font-medium">Get your API Keys</h3>
                                        <p className="text-gray-600 text-sm">Navigate to Settings &gt; API Keys in your dashboard to generate your live and test API keys.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold flex-shrink-0">2</div>
                                    <div>
                                        <h3 className="font-medium">Make your first request</h3>
                                        <p className="text-gray-600 text-sm">Include your API key in the X-API-Key header with every request.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold flex-shrink-0">3</div>
                                    <div>
                                        <h3 className="font-medium">Go live</h3>
                                        <p className="text-gray-600 text-sm">Switch from test keys to live keys when you're ready for production.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Example Request</h2>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://api.tripcode.com/api/public/v1/flights/search \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: tc_live_your_api_key_here" \\
  -d '{
    "origin": "DEL",
    "destination": "BOM",
    "departDate": "2025-01-15",
    "adults": 1
  }'`}
                            </pre>
                        </div>
                    </div>
                )}

                {activeSection === 'authentication' && (
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-bold mb-6">Authentication</h1>

                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">API Keys</h2>
                            <p className="text-gray-600 mb-4">
                                All API requests require authentication using an API key. Include your key in the <code className="bg-gray-100 px-2 py-1 rounded">X-API-Key</code> header.
                            </p>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Important:</strong> Never expose your API keys in client-side code. Always make API calls from your server.
                                </p>
                            </div>

                            <h3 className="font-medium mt-6 mb-2">Key Types</h3>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Type</th>
                                        <th className="text-left py-2">Prefix</th>
                                        <th className="text-left py-2">Usage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="py-2">Live Key</td>
                                        <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">tc_live_</code></td>
                                        <td className="py-2">Production transactions, real bookings</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Test Key</td>
                                        <td className="py-2"><code className="bg-gray-100 px-2 py-1 rounded">tc_test_</code></td>
                                        <td className="py-2">Sandbox testing, no real bookings</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Rate Limits</h2>
                            <p className="text-gray-600 mb-4">
                                API rate limits depend on your subscription plan. Rate limit headers are included in every response.
                            </p>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Plan</th>
                                        <th className="text-left py-2">Requests/Minute</th>
                                        <th className="text-left py-2">Requests/Day</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="py-2">Professional</td>
                                        <td className="py-2">60</td>
                                        <td className="py-2">10,000</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2">Enterprise</td>
                                        <td className="py-2">300</td>
                                        <td className="py-2">Unlimited</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">API Only</td>
                                        <td className="py-2">120</td>
                                        <td className="py-2">50,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {(activeSection === 'flights' || activeSection === 'bookings') && (
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-bold mb-6 capitalize">{activeSection}</h1>

                        <div className="space-y-6">
                            {endpoints[activeSection]?.map((endpoint, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => setActiveEndpoint(activeEndpoint === idx ? null : idx)}
                                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded ${
                                                endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                                                endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                                                endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {endpoint.method}
                                            </span>
                                            <code className="text-sm">{endpoint.path}</code>
                                        </div>
                                        <svg className={`w-5 h-5 transition-transform ${activeEndpoint === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {activeEndpoint === idx && (
                                        <div className="p-6 border-t bg-gray-50">
                                            <h3 className="font-semibold mb-2">{endpoint.title}</h3>
                                            <p className="text-gray-600 mb-4">{endpoint.description}</p>

                                            {endpoint.request && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Request Body</h4>
                                                    {renderCodeBlock(endpoint.request)}
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Response</h4>
                                                {renderCodeBlock(endpoint.response)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'errors' && (
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-bold mb-6">Error Handling</h1>

                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Error Response Format</h2>
                            <p className="text-gray-600 mb-4">
                                All errors follow a consistent JSON format with an error code and message.
                            </p>
                            {renderCodeBlock({
                                success: false,
                                error: {
                                    code: 'INVALID_REQUEST',
                                    message: 'The request body is missing required fields',
                                    details: [
                                        { field: 'origin', message: 'Origin airport code is required' }
                                    ]
                                }
                            })}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">HTTP Status Codes</h2>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Code</th>
                                        <th className="text-left py-2">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="py-2 font-mono">200</td>
                                        <td className="py-2">Success</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-mono">400</td>
                                        <td className="py-2">Bad Request - Invalid parameters</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-mono">401</td>
                                        <td className="py-2">Unauthorized - Invalid or missing API key</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-mono">403</td>
                                        <td className="py-2">Forbidden - Insufficient permissions</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-mono">404</td>
                                        <td className="py-2">Not Found - Resource doesn't exist</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-mono">429</td>
                                        <td className="py-2">Rate Limit Exceeded</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-mono">500</td>
                                        <td className="py-2">Internal Server Error</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'webhooks' && (
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-bold mb-6">Webhooks</h1>

                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Overview</h2>
                            <p className="text-gray-600 mb-4">
                                Webhooks allow you to receive real-time notifications about booking events. Configure your webhook URL in the dashboard.
                            </p>

                            <h3 className="font-medium mt-6 mb-2">Available Events</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li><code className="bg-gray-100 px-2 py-1 rounded">booking.confirmed</code> - Booking is confirmed</li>
                                <li><code className="bg-gray-100 px-2 py-1 rounded">booking.cancelled</code> - Booking is cancelled</li>
                                <li><code className="bg-gray-100 px-2 py-1 rounded">booking.modified</code> - Booking is modified</li>
                                <li><code className="bg-gray-100 px-2 py-1 rounded">refund.processed</code> - Refund is processed</li>
                                <li><code className="bg-gray-100 px-2 py-1 rounded">schedule.changed</code> - Flight schedule changed</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Webhook Payload</h2>
                            {renderCodeBlock({
                                event: 'booking.confirmed',
                                timestamp: '2025-01-10T10:30:00Z',
                                data: {
                                    bookingId: 'BK123456',
                                    pnr: 'ABC123',
                                    status: 'CONFIRMED',
                                    passengers: 2,
                                    totalAmount: 10700
                                }
                            })}
                        </div>
                    </div>
                )}

                {activeSection === 'ancillaries' && (
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-bold mb-6">Ancillaries</h1>

                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Seat Selection</h2>
                            <p className="text-gray-600 mb-4">
                                Retrieve seat maps and add seat selections to bookings.
                            </p>

                            <div className="flex items-center gap-4 mb-4">
                                <span className="bg-green-100 text-green-800 px-3 py-1 text-xs font-bold rounded">GET</span>
                                <code className="text-sm">/api/public/v1/ancillaries/seats/{'{'}flightId{'}'}</code>
                            </div>

                            {renderCodeBlock({
                                success: true,
                                seatMap: {
                                    aircraft: 'A320',
                                    rows: 30,
                                    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
                                    seats: [
                                        { row: 1, column: 'A', type: 'WINDOW', available: true, price: 500 },
                                        { row: 1, column: 'B', type: 'MIDDLE', available: false, price: 300 }
                                    ]
                                }
                            })}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Extra Baggage</h2>
                            <p className="text-gray-600 mb-4">
                                Get available baggage options for a flight.
                            </p>

                            <div className="flex items-center gap-4 mb-4">
                                <span className="bg-green-100 text-green-800 px-3 py-1 text-xs font-bold rounded">GET</span>
                                <code className="text-sm">/api/public/v1/ancillaries/baggage/{'{'}flightId{'}'}</code>
                            </div>

                            {renderCodeBlock({
                                success: true,
                                options: [
                                    { id: 'BAG_5KG', weight: '5kg', price: 500 },
                                    { id: 'BAG_10KG', weight: '10kg', price: 900 },
                                    { id: 'BAG_15KG', weight: '15kg', price: 1200 },
                                    { id: 'BAG_20KG', weight: '20kg', price: 1500 }
                                ]
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ApiDocumentation;

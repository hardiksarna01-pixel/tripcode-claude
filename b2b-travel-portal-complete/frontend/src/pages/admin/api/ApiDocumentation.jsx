/**
 * API Documentation Page
 * Interactive API documentation and reference
 */

import React, { useState } from 'react';
import {
    CodeBracketIcon,
    BookOpenIcon,
    ArrowRightIcon,
    ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const endpoints = [
    {
        category: 'Authentication',
        items: [
            { method: 'POST', path: '/api/auth/login', description: 'Authenticate user and get tokens' },
            { method: 'POST', path: '/api/auth/refresh', description: 'Refresh access token' },
            { method: 'POST', path: '/api/auth/logout', description: 'Logout and invalidate tokens' }
        ]
    },
    {
        category: 'Flights',
        items: [
            { method: 'GET', path: '/api/flights/search', description: 'Search for available flights' },
            { method: 'GET', path: '/api/flights/:id', description: 'Get flight details' },
            { method: 'POST', path: '/api/flights/book', description: 'Book a flight' },
            { method: 'GET', path: '/api/flights/booking/:id', description: 'Get booking details' }
        ]
    },
    {
        category: 'Hotels',
        items: [
            { method: 'GET', path: '/api/hotels/search', description: 'Search for available hotels' },
            { method: 'GET', path: '/api/hotels/:id', description: 'Get hotel details' },
            { method: 'POST', path: '/api/hotels/book', description: 'Book a hotel room' },
            { method: 'GET', path: '/api/hotels/booking/:id', description: 'Get hotel booking details' }
        ]
    },
    {
        category: 'Bookings',
        items: [
            { method: 'GET', path: '/api/bookings', description: 'List all bookings' },
            { method: 'GET', path: '/api/bookings/:id', description: 'Get booking details' },
            { method: 'PUT', path: '/api/bookings/:id/cancel', description: 'Cancel a booking' },
            { method: 'GET', path: '/api/bookings/:id/invoice', description: 'Get booking invoice' }
        ]
    }
];

const ApiDocumentation = () => {
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);
    const [activeTab, setActiveTab] = useState('request');

    const getMethodColor = (method) => {
        switch (method) {
            case 'GET': return 'bg-green-100 text-green-700';
            case 'POST': return 'bg-blue-100 text-blue-700';
            case 'PUT': return 'bg-yellow-100 text-yellow-700';
            case 'DELETE': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert('Code copied to clipboard!');
    };

    const sampleRequest = `curl -X POST 'https://api.travelportal.com/api/flights/search' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "origin": "DEL",
    "destination": "BOM",
    "departDate": "2024-03-15",
    "adults": 2,
    "class": "economy"
  }'`;

    const sampleResponse = `{
  "success": true,
  "data": {
    "flights": [
      {
        "id": "FL123456",
        "airline": "Air India",
        "departure": "2024-03-15T06:00:00",
        "arrival": "2024-03-15T08:15:00",
        "price": {
          "amount": 4500,
          "currency": "INR"
        }
      }
    ],
    "totalResults": 24
  }
}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
                    <p className="text-gray-500 mt-1">Complete API reference and examples</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                        <BookOpenIcon className="w-5 h-5" />
                        Download PDF
                    </button>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <CodeBracketIcon className="w-5 h-5" />
                        Open Swagger UI
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Endpoints List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:col-span-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Endpoints</h2>
                    <div className="space-y-4">
                        {endpoints.map((category) => (
                            <div key={category.category}>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                    {category.category}
                                </h3>
                                <div className="space-y-1">
                                    {category.items.map((endpoint, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedEndpoint(endpoint)}
                                            className={`w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 ${
                                                selectedEndpoint === endpoint ? 'bg-blue-50' : ''
                                            }`}
                                        >
                                            <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${getMethodColor(endpoint.method)}`}>
                                                {endpoint.method}
                                            </span>
                                            <span className="text-sm text-gray-700 font-mono truncate">
                                                {endpoint.path}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* API Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {selectedEndpoint ? (
                            <span className="flex items-center gap-2">
                                <span className={`text-sm font-mono px-2 py-1 rounded ${getMethodColor(selectedEndpoint.method)}`}>
                                    {selectedEndpoint.method}
                                </span>
                                <span className="font-mono">{selectedEndpoint.path}</span>
                            </span>
                        ) : (
                            'Select an endpoint'
                        )}
                    </h2>

                    {selectedEndpoint && (
                        <>
                            <p className="text-gray-600 mb-4">{selectedEndpoint.description}</p>

                            {/* Tabs */}
                            <div className="border-b border-gray-200 mb-4">
                                <nav className="flex gap-4">
                                    <button
                                        onClick={() => setActiveTab('request')}
                                        className={`pb-2 text-sm font-medium ${
                                            activeTab === 'request'
                                                ? 'border-b-2 border-blue-600 text-blue-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Request
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('response')}
                                        className={`pb-2 text-sm font-medium ${
                                            activeTab === 'response'
                                                ? 'border-b-2 border-blue-600 text-blue-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Response
                                    </button>
                                </nav>
                            </div>

                            {/* Code Block */}
                            <div className="relative">
                                <button
                                    onClick={() => copyCode(activeTab === 'request' ? sampleRequest : sampleResponse)}
                                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 bg-gray-800 rounded"
                                >
                                    <ClipboardDocumentIcon className="w-4 h-4" />
                                </button>
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                    <code>{activeTab === 'request' ? sampleRequest : sampleResponse}</code>
                                </pre>
                            </div>
                        </>
                    )}

                    {!selectedEndpoint && (
                        <div className="text-center py-12 text-gray-500">
                            <CodeBracketIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Select an endpoint from the left to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Start */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h2 className="text-xl font-bold mb-2">Quick Start Guide</h2>
                <p className="opacity-90 mb-4">Get started with the Travel Portal API in minutes</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold mb-1">1</div>
                        <h3 className="font-medium mb-1">Get API Key</h3>
                        <p className="text-sm opacity-80">Generate an API key from the dashboard</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold mb-1">2</div>
                        <h3 className="font-medium mb-1">Make Request</h3>
                        <p className="text-sm opacity-80">Use your key in the Authorization header</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold mb-1">3</div>
                        <h3 className="font-medium mb-1">Handle Response</h3>
                        <p className="text-sm opacity-80">Process JSON responses in your app</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiDocumentation;

import React from 'react';

/**
 * Reusable placeholder component for pages under development
 */
const PlaceholderPage = ({ title, description, icon }) => {
    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                        {icon || (
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">{title}</h1>
                    <p className="text-gray-500 mb-6">{description || 'This feature is coming soon!'}</p>
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Under Development
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderPage;

/**
 * Custom Pages Management
 * Create and manage custom landing pages
 */

import React, { useState } from 'react';
import {
    DocumentTextIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const pages = [
    {
        id: 1,
        title: 'About Us',
        slug: '/about',
        status: 'published',
        lastModified: '2024-02-15',
        author: 'Admin'
    },
    {
        id: 2,
        title: 'Terms & Conditions',
        slug: '/terms',
        status: 'published',
        lastModified: '2024-01-20',
        author: 'Admin'
    },
    {
        id: 3,
        title: 'Privacy Policy',
        slug: '/privacy',
        status: 'published',
        lastModified: '2024-01-20',
        author: 'Admin'
    },
    {
        id: 4,
        title: 'FAQ',
        slug: '/faq',
        status: 'draft',
        lastModified: '2024-02-25',
        author: 'Admin'
    }
];

const CustomPages = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Custom Pages</h1>
                    <p className="text-gray-500 mt-1">Create and manage custom pages for your portal</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5" />
                    Create Page
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search pages..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            {/* Pages List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        All Pages ({pages.length})
                    </h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {pages.map((page) => (
                        <div key={page.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{page.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {page.slug} • Modified {page.lastModified}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {page.status === 'published' ? (
                                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Published
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
                                        <XCircleIcon className="w-4 h-4" />
                                        Draft
                                    </span>
                                )}
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <EyeIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Page Templates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                            <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-medium text-gray-900">Blank Page</h3>
                        <p className="text-sm text-gray-500">Start from scratch</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                            <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-medium text-gray-900">Landing Page</h3>
                        <p className="text-sm text-gray-500">Hero, features, CTA</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                            <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-medium text-gray-900">Contact Page</h3>
                        <p className="text-sm text-gray-500">Form, map, details</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomPages;

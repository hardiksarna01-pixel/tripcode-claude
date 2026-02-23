import React, { useState } from 'react';
import {
    BellIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PaperAirplaneIcon,
    UserGroupIcon,
    MegaphoneIcon
} from '@heroicons/react/24/outline';

const AdminNotifications = () => {
    const [activeTab, setActiveTab] = useState('push');

    const notifications = [
        { id: 1, title: 'New Year Sale', message: 'Get 20% off on all bookings!', type: 'promo', audience: 'All Users', sentAt: '2024-06-15 10:00 AM', status: 'sent' },
        { id: 2, title: 'Wallet Recharged', message: 'Your wallet has been credited with ₹{amount}', type: 'transactional', audience: 'Agents', sentAt: null, status: 'template' },
        { id: 3, title: 'Booking Confirmed', message: 'Your booking {bookingId} has been confirmed', type: 'transactional', audience: 'Customers', sentAt: null, status: 'template' },
        { id: 4, title: 'Summer Holiday Deals', message: 'Book your summer vacation now!', type: 'promo', audience: 'All Users', sentAt: '2024-06-10 09:00 AM', status: 'sent' }
    ];

    const scheduledNotifications = [
        { id: 1, title: 'Weekend Flash Sale', scheduledFor: '2024-06-20 10:00 AM', audience: 'All Users' },
        { id: 2, title: 'Commission Reminder', scheduledFor: '2024-06-25 09:00 AM', audience: 'Agents' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-gray-600">Manage push notifications and broadcasts</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5" />
                            Create Notification
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Sent Today</div>
                        <div className="text-2xl font-bold mt-1">1,250</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Sent This Week</div>
                        <div className="text-2xl font-bold mt-1">8,450</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Scheduled</div>
                        <div className="text-2xl font-bold mt-1 text-orange-600">5</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="text-gray-500 text-sm">Templates</div>
                        <div className="text-2xl font-bold mt-1">12</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b">
                        {['push', 'scheduled', 'templates'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm font-medium capitalize ${
                                    activeTab === tab
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab === 'push' ? 'Push Notifications' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'push' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b">
                                    <h2 className="font-semibold">Recent Notifications</h2>
                                </div>
                                <div className="divide-y">
                                    {notifications.filter(n => n.status === 'sent').map((notif) => (
                                        <div key={notif.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <MegaphoneIcon className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{notif.title}</div>
                                                        <div className="text-sm text-gray-600 mt-1">{notif.message}</div>
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <UserGroupIcon className="w-4 h-4" />
                                                                {notif.audience}
                                                            </span>
                                                            <span>{notif.sentAt}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sent</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="font-semibold mb-4">Quick Send</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input type="text" className="w-full border rounded-lg px-3 py-2" placeholder="Notification title" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Notification message" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                                        <select className="w-full border rounded-lg px-3 py-2">
                                            <option>All Users</option>
                                            <option>Agents Only</option>
                                            <option>Customers Only</option>
                                        </select>
                                    </div>
                                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700">
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                        Send Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'scheduled' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Title</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Scheduled For</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Audience</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {scheduledNotifications.map((notif) => (
                                    <tr key={notif.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{notif.title}</td>
                                        <td className="px-4 py-3">{notif.scheduledFor}</td>
                                        <td className="px-4 py-3">{notif.audience}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1 hover:bg-gray-100 rounded">
                                                    <PencilIcon className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded">
                                                    <TrashIcon className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notifications.filter(n => n.status === 'template').map((template) => (
                            <div key={template.id} className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <span className={`px-2 py-1 text-xs rounded ${
                                        template.type === 'transactional' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        {template.type}
                                    </span>
                                    <div className="flex gap-1">
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <PencilIcon className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="font-medium mb-2">{template.title}</div>
                                <div className="text-sm text-gray-600">{template.message}</div>
                                <div className="text-xs text-gray-500 mt-3">Audience: {template.audience}</div>
                            </div>
                        ))}
                        <div className="bg-white rounded-xl shadow-sm p-4 border-2 border-dashed flex items-center justify-center">
                            <button className="text-center text-gray-500">
                                <PlusIcon className="w-8 h-8 mx-auto mb-2" />
                                <span className="text-sm">Create Template</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;

/**
 * Admin PNR Notifications
 * Manage notification settings and view alerts
 */

import React, { useState } from 'react';
import {
    BellIcon,
    BellAlertIcon,
    Cog6ToothIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ClockIcon,
    XCircleIcon,
    EnvelopeIcon,
    DevicePhoneMobileIcon,
    ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const notifications = [
    {
        id: 1,
        type: 'critical',
        title: 'VOID Request Expiring Soon',
        message: 'VOID request REQ004 for PNR LMN321 expires in 2 hours. Immediate action required.',
        time: '5 minutes ago',
        read: false,
        agent: 'Sky Tours'
    },
    {
        id: 2,
        type: 'warning',
        title: 'Multiple Pending Requests',
        message: 'Agent "Quick Travels" has 5 pending requests awaiting approval for more than 24 hours.',
        time: '30 minutes ago',
        read: false,
        agent: 'Quick Travels'
    },
    {
        id: 3,
        type: 'info',
        title: 'New Reissue Request',
        message: 'New reissue request REQ006 submitted by Travel Masters for PNR ABC456.',
        time: '1 hour ago',
        read: false,
        agent: 'Travel Masters'
    },
    {
        id: 4,
        type: 'success',
        title: 'Cancellation Processed',
        message: 'Cancellation for PNR XYZ789 has been successfully processed. Refund of ₹8,500 credited.',
        time: '2 hours ago',
        read: true,
        agent: 'John Agency'
    },
    {
        id: 5,
        type: 'info',
        title: 'Date Change Request',
        message: 'High priority date change request from Global Flights for flight on 15th March.',
        time: '3 hours ago',
        read: true,
        agent: 'Global Flights'
    },
    {
        id: 6,
        type: 'warning',
        title: 'Ticket Issue Time Limit',
        message: 'PNR DEF789 time limit expires today at 6:00 PM. Agent has been notified.',
        time: '4 hours ago',
        read: true,
        agent: 'Elite Travels'
    }
];

const notificationSettings = [
    {
        category: 'Request Alerts',
        items: [
            { id: 'new_request', label: 'New PNR request received', email: true, sms: false, push: true },
            { id: 'urgent_request', label: 'Urgent/Critical requests', email: true, sms: true, push: true },
            { id: 'void_expiring', label: 'VOID deadline approaching', email: true, sms: true, push: true }
        ]
    },
    {
        category: 'Processing Alerts',
        items: [
            { id: 'approval_reminder', label: 'Pending approval reminders', email: true, sms: false, push: true },
            { id: 'processing_complete', label: 'Request processing complete', email: true, sms: false, push: true },
            { id: 'processing_failed', label: 'Processing failures', email: true, sms: true, push: true }
        ]
    },
    {
        category: 'System Alerts',
        items: [
            { id: 'time_limit', label: 'Ticket time limit warnings', email: true, sms: false, push: true },
            { id: 'agent_escalation', label: 'Agent escalation requests', email: true, sms: true, push: true },
            { id: 'daily_summary', label: 'Daily summary report', email: true, sms: false, push: false }
        ]
    }
];

const PNRNotifications = () => {
    const [activeTab, setActiveTab] = useState('notifications');
    const [settings, setSettings] = useState(notificationSettings);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'critical':
                return <BellAlertIcon className="w-5 h-5 text-red-600" />;
            case 'warning':
                return <ExclamationCircleIcon className="w-5 h-5 text-yellow-600" />;
            case 'success':
                return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
            default:
                return <BellIcon className="w-5 h-5 text-blue-600" />;
        }
    };

    const getNotificationBg = (type, read) => {
        if (read) return 'bg-gray-50';
        switch (type) {
            case 'critical':
                return 'bg-red-50 border-l-4 border-red-500';
            case 'warning':
                return 'bg-yellow-50 border-l-4 border-yellow-500';
            case 'success':
                return 'bg-green-50 border-l-4 border-green-500';
            default:
                return 'bg-blue-50 border-l-4 border-blue-500';
        }
    };

    const toggleSetting = (categoryIdx, itemIdx, channel) => {
        setSettings(prev => {
            const newSettings = [...prev];
            newSettings[categoryIdx].items[itemIdx][channel] = !newSettings[categoryIdx].items[itemIdx][channel];
            return newSettings;
        });
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">PNR Notifications</h1>
                    <p className="text-gray-500 mt-1">Manage alerts and notification preferences</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        {unreadCount} unread
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Mark all as read
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`pb-3 text-sm font-medium ${
                            activeTab === 'notifications'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <BellIcon className="w-4 h-4 inline mr-1" />
                        Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`pb-3 text-sm font-medium ${
                            activeTab === 'settings'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Cog6ToothIcon className="w-4 h-4 inline mr-1" />
                        Settings
                    </button>
                </nav>
            </div>

            {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${getNotificationBg(notification.type, notification.read)}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className={`text-sm font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-xs text-gray-400">{notification.time}</span>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                        {notification.agent}
                                                    </span>
                                                </div>
                                            </div>
                                            {!notification.read && (
                                                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-200 text-center">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="space-y-6">
                    {settings.map((category, categoryIdx) => (
                        <div key={category.category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="pb-3 text-sm font-medium text-gray-500">Notification</th>
                                            <th className="pb-3 text-center text-sm font-medium text-gray-500">
                                                <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                                                Email
                                            </th>
                                            <th className="pb-3 text-center text-sm font-medium text-gray-500">
                                                <DevicePhoneMobileIcon className="w-4 h-4 inline mr-1" />
                                                SMS
                                            </th>
                                            <th className="pb-3 text-center text-sm font-medium text-gray-500">
                                                <ComputerDesktopIcon className="w-4 h-4 inline mr-1" />
                                                Push
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {category.items.map((item, itemIdx) => (
                                            <tr key={item.id}>
                                                <td className="py-3 text-sm text-gray-700">{item.label}</td>
                                                <td className="py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.email}
                                                        onChange={() => toggleSetting(categoryIdx, itemIdx, 'email')}
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.sms}
                                                        onChange={() => toggleSetting(categoryIdx, itemIdx, 'sms')}
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.push}
                                                        onChange={() => toggleSetting(categoryIdx, itemIdx, 'push')}
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Save Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PNRNotifications;

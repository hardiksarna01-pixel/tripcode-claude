/**
 * Webhooks Management Page
 * Configure and manage webhook endpoints
 */

import React, { useState } from 'react';
import {
    LinkIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PlayIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const webhooks = [
    {
        id: 1,
        name: 'Booking Notifications',
        url: 'https://api.mycompany.com/webhooks/bookings',
        events: ['booking.created', 'booking.updated', 'booking.cancelled'],
        status: 'active',
        lastTriggered: '2024-02-28 14:30',
        successRate: 98
    },
    {
        id: 2,
        name: 'Payment Webhooks',
        url: 'https://api.mycompany.com/webhooks/payments',
        events: ['payment.success', 'payment.failed', 'refund.processed'],
        status: 'active',
        lastTriggered: '2024-02-28 13:15',
        successRate: 100
    },
    {
        id: 3,
        name: 'Slack Notifications',
        url: 'https://hooks.slack.com/services/xxxxx',
        events: ['booking.created'],
        status: 'inactive',
        lastTriggered: '2024-02-20 09:00',
        successRate: 85
    }
];

const availableEvents = [
    { category: 'Bookings', events: ['booking.created', 'booking.updated', 'booking.cancelled', 'booking.completed'] },
    { category: 'Payments', events: ['payment.success', 'payment.failed', 'payment.pending', 'refund.processed'] },
    { category: 'Agents', events: ['agent.registered', 'agent.approved', 'agent.suspended'] },
    { category: 'System', events: ['system.maintenance', 'system.alert'] }
];

const Webhooks = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newWebhook, setNewWebhook] = useState({ name: '', url: '', events: [] });

    const toggleEvent = (event) => {
        if (newWebhook.events.includes(event)) {
            setNewWebhook(prev => ({
                ...prev,
                events: prev.events.filter(e => e !== event)
            }));
        } else {
            setNewWebhook(prev => ({
                ...prev,
                events: [...prev.events, event]
            }));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
                    <p className="text-gray-500 mt-1">Configure webhook endpoints for real-time notifications</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Webhook
                </button>
            </div>

            {/* Create Webhook Modal */}
            {showCreateModal && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Webhook</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Webhook Name
                            </label>
                            <input
                                type="text"
                                value={newWebhook.name}
                                onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., Booking Notifications"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Endpoint URL
                            </label>
                            <input
                                type="url"
                                value={newWebhook.url}
                                onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                                placeholder="https://your-server.com/webhooks"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Events to Subscribe
                            </label>
                            <div className="space-y-3">
                                {availableEvents.map((category) => (
                                    <div key={category.category}>
                                        <p className="text-sm font-medium text-gray-600 mb-1">{category.category}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {category.events.map((event) => (
                                                <button
                                                    key={event}
                                                    onClick={() => toggleEvent(event)}
                                                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                                                        newWebhook.events.includes(event)
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {event}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Create Webhook
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Webhooks List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-blue-600" />
                        Configured Webhooks
                    </h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {webhooks.map((webhook) => (
                        <div key={webhook.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        webhook.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                        <LinkIcon className={`w-5 h-5 ${
                                            webhook.status === 'active' ? 'text-green-600' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{webhook.name}</p>
                                        <p className="text-sm text-gray-500 font-mono">{webhook.url}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {webhook.status === 'active' ? (
                                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-sm">
                                            Inactive
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Test Webhook">
                                            <PlayIcon className="w-5 h-5" />
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
                            <div className="flex flex-wrap gap-2 mt-2">
                                {webhook.events.map((event) => (
                                    <span key={event} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                        {event}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <span>Last triggered: {webhook.lastTriggered}</span>
                                <span className={webhook.successRate >= 95 ? 'text-green-600' : 'text-yellow-600'}>
                                    Success rate: {webhook.successRate}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Deliveries */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span>Recent Deliveries</span>
                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                        <ArrowPathIcon className="w-4 h-4" />
                        Refresh
                    </button>
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-4 py-2 font-medium text-gray-700">Event</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-700">Webhook</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-700">Status</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-700">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs">booking.created</td>
                                <td className="px-4 py-3">Booking Notifications</td>
                                <td className="px-4 py-3">
                                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">200 OK</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">2 mins ago</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs">payment.success</td>
                                <td className="px-4 py-3">Payment Webhooks</td>
                                <td className="px-4 py-3">
                                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">200 OK</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">5 mins ago</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs">booking.cancelled</td>
                                <td className="px-4 py-3">Booking Notifications</td>
                                <td className="px-4 py-3">
                                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs">500 Error</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">15 mins ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Webhooks;

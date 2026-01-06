import React, { useState } from 'react';
import {
    MegaphoneIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

const SuperAdminAnnouncements = () => {
    const [showCreate, setShowCreate] = useState(false);

    const announcements = [
        { id: 1, title: 'Platform Maintenance Scheduled', message: 'System maintenance on June 20th, 2024 from 2 AM to 4 AM IST', type: 'maintenance', audience: 'all', status: 'active', created: '2024-06-15' },
        { id: 2, title: 'New Feature: AI Recommendations', message: 'We have launched AI-powered travel recommendations for Enterprise users', type: 'feature', audience: 'Enterprise', status: 'active', created: '2024-06-10' },
        { id: 3, title: 'API Rate Limit Update', message: 'API rate limits have been increased for all plans effective July 1st', type: 'update', audience: 'all', status: 'scheduled', created: '2024-06-08' },
        { id: 4, title: 'Holiday Support Hours', message: 'Support hours during the upcoming holiday period', type: 'info', audience: 'all', status: 'expired', created: '2024-05-25' }
    ];

    const getTypeBadge = (type) => {
        const styles = {
            maintenance: 'bg-orange-100 text-orange-800',
            feature: 'bg-green-100 text-green-800',
            update: 'bg-blue-100 text-blue-800',
            info: 'bg-gray-100 text-gray-800'
        };
        return `px-2 py-1 rounded text-xs font-medium ${styles[type]}`;
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            scheduled: 'bg-yellow-100 text-yellow-800',
            expired: 'bg-gray-100 text-gray-800'
        };
        return `px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Announcements</h1>
                            <p className="text-indigo-200">Broadcast messages to all companies</p>
                        </div>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="px-4 py-2 bg-white text-indigo-900 rounded-lg flex items-center gap-2 hover:bg-indigo-50"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Create Announcement
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Announcements List */}
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                        announcement.type === 'maintenance' ? 'bg-orange-100' :
                                        announcement.type === 'feature' ? 'bg-green-100' :
                                        announcement.type === 'update' ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>
                                        <MegaphoneIcon className={`w-6 h-6 ${
                                            announcement.type === 'maintenance' ? 'text-orange-600' :
                                            announcement.type === 'feature' ? 'text-green-600' :
                                            announcement.type === 'update' ? 'text-blue-600' : 'text-gray-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold">{announcement.title}</h3>
                                            <span className={getTypeBadge(announcement.type)}>{announcement.type}</span>
                                            <span className={getStatusBadge(announcement.status)}>{announcement.status}</span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{announcement.message}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>Audience: {announcement.audience}</span>
                                            <span>Created: {announcement.created}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-gray-100 rounded">
                                        <PencilIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded">
                                        <TrashIcon className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminAnnouncements;

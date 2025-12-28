import React, { useState } from 'react';
import {
    ServerIcon,
    CpuChipIcon,
    CircleStackIcon,
    SignalIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const SuperAdminSystemHealth = () => {
    const services = [
        { name: 'API Gateway', status: 'healthy', uptime: 99.99, latency: 45, lastCheck: '30 secs ago' },
        { name: 'Database Primary', status: 'healthy', uptime: 99.95, latency: 12, lastCheck: '30 secs ago' },
        { name: 'Database Replica', status: 'healthy', uptime: 99.90, latency: 15, lastCheck: '30 secs ago' },
        { name: 'Redis Cache', status: 'healthy', uptime: 99.98, latency: 2, lastCheck: '30 secs ago' },
        { name: 'Payment Gateway', status: 'degraded', uptime: 98.50, latency: 250, lastCheck: '30 secs ago' },
        { name: 'Email Service', status: 'healthy', uptime: 99.92, latency: 180, lastCheck: '30 secs ago' },
        { name: 'SMS Gateway', status: 'healthy', uptime: 99.88, latency: 85, lastCheck: '30 secs ago' },
        { name: 'File Storage', status: 'healthy', uptime: 99.99, latency: 35, lastCheck: '30 secs ago' }
    ];

    const serverMetrics = {
        cpu: 45,
        memory: 68,
        disk: 52,
        network: 35
    };

    const recentIncidents = [
        { id: 'INC001', service: 'Payment Gateway', issue: 'High latency detected', severity: 'warning', time: '2 hours ago', status: 'investigating' },
        { id: 'INC002', service: 'Database Primary', issue: 'Connection pool exhaustion', severity: 'critical', time: '1 day ago', status: 'resolved' },
        { id: 'INC003', service: 'API Gateway', issue: 'Rate limit exceeded', severity: 'info', time: '3 days ago', status: 'resolved' }
    ];

    const getStatusIcon = (status) => {
        if (status === 'healthy') return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
        if (status === 'degraded') return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
    };

    const getMetricColor = (value) => {
        if (value > 80) return 'bg-red-500';
        if (value > 60) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">System Health</h1>
                            <p className="text-indigo-200">Monitor platform infrastructure</p>
                        </div>
                        <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg">
                            <CheckCircleIcon className="w-5 h-5 text-green-400" />
                            <span>All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Server Metrics */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CpuChipIcon className="w-5 h-5" />
                            <span className="text-sm">CPU Usage</span>
                        </div>
                        <div className="text-2xl font-bold">{serverMetrics.cpu}%</div>
                        <div className="h-2 bg-gray-100 rounded-full mt-2">
                            <div className={`h-2 rounded-full ${getMetricColor(serverMetrics.cpu)}`} style={{ width: `${serverMetrics.cpu}%` }} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CircleStackIcon className="w-5 h-5" />
                            <span className="text-sm">Memory</span>
                        </div>
                        <div className="text-2xl font-bold">{serverMetrics.memory}%</div>
                        <div className="h-2 bg-gray-100 rounded-full mt-2">
                            <div className={`h-2 rounded-full ${getMetricColor(serverMetrics.memory)}`} style={{ width: `${serverMetrics.memory}%` }} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <ServerIcon className="w-5 h-5" />
                            <span className="text-sm">Disk</span>
                        </div>
                        <div className="text-2xl font-bold">{serverMetrics.disk}%</div>
                        <div className="h-2 bg-gray-100 rounded-full mt-2">
                            <div className={`h-2 rounded-full ${getMetricColor(serverMetrics.disk)}`} style={{ width: `${serverMetrics.disk}%` }} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <SignalIcon className="w-5 h-5" />
                            <span className="text-sm">Network</span>
                        </div>
                        <div className="text-2xl font-bold">{serverMetrics.network}%</div>
                        <div className="h-2 bg-gray-100 rounded-full mt-2">
                            <div className={`h-2 rounded-full ${getMetricColor(serverMetrics.network)}`} style={{ width: `${serverMetrics.network}%` }} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Services Status */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold">Service Status</h2>
                        </div>
                        <div className="divide-y">
                            {services.map((service, index) => (
                                <div key={index} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(service.status)}
                                        <div>
                                            <div className="font-medium">{service.name}</div>
                                            <div className="text-xs text-gray-500">{service.lastCheck}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm">{service.uptime}% uptime</div>
                                        <div className="text-xs text-gray-500">{service.latency}ms latency</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Incidents */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold">Recent Incidents</h2>
                        </div>
                        <div className="divide-y">
                            {recentIncidents.map((incident) => (
                                <div key={incident.id} className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="font-medium">{incident.service}</div>
                                            <div className="text-sm text-gray-600">{incident.issue}</div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {incident.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className={`px-2 py-0.5 rounded ${
                                            incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                            incident.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {incident.severity}
                                        </span>
                                        <span>{incident.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminSystemHealth;

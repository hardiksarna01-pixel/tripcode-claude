import React from 'react';
import { Activity, Server, Database, Globe, CheckCircle, AlertTriangle, XCircle, RefreshCw, Clock, Cpu, HardDrive, Wifi } from 'lucide-react';

const SystemHealth = () => {
  const services = [
    { name: 'API Gateway', status: 'operational', uptime: '99.99%', responseTime: '45ms', icon: Globe },
    { name: 'Database Primary', status: 'operational', uptime: '99.95%', responseTime: '12ms', icon: Database },
    { name: 'Database Replica', status: 'operational', uptime: '99.90%', responseTime: '15ms', icon: Database },
    { name: 'Authentication Service', status: 'operational', uptime: '99.99%', responseTime: '32ms', icon: Server },
    { name: 'Flight Search API', status: 'degraded', uptime: '98.50%', responseTime: '250ms', icon: Activity },
    { name: 'Payment Gateway', status: 'operational', uptime: '99.99%', responseTime: '180ms', icon: Server },
    { name: 'Email Service', status: 'operational', uptime: '99.85%', responseTime: '95ms', icon: Server },
    { name: 'CDN', status: 'operational', uptime: '99.99%', responseTime: '8ms', icon: Globe },
  ];

  const serverMetrics = [
    { name: 'CPU Usage', value: 42, max: 100, unit: '%', icon: Cpu, color: 'bg-blue-500' },
    { name: 'Memory', value: 68, max: 100, unit: '%', icon: Server, color: 'bg-purple-500' },
    { name: 'Disk Usage', value: 55, max: 100, unit: '%', icon: HardDrive, color: 'bg-green-500' },
    { name: 'Network I/O', value: 245, max: 1000, unit: 'Mbps', icon: Wifi, color: 'bg-indigo-500' },
  ];

  const recentIncidents = [
    { date: '2024-03-01', title: 'Flight Search API Latency', status: 'investigating', duration: 'Ongoing' },
    { date: '2024-02-28', title: 'Database Maintenance', status: 'resolved', duration: '2h 15m' },
    { date: '2024-02-25', title: 'CDN Cache Issue', status: 'resolved', duration: '45m' },
    { date: '2024-02-20', title: 'Payment Gateway Timeout', status: 'resolved', duration: '1h 30m' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'down': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-700';
      case 'degraded': return 'bg-yellow-100 text-yellow-700';
      case 'down': return 'bg-red-100 text-red-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'investigating': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-500 mt-1">Monitor platform services and infrastructure</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Overall Status */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">All Systems Operational</h2>
            <p className="text-green-100">7 of 8 services running smoothly. 1 service degraded.</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-green-100">
            <Clock size={16} />
            Last checked: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Server Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {serverMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <metric.icon className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">{metric.name}</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{metric.value}{metric.unit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${metric.color} h-2 rounded-full transition-all`}
                style={{ width: `${(metric.value / metric.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Services Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-500">Response: {service.responseTime}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(service.status)}`}>
                  {service.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">{service.uptime} uptime</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Incidents</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentIncidents.map((incident, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">{incident.date}</div>
                <div>
                  <p className="font-medium text-gray-900">{incident.title}</p>
                  <p className="text-sm text-gray-500">Duration: {incident.duration}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(incident.status)}`}>
                {incident.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;

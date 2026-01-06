import React, { useState } from 'react';
import {
    AcademicCapIcon,
    BookOpenIcon,
    UserGroupIcon,
    CurrencyRupeeIcon,
    DocumentCheckIcon,
    PlusIcon,
    PencilIcon,
    EyeIcon,
    ChartBarIcon,
    BuildingOfficeIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowTrendingUpIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

const CertificationManagement = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Mock data
    const stats = {
        totalCourses: 24,
        activeEnrollments: 156,
        completedCourses: 89,
        totalRevenue: 1245000,
        certificatesIssued: 78,
        membershipApplications: 12,
        pendingApplications: 5
    };

    const recentEnrollments = [
        { id: 1, agentName: 'Rajesh Sharma', course: 'IATA Foundation', date: '2024-06-14', amount: 32999, status: 'active' },
        { id: 2, agentName: 'Priya Patel', course: 'Amadeus Basic', date: '2024-06-13', amount: 12999, status: 'active' },
        { id: 3, agentName: 'Amit Kumar', course: 'Dubai Specialist', date: '2024-06-12', amount: 4999, status: 'completed' },
        { id: 4, agentName: 'Sneha Reddy', course: 'Travel Startup', date: '2024-06-11', amount: 12999, status: 'active' },
        { id: 5, agentName: 'Vikram Singh', course: 'IATA Fares', date: '2024-06-10', amount: 79999, status: 'active' },
    ];

    const membershipApplications = [
        { id: 1, agentName: 'Travel World Pvt Ltd', body: 'TAFI', type: 'Active Membership', date: '2024-06-14', status: 'pending', fee: 17999 },
        { id: 2, agentName: 'Global Tours India', body: 'IATO', type: 'Active Membership', date: '2024-06-13', status: 'under_review', fee: 23999 },
        { id: 3, agentName: 'Holiday Makers', body: 'TAAI', type: 'Membership', date: '2024-06-12', status: 'approved', fee: 14999 },
        { id: 4, agentName: 'Adventure India', body: 'ATOAI', type: 'Membership', date: '2024-06-11', status: 'pending', fee: 14999 },
        { id: 5, agentName: 'Domestic Tours Co', body: 'ADTOI', type: 'Membership', date: '2024-06-10', status: 'documents_requested', fee: 12999 },
    ];

    const courses = [
        { id: 1, name: 'IATA Foundation in Travel & Tourism', body: 'IATA', enrollments: 45, revenue: 1484955, status: 'published' },
        { id: 2, name: 'Amadeus Basic Certification', body: 'Amadeus', enrollments: 62, revenue: 805438, status: 'published' },
        { id: 3, name: 'Travel Business Startup', body: 'TripCode', enrollments: 28, revenue: 363972, status: 'published' },
        { id: 4, name: 'IATA Fares & Ticketing', body: 'IATA', enrollments: 18, revenue: 1439982, status: 'published' },
        { id: 5, name: 'Dubai Destination Specialist', body: 'TripCode', enrollments: 35, revenue: 174965, status: 'published' },
        { id: 6, name: 'Sabre Basic Certification', body: 'Sabre', enrollments: 0, revenue: 0, status: 'draft' },
    ];

    const partnerBodies = [
        { code: 'IATA', name: 'IATA', status: 'partner', courses: 3, commission: 25 },
        { code: 'TAFI', name: 'TAFI', status: 'partner', courses: 0, commission: 15 },
        { code: 'AMADEUS', name: 'Amadeus', status: 'partner', courses: 2, commission: 30 },
        { code: 'IATO', name: 'IATO', status: 'in_progress', courses: 0, commission: 0 },
        { code: 'SABRE', name: 'Sabre', status: 'prospect', courses: 0, commission: 0 },
    ];

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
        { id: 'courses', name: 'Courses', icon: BookOpenIcon },
        { id: 'enrollments', name: 'Enrollments', icon: UserGroupIcon },
        { id: 'memberships', name: 'Memberships', icon: BuildingOfficeIcon },
        { id: 'certificates', name: 'Certificates', icon: DocumentCheckIcon },
        { id: 'partners', name: 'Partners', icon: BuildingOfficeIcon },
        { id: 'revenue', name: 'Revenue', icon: CurrencyRupeeIcon },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            under_review: 'bg-blue-100 text-blue-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            documents_requested: 'bg-purple-100 text-purple-800',
            active: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            published: 'bg-green-100 text-green-800',
            draft: 'bg-gray-100 text-gray-800',
            partner: 'bg-green-100 text-green-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            prospect: 'bg-gray-100 text-gray-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Certification Management</h1>
                            <p className="text-gray-600">Manage courses, certifications, and memberships</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                <DocumentTextIcon className="w-5 h-5" />
                                Export Report
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                <PlusIcon className="w-5 h-5" />
                                Create Course
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {activeTab === 'dashboard' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Courses</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BookOpenIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Active Enrollments</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.activeEnrollments}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <UserGroupIcon className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Certificates Issued</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.certificatesIssued}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <DocumentCheckIcon className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <CurrencyRupeeIcon className="w-6 h-6 text-amber-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Enrollments */}
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-4 border-b flex items-center justify-between">
                                    <h2 className="font-semibold text-gray-900">Recent Enrollments</h2>
                                    <button className="text-blue-600 text-sm hover:underline">View All</button>
                                </div>
                                <div className="divide-y">
                                    {recentEnrollments.map((enrollment) => (
                                        <div key={enrollment.id} className="p-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{enrollment.agentName}</p>
                                                <p className="text-sm text-gray-500">{enrollment.course}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">₹{enrollment.amount.toLocaleString()}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(enrollment.status)}`}>
                                                    {enrollment.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Membership Applications */}
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-4 border-b flex items-center justify-between">
                                    <h2 className="font-semibold text-gray-900">Membership Applications</h2>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                        {stats.pendingApplications} pending
                                    </span>
                                </div>
                                <div className="divide-y">
                                    {membershipApplications.map((app) => (
                                        <div key={app.id} className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="font-medium text-gray-900">{app.agentName}</p>
                                                    <p className="text-sm text-gray-500">{app.body} - {app.type}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(app.status)}`}>
                                                    {app.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            {app.status === 'pending' && (
                                                <div className="flex gap-2 mt-2">
                                                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                                        Approve
                                                    </button>
                                                    <button className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600">
                                                        Request Docs
                                                    </button>
                                                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Courses */}
                        <div className="bg-white rounded-xl shadow-sm mt-6">
                            <div className="p-4 border-b">
                                <h2 className="font-semibold text-gray-900">Course Performance</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Body</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrollments</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {courses.map((course) => (
                                            <tr key={course.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-900">{course.name}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                        {course.body}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-900">{course.enrollments}</td>
                                                <td className="px-4 py-3 text-gray-900">₹{course.revenue.toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(course.status)}`}>
                                                        {course.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button className="p-1 hover:bg-gray-100 rounded">
                                                            <EyeIcon className="w-4 h-4 text-gray-500" />
                                                        </button>
                                                        <button className="p-1 hover:bg-gray-100 rounded">
                                                            <PencilIcon className="w-4 h-4 text-gray-500" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'partners' && (
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Partnership Status</h2>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                + Add Partner
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission %</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {partnerBodies.map((partner) => (
                                        <tr key={partner.code} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600">
                                                        {partner.code.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{partner.name}</p>
                                                        <p className="text-sm text-gray-500">{partner.code}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(partner.status)}`}>
                                                    {partner.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-900">{partner.courses}</td>
                                            <td className="px-4 py-3 text-gray-900">{partner.commission}%</td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 text-sm hover:underline">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab !== 'dashboard' && activeTab !== 'partners' && (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{tabs.find(t => t.id === activeTab)?.name}</h3>
                        <p className="text-gray-500">This section is under development. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificationManagement;

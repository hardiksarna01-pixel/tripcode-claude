import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    PlayIcon,
    ClockIcon,
    CheckCircleIcon,
    AcademicCapIcon,
    DocumentCheckIcon,
    ArrowRightIcon,
    BookOpenIcon,
    TrophyIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

const MyCourses = () => {
    const [activeTab, setActiveTab] = useState('in_progress');
    const [enrollments, setEnrollments] = useState([]);

    // Mock data
    const mockEnrollments = [
        {
            id: 1,
            courseTitle: 'IATA Foundation in Travel & Tourism',
            thumbnail: '/courses/iata-foundation.jpg',
            body: 'IATA',
            progress: 65,
            lessonsCompleted: 13,
            totalLessons: 20,
            lastAccessed: '2024-06-14',
            status: 'in_progress',
            examPassed: false,
            durationHours: 60
        },
        {
            id: 2,
            courseTitle: 'Amadeus Basic Certification',
            thumbnail: '/courses/amadeus-basic.jpg',
            body: 'Amadeus',
            progress: 100,
            lessonsCompleted: 15,
            totalLessons: 15,
            lastAccessed: '2024-06-10',
            status: 'completed',
            examPassed: true,
            examScore: 85,
            certificateId: 'CERT-001',
            durationHours: 40
        },
        {
            id: 3,
            courseTitle: 'Dubai Destination Specialist',
            thumbnail: '/courses/dubai-specialist.jpg',
            body: 'TripCode',
            progress: 30,
            lessonsCompleted: 5,
            totalLessons: 15,
            lastAccessed: '2024-06-12',
            status: 'in_progress',
            examPassed: false,
            durationHours: 15
        },
        {
            id: 4,
            courseTitle: 'Travel Business Startup',
            thumbnail: '/courses/travel-startup.jpg',
            body: 'TripCode',
            progress: 100,
            lessonsCompleted: 18,
            totalLessons: 18,
            lastAccessed: '2024-05-20',
            status: 'completed',
            examPassed: true,
            examScore: 92,
            certificateId: 'CERT-002',
            durationHours: 50
        }
    ];

    useEffect(() => {
        setEnrollments(mockEnrollments);
    }, []);

    const filteredEnrollments = enrollments.filter(e => {
        if (activeTab === 'in_progress') return e.status === 'in_progress';
        if (activeTab === 'completed') return e.status === 'completed';
        return true;
    });

    const stats = {
        inProgress: enrollments.filter(e => e.status === 'in_progress').length,
        completed: enrollments.filter(e => e.status === 'completed').length,
        certificates: enrollments.filter(e => e.certificateId).length,
        totalHours: enrollments.reduce((acc, e) => acc + (e.progress / 100 * e.durationHours), 0).toFixed(0)
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <BookOpenIcon className="w-5 h-5" />
                        <Link to="/certification" className="hover:underline">Certification Hub</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">My Learning</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">My Learning</h1>
                    <p className="text-gray-600">Track your course progress and continue learning</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <PlayIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
                                <div className="text-sm text-gray-500">In Progress</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                                <div className="text-sm text-gray-500">Completed</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <DocumentCheckIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.certificates}</div>
                                <div className="text-sm text-gray-500">Certificates</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <ClockIcon className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.totalHours}h</div>
                                <div className="text-sm text-gray-500">Learning Time</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    {[
                        { id: 'in_progress', label: 'In Progress', count: stats.inProgress },
                        { id: 'completed', label: 'Completed', count: stats.completed },
                        { id: 'all', label: 'All Courses', count: enrollments.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Course Cards */}
                {filteredEnrollments.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-500 mb-6">
                            {activeTab === 'in_progress'
                                ? "You don't have any courses in progress."
                                : activeTab === 'completed'
                                ? "You haven't completed any courses yet."
                                : "You haven't enrolled in any courses yet."}
                        </p>
                        <Link
                            to="/certification/courses"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <BookOpenIcon className="w-5 h-5" />
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredEnrollments.map((enrollment) => (
                            <div key={enrollment.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="flex">
                                    {/* Thumbnail */}
                                    <div className="w-48 h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <AcademicCapIcon className="w-16 h-16 text-white/50" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                                {enrollment.body}
                                            </span>
                                            {enrollment.status === 'completed' && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded flex items-center gap-1">
                                                    <CheckCircleIcon className="w-3 h-3" /> Completed
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-semibold text-gray-900 mb-3">{enrollment.courseTitle}</h3>

                                        {/* Progress Bar */}
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                                <span>{enrollment.lessonsCompleted}/{enrollment.totalLessons} lessons</span>
                                                <span>{enrollment.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${
                                                        enrollment.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                                                    }`}
                                                    style={{ width: `${enrollment.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {enrollment.status === 'in_progress' ? (
                                                <Link
                                                    to={`/certification/learn/${enrollment.id}`}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    <PlayIcon className="w-4 h-4" />
                                                    Continue Learning
                                                </Link>
                                            ) : (
                                                <>
                                                    {enrollment.examPassed && enrollment.certificateId && (
                                                        <Link
                                                            to={`/certification/certificates/${enrollment.certificateId}`}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                                        >
                                                            <DocumentCheckIcon className="w-4 h-4" />
                                                            View Certificate
                                                        </Link>
                                                    )}
                                                    <Link
                                                        to={`/certification/learn/${enrollment.id}`}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                                                    >
                                                        Review Course
                                                    </Link>
                                                </>
                                            )}
                                        </div>

                                        {/* Exam Score */}
                                        {enrollment.examPassed && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                                <TrophyIcon className="w-4 h-4 text-amber-500" />
                                                Exam Score: {enrollment.examScore}%
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recommended Courses */}
                <div className="mt-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended For You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { name: 'IATA Fares & Ticketing', body: 'IATA', price: 79999, level: 'Advanced' },
                            { name: 'Sabre Basic Certification', body: 'Sabre', price: 12999, level: 'Foundation' },
                            { name: 'Europe Travel Specialist', body: 'TripCode', price: 6999, level: 'Intermediate' }
                        ].map((course, index) => (
                            <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                    {course.body}
                                </span>
                                <h3 className="font-semibold text-gray-900 mt-3 mb-2">{course.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">₹{course.price.toLocaleString()}</span>
                                    <span className="text-sm text-gray-500">{course.level}</span>
                                </div>
                                <Link
                                    to={`/certification/courses`}
                                    className="mt-4 block text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCourses;

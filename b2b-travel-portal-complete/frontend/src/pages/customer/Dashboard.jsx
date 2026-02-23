import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    TicketIcon,
    CalendarIcon,
    HeartIcon,
    CreditCardIcon,
    BellIcon,
    UserCircleIcon,
    PaperAirplaneIcon,
    BuildingOfficeIcon,
    TruckIcon,
    GlobeAltIcon,
    ClockIcon,
    MapPinIcon,
    ArrowRightIcon,
    SparklesIcon,
    StarIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const CustomerDashboard = () => {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+91 9876543210',
        memberSince: 'Jan 2024',
        totalBookings: 12,
        savedAmount: 8500,
        rewardPoints: 2500
    });

    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/customer/dashboard');
            if (response.data) {
                setUser(response.data.user);
                setUpcomingTrips(response.data.upcomingTrips);
                setRecentBookings(response.data.recentBookings);
            }
        } catch (error) {
            setUpcomingTrips(mockUpcomingTrips);
            setRecentBookings(mockRecentBookings);
            setNotifications(mockNotifications);
        }
    };

    const mockUpcomingTrips = [
        {
            id: 'BK001',
            type: 'flight',
            from: 'Delhi',
            to: 'Mumbai',
            date: '2024-06-25',
            time: '06:00 AM',
            airline: 'IndiGo',
            pnr: 'ABC123',
            status: 'confirmed'
        },
        {
            id: 'BK002',
            type: 'hotel',
            hotelName: 'Taj Hotel',
            location: 'Goa',
            checkIn: '2024-07-01',
            checkOut: '2024-07-04',
            nights: 3,
            status: 'confirmed'
        }
    ];

    const mockRecentBookings = [
        { id: 'BK003', type: 'flight', route: 'BLR → HYD', date: '2024-05-15', amount: 4500, status: 'completed' },
        { id: 'BK004', type: 'hotel', route: 'Manali - Snow View', date: '2024-05-01', amount: 12000, status: 'completed' },
        { id: 'BK005', type: 'bus', route: 'Mumbai → Pune', date: '2024-04-20', amount: 800, status: 'completed' }
    ];

    const mockNotifications = [
        { id: 1, message: 'Your flight to Mumbai is in 3 days!', type: 'reminder', time: '2 hours ago' },
        { id: 2, message: 'You earned 500 reward points!', type: 'reward', time: '1 day ago' },
        { id: 3, message: 'Special offer: 20% off on hotels!', type: 'offer', time: '2 days ago' }
    ];

    const quickActions = [
        { name: 'Book Flight', icon: PaperAirplaneIcon, path: '/flights', color: 'blue' },
        { name: 'Book Hotel', icon: BuildingOfficeIcon, path: '/hotels', color: 'green' },
        { name: 'Book Bus', icon: TruckIcon, path: '/bus', color: 'orange' },
        { name: 'Holiday Package', icon: GlobeAltIcon, path: '/holidays', color: 'purple' }
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'flight': return PaperAirplaneIcon;
            case 'hotel': return BuildingOfficeIcon;
            case 'bus': return TruckIcon;
            default: return TicketIcon;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <UserCircleIcon className="w-12 h-12 text-white" />
                            </div>
                            <div className="text-white">
                                <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
                                <p className="text-blue-100">Member since {user.memberSince}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                to="/customer/profile"
                                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
                            >
                                Edit Profile
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-3xl font-bold">{user.totalBookings}</div>
                            <div className="text-blue-100 text-sm">Total Bookings</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-3xl font-bold">₹{user.savedAmount.toLocaleString()}</div>
                            <div className="text-blue-100 text-sm">Total Saved</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-3xl font-bold flex items-center gap-2">
                                <SparklesIcon className="w-6 h-6 text-yellow-300" />
                                {user.rewardPoints}
                            </div>
                            <div className="text-blue-100 text-sm">Reward Points</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="font-semibold text-lg text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.path}
                                className={`flex flex-col items-center p-4 rounded-xl transition hover:scale-105 ${
                                    action.color === 'blue' ? 'bg-blue-50 hover:bg-blue-100' :
                                    action.color === 'green' ? 'bg-green-50 hover:bg-green-100' :
                                    action.color === 'orange' ? 'bg-orange-50 hover:bg-orange-100' :
                                    'bg-purple-50 hover:bg-purple-100'
                                }`}
                            >
                                <action.icon className={`w-8 h-8 mb-2 ${
                                    action.name === 'Book Flight' ? 'rotate-45' : ''
                                } ${
                                    action.color === 'blue' ? 'text-blue-600' :
                                    action.color === 'green' ? 'text-green-600' :
                                    action.color === 'orange' ? 'text-orange-600' :
                                    'text-purple-600'
                                }`} />
                                <span className="text-sm font-medium text-gray-700">{action.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming Trips */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-lg flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                                    Upcoming Trips
                                </h2>
                                <Link to="/customer/bookings" className="text-blue-600 text-sm hover:underline">
                                    View All
                                </Link>
                            </div>
                            <div className="divide-y">
                                {(upcomingTrips.length > 0 ? upcomingTrips : mockUpcomingTrips).map((trip, index) => {
                                    const Icon = getTypeIcon(trip.type);
                                    return (
                                        <div key={index} className="p-4 hover:bg-gray-50 transition">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                    trip.type === 'flight' ? 'bg-blue-100' :
                                                    trip.type === 'hotel' ? 'bg-green-100' :
                                                    'bg-orange-100'
                                                }`}>
                                                    <Icon className={`w-6 h-6 ${
                                                        trip.type === 'flight' ? 'text-blue-600 rotate-45' :
                                                        trip.type === 'hotel' ? 'text-green-600' :
                                                        'text-orange-600'
                                                    }`} />
                                                </div>
                                                <div className="flex-1">
                                                    {trip.type === 'flight' ? (
                                                        <>
                                                            <div className="font-medium text-gray-900">
                                                                {trip.from} → {trip.to}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {trip.airline} • {trip.date} at {trip.time}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                PNR: <span className="font-mono font-medium">{trip.pnr}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="font-medium text-gray-900">
                                                                {trip.hotelName}
                                                            </div>
                                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                                <MapPinIcon className="w-4 h-4" />
                                                                {trip.location}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {trip.checkIn} - {trip.checkOut} ({trip.nights} nights)
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                                                        <CheckCircleIcon className="w-3 h-3" />
                                                        {trip.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {upcomingTrips.length === 0 && mockUpcomingTrips.length === 0 && (
                                    <div className="p-8 text-center text-gray-500">
                                        <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>No upcoming trips</p>
                                        <Link to="/flights" className="text-blue-600 hover:underline mt-2 inline-block">
                                            Book your next adventure →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Bookings */}
                        <div className="bg-white rounded-xl shadow-sm mt-6">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-lg flex items-center gap-2">
                                    <ClockIcon className="w-5 h-5 text-gray-500" />
                                    Recent Bookings
                                </h2>
                            </div>
                            <div className="divide-y">
                                {(recentBookings.length > 0 ? recentBookings : mockRecentBookings).map((booking, index) => {
                                    const Icon = getTypeIcon(booking.type);
                                    return (
                                        <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-3">
                                                <Icon className={`w-5 h-5 ${
                                                    booking.type === 'flight' ? 'text-blue-600 rotate-45' :
                                                    booking.type === 'hotel' ? 'text-green-600' :
                                                    'text-orange-600'
                                                }`} />
                                                <div>
                                                    <div className="font-medium text-gray-900">{booking.route}</div>
                                                    <div className="text-sm text-gray-500">{booking.date}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">₹{booking.amount.toLocaleString()}</div>
                                                <span className="text-xs text-green-600">{booking.status}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Notifications */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="font-semibold text-lg flex items-center gap-2">
                                    <BellIcon className="w-5 h-5 text-gray-500" />
                                    Notifications
                                </h2>
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {mockNotifications.length}
                                </span>
                            </div>
                            <div className="divide-y">
                                {mockNotifications.map((notification) => (
                                    <div key={notification.id} className="p-4 hover:bg-gray-50 transition">
                                        <p className="text-sm text-gray-700">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Saved Items */}
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                                <HeartIcon className="w-5 h-5 text-red-500" />
                                Saved Items
                            </h2>
                            <div className="text-center py-6 text-gray-500">
                                <HeartIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No saved items yet</p>
                                <p className="text-xs text-gray-400 mt-1">Save flights and hotels to compare later</p>
                            </div>
                        </div>

                        {/* Special Offers */}
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
                            <SparklesIcon className="w-8 h-8 mb-3" />
                            <h3 className="font-bold text-lg mb-2">Special Offer!</h3>
                            <p className="text-sm text-white/90 mb-4">
                                Get 20% off on your next hotel booking. Use code: SAVE20
                            </p>
                            <Link
                                to="/hotels"
                                className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition"
                            >
                                Book Now <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;

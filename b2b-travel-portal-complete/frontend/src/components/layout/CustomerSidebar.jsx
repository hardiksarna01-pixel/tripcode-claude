/**
 * Customer Sidebar Component - COMPLETE
 * Full navigation sidebar for B2C customer portal
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    TicketIcon,
    UserIcon,
    UsersIcon,
    HeartIcon,
    BellIcon,
    ClockIcon,
    BookmarkIcon,
    StarIcon,
    GiftIcon,
    CreditCardIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    ChatBubbleLeftRightIcon,
    SparklesIcon,
    MapIcon,
    CalendarDaysIcon,
    PaperAirplaneIcon,
    BuildingOfficeIcon,
    TruckIcon,
    SunIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
import './CustomerSidebar.css';

const CustomerSidebar = ({ isOpen, user }) => {
    const customerMenuItems = [
        {
            title: 'Dashboard',
            items: [
                { name: 'My Dashboard', path: '/my/dashboard', icon: HomeIcon },
            ]
        },
        {
            title: 'My Bookings',
            items: [
                { name: 'All Bookings', path: '/my/bookings', icon: TicketIcon },
                { name: 'Upcoming Trips', path: '/my/bookings/upcoming', icon: CalendarDaysIcon },
                { name: 'Completed Trips', path: '/my/bookings/completed', icon: CheckBadgeIcon },
                { name: 'Cancelled', path: '/my/bookings/cancelled', icon: ExclamationTriangleIcon },
                { name: 'Refund Status', path: '/my/bookings/refunds', icon: ArrowPathIcon },
            ]
        },
        {
            title: 'Quick Book',
            items: [
                { name: 'Flights', path: '/flights', icon: PaperAirplaneIcon },
                { name: 'Hotels', path: '/hotels', icon: BuildingOfficeIcon },
                { name: 'Bus', path: '/bus', icon: TruckIcon },
                { name: 'Holidays', path: '/holidays', icon: SunIcon },
                { name: 'Activities', path: '/activities', icon: MapIcon },
                { name: 'Insurance', path: '/insurance', icon: ShieldCheckIcon },
                { name: 'Visa', path: '/visa', icon: DocumentTextIcon },
            ]
        },
        {
            title: 'AI Assistant',
            items: [
                { name: 'AI Trip Planner', path: '/ai/trip-planner', icon: SparklesIcon },
                { name: 'AI Chat', path: '/ai/chat', icon: ChatBubbleLeftRightIcon },
                { name: 'Smart Recommendations', path: '/ai/recommendations', icon: SparklesIcon },
            ]
        },
        {
            title: 'Travelers',
            items: [
                { name: 'Saved Travelers', path: '/my/travelers', icon: UsersIcon },
                { name: 'Add Traveler', path: '/my/travelers/add', icon: UsersIcon },
            ]
        },
        {
            title: 'Saved & Favorites',
            items: [
                { name: 'Wishlist', path: '/my/wishlist', icon: HeartIcon },
                { name: 'Saved Searches', path: '/my/saved-searches', icon: BookmarkIcon },
                { name: 'Price Alerts', path: '/my/price-alerts', icon: BellIcon },
                { name: 'Recent Searches', path: '/my/recent', icon: ClockIcon },
            ]
        },
        {
            title: 'Rewards',
            items: [
                { name: 'My Rewards', path: '/my/rewards', icon: GiftIcon },
                { name: 'Points History', path: '/my/rewards/history', icon: StarIcon },
                { name: 'Redeem Points', path: '/my/rewards/redeem', icon: GiftIcon },
            ]
        },
        {
            title: 'Reviews',
            items: [
                { name: 'My Reviews', path: '/my/reviews', icon: StarIcon },
                { name: 'Write a Review', path: '/my/reviews/write', icon: StarIcon },
            ]
        },
        {
            title: 'Payments',
            items: [
                { name: 'Payment Methods', path: '/my/payments', icon: CreditCardIcon },
                { name: 'Transaction History', path: '/my/payments/history', icon: ClockIcon },
            ]
        },
        {
            title: 'Support',
            items: [
                { name: 'Help Center', path: '/my/help', icon: QuestionMarkCircleIcon },
                { name: 'My Tickets', path: '/my/support/tickets', icon: ChatBubbleLeftRightIcon },
                { name: 'Contact Us', path: '/my/support/contact', icon: ChatBubbleLeftRightIcon },
            ]
        },
        {
            title: 'Account',
            items: [
                { name: 'Profile', path: '/my/profile', icon: UserIcon },
                { name: 'Notifications', path: '/my/notifications', icon: BellIcon },
                { name: 'Settings', path: '/my/settings', icon: Cog6ToothIcon },
            ]
        }
    ];

    return (
        <aside className={`sidebar customer-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
                {/* User Info */}
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    {isOpen && (
                        <div className="user-info">
                            <span className="user-name">{user?.firstName} {user?.lastName}</span>
                            <span className="user-email">{user?.email}</span>
                        </div>
                    )}
                </div>

                {/* Rewards Card */}
                {isOpen && user?.rewardsPoints > 0 && (
                    <div className="rewards-card">
                        <GiftIcon className="rewards-icon" />
                        <div className="rewards-info">
                            <span className="rewards-label">Reward Points</span>
                            <span className="rewards-points">{user?.rewardsPoints?.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    {customerMenuItems.map((section, idx) => (
                        <div key={idx} className="nav-section">
                            {isOpen && <h4 className="nav-section-title">{section.title}</h4>}
                            <ul className="nav-list">
                                {section.items.map((item) => (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `nav-item ${isActive ? 'active' : ''}`
                                            }
                                            title={item.name}
                                        >
                                            <item.icon className="nav-icon" />
                                            {isOpen && <span className="nav-text">{item.name}</span>}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default CustomerSidebar;

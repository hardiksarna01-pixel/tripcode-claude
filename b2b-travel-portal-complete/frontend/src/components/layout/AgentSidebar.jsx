/**
 * Agent Sidebar Component - COMPLETE
 * Full navigation sidebar for agent portal with ALL features
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    TicketIcon,
    WalletIcon,
    ChartBarIcon,
    UserIcon,
    UsersIcon,
    GlobeAltIcon,
    BuildingOfficeIcon,
    TruckIcon,
    SunIcon,
    MapIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    PaperAirplaneIcon,
    CalendarDaysIcon,
    SparklesIcon,
    PhotoIcon,
    ChatBubbleLeftRightIcon,
    CpuChipIcon,
    BellIcon,
    HeartIcon,
    ClockIcon,
    BookmarkIcon,
    CurrencyRupeeIcon,
    ReceiptPercentIcon,
    TagIcon,
    QuestionMarkCircleIcon,
    LifebuoyIcon,
    Cog6ToothIcon,
    ArrowTrendingUpIcon,
    MagnifyingGlassIcon,
    UserPlusIcon,
    CreditCardIcon,
    BanknotesIcon,
    DocumentDuplicateIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import './Sidebar.css';

const AgentSidebar = ({ isOpen, user }) => {
    const location = useLocation();

    const agentMenuItems = [
        {
            title: 'Main',
            items: [
                { name: 'Dashboard', path: '/agent/dashboard', icon: HomeIcon },
                { name: 'My Bookings', path: '/agent/bookings', icon: TicketIcon },
                { name: 'Pending Bookings', path: '/agent/bookings/pending', icon: ClockIcon },
                { name: 'Cancelled Bookings', path: '/agent/bookings/cancelled', icon: ExclamationTriangleIcon },
            ]
        },
        {
            title: 'Search & Book',
            items: [
                { name: 'Flights', path: '/flights', icon: PaperAirplaneIcon },
                { name: 'Hotels', path: '/hotels', icon: BuildingOfficeIcon },
                { name: 'Bus', path: '/bus', icon: TruckIcon },
                { name: 'Holidays', path: '/holidays', icon: SunIcon },
                { name: 'Activities & Tours', path: '/activities', icon: MapIcon },
                { name: 'Travel Insurance', path: '/insurance', icon: ShieldCheckIcon },
                { name: 'Visa Services', path: '/visa', icon: DocumentTextIcon },
                { name: 'Airport Transfers', path: '/transfers', icon: TruckIcon },
            ]
        },
        {
            title: 'AI Features',
            items: [
                { name: 'AI Trip Planner', path: '/ai/trip-planner', icon: SparklesIcon },
                { name: 'AI Chatbot', path: '/ai/chat', icon: ChatBubbleLeftRightIcon },
                { name: 'AI Image Generator', path: '/ai/image-generator', icon: PhotoIcon },
                { name: 'Smart Search', path: '/ai/smart-search', icon: CpuChipIcon },
                { name: 'Price Prediction', path: '/ai/price-prediction', icon: ArrowTrendingUpIcon },
            ]
        },
        {
            title: 'Tools',
            items: [
                { name: 'Fare Calendar', path: '/tools/fare-calendar', icon: CalendarDaysIcon },
                { name: 'Price Alerts', path: '/tools/price-alerts', icon: BellIcon },
                { name: 'Search History', path: '/tools/search-history', icon: ClockIcon },
                { name: 'Saved Searches', path: '/tools/saved-searches', icon: BookmarkIcon },
                { name: 'Compare Prices', path: '/tools/compare', icon: ArrowPathIcon },
            ]
        },
        {
            title: 'Wallet & Finance',
            items: [
                { name: 'Wallet', path: '/agent/wallet', icon: WalletIcon },
                { name: 'Top-up Wallet', path: '/agent/wallet/topup', icon: CreditCardIcon },
                { name: 'Transaction History', path: '/agent/wallet/transactions', icon: BanknotesIcon },
                { name: 'Credit Balance', path: '/agent/wallet/credit', icon: CurrencyRupeeIcon },
                { name: 'Download Statement', path: '/agent/wallet/statement', icon: DocumentDuplicateIcon },
            ]
        },
        {
            title: 'Commission',
            items: [
                { name: 'Commission Dashboard', path: '/agent/commission', icon: ReceiptPercentIcon },
                { name: 'Commission History', path: '/agent/commission/history', icon: ChartBarIcon },
                { name: 'Pending Payouts', path: '/agent/commission/pending', icon: ClockIcon },
            ]
        },
        {
            title: 'My Markup',
            items: [
                { name: 'Markup Settings', path: '/agent/markup', icon: TagIcon },
                { name: 'Flight Markup', path: '/agent/markup/flights', icon: PaperAirplaneIcon },
                { name: 'Hotel Markup', path: '/agent/markup/hotels', icon: BuildingOfficeIcon },
                { name: 'Other Products', path: '/agent/markup/others', icon: TagIcon },
            ]
        },
        {
            title: 'Sub-Agents',
            items: [
                { name: 'All Sub-Agents', path: '/agent/sub-agents', icon: UsersIcon },
                { name: 'Add Sub-Agent', path: '/agent/sub-agents/add', icon: UserPlusIcon },
                { name: 'Sub-Agent Bookings', path: '/agent/sub-agents/bookings', icon: TicketIcon },
            ]
        },
        {
            title: 'Travelers',
            items: [
                { name: 'Saved Travelers', path: '/agent/travelers', icon: UsersIcon },
                { name: 'Add Traveler', path: '/agent/travelers/add', icon: UserPlusIcon },
                { name: 'Frequent Travelers', path: '/agent/travelers/frequent', icon: HeartIcon },
            ]
        },
        {
            title: 'Reports',
            items: [
                { name: 'Booking Reports', path: '/agent/reports/bookings', icon: ChartBarIcon },
                { name: 'Sales Reports', path: '/agent/reports/sales', icon: CurrencyRupeeIcon },
                { name: 'Commission Reports', path: '/agent/reports/commission', icon: ReceiptPercentIcon },
                { name: 'Download Reports', path: '/agent/reports/download', icon: DocumentDuplicateIcon },
            ]
        },
        {
            title: 'Support',
            items: [
                { name: 'Raise Ticket', path: '/agent/support/new', icon: LifebuoyIcon },
                { name: 'My Tickets', path: '/agent/support/tickets', icon: QuestionMarkCircleIcon },
                { name: 'FAQs', path: '/agent/support/faqs', icon: QuestionMarkCircleIcon },
                { name: 'Contact Us', path: '/agent/support/contact', icon: ChatBubbleLeftRightIcon },
            ]
        },
        {
            title: 'Account',
            items: [
                { name: 'Profile', path: '/agent/profile', icon: UserIcon },
                { name: 'KYC Documents', path: '/agent/profile/kyc', icon: DocumentTextIcon },
                { name: 'Notifications', path: '/agent/notifications', icon: BellIcon },
                { name: 'Settings', path: '/agent/settings', icon: Cog6ToothIcon },
            ]
        }
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
                {/* User Info */}
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    {isOpen && (
                        <div className="user-info">
                            <span className="user-name">{user?.firstName} {user?.lastName}</span>
                            <span className="user-type">{user?.companyName || 'Agent'}</span>
                            <span className="user-id">ID: {user?.agentId || 'AGT001'}</span>
                        </div>
                    )}
                </div>

                {/* Wallet Balance */}
                {isOpen && (
                    <div className="wallet-card">
                        <div className="wallet-row">
                            <span className="wallet-label">Wallet Balance</span>
                            <span className="wallet-amount">₹{user?.walletBalance?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="wallet-row credit">
                            <span className="wallet-label">Credit Limit</span>
                            <span className="wallet-amount">₹{user?.creditLimit?.toLocaleString() || '0'}</span>
                        </div>
                    </div>
                )}

                {/* Quick Search */}
                {isOpen && (
                    <div className="quick-search">
                        <MagnifyingGlassIcon className="search-icon" />
                        <input type="text" placeholder="Quick search..." />
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    {agentMenuItems.map((section, idx) => (
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

export default AgentSidebar;

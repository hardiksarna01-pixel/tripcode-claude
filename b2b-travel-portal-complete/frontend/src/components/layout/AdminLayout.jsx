/**
 * Admin Layout Component
 * Layout for admin and super admin panels
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    HomeIcon,
    UsersIcon,
    UserGroupIcon,
    TagIcon,
    CubeIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    PaintBrushIcon,
    EnvelopeIcon,
    KeyIcon,
    BuildingOfficeIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    PhotoIcon,
    MapIcon,
    CpuChipIcon,
    SwatchIcon,
    GlobeAltIcon,
    CodeBracketIcon,
    DocumentTextIcon,
    LinkIcon,
    CommandLineIcon,
    ServerIcon,
    TicketIcon,
    ArrowPathIcon,
    CalendarDaysIcon,
    XCircleIcon,
    NoSymbolIcon,
    ClockIcon,
    RocketLaunchIcon,
    Square3Stack3DIcon
} from '@heroicons/react/24/outline';
import './AdminLayout.css';

const AdminLayout = ({ isSuperAdmin = false }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { admin, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const adminMenuItems = [
        {
            title: 'Overview',
            items: [
                { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
                { name: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
            ]
        },
        {
            title: 'Agent Management',
            items: [
                { name: 'Agents', path: '/admin/agents', icon: UsersIcon },
                { name: 'Groups', path: '/admin/groups', icon: UserGroupIcon },
                { name: 'Schemes', path: '/admin/schemes', icon: TagIcon },
                { name: 'Credit Management', path: '/admin/credit', icon: BanknotesIcon },
                { name: 'Customers', path: '/admin/customers', icon: UserGroupIcon },
            ]
        },
        {
            title: 'Products',
            items: [
                { name: 'Flights', path: '/admin/flights', icon: CubeIcon },
                { name: 'Hotels', path: '/admin/hotels', icon: BuildingOfficeIcon },
                { name: 'Buses', path: '/admin/buses', icon: CubeIcon },
                { name: 'Holidays', path: '/admin/holidays', icon: CubeIcon },
                { name: 'Visa', path: '/admin/visa', icon: CubeIcon },
                { name: 'Insurance', path: '/admin/insurance', icon: ShieldCheckIcon },
            ]
        },
        {
            title: 'PNR Management',
            items: [
                { name: 'Pending Approvals', path: '/admin/pnr', icon: ClockIcon },
                { name: 'Issue Tickets', path: '/admin/pnr/issue', icon: TicketIcon },
                { name: 'Reissue Requests', path: '/admin/pnr/reissue', icon: ArrowPathIcon },
                { name: 'Date Changes', path: '/admin/pnr/date-change', icon: CalendarDaysIcon },
                { name: 'Cancellations', path: '/admin/pnr/cancellation', icon: XCircleIcon },
                { name: 'VOID Requests', path: '/admin/pnr/void', icon: NoSymbolIcon },
                { name: 'PNR History', path: '/admin/pnr/history', icon: ChartBarIcon },
                { name: 'PNR Notifications', path: '/admin/pnr/notifications', icon: BellIcon },
            ]
        },
        {
            title: 'Finance & Commissions',
            items: [
                { name: 'Commissions', path: '/admin/commissions', icon: CurrencyDollarIcon },
                { name: 'Global Markup', path: '/admin/markup', icon: TagIcon },
                { name: 'Finance', path: '/admin/finance', icon: BanknotesIcon },
                { name: 'Reports', path: '/admin/reports', icon: ChartBarIcon },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { name: 'Suppliers', path: '/admin/suppliers', icon: CubeIcon },
                { name: 'Payment Gateway', path: '/admin/payment-gateway', icon: CurrencyDollarIcon },
                { name: 'Promo Codes', path: '/admin/promo-codes', icon: TagIcon },
            ]
        },
        {
            title: 'Communication',
            items: [
                { name: 'Notifications', path: '/admin/notifications', icon: BellIcon },
                { name: 'Email Templates', path: '/admin/email-templates', icon: EnvelopeIcon },
                { name: 'Support', path: '/admin/support', icon: UserGroupIcon },
            ]
        },
        {
            title: 'Settings',
            items: [
                { name: 'General Settings', path: '/admin/settings', icon: Cog6ToothIcon },
                { name: 'Users', path: '/admin/users', icon: UsersIcon },
                { name: 'Audit Logs', path: '/admin/audit-logs', icon: EnvelopeIcon },
            ]
        },
        {
            title: 'LMS & Certifications',
            items: [
                { name: 'Certifications', path: '/admin/certifications', icon: KeyIcon },
            ]
        },
        {
            title: 'Whitelabel Solutions',
            items: [
                { name: 'Template Gallery', path: '/admin/whitelabel', icon: Square3Stack3DIcon },
                { name: 'B2B Templates', path: '/admin/whitelabel/b2b', icon: BuildingOfficeIcon },
                { name: 'B2C Templates', path: '/admin/whitelabel/b2c', icon: UserGroupIcon },
                { name: 'Branding', path: '/admin/whitelabel/branding', icon: PaintBrushIcon },
                { name: 'Themes', path: '/admin/whitelabel/themes', icon: SwatchIcon },
                { name: 'Domain Settings', path: '/admin/whitelabel/domain', icon: GlobeAltIcon },
                { name: 'Custom Pages', path: '/admin/whitelabel/pages', icon: DocumentTextIcon },
            ]
        },
        {
            title: 'API Solutions',
            items: [
                { name: 'Integration Hub', path: '/admin/api/hub', icon: ServerIcon },
                { name: 'API Keys', path: '/admin/api/keys', icon: KeyIcon },
                { name: 'API Documentation', path: '/admin/api/docs', icon: CodeBracketIcon },
                { name: 'Webhooks', path: '/admin/api/webhooks', icon: LinkIcon },
                { name: 'Integrations', path: '/admin/api/integrations', icon: CommandLineIcon },
            ]
        },
        {
            title: 'AI Tools',
            items: [
                { name: 'AI Chatbot', path: '/admin/ai/chatbot', icon: ChatBubbleLeftRightIcon },
                { name: 'AI Trip Planner', path: '/admin/ai/trip-planner', icon: MapIcon },
                { name: 'AI Image Generator', path: '/admin/ai/image-generator', icon: PhotoIcon },
                { name: 'AI Analytics', path: '/admin/ai/analytics', icon: CpuChipIcon },
            ]
        }
    ];

    const superAdminMenuItems = [
        {
            title: 'Platform',
            items: [
                { name: 'Dashboard', path: '/superadmin/dashboard', icon: HomeIcon },
                { name: 'Companies', path: '/superadmin/companies', icon: BuildingOfficeIcon },
                { name: 'Users', path: '/superadmin/users', icon: UsersIcon },
            ]
        },
        {
            title: 'Subscription',
            items: [
                { name: 'Plans', path: '/superadmin/plans', icon: TagIcon },
                { name: 'Billing', path: '/superadmin/billing', icon: BanknotesIcon },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { name: 'Suppliers', path: '/superadmin/suppliers', icon: CubeIcon },
                { name: 'API Management', path: '/superadmin/api', icon: KeyIcon },
                { name: 'Feature Flags', path: '/superadmin/feature-flags', icon: ShieldCheckIcon },
            ]
        },
        {
            title: 'System',
            items: [
                { name: 'Global Settings', path: '/superadmin/settings', icon: Cog6ToothIcon },
                { name: 'System Health', path: '/superadmin/system-health', icon: ChartBarIcon },
                { name: 'Audit Logs', path: '/superadmin/audit-logs', icon: EnvelopeIcon },
            ]
        },
        {
            title: 'PNR Operations',
            items: [
                { name: 'All PNR Requests', path: '/superadmin/pnr', icon: TicketIcon },
                { name: 'Pending Approvals', path: '/superadmin/pnr/pending', icon: ClockIcon },
                { name: 'Issue Management', path: '/superadmin/pnr/issue', icon: TicketIcon },
                { name: 'Reissue Management', path: '/superadmin/pnr/reissue', icon: ArrowPathIcon },
                { name: 'Date Changes', path: '/superadmin/pnr/date-change', icon: CalendarDaysIcon },
                { name: 'Cancellations', path: '/superadmin/pnr/cancellation', icon: XCircleIcon },
                { name: 'VOID Management', path: '/superadmin/pnr/void', icon: NoSymbolIcon },
                { name: 'PNR History', path: '/superadmin/pnr/history', icon: ChartBarIcon },
                { name: 'PNR Notifications', path: '/superadmin/pnr/notifications', icon: BellIcon },
            ]
        },
        {
            title: 'Reports',
            items: [
                { name: 'Analytics', path: '/superadmin/analytics', icon: ChartBarIcon },
                { name: 'Reports', path: '/superadmin/reports', icon: ChartBarIcon },
                { name: 'Announcements', path: '/superadmin/announcements', icon: BellIcon },
            ]
        },
        {
            title: 'Whitelabel Solutions',
            items: [
                { name: 'Template Gallery', path: '/superadmin/whitelabel', icon: Square3Stack3DIcon },
                { name: 'B2B Templates', path: '/superadmin/whitelabel/b2b', icon: BuildingOfficeIcon },
                { name: 'B2C Templates', path: '/superadmin/whitelabel/b2c', icon: UserGroupIcon },
                { name: 'Tenant Branding', path: '/superadmin/whitelabel/tenants', icon: RocketLaunchIcon },
                { name: 'Platform Branding', path: '/superadmin/whitelabel/platform', icon: PaintBrushIcon },
                { name: 'Theme Management', path: '/superadmin/whitelabel/themes', icon: SwatchIcon },
                { name: 'Domain Management', path: '/superadmin/whitelabel/domains', icon: GlobeAltIcon },
                { name: 'Custom Templates', path: '/superadmin/whitelabel/templates', icon: DocumentTextIcon },
            ]
        },
        {
            title: 'API Solutions',
            items: [
                { name: 'Integration Hub', path: '/superadmin/api/hub', icon: ServerIcon },
                { name: 'API Keys Management', path: '/superadmin/api/keys', icon: KeyIcon },
                { name: 'Rate Limiting', path: '/superadmin/api/rate-limits', icon: ShieldCheckIcon },
                { name: 'API Documentation', path: '/superadmin/api/docs', icon: CodeBracketIcon },
                { name: 'Webhooks Config', path: '/superadmin/api/webhooks', icon: LinkIcon },
                { name: 'Third-Party Integrations', path: '/superadmin/api/integrations', icon: CommandLineIcon },
            ]
        },
        {
            title: 'AI Tools',
            items: [
                { name: 'AI Chatbot', path: '/superadmin/ai/chatbot', icon: ChatBubbleLeftRightIcon },
                { name: 'AI Trip Planner', path: '/superadmin/ai/trip-planner', icon: MapIcon },
                { name: 'AI Image Generator', path: '/superadmin/ai/image-generator', icon: PhotoIcon },
                { name: 'AI Platform Analytics', path: '/superadmin/ai/analytics', icon: CpuChipIcon },
            ]
        }
    ];

    const menuItems = isSuperAdmin ? superAdminMenuItems : adminMenuItems;
    const basePath = isSuperAdmin ? '/superadmin' : '/admin';

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        {sidebarOpen ? (
                            <>
                                <span className="logo-icon">✈</span>
                                <span className="logo-text">Travel Portal</span>
                            </>
                        ) : (
                            <span className="logo-icon">✈</span>
                        )}
                    </div>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <XMarkIcon /> : <Bars3Icon />}
                    </button>
                </div>

                <nav className="admin-nav">
                    {menuItems.map((section, idx) => (
                        <div key={idx} className="nav-section">
                            {sidebarOpen && (
                                <h4 className="nav-section-title">{section.title}</h4>
                            )}
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
                                            {sidebarOpen && (
                                                <span className="nav-text">{item.name}</span>
                                            )}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <ArrowRightOnRectangleIcon className="nav-icon" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                {/* Top Header */}
                <header className="admin-header">
                    <div className="header-left">
                        <div className="search-box">
                            <MagnifyingGlassIcon className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="header-right">
                        <button className="header-btn notification-btn">
                            <BellIcon />
                            <span className="notification-badge">3</span>
                        </button>

                        <div className="admin-profile">
                            <div className="profile-avatar">
                                {admin?.firstName?.[0]}{admin?.lastName?.[0]}
                            </div>
                            <div className="profile-info">
                                <span className="profile-name">
                                    {admin?.firstName} {admin?.lastName}
                                </span>
                                <span className="profile-role">{admin?.role}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

/**
 * Admin Sidebar Component - COMPLETE
 * Full navigation sidebar for admin panel with ALL features
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
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
    TicketIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    BellIcon,
    ClipboardDocumentListIcon,
    CreditCardIcon,
    GlobeAltIcon,
    PhotoIcon,
    ChatBubbleLeftRightIcon,
    DevicePhoneMobileIcon,
    ReceiptPercentIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    LifebuoyIcon,
    MegaphoneIcon,
    FolderIcon,
    ServerIcon,
    CommandLineIcon,
    CalendarDaysIcon,
    UserPlusIcon,
    CheckBadgeIcon,
    XCircleIcon,
    PaperAirplaneIcon,
    TruckIcon,
    MapIcon,
    SunIcon,
    CalculatorIcon,
    TableCellsIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen }) => {
    const adminMenuItems = [
        {
            title: 'Overview',
            items: [
                { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
                { name: 'Real-time Stats', path: '/admin/dashboard/realtime', icon: ChartBarIcon },
            ]
        },
        {
            title: 'Agent Management',
            items: [
                { name: 'All Agents', path: '/admin/agents', icon: UsersIcon },
                { name: 'Pending Approval', path: '/admin/agents/pending', icon: ClockIcon, badge: 'new' },
                { name: 'Approved Agents', path: '/admin/agents/approved', icon: CheckBadgeIcon },
                { name: 'Suspended Agents', path: '/admin/agents/suspended', icon: XCircleIcon },
                { name: 'Add New Agent', path: '/admin/agents/add', icon: UserPlusIcon },
                { name: 'Agent Groups', path: '/admin/groups', icon: UserGroupIcon },
                { name: 'Commission Schemes', path: '/admin/schemes', icon: TagIcon },
                { name: 'Credit Management', path: '/admin/agents/credit', icon: CreditCardIcon },
                { name: 'KYC Verification', path: '/admin/agents/kyc', icon: ShieldCheckIcon },
            ]
        },
        {
            title: 'Customer Management',
            items: [
                { name: 'All Customers', path: '/admin/customers', icon: UsersIcon },
                { name: 'Active Customers', path: '/admin/customers/active', icon: CheckBadgeIcon },
                { name: 'Customer Bookings', path: '/admin/customers/bookings', icon: TicketIcon },
            ]
        },
        {
            title: 'Bookings',
            items: [
                { name: 'All Bookings', path: '/admin/bookings', icon: TicketIcon },
                { name: 'Pending', path: '/admin/bookings/pending', icon: ClockIcon },
                { name: 'Confirmed', path: '/admin/bookings/confirmed', icon: CheckBadgeIcon },
                { name: 'Cancelled', path: '/admin/bookings/cancelled', icon: XCircleIcon },
                { name: 'Refund Requests', path: '/admin/bookings/refunds', icon: ArrowPathIcon },
                { name: 'Failed Bookings', path: '/admin/bookings/failed', icon: ExclamationTriangleIcon },
            ]
        },
        {
            title: 'Products',
            items: [
                { name: 'Product Settings', path: '/admin/products', icon: CubeIcon },
                { name: 'Flights', path: '/admin/products/flights', icon: PaperAirplaneIcon },
                { name: 'Hotels', path: '/admin/products/hotels', icon: BuildingOfficeIcon },
                { name: 'Bus', path: '/admin/products/bus', icon: TruckIcon },
                { name: 'Holidays', path: '/admin/products/holidays', icon: SunIcon },
                { name: 'Activities', path: '/admin/products/activities', icon: MapIcon },
                { name: 'Insurance', path: '/admin/products/insurance', icon: ShieldCheckIcon },
                { name: 'Visa', path: '/admin/products/visa', icon: DocumentTextIcon },
                { name: 'Transfers', path: '/admin/products/transfers', icon: TruckIcon },
            ]
        },
        {
            title: 'Suppliers & APIs',
            items: [
                { name: 'All Suppliers', path: '/admin/suppliers', icon: CubeIcon },
                { name: 'Flight APIs', path: '/admin/suppliers/flights', icon: PaperAirplaneIcon },
                { name: 'Hotel APIs', path: '/admin/suppliers/hotels', icon: BuildingOfficeIcon },
                { name: 'Bus APIs', path: '/admin/suppliers/bus', icon: TruckIcon },
                { name: 'API Logs', path: '/admin/suppliers/logs', icon: CommandLineIcon },
                { name: 'API Health', path: '/admin/suppliers/health', icon: ServerIcon },
            ]
        },
        {
            title: 'Markup & Pricing',
            items: [
                { name: 'Global Markup', path: '/admin/markup', icon: CurrencyDollarIcon },
                { name: 'Flight Markup', path: '/admin/markup/flights', icon: PaperAirplaneIcon },
                { name: 'Hotel Markup', path: '/admin/markup/hotels', icon: BuildingOfficeIcon },
                { name: 'Group Markup', path: '/admin/markup/groups', icon: UserGroupIcon },
                { name: 'Agent Markup', path: '/admin/markup/agents', icon: UsersIcon },
                { name: 'Route-wise Markup', path: '/admin/markup/routes', icon: MapIcon },
                { name: 'Seasonal Markup', path: '/admin/markup/seasonal', icon: CalendarDaysIcon },
                { name: 'Markup Calculator', path: '/admin/markup/calculator', icon: CalculatorIcon },
            ]
        },
        {
            title: 'Finance',
            items: [
                { name: 'Finance Dashboard', path: '/admin/finance', icon: BanknotesIcon },
                { name: 'Invoices', path: '/admin/finance/invoices', icon: DocumentTextIcon },
                { name: 'Ledger', path: '/admin/finance/ledger', icon: TableCellsIcon },
                { name: 'Wallet Transactions', path: '/admin/finance/wallet', icon: CreditCardIcon },
                { name: 'Pending Payments', path: '/admin/finance/pending', icon: ClockIcon },
                { name: 'Commission Payouts', path: '/admin/finance/commissions', icon: ReceiptPercentIcon },
                { name: 'Refund Management', path: '/admin/finance/refunds', icon: ArrowPathIcon },
                { name: 'GST Reports', path: '/admin/finance/gst', icon: DocumentTextIcon },
                { name: 'TDS Reports', path: '/admin/finance/tds', icon: DocumentTextIcon },
                { name: 'Reconciliation', path: '/admin/finance/reconciliation', icon: ArrowPathIcon },
            ]
        },
        {
            title: 'Reports & Analytics',
            items: [
                { name: 'Reports Dashboard', path: '/admin/reports', icon: ChartBarIcon },
                { name: 'Booking Reports', path: '/admin/reports/bookings', icon: TicketIcon },
                { name: 'Revenue Reports', path: '/admin/reports/revenue', icon: CurrencyDollarIcon },
                { name: 'Agent Performance', path: '/admin/reports/agents', icon: UsersIcon },
                { name: 'Product Reports', path: '/admin/reports/products', icon: CubeIcon },
                { name: 'Cancellation Reports', path: '/admin/reports/cancellations', icon: XCircleIcon },
                { name: 'Search Analytics', path: '/admin/reports/search', icon: ChartBarIcon },
                { name: 'Custom Reports', path: '/admin/reports/custom', icon: PencilSquareIcon },
                { name: 'Scheduled Reports', path: '/admin/reports/scheduled', icon: CalendarDaysIcon },
                { name: 'Export Data', path: '/admin/reports/export', icon: ArrowDownTrayIcon },
            ]
        },
        {
            title: 'Communication',
            items: [
                { name: 'Email Templates', path: '/admin/templates/email', icon: EnvelopeIcon },
                { name: 'SMS Templates', path: '/admin/templates/sms', icon: DevicePhoneMobileIcon },
                { name: 'WhatsApp Templates', path: '/admin/templates/whatsapp', icon: ChatBubbleLeftRightIcon },
                { name: 'Push Notifications', path: '/admin/templates/push', icon: BellIcon },
                { name: 'PDF Templates', path: '/admin/templates/pdf', icon: DocumentTextIcon },
                { name: 'Send Bulk SMS', path: '/admin/communication/bulk-sms', icon: DevicePhoneMobileIcon },
                { name: 'Send Bulk Email', path: '/admin/communication/bulk-email', icon: EnvelopeIcon },
            ]
        },
        {
            title: 'Whitelabel & Branding',
            items: [
                { name: 'Branding', path: '/admin/whitelabel', icon: PaintBrushIcon },
                { name: 'Logo & Favicon', path: '/admin/whitelabel/logo', icon: PhotoIcon },
                { name: 'Theme & Colors', path: '/admin/whitelabel/theme', icon: PaintBrushIcon },
                { name: 'Custom Domain', path: '/admin/whitelabel/domain', icon: GlobeAltIcon },
                { name: 'SEO Settings', path: '/admin/whitelabel/seo', icon: MegaphoneIcon },
                { name: 'Custom Pages', path: '/admin/whitelabel/pages', icon: DocumentTextIcon },
                { name: 'Footer Settings', path: '/admin/whitelabel/footer', icon: ClipboardDocumentListIcon },
                { name: 'Social Links', path: '/admin/whitelabel/social', icon: GlobeAltIcon },
            ]
        },
        {
            title: 'Support',
            items: [
                { name: 'All Tickets', path: '/admin/support', icon: LifebuoyIcon },
                { name: 'Open Tickets', path: '/admin/support/open', icon: ExclamationTriangleIcon },
                { name: 'Closed Tickets', path: '/admin/support/closed', icon: CheckBadgeIcon },
                { name: 'FAQs Management', path: '/admin/support/faqs', icon: ClipboardDocumentListIcon },
            ]
        },
        {
            title: 'Notifications & Alerts',
            items: [
                { name: 'All Notifications', path: '/admin/notifications', icon: BellIcon },
                { name: 'Announcements', path: '/admin/announcements', icon: MegaphoneIcon },
                { name: 'System Alerts', path: '/admin/alerts', icon: ExclamationTriangleIcon },
            ]
        },
        {
            title: 'Settings',
            items: [
                { name: 'General Settings', path: '/admin/settings', icon: Cog6ToothIcon },
                { name: 'Business Settings', path: '/admin/settings/business', icon: BuildingOfficeIcon },
                { name: 'Booking Settings', path: '/admin/settings/booking', icon: TicketIcon },
                { name: 'Payment Gateways', path: '/admin/settings/payments', icon: CreditCardIcon },
                { name: 'Tax Settings (GST)', path: '/admin/settings/tax', icon: ReceiptPercentIcon },
                { name: 'Email/SMS Config', path: '/admin/settings/communication', icon: EnvelopeIcon },
                { name: 'Currency Settings', path: '/admin/settings/currency', icon: CurrencyDollarIcon },
                { name: 'API Keys', path: '/admin/api-keys', icon: KeyIcon },
                { name: 'Webhooks', path: '/admin/settings/webhooks', icon: ArrowPathIcon },
            ]
        },
        {
            title: 'Audit & Logs',
            items: [
                { name: 'Audit Logs', path: '/admin/audit', icon: ClipboardDocumentListIcon },
                { name: 'Admin Activity', path: '/admin/audit/admin', icon: EyeIcon },
                { name: 'Agent Activity', path: '/admin/audit/agents', icon: UsersIcon },
                { name: 'API Request Logs', path: '/admin/audit/api', icon: CommandLineIcon },
            ]
        }
    ];

    return (
        <nav className="admin-nav">
            {adminMenuItems.map((section, idx) => (
                <div key={idx} className="nav-section">
                    {isOpen && (
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
                                    {isOpen && (
                                        <>
                                            <span className="nav-text">{item.name}</span>
                                            {item.badge && (
                                                <span className="nav-badge">{item.badge}</span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    );
};

export default AdminSidebar;

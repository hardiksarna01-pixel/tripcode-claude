/**
 * Super Admin Sidebar Component - COMPLETE
 * Full navigation sidebar for super admin panel with ALL features
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    BuildingOfficeIcon,
    ShieldCheckIcon,
    UsersIcon,
    CubeIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    ServerIcon,
    CommandLineIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    FolderIcon,
    ArrowPathIcon,
    BellIcon,
    MegaphoneIcon,
    KeyIcon,
    CreditCardIcon,
    EnvelopeIcon,
    DevicePhoneMobileIcon,
    ChatBubbleLeftRightIcon,
    GlobeAltIcon,
    WrenchScrewdriverIcon,
    CircleStackIcon,
    CloudIcon,
    DocumentTextIcon,
    PaperAirplaneIcon,
    TruckIcon,
    MapIcon,
    PlayIcon,
    PauseIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    FlagIcon,
    CheckBadgeIcon,
    XCircleIcon,
    EyeIcon,
    LockClosedIcon,
    UserPlusIcon,
    CpuChipIcon,
    SparklesIcon,
    RocketLaunchIcon,
    ClipboardDocumentListIcon,
    TableCellsIcon,
    CalendarDaysIcon,
    ReceiptPercentIcon
} from '@heroicons/react/24/outline';
import './SuperAdminSidebar.css';

const SuperAdminSidebar = ({ isOpen }) => {
    const superAdminMenuItems = [
        {
            title: 'Platform Overview',
            items: [
                { name: 'Dashboard', path: '/superadmin/dashboard', icon: HomeIcon },
                { name: 'Platform Stats', path: '/superadmin/stats', icon: ChartBarIcon },
                { name: 'Real-time Monitor', path: '/superadmin/monitor', icon: EyeIcon },
            ]
        },
        {
            title: 'Tenant Management',
            items: [
                { name: 'All Tenants', path: '/superadmin/tenants', icon: BuildingOfficeIcon },
                { name: 'Active Tenants', path: '/superadmin/tenants/active', icon: CheckBadgeIcon },
                { name: 'Suspended Tenants', path: '/superadmin/tenants/suspended', icon: XCircleIcon },
                { name: 'Add New Tenant', path: '/superadmin/tenants/add', icon: UserPlusIcon },
                { name: 'Tenant Features', path: '/superadmin/tenants/features', icon: CubeIcon },
                { name: 'Tenant Limits', path: '/superadmin/tenants/limits', icon: TableCellsIcon },
                { name: 'Tenant Billing', path: '/superadmin/tenants/billing', icon: CreditCardIcon },
            ]
        },
        {
            title: 'Admin Users',
            items: [
                { name: 'All Admins', path: '/superadmin/admins', icon: ShieldCheckIcon },
                { name: 'Add Admin', path: '/superadmin/admins/add', icon: UserPlusIcon },
                { name: 'Role Management', path: '/superadmin/roles', icon: KeyIcon },
                { name: 'Permissions', path: '/superadmin/permissions', icon: LockClosedIcon },
            ]
        },
        {
            title: 'Supplier Configuration',
            items: [
                { name: 'All Suppliers', path: '/superadmin/suppliers', icon: CubeIcon },
                { name: 'Flight Suppliers', path: '/superadmin/suppliers/flights', icon: PaperAirplaneIcon },
                { name: 'Hotel Suppliers', path: '/superadmin/suppliers/hotels', icon: BuildingOfficeIcon },
                { name: 'Bus Suppliers', path: '/superadmin/suppliers/bus', icon: TruckIcon },
                { name: 'Activity Suppliers', path: '/superadmin/suppliers/activities', icon: MapIcon },
                { name: 'Add Supplier', path: '/superadmin/suppliers/add', icon: UserPlusIcon },
                { name: 'API Credentials', path: '/superadmin/suppliers/credentials', icon: KeyIcon },
                { name: 'Supplier Priority', path: '/superadmin/suppliers/priority', icon: ChartBarIcon },
            ]
        },
        {
            title: 'Payment Gateways',
            items: [
                { name: 'All Gateways', path: '/superadmin/payment-gateways', icon: CreditCardIcon },
                { name: 'Razorpay', path: '/superadmin/payment-gateways/razorpay', icon: CreditCardIcon },
                { name: 'PayU', path: '/superadmin/payment-gateways/payu', icon: CreditCardIcon },
                { name: 'Stripe', path: '/superadmin/payment-gateways/stripe', icon: CreditCardIcon },
                { name: 'CCAvenue', path: '/superadmin/payment-gateways/ccavenue', icon: CreditCardIcon },
                { name: 'Test Connection', path: '/superadmin/payment-gateways/test', icon: PlayIcon },
            ]
        },
        {
            title: 'Communication Config',
            items: [
                { name: 'Email Provider', path: '/superadmin/communication/email', icon: EnvelopeIcon },
                { name: 'SMS Provider', path: '/superadmin/communication/sms', icon: DevicePhoneMobileIcon },
                { name: 'WhatsApp Provider', path: '/superadmin/communication/whatsapp', icon: ChatBubbleLeftRightIcon },
                { name: 'Push Notifications', path: '/superadmin/communication/push', icon: BellIcon },
            ]
        },
        {
            title: 'AI Configuration',
            items: [
                { name: 'AI Settings', path: '/superadmin/ai', icon: SparklesIcon },
                { name: 'OpenAI Config', path: '/superadmin/ai/openai', icon: CpuChipIcon },
                { name: 'Anthropic Config', path: '/superadmin/ai/anthropic', icon: CpuChipIcon },
                { name: 'Image Generation', path: '/superadmin/ai/images', icon: SparklesIcon },
                { name: 'AI Usage & Costs', path: '/superadmin/ai/usage', icon: ChartBarIcon },
            ]
        },
        {
            title: 'Feature Flags',
            items: [
                { name: 'All Features', path: '/superadmin/features', icon: FlagIcon },
                { name: 'Enable/Disable', path: '/superadmin/features/toggle', icon: PlayIcon },
                { name: 'Beta Features', path: '/superadmin/features/beta', icon: RocketLaunchIcon },
            ]
        },
        {
            title: 'Platform Reports',
            items: [
                { name: 'Revenue Report', path: '/superadmin/reports/revenue', icon: CurrencyDollarIcon },
                { name: 'Tenant Report', path: '/superadmin/reports/tenants', icon: BuildingOfficeIcon },
                { name: 'Usage Report', path: '/superadmin/reports/usage', icon: ChartBarIcon },
                { name: 'API Usage', path: '/superadmin/reports/api', icon: CommandLineIcon },
                { name: 'Commission Report', path: '/superadmin/reports/commission', icon: ReceiptPercentIcon },
            ]
        },
        {
            title: 'System Health',
            items: [
                { name: 'System Overview', path: '/superadmin/health', icon: ServerIcon },
                { name: 'Server Status', path: '/superadmin/health/servers', icon: ServerIcon },
                { name: 'Database Status', path: '/superadmin/health/database', icon: CircleStackIcon },
                { name: 'Cache Status', path: '/superadmin/health/cache', icon: CloudIcon },
                { name: 'Queue Status', path: '/superadmin/health/queues', icon: ClockIcon },
                { name: 'API Health', path: '/superadmin/health/api', icon: GlobeAltIcon },
            ]
        },
        {
            title: 'Logs & Monitoring',
            items: [
                { name: 'System Logs', path: '/superadmin/logs', icon: CommandLineIcon },
                { name: 'Error Logs', path: '/superadmin/logs/errors', icon: ExclamationTriangleIcon },
                { name: 'API Logs', path: '/superadmin/logs/api', icon: GlobeAltIcon },
                { name: 'Audit Logs', path: '/superadmin/logs/audit', icon: ClipboardDocumentListIcon },
                { name: 'Security Logs', path: '/superadmin/logs/security', icon: ShieldCheckIcon },
            ]
        },
        {
            title: 'Maintenance',
            items: [
                { name: 'Maintenance Mode', path: '/superadmin/maintenance', icon: WrenchScrewdriverIcon },
                { name: 'Enable Maintenance', path: '/superadmin/maintenance/enable', icon: PauseIcon },
                { name: 'Schedule Maintenance', path: '/superadmin/maintenance/schedule', icon: CalendarDaysIcon },
            ]
        },
        {
            title: 'Backup & Restore',
            items: [
                { name: 'Backups', path: '/superadmin/backups', icon: FolderIcon },
                { name: 'Create Backup', path: '/superadmin/backups/create', icon: ArrowDownTrayIcon },
                { name: 'Restore Backup', path: '/superadmin/backups/restore', icon: ArrowUpTrayIcon },
                { name: 'Scheduled Backups', path: '/superadmin/backups/scheduled', icon: ClockIcon },
            ]
        },
        {
            title: 'Cache Management',
            items: [
                { name: 'Cache Overview', path: '/superadmin/cache', icon: CloudIcon },
                { name: 'Clear All Cache', path: '/superadmin/cache/clear', icon: TrashIcon },
                { name: 'Warm Cache', path: '/superadmin/cache/warm', icon: ArrowPathIcon },
            ]
        },
        {
            title: 'Announcements',
            items: [
                { name: 'All Announcements', path: '/superadmin/announcements', icon: MegaphoneIcon },
                { name: 'Create Announcement', path: '/superadmin/announcements/create', icon: UserPlusIcon },
                { name: 'Scheduled', path: '/superadmin/announcements/scheduled', icon: CalendarDaysIcon },
            ]
        },
        {
            title: 'Platform Settings',
            items: [
                { name: 'General Settings', path: '/superadmin/settings', icon: Cog6ToothIcon },
                { name: 'Security Settings', path: '/superadmin/settings/security', icon: ShieldCheckIcon },
                { name: 'Rate Limiting', path: '/superadmin/settings/rate-limit', icon: ClockIcon },
                { name: 'CORS Settings', path: '/superadmin/settings/cors', icon: GlobeAltIcon },
            ]
        }
    ];

    return (
        <nav className="superadmin-nav">
            {superAdminMenuItems.map((section, idx) => (
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
                                        <span className="nav-text">{item.name}</span>
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

export default SuperAdminSidebar;

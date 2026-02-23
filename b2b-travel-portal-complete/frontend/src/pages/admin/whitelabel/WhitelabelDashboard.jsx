/**
 * Whitelabel Dashboard
 * Complete B2B and B2C Whitelabel Solution with Templates and Previews
 */

import React, { useState } from 'react';
import {
    BuildingOfficeIcon,
    UserGroupIcon,
    PaintBrushIcon,
    EyeIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    SparklesIcon,
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    GlobeAltIcon,
    SwatchIcon,
    PhotoIcon,
    DocumentTextIcon,
    RocketLaunchIcon,
    CogIcon,
    StarIcon,
    ArrowTopRightOnSquareIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const WhitelabelDashboard = () => {
    const [activeTab, setActiveTab] = useState('b2b');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewDevice, setPreviewDevice] = useState('desktop');
    const [customization, setCustomization] = useState({
        primaryColor: '#2563eb',
        secondaryColor: '#7c3aed',
        logo: null,
        companyName: 'Your Travel Company',
        tagline: 'Your Journey, Our Passion'
    });

    // B2B Templates for Travel Agents
    const b2bTemplates = [
        {
            id: 'b2b-professional',
            name: 'Professional Agent Portal',
            description: 'Clean, professional design for B2B travel agents with advanced booking tools',
            category: 'Corporate',
            features: ['Multi-user support', 'Credit management', 'Bulk bookings', 'API access', 'White-label reports'],
            preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
            colors: { primary: '#1e40af', secondary: '#3b82f6' },
            popular: true
        },
        {
            id: 'b2b-modern',
            name: 'Modern Agency Suite',
            description: 'Contemporary design with intuitive navigation for modern travel agencies',
            category: 'Modern',
            features: ['Dashboard analytics', 'Quick booking', 'Commission tracker', 'Team management', 'Mobile app'],
            preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
            colors: { primary: '#059669', secondary: '#10b981' },
            popular: false
        },
        {
            id: 'b2b-enterprise',
            name: 'Enterprise Travel Hub',
            description: 'Full-featured enterprise solution for large travel management companies',
            category: 'Enterprise',
            features: ['Multi-branch support', 'Role-based access', 'Custom workflows', 'ERP integration', 'Audit logs'],
            preview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
            colors: { primary: '#7c3aed', secondary: '#a855f7' },
            popular: true
        },
        {
            id: 'b2b-minimal',
            name: 'Minimal Agent Dashboard',
            description: 'Simple, distraction-free interface focused on efficiency',
            category: 'Minimal',
            features: ['Fast booking flow', 'Essential features only', 'Low learning curve', 'Quick setup', 'Lightweight'],
            preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            colors: { primary: '#374151', secondary: '#6b7280' },
            popular: false
        }
    ];

    // B2C Templates for End Customers
    const b2cTemplates = [
        {
            id: 'b2c-wanderlust',
            name: 'Wanderlust Travel',
            description: 'Inspiring travel portal with stunning visuals and seamless booking experience',
            category: 'Lifestyle',
            features: ['Hero banners', 'Destination guides', 'Social proof', 'Wishlist', 'Travel blog'],
            preview: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
            colors: { primary: '#f59e0b', secondary: '#fbbf24' },
            popular: true
        },
        {
            id: 'b2c-explorer',
            name: 'Explorer Adventures',
            description: 'Adventure-focused design for thrill-seekers and explorers',
            category: 'Adventure',
            features: ['Activity search', 'Trip packages', 'User reviews', 'Photo gallery', 'Booking calendar'],
            preview: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800',
            colors: { primary: '#dc2626', secondary: '#ef4444' },
            popular: false
        },
        {
            id: 'b2c-luxury',
            name: 'Luxury Escapes',
            description: 'Premium design for high-end travel experiences and luxury bookings',
            category: 'Luxury',
            features: ['Concierge chat', 'VIP packages', 'Premium hotels', 'Private transfers', 'Exclusive deals'],
            preview: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
            colors: { primary: '#78350f', secondary: '#b45309' },
            popular: true
        },
        {
            id: 'b2c-budget',
            name: 'Smart Traveler',
            description: 'Value-focused portal highlighting deals, discounts and budget options',
            category: 'Budget',
            features: ['Deal alerts', 'Price comparison', 'Flexible dates', 'Reward points', 'Group discounts'],
            preview: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
            colors: { primary: '#0891b2', secondary: '#06b6d4' },
            popular: false
        },
        {
            id: 'b2c-family',
            name: 'Family Vacations',
            description: 'Family-friendly design with kid-friendly features and family packages',
            category: 'Family',
            features: ['Family packages', 'Kid activities', 'Safety info', 'Family reviews', 'Multi-room booking'],
            preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
            colors: { primary: '#4f46e5', secondary: '#6366f1' },
            popular: false
        },
        {
            id: 'b2c-corporate',
            name: 'Business Travel Pro',
            description: 'Streamlined corporate travel booking for business professionals',
            category: 'Business',
            features: ['Corporate rates', 'Expense tracking', 'Itinerary management', 'Meeting rooms', 'Loyalty program'],
            preview: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
            colors: { primary: '#1f2937', secondary: '#4b5563' },
            popular: false
        }
    ];

    const templates = activeTab === 'b2b' ? b2bTemplates : b2cTemplates;

    const TemplateCard = ({ template }) => (
        <div
            className={`bg-white rounded-2xl border-2 overflow-hidden transition-all cursor-pointer hover:shadow-xl ${
                selectedTemplate?.id === template.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            }`}
            onClick={() => setSelectedTemplate(template)}
        >
            {/* Preview Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-90"
                    style={{ backgroundImage: `url(${template.preview})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {template.popular && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                        <StarIcon className="w-3 h-3" /> Popular
                    </div>
                )}

                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded-full">
                    {template.category}
                </div>

                {/* Color Preview */}
                <div className="absolute bottom-3 left-3 flex gap-1">
                    <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: template.colors.primary }}
                    />
                    <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: template.colors.secondary }}
                    />
                </div>

                {selectedTemplate?.id === template.id && (
                    <div className="absolute bottom-3 right-3">
                        <CheckCircleIcon className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{template.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{template.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {template.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {feature}
                        </span>
                    ))}
                    {template.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{template.features.length - 3} more
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                            setShowPreview(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                        <EyeIcon className="w-4 h-4" /> Preview
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                        <RocketLaunchIcon className="w-4 h-4" /> Use Template
                    </button>
                </div>
            </div>
        </div>
    );

    const PreviewModal = () => (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-gray-900">{selectedTemplate?.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {activeTab === 'b2b' ? 'B2B Template' : 'B2C Template'}
                        </span>
                    </div>

                    {/* Device Toggle */}
                    <div className="flex items-center gap-2 bg-gray-200 p-1 rounded-lg">
                        <button
                            onClick={() => setPreviewDevice('desktop')}
                            className={`p-2 rounded-lg transition ${previewDevice === 'desktop' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}
                        >
                            <ComputerDesktopIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setPreviewDevice('tablet')}
                            className={`p-2 rounded-lg transition ${previewDevice === 'tablet' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}
                        >
                            <DevicePhoneMobileIcon className="w-5 h-5 rotate-90" />
                        </button>
                        <button
                            onClick={() => setPreviewDevice('mobile')}
                            className={`p-2 rounded-lg transition ${previewDevice === 'mobile' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}
                        >
                            <DevicePhoneMobileIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowPreview(false)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Preview Area */}
                <div className="flex h-[75vh]">
                    {/* Live Preview */}
                    <div className="flex-1 bg-gray-900 p-6 flex items-center justify-center overflow-auto">
                        <div
                            className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all ${
                                previewDevice === 'desktop' ? 'w-full h-full' :
                                previewDevice === 'tablet' ? 'w-[768px] h-[90%]' :
                                'w-[375px] h-[90%]'
                            }`}
                        >
                            {/* Mock Preview Content */}
                            <div className="h-full overflow-auto">
                                {/* Header */}
                                <div
                                    className="p-4 flex items-center justify-between"
                                    style={{ backgroundColor: customization.primaryColor }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                            <GlobeAltIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-white font-bold">{customization.companyName}</h1>
                                            <p className="text-white/80 text-xs">{customization.tagline}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-white/80 text-sm">
                                        <span>Flights</span>
                                        <span>Hotels</span>
                                        <span>Holidays</span>
                                        {activeTab === 'b2b' && <span>Dashboard</span>}
                                    </div>
                                </div>

                                {/* Hero Section */}
                                <div
                                    className="relative h-64 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${selectedTemplate?.preview})` }}
                                >
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <h2 className="text-3xl font-bold mb-2">
                                                {activeTab === 'b2b' ? 'Agent Booking Portal' : 'Find Your Perfect Trip'}
                                            </h2>
                                            <p className="text-white/80 mb-6">
                                                {activeTab === 'b2b' ? 'Access exclusive rates and commissions' : 'Discover amazing destinations worldwide'}
                                            </p>

                                            {/* Search Box */}
                                            <div className="bg-white rounded-xl p-4 max-w-2xl mx-auto">
                                                <div className="flex gap-2">
                                                    <input
                                                        className="flex-1 px-4 py-2 border rounded-lg text-gray-700"
                                                        placeholder="Where to?"
                                                    />
                                                    <input
                                                        className="px-4 py-2 border rounded-lg text-gray-700"
                                                        placeholder="When?"
                                                    />
                                                    <button
                                                        className="px-6 py-2 rounded-lg text-white font-medium"
                                                        style={{ backgroundColor: customization.primaryColor }}
                                                    >
                                                        Search
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Features Section */}
                                <div className="p-8 bg-gray-50">
                                    <h3 className="text-xl font-bold text-center text-gray-900 mb-6">
                                        {activeTab === 'b2b' ? 'Agent Benefits' : 'Why Choose Us'}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {selectedTemplate?.features.slice(0, 3).map((feature, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-xl text-center">
                                                <div
                                                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                                                    style={{ backgroundColor: `${customization.primaryColor}20` }}
                                                >
                                                    <CheckCircleIcon className="w-6 h-6" style={{ color: customization.primaryColor }} />
                                                </div>
                                                <p className="font-medium text-gray-900">{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customization Panel */}
                    <div className="w-80 border-l bg-white p-6 overflow-y-auto">
                        <h4 className="font-bold text-gray-900 mb-4">Quick Customize</h4>

                        {/* Company Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input
                                type="text"
                                value={customization.companyName}
                                onChange={(e) => setCustomization({...customization, companyName: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        {/* Tagline */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                            <input
                                type="text"
                                value={customization.tagline}
                                onChange={(e) => setCustomization({...customization, tagline: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>

                        {/* Primary Color */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={customization.primaryColor}
                                    onChange={(e) => setCustomization({...customization, primaryColor: e.target.value})}
                                    className="w-12 h-10 border rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={customization.primaryColor}
                                    onChange={(e) => setCustomization({...customization, primaryColor: e.target.value})}
                                    className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                                />
                            </div>
                        </div>

                        {/* Quick Color Presets */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color Presets</label>
                            <div className="flex flex-wrap gap-2">
                                {['#2563eb', '#059669', '#dc2626', '#7c3aed', '#f59e0b', '#0891b2', '#1f2937'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setCustomization({...customization, primaryColor: color})}
                                        className={`w-8 h-8 rounded-lg border-2 ${customization.primaryColor === color ? 'border-gray-900' : 'border-gray-200'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                                <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Click to upload logo</p>
                            </div>
                        </div>

                        <hr className="my-6" />

                        {/* Template Features */}
                        <h4 className="font-bold text-gray-900 mb-3">Included Features</h4>
                        <div className="space-y-2 mb-6">
                            {selectedTemplate?.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Deploy Button */}
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition">
                            <RocketLaunchIcon className="w-5 h-5" />
                            Deploy This Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Whitelabel Solutions</h1>
                <p className="text-gray-600 mt-2">
                    Choose from ready-made B2B and B2C templates to launch your branded travel portal in minutes
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <BuildingOfficeIcon className="w-8 h-8 mb-3 opacity-80" />
                    <p className="text-3xl font-bold">{b2bTemplates.length}</p>
                    <p className="text-blue-100">B2B Templates</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                    <UserGroupIcon className="w-8 h-8 mb-3 opacity-80" />
                    <p className="text-3xl font-bold">{b2cTemplates.length}</p>
                    <p className="text-purple-100">B2C Templates</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                    <SwatchIcon className="w-8 h-8 mb-3 opacity-80" />
                    <p className="text-3xl font-bold">∞</p>
                    <p className="text-green-100">Color Options</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                    <RocketLaunchIcon className="w-8 h-8 mb-3 opacity-80" />
                    <p className="text-3xl font-bold">5 min</p>
                    <p className="text-orange-100">Setup Time</p>
                </div>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('b2b')}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition ${
                        activeTab === 'b2b'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    <BuildingOfficeIcon className="w-6 h-6" />
                    <div className="text-left">
                        <p className="font-bold">B2B Whitelabel</p>
                        <p className={`text-sm ${activeTab === 'b2b' ? 'text-blue-100' : 'text-gray-500'}`}>
                            For Travel Agents & Partners
                        </p>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('b2c')}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition ${
                        activeTab === 'b2c'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    <UserGroupIcon className="w-6 h-6" />
                    <div className="text-left">
                        <p className="font-bold">B2C Whitelabel</p>
                        <p className={`text-sm ${activeTab === 'b2c' ? 'text-purple-100' : 'text-gray-500'}`}>
                            For End Customers
                        </p>
                    </div>
                </button>
            </div>

            {/* Description Box */}
            <div className={`mb-8 p-6 rounded-2xl ${activeTab === 'b2b' ? 'bg-blue-50 border border-blue-100' : 'bg-purple-50 border border-purple-100'}`}>
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeTab === 'b2b' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                        <SparklesIcon className={`w-6 h-6 ${activeTab === 'b2b' ? 'text-blue-600' : 'text-purple-600'}`} />
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg ${activeTab === 'b2b' ? 'text-blue-900' : 'text-purple-900'}`}>
                            {activeTab === 'b2b' ? 'B2B Agent Portal Templates' : 'B2C Customer Portal Templates'}
                        </h3>
                        <p className={`mt-1 ${activeTab === 'b2b' ? 'text-blue-700' : 'text-purple-700'}`}>
                            {activeTab === 'b2b'
                                ? 'Professional templates designed for travel agents with credit management, commission tracking, bulk booking tools, and multi-user support. Perfect for agencies and travel management companies.'
                                : 'Beautiful, conversion-optimized templates for end customers. Includes stunning visuals, smooth booking flows, mobile optimization, and all the features travelers love.'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                ))}
            </div>

            {/* Selected Template Actions */}
            {selectedTemplate && !showPreview && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src={selectedTemplate.preview}
                                alt={selectedTemplate.name}
                                className="w-16 h-12 object-cover rounded-lg"
                            />
                            <div>
                                <p className="font-bold text-gray-900">{selectedTemplate.name}</p>
                                <p className="text-sm text-gray-500">{selectedTemplate.category} Template</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedTemplate(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowPreview(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <EyeIcon className="w-5 h-5" /> Preview
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">
                                <RocketLaunchIcon className="w-5 h-5" /> Deploy Template
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && selectedTemplate && <PreviewModal />}
        </div>
    );
};

export default WhitelabelDashboard;

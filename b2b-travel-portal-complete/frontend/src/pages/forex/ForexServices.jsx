import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CurrencyDollarIcon,
    ArrowsRightLeftIcon,
    CreditCardIcon,
    BanknotesIcon,
    MapPinIcon,
    TruckIcon,
    BuildingOffice2Icon,
    CalculatorIcon,
    CheckCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const ForexServices = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('buy');
    const [formData, setFormData] = useState({
        currency: 'USD',
        amount: '',
        inrAmount: '',
        purpose: 'travel',
        deliveryType: 'delivery', // delivery, pickup
        deliveryAddress: '',
        city: '',
        travelDate: ''
    });
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(false);

    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 83.45 },
        { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 90.25 },
        { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 105.80 },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', rate: 22.72 },
        { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rate: 61.85 },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 54.30 },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 61.50 },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr.', flag: '🇨🇭', rate: 94.20 },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 0.56 },
        { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', rate: 2.42 }
    ];

    const products = [
        {
            id: 'forex_card',
            name: 'Multi-Currency Forex Card',
            icon: CreditCardIcon,
            description: 'Prepaid card for international travel',
            features: [
                'Load up to 15 currencies',
                'Locked-in exchange rates',
                'Free ATM withdrawals (limit applies)',
                'Real-time balance tracking',
                'Emergency card replacement'
            ],
            fee: 499
        },
        {
            id: 'currency_notes',
            name: 'Foreign Currency Notes',
            icon: BanknotesIcon,
            description: 'Physical currency for your trip',
            features: [
                '100% genuine currency',
                'Same day delivery (select cities)',
                'No hidden charges',
                'Door-step delivery available'
            ],
            fee: 99
        },
        {
            id: 'wire_transfer',
            name: 'Wire Transfer',
            icon: BuildingOffice2Icon,
            description: 'Send money abroad',
            features: [
                'Fast international transfers',
                'Competitive exchange rates',
                'Track your transfer',
                'Education & family maintenance'
            ],
            fee: 500
        }
    ];

    useEffect(() => {
        // Initialize rates from currencies
        const ratesObj = {};
        currencies.forEach(c => {
            ratesObj[c.code] = {
                buy: c.rate * 1.02, // 2% markup for buying
                sell: c.rate * 0.98 // 2% discount for selling
            };
        });
        setRates(ratesObj);
    }, []);

    const getCurrentRate = () => {
        const currency = currencies.find(c => c.code === formData.currency);
        if (!currency) return 0;
        return activeTab === 'buy' ? currency.rate * 1.02 : currency.rate * 0.98;
    };

    const handleAmountChange = (field, value) => {
        const rate = getCurrentRate();
        if (field === 'amount') {
            setFormData({
                ...formData,
                amount: value,
                inrAmount: value ? (parseFloat(value) * rate).toFixed(2) : ''
            });
        } else {
            setFormData({
                ...formData,
                inrAmount: value,
                amount: value ? (parseFloat(value) / rate).toFixed(2) : ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            navigate('/forex/checkout', {
                state: {
                    ...formData,
                    type: activeTab,
                    rate: getCurrentRate(),
                    product: 'currency_notes'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Forex Services</h1>
                    <p className="text-emerald-100">Best rates for foreign currency exchange</p>
                </div>
            </div>

            {/* Live Rates Ticker */}
            <div className="bg-gray-900 text-white py-2 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                    {currencies.map((currency, i) => (
                        <span key={i} className="inline-flex items-center gap-2 mx-6">
                            <span>{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-green-400">₹{currency.rate.toFixed(2)}</span>
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Exchange Calculator */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            {/* Buy/Sell Tabs */}
                            <div className="flex mb-6">
                                <button
                                    onClick={() => setActiveTab('buy')}
                                    className={`flex-1 py-3 text-center font-semibold rounded-l-lg transition ${
                                        activeTab === 'buy'
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Buy Forex
                                </button>
                                <button
                                    onClick={() => setActiveTab('sell')}
                                    className={`flex-1 py-3 text-center font-semibold rounded-r-lg transition ${
                                        activeTab === 'sell'
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Sell Forex
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Currency Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Currency
                                        </label>
                                        <select
                                            value={formData.currency}
                                            onChange={(e) => {
                                                setFormData({ ...formData, currency: e.target.value });
                                                handleAmountChange('amount', formData.amount);
                                            }}
                                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                                        >
                                            {currencies.map(c => (
                                                <option key={c.code} value={c.code}>
                                                    {c.flag} {c.code} - {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Purpose */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Purpose
                                        </label>
                                        <select
                                            value={formData.purpose}
                                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="travel">Personal Travel</option>
                                            <option value="business">Business Travel</option>
                                            <option value="education">Education</option>
                                            <option value="medical">Medical Treatment</option>
                                            <option value="gift">Gift/Family Maintenance</option>
                                        </select>
                                    </div>

                                    {/* Foreign Currency Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {activeTab === 'buy' ? 'You Get' : 'You Give'} ({formData.currency})
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                                {currencies.find(c => c.code === formData.currency)?.symbol}
                                            </span>
                                            <input
                                                type="number"
                                                value={formData.amount}
                                                onChange={(e) => handleAmountChange('amount', e.target.value)}
                                                placeholder="Enter amount"
                                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    {/* INR Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {activeTab === 'buy' ? 'You Pay' : 'You Get'} (INR)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                            <input
                                                type="number"
                                                value={formData.inrAmount}
                                                onChange={(e) => handleAmountChange('inrAmount', e.target.value)}
                                                placeholder="Enter amount"
                                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Travel Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Travel Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.travelDate}
                                            onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>

                                    {/* Delivery Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Delivery Type
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="delivery"
                                                    value="delivery"
                                                    checked={formData.deliveryType === 'delivery'}
                                                    onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                                                    className="text-emerald-600"
                                                />
                                                <span className="flex items-center gap-1">
                                                    <TruckIcon className="w-4 h-4" />
                                                    Home Delivery
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="delivery"
                                                    value="pickup"
                                                    checked={formData.deliveryType === 'pickup'}
                                                    onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                                                    className="text-emerald-600"
                                                />
                                                <span className="flex items-center gap-1">
                                                    <MapPinIcon className="w-4 h-4" />
                                                    Branch Pickup
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <select
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                                            required
                                        >
                                            <option value="">Select city</option>
                                            {cities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {formData.deliveryType === 'delivery' && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Delivery Address
                                            </label>
                                            <textarea
                                                value={formData.deliveryAddress}
                                                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                                                rows={2}
                                                placeholder="Enter your complete address"
                                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                                                required={formData.deliveryType === 'delivery'}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Rate Display */}
                                <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-gray-600">Today's Rate</div>
                                            <div className="text-2xl font-bold text-emerald-600">
                                                1 {formData.currency} = ₹{getCurrentRate().toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Total Amount</div>
                                            <div className="text-2xl font-bold">
                                                ₹{parseFloat(formData.inrAmount || 0).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !formData.amount}
                                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <CurrencyDollarIcon className="w-5 h-5" />
                                            {activeTab === 'buy' ? 'Buy Now' : 'Sell Now'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Products Sidebar */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Our Products</h3>
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                                onClick={() => navigate(`/forex/${product.id}`)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-100 rounded-lg">
                                        <product.icon className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{product.name}</h4>
                                        <p className="text-sm text-gray-600">{product.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Info Box */}
                        <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-blue-900">RBI Guidelines</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        As per RBI guidelines, individuals can carry up to USD 3,000 or equivalent in cash.
                                        Amounts exceeding USD 3,000 must be in forex card/traveler's cheques.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Currency Rates Table */}
                <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold">Live Exchange Rates</h2>
                        <p className="text-sm text-gray-600">Rates updated every 15 minutes</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">We Buy</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">We Sell</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {currencies.map(currency => (
                                    <tr key={currency.code} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{currency.flag}</span>
                                                <div>
                                                    <div className="font-medium">{currency.code}</div>
                                                    <div className="text-sm text-gray-500">{currency.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">
                                            ₹{(currency.rate * 0.98).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-emerald-600">
                                            ₹{(currency.rate * 1.02).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForexServices;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CreditCardIcon,
    BuildingLibraryIcon,
    DevicePhoneMobileIcon,
    QrCodeIcon,
    ShieldCheckIcon,
    LockClosedIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const PaymentGateway = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null); // null, 'success', 'failed'
    const [selectedGateway, setSelectedGateway] = useState('razorpay');

    const bookingDetails = location.state || {
        amount: 25000,
        booking: { id: 'BK12345', type: 'Flight' },
        currency: 'INR'
    };

    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    const paymentGateways = [
        { id: 'razorpay', name: 'Razorpay', logo: '💳', popular: true },
        { id: 'payu', name: 'PayU', logo: '🔵' },
        { id: 'ccavenue', name: 'CCAvenue', logo: '💰' },
        { id: 'stripe', name: 'Stripe', logo: '💜' }
    ];

    const banks = [
        { id: 'hdfc', name: 'HDFC Bank' },
        { id: 'icici', name: 'ICICI Bank' },
        { id: 'sbi', name: 'State Bank of India' },
        { id: 'axis', name: 'Axis Bank' },
        { id: 'kotak', name: 'Kotak Mahindra Bank' },
        { id: 'pnb', name: 'Punjab National Bank' }
    ];

    const paymentMethods = [
        { id: 'card', name: 'Credit/Debit Card', icon: CreditCardIcon, description: 'Visa, Mastercard, RuPay' },
        { id: 'upi', name: 'UPI', icon: DevicePhoneMobileIcon, description: 'Google Pay, PhonePe, Paytm' },
        { id: 'netbanking', name: 'Net Banking', icon: BuildingLibraryIcon, description: 'All major banks' },
        { id: 'qr', name: 'QR Code', icon: QrCodeIcon, description: 'Scan and pay' },
        { id: 'wallet', name: 'Wallet', icon: CreditCardIcon, description: 'Use wallet balance' }
    ];

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setProcessing(true);

        try {
            // Create order on backend
            const orderResponse = await api.post('/payment/create-order', {
                amount: bookingDetails.amount,
                currency: 'INR',
                bookingId: bookingDetails.booking?.id,
                gateway: selectedGateway
            });

            if (selectedGateway === 'razorpay') {
                await processRazorpayPayment(orderResponse.data);
            } else {
                // Simulate payment for other gateways
                await simulatePayment();
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentStatus('failed');
        } finally {
            setProcessing(false);
        }
    };

    const processRazorpayPayment = async (orderData) => {
        const loaded = await initializeRazorpay();

        if (!loaded) {
            // Simulate if Razorpay not available
            await simulatePayment();
            return;
        }

        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_demo',
            amount: bookingDetails.amount * 100,
            currency: 'INR',
            name: 'Travel Portal',
            description: `Booking: ${bookingDetails.booking?.id}`,
            order_id: orderData.orderId,
            handler: async (response) => {
                // Verify payment on backend
                try {
                    await api.post('/payment/verify', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });
                    setPaymentStatus('success');
                } catch (error) {
                    setPaymentStatus('failed');
                }
            },
            prefill: {
                name: cardDetails.name,
                email: 'user@example.com',
                contact: '9999999999'
            },
            theme: {
                color: '#2563eb'
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const simulatePayment = async () => {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 90% success rate for simulation
        if (Math.random() > 0.1) {
            setPaymentStatus('success');
        } else {
            setPaymentStatus('failed');
        }
    };

    const handleRetry = () => {
        setPaymentStatus(null);
        setProcessing(false);
    };

    const handleComplete = () => {
        navigate('/booking-confirmation', {
            state: { booking: bookingDetails.booking, payment: { status: 'success', amount: bookingDetails.amount } }
        });
    };

    // Payment Success/Failed Screen
    if (paymentStatus) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    {paymentStatus === 'success' ? (
                        <>
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircleIcon className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                            <p className="text-gray-600 mb-6">
                                Your payment of ₹{bookingDetails.amount.toLocaleString()} has been processed successfully.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="text-sm text-gray-500">Transaction ID</div>
                                <div className="font-mono font-bold">TXN{Date.now()}</div>
                            </div>
                            <button
                                onClick={handleComplete}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                            >
                                View Booking Details
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XCircleIcon className="w-12 h-12 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
                            <p className="text-gray-600 mb-6">
                                Unfortunately, your payment could not be processed. Please try again.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={handleRetry}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    <ArrowPathIcon className="w-5 h-5" />
                                    Try Again
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
                                >
                                    Go Back
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center gap-3">
                        <LockClosedIcon className="w-6 h-6" />
                        <div>
                            <h1 className="text-2xl font-bold">Secure Payment</h1>
                            <p className="text-blue-100 text-sm">Your payment information is encrypted</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Payment Gateway Selection */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="font-semibold text-lg mb-4">Select Payment Gateway</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {paymentGateways.map(gw => (
                                    <button
                                        key={gw.id}
                                        onClick={() => setSelectedGateway(gw.id)}
                                        className={`p-4 rounded-lg border-2 text-center transition ${
                                            selectedGateway === gw.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="text-2xl block mb-1">{gw.logo}</span>
                                        <span className="text-sm font-medium">{gw.name}</span>
                                        {gw.popular && (
                                            <span className="text-xs text-blue-600 block">Popular</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="font-semibold text-lg mb-4">Select Payment Method</h2>
                            <div className="space-y-3">
                                {paymentMethods.map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`w-full p-4 rounded-lg border-2 text-left transition flex items-center gap-4 ${
                                            paymentMethod === method.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-lg ${
                                            paymentMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
                                        }`}>
                                            <method.icon className={`w-6 h-6 ${
                                                paymentMethod === method.id ? 'text-blue-600' : 'text-gray-500'
                                            }`} />
                                        </div>
                                        <div>
                                            <div className="font-medium">{method.name}</div>
                                            <div className="text-sm text-gray-500">{method.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Details Form */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="font-semibold text-lg mb-4">
                                {paymentMethod === 'card' && 'Card Details'}
                                {paymentMethod === 'upi' && 'UPI Details'}
                                {paymentMethod === 'netbanking' && 'Select Bank'}
                                {paymentMethod === 'qr' && 'Scan QR Code'}
                                {paymentMethod === 'wallet' && 'Wallet Balance'}
                            </h2>

                            {/* Card Form */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            value={cardDetails.number}
                                            onChange={(e) => setCardDetails({
                                                ...cardDetails,
                                                number: formatCardNumber(e.target.value)
                                            })}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            className="w-full border rounded-lg px-4 py-3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            value={cardDetails.name}
                                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full border rounded-lg px-4 py-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                value={cardDetails.expiry}
                                                onChange={(e) => setCardDetails({
                                                    ...cardDetails,
                                                    expiry: formatExpiry(e.target.value)
                                                })}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className="w-full border rounded-lg px-4 py-3"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                CVV
                                            </label>
                                            <input
                                                type="password"
                                                value={cardDetails.cvv}
                                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                placeholder="***"
                                                maxLength={4}
                                                className="w-full border rounded-lg px-4 py-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* UPI Form */}
                            {paymentMethod === 'upi' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            UPI ID
                                        </label>
                                        <input
                                            type="text"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            placeholder="yourname@upi"
                                            className="w-full border rounded-lg px-4 py-3"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        {['@ybl', '@paytm', '@okaxis', '@oksbi'].map(suffix => (
                                            <button
                                                key={suffix}
                                                onClick={() => setUpiId(upiId.split('@')[0] + suffix)}
                                                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                                            >
                                                {suffix}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Net Banking */}
                            {paymentMethod === 'netbanking' && (
                                <div className="grid grid-cols-2 gap-3">
                                    {banks.map(bank => (
                                        <button
                                            key={bank.id}
                                            onClick={() => setSelectedBank(bank.id)}
                                            className={`p-4 rounded-lg border-2 text-left transition ${
                                                selectedBank === bank.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <span className="font-medium">{bank.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* QR Code */}
                            {paymentMethod === 'qr' && (
                                <div className="text-center py-8">
                                    <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                        <QrCodeIcon className="w-24 h-24 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600">Scan this QR code with any UPI app to pay</p>
                                </div>
                            )}

                            {/* Wallet */}
                            {paymentMethod === 'wallet' && (
                                <div className="text-center py-8">
                                    <div className="text-3xl font-bold text-green-600 mb-2">₹45,000</div>
                                    <p className="text-gray-600">Available Balance</p>
                                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                        <CheckCircleIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-green-700">Sufficient balance available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pay Button */}
                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <LockClosedIcon className="w-5 h-5" />
                                    Pay ₹{bookingDetails.amount.toLocaleString()}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Booking ID</span>
                                    <span className="font-medium">{bookingDetails.booking?.id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Type</span>
                                    <span className="font-medium">{bookingDetails.booking?.type}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>₹{Math.round(bookingDetails.amount * 0.85).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taxes & Fees</span>
                                    <span>₹{Math.round(bookingDetails.amount * 0.15).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                    <span>Total</span>
                                    <span>₹{bookingDetails.amount.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Security Badges */}
                            <div className="mt-6 pt-6 border-t">
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                                    <span>100% Secure Payments</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <LockClosedIcon className="w-5 h-5 text-green-600" />
                                    <span>256-bit SSL Encryption</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <span className="text-2xl">💳</span>
                                    <span className="text-2xl">🏦</span>
                                    <span className="text-2xl">📱</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;

import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    BuildingOfficeIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ArrowUpTrayIcon,
    InformationCircleIcon,
    ChevronRightIcon,
    ClockIcon,
    CurrencyRupeeIcon,
    UserGroupIcon,
    GlobeAltIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

const MembershipApplication = () => {
    const { bodyCode } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Business Info
        businessName: '',
        businessType: '',
        yearEstablished: '',
        gstNumber: '',
        panNumber: '',
        annualTurnover: '',
        employeeCount: '',

        // Contact Info
        contactPerson: '',
        designation: '',
        email: '',
        phone: '',
        website: '',

        // Address
        address: '',
        city: '',
        state: '',
        pincode: '',

        // Documents
        documents: {}
    });

    const associations = {
        TAFI: {
            name: 'TAFI',
            fullName: 'Travel Agents Federation of India',
            logo: '🇮🇳',
            membershipFee: 15000,
            applicationFee: 2000,
            benefits: [
                'Access to TAFI Conventions',
                'Industry networking events',
                'Dispute resolution support',
                'Training programs',
                'TAFI member directory listing',
                'Government liaison support'
            ],
            requiredDocs: [
                { id: 'registration', name: 'Business Registration Certificate', required: true },
                { id: 'gst', name: 'GST Certificate', required: true },
                { id: 'pan', name: 'PAN Card', required: true },
                { id: 'bank', name: 'Bank Statement (6 months)', required: true },
                { id: 'office', name: 'Office Photographs', required: true },
                { id: 'reference', name: 'Reference Letters (2)', required: false }
            ],
            eligibility: [
                'Minimum 1 year in travel business',
                'Valid GST registration',
                'Physical office space',
                'IATA accreditation preferred (not mandatory)'
            ]
        },
        IATO: {
            name: 'IATO',
            fullName: 'Indian Association of Tour Operators',
            logo: '🏛️',
            membershipFee: 20000,
            applicationFee: 3000,
            benefits: [
                'Inbound tourism networking',
                'International roadshows participation',
                'ITB Berlin representation',
                'Government advocacy',
                'Training and FAM trips',
                'IATO directory listing'
            ],
            requiredDocs: [
                { id: 'registration', name: 'Business Registration Certificate', required: true },
                { id: 'gst', name: 'GST Certificate', required: true },
                { id: 'pan', name: 'PAN Card', required: true },
                { id: 'mot', name: 'Ministry of Tourism Recognition', required: true },
                { id: 'bank', name: 'Bank Statement (12 months)', required: true },
                { id: 'office', name: 'Office Photographs', required: true }
            ],
            eligibility: [
                'Focus on inbound tourism',
                'Minimum 2 years experience',
                'Ministry of Tourism recognition',
                'Valid GST registration'
            ]
        },
        TAAI: {
            name: 'TAAI',
            fullName: 'Travel Agents Association of India',
            logo: '🎯',
            membershipFee: 12000,
            applicationFee: 2000,
            benefits: [
                'Oldest travel association in India',
                'Pan-India network',
                'Annual conventions',
                'Training workshops',
                'Legal support',
                'Industry representation'
            ],
            requiredDocs: [
                { id: 'registration', name: 'Business Registration Certificate', required: true },
                { id: 'gst', name: 'GST Certificate', required: true },
                { id: 'pan', name: 'PAN Card', required: true },
                { id: 'bank', name: 'Bank Statement (6 months)', required: true },
                { id: 'reference', name: 'Reference from TAAI member', required: true }
            ],
            eligibility: [
                'Minimum 1 year in travel business',
                'Valid GST registration',
                'Reference from existing TAAI member'
            ]
        }
    };

    const association = associations[bodyCode] || associations.TAFI;

    const steps = [
        { id: 1, name: 'Business Information', icon: BuildingOfficeIcon },
        { id: 2, name: 'Contact Details', icon: UserGroupIcon },
        { id: 3, name: 'Documents Upload', icon: DocumentTextIcon },
        { id: 4, name: 'Review & Pay', icon: CurrencyRupeeIcon }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (docId, file) => {
        setFormData(prev => ({
            ...prev,
            documents: { ...prev.documents, [docId]: file }
        }));
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-2 text-blue-600 mb-4 text-sm">
                        <Link to="/certification" className="hover:underline">Certification Hub</Link>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        <Link to="/certification/memberships" className="hover:underline">Memberships</Link>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{association.name} Application</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">
                            {association.logo}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{association.name} Membership Application</h1>
                            <p className="text-gray-600">{association.fullName}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Main Form */}
                    <div className="flex-1">
                        {/* Progress Steps */}
                        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <div className="flex items-center justify-between">
                                {steps.map((step, idx) => (
                                    <React.Fragment key={step.id}>
                                        <div className={`flex items-center gap-3 ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                currentStep > step.id
                                                    ? 'bg-green-500 text-white'
                                                    : currentStep === step.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200'
                                            }`}>
                                                {currentStep > step.id ? (
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                ) : (
                                                    <step.icon className="w-5 h-5" />
                                                )}
                                            </div>
                                            <span className="hidden md:block font-medium">{step.name}</span>
                                        </div>
                                        {idx < steps.length - 1 && (
                                            <div className={`flex-1 h-1 mx-4 rounded ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Step 1: Business Information */}
                        {currentStep === 1 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your registered business name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                                            <select
                                                name="businessType"
                                                value={formData.businessType}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select type</option>
                                                <option value="proprietorship">Proprietorship</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="llp">LLP</option>
                                                <option value="pvt_ltd">Private Limited</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Year Established *</label>
                                            <input
                                                type="number"
                                                name="yearEstablished"
                                                value={formData.yearEstablished}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., 2015"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number *</label>
                                            <input
                                                type="text"
                                                name="gstNumber"
                                                value={formData.gstNumber}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="22AAAAA0000A1Z5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number *</label>
                                            <input
                                                type="text"
                                                name="panNumber"
                                                value={formData.panNumber}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="AAAAA0000A"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Turnover</label>
                                            <select
                                                name="annualTurnover"
                                                value={formData.annualTurnover}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select range</option>
                                                <option value="under_10l">Under ₹10 Lakhs</option>
                                                <option value="10l_50l">₹10 - 50 Lakhs</option>
                                                <option value="50l_1cr">₹50 Lakhs - 1 Crore</option>
                                                <option value="1cr_5cr">₹1 - 5 Crores</option>
                                                <option value="above_5cr">Above ₹5 Crores</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Employees</label>
                                            <input
                                                type="number"
                                                name="employeeCount"
                                                value={formData.employeeCount}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., 5"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Contact Details */}
                        {currentStep === 2 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Details</h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name *</label>
                                            <input
                                                type="text"
                                                name="contactPerson"
                                                value={formData.contactPerson}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                                            <input
                                                type="text"
                                                name="designation"
                                                value={formData.designation}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://www.example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Office Address *</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Documents Upload */}
                        {currentStep === 3 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Documents Upload</h2>

                                <div className="space-y-4">
                                    {association.requiredDocs.map((doc) => (
                                        <div key={doc.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {doc.name}
                                                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                                                    </p>
                                                    <p className="text-sm text-gray-500">PDF, JPG, PNG (max 5MB)</p>
                                                </div>
                                                <div>
                                                    {formData.documents[doc.id] ? (
                                                        <div className="flex items-center gap-2 text-green-600">
                                                            <CheckCircleIcon className="w-5 h-5" />
                                                            <span className="text-sm">Uploaded</span>
                                                        </div>
                                                    ) : (
                                                        <label className="cursor-pointer">
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                                                            />
                                                            <span className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                                                <ArrowUpTrayIcon className="w-4 h-4" />
                                                                Upload
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review & Pay */}
                        {currentStep === 4 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Review & Pay</h2>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-medium text-gray-900 mb-3">Business Details</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Business Name:</span>
                                                <p className="font-medium">{formData.businessName || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Business Type:</span>
                                                <p className="font-medium">{formData.businessType || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">GST Number:</span>
                                                <p className="font-medium">{formData.gstNumber || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Contact:</span>
                                                <p className="font-medium">{formData.email || '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="font-medium text-gray-900 mb-4">Payment Summary</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Application Fee</span>
                                                <span>₹{association.applicationFee.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Membership Fee</span>
                                                <span>₹{association.membershipFee.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">GST (18%)</span>
                                                <span>₹{Math.round((association.applicationFee + association.membershipFee) * 0.18).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg border-t pt-3">
                                                <span>Total</span>
                                                <span>₹{Math.round((association.applicationFee + association.membershipFee) * 1.18).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                                        <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-blue-800">
                                            Your application will be reviewed within 7-10 working days.
                                            You'll receive updates via email and SMS.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                                Previous
                            </button>

                            {currentStep < steps.length ? (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                                    Pay ₹{Math.round((association.applicationFee + association.membershipFee) * 1.18).toLocaleString()} & Submit
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-5 sticky top-4">
                            <h3 className="font-semibold text-gray-900 mb-4">Membership Benefits</h3>
                            <ul className="space-y-3 mb-6">
                                {association.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-600">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <h3 className="font-semibold text-gray-900 mb-4">Eligibility</h3>
                            <ul className="space-y-2 mb-6">
                                {association.eligibility.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <ShieldCheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span className="text-gray-600">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ClockIcon className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">Processing Time</span>
                                </div>
                                <p className="font-medium text-gray-900">7-10 Working Days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembershipApplication;

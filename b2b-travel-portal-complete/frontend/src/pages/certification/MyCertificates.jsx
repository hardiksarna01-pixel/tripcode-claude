import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    DocumentCheckIcon,
    ArrowDownTrayIcon,
    ShareIcon,
    EyeIcon,
    CalendarIcon,
    CheckBadgeIcon,
    AcademicCapIcon,
    QrCodeIcon,
    LinkIcon,
    XMarkIcon,
    ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const MyCertificates = () => {
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const certificates = [
        {
            id: 'CERT-2024-001',
            title: 'Certificate of Completion',
            courseName: 'IATA Foundation in Travel & Tourism',
            issuingBody: 'IATA',
            issueDate: '2024-06-10',
            validUntil: null,
            grade: 'A',
            score: 92,
            verificationCode: 'IATA-FND-2024-ABCD1234',
            status: 'active',
            recipientName: 'Rajesh Kumar Sharma',
            thumbnail: 'iata-foundation'
        },
        {
            id: 'CERT-2024-002',
            title: 'Amadeus Basic Certification',
            courseName: 'Amadeus Basic Certification',
            issuingBody: 'Amadeus',
            issueDate: '2024-05-15',
            validUntil: '2026-05-15',
            grade: 'A+',
            score: 95,
            verificationCode: 'AMD-BSC-2024-EFGH5678',
            status: 'active',
            recipientName: 'Rajesh Kumar Sharma',
            thumbnail: 'amadeus-basic'
        },
        {
            id: 'CERT-2024-003',
            title: 'Dubai Destination Specialist',
            courseName: 'Dubai Destination Specialist',
            issuingBody: 'TripCode Academy',
            issueDate: '2024-04-20',
            validUntil: '2026-04-20',
            grade: 'B+',
            score: 78,
            verificationCode: 'TC-DXB-2024-IJKL9012',
            status: 'active',
            recipientName: 'Rajesh Kumar Sharma',
            thumbnail: 'dubai'
        },
        {
            id: 'CERT-2024-004',
            title: 'Travel Business Startup',
            courseName: 'Travel Business Startup Masterclass',
            issuingBody: 'TripCode Academy',
            issueDate: '2024-03-05',
            validUntil: null,
            grade: 'A',
            score: 88,
            verificationCode: 'TC-BIZ-2024-MNOP3456',
            status: 'active',
            recipientName: 'Rajesh Kumar Sharma',
            thumbnail: 'startup'
        }
    ];

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
        if (grade.startsWith('C')) return 'text-amber-600 bg-amber-100';
        return 'text-gray-600 bg-gray-100';
    };

    const copyLink = (code) => {
        navigator.clipboard.writeText(`https://tripcode.in/verify/${code}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Link to="/certification" className="hover:underline">Certification Hub</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">My Certificates</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
                            <p className="text-gray-600">View and download your earned certificates</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-3xl font-bold text-blue-600">{certificates.length}</p>
                                <p className="text-sm text-gray-500">Certificates Earned</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Certificate Preview */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                    }}></div>
                                </div>
                                <div className="text-center text-white relative z-10">
                                    <DocumentCheckIcon className="w-12 h-12 mx-auto mb-2 opacity-80" />
                                    <p className="font-serif text-lg">{cert.title}</p>
                                    <p className="text-sm opacity-80 mt-1">{cert.issuingBody}</p>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getGradeColor(cert.grade)}`}>
                                        Grade: {cert.grade}
                                    </span>
                                </div>
                            </div>

                            {/* Certificate Info */}
                            <div className="p-5">
                                <h3 className="font-semibold text-gray-900 mb-2">{cert.courseName}</h3>

                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <CalendarIcon className="w-4 h-4" />
                                        Issued: {new Date(cert.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    {cert.validUntil && (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <CheckBadgeIcon className="w-4 h-4" />
                                            Valid until: {new Date(cert.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <QrCodeIcon className="w-4 h-4" />
                                        <span className="font-mono text-xs">{cert.verificationCode}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedCertificate(cert)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        View
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        <ArrowDownTrayIcon className="w-4 h-4" />
                                        Download
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedCertificate(cert);
                                            setShowShareModal(true);
                                        }}
                                        className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        <ShareIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {certificates.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
                        <p className="text-gray-500 mb-6">Complete courses and pass exams to earn certificates</p>
                        <Link
                            to="/certification/courses"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Browse Courses
                        </Link>
                    </div>
                )}

                {/* Certificate Verification Info */}
                <div className="mt-10 bg-blue-50 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckBadgeIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Certificate Verification</h3>
                            <p className="text-gray-600 mb-4">
                                All certificates can be verified by employers and third parties using the verification code
                                or QR code on the certificate. Share your certificate link to provide instant verification.
                            </p>
                            <Link to="/verify" className="text-blue-600 hover:underline flex items-center gap-1">
                                <LinkIcon className="w-4 h-4" />
                                Go to Verification Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificate View Modal */}
            {selectedCertificate && !showShareModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Certificate Preview</h3>
                            <button onClick={() => setSelectedCertificate(null)}>
                                <XMarkIcon className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Certificate Design */}
                        <div className="p-8">
                            <div className="border-8 border-double border-blue-200 p-8 bg-gradient-to-br from-blue-50 to-white">
                                <div className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                                            <AcademicCapIcon className="w-10 h-10 text-white" />
                                        </div>
                                    </div>

                                    <h1 className="text-3xl font-serif text-gray-800 mb-2">{selectedCertificate.title}</h1>
                                    <p className="text-gray-500 mb-6">This is to certify that</p>

                                    <p className="text-2xl font-serif text-blue-800 mb-6 border-b-2 border-blue-200 pb-2 inline-block px-8">
                                        {selectedCertificate.recipientName}
                                    </p>

                                    <p className="text-gray-500 mb-4">has successfully completed</p>

                                    <p className="text-xl font-semibold text-gray-800 mb-6">{selectedCertificate.courseName}</p>

                                    <div className="flex justify-center gap-8 mb-6">
                                        <div>
                                            <p className="text-2xl font-bold text-blue-600">{selectedCertificate.score}%</p>
                                            <p className="text-sm text-gray-500">Score</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-green-600">{selectedCertificate.grade}</p>
                                            <p className="text-sm text-gray-500">Grade</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end mt-8">
                                        <div className="text-left">
                                            <p className="text-sm text-gray-500">Issue Date</p>
                                            <p className="font-medium">{new Date(selectedCertificate.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-1 flex items-center justify-center">
                                                <QrCodeIcon className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <p className="text-xs text-gray-500">{selectedCertificate.verificationCode}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Issued By</p>
                                            <p className="font-medium">{selectedCertificate.issuingBody}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedCertificate(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && selectedCertificate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Share Certificate</h3>
                            <button onClick={() => { setShowShareModal(false); setSelectedCertificate(null); }}>
                                <XMarkIcon className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-3">Verification Link</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={`https://tripcode.in/verify/${selectedCertificate.verificationCode}`}
                                    className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm"
                                />
                                <button
                                    onClick={() => copyLink(selectedCertificate.verificationCode)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <ClipboardDocumentIcon className="w-4 h-4" />
                                    {copiedLink ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-3">Share on Social Media</p>
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-[#0077B5] text-white rounded-lg hover:opacity-90">
                                    LinkedIn
                                </button>
                                <button className="flex-1 py-3 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90">
                                    Twitter
                                </button>
                                <button className="flex-1 py-3 bg-[#25D366] text-white rounded-lg hover:opacity-90">
                                    WhatsApp
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => { setShowShareModal(false); setSelectedCertificate(null); }}
                            className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCertificates;

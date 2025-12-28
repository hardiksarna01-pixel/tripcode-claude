import React, { useState, useEffect } from 'react';
import { markupApi } from '../services/api';

const MarkupManagement = () => {
    const [markups, setMarkups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMarkup, setEditingMarkup] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'fixed',
        amount: '',
        applyTo: 'all',
        airlineCode: '',
        origin: '',
        destination: '',
        cabinClass: '',
        perPassenger: true,
        isActive: true
    });

    useEffect(() => {
        fetchMarkups();
    }, []);

    const fetchMarkups = async () => {
        setLoading(true);
        try {
            // Mock data for demo
            setMarkups([
                { id: 1, name: 'Default Markup', type: 'fixed', amount: 250, applyTo: 'all', perPassenger: true, isActive: true },
                { id: 2, name: 'Metro Routes', type: 'fixed', amount: 300, applyTo: 'route', origin: 'DEL', destination: 'BOM', perPassenger: true, isActive: true },
                { id: 3, name: 'Air India Premium', type: 'percentage', amount: 2, applyTo: 'airline', airlineCode: 'AI', perPassenger: false, isActive: true },
                { id: 4, name: 'Business Class', type: 'fixed', amount: 500, applyTo: 'class', cabinClass: 'business', perPassenger: true, isActive: false }
            ]);
        } catch (error) {
            console.error('Error fetching markups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (editingMarkup) {
                // await markupApi.updateMarkup(editingMarkup.id, formData);
                setMarkups(markups.map(m => m.id === editingMarkup.id ? { ...m, ...formData } : m));
            } else {
                // await markupApi.createMarkup(formData);
                setMarkups([...markups, { id: Date.now(), ...formData }]);
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving markup:', error);
        }
    };

    const handleEdit = (markup) => {
        setEditingMarkup(markup);
        setFormData(markup);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this markup?')) return;
        try {
            // await markupApi.deleteMarkup(id);
            setMarkups(markups.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting markup:', error);
        }
    };

    const handleToggle = async (id) => {
        try {
            // await markupApi.toggleMarkup(id);
            setMarkups(markups.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
        } catch (error) {
            console.error('Error toggling markup:', error);
        }
    };

    const resetForm = () => {
        setEditingMarkup(null);
        setFormData({
            name: '',
            type: 'fixed',
            amount: '',
            applyTo: 'all',
            airlineCode: '',
            origin: '',
            destination: '',
            cabinClass: '',
            perPassenger: true,
            isActive: true
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Markup Management</h1>
                        <p className="text-gray-500">Configure your fare markups</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Markup
                    </button>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-sm">
                        <strong>How markups work:</strong> Markups are added on top of the net fare.
                        You can set fixed amounts or percentage-based markups.
                        Higher priority markups are applied first when multiple rules match.
                    </p>
                </div>

                {/* Markups Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apply To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Loading markups...
                                    </td>
                                </tr>
                            ) : markups.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No markups configured. Click "Add Markup" to create one.
                                    </td>
                                </tr>
                            ) : (
                                markups.map((markup) => (
                                    <tr key={markup.id} className={!markup.isActive ? 'bg-gray-50 opacity-60' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{markup.name}</div>
                                            {markup.perPassenger && (
                                                <span className="text-xs text-gray-500">Per passenger</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                markup.type === 'fixed' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {markup.type === 'fixed' ? 'Fixed' : 'Percentage'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                                            {markup.type === 'fixed' ? `₹${markup.amount}` : `${markup.amount}%`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {markup.applyTo === 'all' && 'All Flights'}
                                                {markup.applyTo === 'airline' && `Airline: ${markup.airlineCode}`}
                                                {markup.applyTo === 'route' && `Route: ${markup.origin}-${markup.destination}`}
                                                {markup.applyTo === 'class' && `Class: ${markup.cabinClass}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggle(markup.id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    markup.isActive ? 'bg-green-500' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    markup.isActive ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button
                                                onClick={() => handleEdit(markup)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(markup.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingMarkup ? 'Edit Markup' : 'Add New Markup'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Markup Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Default Markup"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="fixed">Fixed Amount</option>
                                        <option value="percentage">Percentage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount {formData.type === 'percentage' ? '(%)' : '(₹)'}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder={formData.type === 'percentage' ? '2.5' : '250'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apply To</label>
                                <select
                                    value={formData.applyTo}
                                    onChange={(e) => setFormData({ ...formData, applyTo: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Flights</option>
                                    <option value="airline">Specific Airline</option>
                                    <option value="route">Specific Route</option>
                                    <option value="class">Cabin Class</option>
                                </select>
                            </div>

                            {formData.applyTo === 'airline' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Airline Code</label>
                                    <input
                                        type="text"
                                        value={formData.airlineCode}
                                        onChange={(e) => setFormData({ ...formData, airlineCode: e.target.value.toUpperCase() })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., AI, 6E, UK"
                                        maxLength={2}
                                    />
                                </div>
                            )}

                            {formData.applyTo === 'route' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                                        <input
                                            type="text"
                                            value={formData.origin}
                                            onChange={(e) => setFormData({ ...formData, origin: e.target.value.toUpperCase() })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="DEL"
                                            maxLength={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                                        <input
                                            type="text"
                                            value={formData.destination}
                                            onChange={(e) => setFormData({ ...formData, destination: e.target.value.toUpperCase() })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="BOM"
                                            maxLength={3}
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.applyTo === 'class' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cabin Class</label>
                                    <select
                                        value={formData.cabinClass}
                                        onChange={(e) => setFormData({ ...formData, cabinClass: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Class</option>
                                        <option value="economy">Economy</option>
                                        <option value="premium_economy">Premium Economy</option>
                                        <option value="business">Business</option>
                                        <option value="first">First Class</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.perPassenger}
                                        onChange={(e) => setFormData({ ...formData, perPassenger: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Apply per passenger</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {editingMarkup ? 'Update' : 'Create'} Markup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarkupManagement;

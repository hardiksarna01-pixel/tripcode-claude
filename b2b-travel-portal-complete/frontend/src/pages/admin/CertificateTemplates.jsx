import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XCircleIcon,
  SwatchIcon,
  PhotoIcon,
  Cog6ToothIcon,
  ArrowDownTrayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const CertificateTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Mock templates data
  const mockTemplates = [
    {
      id: 1,
      name: 'Professional Certificate',
      description: 'Elegant design with gold accents for professional certifications',
      category: 'certification',
      courseType: 'all',
      thumbnail: '/templates/professional-cert.png',
      isActive: true,
      isDefault: true,
      colors: {
        primary: '#1e3a5f',
        secondary: '#d4af37',
        accent: '#2c5282',
        background: '#ffffff',
        text: '#1a1a1a'
      },
      layout: {
        orientation: 'landscape',
        size: 'A4',
        borderStyle: 'ornate',
        logoPosition: 'top-center',
        signaturePositions: ['bottom-left', 'bottom-right']
      },
      elements: [
        { type: 'logo', x: 50, y: 5, width: 15, height: 10 },
        { type: 'title', x: 50, y: 25, content: 'Certificate of Completion', fontSize: 32, fontWeight: 'bold' },
        { type: 'subtitle', x: 50, y: 35, content: 'This is to certify that', fontSize: 16 },
        { type: 'name', x: 50, y: 45, placeholder: '{{student_name}}', fontSize: 28, fontWeight: 'bold' },
        { type: 'text', x: 50, y: 55, content: 'has successfully completed', fontSize: 16 },
        { type: 'course', x: 50, y: 65, placeholder: '{{course_name}}', fontSize: 22, fontWeight: 'bold' },
        { type: 'date', x: 25, y: 80, placeholder: '{{completion_date}}', fontSize: 14 },
        { type: 'certificate_id', x: 75, y: 80, placeholder: '{{certificate_id}}', fontSize: 14 },
        { type: 'signature', x: 25, y: 90, placeholder: '{{signature_1}}' },
        { type: 'signature', x: 75, y: 90, placeholder: '{{signature_2}}' },
        { type: 'qr_code', x: 90, y: 85, placeholder: '{{verification_qr}}' }
      ],
      usageCount: 156,
      lastUsed: '2024-01-15',
      createdAt: '2023-06-10'
    },
    {
      id: 2,
      name: 'IATA Style Certificate',
      description: 'Official IATA-inspired design for aviation certifications',
      category: 'certification',
      courseType: 'iata',
      thumbnail: '/templates/iata-cert.png',
      isActive: true,
      isDefault: false,
      colors: {
        primary: '#004b87',
        secondary: '#e31937',
        accent: '#0077c8',
        background: '#ffffff',
        text: '#333333'
      },
      layout: {
        orientation: 'landscape',
        size: 'A4',
        borderStyle: 'modern',
        logoPosition: 'top-left',
        signaturePositions: ['bottom-center']
      },
      elements: [
        { type: 'logo', x: 15, y: 5, width: 20, height: 12 },
        { type: 'partner_logo', x: 85, y: 5, width: 12, height: 8 },
        { type: 'title', x: 50, y: 22, content: 'Certificate of Achievement', fontSize: 30, fontWeight: 'bold' },
        { type: 'name', x: 50, y: 40, placeholder: '{{student_name}}', fontSize: 26, fontWeight: 'bold' },
        { type: 'course', x: 50, y: 55, placeholder: '{{course_name}}', fontSize: 20 },
        { type: 'text', x: 50, y: 65, content: 'Accredited by IATA', fontSize: 14 },
        { type: 'date', x: 50, y: 75, placeholder: '{{completion_date}}', fontSize: 14 },
        { type: 'signature', x: 50, y: 88, placeholder: '{{signature_1}}' },
        { type: 'qr_code', x: 10, y: 85, placeholder: '{{verification_qr}}' }
      ],
      usageCount: 89,
      lastUsed: '2024-01-14',
      createdAt: '2023-07-22'
    },
    {
      id: 3,
      name: 'GDS Training Certificate',
      description: 'Modern design for Amadeus, Sabre, and Galileo courses',
      category: 'certification',
      courseType: 'gds',
      thumbnail: '/templates/gds-cert.png',
      isActive: true,
      isDefault: false,
      colors: {
        primary: '#2d3748',
        secondary: '#48bb78',
        accent: '#4299e1',
        background: '#f7fafc',
        text: '#1a202c'
      },
      layout: {
        orientation: 'landscape',
        size: 'A4',
        borderStyle: 'tech',
        logoPosition: 'top-center',
        signaturePositions: ['bottom-left', 'bottom-right']
      },
      usageCount: 67,
      lastUsed: '2024-01-13',
      createdAt: '2023-08-05'
    },
    {
      id: 4,
      name: 'Destination Specialist Badge',
      description: 'Badge-style certificate for destination specialist courses',
      category: 'badge',
      courseType: 'destination',
      thumbnail: '/templates/destination-badge.png',
      isActive: true,
      isDefault: false,
      colors: {
        primary: '#805ad5',
        secondary: '#f6ad55',
        accent: '#ed8936',
        background: '#ffffff',
        text: '#2d3748'
      },
      layout: {
        orientation: 'portrait',
        size: 'square',
        borderStyle: 'badge',
        logoPosition: 'center-top',
        signaturePositions: ['bottom-center']
      },
      usageCount: 45,
      lastUsed: '2024-01-12',
      createdAt: '2023-09-18'
    },
    {
      id: 5,
      name: 'Association Membership',
      description: 'Official membership certificate for TAFI, IATO, TAAI',
      category: 'membership',
      courseType: 'association',
      thumbnail: '/templates/membership-cert.png',
      isActive: true,
      isDefault: false,
      colors: {
        primary: '#744210',
        secondary: '#d69e2e',
        accent: '#b7791f',
        background: '#fffaf0',
        text: '#1a1a1a'
      },
      layout: {
        orientation: 'portrait',
        size: 'A4',
        borderStyle: 'classic',
        logoPosition: 'top-center',
        signaturePositions: ['bottom-left', 'bottom-right']
      },
      usageCount: 34,
      lastUsed: '2024-01-10',
      createdAt: '2023-10-02'
    },
    {
      id: 6,
      name: 'Course Completion (Simple)',
      description: 'Clean, minimalist design for course completions',
      category: 'completion',
      courseType: 'all',
      thumbnail: '/templates/simple-cert.png',
      isActive: false,
      isDefault: false,
      colors: {
        primary: '#3182ce',
        secondary: '#63b3ed',
        accent: '#4299e1',
        background: '#ffffff',
        text: '#2d3748'
      },
      layout: {
        orientation: 'landscape',
        size: 'A4',
        borderStyle: 'minimal',
        logoPosition: 'top-left',
        signaturePositions: ['bottom-center']
      },
      usageCount: 12,
      lastUsed: '2024-01-05',
      createdAt: '2023-11-15'
    }
  ];

  useEffect(() => {
    setTemplates(mockTemplates);
  }, []);

  const categories = [
    { value: 'certification', label: 'Certification', color: 'bg-blue-100 text-blue-800' },
    { value: 'badge', label: 'Badge', color: 'bg-purple-100 text-purple-800' },
    { value: 'membership', label: 'Membership', color: 'bg-amber-100 text-amber-800' },
    { value: 'completion', label: 'Completion', color: 'bg-green-100 text-green-800' }
  ];

  const courseTypes = [
    { value: 'all', label: 'All Courses' },
    { value: 'iata', label: 'IATA Courses' },
    { value: 'gds', label: 'GDS Training' },
    { value: 'destination', label: 'Destination' },
    { value: 'association', label: 'Association' }
  ];

  const handleToggleActive = (id) => {
    setTemplates(prev => prev.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const handleSetDefault = (id) => {
    setTemplates(prev => prev.map(t => ({
      ...t,
      isDefault: t.id === id
    })));
  };

  const handleDuplicate = (template) => {
    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      isDefault: false,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const getCategoryBadge = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.color}`}>{cat.label}</span> : null;
  };

  const activeTemplates = templates.filter(t => t.isActive).length;
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Certificate Templates</h1>
            <p className="mt-1 text-gray-600">Design and manage certificate templates</p>
          </div>
          <button
            onClick={() => {
              setEditingTemplate(null);
              setIsEditorOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Template
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
                <p className="text-sm text-gray-600">Total Templates</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{activeTemplates}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <SparklesIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{totalUsage}</p>
                <p className="text-sm text-gray-600">Certificates Issued</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <SwatchIcon className="h-8 w-8 text-amber-500" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all hover:shadow-md ${
                template.isDefault ? 'border-blue-500' : 'border-gray-200'
              } ${!template.isActive ? 'opacity-60' : ''}`}
            >
              {/* Template Preview */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                {/* Simulated Certificate Preview */}
                <div
                  className="w-[90%] h-[85%] rounded shadow-lg flex flex-col items-center justify-center p-4"
                  style={{
                    backgroundColor: template.colors.background,
                    border: `2px solid ${template.colors.primary}`
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full mb-2"
                    style={{ backgroundColor: template.colors.primary }}
                  />
                  <div
                    className="h-2 w-24 rounded mb-1"
                    style={{ backgroundColor: template.colors.primary }}
                  />
                  <div
                    className="h-1.5 w-16 rounded mb-3"
                    style={{ backgroundColor: template.colors.secondary }}
                  />
                  <div
                    className="h-1 w-20 rounded"
                    style={{ backgroundColor: template.colors.accent, opacity: 0.5 }}
                  />
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {template.isDefault && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      Default
                    </span>
                  )}
                  {!template.isActive && (
                    <span className="px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setIsPreviewOpen(true);
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Preview"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setIsEditorOpen(true);
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Duplicate"
                  >
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{template.description}</p>
                  </div>
                  {getCategoryBadge(template.category)}
                </div>

                {/* Color Palette Preview */}
                <div className="flex gap-1 my-3">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: template.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: template.colors.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: template.colors.accent }}
                    title="Accent"
                  />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Used {template.usageCount} times</span>
                  <span>{template.layout?.orientation || 'landscape'} • {template.layout?.size || 'A4'}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={template.isActive}
                          onChange={() => handleToggleActive(template.id)}
                          className="sr-only"
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${template.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform mt-1 ${template.isActive ? 'translate-x-5 ml-0.5' : 'translate-x-1'}`} />
                        </div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Active</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    {!template.isDefault && template.isActive && (
                      <button
                        onClick={() => handleSetDefault(template.id)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Template Card */}
          <button
            onClick={() => {
              setEditingTemplate(null);
              setIsEditorOpen(true);
            }}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors min-h-[350px]"
          >
            <PlusIcon className="h-12 w-12 mb-4" />
            <span className="font-medium">Create New Template</span>
            <span className="text-sm mt-1">Design from scratch or use a preset</span>
          </button>
        </div>

        {/* Template Editor Modal */}
        {isEditorOpen && (
          <TemplateEditorModal
            template={editingTemplate}
            categories={categories}
            courseTypes={courseTypes}
            onClose={() => {
              setIsEditorOpen(false);
              setEditingTemplate(null);
            }}
            onSave={(template) => {
              if (editingTemplate) {
                setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
              } else {
                setTemplates(prev => [...prev, { ...template, id: Date.now() }]);
              }
              setIsEditorOpen(false);
              setEditingTemplate(null);
            }}
          />
        )}

        {/* Preview Modal */}
        {isPreviewOpen && selectedTemplate && (
          <TemplatePreviewModal
            template={selectedTemplate}
            onClose={() => {
              setIsPreviewOpen(false);
              setSelectedTemplate(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Template Editor Modal
const TemplateEditorModal = ({ template, categories, courseTypes, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(template || {
    name: '',
    description: '',
    category: 'certification',
    courseType: 'all',
    isActive: true,
    isDefault: false,
    colors: {
      primary: '#1e3a5f',
      secondary: '#d4af37',
      accent: '#2c5282',
      background: '#ffffff',
      text: '#1a1a1a'
    },
    layout: {
      orientation: 'landscape',
      size: 'A4',
      borderStyle: 'modern'
    },
    usageCount: 0,
    createdAt: new Date().toISOString().split('T')[0]
  });

  const colorPresets = [
    { name: 'Professional Blue', colors: { primary: '#1e3a5f', secondary: '#d4af37', accent: '#2c5282', background: '#ffffff', text: '#1a1a1a' } },
    { name: 'IATA Official', colors: { primary: '#004b87', secondary: '#e31937', accent: '#0077c8', background: '#ffffff', text: '#333333' } },
    { name: 'Modern Green', colors: { primary: '#047857', secondary: '#34d399', accent: '#10b981', background: '#f0fdf4', text: '#1a1a1a' } },
    { name: 'Elegant Gold', colors: { primary: '#744210', secondary: '#d69e2e', accent: '#b7791f', background: '#fffaf0', text: '#1a1a1a' } },
    { name: 'Tech Purple', colors: { primary: '#5b21b6', secondary: '#8b5cf6', accent: '#a78bfa', background: '#faf5ff', text: '#1a1a1a' } }
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: Cog6ToothIcon },
    { id: 'colors', label: 'Colors', icon: SwatchIcon },
    { id: 'layout', label: 'Layout', icon: DocumentTextIcon },
    { id: 'elements', label: 'Elements', icon: PhotoIcon }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {template ? 'Edit Template' : 'Create New Template'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Tabs */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left text-sm ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Professional Certificate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of this template..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Type
                    </label>
                    <select
                      value={formData.courseType}
                      onChange={(e) => setFormData(prev => ({ ...prev, courseType: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      {courseTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-6">
                {/* Color Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {colorPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setFormData(prev => ({ ...prev, colors: preset.colors }))}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-400 text-left"
                      >
                        <div className="flex gap-1 mr-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.primary }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.secondary }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.accent }} />
                        </div>
                        <span className="text-sm text-gray-700">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Individual Colors */}
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(formData.colors).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace('_', ' ')}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, [key]: e.target.value }
                          }))}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, [key]: e.target.value }
                          }))}
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orientation
                    </label>
                    <div className="flex gap-3">
                      {['landscape', 'portrait'].map((orientation) => (
                        <button
                          key={orientation}
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            layout: { ...prev.layout, orientation }
                          }))}
                          className={`flex-1 py-3 px-4 border-2 rounded-lg text-center capitalize ${
                            formData.layout?.orientation === orientation
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {orientation}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <select
                      value={formData.layout?.size || 'A4'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        layout: { ...prev.layout, size: e.target.value }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="A4">A4 (210 × 297 mm)</option>
                      <option value="Letter">Letter (8.5 × 11 in)</option>
                      <option value="Legal">Legal (8.5 × 14 in)</option>
                      <option value="square">Square (200 × 200 mm)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Border Style
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {['none', 'minimal', 'modern', 'ornate', 'classic'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          layout: { ...prev.layout, borderStyle: style }
                        }))}
                        className={`py-2 px-3 border-2 rounded-lg text-center capitalize text-sm ${
                          formData.layout?.borderStyle === style
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'elements' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Configure the elements that will appear on your certificate. Use placeholders for dynamic content.
                </p>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Available Placeholders</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <code className="bg-gray-200 px-2 py-1 rounded">{'{{student_name}}'}</code>
                    <code className="bg-gray-200 px-2 py-1 rounded">{'{{course_name}}'}</code>
                    <code className="bg-gray-200 px-2 py-1 rounded">{'{{completion_date}}'}</code>
                    <code className="bg-gray-200 px-2 py-1 rounded">{'{{certificate_id}}'}</code>
                    <code className="bg-gray-200 px-2 py-1 rounded">{'{{issuer_name}}'}</code>
                    <code className="bg-gray-200 px-2 py-1 rounded">{'{{verification_qr}}'}</code>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-center text-gray-500 py-8">
                    Visual element editor coming soon...
                    <br />
                    <span className="text-sm">Drag and drop elements to design your certificate</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {template ? 'Save Changes' : 'Create Template'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Template Preview Modal
const TemplatePreviewModal = ({ template, onClose }) => {
  const sampleData = {
    student_name: 'John Doe',
    course_name: 'IATA Foundation in Travel and Tourism',
    completion_date: 'January 15, 2024',
    certificate_id: 'CERT-2024-001234',
    issuer_name: 'Travel Academy'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Preview: {template.name}</h2>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
              Download Sample
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-8 bg-gray-100 overflow-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {/* Certificate Preview */}
          <div
            className={`mx-auto shadow-2xl ${
              template.layout?.orientation === 'portrait' ? 'max-w-md' : 'max-w-3xl'
            }`}
            style={{
              aspectRatio: template.layout?.orientation === 'portrait' ? '1/1.414' : '1.414/1',
              backgroundColor: template.colors.background,
              border: `3px solid ${template.colors.primary}`
            }}
          >
            <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center relative">
              {/* Decorative Border */}
              <div
                className="absolute inset-4 border-2 pointer-events-none"
                style={{ borderColor: template.colors.secondary }}
              />

              {/* Logo Placeholder */}
              <div
                className="w-20 h-20 rounded-full mb-6 flex items-center justify-center"
                style={{ backgroundColor: template.colors.primary }}
              >
                <span className="text-white text-2xl font-bold">TA</span>
              </div>

              {/* Certificate Title */}
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: template.colors.primary }}
              >
                Certificate of Completion
              </h1>

              <p className="text-gray-600 mb-6">This is to certify that</p>

              {/* Student Name */}
              <h2
                className="text-4xl font-bold mb-4"
                style={{ color: template.colors.text }}
              >
                {sampleData.student_name}
              </h2>

              <p className="text-gray-600 mb-4">has successfully completed the course</p>

              {/* Course Name */}
              <h3
                className="text-2xl font-semibold mb-8"
                style={{ color: template.colors.accent }}
              >
                {sampleData.course_name}
              </h3>

              {/* Date & ID */}
              <div className="flex justify-between w-full max-w-md mt-auto pt-8">
                <div className="text-left">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{sampleData.completion_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Certificate ID</p>
                  <p className="font-medium">{sampleData.certificate_id}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between w-full max-w-md mt-6">
                <div className="text-center">
                  <div className="w-32 border-b-2 border-gray-400 mb-1" />
                  <p className="text-sm text-gray-600">Director</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b-2 border-gray-400 mb-1" />
                  <p className="text-sm text-gray-600">Instructor</p>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="absolute bottom-6 right-6 w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">QR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplates;

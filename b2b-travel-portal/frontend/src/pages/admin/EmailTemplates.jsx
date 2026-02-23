import React, { useState } from 'react';
import { Mail, Edit, Eye, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Booking Confirmation', key: 'booking_confirmation', active: true },
    { id: 2, name: 'Booking Cancellation', key: 'booking_cancellation', active: true },
    { id: 3, name: 'Welcome Email', key: 'welcome_email', active: true },
    { id: 4, name: 'Password Reset', key: 'password_reset', active: true },
    { id: 5, name: 'Agent Approval', key: 'agent_approval', active: true },
    { id: 6, name: 'Agent Rejection', key: 'agent_rejection', active: true },
    { id: 7, name: 'Wallet Credit', key: 'wallet_credit', active: true },
    { id: 8, name: 'Ticket Issued', key: 'ticket_issued', active: true },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editContent, setEditContent] = useState({
    subject: '',
    body: '',
  });

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setEditContent({
      subject: `{{companyName}} - ${template.name}`,
      body: `Dear {{customerName}},\n\nThank you for your booking with {{companyName}}.\n\n{{bookingDetails}}\n\nBest regards,\n{{companyName}} Team`,
    });
  };

  const handleSave = () => {
    toast.success('Template saved successfully');
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <p className="text-gray-500">Customize email templates for various notifications</p>
      </div>

      {/* Variables Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Available Variables</h3>
        <div className="flex flex-wrap gap-2">
          {['{{customerName}}', '{{companyName}}', '{{bookingDetails}}', '{{pnr}}', '{{amount}}', '{{date}}'].map((variable) => (
            <code key={variable} className="px-2 py-1 bg-white rounded text-sm text-blue-700">
              {variable}
            </code>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="divide-y">
          {templates.map((template) => (
            <div key={template.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-500">Key: {template.key}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  template.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {template.active ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleEdit(template)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              Edit Template: {selectedTemplate.name}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={editContent.subject}
                  onChange={(e) => setEditContent({ ...editContent, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea
                  value={editContent.body}
                  onChange={(e) => setEditContent({ ...editContent, body: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  rows={12}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {}}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplates;

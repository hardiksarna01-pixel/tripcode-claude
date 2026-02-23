import React, { useState, useEffect } from 'react';

/**
 * Agent Signup Approvals Component
 * View pending signups, verify KYC, approve/reject
 */
const AgentSignupApprovals = () => {
  const [signupRequests, setSignupRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [groups, setGroups] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);

  const [approvalData, setApprovalData] = useState({
    groupId: '',
    schemeId: '',
    creditLimit: 0
  });

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchSignupRequests();
    fetchGroups();
    fetchSchemes();
  }, [filter]);

  const fetchSignupRequests = async () => {
    setLoading(true);
    // API call
    // const response = await adminApi.getSignupRequests({ status: filter });
    
    // Mock data
    setTimeout(() => {
      setSignupRequests([
        {
          id: 1,
          companyName: 'Travel Express Pvt Ltd',
          contactPerson: 'Rajesh Kumar',
          email: 'rajesh@travelexpress.com',
          mobile: '9876543210',
          city: 'Mumbai',
          state: 'Maharashtra',
          panNumber: 'ABCDE1234F',
          panDocumentUrl: '/docs/pan.jpg',
          gstNumber: '27ABCDE1234F1Z5',
          status: 'PENDING',
          createdAt: '2025-12-20T10:30:00'
        },
        {
          id: 2,
          companyName: 'Sky Tours',
          contactPerson: 'Priya Sharma',
          email: 'priya@skytours.in',
          mobile: '9898989898',
          city: 'Delhi',
          state: 'Delhi',
          panNumber: 'FGHIJ5678K',
          panDocumentUrl: '/docs/pan2.jpg',
          gstNumber: '07FGHIJ5678K1Z3',
          status: 'PENDING',
          createdAt: '2025-12-19T14:20:00'
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const fetchGroups = async () => {
    setGroups([
      { id: 1, groupName: 'Standard Agents', groupCode: 'STD' },
      { id: 2, groupName: 'Premium Agents', groupCode: 'PRM' },
      { id: 3, groupName: 'Enterprise', groupCode: 'ENT' }
    ]);
  };

  const fetchSchemes = async () => {
    setSchemes([
      { id: 1, schemeName: 'Standard', schemeCode: 'STD' },
      { id: 2, schemeName: 'Premium', schemeCode: 'PRM' },
      { id: 3, schemeName: 'Enterprise', schemeCode: 'ENT' }
    ]);
  };

  const handleApprove = async () => {
    if (!approvalData.groupId || !approvalData.schemeId) {
      alert('Please select Group and Scheme');
      return;
    }

    try {
      // await adminApi.approveSignup(selectedRequest.id, approvalData);
      alert(`Agent approved! Credentials will be sent to ${selectedRequest.email} and ${selectedRequest.mobile}`);
      fetchSignupRequests();
      setSelectedRequest(null);
    } catch (error) {
      alert('Error approving agent: ' + error.message);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      // await adminApi.rejectSignup(selectedRequest.id, { reason: rejectReason });
      alert('Signup request rejected');
      setShowRejectModal(false);
      setRejectReason('');
      fetchSignupRequests();
      setSelectedRequest(null);
    } catch (error) {
      alert('Error rejecting request: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agent Signup Approvals</h1>
        
        {/* Filter Tabs */}
        <div className="flex gap-2">
          {['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Request List */}
        <div className="col-span-5">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Signup Requests ({signupRequests.length})</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : signupRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No requests found</div>
            ) : (
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {signupRequests.map(request => (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedRequest?.id === request.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{request.companyName}</div>
                        <div className="text-sm text-gray-500">{request.contactPerson}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                        <div className="text-sm text-gray-500">{request.mobile}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${
                          request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(request.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Request Details */}
        <div className="col-span-7">
          {selectedRequest ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Request Details</h2>
                <span className={`px-3 py-1 rounded text-sm ${
                  selectedRequest.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  selectedRequest.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                  selectedRequest.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedRequest.status}
                </span>
              </div>

              <div className="p-6">
                {/* Company Info */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Company Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-gray-500">Company Name</label>
                      <div className="font-medium">{selectedRequest.companyName}</div>
                    </div>
                    <div>
                      <label className="text-gray-500">Contact Person</label>
                      <div className="font-medium">{selectedRequest.contactPerson}</div>
                    </div>
                    <div>
                      <label className="text-gray-500">Email</label>
                      <div className="font-medium">{selectedRequest.email}</div>
                    </div>
                    <div>
                      <label className="text-gray-500">Mobile</label>
                      <div className="font-medium">{selectedRequest.mobile}</div>
                    </div>
                    <div>
                      <label className="text-gray-500">City</label>
                      <div className="font-medium">{selectedRequest.city}</div>
                    </div>
                    <div>
                      <label className="text-gray-500">State</label>
                      <div className="font-medium">{selectedRequest.state}</div>
                    </div>
                  </div>
                </div>

                {/* KYC Documents */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">KYC Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <label className="text-gray-500 text-sm">PAN Number</label>
                          <div className="font-medium">{selectedRequest.panNumber || 'Not provided'}</div>
                        </div>
                        {selectedRequest.panDocumentUrl && (
                          <a
                            href={selectedRequest.panDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                          >
                            View Document
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <label className="text-gray-500 text-sm">GST Number</label>
                          <div className="font-medium">{selectedRequest.gstNumber || 'Not provided'}</div>
                        </div>
                        {selectedRequest.gstDocumentUrl && (
                          <a
                            href={selectedRequest.gstDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                          >
                            View Document
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approval Section - Only show for pending requests */}
                {(selectedRequest.status === 'PENDING' || selectedRequest.status === 'UNDER_REVIEW') && (
                  <div className="border-t pt-6">
                    <h3 className="font-medium text-gray-700 mb-3">Approval Settings</h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Assign to Group *</label>
                        <select
                          value={approvalData.groupId}
                          onChange={(e) => setApprovalData(prev => ({ ...prev, groupId: e.target.value }))}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">Select Group</option>
                          {groups.map(group => (
                            <option key={group.id} value={group.id}>
                              {group.groupName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Assign Scheme *</label>
                        <select
                          value={approvalData.schemeId}
                          onChange={(e) => setApprovalData(prev => ({ ...prev, schemeId: e.target.value }))}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">Select Scheme</option>
                          {schemes.map(scheme => (
                            <option key={scheme.id} value={scheme.id}>
                              {scheme.schemeName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Initial Credit Limit (₹)</label>
                        <input
                          type="number"
                          value={approvalData.creditLimit}
                          onChange={(e) => setApprovalData(prev => ({ ...prev, creditLimit: e.target.value }))}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleApprove}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
                      >
                        ✓ Approve & Send Credentials
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700"
                      >
                        ✕ Reject
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      On approval, login credentials will be sent via Email and WhatsApp
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Select a request to view details
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Reject Signup Request</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please provide a reason for rejection. This will be communicated to the applicant.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSignupApprovals;

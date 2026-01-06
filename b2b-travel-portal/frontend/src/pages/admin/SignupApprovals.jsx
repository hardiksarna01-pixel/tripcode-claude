import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const SignupApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalData, setApprovalData] = useState({
    groupId: '',
    creditLimit: 0,
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await adminAPI.getSignupRequests();
      setRequests(response.data.requests || []);
    } catch (error) {
      toast.error('Failed to load signup requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveSignup(id, approvalData);
      toast.success('Agent approved successfully');
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await adminAPI.rejectSignup(id, reason);
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Signup Approvals</h1>
        <p className="text-gray-500">Review and approve new agent registrations</p>
      </div>

      {/* Pending Count */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
        <Clock className="text-yellow-600" />
        <span className="text-yellow-800">
          {requests.filter(r => r.status === 'PENDING').length} pending approval requests
        </span>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl shadow-sm">
        {requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No pending signup requests
          </div>
        ) : (
          <div className="divide-y">
            {requests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{request.companyName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Contact Person</p>
                        <p className="font-medium">{request.contactName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{request.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{request.phone}</p>
                      </div>
                    </div>
                    {request.address && (
                      <div className="mt-2 text-sm">
                        <p className="text-gray-500">Address</p>
                        <p>{request.address}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Submitted: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {request.status === 'PENDING' && (
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Approve Agent</h2>
            <p className="text-gray-500 mb-4">
              Approving: <strong>{selectedRequest.companyName}</strong>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Group
                </label>
                <select
                  value={approvalData.groupId}
                  onChange={(e) => setApprovalData({ ...approvalData, groupId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Group</option>
                  <option value="1">Default</option>
                  <option value="2">Premium</option>
                  <option value="3">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Credit Limit
                </label>
                <input
                  type="number"
                  value={approvalData.creditLimit}
                  onChange={(e) => setApprovalData({ ...approvalData, creditLimit: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupApprovals;

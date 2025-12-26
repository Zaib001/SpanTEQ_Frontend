import { useState } from 'react';
import { Calendar, Check, X, Clock, User } from 'lucide-react';

const ptoRequests = [
  {
    id: 1,
    user: 'Michael Chen',
    role: 'Consultant',
    startDate: '2025-12-20',
    endDate: '2025-12-24',
    days: 5,
    reason: 'Holiday vacation',
    status: 'Pending',
    submittedDate: '2025-12-01'
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    role: 'Recruiter',
    startDate: '2025-12-15',
    endDate: '2025-12-17',
    days: 3,
    reason: 'Personal matters',
    status: 'Pending',
    submittedDate: '2025-12-05'
  },
  {
    id: 3,
    user: 'Emily Davis',
    role: 'Admin',
    startDate: '2025-12-10',
    endDate: '2025-12-12',
    days: 3,
    reason: 'Medical appointment',
    status: 'Approved',
    submittedDate: '2025-11-28'
  },
  {
    id: 4,
    user: 'James Wilson',
    role: 'Consultant',
    startDate: '2025-12-25',
    endDate: '2025-12-31',
    days: 7,
    reason: 'Year-end holiday',
    status: 'Pending',
    submittedDate: '2025-12-03'
  },
  {
    id: 5,
    user: 'Lisa Anderson',
    role: 'Recruiter',
    startDate: '2025-11-28',
    endDate: '2025-11-29',
    days: 2,
    reason: 'Family event',
    status: 'Rejected',
    submittedDate: '2025-11-20'
  },
];

export function PTOPage() {
  const [requests, setRequests] = useState(ptoRequests);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    setSelectedRequest(null);
  };

  const handleReject = (id: number) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    setSelectedRequest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">PTO Requests</h1>
        <p className="text-gray-600">Review and manage time-off requests from your team</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl mt-1">{requests.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl mt-1">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl mt-1">{approvedCount}</p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl mt-1">{rejectedCount}</p>
            </div>
            <X className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Employee</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Period</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Days</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Reason</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Submitted</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600">Status</th>
                <th className="px-6 py-4 text-right text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                        {request.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div>{request.user}</div>
                        <div className="text-xs text-gray-500">{request.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>{request.startDate}</div>
                      <div className="text-gray-500">to {request.endDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {request.days} {request.days === 1 ? 'day' : 'days'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{request.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{request.submittedDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {request.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="text-right text-sm text-gray-400">No action needed</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

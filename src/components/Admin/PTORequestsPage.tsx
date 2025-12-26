import { useState } from 'react';
import { Calendar, Check, X as XIcon, User, Clock, Sparkles, ChevronDown, MessageSquare } from 'lucide-react';

interface PTORequest {
  id: string;
  user: string;
  role: 'recruiter' | 'candidate';
  type: 'vacation' | 'sick' | 'personal';
  startDate: string;
  endDate: string;
  totalDays: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

const mockPTORequests: PTORequest[] = [
  { id: '1', user: 'Sarah Johnson', role: 'recruiter', type: 'vacation', startDate: '2024-04-15', endDate: '2024-04-20', totalDays: 6, status: 'pending', reason: 'Family vacation' },
  { id: '2', user: 'Michael Chen', role: 'recruiter', type: 'sick', startDate: '2024-04-10', endDate: '2024-04-12', totalDays: 3, status: 'approved' },
  { id: '3', user: 'Emily Davis', role: 'candidate', type: 'personal', startDate: '2024-04-18', endDate: '2024-04-19', totalDays: 2, status: 'pending', reason: 'Personal matter' },
  { id: '4', user: 'James Wilson', role: 'candidate', type: 'vacation', startDate: '2024-04-05', endDate: '2024-04-07', totalDays: 3, status: 'rejected', reason: 'Weekend trip' },
  { id: '5', user: 'Lisa Anderson', role: 'recruiter', type: 'vacation', startDate: '2024-05-01', endDate: '2024-05-10', totalDays: 10, status: 'approved', reason: 'Annual leave' },
];

const typeColors = {
  vacation: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  sick: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  personal: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
};

const statusColors = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  approved: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

export function PTORequestsPage() {
  const [requests, setRequests] = useState<PTORequest[]>(mockPTORequests);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PTORequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const handleAction = (request: PTORequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setShowApproveModal(true);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        
        <div className="relative flex items-center justify-between animate-slide-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl shadow-glow-green animate-pulse-glow">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-5xl text-gradient-premium">PTO Requests</h1>
              <p className="text-slate-400 mt-1 text-sm">Approve or reject time-off requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Requests', value: stats.total, gradient: 'from-purple-500 to-pink-500', icon: Calendar },
          { label: 'Pending', value: stats.pending, gradient: 'from-yellow-500 to-orange-500', icon: Clock },
          { label: 'Approved', value: stats.approved, gradient: 'from-green-500 to-emerald-500', icon: Check },
          { label: 'Rejected', value: stats.rejected, gradient: 'from-red-500 to-rose-500', icon: XIcon },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                  <p className="text-4xl premium-text mb-1">{stat.value}</p>
                </div>
                <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PTO Requests Table */}
      <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in" style={{ animationDelay: '200ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark border-b border-white/10">
              <tr>
                <th className="px-8 py-5 text-left">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">User</span>
                </th>
                <th className="px-8 py-5 text-left">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Role</span>
                </th>
                <th className="px-8 py-5 text-left">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Type</span>
                </th>
                <th className="px-8 py-5 text-left">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Start Date</span>
                </th>
                <th className="px-8 py-5 text-left">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">End Date</span>
                </th>
                <th className="px-8 py-5 text-left">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Days</span>
                </th>
                <th className="px-8 py-5 text-left">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</span>
                </th>
                <th className="px-8 py-5 text-right">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((request, index) => (
                <tr 
                  key={request.id}
                  className="group hover:bg-gradient-to-r hover:from-green-500/5 hover:via-emerald-500/5 hover:to-green-500/5 transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-glow-green">
                        {request.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-slate-200 font-medium">{request.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${
                      request.role === 'recruiter' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                    }`}>
                      {request.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${typeColors[request.type].bg} ${typeColors[request.type].text} border ${typeColors[request.type].border}`}>
                      {request.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-400 text-sm">
                    {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-400 text-sm">
                    {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-slate-200 font-semibold">{request.totalDays} days</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${statusColors[request.status].bg} ${statusColors[request.status].text} border ${statusColors[request.status].border}`}>
                      <div className={`w-2 h-2 rounded-full ${request.status === 'approved' ? 'bg-green-400 animate-pulse-glow' : statusColors[request.status].text.replace('text-', 'bg-')}`} />
                      {request.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    {request.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAction(request, 'approve')}
                          className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/30 hover:shadow-glow-green transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction(request, 'reject')}
                          className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                        >
                          <XIcon className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                    {request.status !== 'pending' && (
                      <span className="text-slate-500 text-sm">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve/Reject Modal */}
      {showApproveModal && selectedRequest && (
        <PTOActionModal
          request={selectedRequest}
          actionType={actionType}
          onClose={() => {
            setShowApproveModal(false);
            setSelectedRequest(null);
          }}
          onConfirm={(comment) => {
            setRequests(requests.map(r => 
              r.id === selectedRequest.id 
                ? { ...r, status: actionType === 'approve' ? 'approved' : 'rejected' }
                : r
            ));
            setShowApproveModal(false);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
}

function PTOActionModal({ 
  request, 
  actionType, 
  onClose, 
  onConfirm 
}: { 
  request: PTORequest; 
  actionType: 'approve' | 'reject'; 
  onClose: () => void; 
  onConfirm: (comment: string) => void;
}) {
  const [comment, setComment] = useState('');

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-6 animate-slide-in">
      <div className="relative glass rounded-3xl p-10 max-w-lg w-full shadow-premium border-2 border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-4 bg-gradient-to-br ${actionType === 'approve' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'} rounded-2xl ${actionType === 'approve' ? 'shadow-glow-green' : ''}`}>
              {actionType === 'approve' ? <Check className="w-6 h-6 text-white" /> : <XIcon className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-3xl text-gradient-premium">{actionType === 'approve' ? 'Approve' : 'Reject'} PTO Request</h2>
              <p className="text-sm text-slate-400 mt-1">Confirm your decision</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 glass hover:bg-red-500/20 rounded-xl transition-all duration-300 group">
            <XIcon className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-slate-200 font-medium mb-4">Request Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">User:</span>
                <span className="text-slate-200 font-medium">{request.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Type:</span>
                <span className="text-slate-200 font-medium capitalize">{request.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Duration:</span>
                <span className="text-slate-200 font-medium">{request.totalDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Dates:</span>
                <span className="text-slate-200 font-medium">
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                </span>
              </div>
              {request.reason && (
                <div className="pt-3 border-t border-white/10">
                  <span className="text-slate-400 text-sm block mb-2">Reason:</span>
                  <span className="text-slate-200">{request.reason}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Admin Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10 resize-none"
              placeholder="Add a comment..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(comment)}
              className={`flex-1 relative px-6 py-4 bg-gradient-to-r ${actionType === 'approve' ? 'from-green-500 to-emerald-500 shadow-glow-green' : 'from-red-500 to-rose-500'} rounded-xl overflow-hidden shadow-premium transition-all duration-500 group`}
            >
              <span className="relative z-10 text-white font-semibold">{actionType === 'approve' ? 'Approve Request' : 'Reject Request'}</span>
            </button>
          </div>

          {actionType === 'approve' && (
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-slate-400">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Approved PTO will be counted in the monthly salary calculations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

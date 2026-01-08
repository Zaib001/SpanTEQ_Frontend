import { useState, useEffect, useCallback } from 'react';
import {
    Calendar, CheckCircle, XCircle, ChevronDown, Clock,
    Search, Filter, User, Briefcase, Sparkles, TrendingUp, X, Clock3
} from 'lucide-react';
import RecruiterService from '../../services/recruiter.service';
import type { PTORequest } from '../../services/pto.service';

const statusColors: Record<string, { bg: string, text: string, border: string }> = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    approved: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

export function RecruiterPTO() {
    const [requests, setRequests] = useState<PTORequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<PTORequest | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [actionComment, setActionComment] = useState('');

    const fetchPTO = useCallback(async () => {
        try {
            setLoading(true);
            const data = await RecruiterService.getPTORequests();
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPTO();
    }, [fetchPTO]);

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await RecruiterService.updatePTOStatus(id, status);
            setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
            setShowOrderModal(false);
            setSelectedRequest(null);
            setActionComment('');
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const filteredRequests = requests.filter(r => {
        const matchesSearch = (r.requestedBy?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    };

    if (loading && requests.length === 0) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-slate-400 animate-pulse">Loading PTO requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {}
            <div className="relative">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                <div className="relative flex items-center justify-between mb-8 animate-slide-in">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-glow-purple animate-pulse-glow">
                            <Calendar className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl text-gradient-premium">PTO Requests</h1>
                            <p className="text-slate-400 mt-1 text-sm">Review and manage candidate time-off applications</p>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
                {[
                    { label: 'Total Requests', value: stats.total, gradient: 'from-purple-500 to-indigo-500', icon: Calendar },
                    { label: 'Pending Review', value: stats.pending, gradient: 'from-yellow-500 to-orange-500', icon: Clock3 },
                    { label: 'Approved', value: stats.approved, gradient: 'from-green-500 to-emerald-500', icon: CheckCircle },
                    { label: 'Rejected', value: stats.rejected, gradient: 'from-red-500 to-rose-500', icon: XCircle },
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

            {}
            <div className="glass rounded-3xl p-6 space-y-4 animate-slide-in shadow-premium" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-all duration-300" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by candidate name..."
                            className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10"
                        />
                    </div>
                    <div className="relative h-full">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 text-slate-300 px-6 py-4 rounded-2xl pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:bg-white/10 transition-all cursor-pointer h-full"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {}
            <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in" style={{ animationDelay: '300ms' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="glass-dark border-b border-white/10">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Candidate</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Type</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Duration</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Days</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</th>
                                <th className="px-8 py-5 text-right text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRequests.map((req, index) => {
                                const days = Math.ceil((new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                                return (
                                    <tr key={req._id} className="hover:bg-white/5 transition-colors group animate-slide-in" style={{ animationDelay: `${index * 20}ms` }}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-glow-purple">
                                                    {(req.requestedBy?.name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-slate-200 font-bold">{req.requestedBy?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500">Candidate</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 text-xs font-bold capitalize border border-white/10">
                                                {req.type === 'sick' ? '🤒' : '🌴'} {req.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-slate-200 text-sm font-medium">
                                                    {new Date(req.startDate).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] text-slate-500 uppercase font-black">to {new Date(req.endDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-1.5 text-slate-100 font-bold bg-white/5 w-fit px-3 py-1 rounded-lg border border-white/5">
                                                <Clock className="w-4 h-4 text-purple-400" />
                                                {days} Days
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[req.status]?.bg} ${statusColors[req.status]?.text} ${statusColors[req.status]?.border}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'approved' ? 'bg-green-400 animate-pulse' : req.status === 'rejected' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            {req.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => { setSelectedRequest(req); setShowOrderModal(true); }}
                                                        className="p-3 bg-white/5 text-slate-300 rounded-xl hover:bg-purple-500/20 hover:text-purple-400 transition-all border border-white/5"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleAction(req._id, 'approved')} className="p-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-all border border-green-500/10">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleAction(req._id, 'rejected')} className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all border border-red-500/10">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-2">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Processed
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {}
            {!loading && filteredRequests.length === 0 && (
                <div className="glass rounded-3xl p-20 text-center animate-slide-in">
                    <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-300">No PTO Requests Found</h3>
                    <p className="text-slate-500 mt-2">No data matches your current filters.</p>
                </div>
            )}

            {}
            {showOrderModal && selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-dark max-w-xl w-full rounded-[40px] p-10 border border-white/20 shadow-2xl relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-10 -mr-20 -mt-20" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gradient-premium">Process Request</h2>
                            <button onClick={() => setShowOrderModal(false)} className="p-3 glass rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 glass rounded-3xl border border-white/10">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-glow-purple">
                                    {(selectedRequest.requestedBy?.name || 'U').charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">{selectedRequest.requestedBy?.name}</h3>
                                    <p className="text-slate-400 text-sm">Requested on {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass rounded-3xl p-4 border border-white/5">
                                    <p className="text-[10px] text-slate-500 mb-1 uppercase font-black">Leave Type</p>
                                    <p className="text-slate-100 font-bold capitalize">{selectedRequest.type}</p>
                                </div>
                                <div className="glass rounded-3xl p-4 border border-white/5">
                                    <p className="text-[10px] text-slate-500 mb-1 uppercase font-black">Total Duration</p>
                                    <p className="text-slate-100 font-bold font-mono">
                                        {Math.ceil((new Date(selectedRequest.endDate).getTime() - new Date(selectedRequest.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} Days
                                    </p>
                                </div>
                            </div>

                            <div className="glass rounded-3xl p-4 border border-white/5">
                                <p className="text-[10px] text-slate-500 mb-2 uppercase font-black tracking-widest">Reason / Description</p>
                                <p className="text-slate-300 text-sm leading-relaxed italic">
                                    "{selectedRequest.reason || 'No reason provided for this request.'}"
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Confirmation Notes (Optional)</label>
                                <textarea
                                    value={actionComment}
                                    onChange={(e) => setActionComment(e.target.value)}
                                    placeholder="Add a comment for the candidate..."
                                    className="w-full h-24 bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => handleAction(selectedRequest._id, 'rejected')}
                                    className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-3xl font-black tracking-widest transition-all border border-red-500/20"
                                >
                                    REJECT
                                </button>
                                <button
                                    onClick={() => handleAction(selectedRequest._id, 'approved')}
                                    className="flex-2 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl font-black tracking-widest shadow-glow-purple hover:scale-[1.02] transition-all"
                                >
                                    APPROVE REQUEST
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

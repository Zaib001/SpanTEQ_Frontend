import { useState, useEffect } from 'react';
import { FileUp, Filter, Plus, Download, Eye, X, Loader2, AlertCircle } from 'lucide-react';
import DocumentService, { type DocumentRequest } from '../../services/document.service';
import UserService, { type User } from '../../services/user.service';

export function DocumentRequests() {
    const [requests, setRequests] = useState<DocumentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [candidates, setCandidates] = useState<User[]>([]);
    const [loadingCandidates, setLoadingCandidates] = useState(false);

    const [filters, setFilters] = useState({
        candidate: '',
        requestedBy: '',
        documentType: '',
        status: '',
    });
    const [formData, setFormData] = useState({
        requestedFrom: '',
        type: 'OTHER',
        notes: '',
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await DocumentService.getDocumentRequests();
            setRequests(data);
        } catch (err: any) {
            console.error('Error fetching document requests:', err);
            setError('Failed to load document requests.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = async () => {
        setShowModal(true);
        if (candidates.length === 0) {
            try {
                setLoadingCandidates(true);
                const response = await UserService.getAllUsers({ role: 'candidate', limit: 1000 });
                setCandidates(response.users);
            } catch (err) {
                console.error('Error fetching candidates:', err);
            } finally {
                setLoadingCandidates(false);
            }
        }
    };

    const handleCreateRequest = async () => {
        if (!formData.requestedFrom || !formData.type) return;
        try {
            setLoading(true);
            await DocumentService.createDocumentRequest(formData);
            await fetchRequests();
            setShowModal(false);
            setFormData({ requestedFrom: '', type: 'OTHER', notes: '' });
        } catch (err: any) {
            console.error('Error creating request:', err);
            setError(err.response?.data?.message || 'Failed to create request.');
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        if (filters.candidate && !req.requestedFrom.name.toLowerCase().includes(filters.candidate.toLowerCase())) return false;
        if (filters.requestedBy && !req.requestedBy.name.toLowerCase().includes(filters.requestedBy.toLowerCase())) return false;
        if (filters.documentType && req.type !== filters.documentType) return false;
        if (filters.status && req.status !== filters.status) return false;
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'UPLOADED': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'REVIEWED': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'REJECTED': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    if (loading && requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 m-8">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                <p className="text-purple-200 font-bold">Loading document requests...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow-purple">
                        <FileUp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Document Requests</h2>
                        <p className="text-slate-400 text-sm">Manage document requests from candidates</p>
                    </div>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl text-white font-medium hover-lift shadow-premium flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Request
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="font-semibold">{error}</span>
                </div>
            )}

            {}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <input
                        type="text"
                        value={filters.candidate}
                        onChange={(e) => setFilters({ ...filters, candidate: e.target.value })}
                        placeholder="Search candidate..."
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <input
                        type="text"
                        value={filters.requestedBy}
                        onChange={(e) => setFilters({ ...filters, requestedBy: e.target.value })}
                        placeholder="Requested by..."
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <select
                        value={filters.documentType}
                        onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        <option value="">All Document Types</option>
                        <option value="ID_PROOF">ID Proof</option>
                        <option value="W2">W2</option>
                        <option value="OFFER">Offer</option>
                        <option value="TIMESHEET">Timesheet</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="UPLOADED">Uploaded</option>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {}
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Requested By</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Document Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Requested Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRequests.map((request) => (
                                <tr key={request._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">{request.requestedFrom.name}</span>
                                            <span className="text-xs text-slate-500">{request.requestedFrom.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-400 text-sm">{request.requestedBy.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium border border-purple-500/30">
                                            {request.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300 text-sm">
                                            {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {request.status === 'UPLOADED' || request.status === 'REVIEWED' ? (
                                                <button
                                                    onClick={() => DocumentService.downloadFile(request._id)}
                                                    className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
                    <div className="glass rounded-2xl border border-white/10 max-w-lg w-full shadow-premium">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Create Document Request</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Candidate</label>
                                <select
                                    value={formData.requestedFrom}
                                    onChange={(e) => setFormData({ ...formData, requestedFrom: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    disabled={loadingCandidates}
                                >
                                    <option value="">Select a candidate</option>
                                    {candidates.map(candidate => (
                                        <option key={candidate._id} value={candidate._id}>{candidate.name} ({candidate.email})</option>
                                    ))}
                                </select>
                                {loadingCandidates && <span className="text-xs text-purple-400 mt-1">Loading candidates...</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Document Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                >
                                    <option value="ID_PROOF">ID Proof</option>
                                    <option value="W2">W2</option>
                                    <option value="OFFER">Offer</option>
                                    <option value="TIMESHEET">Timesheet</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    rows={3}
                                    placeholder="Add any additional notes..."
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateRequest}
                                disabled={loading}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl text-white font-medium hover-lift shadow-premium flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                Create Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

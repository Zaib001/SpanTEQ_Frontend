import { useState } from 'react';
import { FileUp, Filter, Plus, Download, Eye, X } from 'lucide-react';

interface DocumentRequest {
    id: string;
    candidateName: string;
    requestedBy: string;
    documentType: string;
    status: 'Pending' | 'Uploaded' | 'Approved' | 'Rejected';
    requestedDate: string;
    uploadedDate?: string;
    notes: string;
    submissionId?: string;
}

const mockRequests: DocumentRequest[] = [
    {
        id: '1',
        candidateName: 'John Doe',
        requestedBy: 'Alice Johnson',
        documentType: 'Resume',
        status: 'Uploaded',
        requestedDate: '2025-01-05',
        uploadedDate: '2025-01-06',
        notes: 'Updated resume needed',
    },
    {
        id: '2',
        candidateName: 'Jane Smith',
        requestedBy: 'Bob Smith',
        documentType: 'ID Proof',
        status: 'Pending',
        requestedDate: '2025-01-08',
        notes: 'Government ID required for verification',
    },
    {
        id: '3',
        candidateName: 'Mike Johnson',
        requestedBy: 'Alice Johnson',
        documentType: 'Certification',
        status: 'Approved',
        requestedDate: '2025-01-03',
        uploadedDate: '2025-01-04',
        notes: 'AWS certification',
    },
];

export function DocumentRequests() {
    const [requests, setRequests] = useState<DocumentRequest[]>(mockRequests);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        candidate: '',
        requestedBy: '',
        documentType: '',
        status: '',
    });
    const [formData, setFormData] = useState({
        candidate: '',
        submission: '',
        documentType: '',
        notes: '',
    });

    const handleCreateRequest = () => {
        const newRequest: DocumentRequest = {
            id: Date.now().toString(),
            candidateName: formData.candidate,
            requestedBy: 'Admin User',
            documentType: formData.documentType,
            status: 'Pending',
            requestedDate: new Date().toISOString().split('T')[0],
            notes: formData.notes,
            submissionId: formData.submission || undefined,
        };
        setRequests([...requests, newRequest]);
        setShowModal(false);
        setFormData({ candidate: '', submission: '', documentType: '', notes: '' });
    };

    const filteredRequests = requests.filter(req => {
        if (filters.candidate && !req.candidateName.toLowerCase().includes(filters.candidate.toLowerCase())) return false;
        if (filters.requestedBy && !req.requestedBy.toLowerCase().includes(filters.requestedBy.toLowerCase())) return false;
        if (filters.documentType && req.documentType !== filters.documentType) return false;
        if (filters.status && req.status !== filters.status) return false;
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'Uploaded': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'Approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'Rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
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
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl text-white font-medium hover-lift shadow-premium flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Request
                </button>
            </div>

            {/* Filters */}
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
                        <option value="Resume">Resume</option>
                        <option value="ID Proof">ID Proof</option>
                        <option value="Certification">Certification</option>
                        <option value="Reference Letter">Reference Letter</option>
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Uploaded">Uploaded</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table */}
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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Uploaded Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-slate-200 font-medium">{request.candidateName}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-400 text-sm">{request.requestedBy}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium border border-purple-500/30">
                                            {request.documentType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300 text-sm">
                                            {new Date(request.requestedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300 text-sm">
                                            {request.uploadedDate
                                                ? new Date(request.uploadedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : '-'
                                            }
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {request.status !== 'Pending' && (
                                                <button className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Request Modal */}
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
                                <input
                                    type="text"
                                    value={formData.candidate}
                                    onChange={(e) => setFormData({ ...formData, candidate: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder="Enter candidate name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Related Submission (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.submission}
                                    onChange={(e) => setFormData({ ...formData, submission: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder="Enter submission ID"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Document Type</label>
                                <select
                                    value={formData.documentType}
                                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                >
                                    <option value="">Select document type</option>
                                    <option value="Resume">Resume</option>
                                    <option value="ID Proof">ID Proof</option>
                                    <option value="Certification">Certification</option>
                                    <option value="Reference Letter">Reference Letter</option>
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
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl text-white font-medium hover-lift shadow-premium flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Create Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

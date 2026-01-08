import { useState, useEffect, useCallback } from 'react';
import {
    Search, Filter, FileText, User as UserIcon, Briefcase, Calendar, Sparkles,
    ChevronDown, Eye, X, Globe, DollarSign, Cpu, Trash2, Edit, Users as UsersIcon
} from 'lucide-react';
import RecruiterService from '../../services/recruiter.service';
import type { Submission } from '../../services/submission.service';

const statusColors: Record<string, { bg: string, text: string, border: string }> = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    submitted: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    interview: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    offered: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    placed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    SUBMITTED: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    INTERVIEWING: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    OFFERED: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    PLACED: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    REJECTED: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    ON_HOLD: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    WITHDRAWN: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
    CLOSED: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
};

export function RecruiterSubmissions() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [filters, setFilters] = useState({
        client: 'all',
        status: 'all',
    });

    const [candidates, setCandidates] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        candidateId: '',
        client: '',
        role: '',
        date: new Date().toISOString().split('T')[0],
        status: 'SUBMITTED',
        rate: '',
        vendor: '',
        technology: ''
    });

    const fetchSubmissions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await RecruiterService.getSubmissions();
            setSubmissions(data);
        } catch (err: any) {
            console.error('Failed to fetch submissions:', err);
            setError(err.message || 'Failed to load submissions');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCandidates = useCallback(async () => {
        try {
            const data = await RecruiterService.getMyCandidates();
            setCandidates(data);
        } catch (err) {
            console.error('Failed to fetch candidates', err);
        }
    }, []);

    useEffect(() => {
        fetchSubmissions();
        fetchCandidates();
    }, [fetchSubmissions, fetchCandidates]);

    const filteredSubmissions = submissions.filter(sub => {
        const candidateStr = typeof sub.candidate === 'object' ? sub.candidate.name : sub.candidate || '';
        const clientStr = sub.client || '';

        const matchesSearch =
            (candidateStr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (clientStr || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilters =
            (filters.client === 'all' || clientStr === filters.client) &&
            (filters.status === 'all' || sub.status === filters.status);

        return matchesSearch && matchesFilters;
    });

    const stats = {
        total: submissions.length,
        active: submissions.filter(s => ['submitted', 'SUBMITTED', 'interview', 'INTERVIEWING', 'offered', 'OFFERED'].includes(s.status)).length,
        placed: submissions.filter(s => s.status === 'placed' || s.status === 'PLACED').length,
        rejected: submissions.filter(s => s.status === 'rejected' || s.status === 'REJECTED').length,
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && selectedSubmission?._id) {
                await RecruiterService.updateSubmission(selectedSubmission._id, formData);
            } else {
                await RecruiterService.createSubmission(formData);
            }
            setShowFormModal(false);
            fetchSubmissions();
            resetForm();
        } catch (err) {
            console.error('Operation failed', err);
            alert('Operation failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this submission?')) return;
        try {
            await RecruiterService.deleteSubmission(id);
            fetchSubmissions();
        } catch (err) {
            alert('Failed to delete submission');
        }
    };

    const openEditModal = (sub: Submission) => {
        setSelectedSubmission(sub);
        setFormData({
            candidateId: typeof sub.candidate === 'object' ? sub.candidate._id : (sub.candidate || ''),
            client: sub.client || '',
            role: sub.role || '',
            date: sub.date ? new Date(sub.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: sub.status || 'SUBMITTED',
            rate: sub.rate || '',
            vendor: sub.vendor || '',
            technology: sub.technology || ''
        });
        setIsEditing(true);
        setShowFormModal(true);
    };

    const openAddModal = () => {
        resetForm();
        setIsEditing(false);
        setShowFormModal(true);
    };

    const resetForm = () => {
        setFormData({
            candidateId: '',
            client: '',
            role: '',
            date: new Date().toISOString().split('T')[0],
            status: 'SUBMITTED',
            rate: '',
            vendor: '',
            technology: ''
        });
        setSelectedSubmission(null);
    };

    return (
        <div className="p-8 space-y-6">
            {}
            <div className="relative">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                <div className="relative flex items-center justify-between mb-4 animate-slide-in">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-glow-blue animate-pulse-glow">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl text-gradient-premium">My Submissions</h1>
                            <p className="text-slate-400 mt-1 text-sm">Track your candidate submissions across all clients</p>
                        </div>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg hover:shadow-glow-blue hover:scale-105 transition-all duration-300"
                    >
                        <FileText className="w-5 h-5" />
                        New Submission
                    </button>
                </div>
            </div>

            {}
            <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
                {[
                    { label: 'Total Submissions', value: stats.total, gradient: 'from-blue-500 to-cyan-500', icon: FileText },
                    { label: 'Active Pipeline', value: stats.active, gradient: 'from-yellow-500 to-orange-500', icon: Calendar },
                    { label: 'Total Placements', value: stats.placed, gradient: 'from-green-500 to-emerald-500', icon: Sparkles },
                    { label: 'Closed / Rejected', value: stats.rejected, gradient: 'from-red-500 to-rose-500', icon: UserIcon },
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
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-all duration-300" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by candidate, client..."
                            className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:bg-white/10"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`group relative px-6 py-4 glass rounded-2xl transition-all duration-300 flex items-center gap-3 overflow-hidden ${showFilters ? 'bg-blue-500/20 border-blue-500/30 shadow-glow-blue' : 'hover:bg-white/10'}`}
                    >
                        <Filter className={`w-5 h-5 relative z-10 ${showFilters ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`} />
                        <span className={`relative z-10 font-medium ${showFilters ? 'text-blue-400' : 'text-slate-300'}`}>Filters</span>
                        <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-300 ${showFilters ? 'rotate-180 text-blue-400' : 'text-slate-400'}`} />
                    </button>
                    <div className="relative h-full">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="appearance-none bg-white/5 border border-white/10 text-slate-300 px-6 py-4 rounded-2xl pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/10 transition-all cursor-pointer h-full"
                        >
                            <option value="all">All Status</option>
                            <option value="SUBMITTED">Submitted</option>
                            <option value="INTERVIEWING">Interviewing</option>
                            <option value="OFFERED">Offered</option>
                            <option value="PLACED">Placed</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {}
            <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in relative z-20" style={{ animationDelay: '300ms' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="glass-dark border-b border-white/10">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Candidate</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Client</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Role</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Date</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</th>
                                <th className="px-8 py-5 text-right text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(loading && submissions.length === 0) ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="flex justify-center mb-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                                        </div>
                                        Fetching submissions...
                                    </td>
                                </tr>
                            ) : filteredSubmissions.map((submission, index) => {
                                const candidateName = typeof submission.candidate === 'object' ? submission.candidate.name : submission.candidate || 'N/A';
                                return (
                                    <tr
                                        key={submission._id}
                                        className="group hover:bg-white/5 transition-all duration-300 animate-slide-in"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-glow-blue">
                                                    {(candidateName || 'U').charAt(0)}
                                                </div>
                                                <span className="text-slate-200 font-bold group-hover:text-white transition-colors">{candidateName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 px-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase text-blue-400">
                                                    {submission.client}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-slate-300 font-medium text-sm">
                                            {submission.role}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-slate-500 text-xs font-bold font-mono">
                                            {new Date(submission.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[submission.status]?.bg || 'bg-slate-500/20'} ${statusColors[submission.status]?.text || 'text-slate-400'} border ${statusColors[submission.status]?.border || 'border-slate-500/30'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${submission.status.toLowerCase() === 'placed' ? 'bg-green-400 animate-pulse-glow' : (statusColors[submission.status]?.text || 'text-slate-400').replace('text-', 'bg-')}`} />
                                                {submission.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setSelectedSubmission(submission); setShowDetailModal(true); }}
                                                    className="p-2.5 glass rounded-xl text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(submission)}
                                                    className="p-2.5 glass rounded-xl text-slate-400 hover:bg-amber-500/20 hover:text-amber-400 hover:shadow-glow-amber transition-all duration-300"
                                                    title="Edit Submission"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => submission._id && handleDelete(submission._id)}
                                                    className="p-2.5 glass rounded-xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:shadow-glow-red transition-all duration-300"
                                                    title="Delete Submission"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {!loading && filteredSubmissions.length === 0 && (
                        <div className="text-center p-20 glass m-8 rounded-[40px] animate-slide-in">
                            <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">No Submissions Found</h3>
                            <p className="text-slate-600 mt-2">Adjust your search or filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>

            {}
            {showDetailModal && selectedSubmission && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-dark max-w-2xl w-full rounded-[40px] p-10 border border-white/20 shadow-2xl relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 -mr-20 -mt-20" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gradient-premium">Submission Details</h2>
                            <button onClick={() => setShowDetailModal(false)} className="p-3 glass rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6 p-6 glass rounded-3xl border border-white/10">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-[28px] flex items-center justify-center text-3xl font-black text-white shadow-glow-blue">
                                    {((typeof selectedSubmission.candidate === 'object' ? selectedSubmission.candidate.name : selectedSubmission.candidate) || 'U').charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-white">{typeof selectedSubmission.candidate === 'object' ? selectedSubmission.candidate.name : selectedSubmission.candidate}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Briefcase className="w-4 h-4 text-slate-500" />
                                        <span className="text-slate-300 font-bold">{selectedSubmission.role}</span>
                                    </div>
                                    <div className={`mt-3 w-fit px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[selectedSubmission.status]?.bg} ${statusColors[selectedSubmission.status]?.text} ${statusColors[selectedSubmission.status]?.border}`}>
                                        {selectedSubmission.status}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Client Engagement</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-4 h-4 text-blue-400" />
                                                <span className="text-sm font-bold">Client</span>
                                            </div>
                                            <span className="text-sm text-slate-400">{selectedSubmission.client}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="flex-shrink-0 w-4 h-4 text-purple-400" />
                                                <span className="text-sm font-bold">Submitted On</span>
                                            </div>
                                            <span className="text-sm text-slate-400 font-mono">{new Date(selectedSubmission.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Financial & Tech</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <DollarSign className="w-4 h-4 text-green-400" />
                                                <span className="text-sm font-bold">Proposed Rate</span>
                                            </div>
                                            <span className="text-sm text-slate-400 font-mono">{selectedSubmission.rate || 'Not Disclosed'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <Cpu className="w-4 h-4 text-cyan-400" />
                                                <span className="text-sm font-bold">Technology</span>
                                            </div>
                                            <span className="text-sm text-slate-400 truncate ml-2">{selectedSubmission.technology || 'Core Stack'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass rounded-3xl p-6 border border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3">Vendor / Partner Information</p>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="p-3 bg-white/5 rounded-2xl">
                                        <UsersIcon className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5 uppercase font-bold">Source Vendor</p>
                                        <p className="text-sm font-black text-slate-200">{selectedSubmission.vendor || 'Direct Submission'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setShowDetailModal(false); openEditModal(selectedSubmission); }}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-[28px] text-slate-300 font-black tracking-widest hover:bg-white/10 transition-all uppercase text-xs"
                                >
                                    Edit Details
                                </button>
                                <button className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-[28px] font-black tracking-widest shadow-glow-blue hover:scale-[1.02] transition-all uppercase text-xs">
                                    Update Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {}
            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFormModal(false)} />
                    <div className="relative glass-dark rounded-3xl p-8 w-full max-w-2xl border border-white/20 shadow-2xl animate-scale-in">
                        <h2 className="text-2xl font-bold text-white mb-6">{isEditing ? 'Edit Submission' : 'New Submission'}</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Candidate</label>
                                    <select
                                        required
                                        value={formData.candidateId}
                                        onChange={e => setFormData({ ...formData, candidateId: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none appearance-none"
                                    >
                                        <option value="" className="text-slate-900">Select Candidate</option>
                                        {candidates.map(c => (
                                            <option key={c._id} value={c._id} className="text-slate-900">{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Client</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.client}
                                        onChange={e => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Role/Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Rate</label>
                                    <input
                                        type="text"
                                        value={formData.rate}
                                        onChange={e => setFormData({ ...formData, rate: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Vendor (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.vendor}
                                        onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Technology</label>
                                <input
                                    type="text"
                                    value={formData.technology}
                                    onChange={e => setFormData({ ...formData, technology: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className="flex-1 px-4 py-3 glass rounded-xl text-slate-300 hover:text-white transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-bold shadow-lg hover:shadow-glow-blue transition-all"
                                >
                                    {isEditing ? 'Save Changes' : 'Create Submission'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

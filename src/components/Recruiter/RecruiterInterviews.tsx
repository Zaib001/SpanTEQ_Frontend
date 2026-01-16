import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Video, Calendar, Briefcase, Clock,
    CheckCircle, Sparkles, Filter, ChevronDown,
    Search as SearchIcon, Loader2, AlertCircle, X, Eye, Trash2, Edit2, Plus, ArrowRight, User
} from 'lucide-react';
import InterviewService, { type Interview } from '../../services/interview.service';
import RecruiterService from '../../services/recruiter.service';
import type { Submission } from '../../services/submission.service';

interface InterviewRow extends Interview {
    submissionId: string;
    candidateName: string;
    recruiterName: string;
    client: string;
    position: string;
}

const statusColors: Record<string, { bg: string, text: string, border: string, icon: any }> = {
    SCHEDULED: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: Calendar },
    COMPLETED: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle },
    CANCELLED: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: X },
    NO_SHOW: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', icon: AlertCircle },
};

const partyColors: Record<string, string> = {
    CLIENT: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    PRIME_VENDOR: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    VENDOR: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

export function RecruiterInterviews() {
    const [searchParams, setSearchParams] = useSearchParams();
    const submissionIdParam = searchParams.get('submissionId');

    const [interviews, setInterviews] = useState<InterviewRow[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedInterview, setSelectedInterview] = useState<InterviewRow | null>(null);

    const [filters, setFilters] = useState({
        status: 'all',
        party: 'all',
        mode: 'all',
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch recruiter's submissions
            const submissionList = await RecruiterService.getSubmissions();
            setSubmissions(submissionList);

            // Flatten interviews from all submissions
            const flattenedInterviews: InterviewRow[] = [];
            submissionList.forEach(sub => {
                if (sub.interviews && Array.isArray(sub.interviews)) {
                    sub.interviews.forEach(int => {
                        // Safely extract candidate name
                        const candidateName = typeof sub.candidate === 'object' ? (sub.candidate as any).name : 'Unknown Candidate';
                        // Recruiter is self
                        const recruiterName = 'Me';

                        if (int._id) {
                            flattenedInterviews.push({
                                ...int,
                                _id: int._id,
                                submissionId: sub._id,
                                candidateName,
                                recruiterName,
                                client: sub.client,
                                position: sub.role,
                                roundNumber: int.roundNumber || 1,
                                party: int.party || 'CLIENT',
                                vendorType: int.vendorType || null,
                                mode: int.mode || 'VIDEO',
                                scheduledAt: int.scheduledAt || new Date().toISOString(),
                                status: int.status || 'SCHEDULED'
                            } as InterviewRow);
                        }
                    });
                }
            });

            // Sort by scheduledAt descending (newest first)
            flattenedInterviews.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

            setInterviews(flattenedInterviews);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredInterviews = useMemo(() => {
        return interviews.filter(item => {
            if (submissionIdParam && item.submissionId !== submissionIdParam) return false;

            const matchesSearch =
                item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.position.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilters =
                (filters.status === 'all' || item.status === filters.status) &&
                (filters.party === 'all' || item.party === filters.party) &&
                (filters.mode === 'all' || item.mode === filters.mode);

            return matchesSearch && matchesFilters;
        });
    }, [interviews, searchQuery, filters, submissionIdParam]);

    const stats = useMemo(() => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const current = new Date();
        const first = current.getDate() - current.getDay();
        const firstDay = new Date(current.setDate(first)).toISOString().split('T')[0];

        return {
            today: interviews.filter(i => i.scheduledAt?.startsWith(today)).length,
            week: interviews.filter(i => i.scheduledAt >= firstDay).length,
            completed: interviews.filter(i => i.status === 'COMPLETED').length,
        };
    }, [interviews]);

    const handleDelete = async (submissionId: string, interviewId: string) => {
        if (window.confirm('Are you sure you want to delete this interview round?')) {
            try {
                await InterviewService.deleteInterview(submissionId, interviewId);
                setInterviews(prev => prev.filter(i => i._id !== interviewId));
                fetchData();
            } catch (err: any) {
                alert(err.message || 'Failed to delete interview');
            }
        }
    };

    const handleOpenModal = (mode: 'create' | 'edit' | 'view', interview: InterviewRow | null = null) => {
        setModalMode(mode);
        setSelectedInterview(interview);
        setShowModal(true);
    };

    if (loading && interviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
                <p className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Synchronizing Pipeline...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div className="relative">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-in">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl shadow-glow-purple">
                            <Video className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl text-gradient-premium">Interviews</h1>
                            <p className="text-slate-400 mt-0.5 text-sm">Manage candidate interview schedules</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal('create')}
                        className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl text-white font-bold shadow-lg hover:shadow-violet-500/25 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Schedule New Round
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
                {[
                    { label: 'Scheduled Today', value: stats.today, gradient: 'from-violet-500 to-purple-500', icon: Clock },
                    { label: 'This Week', value: stats.week, gradient: 'from-purple-500 to-fuchsia-500', icon: Calendar },
                    { label: 'Total Completed', value: stats.completed, gradient: 'from-fuchsia-500 to-pink-500', icon: CheckCircle },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="group relative glass rounded-[2rem] p-8 hover-lift card-shine overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-5xl font-black text-white">{stat.value}</p>
                                </div>
                                <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg ring-4 ring-white/5`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden animate-slide-in shadow-premium" style={{ animationDelay: '200ms' }}>
                <div className="p-8 border-b border-white/5 space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="relative flex-1 group">
                            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search candidates, positions, or clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/30 transition-all font-medium text-slate-200"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all font-bold border active:scale-95 ${showFilters
                                    ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 shadow-lg shadow-violet-500/10'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                                    }`}
                            >
                                <Filter className="w-5 h-5" />
                                Filters
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                            <button
                                onClick={() => fetchData()}
                                className="p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all active:scale-95"
                            >
                                <Sparkles className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {submissionIdParam && (
                        <div className="flex items-center justify-between p-4 bg-violet-500/10 border border-violet-500/30 rounded-2xl animate-in fade-in slide-in-from-left-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                                    <Filter className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-violet-300">Filtering by Submission</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Showing interviews for specific candidate record</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    searchParams.delete('submissionId');
                                    setSearchParams(searchParams);
                                }}
                                className="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-violet-500/30"
                            >
                                Clear Filter
                            </button>
                        </div>
                    )}

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-900/30 rounded-3xl border border-white/5 animate-in slide-in-from-top duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 focus:border-violet-500 outline-none text-slate-300 font-bold"
                                >
                                    <option value="all">All Status</option>
                                    <option value="SCHEDULED">Scheduled</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="NO_SHOW">No Show</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Interview Party</label>
                                <select
                                    value={filters.party}
                                    onChange={(e) => setFilters({ ...filters, party: e.target.value })}
                                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 focus:border-violet-500 outline-none text-slate-300 font-bold"
                                >
                                    <option value="all">All Parties</option>
                                    <option value="CLIENT">Client</option>
                                    <option value="PRIME_VENDOR">Prime Vendor</option>
                                    <option value="VENDOR">Vendor</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => setFilters({ status: 'all', party: 'all', mode: 'all' })}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all font-bold border border-slate-700"
                                >
                                    <X className="w-4 h-4" />
                                    Reset Configuration
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate & Position</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client & Round</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {filteredInterviews.map((interview) => {
                                const statusInfo = statusColors[interview.status] || statusColors.SCHEDULED;
                                const partyClass = partyColors[interview.party] || partyColors.CLIENT;

                                return (

                                    <tr key={interview._id} className="group hover:bg-white/[0.01] transition-all">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-black text-white group-hover:scale-110 group-hover:shadow-glow-purple transition-all border border-white/5">
                                                    {interview.candidateName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-200 group-hover:text-violet-400 transition-colors uppercase tracking-tight text-lg">{interview.candidateName}</p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                                                        <Briefcase className="w-3 h-3" />
                                                        {interview.position}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1.5">
                                                <p className="font-black text-slate-300 text-sm tracking-wide">{interview.client}</p>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-tighter ${partyClass}`}>
                                                        {interview.party}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">R{interview.roundNumber}</span>
                                                    {interview.stageLabel && (
                                                        <span className="text-[10px] font-bold text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded border border-violet-400/20 uppercase">
                                                            {interview.stageLabel}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(interview.scheduledAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                                                <statusInfo.icon className="w-3.5 h-3.5" />
                                                {interview.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-all">
                                                <button
                                                    onClick={() => handleOpenModal('view', interview)}
                                                    className="p-2.5 bg-slate-800 hover:bg-violet-500/20 text-slate-400 hover:text-violet-400 rounded-xl transition-all border border-white/5 hover:border-violet-500/30"
                                                >
                                                    <Eye className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal('edit', interview)}
                                                    className="p-2.5 bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-xl transition-all border border-white/5 hover:border-emerald-500/30"
                                                >
                                                    <Edit2 className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(interview.submissionId, interview._id)}
                                                    className="p-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-white/5 hover:border-red-500/30"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredInterviews.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                            <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 ring-8 ring-white/5 shadow-inner">
                                <Calendar className="w-12 h-12 text-slate-600" />
                            </div>
                            <p className="text-2xl font-black text-slate-300 mb-2 uppercase tracking-widest">Zero Matches Found</p>
                            <p className="font-bold text-slate-500">Adjust your search parameters and try again</p>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <InterviewModal
                    mode={modalMode}
                    interview={selectedInterview}
                    submissions={submissions}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}

function InterviewModal({
    mode,
    interview,
    submissions,
    onClose,
    onSuccess
}: {
    mode: 'create' | 'edit' | 'view',
    interview: InterviewRow | null,
    submissions: Submission[],
    onClose: () => void,
    onSuccess: () => void
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Interview>>({
        roundNumber: 1,
        party: 'CLIENT',
        vendorType: null,
        stageLabel: '',
        mode: 'VIDEO',
        scheduledAt: new Date().toISOString().slice(0, 16),
        completedAt: '',
        status: 'SCHEDULED',
        interviewerName: '',
        notes: '',
    });

    const [searchParams] = useSearchParams();
    const submissionIdParam = searchParams.get('submissionId');
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>('');

    useEffect(() => {
        if (mode === 'create' && submissionIdParam) {
            setSelectedSubmissionId(submissionIdParam);
        }
    }, [mode, submissionIdParam]);

    useEffect(() => {
        if (interview) {
            setFormData({
                roundNumber: interview.roundNumber,
                party: interview.party,
                vendorType: interview.vendorType,
                stageLabel: interview.stageLabel || '',
                mode: interview.mode || 'VIDEO',
                scheduledAt: new Date(interview.scheduledAt).toISOString().slice(0, 16),
                completedAt: interview.completedAt ? new Date(interview.completedAt).toISOString().slice(0, 16) : '',
                status: interview.status,
                interviewerName: interview.interviewerName || '',
                notes: interview.notes || '',
            });
            setSelectedSubmissionId(interview.submissionId);
        }
    }, [interview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'view') return;

        try {
            setLoading(true);

            const submissionData = {
                ...formData,
                vendorType: formData.party === 'VENDOR' ? formData.vendorType : null
            };

            if (mode === 'create') {
                if (!selectedSubmissionId) throw new Error('Please select a candidate');
                await InterviewService.createInterview(selectedSubmissionId, submissionData);
            } else {
                if (!interview) return;
                await InterviewService.updateInterview(interview.submissionId, interview._id, submissionData);
            }
            onSuccess();
        } catch (err: any) {
            alert(err.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60 transition-all duration-500 animate-in fade-in">
            <div
                className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95"
                style={{ boxShadow: '0 0 50px -12px rgba(139, 92, 246, 0.2)' }}
            >
                <div className="relative p-8 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-500/20 rounded-2xl">
                                <Video className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                    {mode === 'view' ? 'Interview Profile' : mode === 'edit' ? 'Update Round' : 'Schedule Round'}
                                </h2>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Interview ID: {interview?._id || 'NEW'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Candidate Mapping</label>
                            {mode === 'create' ? (
                                <select
                                    required
                                    value={selectedSubmissionId}
                                    onChange={(e) => setSelectedSubmissionId(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold transition-all focus:ring-4 focus:ring-violet-500/10"
                                >
                                    <option value="">Select Candidate Submission...</option>
                                    {submissions.map(sub => (
                                        <option key={sub._id} value={sub._id}>
                                            {typeof sub.candidate === 'object' ? (sub.candidate as any).name : 'Unknown'} - {sub.client} ({sub.role})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex items-center gap-3 bg-slate-800/30 border border-white/5 p-4 rounded-2xl">
                                    <User className="w-5 h-5 text-violet-400" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">{interview?.candidateName}</p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase">{interview?.client} • {interview?.position}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Round Number</label>
                            <input
                                type="number"
                                min="1"
                                required
                                disabled={mode === 'view'}
                                value={formData.roundNumber}
                                onChange={(e) => setFormData({ ...formData, roundNumber: parseInt(e.target.value) })}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Interview Party</label>
                            <select
                                required
                                disabled={mode === 'view'}
                                value={formData.party}
                                onChange={(e) => setFormData({ ...formData, party: e.target.value as any })}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold disabled:opacity-50"
                            >
                                <option value="CLIENT">Client</option>
                                <option value="PRIME_VENDOR">Prime Vendor</option>
                                <option value="VENDOR">Vendor</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                disabled={mode === 'view'}
                                value={formData.scheduledAt}
                                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                            <select
                                required
                                disabled={mode === 'view'}
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold disabled:opacity-50"
                            >
                                <option value="SCHEDULED">Scheduled</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="NO_SHOW">No Show</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Interview Mode</label>
                            <select
                                required
                                disabled={mode === 'view'}
                                value={formData.mode}
                                onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold disabled:opacity-50"
                            >
                                <option value="VIDEO">Video Call</option>
                                <option value="PHONE">Phone Call</option>
                                <option value="IN_PERSON">In-Person</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stage / Label</label>
                            <input
                                type="text"
                                disabled={mode === 'view'}
                                value={formData.stageLabel}
                                onChange={(e) => setFormData({ ...formData, stageLabel: e.target.value })}
                                placeholder="e.g. Technical Round 1, Leadership, etc."
                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold disabled:opacity-50"
                            />
                        </div>

                        {formData.party === 'VENDOR' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vendor Type</label>
                                <select
                                    required
                                    disabled={mode === 'view'}
                                    value={formData.vendorType || ''}
                                    onChange={(e) => setFormData({ ...formData, vendorType: e.target.value as any })}
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold disabled:opacity-50"
                                >
                                    <option value="">Select Vendor Type...</option>
                                    <option value="AMERICAN_VENDOR">American Vendor</option>
                                    <option value="NON_AMERICAN_VENDOR">Non-American Vendor</option>
                                </select>
                            </div>
                        )}

                        {formData.status === 'COMPLETED' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Completion Date</label>
                                <input
                                    type="datetime-local"
                                    required
                                    disabled={mode === 'view'}
                                    value={formData.completedAt}
                                    onChange={(e) => setFormData({ ...formData, completedAt: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold disabled:opacity-50"
                                />
                            </div>
                        )}

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Interviewer Name</label>
                            <input
                                type="text"
                                disabled={mode === 'view'}
                                value={formData.interviewerName}
                                onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                                placeholder="Name of the person conducting the interview"
                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold disabled:opacity-50"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Performance Feedback & Notes</label>
                            <textarea
                                rows={4}
                                disabled={mode === 'view'}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Candidate feedback, questions asked, or special requirements..."
                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 focus:border-violet-500 outline-none text-slate-200 font-bold transition-all resize-none disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] border border-white/5"
                        >
                            Discard Changes
                        </button>
                        {mode !== 'view' && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl shadow-xl shadow-violet-600/20 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                                {mode === 'create' ? 'Finalize Scheduling' : 'Update Record'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

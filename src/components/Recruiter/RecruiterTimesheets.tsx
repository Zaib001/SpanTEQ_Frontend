import { useState, useEffect, useCallback } from 'react';
import {
    Clock, CheckCircle, XCircle, LayoutGrid, List as ListIcon,
    ChevronDown, ChevronRight, Search, Eye, X, Calendar,
    TrendingUp, AlertCircle, Briefcase, FileText
} from 'lucide-react';
import RecruiterService from '../../services/recruiter.service';
import type { Timesheet } from '../../services/timesheet.service';

const statusColors: Record<string, { bg: string, text: string, border: string }> = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    approved: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    submitted: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
};

export function RecruiterTimesheets() {
    const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'grouped'>('grouped');
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);

    const fetchTimesheets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await RecruiterService.getCandidateTimesheets();
            setTimesheets(data);
        } catch (err) {
            void err;
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTimesheets();
    }, [fetchTimesheets]);

    const handleApprove = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        try {
            await RecruiterService.approveTimesheet(id);
            setTimesheets(prev => prev.map(t => t._id === id ? { ...t, status: 'approved' } : t));
        } catch (err) {
            void err;
            alert('Failed to approve timesheet');
        }
    };

    const handleReject = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const reason = window.prompt("Reason for rejection:");
        if (reason !== null) {
            try {
                await RecruiterService.rejectTimesheet(id, reason || "Rejected by recruiter");
                setTimesheets(prev => prev.map(t => t._id === id ? { ...t, status: 'rejected' } : t));
            } catch (err) {
                void err;
                alert('Failed to reject');
            }
        }
    };

    const handleApproveAll = async (candidateId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const pending = timesheets.filter(t => (t.user?._id === candidateId || (t.user as any) === candidateId) && t.status === 'pending');
        if (pending.length === 0) return;

        if (window.confirm(`Approve all ${pending.length} pending timesheets for this candidate?`)) {
            try {
                await Promise.all(pending.map(t => RecruiterService.approveTimesheet(t._id)));
                setTimesheets(prev => prev.map(t =>
                    ((t.user?._id === candidateId || (t.user as any) === candidateId) && t.status === 'pending')
                        ? { ...t, status: 'approved' } : t
                ));
            } catch (err) {
                void err;
                alert('Failed to approve some timesheets');
            }
        }
    };

    const toggleGroup = (candidateId: string) => {
        setExpandedGroups(prev =>
            prev.includes(candidateId) ? prev.filter(id => id !== candidateId) : [...prev, candidateId]
        );
    };

    const filteredTimesheets = timesheets.filter(t => {
        const matchesSearch =
            (t.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.client || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const groups = filteredTimesheets.reduce((acc, curr) => {
        const candidateId = curr.user?._id || (typeof curr.user === 'string' ? curr.user : 'unknown');
        const candidateName = curr.user?.name || 'Unknown Candidate';
        if (!acc[candidateId]) {
            acc[candidateId] = {
                name: candidateName,
                items: [],
                totalHours: 0,
                pendingCount: 0,
                client: curr.client || 'N/A'
            };
        }
        acc[candidateId].items.push(curr);
        acc[candidateId].totalHours += curr.hours || 0;
        if (curr.status === 'pending') acc[candidateId].pendingCount++;
        return acc;
    }, {} as Record<string, { name: string, items: Timesheet[], totalHours: number, pendingCount: number, client: string }>);

    const stats = {
        total: timesheets.length,
        pending: timesheets.filter(t => t.status === 'pending').length,
        approved: timesheets.filter(t => t.status === 'approved').length,
        totalHours: timesheets.reduce((sum, t) => sum + (t.hours || 0), 0),
    };

    if (loading && timesheets.length === 0) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-slate-400 animate-pulse">Loading timesheets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {}
            <div className="relative">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                <div className="relative flex items-center justify-between animate-slide-in">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-500 rounded-2xl shadow-glow-blue animate-pulse-glow">
                            <Clock className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl text-gradient-premium">Timesheet Management</h1>
                            <p className="text-slate-400 mt-1 text-sm">Review and approve candidate weekly submissions</p>
                        </div>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                        <button
                            onClick={() => setViewMode('grouped')}
                            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${viewMode === 'grouped' ? 'bg-blue-500/20 text-blue-400 shadow-glow-blue' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="text-sm font-medium">By Candidate</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400 shadow-glow-blue' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <ListIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Flat List</span>
                        </button>
                    </div>
                </div>
            </div>

            {}
            <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
                {[
                    { label: 'Total Submissions', value: stats.total, gradient: 'from-blue-500 to-indigo-500', icon: FileText },
                    { label: 'Pending Review', value: stats.pending, gradient: 'from-yellow-500 to-orange-500', icon: AlertCircle },
                    { label: 'Approved Sheets', value: stats.approved, gradient: 'from-green-500 to-emerald-500', icon: CheckCircle },
                    { label: 'Total Tracked Hours', value: `${stats.totalHours}h`, gradient: 'from-purple-500 to-pink-500', icon: TrendingUp },
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
                            placeholder="Search by candidate or client..."
                            className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10"
                        />
                    </div>
                    <div className="relative h-full">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 text-slate-300 px-6 py-4 rounded-2xl pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/10 transition-all cursor-pointer h-full"
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
            <div className="space-y-4">
                {viewMode === 'grouped' ? (
                    Object.entries(groups).map(([canId, group], index) => {
                        const isExpanded = expandedGroups.includes(canId);
                        return (
                            <div key={canId} className="glass rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-300 animate-slide-in" style={{ animationDelay: `${300 + index * 50}ms` }}>
                                <div
                                    className="p-6 cursor-pointer group flex items-center justify-between"
                                    onClick={() => toggleGroup(canId)}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-glow-blue font-bold text-white text-xl uppercase">
                                            {group.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-100">{group.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-0.5">
                                                <Briefcase className="w-3.5 h-3.5" />
                                                <span>{group.client}</span>
                                                <span className="text-slate-600">•</span>
                                                <span>{group.items.length} Submissions</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mr-6 text-right">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wider">Total Hours</p>
                                            <p className="text-xl font-bold text-blue-400">{group.totalHours}h</p>
                                        </div>
                                        {group.pendingCount > 0 && (
                                            <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                                <p className="text-xs text-yellow-400 font-bold">{group.pendingCount} Pending</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {group.pendingCount > 0 && (
                                                <button
                                                    onClick={(e) => handleApproveAll(canId, e)}
                                                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm font-bold border border-green-500/20 hover:bg-green-500/30 transition-all"
                                                >
                                                    Approve All
                                                </button>
                                            )}
                                            <ChevronRight className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-blue-400' : ''}`} />
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-white/10 bg-white/[0.02] p-6 space-y-3">
                                        {group.items.map((ts) => (
                                            <div key={ts._id} className="glass rounded-2xl p-4 flex items-center justify-between border border-white/5 hover:bg-white/5 transition-all">
                                                <div className="flex items-center gap-8">
                                                    <div>
                                                        <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Period</p>
                                                        <div className="flex items-center gap-2 text-slate-200">
                                                            <Calendar className="w-4 h-4 text-blue-400" />
                                                            <span className="text-sm font-medium">
                                                                {new Date(ts.from).toLocaleDateString()} - {new Date(ts.to).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Hours</p>
                                                        <p className="text-lg font-bold text-slate-100">{ts.hours}h</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Status</p>
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase border ${statusColors[ts.status]?.bg} ${statusColors[ts.status]?.text} ${statusColors[ts.status]?.border}`}>
                                                            {ts.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => { setSelectedTimesheet(ts); setShowDetailModal(true); }}
                                                        className="p-2.5 glass rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-all border border-white/5"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {ts.status === 'pending' && (
                                                        <>
                                                            <button onClick={(e) => handleApprove(ts._id, e)} className="p-2.5 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-all border border-green-500/20">
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={(e) => handleReject(ts._id, e)} className="p-2.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all border border-red-500/20">
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in" style={{ animationDelay: '300ms' }}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="glass-dark border-b border-white/10">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Candidate</th>
                                        <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Client</th>
                                        <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Period</th>
                                        <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Hours</th>
                                        <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</th>
                                        <th className="px-8 py-5 text-right text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredTimesheets.map((ts, index) => (
                                        <tr key={ts._id} className="hover:bg-white/5 transition-colors group animate-slide-in" style={{ animationDelay: `${index * 20}ms` }}>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-xs uppercase">
                                                        {(ts.user?.name || 'U').charAt(0)}
                                                    </div>
                                                    <span className="text-slate-200 font-medium">{ts.user?.name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-slate-400 text-sm">{ts.client || 'N/A'}</td>
                                            <td className="px-8 py-5 text-slate-400 text-sm">
                                                {new Date(ts.from).toLocaleDateString()} - {new Date(ts.to).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-5 text-slate-100 font-bold">{ts.hours}h</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusColors[ts.status]?.bg} ${statusColors[ts.status]?.text} ${statusColors[ts.status]?.border}`}>
                                                    {ts.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setSelectedTimesheet(ts); setShowDetailModal(true); }} className="p-2 glass rounded-lg hover:text-blue-400 transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {ts.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleApprove(ts._id)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/10">
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleReject(ts._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/10">
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {}
            {!loading && filteredTimesheets.length === 0 && (
                <div className="glass rounded-3xl p-20 text-center animate-slide-in">
                    <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-300">No Timesheets Found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
                </div>
            )}

            {}
            {showDetailModal && selectedTimesheet && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-dark max-w-2xl w-full rounded-[40px] p-10 border border-white/20 shadow-2xl relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 -mr-20 -mt-20" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gradient-premium">Timesheet Detail</h2>
                            <button onClick={() => setShowDetailModal(false)} className="p-3 glass rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6 p-6 glass rounded-3xl border border-white/10">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[28px] flex items-center justify-center text-3xl font-black text-white shadow-glow-blue">
                                    {(selectedTimesheet.user?.name || 'U').charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-white">{selectedTimesheet.user?.name}</h3>
                                    <div className="flex items-center gap-3 text-slate-400 mt-1">
                                        <Briefcase className="w-4 h-4" />
                                        <span className="font-medium">{selectedTimesheet.client || 'N/A'}</span>
                                        <span className="text-slate-600">•</span>
                                        <span className="text-sm">Created {new Date(selectedTimesheet.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className={`px-5 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest border ${statusColors[selectedTimesheet.status]?.bg} ${statusColors[selectedTimesheet.status]?.text} ${statusColors[selectedTimesheet.status]?.border}`}>
                                    {selectedTimesheet.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="glass rounded-3xl p-6 border border-white/5">
                                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">Time Period</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                                            <Calendar className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <p className="text-lg font-bold text-slate-100">
                                            {new Date(selectedTimesheet.from).toLocaleDateString()} - {new Date(selectedTimesheet.to).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="glass rounded-3xl p-6 border border-white/5">
                                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">Total Hours</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-500/10 rounded-2xl">
                                            <Clock className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <p className="text-3xl font-black text-purple-400">{selectedTimesheet.hours}h</p>
                                    </div>
                                </div>
                            </div>

                            {selectedTimesheet.notes && (
                                <div className="glass rounded-3xl p-6 border border-white/5">
                                    <p className="text-xs text-slate-500 mb-3 uppercase tracking-widest font-bold">Recruiter/Admin Notes</p>
                                    <p className="text-slate-300 leading-relaxed italic">"{selectedTimesheet.notes}"</p>
                                </div>
                            )}

                            {selectedTimesheet.status === 'pending' && (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => { handleApprove(selectedTimesheet._id); setShowDetailModal(false); }}
                                        className="flex-1 py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl text-white font-black shadow-glow-green hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
                                        <CheckCircle className="w-6 h-6" />
                                        APPROVE SHEET
                                    </button>
                                    <button
                                        onClick={() => { handleReject(selectedTimesheet._id); setShowDetailModal(false); }}
                                        className="flex-1 py-5 bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl text-white font-black shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
                                        <XCircle className="w-6 h-6" />
                                        REJECT SHEET
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


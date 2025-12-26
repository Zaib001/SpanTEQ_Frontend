import { useState } from 'react';
import { Bot, Filter, Eye } from 'lucide-react';

interface AISession {
    id: string;
    candidateName: string;
    clientName: string;
    interviewDate: string;
    usedOn: string;
    sessionStatus: 'Completed' | 'Active' | 'Incomplete';
    purpose: string;
    duration?: number;
}

const mockSessions: AISession[] = [
    {
        id: '1',
        candidateName: 'John Doe',
        clientName: 'TechCorp Inc.',
        interviewDate: '2025-01-15',
        usedOn: '2025-01-12 14:30',
        sessionStatus: 'Completed',
        purpose: 'Real Client Interview',
        duration: 45,
    },
    {
        id: '2',
        candidateName: 'Jane Smith',
        clientName: 'DataSystems LLC',
        interviewDate: '2025-01-18',
        usedOn: '2025-01-14 10:15',
        sessionStatus: 'Completed',
        purpose: 'Mock Practice',
        duration: 30,
    },
    {
        id: '3',
        candidateName: 'Mike Johnson',
        clientName: 'CloudServices Co.',
        interviewDate: '2025-01-20',
        usedOn: '2025-01-16 16:45',
        sessionStatus: 'Active',
        purpose: 'Screening',
    },
    {
        id: '4',
        candidateName: 'Sarah Williams',
        clientName: 'InnovateTech',
        interviewDate: '2025-01-22',
        usedOn: '2025-01-17 09:00',
        sessionStatus: 'Incomplete',
        purpose: 'Behavioral Prep',
        duration: 15,
    },
];

export function AIUsageLog() {
    const [sessions] = useState<AISession[]>(mockSessions);
    const [filters, setFilters] = useState({
        candidateName: '',
        fromDate: '',
        toDate: '',
    });

    const filteredSessions = sessions.filter(session => {
        if (filters.candidateName && !session.candidateName.toLowerCase().includes(filters.candidateName.toLowerCase())) return false;
        if (filters.fromDate && session.usedOn.split(' ')[0] < filters.fromDate) return false;
        if (filters.toDate && session.usedOn.split(' ')[0] > filters.toDate) return false;
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'Active': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'Incomplete': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    const getPurposeColor = (purpose: string) => {
        switch (purpose) {
            case 'Real Client Interview': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'Mock Practice': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'Screening': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
            case 'Behavioral Prep': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
            default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    // Calculate stats
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.sessionStatus === 'Completed').length;
    const activeSessions = sessions.filter(s => s.sessionStatus === 'Active').length;
    const averageDuration = sessions
        .filter(s => s.duration)
        .reduce((acc, s) => acc + (s.duration || 0), 0) / sessions.filter(s => s.duration).length;

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow-purple">
                    <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">AI Interview Usage Log</h2>
                    <p className="text-slate-400 text-sm">Monitor AI Interview Assistant usage and performance</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6">
                <div className="glass rounded-2xl p-6 border border-white/10 hover-lift">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-glow-blue">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{totalSessions}</div>
                    <div className="text-sm text-slate-400">Total Sessions</div>
                </div>

                <div className="glass rounded-2xl p-6 border border-white/10 hover-lift">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-glow-green">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{completedSessions}</div>
                    <div className="text-sm text-slate-400">Completed</div>
                </div>

                <div className="glass rounded-2xl p-6 border border-white/10 hover-lift">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-glow-purple">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{activeSessions}</div>
                    <div className="text-sm text-slate-400">Active Now</div>
                </div>

                <div className="glass rounded-2xl p-6 border border-white/10 hover-lift">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-glow-pink">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{averageDuration.toFixed(0)}m</div>
                    <div className="text-sm text-slate-400">Avg Duration</div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="text"
                        value={filters.candidateName}
                        onChange={(e) => setFilters({ ...filters, candidateName: e.target.value })}
                        placeholder="Search candidate..."
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <input
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="From Date"
                    />
                    <input
                        type="date"
                        value={filters.toDate}
                        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="To Date"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Client Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Interview Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Purpose</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Used On</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredSessions.map((session) => (
                                <tr key={session.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-slate-200 font-medium">{session.candidateName}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{session.clientName}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300 text-sm">
                                            {new Date(session.interviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getPurposeColor(session.purpose)}`}>
                                            {session.purpose}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300 text-sm">{session.usedOn}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300 text-sm">
                                            {session.duration ? `${session.duration} min` : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(session.sessionStatus)}`}>
                                            {session.sessionStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
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

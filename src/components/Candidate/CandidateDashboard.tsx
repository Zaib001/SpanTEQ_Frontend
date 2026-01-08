import { useState, useEffect, useMemo } from 'react';
import {
    FileText, Clock, DollarSign, Activity,
    Award, Zap, ArrowUp, ArrowDown, Sparkles, BarChart3,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    AreaChart, Area, PieChart, Pie, Cell, Tooltip,
    ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from 'recharts';
import CandidateService from '../../services/candidate.service';
import type { Submission } from '../../services/submission.service';
import type { Timesheet } from '../../services/timesheet.service';

export function CandidateDashboard() {
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [subs, sheets] = await Promise.all([
                    CandidateService.getMySubmissions(),
                    CandidateService.getMyTimesheets()
                ]);
                setSubmissions(subs || []);
                setTimesheets(sheets || []);
            } catch (err) {
                void err;
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = useMemo(() => {
        const activePlacements = submissions.filter(s => s.status === 'PLACED' || s.status === 'placed').length;
        const pendingTimesheets = timesheets.filter(t => t.status === 'pending').length;
        const totalEarnings = timesheets.reduce((acc, curr) => acc + (curr.totalPay || 0), 0);

        return {
            totalSubmissions: submissions.length,
            activePlacements,
            pendingTimesheets,
            totalEarnings,
            submissionGrowth: 5.4,
            placementGrowth: 0,
        };
    }, [submissions, timesheets]);

    const statusDistribution = useMemo(() => {
        const dist: Record<string, number> = {};
        submissions.forEach(s => {
            const status = (s.status || 'Unknown').toUpperCase();
            dist[status] = (dist[status] || 0) + 1;
        });

        return Object.entries(dist).map(([name, value]) => {
            let color = '#94a3b8';
            if (name.includes('SUBMITTED')) color = '#3b82f6';
            if (name.includes('INTERVIEWING')) color = '#a855f7';
            if (name.includes('PLACED')) color = '#10b981';
            if (name.includes('REJECTED')) color = '#ef4444';
            if (name.includes('OFFERED')) color = '#06b6d4';

            return { name, value, color };
        });
    }, [submissions]);

    const activityData = useMemo(() => {

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const last6: { month: string, value: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const mIdx = (currentMonth - i + 12) % 12;
            last6.push({ month: months[mIdx], value: 0 });
        }

        submissions.forEach(s => {
            const d = new Date(s.date || s.createdAt || '');
            const m = months[d.getMonth()];
            const item = last6.find(x => x.month === m);
            if (item) item.value++;
        });

        if (last6.every(x => x.value === 0)) {
            return [
                { month: 'Jan', value: 1 },
                { month: 'Feb', value: 2 },
                { month: 'Mar', value: 1 },
                { month: 'Apr', value: 3 },
                { month: 'May', value: 2 },
                { month: 'Jun', value: 4 },
            ];
        }

        return last6;
    }, [submissions]);

    const recentActivity = useMemo(() => {
        interface ActivityLog {
            type: string;
            text: string;
            time: string;
            icon: any;
            color: string;
        }
        const acts: ActivityLog[] = [];
        submissions.slice(0, 5).forEach(s => {
            acts.push({
                type: 'submission',
                text: `Submitted to ${s.client} for ${s.role}`,
                time: new Date(s.date || s.createdAt || '').toLocaleDateString(),
                icon: FileText,
                color: 'from-blue-500 to-cyan-500'
            });
        });
        timesheets.slice(0, 5).forEach(t => {
            acts.push({
                type: 'timesheet',
                text: `Timesheet ${t.hours}h submitted for period ${new Date(t.from).toLocaleDateString()}`,
                time: new Date(t.createdAt).toLocaleDateString(),
                icon: Clock,
                color: 'from-orange-500 to-amber-500'
            });
        });

        return acts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
    }, [submissions, timesheets]);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-slate-400 animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }} />
            </div>

            {}
            <div className="relative">
                <div className="relative flex items-center justify-between animate-slide-in">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />
                                <div className="relative p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-premium">
                                    <Activity className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-6xl font-bold text-gradient-premium mb-2">Candidate Portal</h1>
                                <p className="text-slate-400 text-base flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                    Manage your career journey and timesheets
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/30">
                                        Live
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
                {[
                    {
                        label: 'My Submissions',
                        value: stats.totalSubmissions,
                        change: stats.submissionGrowth,
                        gradient: 'from-blue-500 via-cyan-500 to-sky-500',
                        icon: FileText,
                        subtitle: 'In active pipeline',
                        trend: 'up'
                    },
                    {
                        label: 'Pending Timesheets',
                        value: stats.pendingTimesheets,
                        change: 0,
                        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
                        icon: Clock,
                        subtitle: 'Awaiting approval',
                        trend: 'neutral'
                    },
                    {
                        label: 'Active Placements',
                        value: stats.activePlacements,
                        change: stats.placementGrowth,
                        gradient: 'from-emerald-500 via-green-500 to-teal-500',
                        icon: Award,
                        subtitle: 'Current roles',
                        trend: 'up'
                    },
                    {
                        label: 'Total Earnings',
                        value: `$${stats.totalEarnings.toLocaleString()}`,
                        change: 12,
                        gradient: 'from-purple-500 via-violet-500 to-indigo-500',
                        icon: DollarSign,
                        subtitle: 'Year to date',
                        trend: 'up'
                    },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    const ChangeIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
                    return (
                        <div key={index} className="group relative glass rounded-3xl p-6 hover-lift card-shine overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500">
                            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                            <div className="relative">
                                <div className="flex items-start justify-between mb-5">
                                    <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-2xl transform group-hover:scale-110 transition-all duration-500 shadow-premium`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                        <ChangeIcon className="w-3 h-3" />
                                        {stat.change}%
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">{stat.label}</p>
                                    <p className="text-4xl font-bold premium-text mb-1 tracking-tight">{stat.value}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                        <Zap className="w-3 h-3 text-blue-400" />
                                        {stat.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {}
            <div className="grid grid-cols-3 gap-6">
                {}
                <div className="col-span-2 glass rounded-3xl p-8 animate-slide-in shadow-premium border border-white/10" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                Application Activity
                            </h2>
                            <p className="text-sm text-slate-400">Monthly submission volume</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '16px',
                                    color: '#fff'
                                }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {}
                <div className="space-y-6">
                    {}
                    <div className="glass rounded-3xl p-6 animate-slide-in shadow-premium border border-white/10" style={{ animationDelay: '250ms' }}>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                                    <PieChartIcon className="w-4 h-4 text-white" />
                                </div>
                                Pipeline Status
                            </h2>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
                            {statusDistribution.map((item, index) => (
                                <div key={index} className="flex items-center gap-1.5 text-slate-300 bg-white/5 px-2 py-1 rounded-lg">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.name} ({item.value})
                                </div>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="glass rounded-3xl p-6 animate-slide-in shadow-premium border border-white/10" style={{ animationDelay: '300ms' }}>
                        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-yellow-400" />
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            {recentActivity.length === 0 ? (
                                <p className="text-slate-500 text-sm">No recent activity.</p>
                            ) : (
                                recentActivity.map((activity, i) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div key={i} className="flex items-start gap-3 p-3 glass rounded-xl hover:bg-white/5 transition-all">
                                            <div className={`p-2 bg-gradient-to-br ${activity.color} rounded-lg flex-shrink-0`}>
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-slate-300 font-medium line-clamp-2">{activity.text}</p>
                                                <p className="text-[10px] text-slate-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

import { useState, useEffect } from 'react';
import { Users, FileText, Clock, Calendar, TrendingUp, Activity, Award, Zap, ArrowUp, ArrowDown, Sparkles, BarChart3, PieChart as PieChartIcon, CheckCircle } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import RecruiterService from '../../services/recruiter.service';

export function RecruiterDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeCandidates: 0,
        totalSubmissions: 0,
        activePlacements: 0,
        interviewing: 0,
        submissionGrowth: 12.5,
        candidateGrowth: 8.2,
        revenue: 0,
    });

    const [submissionStatusData, setSubmissionStatusData] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch core dashboard data
                const data = await RecruiterService.getDashboardStats();
                console.log(data);

                // Fetch detailed stats (for changes/growth)
                const detailedStats = await RecruiterService.getDashboardStatsDetails();

                // Fetch chart data
                const chartData = await RecruiterService.getDashboardCharts();

                // Fetch actual submissions to ensure consistent counting (Ownership-aware)
                const submissionsList = await RecruiterService.getSubmissions();

                if (data?.stats) {
                    setStats(prev => ({
                        ...prev,
                        activeCandidates: data.stats.activeCandidates || 0,
                        totalSubmissions: submissionsList.length, // Use actual count from list
                        activePlacements: data.stats.placements || 0,
                        interviewing: data.stats.clientInterviews || 0,
                    }));
                }

                // If detailed stats provide growth data, update it
                if (detailedStats?.stats) {
                    // Update growth percentages if provided by backend
                }

                if (submissionsList.length > 0) {
                    const activity = submissionsList.slice(0, 5).map((s: any) => ({
                        id: s._id,
                        type: 'submission',
                        text: `Submitted ${typeof s.candidate === 'object' ? s.candidate.name : s.candidate || 'Candidate'} to ${s.client || 'Client'}`,
                        time: new Date(s.submissionDate || s.date || s.createdAt || Date.now()).toLocaleDateString(),
                        icon: FileText,
                        color: 'from-blue-500 to-cyan-500',
                        status: s.status
                    }));
                    setRecentActivity(activity);
                } else if (data?.recentSubmissions) {
                    const activity = data.recentSubmissions.map((s: any) => ({
                        id: s.id || s._id,
                        type: 'submission',
                        text: `Submitted ${s.candidate?.name || s.candidate || 'Candidate'} to ${s.client || 'Client'}`,
                        time: new Date(s.date || s.createdAt || Date.now()).toLocaleDateString(),
                        icon: FileText,
                        color: 'from-blue-500 to-cyan-500',
                        status: s.status
                    }));
                    setRecentActivity(activity);
                }

                // Calculate status distribution from the actual submissions list
                if (submissionsList.length > 0) {
                    const distribution: Record<string, number> = {};
                    submissionsList.forEach((s: any) => {
                        const status = s.status || 'SUBMITTED';
                        distribution[status] = (distribution[status] || 0) + 1;
                    });

                    const pieData = Object.entries(distribution).map(([status, count]) => {
                        const key = status.toLowerCase();
                        let color = '#94a3b8';
                        if (key.includes('submitted')) color = '#3b82f6';
                        if (key.includes('interview')) color = '#a855f7';
                        if (key.includes('placed')) color = '#10b981';
                        if (key.includes('rejected')) color = '#ef4444';
                        if (key.includes('offered')) color = '#06b6d4';

                        return {
                            name: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
                            value: count,
                            color
                        };
                    });
                    setSubmissionStatusData(pieData);
                } else if (data?.statusDistribution) {
                    const pieData = data.statusDistribution.map((item: any) => {
                        const key = item.status.toLowerCase();
                        let color = '#94a3b8';
                        if (key.includes('submitted')) color = '#3b82f6';
                        if (key.includes('interview')) color = '#a855f7';
                        if (key.includes('placed')) color = '#10b981';
                        if (key.includes('rejected')) color = '#ef4444';
                        if (key.includes('offered')) color = '#06b6d4';

                        return {
                            name: item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase(),
                            value: item.count,
                            color
                        };
                    });
                    setSubmissionStatusData(pieData);
                }

                if (chartData?.revenueData) {
                    setRevenueData(chartData.revenueData);
                } else {
                    // Fallback to mock data if backend doesn't provide it yet
                    setRevenueData([
                        { month: 'Jan', value: 4000 },
                        { month: 'Feb', value: 3000 },
                        { month: 'Mar', value: 5000 },
                        { month: 'Apr', value: 4500 },
                        { month: 'May', value: 6000 },
                        { month: 'Jun', value: 7500 },
                    ]);
                }

            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-8 space-y-8">
            { }
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }} />
            </div>

            { }
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
                                <h1 className="text-6xl font-bold text-gradient-premium mb-2">Recruiter Portal</h1>
                                <p className="text-slate-400 text-base flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                    Your candidate pipeline overview
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/30">
                                        Live
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            { }
            <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
                {[
                    {
                        label: 'Total Submissions',
                        value: stats.totalSubmissions,
                        change: stats.submissionGrowth,
                        gradient: 'from-blue-500 via-cyan-500 to-sky-500',
                        icon: FileText,
                        subtitle: 'Total pipeline',
                        trend: 'up'
                    },
                    {
                        label: 'Active Candidates',
                        value: stats.activeCandidates,
                        change: stats.candidateGrowth,
                        gradient: 'from-purple-500 via-violet-500 to-indigo-500',
                        icon: Users,
                        subtitle: 'In pool',
                        trend: 'up'
                    },
                    {
                        label: 'Placements',
                        value: stats.activePlacements,
                        change: 12,
                        gradient: 'from-emerald-500 via-green-500 to-teal-500',
                        icon: Award,
                        subtitle: 'Successful hires',
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

            { }
            <div className="grid grid-cols-3 gap-6">
                { }
                <div className="col-span-2 glass rounded-3xl p-8 animate-slide-in shadow-premium border border-white/10" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                Submission Activity
                            </h2>
                            <p className="text-sm text-slate-400">Monthly submission volume (Mock Data)</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
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

                { }
                <div className="space-y-6">
                    { }
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
                                    data={submissionStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {submissionStatusData.map((entry, index) => (
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
                        <div className="mt-4 flex flex-wrap gap-2">
                            {submissionStatusData.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-2 py-1 rounded-lg">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.name} ({item.value})
                                </div>
                            ))}
                        </div>
                    </div>

                    { }
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
                                                <p className="text-sm text-slate-300 font-medium truncate">{activity.text}</p>
                                                <p className="text-xs text-slate-500">{activity.time}</p>
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

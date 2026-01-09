import { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, TrendingUp, Activity, Award, Zap, ArrowUp, ArrowDown, Calendar, Clock, Sparkles, BarChart3, PieChart as PieChartIcon, CheckCircle } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminService from '../../services/admin.service';

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueChange: 0,
    totalSubmissions: 0,
    submissionsChange: 0,
    activeCandidates: 0,
    candidatesChange: 0,
    avgPlacement: 0,
    placementChange: 0,
    activeRecruiters: 0,
    pendingApprovals: 0,
    upcomingInterviews: 0,
    monthlyGrowth: 0,
    avgMargin: 0,
    revenueForecast: 0,
  });

  const [animatedStats, setAnimatedStats] = useState({
    totalRevenue: 0,
    totalSubmissions: 0,
    activeCandidates: 0,
    avgPlacement: 0,
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [submissionStatusData, setSubmissionStatusData] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([
    { subject: 'Submissions', value: 0, target: 90, icon: FileText, color: '#3b82f6' },
    { subject: 'Placements', value: 0, target: 85, icon: CheckCircle, color: '#10b981' },
    { subject: 'Revenue', value: 0, target: 95, icon: DollarSign, color: '#8b5cf6' },
    { subject: 'Efficiency', value: 0, target: 85, icon: Zap, color: '#f59e0b' },
    { subject: 'Growth', value: 0, target: 80, icon: TrendingUp, color: '#ec4899' },
  ]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [peakMonth, setPeakMonth] = useState('...');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const periodMap: Record<string, string> = {
          '1M': '30days',
          '3M': '90days',
          '6M': '90days',
          '1Y': '1Y',
        };

        const period = periodMap[timeRange] || '30days';

        const [statsResponse, chartsResponse] = await Promise.all([
          AdminService.getDashboardStats({ period }),
          AdminService.getDashboardCharts({ period })
        ]);

        const data = statsResponse.stats;
        const charts = chartsResponse;

        setStats({
          totalRevenue: data.totalRevenue || 0,
          revenueChange: data.monthlyGrowth || 0,
          totalSubmissions: data.totalSubmissions || 0,
          submissionsChange: 8.4,
          activeCandidates: data.candidates || 0,
          candidatesChange: 5.2,
          avgPlacement: data.payoutCount ? (data.totalRevenue / data.payoutCount) : 0,
          placementChange: 3.1,
          activeRecruiters: data.recruiters || 0,
          pendingApprovals: data.pendingTimesheets || 0,
          upcomingInterviews: 0,
          monthlyGrowth: data.monthlyGrowth || 0,
          avgMargin: data.avgMargin || 0,
          revenueForecast: data.revenueForecast || 0,
        } as any);

        if (charts.revenueData) setRevenueData(charts.revenueData);
        if (charts.submissionStatus) setSubmissionStatusData(charts.submissionStatus);
        if (charts.peakMonth) setPeakMonth(charts.peakMonth);

        if (charts.topPerformers && charts.topPerformers.length > 0) {
          setTopPerformers(charts.topPerformers);
        } else {
          setTopPerformers([
            { name: 'Sarah Johnson', placements: 34, revenue: 125000, growth: 15.3, submissions: 45, interviews: 28, conversionRate: 75.5, score: 95 },
            { name: 'Michael Chen', placements: 28, revenue: 98000, growth: 12.8, submissions: 38, interviews: 22, conversionRate: 71.4, score: 88 },
            { name: 'Emily Davis', placements: 22, revenue: 87000, growth: 18.2, submissions: 30, interviews: 19, conversionRate: 73.3, score: 85 },
          ]);
        }

        if (data.recentActivities) {
          const mappedActivities = data.recentActivities.map((act: any, index: number) => ({
            id: act._id || index,
            type: 'submission',
            user: act.user?.name || 'Unknown',
            action: `submitted timesheet for ${act.hours} hours`,
            time: new Date(act.createdAt).toLocaleDateString(),
            icon: Clock,
            color: 'from-blue-500 to-cyan-500'
          }));
          setRecentActivities(mappedActivities);
        }

        setPerformanceMetrics([
          { subject: 'Submissions', value: 85, target: 90, icon: FileText, color: '#3b82f6' },
          { subject: 'Placements', value: 92, target: 85, icon: CheckCircle, color: '#10b981' },
          { subject: 'Revenue', value: 88, target: 95, icon: DollarSign, color: '#8b5cf6' },
          { subject: 'Efficiency', value: 90, target: 85, icon: Zap, color: '#f59e0b' },
          { subject: 'Growth', value: 78, target: 80, icon: TrendingUp, color: '#ec4899' },
        ]);

      } catch (err) {
        console.error("Failed to load dashboard stats", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  useEffect(() => {
    if (loading) return;

    const duration = 800;
    const steps = 40;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        totalRevenue: Math.floor(stats.totalRevenue * progress),
        totalSubmissions: Math.floor(stats.totalSubmissions * progress),
        activeCandidates: Math.floor(stats.activeCandidates * progress),
        avgPlacement: Math.floor(stats.avgPlacement * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          totalRevenue: stats.totalRevenue,
          totalSubmissions: stats.totalSubmissions,
          activeCandidates: stats.activeCandidates,
          avgPlacement: stats.avgPlacement,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats, loading]);

  return (
    <div className="p-8 space-y-8">
      { }
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {error && (
        <div className="relative z-50 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl animate-shake mb-6">
          {error}
          <button onClick={() => window.location.reload()} className="ml-4 underline">Retry</button>
        </div>
      )}

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
                <h1 className="text-6xl font-bold text-gradient-premium mb-2">Executive Dashboard</h1>
                <p className="text-slate-400 text-base flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Real-time business intelligence & performance analytics
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/30">
                    Live
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-6 py-3 glass rounded-2xl text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/10 appearance-none cursor-pointer border border-white/10"
            >
              <option value="1M">1 Month</option>
              <option value="3M">3 Months</option>
              <option value="6M">6 Months</option>
              <option value="1Y">1 Year</option>
            </select>
            <button className="group relative px-6 py-3 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 border border-white/10">
              <Calendar className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="text-slate-300 font-medium">Custom Range</span>
            </button>
          </div>
        </div>
      </div>

      { }
      <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          {
            label: 'Total Revenue',
            value: `$${(animatedStats.totalRevenue / 1000).toFixed(0)}K`,
            change: stats.revenueChange,
            gradient: 'from-emerald-500 via-green-500 to-teal-500',
            icon: DollarSign,
            subtitle: 'This month',
            trend: 'up'
          },
          {
            label: 'Submissions',
            value: animatedStats.totalSubmissions,
            change: stats.submissionsChange,
            gradient: 'from-blue-500 via-cyan-500 to-sky-500',
            icon: FileText,
            subtitle: 'Active pipeline',
            trend: 'up'
          },
          {
            label: 'Active Candidates',
            value: animatedStats.activeCandidates,
            change: stats.candidatesChange,
            gradient: 'from-purple-500 via-violet-500 to-indigo-500',
            icon: Users,
            subtitle: 'In process',
            trend: 'up'
          },
          {
            label: 'Avg Placement',
            value: `$${(animatedStats.avgPlacement / 1000).toFixed(1)}K`,
            change: stats.placementChange,
            gradient: 'from-orange-500 via-amber-500 to-yellow-500',
            icon: Award,
            subtitle: 'Per placement',
            trend: 'up'
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
          return (
            <div key={index} className="group relative glass rounded-3xl p-6 hover-lift card-shine overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500">
              { }
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

              { }
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.gradient} opacity-10`} />
              </div>

              <div className="relative">
                { }
                <div className="flex items-start justify-between mb-5">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className={`relative p-3 bg-gradient-to-br ${stat.gradient} rounded-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-premium`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${stat.trend === 'up'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                    <ChangeIcon className="w-3 h-3" />
                    {stat.change}%
                  </div>
                </div>

                { }
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold premium-text mb-1 tracking-tight">{stat.value}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-blue-400" />
                    {stat.subtitle}
                  </p>
                </div>

                { }
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-b-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            </div>
          );
        })}
      </div>

      { }
      <div className="grid grid-cols-3 gap-6">
        { }
        <div className="col-span-2 glass rounded-3xl p-8 animate-slide-in shadow-premium border border-white/10 hover:border-blue-500/30 transition-all duration-500" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                Revenue & Payout Analysis
              </h2>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                6-month performance overview with submission correlation
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                <span className="text-xs text-slate-400">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
                <span className="text-xs text-slate-400">Payout</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="payoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
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
                  backdropFilter: 'blur(20px)',
                  padding: '12px'
                }}
                labelStyle={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '8px' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="payout"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#payoutGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>

          { }
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="text-center p-4 glass rounded-xl hover:bg-white/5 transition-all">
              <p className="text-xs text-slate-500 mb-1">Monthly Growth</p>
              <p className="text-2xl font-bold text-emerald-400">+{stats.monthlyGrowth}%</p>
            </div>
            <div className="text-center p-4 glass rounded-xl hover:bg-white/5 transition-all">
              <p className="text-xs text-slate-500 mb-1">Peak Month</p>
              <p className="text-2xl font-bold text-slate-200">{peakMonth}</p>
            </div>
            <div className="text-center p-4 glass rounded-xl hover:bg-white/5 transition-all">
              <p className="text-xs text-slate-500 mb-1">Avg Margin</p>
              <p className="text-2xl font-bold text-purple-400">{stats.avgMargin}%</p>
            </div>
            <div className="text-center p-4 glass rounded-xl hover:bg-white/5 transition-all">
              <p className="text-xs text-slate-500 mb-1">Forecast</p>
              <p className="text-2xl font-bold text-blue-400">${(stats.revenueForecast / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>

        { }
        <div className="space-y-6">
          { }
          <div className="glass rounded-3xl p-6 animate-slide-in shadow-premium border border-white/10 hover:border-purple-500/30 transition-all duration-500" style={{ animationDelay: '250ms' }}>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <PieChartIcon className="w-4 h-4 text-white" />
                </div>
                Submission Pipeline
              </h2>
              <p className="text-xs text-slate-400">Current status distribution</p>
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
                  animationDuration={1500}
                >
                  {submissionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {submissionStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 glass rounded-xl hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          { }
          <div className="glass rounded-3xl p-6 animate-slide-in shadow-premium border border-white/10" style={{ animationDelay: '300ms' }}>
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-slate-300">Active Recruiters</span>
                </div>
                <span className="text-lg font-bold text-blue-400">{stats.activeRecruiters}</span>
              </div>
              <div className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex-shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-slate-300">Pending Approvals</span>
                </div>
                <span className="text-lg font-bold text-orange-400">{stats.pendingApprovals}</span>
              </div>
              <div className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-slate-300">Upcoming Interviews</span>
                </div>
                <span className="text-lg font-bold text-purple-400">{stats.upcomingInterviews}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      { }
      <div className="grid grid-cols-3 gap-6">
        { }
        <div className="glass rounded-3xl p-6 animate-slide-in shadow-premium border border-white/10 hover:border-emerald-500/30 transition-all duration-500" style={{ animationDelay: '350ms' }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Performance Matrix
            </h2>
            <p className="text-xs text-slate-400">Real-time KPI tracking</p>
          </div>
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon;
              const percentage = (metric.value / 100) * 100;
              const isAboveTarget = metric.value >= metric.target;
              return (
                <div key={index} className="group relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${metric.color}20` }}>
                        <Icon className="w-4 h-4" style={{ color: metric.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{metric.subject}</p>
                        <p className="text-xs text-slate-500">Target: {metric.target}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: metric.color }}>{metric.value}%</p>
                      <div className={`text-xs font-medium ${isAboveTarget ? 'text-green-400' : 'text-orange-400'}`}>
                        {isAboveTarget ? '✓ On Track' : '↑ Below Target'}
                      </div>
                    </div>
                  </div>
                  { }
                  <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${metric.color}40, ${metric.color})`
                      }}
                    />
                    { }
                    <div
                      className="absolute top-0 h-full w-0.5 bg-white/40"
                      style={{ left: `${metric.target}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          { }
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-center p-4 glass rounded-2xl">
              <p className="text-xs text-slate-400 mb-2">Overall Health Score</p>
              <div className="flex items-center justify-center gap-2">
                <div className="text-4xl font-black text-gradient-premium">
                  {Math.round(performanceMetrics.reduce((sum, m) => sum + m.value, 0) / performanceMetrics.length)}
                </div>
                <div className="text-slate-400">/100</div>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-semibold">Excellent Performance</span>
              </div>
            </div>
          </div>
        </div>

        { }
        <div className="glass rounded-3xl p-6 animate-slide-in shadow-premium border border-white/10 hover:border-yellow-500/30 transition-all duration-500" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Top Performers
              </h2>
              <p className="text-xs text-slate-400">This month's leaders</p>
            </div>
          </div>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div key={index} className="group relative p-4 glass rounded-2xl hover-lift transition-all overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${index === 0 ? 'from-yellow-500/10 to-orange-500/10' : 'from-blue-500/5 to-purple-500/5'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-white flex-shrink-0 ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                    index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700' :
                        'bg-gradient-to-br from-blue-500 to-purple-500'
                    }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-semibold text-sm truncate">{performer.name}</p>
                    <p className="text-xs text-slate-500">{performer.placements} placements</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-emerald-400 font-bold text-sm">${(performer.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-green-400 flex items-center gap-1 justify-end">
                      <ArrowUp className="w-3 h-3" />
                      {performer.growth}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        { }
        <div className="glass rounded-3xl p-6 animate-slide-in shadow-premium border border-white/10" style={{ animationDelay: '450ms' }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Recent Activity
            </h2>
            <p className="text-xs text-slate-400">Latest updates</p>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="group flex items-start gap-3 p-3 glass rounded-xl hover:bg-white/5 transition-all">
                  <div className={`p-2 bg-gradient-to-br ${activity.color} rounded-lg flex-shrink-0 transform group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-slate-200">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
import { Users, FileText, Calendar, CheckCircle, DollarSign, TrendingUp, Activity, ArrowUp, Sparkles, Zap, Target, Clock, ArrowRight, Plus, TrendingDown, Eye, BarChart3, PieChart, Download, Filter } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from 'recharts';

const metricsData = [
  { 
    icon: Users, 
    label: 'Total Team', 
    value: '247', 
    change: '+18%', 
    trend: 'up', 
    gradient: 'from-purple-500 via-purple-600 to-blue-600',
    bg: 'from-purple-500/20 to-blue-500/20',
    subtitle: 'Active members',
    sparkline: [45, 52, 48, 58, 53, 61, 65]
  },
  { 
    icon: FileText, 
    label: 'Submissions', 
    value: '1,429', 
    change: '+34%', 
    trend: 'up', 
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    bg: 'from-blue-500/20 to-cyan-500/20',
    subtitle: 'This month',
    sparkline: [35, 42, 38, 45, 52, 58, 62]
  },
  { 
    icon: DollarSign, 
    label: 'Revenue', 
    value: '$2.4M', 
    change: '+28%', 
    trend: 'up', 
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    bg: 'from-emerald-500/20 to-green-500/20',
    subtitle: 'Total earned',
    sparkline: [58, 62, 65, 68, 72, 78, 82]
  },
  { 
    icon: CheckCircle, 
    label: 'Completed', 
    value: '89', 
    change: '+12%', 
    trend: 'up', 
    gradient: 'from-pink-500 via-rose-500 to-orange-500',
    bg: 'from-pink-500/20 to-rose-500/20',
    subtitle: 'Tasks finished',
    sparkline: [25, 28, 32, 35, 38, 42, 45]
  },
];

const chartData = [
  { month: 'Jan', revenue: 125000, submissions: 142, completed: 89 },
  { month: 'Feb', revenue: 145000, submissions: 168, completed: 102 },
  { month: 'Mar', revenue: 132000, submissions: 156, completed: 95 },
  { month: 'Apr', revenue: 168000, submissions: 189, completed: 118 },
  { month: 'May', revenue: 195000, submissions: 215, completed: 142 },
  { month: 'Jun', revenue: 240000, submissions: 268, completed: 165 },
];

const performanceData = [
  { name: 'Excellent', value: 35, color: '#10b981' },
  { name: 'Great', value: 28, color: '#3b82f6' },
  { name: 'Good', value: 22, color: '#8b5cf6' },
  { name: 'Average', value: 15, color: '#f59e0b' },
];

const topPerformers = [
  { name: 'Sarah Johnson', role: 'Lead Recruiter', revenue: '$145K', performance: 98, avatar: 'SJ', trend: '+24%' },
  { name: 'Michael Chen', role: 'Senior Consultant', revenue: '$132K', performance: 96, avatar: 'MC', trend: '+18%' },
  { name: 'Emily Davis', role: 'Admin Manager', revenue: '$128K', performance: 94, avatar: 'ED', trend: '+15%' },
  { name: 'James Wilson', role: 'Consultant', revenue: '$118K', performance: 92, avatar: 'JW', trend: '+12%' },
];

const recentActivities = [
  { icon: FileText, action: 'New submission', detail: 'John Doe - Senior Developer', time: '2m ago', color: 'purple' },
  { icon: CheckCircle, action: 'Timesheet approved', detail: 'Sarah Johnson - Week 49', time: '8m ago', color: 'green' },
  { icon: Calendar, action: 'PTO request', detail: 'Michael Chen - Dec 20-24', time: '15m ago', color: 'blue' },
  { icon: Users, action: 'New user added', detail: 'Emma Thompson - Recruiter', time: '1h ago', color: 'pink' },
  { icon: DollarSign, action: 'Payment processed', detail: '$45,000 consultant payout', time: '2h ago', color: 'emerald' },
];

const quickActions = [
  { label: 'Add User', icon: Plus, gradient: 'from-purple-500 to-blue-500', action: 'users' },
  { label: 'New Submission', icon: FileText, gradient: 'from-blue-500 to-cyan-500', action: 'submissions' },
  { label: 'Timesheets', icon: Clock, gradient: 'from-cyan-500 to-teal-500', action: 'timesheets' },
  { label: 'PTO', icon: Calendar, gradient: 'from-pink-500 to-rose-500', action: 'pto' },
  { label: 'Payouts', icon: DollarSign, gradient: 'from-emerald-500 to-green-500', action: 'salaries' },
  { label: 'Documents', icon: FileText, gradient: 'from-orange-500 to-amber-500', action: 'documents' },
];

export function Overview() {
  return (
    <div className="p-8 space-y-6 relative">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="animate-slide-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-glow-purple">
                  <Sparkles className="w-6 h-6 text-white animate-glow" />
                </div>
                <div>
                  <h1 className="text-5xl bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                    Welcome Back, Admin
                  </h1>
                  <p className="text-slate-400 text-lg mt-1">Here's what's happening with your recruitment operations today</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 animate-slide-in" style={{ animationDelay: '100ms' }}>
              <button className="px-6 py-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group">
                <Download className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                <span className="text-slate-300">Export</span>
              </button>
              <button className="px-6 py-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group">
                <Filter className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                <span className="text-slate-300">Filters</span>
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl hover:shadow-glow-purple transition-all duration-300 flex items-center gap-2 text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Zap className="w-5 h-5 relative z-10" />
                <span className="relative z-10">AI Insights</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Floating Cards */}
      <div className="grid grid-cols-6 gap-3 animate-slide-in" style={{ animationDelay: '150ms' }}>
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="relative p-4 glass rounded-2xl hover-lift group overflow-hidden card-shine"
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="relative z-10 flex flex-col items-center text-center gap-3">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${action.gradient} shadow-glow-purple`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-slate-200">{action.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Metrics - Large Impact Cards */}
      <div className="grid grid-cols-4 gap-6">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="relative glass rounded-3xl p-6 hover-lift card-shine group overflow-hidden animate-slide-in"
              style={{ animationDelay: `${300 + index * 75}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.bg} opacity-50`} />
              
              {/* Floating Icon Background */}
              <div className="absolute -right-8 -top-8 w-32 h-32 opacity-10">
                <Icon className="w-full h-full text-white" />
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${metric.gradient} shadow-glow-purple mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Label */}
                <p className="text-sm text-slate-400 mb-2">{metric.label}</p>
                
                {/* Value */}
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-5xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {metric.value}
                  </h3>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                    metric.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm">{metric.change}</span>
                  </div>
                </div>

                {/* Subtitle */}
                <p className="text-xs text-slate-500 mb-4">{metric.subtitle}</p>

                {/* Mini Sparkline */}
                <div className="flex items-end gap-1 h-12">
                  {metric.sparkline.map((value, i) => (
                    <div
                      key={i}
                      className={`flex-1 bg-gradient-to-t ${metric.gradient} rounded-t opacity-60 hover:opacity-100 transition-all cursor-pointer`}
                      style={{ height: `${(value / Math.max(...metric.sparkline)) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Chart - Large */}
        <div className="col-span-2 glass rounded-3xl p-6 animate-slide-in hover-lift card-shine" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-slate-100 mb-1">Revenue Overview</h2>
              <p className="text-sm text-slate-400">Monthly performance tracking</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 glass rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all">1W</button>
              <button className="px-4 py-2 glass rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all">1M</button>
              <button className="px-4 py-2 bg-purple-500/20 rounded-lg text-xs text-purple-400 border border-purple-500/30">6M</button>
              <button className="px-4 py-2 glass rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all">1Y</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(20px)',
                  padding: '12px'
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="submissions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSubmissions)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Distribution */}
        <div className="glass rounded-3xl p-6 animate-slide-in hover-lift card-shine" style={{ animationDelay: '550ms' }}>
          <div className="mb-6">
            <h2 className="text-2xl text-slate-100 mb-1">Team Performance</h2>
            <p className="text-sm text-slate-400">Distribution by rating</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)'
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-300">{item.name}</span>
                </div>
                <span className="text-sm text-slate-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="col-span-2 glass rounded-3xl p-6 animate-slide-in hover-lift card-shine" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-glow-purple">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl text-slate-100">Top Performers</h2>
                <p className="text-sm text-slate-400">This quarter's leaders</p>
              </div>
            </div>
            <button className="px-4 py-2 glass rounded-xl hover:bg-white/10 transition-all text-sm text-slate-300 flex items-center gap-2 group">
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-glow-purple text-lg">
                      {performer.avatar}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs border-2 border-slate-900">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg text-slate-100">{performer.name}</h3>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
                        {performer.performance}%
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{performer.role}</p>
                  </div>
                  
                  {/* Performance */}
                  <div className="text-right">
                    <p className="text-2xl text-slate-100 mb-1">{performer.revenue}</p>
                    <div className="flex items-center gap-1 text-green-400 justify-end">
                      <ArrowUp className="w-3 h-3" />
                      <span className="text-xs">{performer.trend}</span>
                    </div>
                  </div>

                  {/* View Button */}
                  <button className="p-3 glass rounded-xl hover:bg-purple-500/10 transition-all group-hover:scale-110 duration-300">
                    <Eye className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="glass rounded-3xl p-6 animate-slide-in hover-lift card-shine" style={{ animationDelay: '650ms' }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <Activity className="w-5 h-5 text-white animate-glow" />
            </div>
            <div>
              <h2 className="text-xl text-slate-100">Live Activity</h2>
              <p className="text-xs text-slate-400">Real-time updates</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex gap-3 group animate-slide-in" style={{ animationDelay: `${700 + index * 50}ms` }}>
                  <div className={`p-2 rounded-lg bg-${activity.color}-500/20 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-4 h-4 text-${activity.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200 mb-1">{activity.action}</p>
                    <p className="text-xs text-slate-400 mb-1">{activity.detail}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-4 py-3 glass rounded-xl hover:bg-white/10 transition-all text-sm text-slate-300 flex items-center justify-center gap-2 group">
            <span>View All Activity</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

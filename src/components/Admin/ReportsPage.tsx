import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Target, Calendar, Sparkles, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 145000, payout: 98000 },
  { month: 'Feb', revenue: 168000, payout: 112000 },
  { month: 'Mar', revenue: 192000, payout: 128000 },
  { month: 'Apr', revenue: 178000, payout: 119000 },
  { month: 'May', revenue: 205000, payout: 137000 },
  { month: 'Jun', revenue: 220000, payout: 147000 },
];

const funnelData = [
  { stage: 'Submissions', count: 1429 },
  { stage: 'Interviews', count: 486 },
  { stage: 'Offers', count: 142 },
  { stage: 'Placements', count: 89 },
];

const recruiterPerformance = [
  { name: 'Sarah Johnson', submissions: 245, interviews: 89, placements: 34, revenue: 125000, payout: 45000 },
  { name: 'Michael Chen', submissions: 198, interviews: 72, placements: 28, revenue: 98000, payout: 38000 },
  { name: 'Emily Davis', submissions: 176, interviews: 64, placements: 22, revenue: 87000, payout: 32000 },
  { name: 'James Wilson', submissions: 156, interviews: 58, placements: 19, revenue: 72000, payout: 28000 },
];

export function ReportsPage() {
  const [period, setPeriod] = useState('6months');

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalPayout = revenueData.reduce((sum, d) => sum + d.payout, 0);
  const margin = totalRevenue - totalPayout;
  const marginPercent = ((margin / totalRevenue) * 100).toFixed(1);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        
        <div className="relative flex items-center justify-between animate-slide-in">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl shadow-glow-purple animate-pulse-glow">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-5xl text-gradient-premium">Reports & Analytics</h1>
                <p className="text-slate-400 mt-1 text-sm">Comprehensive business intelligence and metrics</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-6 py-4 glass rounded-2xl text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all hover:bg-white/10 appearance-none cursor-pointer"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="6months">Last 6 Months</option>
              <option value="year">This Year</option>
            </select>

            <button className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3">
              <Download className="w-5 h-5 text-slate-400 group-hover:text-orange-400 transition-colors" />
              <span className="text-slate-300 font-medium">Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, gradient: 'from-green-500 to-emerald-500', icon: DollarSign, change: '+12.5%' },
          { label: 'Total Payouts', value: `$${(totalPayout / 1000).toFixed(0)}K`, gradient: 'from-orange-500 to-amber-500', icon: TrendingUp, change: '+8.3%' },
          { label: 'Margin', value: `$${(margin / 1000).toFixed(0)}K`, gradient: 'from-purple-500 to-pink-500', icon: Sparkles, change: `${marginPercent}%` },
          { label: 'Placements', value: funnelData[3].count, gradient: 'from-blue-500 to-cyan-500', icon: Target, change: '+18.2%' },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${metric.gradient} rounded-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">{metric.change}</span>
                </div>
                <p className="text-sm text-slate-400 mb-1">{metric.label}</p>
                <p className="text-3xl premium-text font-bold">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue vs Payout Chart */}
      <div className="glass rounded-3xl p-8 animate-slide-in shadow-premium" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-slate-100 mb-1">Revenue vs Payout Trend</h2>
            <p className="text-sm text-slate-400">Monthly comparison over the selected period</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="payoutGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)'
              }}
            />
            <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="payout" fill="url(#payoutGradient)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Funnel Chart & Recruiter Performance */}
      <div className="grid grid-cols-2 gap-6">
        {/* Funnel */}
        <div className="glass rounded-3xl p-8 animate-slide-in shadow-premium" style={{ animationDelay: '300ms' }}>
          <div className="mb-6">
            <h2 className="text-2xl text-slate-100 mb-1">Conversion Funnel</h2>
            <p className="text-sm text-slate-400">Submissions to placements pipeline</p>
          </div>
          <div className="space-y-4">
            {funnelData.map((item, index) => {
              const percent = ((item.count / funnelData[0].count) * 100).toFixed(0);
              const colors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-orange-500 to-amber-500', 'from-green-500 to-emerald-500'];
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">{item.stage}</span>
                    <span className="text-slate-400 text-sm">{item.count} ({percent}%)</span>
                  </div>
                  <div className="h-12 relative overflow-hidden rounded-xl bg-white/5">
                    <div 
                      className={`h-full bg-gradient-to-r ${colors[index]} transition-all duration-1000`}
                      style={{ width: `${percent}%` }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{item.count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="glass rounded-3xl p-8 animate-slide-in shadow-premium" style={{ animationDelay: '350ms' }}>
          <div className="mb-6">
            <h2 className="text-2xl text-slate-100 mb-1">Top Performers</h2>
            <p className="text-sm text-slate-400">By revenue generated</p>
          </div>
          <div className="space-y-4">
            {recruiterPerformance.slice(0, 4).map((recruiter, index) => (
              <div key={index} className="flex items-center justify-between p-4 glass rounded-xl hover-lift">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium">{recruiter.name}</p>
                    <p className="text-xs text-slate-500">{recruiter.placements} placements</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">${(recruiter.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-slate-500">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recruiter Performance Table */}
      <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in" style={{ animationDelay: '400ms' }}>
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl text-slate-100 mb-1">Recruiter Performance Breakdown</h2>
          <p className="text-sm text-slate-400">Detailed metrics by recruiter</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark">
              <tr>
                <th className="px-8 py-4 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Recruiter</th>
                <th className="px-8 py-4 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Submissions</th>
                <th className="px-8 py-4 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Interviews</th>
                <th className="px-8 py-4 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Placements</th>
                <th className="px-8 py-4 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Revenue</th>
                <th className="px-8 py-4 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Payout</th>
                <th className="px-8 py-4 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recruiterPerformance.map((recruiter, index) => {
                const conversion = ((recruiter.placements / recruiter.submissions) * 100).toFixed(1);
                return (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-glow-purple">
                          {recruiter.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-slate-200 font-medium">{recruiter.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">{recruiter.submissions}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">{recruiter.interviews}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">{recruiter.placements}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-green-400 font-semibold">${(recruiter.revenue / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-orange-400 font-semibold">${(recruiter.payout / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-slate-200 font-semibold">{conversion}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

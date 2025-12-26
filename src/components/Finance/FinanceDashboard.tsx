import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, FileText, CreditCard, Users, ArrowRight, 
  TrendingUp, AlertCircle, Calendar, Building2, TrendingDown,
  ArrowUpRight, ArrowDownRight, Activity, Zap, Target,
  Clock, CheckCircle, XCircle, Send, Wallet, PieChart,
  BarChart3, Receipt
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const revenueData = [
  { month: 'Jul', revenue: 380000, expenses: 240000 },
  { month: 'Aug', revenue: 420000, expenses: 260000 },
  { month: 'Sep', revenue: 450000, expenses: 280000 },
  { month: 'Oct', revenue: 478000, expenses: 298000 },
  { month: 'Nov', revenue: 512000, expenses: 315000 },
  { month: 'Dec', revenue: 485000, expenses: 305000 },
];

const invoiceStatusData = [
  { name: 'Paid', value: 145, color: '#10b981' },
  { name: 'Sent', value: 28, color: '#3b82f6' },
  { name: 'Overdue', value: 12, color: '#ef4444' },
  { name: 'Draft', value: 8, color: '#64748b' },
];

const topClients = [
  { name: 'TechCorp Solutions', revenue: 485000, growth: 12, trend: 'up' },
  { name: 'Enterprise Systems Inc', revenue: 456000, growth: 8, trend: 'up' },
  { name: 'Global Innovations Ltd', revenue: 412000, growth: -3, trend: 'down' },
  { name: 'Digital Ventures Co', revenue: 389000, growth: 15, trend: 'up' },
];

const recentActivity = [
  { type: 'payment', client: 'TechCorp Solutions', amount: 125000, time: '2 hours ago', status: 'completed' },
  { type: 'invoice', client: 'Global Innovations', amount: 98000, time: '5 hours ago', status: 'sent' },
  { type: 'payment', client: 'Enterprise Systems', amount: 156000, time: '1 day ago', status: 'completed' },
  { type: 'invoice', client: 'Digital Ventures', amount: 89000, time: '2 days ago', status: 'draft' },
];

export function FinanceDashboard() {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCompact = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="space-y-6">
      {/* Hero Stats Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 border border-purple-500/20">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 animate-gradient" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white">Finance Overview</h1>
                  <p className="text-sm text-purple-200 font-semibold">Real-time financial insights</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <div className="text-xs text-purple-200 font-bold uppercase tracking-wider mb-1">Current Period</div>
              <div className="text-sm text-white font-black">December 2024</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 backdrop-blur-xl rounded-lg border border-emerald-500/30">
                  <TrendingUp className="w-3 h-3 text-emerald-300" strokeWidth={2.5} />
                  <span className="text-xs font-black text-emerald-300">+12.5%</span>
                </div>
              </div>
              <div className="text-xs font-bold text-purple-200 uppercase tracking-wider mb-2">Total Revenue</div>
              <div className="text-3xl font-black text-white mb-1">$2.4M</div>
              <div className="text-xs text-purple-200 font-semibold">Last 6 months</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 backdrop-blur-xl rounded-lg border border-blue-500/30">
                  <TrendingUp className="w-3 h-3 text-blue-300" strokeWidth={2.5} />
                  <span className="text-xs font-black text-blue-300">+8.2%</span>
                </div>
              </div>
              <div className="text-xs font-bold text-purple-200 uppercase tracking-wider mb-2">Cash Collected</div>
              <div className="text-3xl font-black text-white mb-1">$2.2M</div>
              <div className="text-xs text-purple-200 font-semibold">92% collection rate</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 backdrop-blur-xl rounded-lg border border-orange-500/30">
                  <TrendingDown className="w-3 h-3 text-orange-300" strokeWidth={2.5} />
                  <span className="text-xs font-black text-orange-300">-5.3%</span>
                </div>
              </div>
              <div className="text-xs font-bold text-purple-200 uppercase tracking-wider mb-2">Outstanding</div>
              <div className="text-3xl font-black text-white mb-1">$82K</div>
              <div className="text-xs text-purple-200 font-semibold">12 pending invoices</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 backdrop-blur-xl rounded-lg border border-purple-500/30">
                  <TrendingUp className="w-3 h-3 text-purple-300" strokeWidth={2.5} />
                  <span className="text-xs font-black text-purple-300">+10.1%</span>
                </div>
              </div>
              <div className="text-xs font-bold text-purple-200 uppercase tracking-wider mb-2">Profit Margin</div>
              <div className="text-3xl font-black text-white mb-1">38.5%</div>
              <div className="text-xs text-purple-200 font-semibold">Above target (35%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Revenue vs Expenses</h3>
              <p className="text-sm text-slate-600 font-semibold">Last 6 months performance</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full" />
                <span className="text-xs font-bold text-slate-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full" />
                <span className="text-xs font-bold text-slate-600">Expenses</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px', fontWeight: '600' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px', fontWeight: '600' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontWeight: '600'
                }} 
              />
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#revenueGradient)" />
              <Area type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#expensesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Invoice Status Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 mb-1">Invoice Status</h3>
            <p className="text-sm text-slate-600 font-semibold">Current distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={invoiceStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {invoiceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {invoiceStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-bold text-slate-700">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Clients & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Top Clients</h3>
              <p className="text-sm text-slate-600 font-semibold">By revenue this quarter</p>
            </div>
            <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {topClients.map((client, index) => (
              <div key={index} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-sm">{client.name}</div>
                      <div className="text-xs text-slate-500 font-semibold">{formatCurrency(client.revenue)}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    client.trend === 'up' ? 'bg-emerald-100' : 'bg-red-100'
                  }`}>
                    {client.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-600" strokeWidth={2.5} />
                    )}
                    <span className={`text-xs font-black ${
                      client.trend === 'up' ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      {Math.abs(client.growth)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((client.revenue / 500000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Recent Activity</h3>
              <p className="text-sm text-slate-600 font-semibold">Latest transactions</p>
            </div>
            <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'payment' 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {activity.type === 'payment' ? (
                    <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                  ) : (
                    <Send className="w-5 h-5 text-white" strokeWidth={2.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-slate-900 text-sm truncate">{activity.client}</span>
                    <span className="font-black text-slate-900 text-sm flex-shrink-0 ml-2">
                      {formatCompact(activity.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">
                      {activity.type === 'payment' ? 'Payment received' : 'Invoice sent'}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Cards - Bento Grid Style */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/admin/finance/revenue-ledger')}
          className="lg:col-span-2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-8 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <BarChart3 className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <ArrowRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Revenue Ledger</h3>
            <p className="text-white/80 font-semibold leading-relaxed mb-6">View monthly summaries, client breakdowns, and KPIs</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
                <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Total Billed</div>
                <div className="text-2xl font-black text-white">$2.4M</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
                <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Outstanding</div>
                <div className="text-2xl font-black text-white">$82K</div>
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/finance/invoices')}
          className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-8 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-all duration-300">
                <Receipt className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Invoices</h3>
            <p className="text-white/80 font-semibold text-sm leading-relaxed mb-4">Create and manage client invoices</p>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
              <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">This Month</div>
              <div className="text-2xl font-black text-white">156</div>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/finance/payments')}
          className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-all duration-300">
                <CreditCard className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Payments</h3>
            <p className="text-white/80 font-semibold text-sm leading-relaxed mb-4">Track and record client payments</p>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
              <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">This Month</div>
              <div className="text-2xl font-black text-white">$1.8M</div>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/finance/client-billing-profiles')}
          className="lg:col-span-2 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-8 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Building2 className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <ArrowRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Client Billing Profiles</h3>
            <p className="text-white/80 font-semibold leading-relaxed mb-6">Manage client information and payment terms</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
                <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Active Clients</div>
                <div className="text-2xl font-black text-white">24</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
                <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Profiles</div>
                <div className="text-2xl font-black text-white">24</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl p-8 border border-slate-700 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-1">Quick Actions</h3>
                <p className="text-xs text-slate-400 font-semibold">Streamline your workflow</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/admin/finance/invoices');
                }}
                className="p-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 text-center group"
              >
                <FileText className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <div className="text-xs font-bold text-white">New Invoice</div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/admin/finance/payments');
                }}
                className="p-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 text-center group"
              >
                <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <div className="text-xs font-bold text-white">Record Payment</div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/admin/finance/client-billing-profiles');
                }}
                className="p-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 text-center group"
              >
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <div className="text-xs font-bold text-white">Add Client</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { 
  TrendingUp, DollarSign, Calendar, Filter, Download, Eye, 
  ArrowUp, ArrowDown, BarChart3, Users, Briefcase, ChevronDown,
  Search, X, Activity, Target, Zap, Sparkles, Award, TrendingDown,
  Clock, CheckCircle, Layers, PieChart
} from 'lucide-react';

interface RevenueEntry {
  month: string;
  consultant: string;
  client: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  billRate: number;
  grossRevenue: number;
  consultantCost: number;
  netProfit: number;
  margin: number;
}

const mockData: RevenueEntry[] = [
  { month: '2024-12', consultant: 'John Doe', client: 'TechCorp', regularHours: 160, overtimeHours: 20, totalHours: 180, billRate: 85, grossRevenue: 15300, consultantCost: 9000, netProfit: 6300, margin: 41.2 },
  { month: '2024-12', consultant: 'Jane Smith', client: 'DataInc', regularHours: 160, overtimeHours: 15, totalHours: 175, billRate: 95, grossRevenue: 16625, consultantCost: 9500, netProfit: 7125, margin: 42.9 },
  { month: '2024-11', consultant: 'John Doe', client: 'TechCorp', regularHours: 160, overtimeHours: 10, totalHours: 170, billRate: 85, grossRevenue: 14450, consultantCost: 8500, netProfit: 5950, margin: 41.2 },
  { month: '2024-11', consultant: 'Bob Wilson', client: 'CloudSys', regularHours: 150, overtimeHours: 25, totalHours: 175, billRate: 105, grossRevenue: 18375, consultantCost: 10500, netProfit: 7875, margin: 42.9 },
  { month: '2024-10', consultant: 'Jane Smith', client: 'DataInc', regularHours: 160, overtimeHours: 12, totalHours: 172, billRate: 95, grossRevenue: 16340, consultantCost: 9200, netProfit: 7140, margin: 43.7 },
  { month: '2024-10', consultant: 'Alice Brown', client: 'FinTech', regularHours: 160, overtimeHours: 8, totalHours: 168, billRate: 90, grossRevenue: 15120, consultantCost: 8800, netProfit: 6320, margin: 41.8 },
  { month: '2024-09', consultant: 'Bob Wilson', client: 'CloudSys', regularHours: 155, overtimeHours: 18, totalHours: 173, billRate: 105, grossRevenue: 18165, consultantCost: 10200, netProfit: 7965, margin: 43.8 },
];

export function RevenueLedger() {
  const [fromMonth, setFromMonth] = useState('2024-08');
  const [toMonth, setToMonth] = useState('2024-12');
  const [selectedConsultant, setSelectedConsultant] = useState('all');
  const [selectedClient, setSelectedClient] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const consultants = Array.from(new Set(mockData.map(d => d.consultant)));
  const clients = Array.from(new Set(mockData.map(d => d.client)));

  const filteredData = mockData.filter(entry => {
    const matchesConsultant = selectedConsultant === 'all' || entry.consultant === selectedConsultant;
    const matchesClient = selectedClient === 'all' || entry.client === selectedClient;
    const matchesSearch = 
      entry.consultant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesConsultant && matchesClient && matchesSearch;
  });

  const stats = {
    totalRevenue: filteredData.reduce((sum, entry) => sum + entry.grossRevenue, 0),
    totalCost: filteredData.reduce((sum, entry) => sum + entry.consultantCost, 0),
    netProfit: filteredData.reduce((sum, entry) => sum + entry.netProfit, 0),
    avgMargin: filteredData.reduce((sum, entry, _, arr) => sum + entry.margin / arr.length, 0),
    totalHours: filteredData.reduce((sum, entry) => sum + entry.totalHours, 0),
    activeConsultants: new Set(filteredData.map(d => d.consultant)).size,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 45) return 'text-emerald-400';
    if (margin >= 35) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMarginBg = (margin: number) => {
    if (margin >= 45) return 'from-emerald-500 to-green-500';
    if (margin >= 35) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Ultra-Premium Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-8 border border-emerald-500/20">
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 animate-gradient" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-2xl animate-ping" style={{ animationDuration: '3s' }} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-pulse">
                <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent rounded-2xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white mb-1 tracking-tight">Revenue Ledger</h1>
                <p className="text-emerald-200 font-semibold text-sm">Comprehensive profitability analysis & revenue tracking</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="group relative px-6 py-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-300" />
                  <span className="text-white font-bold">Export Report</span>
                </div>
              </button>
            </div>
          </div>

          {/* Ultra Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: 'Total Revenue', 
                value: formatCurrency(stats.totalRevenue), 
                icon: DollarSign,
                gradient: 'from-emerald-500 to-green-500',
                change: '+12.5%',
                changeUp: true,
                bgGlow: 'emerald'
              },
              { 
                label: 'Net Profit', 
                value: formatCurrency(stats.netProfit), 
                icon: TrendingUp,
                gradient: 'from-green-500 to-teal-500',
                change: '+18.3%',
                changeUp: true,
                bgGlow: 'green'
              },
              { 
                label: 'Avg Margin', 
                value: `${stats.avgMargin.toFixed(1)}%`, 
                icon: Target,
                gradient: 'from-teal-500 to-cyan-500',
                change: '+2.1%',
                changeUp: true,
                bgGlow: 'teal'
              },
              { 
                label: 'Active Consultants', 
                value: stats.activeConsultants, 
                icon: Users,
                gradient: 'from-purple-500 to-pink-500',
                change: '6 active',
                changeUp: true,
                bgGlow: 'purple'
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg shadow-${stat.bgGlow}-500/50 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-lg border ${
                        stat.changeUp ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'
                      }`}>
                        {stat.changeUp ? (
                          <ArrowUp className="w-3 h-3 text-emerald-300" strokeWidth={2.5} />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-red-300" strokeWidth={2.5} />
                        )}
                        <span className={`text-xs font-black ${stat.changeUp ? 'text-emerald-300' : 'text-red-300'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-2">{stat.label}</div>
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 border border-white/10 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5" />
        
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search consultant or client..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all hover:bg-white/10 font-medium"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`group relative px-5 py-3.5 rounded-xl border transition-all duration-300 ${
                showFilters 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30 shadow-lg shadow-emerald-500/20' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Filter className={`w-5 h-5 ${showFilters ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className={`font-bold ${showFilters ? 'text-emerald-400' : 'text-slate-300'}`}>Advanced Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180 text-emerald-400' : 'text-slate-400'}`} />
              </div>
            </button>

            <button className="group relative px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-500/30">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white font-black">Apply Filters</span>
              </div>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/10 animate-slideDown">
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  From Month
                </label>
                <input
                  type="month"
                  value={fromMonth}
                  onChange={(e) => setFromMonth(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all hover:bg-white/10 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  To Month
                </label>
                <input
                  type="month"
                  value={toMonth}
                  onChange={(e) => setToMonth(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all hover:bg-white/10 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  Consultant
                </label>
                <select
                  value={selectedConsultant}
                  onChange={(e) => setSelectedConsultant(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all hover:bg-white/10 font-medium"
                >
                  <option value="all">All Consultants</option>
                  {consultants.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  Client
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all hover:bg-white/10 font-medium"
                >
                  <option value="all">All Clients</option>
                  {clients.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Data Table */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5" />
        
        <div className="relative overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-300 uppercase tracking-wider">
                    <Calendar className="w-4 h-4" />
                    Month
                  </div>
                </th>
                <th className="text-left px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-300 uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    Consultant
                  </div>
                </th>
                <th className="text-left px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-300 uppercase tracking-wider">
                    <Briefcase className="w-4 h-4" />
                    Client
                  </div>
                </th>
                <th className="text-right px-6 py-4">
                  <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Hours</div>
                </th>
                <th className="text-right px-6 py-4">
                  <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Rate</div>
                </th>
                <th className="text-right px-6 py-4">
                  <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Revenue</div>
                </th>
                <th className="text-right px-6 py-4">
                  <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Cost</div>
                </th>
                <th className="text-right px-6 py-4">
                  <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Profit</div>
                </th>
                <th className="text-right px-6 py-4">
                  <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Margin</div>
                </th>
                <th className="text-center px-6 py-4">
                  <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((entry, index) => (
                <tr key={index} className="group hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-bold text-white">{entry.month}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg">
                        {entry.consultant.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-bold text-white">{entry.consultant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-300">{entry.client}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-base font-black text-purple-400">{entry.totalHours}h</span>
                      <span className="text-xs text-slate-500 font-medium">{entry.regularHours}r + {entry.overtimeHours}ot</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-sm font-bold text-cyan-400">{entry.billRate}/hr</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-base font-black text-emerald-400">{formatCurrency(entry.grossRevenue)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-base font-black text-orange-400">{formatCurrency(entry.consultantCost)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-base font-black text-green-400">{formatCurrency(entry.netProfit)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="relative w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getMarginBg(entry.margin)} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(entry.margin, 100)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-black ${getMarginColor(entry.margin)} min-w-[3rem] text-right`}>
                        {entry.margin.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button className="p-2.5 bg-white/5 hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-teal-500/20 border border-white/10 hover:border-emerald-500/30 rounded-lg transition-all duration-300 group/btn">
                        <Eye className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-400 transition-colors" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10">
              <tr>
                <td colSpan={5} className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-base font-black text-white uppercase tracking-wider">TOTAL</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-xl font-black text-emerald-400">{formatCurrency(stats.totalRevenue)}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-xl font-black text-orange-400">{formatCurrency(stats.totalCost)}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-xl font-black text-green-400">{formatCurrency(stats.netProfit)}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-xl font-black text-white">{stats.avgMargin.toFixed(1)}%</span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  TrendingUp, DollarSign, Calendar, Filter, Download, Eye,
  ArrowUp, ArrowDown, Users, Briefcase, ChevronDown,
  Search, X, Target, Zap, Award, Loader2, Briefcase as BriefcaseIcon
} from 'lucide-react';
import FinanceService from '../../services/finance.service';
import type { RevenueData } from '../../services/finance.service';

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

export function RevenueLedger() {
  const [fromMonth, setFromMonth] = useState('2024-08');
  const [toMonth, setToMonth] = useState('2030-12');
  const [selectedConsultant, setSelectedConsultant] = useState('all');
  const [selectedClient, setSelectedClient] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RevenueEntry[]>([]);
  const [ledgerStats, setLedgerStats] = useState<RevenueData | null>(null);

  useEffect(() => {
    fetchData();
  }, [fromMonth, toMonth]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [snapshots, report] = await Promise.all([
        FinanceService.getPayrollSnapshots({ fromMonth, toMonth }),
        FinanceService.getRevenueLedger(fromMonth, toMonth)
      ]);

      setLedgerStats(report);

      const mappedEntries: RevenueEntry[] = snapshots.map((s: any) => {
        const grossRevenue = s.approvedHours * s.clientBillRate;
        const consultantCost = s.finalPay;
        const netProfit = grossRevenue - consultantCost;
        const margin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

        return {
          month: s.month,
          consultant: s.userId?.name || 'Unknown',
          client: s.userId?.customFields?.client || 'Internal',
          regularHours: s.approvedHours,
          overtimeHours: 0,
          totalHours: s.approvedHours,
          billRate: s.clientBillRate,
          grossRevenue,
          consultantCost,
          netProfit,
          margin
        };
      });

      setData(mappedEntries);
    } catch (err: any) {
      console.error('Error fetching revenue data:', err);
      setError('Failed to load revenue data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const consultants = Array.from(new Set(data.map(d => d.consultant)));
  const clients = Array.from(new Set(data.map(d => d.client)));

  const filteredData = data.filter(entry => {
    const matchesConsultant = selectedConsultant === 'all' || entry.consultant === selectedConsultant;
    const matchesClient = selectedClient === 'all' || entry.client === selectedClient;
    const matchesSearch =
      entry.consultant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesConsultant && matchesClient && matchesSearch;
  });

  const stats = {
    totalRevenue: ledgerStats?.totals.totalRevenue || filteredData.reduce((sum, entry) => sum + entry.grossRevenue, 0),
    totalCost: ledgerStats?.totals.totalPayout || filteredData.reduce((sum, entry) => sum + entry.consultantCost, 0),
    netProfit: ledgerStats?.totals.totalMargin || filteredData.reduce((sum, entry) => sum + entry.netProfit, 0),
    avgMargin: filteredData.length > 0 ? filteredData.reduce((sum, entry) => sum + entry.margin, 0) / filteredData.length : 0,
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-emerald-200 font-black tracking-widest uppercase text-sm">Synchronizing Ledger...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl rounded-3xl p-12 text-center">
        <X className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Synchronization Error</h3>
        <p className="text-red-200 font-semibold mb-8 max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchData}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-900/40"
        >
          RETRY SYNC
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-8 border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white mb-1 tracking-tight">Revenue Ledger</h1>
                <p className="text-emerald-200 font-semibold text-sm">Comprehensive profitability analysis & revenue tracking</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/20 transition-all font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-300" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, gradient: 'from-emerald-500 to-green-500' },
              { label: 'Net Profit', value: formatCurrency(stats.netProfit), icon: TrendingUp, gradient: 'from-green-500 to-teal-500' },
              { label: 'Avg Margin', value: `${stats.avgMargin.toFixed(1)}%`, icon: Target, gradient: 'from-teal-500 to-cyan-500' },
              { label: 'Active Consultants', value: stats.activeConsultants, icon: Users, gradient: 'from-purple-500 to-pink-500' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-2">{stat.label}</div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 border border-white/10 backdrop-blur-xl">
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search consultant or client..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3.5 rounded-xl border transition-all ${showFilters ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-2">
                <Filter className={`w-5 h-5 ${showFilters ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className={`font-bold ${showFilters ? 'text-emerald-400' : 'text-slate-300'}`}>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180 text-emerald-400' : 'text-slate-400'}`} />
              </div>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/10 animate-slideDown">
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-2 uppercase">From Month</label>
                <input type="month" value={fromMonth} onChange={(e) => setFromMonth(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-2 uppercase">To Month</label>
                <input type="month" value={toMonth} onChange={(e) => setToMonth(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-2 uppercase">Consultant</label>
                <select value={selectedConsultant} onChange={(e) => setSelectedConsultant(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium">
                  <option value="all">All Consultants</option>
                  {consultants.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-2 uppercase">Client</label>
                <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium">
                  <option value="all">All Clients</option>
                  {clients.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="relative overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs font-black text-emerald-300 uppercase">
                <th className="text-left px-6 py-4">Month</th>
                <th className="text-left px-6 py-4">Consultant</th>
                <th className="text-left px-6 py-4">Client</th>
                <th className="text-right px-6 py-4">Hours</th>
                <th className="text-right px-6 py-4">Rate</th>
                <th className="text-right px-6 py-4">Revenue</th>
                <th className="text-right px-6 py-4">Cost</th>
                <th className="text-right px-6 py-4">Profit</th>
                <th className="text-right px-6 py-4">Margin</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((entry, index) => (
                <tr key={index} className="hover:bg-white/5 transition-all">
                  <td className="px-6 py-4 text-sm font-bold text-white">{entry.month}</td>
                  <td className="px-6 py-4 font-bold text-white">{entry.consultant}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-300">{entry.client}</td>
                  <td className="px-6 py-4 text-right font-black text-purple-400">{entry.totalHours}h</td>
                  <td className="px-6 py-4 text-right font-bold text-cyan-400">${entry.billRate}/hr</td>
                  <td className="px-6 py-4 text-right font-black text-emerald-400">{formatCurrency(entry.grossRevenue)}</td>
                  <td className="px-6 py-4 text-right font-black text-orange-400">{formatCurrency(entry.consultantCost)}</td>
                  <td className="px-6 py-4 text-right font-black text-green-400">{formatCurrency(entry.netProfit)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-black ${getMarginColor(entry.margin)}`}>{entry.margin.toFixed(1)}%</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg"><Eye className="w-4 h-4 text-slate-400" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot className="bg-white/5 font-black text-white uppercase text-base border-t border-white/10">
                <tr>
                  <td colSpan={5} className="px-6 py-5">TOTAL</td>
                  <td className="px-6 py-5 text-right text-emerald-400">{formatCurrency(stats.totalRevenue)}</td>
                  <td className="px-6 py-5 text-right text-orange-400">{formatCurrency(stats.totalCost)}</td>
                  <td className="px-6 py-5 text-right text-green-400">{formatCurrency(stats.netProfit)}</td>
                  <td className="px-6 py-5 text-right">{stats.avgMargin.toFixed(1)}%</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

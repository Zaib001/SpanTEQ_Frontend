import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, ArrowRight,
  Building2,
  Activity, Zap, Target,
  Clock, Send, Wallet, CreditCard,
  BarChart3, Receipt, Loader2, FileText
} from 'lucide-react';
import { AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import FinanceService from '../../services/finance.service';
import type { RevenueData } from '../../services/finance.service';

const invoiceStatusData = [
  { name: 'Paid', value: 145, color: '#10b981' },
  { name: 'Sent', value: 28, color: '#3b82f6' },
  { name: 'Overdue', value: 12, color: '#ef4444' },
  { name: 'Draft', value: 8, color: '#64748b' },
];

export function FinanceDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [totals, setTotals] = useState<RevenueData['totals'] | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await FinanceService.getRevenueLedger('2024-01', '2024-12');
      setTotals(data.totals);
      setRevenueData(data.monthly.map(m => ({
        month: m.month,
        revenue: m.revenue,
        expenses: m.salaryPayout + m.vendorPayouts
      })));
    } catch (err) {
      console.error('Error fetching finance dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCompact = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-purple-200 font-bold">Assembling Financial Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 border border-purple-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-black text-white">Finance Overview</h1>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-white">
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-300">Reporting Period</div>
              <div className="text-sm font-black">Fiscal Year 2024</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg"><DollarSign className="w-6 h-6 text-white" /></div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded-lg border border-emerald-500/30 text-[10px] font-black text-emerald-300">LIVE</div>
              </div>
              <div className="text-xs font-bold text-purple-200 uppercase mb-2 text-[10px]">Total Revenue</div>
              <div className="text-3xl font-black text-white mb-1">{formatCompact(totals?.totalRevenue || 0)}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"><Wallet className="w-6 h-6 text-white" /></div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 rounded-lg border border-blue-500/30 text-[10px] font-black text-blue-300">REAL-TIME</div>
              </div>
              <div className="text-xs font-bold text-purple-200 uppercase mb-2 text-[10px]">Total Payouts</div>
              <div className="text-3xl font-black text-white mb-1">{formatCompact(totals?.totalPayout || 0)}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg"><Clock className="w-6 h-6 text-white" /></div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 rounded-lg border border-orange-500/30 text-[10px] font-black text-orange-300">-5.2%</div>
              </div>
              <div className="text-xs font-bold text-purple-200 uppercase mb-2 text-[10px]">Net Profit</div>
              <div className="text-3xl font-black text-white mb-1">{formatCompact(totals?.totalMargin || 0)}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"><Target className="w-6 h-6 text-white" /></div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 rounded-lg border border-purple-500/30 text-[10px] font-black text-purple-300">35.0% TARGET</div>
              </div>
              <div className="text-xs font-bold text-purple-200 uppercase mb-2 text-[10px]">Profit Margin</div>
              <div className="text-3xl font-black text-white mb-1">
                {totals && totals.totalRevenue > 0 ? ((totals.totalMargin / totals.totalRevenue) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Revenue vs Expenses</h3>
              <p className="text-sm text-slate-600 font-semibold italic">Syncing based on monthly payroll snapshots</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3} /><stop offset="95%" stopColor="#f97316" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#revenueGradient)" />
              <Area type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#expensesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-4 uppercase text-[12px] tracking-widest text-slate-500">Invoice Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie data={invoiceStatusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {invoiceStatusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {invoiceStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-[11px] font-black uppercase">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</div>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { title: 'Revenue Ledger', desc: 'Financial summaries & breakdowns', icon: BarChart3, path: '/admin/finance/revenue-ledger', gradient: 'from-emerald-500 to-teal-500' },
          { title: 'Invoices', desc: 'Create and track client billing', icon: Receipt, path: '/admin/finance/invoices', gradient: 'from-purple-500 to-pink-500' },
          { title: 'Payments', desc: 'Record and track transactions', icon: CreditCard, path: '/admin/finance/payments', gradient: 'from-blue-500 to-cyan-500' },
          { title: 'Client Profiles', desc: 'Manage billing information', icon: Building2, path: '/admin/finance/client-billing-profiles', gradient: 'from-orange-500 to-amber-500' }
        ].map((mod, i) => (
          <div key={i} onClick={() => navigate(mod.path)} className={`bg-gradient-to-br ${mod.gradient} p-8 rounded-2xl cursor-pointer hover:scale-105 transition-all shadow-lg text-white group relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
            <mod.icon className="w-10 h-10 mb-6 group-hover:rotate-6 transition-transform" />
            <h3 className="text-2xl font-black mb-2">{mod.title}</h3>
            <p className="text-white/80 text-sm font-semibold">{mod.desc}</p>
            <ArrowRight className="absolute bottom-6 right-6 w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        ))}

        <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-black text-white uppercase tracking-widest text-[14px]">Administrative Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Generate Monthly Report', icon: FileText, path: '/admin/finance/revenue-ledger', color: 'text-purple-400' },
              { label: 'New Client Invoice', icon: Send, path: '/admin/finance/invoices', color: 'text-blue-400' },
              { label: 'Process Payroll', icon: DollarSign, path: '/admin/admin-salaries', color: 'text-emerald-400' },
              { label: 'System Audit', icon: Target, path: '/admin/finance/payments', color: 'text-orange-400' }
            ].map((action, i) => (
              <button key={i} onClick={() => navigate(action.path)} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-center">
                <action.icon className={`w-8 h-8 mx-auto mb-4 ${action.color}`} />
                <div className="text-xs font-black text-white uppercase">{action.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

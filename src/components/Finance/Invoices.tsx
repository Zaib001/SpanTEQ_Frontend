import { useState, useEffect } from 'react';
import {
  Search, Filter, Download, Send, DollarSign, FileText,
  Eye, Calendar, ChevronLeft, ChevronRight,
  Clock, CheckCircle, AlertCircle, Plus, TrendingUp, XCircle, ChevronDown,
  Mail, Loader2, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FinanceService from '../../services/finance.service';

type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'VOID';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  period: string;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  sentAt: string | null;
  amountReceived: number;
  outstanding: number;
}

const statusConfig = {
  DRAFT: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30', icon: FileText, gradient: 'from-slate-500 to-gray-500' },
  SENT: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: Send, gradient: 'from-blue-500 to-cyan-500' },
  PARTIALLY_PAID: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: AlertCircle, gradient: 'from-yellow-500 to-orange-500' },
  PAID: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
  OVERDUE: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: AlertCircle, gradient: 'from-red-500 to-rose-500' },
  VOID: { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30', icon: XCircle, gradient: 'from-gray-500 to-slate-500' },
};

export function Invoices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const submissions = await FinanceService.getSubmissions();

      const mapped: Invoice[] = submissions.map((s: any) => {
        const isPaid = s.status === 'Joined & Paid' || s.status === 'Joined';
        const status: InvoiceStatus = isPaid ? 'PAID' : (s.status === 'Draft' ? 'DRAFT' : 'SENT');
        const amount = 5000;

        return {
          id: s._id,
          invoiceNumber: `INV-${s._id.slice(-6).toUpperCase()}`,
          client: s.client || 'Unknown Client',
          period: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          total: amount,
          status: status,
          dueDate: new Date(new Date(s.createdAt).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          sentAt: s.createdAt,
          amountReceived: isPaid ? amount : 0,
          outstanding: isPaid ? 0 : amount
        };
      });

      setInvoices(mapped);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoice records.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: filteredInvoices.reduce((sum, inv) => sum + inv.total, 0),
    paid: filteredInvoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.total, 0),
    outstanding: filteredInvoices.reduce((sum, inv) => sum + inv.outstanding, 0),
    overdue: filteredInvoices.filter(inv => inv.status === 'OVERDUE').reduce((sum, inv) => sum + inv.outstanding, 0),
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-blue-200 font-bold">Fetching Invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-12 text-center backdrop-blur-xl">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-white mb-2">Sync Error</h3>
        <p className="text-red-200 mb-6">{error}</p>
        <button onClick={fetchInvoices} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 border border-blue-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 text-white">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-1">Invoices</h1>
                <p className="text-blue-200 font-semibold text-sm">Syncing invoices from approved submissions</p>
              </div>
            </div>

            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:shadow-xl transition-all font-black">
              <Plus className="w-5 h-5 inline mr-2" />
              Create Invoice
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
            {[
              { label: 'Total Billed', value: formatCurrency(stats.total), icon: DollarSign, gradient: 'from-blue-500 to-cyan-500' },
              { label: 'Amount Paid', value: formatCurrency(stats.paid), icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
              { label: 'Outstanding', value: formatCurrency(stats.outstanding), icon: Clock, gradient: 'from-orange-500 to-amber-500' },
              { label: 'Overdue Amount', value: formatCurrency(stats.overdue), icon: AlertCircle, gradient: 'from-red-500 to-rose-500' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-xs text-blue-200 font-bold uppercase mb-2">{stat.label}</div>
                <div className="text-3xl font-black">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID or client..."
              className="w-full pl-12 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-3.5 rounded-xl border flex items-center gap-2 transition-all ${showFilters ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-slate-300'}`}
          >
            <Filter className="w-5 h-5" />
            <span className="font-bold">Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-white/10 mt-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Statuses</option>
              {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {paginatedInvoices.map((invoice) => {
          const config = statusConfig[invoice.status];
          return (
            <div key={invoice.id} className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 p-6 flex items-center justify-between hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-5 flex-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black text-white">{invoice.invoiceNumber}</h3>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${config.bg} ${config.color} ${config.border}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400 font-medium font-semibold">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{invoice.client}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{invoice.period}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Due: {invoice.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Amount</div>
                  <span className="text-2xl font-black text-blue-400">{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/admin/finance/invoices/${invoice.id}`)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                    <Eye className="w-5 h-5 text-slate-400" />
                  </button>
                  <button className="p-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-900/40">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-6 bg-slate-900/50 border border-white/10 rounded-2xl">
          <div className="text-slate-400 text-sm font-semibold">Page {currentPage} of {totalPages}</div>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50"><ChevronLeft className="w-5 h-5 text-white" /></button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50"><ChevronRight className="w-5 h-5 text-white" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

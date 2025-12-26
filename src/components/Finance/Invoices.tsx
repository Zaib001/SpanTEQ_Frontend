import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Download, Send, DollarSign, FileText, 
  Eye, Calendar, ChevronLeft, ChevronRight,
  Clock, CheckCircle, AlertCircle, Plus, TrendingUp, XCircle, ChevronDown,
  Zap, Mail, Sparkles, BarChart3, Target, ArrowUp, Users, Briefcase
} from 'lucide-react';

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

const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-001', client: 'TechCorp Solutions', period: 'Dec 2024', total: 125000, status: 'OVERDUE', dueDate: '2024-12-15', sentAt: '2024-11-30', amountReceived: 0, outstanding: 125000 },
  { id: '2', invoiceNumber: 'INV-2024-002', client: 'Global Innovations Ltd', period: 'Dec 2024', total: 98000, status: 'SENT', dueDate: '2024-12-30', sentAt: '2024-12-15', amountReceived: 0, outstanding: 98000 },
  { id: '3', invoiceNumber: 'INV-2024-003', client: 'Enterprise Systems Inc', period: 'Dec 2024', total: 156000, status: 'PARTIALLY_PAID', dueDate: '2025-01-05', sentAt: '2024-12-20', amountReceived: 50000, outstanding: 106000 },
  { id: '4', invoiceNumber: 'INV-2024-004', client: 'Digital Ventures Co', period: 'Nov 2024', total: 106000, status: 'PAID', dueDate: '2024-11-30', sentAt: '2024-11-15', amountReceived: 106000, outstanding: 0 },
  { id: '5', invoiceNumber: 'INV-2024-005', client: 'Innovation Labs', period: 'Dec 2024', total: 89000, status: 'DRAFT', dueDate: '2025-01-10', sentAt: null, amountReceived: 0, outstanding: 89000 },
  { id: '6', invoiceNumber: 'INV-2024-006', client: 'Tech Dynamics', period: 'Nov 2024', total: 112000, status: 'PAID', dueDate: '2024-11-28', sentAt: '2024-11-10', amountReceived: 112000, outstanding: 0 },
  { id: '7', invoiceNumber: 'INV-2024-007', client: 'Future Systems', period: 'Dec 2024', total: 145000, status: 'SENT', dueDate: '2025-01-15', sentAt: '2024-12-18', amountReceived: 0, outstanding: 145000 },
  { id: '8', invoiceNumber: 'INV-2024-008', client: 'Cloud Solutions Inc', period: 'Nov 2024', total: 78000, status: 'OVERDUE', dueDate: '2024-11-25', sentAt: '2024-11-10', amountReceived: 0, outstanding: 78000 },
];

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
  const itemsPerPage = 10;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredInvoices = mockInvoices.filter(invoice => {
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
    total: mockInvoices.reduce((sum, inv) => sum + inv.total, 0),
    paid: mockInvoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.total, 0),
    outstanding: mockInvoices.reduce((sum, inv) => sum + inv.outstanding, 0),
    overdue: mockInvoices.filter(inv => inv.status === 'OVERDUE').reduce((sum, inv) => sum + inv.outstanding, 0),
    totalInvoices: mockInvoices.length,
    draftCount: mockInvoices.filter(inv => inv.status === 'DRAFT').length,
  };

  return (
    <div className="space-y-6">
      {/* Ultra-Premium Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 border border-blue-500/20">
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 animate-gradient" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-2xl animate-ping" style={{ animationDuration: '3s' }} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-pulse">
                <FileText className="w-8 h-8 text-white" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent rounded-2xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white mb-1 tracking-tight">Invoices</h1>
                <p className="text-blue-200 font-semibold text-sm">Generate, send, and track all client invoices</p>
              </div>
            </div>
            
            <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-blue-500/30">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                <span className="text-white font-black">Create Invoice</span>
              </div>
            </button>
          </div>

          {/* Ultra Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: 'Total Billed', 
                value: formatCurrency(stats.total), 
                icon: DollarSign,
                gradient: 'from-blue-500 to-cyan-500',
                change: '+8.2%',
                bgGlow: 'blue'
              },
              { 
                label: 'Amount Paid', 
                value: formatCurrency(stats.paid), 
                icon: CheckCircle,
                gradient: 'from-green-500 to-emerald-500',
                change: '+12.5%',
                bgGlow: 'green'
              },
              { 
                label: 'Outstanding', 
                value: formatCurrency(stats.outstanding), 
                icon: Clock,
                gradient: 'from-orange-500 to-amber-500',
                change: '+5.3%',
                bgGlow: 'orange'
              },
              { 
                label: 'Overdue Amount', 
                value: formatCurrency(stats.overdue), 
                icon: AlertCircle,
                gradient: 'from-red-500 to-rose-500',
                change: '-3.1%',
                bgGlow: 'red'
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
                      <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                        <TrendingUp className="w-3 h-3 text-blue-300" strokeWidth={2.5} />
                        <span className="text-xs font-black text-blue-300">{stat.change}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-2">{stat.label}</div>
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advanced Search & Filters */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 border border-white/10 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
        
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by invoice number or client..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/10 font-medium"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`group relative px-5 py-3.5 rounded-xl border transition-all duration-300 ${
                showFilters 
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 shadow-lg shadow-blue-500/20' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Filter className={`w-5 h-5 ${showFilters ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className={`font-bold ${showFilters ? 'text-blue-400' : 'text-slate-300'}`}>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180 text-blue-400' : 'text-slate-400'}`} />
              </div>
            </button>

            <button className="group relative px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-slate-300 font-bold group-hover:text-blue-400 transition-colors">Export</span>
              </div>
            </button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-white/10 animate-slideDown">
              <label className="block text-xs font-bold text-blue-300 mb-2 uppercase tracking-wider">Filter by Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/10 font-medium"
              >
                <option value="all">All Statuses</option>
                {Object.keys(statusConfig).map(status => (
                  <option key={status} value={status}>{status.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Premium Invoice Cards Grid */}
      <div className="space-y-4">
        {paginatedInvoices.map((invoice) => {
          const config = statusConfig[invoice.status];
          const Icon = config.icon;
          
          return (
            <div key={invoice.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 border border-white/10 backdrop-blur-xl hover:border-blue-500/30 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-5 flex-1">
                  <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg shadow-${config.gradient.split('-')[1]}-500/50 group-hover:scale-110 transition-transform duration-300`}>
                    <FileText className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-white">{invoice.invoiceNumber}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border ${config.bg} ${config.color} ${config.border}`}>
                        <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                        {invoice.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-medium">{invoice.client}</span>
                      </div>
                      <span className="text-slate-600">•</span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{invoice.period}</span>
                      </div>
                      <span className="text-slate-600">•</span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Due: {invoice.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Total Amount</div>
                    <div className="text-3xl font-black text-blue-400">{formatCurrency(invoice.total)}</div>
                    {invoice.status === 'PARTIALLY_PAID' && (
                      <div className="mt-2">
                        <div className="text-xs text-slate-500 font-medium mb-1">Outstanding</div>
                        <div className="text-lg font-bold text-orange-400">{formatCurrency(invoice.outstanding)}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/finance/invoices/${invoice.id}`)}
                      className="p-3 bg-white/5 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 border border-white/10 hover:border-blue-500/30 rounded-xl transition-all duration-300 group/btn"
                    >
                      <Eye className="w-5 h-5 text-slate-400 group-hover/btn:text-blue-400 transition-colors" />
                    </button>
                    
                    {invoice.status === 'DRAFT' && (
                      <button className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 group/btn">
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4 text-white" />
                          <span className="text-sm text-white font-black">Send</span>
                        </div>
                      </button>
                    )}
                    
                    {invoice.status === 'OVERDUE' && (
                      <button className="px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/30 group/btn">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-white" />
                          <span className="text-sm text-white font-black">Remind</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Progress for Partial */}
              {invoice.status === 'PARTIALLY_PAID' && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Payment Progress</span>
                    <span className="text-xs font-black text-slate-300">
                      {formatCurrency(invoice.amountReceived)} / {formatCurrency(invoice.total)}
                    </span>
                  </div>
                  <div className="relative w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500 shadow-lg shadow-orange-500/50"
                      style={{ width: `${(invoice.amountReceived / invoice.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Premium Pagination */}
      {totalPages > 1 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 border border-white/10 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
          
          <div className="relative flex items-center justify-between">
            <p className="text-sm text-slate-400 font-medium">
              Showing <span className="text-white font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-white font-bold">{Math.min(currentPage * itemsPerPage, filteredInvoices.length)}</span> of <span className="text-white font-bold">{filteredInvoices.length}</span> invoices
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-all font-bold ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

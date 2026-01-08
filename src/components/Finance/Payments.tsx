import { useState, useEffect } from 'react';
import {
  Search, Download, Calendar, DollarSign, CreditCard,
  FileText, CheckCircle, Building2, ChevronLeft, ChevronRight,
  Loader2, AlertCircle
} from 'lucide-react';
import FinanceService from '../../services/finance.service';
import type { Payout } from '../../services/finance.service';

interface Payment {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  receivedDate: string;
  method: string;
  referenceNumber: string;
  notes: string;
  status: string;
}

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, [currentPage, selectedStatus]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinanceService.getPayouts({
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        page: currentPage,
        limit: itemsPerPage
      });

      const mapped: Payment[] = response.payouts.map((p: Payout) => ({
        id: p._id,
        invoiceNumber: `PAY-${p._id.slice(-6).toUpperCase()}`,
        client: p.user?.name || 'Unknown Payee',
        amount: p.totalAmount,
        receivedDate: p.processedAt || p.createdAt,
        method: p.paymentMethod || 'ACH',
        referenceNumber: p.paymentReference || 'N/A',
        notes: `Pay period: ${new Date(p.payPeriod.from).toLocaleDateString()} - ${new Date(p.payPeriod.to).toLocaleDateString()}`,
        status: p.status
      }));

      setPayments(mapped);
      setTotalCount(response.total);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment records.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'ACH': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Wire': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Check': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === 'all' || payment.receivedDate.startsWith(selectedMonth);
    return matchesSearch && matchesMonth;
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <p className="text-slate-600 font-bold">Synchronizing Payment Records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-red-900 mb-2">Sync Error</h3>
        <p className="text-red-700 font-semibold mb-6">{error}</p>
        <button onClick={fetchPayments} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
          Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, payee, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none font-semibold transition-all"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none font-semibold transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: totalCount, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500', color: 'text-slate-900' },
          { label: 'Total Amount', value: formatCurrency(totalAmount), icon: DollarSign, gradient: 'from-blue-500 to-cyan-500', color: 'text-emerald-600' },
          { label: 'This Page', value: formatCurrency(filteredPayments.reduce((s, p) => s + p.amount, 0)), icon: CreditCard, gradient: 'from-purple-500 to-pink-500', color: 'text-purple-600' },
          { label: 'Unique Payees', value: new Set(filteredPayments.map(p => p.client)).size, icon: Building2, gradient: 'from-orange-500 to-amber-500', color: 'text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</div>
            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Payment Records</h2>
            <p className="text-sm text-slate-600 font-semibold mt-1">Showing sync of employee and vendor payouts</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-4">Ref #</th>
                <th className="px-6 py-4">Payee</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <FileText className="w-4 h-4 text-purple-600" />
                      {payment.invoiceNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-bold">{payment.client}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-emerald-600 text-lg">{formatCurrency(payment.amount)}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(payment.receivedDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase border ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-black uppercase">
                    <span className={`px-2 py-1 rounded border ${getMethodColor(payment.method)}`}>
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{payment.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="text-sm font-semibold text-slate-600">Page {currentPage} of {totalPages}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 transition-all font-bold"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 transition-all font-bold"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

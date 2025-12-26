import { useState } from 'react';
import { 
  Search, Download, Calendar, DollarSign, CreditCard, 
  FileText, CheckCircle, Building2, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Payment {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  receivedDate: string;
  method: string;
  referenceNumber: string;
  notes: string;
}

const mockPayments: Payment[] = [
  { 
    id: '1', 
    invoiceNumber: 'INV-2024-004', 
    client: 'Digital Ventures Co', 
    amount: 106000, 
    receivedDate: '2024-11-28', 
    method: 'ACH', 
    referenceNumber: 'ACH-2024-1128-001', 
    notes: 'Full payment received on time' 
  },
  { 
    id: '2', 
    invoiceNumber: 'INV-2024-006', 
    client: 'Tech Dynamics', 
    amount: 112000, 
    receivedDate: '2024-11-30', 
    method: 'Wire', 
    referenceNumber: 'WIRE-20241130', 
    notes: 'Wire transfer completed' 
  },
  { 
    id: '3', 
    invoiceNumber: 'INV-2024-003', 
    client: 'Enterprise Systems Inc', 
    amount: 50000, 
    receivedDate: '2024-12-05', 
    method: 'ACH', 
    referenceNumber: 'ACH-2024-1205-002', 
    notes: 'Partial payment (50%)' 
  },
  { 
    id: '4', 
    invoiceNumber: 'INV-2024-002', 
    client: 'Global Innovations Ltd', 
    amount: 98000, 
    receivedDate: '2024-12-10', 
    method: 'Check', 
    referenceNumber: 'CHK-5489', 
    notes: 'Check cleared successfully' 
  },
  { 
    id: '5', 
    invoiceNumber: 'INV-2024-007', 
    client: 'Future Systems', 
    amount: 72500, 
    receivedDate: '2024-12-12', 
    method: 'ACH', 
    referenceNumber: 'ACH-2024-1212-003', 
    notes: 'Partial payment received' 
  },
];

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === 'all' || payment.receivedDate.startsWith(selectedMonth);
    const matchesMethod = selectedMethod === 'all' || payment.method === selectedMethod;
    return matchesSearch && matchesMonth && matchesMethod;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search by invoice #, client, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 font-semibold"
            >
              <option value="all">All Months</option>
              <option value="2024-12">Dec 2024</option>
              <option value="2024-11">Nov 2024</option>
              <option value="2024-10">Oct 2024</option>
            </select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Payment Method
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 font-semibold"
            >
              <option value="all">All Methods</option>
              <option value="ACH">ACH Transfer</option>
              <option value="Wire">Wire Transfer</option>
              <option value="Check">Check</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300 flex items-center gap-2">
            <Download className="w-4 h-4" strokeWidth={2.5} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Payments</div>
          <div className="text-3xl font-black text-slate-900">{filteredPayments.length}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Amount</div>
          <div className="text-3xl font-black text-emerald-600">{formatCurrency(totalAmount)}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">This Month</div>
          <div className="text-3xl font-black text-purple-600">
            {formatCurrency(mockPayments.filter(p => p.receivedDate.startsWith('2024-12')).reduce((sum, p) => sum + p.amount, 0))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unique Clients</div>
          <div className="text-3xl font-black text-orange-600">
            {new Set(filteredPayments.map(p => p.client)).size}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-black text-slate-900">Payment Records</h2>
          <p className="text-sm text-slate-600 font-semibold mt-1">
            Showing {paginatedPayments.length} of {filteredPayments.length} payments
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-right text-xs font-black text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Received Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                      <span className="font-bold text-slate-900">{payment.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{payment.client}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-emerald-600 text-lg">{formatCurrency(payment.amount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                      <span className="text-sm font-semibold text-slate-600">{formatDate(payment.receivedDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase border ${getMethodColor(payment.method)}`}>
                      <CreditCard className="w-3.5 h-3.5" strokeWidth={2.5} />
                      {payment.method}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-600">{payment.referenceNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{payment.notes}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

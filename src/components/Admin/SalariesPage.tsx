import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign, Search, Filter, Download, X, Eye, User,
  Calendar, TrendingUp, Wallet, Users, CheckCircle, Clock, Award, CreditCard, Percent, ChevronDown,
  AlertCircle, Building, History
} from 'lucide-react';
import { toast } from 'sonner';
import SalaryService from '../../services/salary.service';
import type { Salary } from '../../services/salary.service';

interface SalaryData {
  id: string;
  employee: string;
  role: 'Recruiter' | 'Candidate' | 'Admin';
  department: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  payPeriod: string;
  paymentDate: string;
  status: 'pending' | 'processed' | 'paid';
  bankAccount: string;
  position: string;
  snapshot?: Salary;
}

const statusColors: Record<string, { bg: string, text: string, border: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  processed: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  paid: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
};

const roleColors: Record<string, { bg: string, text: string, border: string }> = {
  recruiter: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  candidate: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  admin: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  Recruiter: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  Candidate: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  Admin: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
};

export function SalariesPage() {
  const [salaries, setSalaries] = useState<SalaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryData | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const [filters, setFilters] = useState({
    employee: 'all',
    role: 'all',
    department: 'all',
    status: 'all',
  });

  const fetchSalaries = useCallback(async () => {
    try {
      setLoading(true);
      // Primary source: Payroll Snapshots
      const { data } = await SalaryService.getSnapshots();

      let mappedData: SalaryData[] = [];

      if (data && data.length > 0) {
        mappedData = data.map((s: Salary) => ({
          id: s._id,
          employee: s.userId?.name || 'Unknown',
          role: (s.role?.toLowerCase() || 'candidate') as any,
          department: (s as any).department || 'Operations',
          baseSalary: s.baseSalary || s.base || 0,
          bonus: (s as any).details?.incentiveTotal || (s as any).bonus || 0,
          deductions: s.salaryDeduction || (s as any).deductions || 0,
          netPay: s.finalPay || s.finalAmount || 0,
          payPeriod: s.month,
          paymentDate: s.processedAt ? new Date(s.processedAt).toISOString().split('T')[0] : (s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : 'N/A'),
          status: s.isLocked ? 'paid' : ((s as any).status || 'pending'),
          bankAccount: s.bankAccount || '****0000',
          position: s.payModel || (s.role === 'RECRUITER' ? 'Recruiter' : 'Candidate'),
          // Attach raw snapshot for detailed modal
          snapshot: s
        }));
      } else {
        // Fallback to legacy Salaries if no snapshots exist
        const legacyData = await SalaryService.getAllSalaries();
        mappedData = legacyData.map((s: Salary) => ({
          id: s._id,
          employee: s.userId?.name || 'Unknown',
          role: (s.userId?.role || 'Candidate') as any,
          department: (s as any).department || 'General',
          baseSalary: s.base || 0,
          bonus: s.bonus || 0,
          deductions: (s as any).deductions || 0,
          netPay: s.finalAmount || 0,
          payPeriod: s.month,
          paymentDate: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : 'N/A',
          status: (s as any).status || 'pending',
          bankAccount: s.bankAccount || '****0000',
          position: (s as any).position || s.userId?.role || 'Staff',
          // IMPORTANT: Attach raw salary data as snapshot for recalculate functionality
          snapshot: s
        }));
      }

      setSalaries(mappedData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch salaries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalaries();
  }, [fetchSalaries]);

  const filteredSalaries = salaries.filter(sal => {
    const matchesSearch =
      sal.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sal.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sal.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (filters.role === 'all' || sal.role === filters.role.toLowerCase()) &&
      (filters.department === 'all' || sal.department === filters.department) &&
      (filters.status === 'all' || sal.status === filters.status);

    return matchesSearch && matchesFilters;
  });

  const stats = {
    total: salaries.length,
    pending: salaries.filter((s: SalaryData) => s.status === 'pending').length,
    processed: salaries.filter((s: SalaryData) => s.status === 'processed').length,
    paid: salaries.filter((s: SalaryData) => s.status === 'paid').length,
    totalPayroll: salaries.reduce((sum: number, s: SalaryData) => sum + s.netPay, 0),
    totalBonus: salaries.reduce((sum: number, s: SalaryData) => sum + s.bonus, 0),
  };

  const handleExportCSV = async () => {
    try {
      const blob = await SalaryService.exportCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salaries_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV Exported Successfully');
    } catch (err: any) {
      toast.error('Failed to export CSV: ' + (err.message || 'Unknown error'));
    }
  };

  const handleExportPDF = async () => {
    try {
      const blob = await SalaryService.exportPDF();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salaries_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF Exported Successfully');
    } catch (err: any) {
      toast.error('Failed to export PDF: ' + (err.message || 'Unknown error'));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-slate-400 animate-pulse">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="glass-dark border-red-500/20 p-8 rounded-3xl text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-200 mb-2">Failed to Load Payroll</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => fetchSalaries()}
            className="px-6 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all border border-red-500/30"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      { }
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />

        <div className="relative flex items-center justify-between animate-slide-in">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-glow-green animate-pulse-glow">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-5xl text-gradient-premium">Payroll & Salaries</h1>
                <p className="text-slate-400 mt-1 text-sm">Manage employee compensation and payments</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              <span className="relative z-10 text-slate-300 font-medium">Export Payroll</span>
            </button>
          </div>
        </div>
      </div>

      { }
      <div className="grid grid-cols-6 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Employees', value: stats.total, gradient: 'from-emerald-500 to-teal-500', icon: Users },
          { label: 'Pending', value: stats.pending, gradient: 'from-yellow-500 to-orange-500', icon: Clock },
          { label: 'Processed', value: stats.processed, gradient: 'from-blue-500 to-cyan-500', icon: TrendingUp },
          { label: 'Paid', value: stats.paid, gradient: 'from-green-500 to-emerald-500', icon: CheckCircle },
          { label: 'Total Payroll', value: formatCurrency(stats.totalPayroll), gradient: 'from-purple-500 to-pink-500', icon: Wallet, isSmall: true },
          { label: 'Total Bonuses', value: formatCurrency(stats.totalBonus), gradient: 'from-rose-500 to-pink-500', icon: Award, isSmall: true },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                  <p className={`${stat.isSmall ? 'text-xl' : 'text-4xl'} premium-text mb-1`}>{stat.value}</p>
                </div>
                <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      { }
      <div className="glass rounded-3xl p-6 space-y-4 animate-slide-in shadow-premium" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-all duration-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by employee, department, or position..."
              className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:bg-white/10"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`group relative px-6 py-4 glass rounded-2xl transition-all duration-300 flex items-center gap-3 overflow-hidden ${showFilters ? 'bg-emerald-500/20 border-emerald-500/30 shadow-glow-green' : 'hover:bg-white/10'}`}
          >
            <Filter className={`w-5 h-5 relative z-10 ${showFilters ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'} transition-colors`} />
            <span className={`relative z-10 font-medium ${showFilters ? 'text-emerald-400' : 'text-slate-300'}`}>Filters</span>
            <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-300 ${showFilters ? 'rotate-180 text-emerald-400' : 'text-slate-400'}`} />
          </button>

          <button
            onClick={() => setFilters({
              employee: 'all',
              role: 'all',
              department: 'all',
              status: 'all',
            })}
            className="px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium"
          >
            Clear
          </button>

          <button
            onClick={handleExportCSV}
            className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden"
          >
            <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span className="relative z-10 text-slate-300 font-medium">Export CSV</span>
          </button>
        </div>

        { }
        {showFilters && (
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 animate-slide-in">
            {[
              { label: 'Role', value: filters.role, key: 'role', options: ['all', 'Recruiter', 'Candidate', 'Admin'] },
              { label: 'Department', value: filters.department, key: 'department', options: ['all', 'Sales', 'Engineering', 'Operations'] },
              { label: 'Status', value: filters.status, key: 'status', options: ['all', 'pending', 'processed', 'paid'] },
            ].map((filter, index) => (
              <div key={index}>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">{filter.label}</label>
                <select
                  value={filter.value as string}
                  onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-slate-100 transition-all"
                >
                  {filter.options?.map(opt => (
                    <option key={opt} value={opt}>{opt === 'all' ? 'All' : opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      { }
      <div className="grid grid-cols-1 gap-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
        {filteredSalaries.map((sal) => (
          <div key={sal.id} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                { }
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow-green">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">{sal.employee}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleColors[sal.role]?.bg || ''} ${roleColors[sal.role]?.text || ''} ${roleColors[sal.role]?.border || ''}`}>
                          {sal.role}
                        </span>
                        <span className="text-slate-600">•</span>
                        <div className="flex items-center gap-1.5 text-sm text-slate-400">
                          <Building className="w-3.5 h-3.5" />
                          {sal.department}
                        </div>
                        <span className="text-slate-600">•</span>
                        <span className="text-sm text-slate-500">{sal.position}</span>
                      </div>
                    </div>
                  </div>

                  { }
                  <div className="grid grid-cols-5 gap-3">
                    <div className="glass rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Base
                      </p>
                      <p className="text-lg font-bold text-cyan-400">{formatCurrency(sal.baseSalary)}</p>
                    </div>
                    <div className="glass rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Bonus
                      </p>
                      <p className="text-lg font-bold text-purple-400">{formatCurrency(sal.bonus)}</p>
                    </div>
                    <div className="glass rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        Deductions
                      </p>
                      <p className="text-lg font-bold text-red-400">-{formatCurrency(sal.deductions)}</p>
                    </div>
                    <div className="glass rounded-xl p-3 col-span-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <Wallet className="w-3 h-3" />
                        Net Payment
                      </p>
                      <p className="text-xl font-black text-green-400">{formatCurrency(sal.netPay)}</p>
                    </div>
                  </div>
                </div>

                { }
                <div className="flex flex-col items-end gap-4 ml-6">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Pay Period</p>
                      <p className="text-sm font-medium text-slate-300">{sal.payPeriod}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs text-slate-500">{sal.paymentDate}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border ${statusColors[sal.status]?.bg || ''} ${statusColors[sal.status]?.text || ''} ${statusColors[sal.status]?.border || ''}`}>
                      {sal.status === 'paid' && <CheckCircle className="w-4 h-4" />}
                      {sal.status === 'pending' && <Clock className="w-4 h-4" />}
                      {sal.status === 'processed' && <TrendingUp className="w-4 h-4" />}
                      {sal.status.charAt(0).toUpperCase() + sal.status.slice(1)}
                    </span>
                  </div>

                  { }
                  <button
                    onClick={async () => {
                      setSelectedSalary(sal);
                      setShowDetailModal(true);
                      if (sal.snapshot?.userId?._id) {
                        try {
                          setLoadingHistory(true);
                          const historyData = await SalaryService.getSalaryHistory(sal.snapshot.userId._id);
                          setHistory(historyData.contracts || []);
                        } catch (err) {
                          console.error('Failed to fetch history:', err);
                        } finally {
                          setLoadingHistory(false);
                        }
                      }
                    }}
                    className="px-5 py-2.5 glass rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group/btn"
                  >
                    <Eye className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-400 transition-colors" />
                    <span className="text-sm text-slate-300 group-hover/btn:text-emerald-400 transition-colors font-medium">View Details</span>
                  </button>
                </div>
              </div>

              { }
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-500">Payment to:</span>
                  <span className="text-slate-400 font-mono">{sal.bankAccount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      { }
      {showDetailModal && selectedSalary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 modal-backdrop animate-slide-in overflow-y-auto">
          <div className="glass-dark rounded-2xl md:rounded-3xl max-w-2xl w-full p-4 md:p-6 shadow-premium border border-white/20 relative overflow-hidden my-4 md:my-8 max-h-[95vh] flex flex-col">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 rounded-full blur-3xl opacity-15 animate-pulse" />

            <div className="relative overflow-y-auto custom-scrollbar pr-1">
              <div className="flex flex-row items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4">
                <h3 className="text-lg md:text-2xl premium-text">Payroll Details</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={async () => {
                      console.log('Recalculate button clicked');
                      console.log('Selected salary:', selectedSalary);

                      // Extract userId - handle both string and object formats
                      const userId = typeof selectedSalary.snapshot?.userId === 'string'
                        ? selectedSalary.snapshot.userId
                        : selectedSalary.snapshot?.userId?._id;

                      const month = selectedSalary.snapshot?.month;

                      console.log('UserId:', userId, 'Month:', month);

                      if (!userId || !month) {
                        console.error('Missing userId or month', { userId, month });
                        toast.error('Cannot recalculate: Missing user ID or month');
                        return;
                      }

                      try {
                        setIsRecalculating(true);
                        console.log('Calling getSalaryCalculation with:', userId, month);

                        const updated = await SalaryService.getSalaryCalculation(userId, month);

                        console.log('Recalculation response:', updated);

                        if (updated.success && updated.data) {
                          toast.success('Salary recalculated successfully!');

                          // Map the calculation result to the salary data structure
                          const calculatedData = updated.data;

                          setSelectedSalary({
                            ...selectedSalary,
                            snapshot: {
                              ...selectedSalary.snapshot,
                              baseSalary: calculatedData.baseSalary || calculatedData.base || selectedSalary.snapshot?.baseSalary,
                              finalPay: calculatedData.finalSalary || calculatedData.finalPay || calculatedData.netPay,
                              salaryDeduction: calculatedData.ptoDeduction || calculatedData.deductions,
                              approvedHours: calculatedData.approvedHours,
                              details: {
                                ...selectedSalary.snapshot?.details,
                                incentiveTotal: calculatedData.incentiveTotal || calculatedData.bonus || 0
                              }
                            },
                            netPay: calculatedData.finalSalary || calculatedData.finalPay || calculatedData.netPay || selectedSalary.netPay,
                            baseSalary: calculatedData.baseSalary || calculatedData.base || selectedSalary.baseSalary,
                            bonus: calculatedData.incentiveTotal || calculatedData.bonus || selectedSalary.bonus,
                            deductions: calculatedData.ptoDeduction || calculatedData.deductions || selectedSalary.deductions
                          });
                        } else {
                          toast.error('Recalculation returned no data');
                        }
                      } catch (err: any) {
                        console.error('Recalculation error:', err);
                        toast.error(err?.response?.data?.message || 'Failed to recalculate salary');
                      } finally {
                        setIsRecalculating(false);
                      }
                    }}
                    disabled={isRecalculating}
                    className="p-1.5 glass rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <TrendingUp className={`w-3.5 h-3.5 text-emerald-400 ${isRecalculating ? 'animate-spin' : ''}`} />
                    <span className="text-[10px] text-slate-300 font-medium">Recalculate</span>
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 glass rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                { }
                <div className="glass rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow-green shrink-0">
                      <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base md:text-xl font-bold text-slate-100 line-clamp-1">{selectedSalary.employee}</h4>
                      <p className="text-[10px] md:text-xs text-slate-400">{selectedSalary.position}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="glass rounded-xl p-3 md:p-4">
                      <p className="text-[10px] md:text-xs text-slate-400 mb-1 uppercase tracking-wider">Role</p>
                      <span className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-semibold border ${roleColors[selectedSalary.role]?.bg || ''} ${roleColors[selectedSalary.role]?.text || ''} ${roleColors[selectedSalary.role]?.border || ''}`}>
                        {selectedSalary.role}
                      </span>
                    </div>
                    <div className="glass rounded-xl p-3 md:p-4">
                      <p className="text-[10px] md:text-xs text-slate-400 mb-1 uppercase tracking-wider">Department</p>
                      <p className="text-sm md:text-lg text-slate-200 font-medium">{selectedSalary.department}</p>
                    </div>
                  </div>
                </div>

                { }
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="glass rounded-2xl p-4 md:p-6">
                    <h5 className="text-[10px] md:text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Calendar className="w-3 md:w-4 h-3 md:h-4" />
                      Payment Timeline
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] md:text-xs text-slate-500 mb-1">Pay Period</p>
                        <p className="text-sm md:text-lg text-slate-200 font-medium">{selectedSalary.payPeriod}</p>
                      </div>
                      <div>
                        <p className="text-[10px] md:text-xs text-slate-500 mb-1">Payment Date</p>
                        <p className="text-sm md:text-lg text-slate-200 font-medium">{selectedSalary.paymentDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-4 md:p-6">
                    <h5 className="text-[10px] md:text-sm text-slate-400 uppercase tracking-wider mb-4">Status & Banking</h5>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] md:text-xs text-slate-500 mb-2">Payment Status</p>
                        <span className={`inline-flex items-center gap-1.5 md:gap-2 px-3 py-1 md:px-4 md:py-2 rounded-xl text-xs md:text-base font-semibold border ${statusColors[selectedSalary.status]?.bg || ''} ${statusColors[selectedSalary.status]?.text || ''} ${statusColors[selectedSalary.status]?.border || ''}`}>
                          {selectedSalary.status === 'paid' && <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />}
                          {selectedSalary.status === 'pending' && <Clock className="w-4 h-4 md:w-5 md:h-5" />}
                          {selectedSalary.status === 'processed' && <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />}
                          {selectedSalary.status.charAt(0).toUpperCase() + selectedSalary.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] md:text-xs text-slate-500 mb-1">Bank Account</p>
                        <p className="text-sm md:text-lg text-slate-200 font-mono font-medium truncate">{selectedSalary.bankAccount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                { }
                <div className="glass rounded-2xl p-4 md:p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                  <h5 className="text-[10px] md:text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 font-bold md:font-normal">
                    <Wallet className="w-3 md:w-4 h-3 md:h-4" />
                    Compensation
                  </h5>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">
                        {selectedSalary.snapshot?.payModel === 'PERCENTAGE' ? 'Client Revenue' : 'Base Salary'}
                      </span>
                      <span className="text-xl text-slate-200 font-bold">
                        {formatCurrency(selectedSalary.snapshot?.payModel === 'PERCENTAGE' ?
                          ((selectedSalary.snapshot?.approvedHours || 0) * (selectedSalary.snapshot?.clientBillRate || 0)) :
                          selectedSalary.baseSalary)}
                      </span>
                    </div>

                    {selectedSalary.snapshot?.approvedHours !== undefined && selectedSalary.snapshot.approvedHours > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400 italic">
                          Approved Hours: {selectedSalary.snapshot.approvedHours} hrs
                          {selectedSalary.snapshot.hourlyRate ? ` @ ${formatCurrency(selectedSalary.snapshot.hourlyRate)}/hr` : ''}
                        </span>
                        {selectedSalary.snapshot.percentage ? (
                          <span className="text-sm text-slate-400 font-medium">({selectedSalary.snapshot.percentage}%)</span>
                        ) : null}
                      </div>
                    )}

                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-xs text-slate-300 flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        Bonus
                      </span>
                      <span className="text-lg text-purple-400 font-bold">+{formatCurrency(selectedSalary.bonus)}</span>
                    </div>

                    {(selectedSalary.deductions > 0 || (selectedSalary.snapshot?.excessPtoDays || 0) > 0 || (selectedSalary.snapshot as any)?.carryForwardPto !== undefined) && (
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-[13px] md:text-sm text-slate-300 flex items-center gap-2">
                            <Percent className="w-3 md:w-4 h-3 md:h-4 text-red-400" />
                            Deductions & PTO
                          </span>
                          <div className="mt-1 ml-5 md:ml-6 space-y-0.5 md:space-y-1">
                            {selectedSalary.snapshot?.excessPtoDays ? (
                              <p className="text-[10px] md:text-xs text-red-400/70">
                                Excess PTO: {selectedSalary.snapshot.excessPtoDays} days
                              </p>
                            ) : null}
                            {(selectedSalary.snapshot as any)?.carryForwardPto !== undefined && (
                              <p className="text-[10px] md:text-xs text-emerald-400/70">
                                Carry-Forward: {(selectedSalary.snapshot as any).carryForwardPto} days
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-base md:text-xl text-red-400 font-bold">-{formatCurrency(selectedSalary.deductions)}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/20 flex justify-between items-center mt-1">
                      <div className="flex flex-col">
                        <span className="text-sm md:text-base text-slate-200 font-semibold">Net Payment</span>
                        {selectedSalary.snapshot?.processedAt && (
                          <span className="text-[10px] text-slate-500">Fixed at {new Date(selectedSalary.snapshot.processedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <span className="text-xl md:text-2xl text-green-400 font-black">{formatCurrency(selectedSalary.netPay)}</span>
                    </div>
                  </div>
                </div>
                { }
                <div className="glass rounded-xl p-4">
                  <h5 className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 font-bold">
                    <History className="w-3.5 h-3.5 text-emerald-400" />
                    Salary History
                  </h5>
                  {loadingHistory ? (
                    <div className="text-center py-4 text-slate-500 animate-pulse">Loading history...</div>
                  ) : history.length > 0 ? (
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {history.map((contract, i) => (
                        <div key={i} className="flex items-center justify-between p-3 glass rounded-xl border border-white/5 hover:border-emerald-500/20 transition-all">
                          <div>
                            <p className="text-sm font-medium text-slate-200">{contract.position || 'Employee'}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(contract.startDate).toLocaleDateString()} - {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'Present'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-400">{formatCurrency(contract.baseSalary || contract.rate || 0)}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{contract.payModel}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-slate-500 italic">No history records found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { 
  DollarSign, Search, Filter, Download, X, Eye, User,
  Calendar, TrendingUp, Wallet, Users, Sparkles, Building,
  ChevronDown, CheckCircle, Clock, Award, CreditCard, Percent
} from 'lucide-react';

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
}

const mockSalaries: SalaryData[] = [
  { id: 'SAL-001', employee: 'John Doe', role: 'Recruiter', department: 'Sales', baseSalary: 8000, bonus: 1200, deductions: 920, netPay: 8280, payPeriod: 'March 2024', paymentDate: '2024-03-31', status: 'paid', bankAccount: '****5678', position: 'Senior Recruiter' },
  { id: 'SAL-002', employee: 'Jane Smith', role: 'Candidate', department: 'Engineering', baseSalary: 9500, bonus: 0, deductions: 950, netPay: 8550, payPeriod: 'March 2024', paymentDate: '2024-03-31', status: 'paid', bankAccount: '****1234', position: 'Software Engineer' },
  { id: 'SAL-003', employee: 'Bob Wilson', role: 'Recruiter', department: 'Sales', baseSalary: 7500, bonus: 1500, deductions: 825, netPay: 8175, payPeriod: 'March 2024', paymentDate: '2024-04-05', status: 'processed', bankAccount: '****9012', position: 'Technical Recruiter' },
  { id: 'SAL-004', employee: 'Alice Brown', role: 'Admin', department: 'Operations', baseSalary: 6500, bonus: 500, deductions: 650, netPay: 6350, payPeriod: 'March 2024', paymentDate: '2024-04-05', status: 'processed', bankAccount: '****3456', position: 'Operations Manager' },
  { id: 'SAL-005', employee: 'Charlie Davis', role: 'Candidate', department: 'Engineering', baseSalary: 10200, bonus: 0, deductions: 1020, netPay: 9180, payPeriod: 'March 2024', paymentDate: '2024-04-05', status: 'pending', bankAccount: '****7890', position: 'Lead Developer' },
  { id: 'SAL-006', employee: 'Diana Prince', role: 'Recruiter', department: 'Sales', baseSalary: 8500, bonus: 2000, deductions: 935, netPay: 9565, payPeriod: 'March 2024', paymentDate: '2024-04-05', status: 'pending', bankAccount: '****2468', position: 'Principal Recruiter' },
];

const statusColors = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  processed: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  paid: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
};

const roleColors = {
  Recruiter: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  Candidate: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  Admin: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
};

export function SalariesPage() {
  const [salaries, setSalaries] = useState<SalaryData[]>(mockSalaries);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryData | null>(null);
  
  const [filters, setFilters] = useState({
    employee: 'all',
    role: 'all',
    department: 'all',
    status: 'all',
  });

  const filteredSalaries = salaries.filter(sal => {
    const matchesSearch = 
      sal.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sal.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sal.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = 
      (filters.role === 'all' || sal.role === filters.role) &&
      (filters.department === 'all' || sal.department === filters.department) &&
      (filters.status === 'all' || sal.status === filters.status);
    
    return matchesSearch && matchesFilters;
  });

  const stats = {
    total: salaries.length,
    pending: salaries.filter(s => s.status === 'pending').length,
    processed: salaries.filter(s => s.status === 'processed').length,
    paid: salaries.filter(s => s.status === 'paid').length,
    totalPayroll: salaries.reduce((sum, s) => sum + s.netPay, 0),
    totalBonus: salaries.reduce((sum, s) => sum + s.bonus, 0),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
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
            <button className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              <span className="relative z-10 text-slate-300 font-medium">Export Payroll</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Controls */}
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

          <button className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden">
            <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span className="relative z-10 text-slate-300 font-medium">Export CSV</span>
          </button>
        </div>

        {/* Filters Panel */}
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

      {/* Salaries Cards Grid - Enterprise Design */}
      <div className="grid grid-cols-1 gap-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
        {filteredSalaries.map((sal) => (
          <div key={sal.id} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                {/* Left Section - Employee Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow-green">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">{sal.employee}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleColors[sal.role].bg} ${roleColors[sal.role].text} ${roleColors[sal.role].border}`}>
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
                  
                  {/* Compensation Breakdown */}
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

                {/* Right Section - Status & Actions */}
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
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border ${statusColors[sal.status].bg} ${statusColors[sal.status].text} ${statusColors[sal.status].border}`}>
                      {sal.status === 'paid' && <CheckCircle className="w-4 h-4" />}
                      {sal.status === 'pending' && <Clock className="w-4 h-4" />}
                      {sal.status === 'processed' && <TrendingUp className="w-4 h-4" />}
                      {sal.status.charAt(0).toUpperCase() + sal.status.slice(1)}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setSelectedSalary(sal);
                      setShowDetailModal(true);
                    }}
                    className="px-5 py-2.5 glass rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group/btn"
                  >
                    <Eye className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-400 transition-colors" />
                    <span className="text-sm text-slate-300 group-hover/btn:text-emerald-400 transition-colors font-medium">View Details</span>
                  </button>
                </div>
              </div>

              {/* Bank Account Info */}
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

      {/* Detail Modal */}
      {showDetailModal && selectedSalary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-slide-in">
          <div className="glass-dark rounded-3xl max-w-3xl w-full p-8 shadow-premium border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl premium-text">Payroll Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 glass rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Employee Info */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-glow-green">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-100">{selectedSalary.employee}</h4>
                      <p className="text-sm text-slate-400 mt-1">{selectedSalary.position}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Role</p>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${roleColors[selectedSalary.role].bg} ${roleColors[selectedSalary.role].text} ${roleColors[selectedSalary.role].border}`}>
                        {selectedSalary.role}
                      </span>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Department</p>
                      <p className="text-lg text-slate-200 font-medium">{selectedSalary.department}</p>
                    </div>
                  </div>
                </div>

                {/* Pay Period & Status */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6">
                    <h5 className="text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Payment Timeline
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Pay Period</p>
                        <p className="text-lg text-slate-200 font-medium">{selectedSalary.payPeriod}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Payment Date</p>
                        <p className="text-lg text-slate-200 font-medium">{selectedSalary.paymentDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h5 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Status & Banking</h5>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-2">Payment Status</p>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold border ${statusColors[selectedSalary.status].bg} ${statusColors[selectedSalary.status].text} ${statusColors[selectedSalary.status].border}`}>
                          {selectedSalary.status === 'paid' && <CheckCircle className="w-5 h-5" />}
                          {selectedSalary.status === 'pending' && <Clock className="w-5 h-5" />}
                          {selectedSalary.status === 'processed' && <TrendingUp className="w-5 h-5" />}
                          {selectedSalary.status.charAt(0).toUpperCase() + selectedSalary.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Bank Account</p>
                        <p className="text-lg text-slate-200 font-mono font-medium">{selectedSalary.bankAccount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compensation Breakdown */}
                <div className="glass rounded-2xl p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                  <h5 className="text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Compensation Breakdown
                  </h5>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Base Salary</span>
                      <span className="text-xl text-slate-200 font-bold">{formatCurrency(selectedSalary.baseSalary)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300 flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        Performance Bonus
                      </span>
                      <span className="text-xl text-purple-400 font-bold">+{formatCurrency(selectedSalary.bonus)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300 flex items-center gap-2">
                        <Percent className="w-4 h-4 text-red-400" />
                        Deductions (Tax, Benefits)
                      </span>
                      <span className="text-xl text-red-400 font-bold">-{formatCurrency(selectedSalary.deductions)}</span>
                    </div>
                    <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                      <span className="text-lg text-slate-200 font-semibold">Net Payment</span>
                      <span className="text-3xl text-green-400 font-black">{formatCurrency(selectedSalary.netPay)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

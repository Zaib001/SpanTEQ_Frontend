import { useState } from 'react';
import { 
  Clock, Search, Filter, Download, X, Eye, CheckCircle, XCircle,
  Calendar, User, DollarSign, TrendingUp, AlertCircle, Sparkles,
  ChevronDown, Briefcase, FileText, ChevronRight, BarChart3
} from 'lucide-react';

interface TimesheetData {
  id: string;
  consultant: string;
  client: string;
  weekEnding: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  billRate: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'submitted';
  submittedDate: string;
  notes: string;
  project: string;
}

interface ConsultantTimesheets {
  consultant: string;
  client: string;
  project: string;
  timesheets: TimesheetData[];
  totalHours: number;
  totalAmount: number;
  pendingCount: number;
  approvedCount: number;
  lastSubmission: string;
}

const mockTimesheets: TimesheetData[] = [
  { id: 'TS-001', consultant: 'John Doe', client: 'TechCorp', weekEnding: '2024-03-15', regularHours: 40, overtimeHours: 5, totalHours: 45, billRate: 85, totalAmount: 3825, status: 'pending', submittedDate: '2024-03-16', notes: 'Includes weekend work', project: 'Migration Project' },
  { id: 'TS-002', consultant: 'John Doe', client: 'TechCorp', weekEnding: '2024-03-08', regularHours: 40, overtimeHours: 3, totalHours: 43, billRate: 85, totalAmount: 3655, status: 'approved', submittedDate: '2024-03-09', notes: 'Regular week', project: 'Migration Project' },
  { id: 'TS-003', consultant: 'John Doe', client: 'TechCorp', weekEnding: '2024-03-01', regularHours: 38, overtimeHours: 0, totalHours: 38, billRate: 85, totalAmount: 3230, status: 'approved', submittedDate: '2024-03-02', notes: 'Short week', project: 'Migration Project' },
  { id: 'TS-004', consultant: 'Jane Smith', client: 'DataInc', weekEnding: '2024-03-15', regularHours: 40, overtimeHours: 0, totalHours: 40, billRate: 95, totalAmount: 3800, status: 'approved', submittedDate: '2024-03-16', notes: 'Regular hours only', project: 'Analytics Dashboard' },
  { id: 'TS-005', consultant: 'Jane Smith', client: 'DataInc', weekEnding: '2024-03-08', regularHours: 40, overtimeHours: 2, totalHours: 42, billRate: 95, totalAmount: 3990, status: 'approved', submittedDate: '2024-03-09', notes: 'Minor overtime', project: 'Analytics Dashboard' },
  { id: 'TS-006', consultant: 'Bob Wilson', client: 'CloudSys', weekEnding: '2024-03-15', regularHours: 38, overtimeHours: 8, totalHours: 46, billRate: 105, totalAmount: 4830, status: 'submitted', submittedDate: '2024-03-17', notes: 'Project deadline rush', project: 'Cloud Infrastructure' },
  { id: 'TS-007', consultant: 'Bob Wilson', client: 'CloudSys', weekEnding: '2024-03-08', regularHours: 40, overtimeHours: 5, totalHours: 45, billRate: 105, totalAmount: 4725, status: 'pending', submittedDate: '2024-03-09', notes: 'High workload', project: 'Cloud Infrastructure' },
  { id: 'TS-008', consultant: 'Alice Brown', client: 'FinTech', weekEnding: '2024-03-08', regularHours: 40, overtimeHours: 3, totalHours: 43, billRate: 90, totalAmount: 3870, status: 'approved', submittedDate: '2024-03-09', notes: 'Extra hours approved', project: 'Payment Gateway' },
  { id: 'TS-009', consultant: 'Charlie Davis', client: 'StartupX', weekEnding: '2024-03-08', regularHours: 35, overtimeHours: 0, totalHours: 35, billRate: 80, totalAmount: 2800, status: 'rejected', submittedDate: '2024-03-09', notes: 'Hours mismatch', project: 'MVP Development' },
  { id: 'TS-010', consultant: 'Diana Prince', client: 'MegaCorp', weekEnding: '2024-03-15', regularHours: 40, overtimeHours: 10, totalHours: 50, billRate: 110, totalAmount: 5500, status: 'pending', submittedDate: '2024-03-16', notes: 'Critical deployment', project: 'ERP Implementation' },
  { id: 'TS-011', consultant: 'Diana Prince', client: 'MegaCorp', weekEnding: '2024-03-08', regularHours: 40, overtimeHours: 6, totalHours: 46, billRate: 110, totalAmount: 5060, status: 'approved', submittedDate: '2024-03-09', notes: 'Regular overtime', project: 'ERP Implementation' },
  { id: 'TS-012', consultant: 'Diana Prince', client: 'MegaCorp', weekEnding: '2024-03-01', regularHours: 40, overtimeHours: 4, totalHours: 44, billRate: 110, totalAmount: 4840, status: 'approved', submittedDate: '2024-03-02', notes: 'Extra work', project: 'ERP Implementation' },
];

const statusColors = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  submitted: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  approved: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

export function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<TimesheetData[]>(mockTimesheets);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetData | null>(null);
  const [expandedConsultants, setExpandedConsultants] = useState<{ [key: string]: boolean }>({});
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');
  
  const [filters, setFilters] = useState({
    consultant: 'all',
    client: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  // Group timesheets by consultant
  const groupedTimesheets = (): ConsultantTimesheets[] => {
    const groups: { [key: string]: ConsultantTimesheets } = {};
    
    timesheets.forEach(ts => {
      const key = `${ts.consultant}-${ts.client}`;
      if (!groups[key]) {
        groups[key] = {
          consultant: ts.consultant,
          client: ts.client,
          project: ts.project,
          timesheets: [],
          totalHours: 0,
          totalAmount: 0,
          pendingCount: 0,
          approvedCount: 0,
          lastSubmission: ts.submittedDate,
        };
      }
      groups[key].timesheets.push(ts);
      groups[key].totalHours += ts.totalHours;
      groups[key].totalAmount += ts.totalAmount;
      if (ts.status === 'pending') groups[key].pendingCount++;
      if (ts.status === 'approved') groups[key].approvedCount++;
      if (new Date(ts.submittedDate) > new Date(groups[key].lastSubmission)) {
        groups[key].lastSubmission = ts.submittedDate;
      }
    });

    // Sort timesheets within each group by week ending date (newest first)
    Object.values(groups).forEach(group => {
      group.timesheets.sort((a, b) => new Date(b.weekEnding).getTime() - new Date(a.weekEnding).getTime());
    });

    return Object.values(groups);
  };

  const filteredTimesheets = timesheets.filter(ts => {
    const matchesSearch = 
      ts.consultant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ts.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ts.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = 
      (filters.consultant === 'all' || ts.consultant === filters.consultant) &&
      (filters.client === 'all' || ts.client === filters.client) &&
      (filters.status === 'all' || ts.status === filters.status);
    
    return matchesSearch && matchesFilters;
  });

  const stats = {
    total: timesheets.length,
    pending: timesheets.filter(ts => ts.status === 'pending').length,
    approved: timesheets.filter(ts => ts.status === 'approved').length,
    totalHours: timesheets.reduce((sum, ts) => sum + ts.totalHours, 0),
    totalAmount: timesheets.reduce((sum, ts) => sum + ts.totalAmount, 0),
    activeConsultants: new Set(timesheets.map(ts => ts.consultant)).size,
  };

  const handleApprove = (id: string) => {
    setTimesheets(timesheets.map(ts => 
      ts.id === id ? { ...ts, status: 'approved' as const } : ts
    ));
  };

  const handleReject = (id: string) => {
    setTimesheets(timesheets.map(ts => 
      ts.id === id ? { ...ts, status: 'rejected' as const } : ts
    ));
  };

  const handleApproveAll = (consultant: string, client: string) => {
    setTimesheets(timesheets.map(ts => 
      ts.consultant === consultant && ts.client === client && ts.status === 'pending'
        ? { ...ts, status: 'approved' as const }
        : ts
    ));
  };

  const toggleConsultant = (key: string) => {
    setExpandedConsultants(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        
        <div className="relative flex items-center justify-between animate-slide-in">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-glow-purple animate-pulse-glow">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-5xl text-gradient-premium">Timesheets Management</h1>
                <p className="text-slate-400 mt-1 text-sm">Weekly submissions organized by consultant</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* View Toggle */}
            <div className="glass rounded-2xl p-1 flex gap-1">
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'grouped'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-glow-purple'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">By Consultant</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-glow-purple'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">All Weeks</span>
              </button>
            </div>
            
            <button className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-purple-400 transition-colors" />
              <span className="relative z-10 text-slate-300 font-medium">Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Submissions', value: stats.total, gradient: 'from-purple-500 to-pink-500', icon: Clock },
          { label: 'Active Consultants', value: stats.activeConsultants, gradient: 'from-blue-500 to-cyan-500', icon: User },
          { label: 'Pending Review', value: stats.pending, gradient: 'from-yellow-500 to-orange-500', icon: AlertCircle },
          { label: 'Approved', value: stats.approved, gradient: 'from-green-500 to-emerald-500', icon: CheckCircle },
          { label: 'Total Hours', value: stats.totalHours.toFixed(0), gradient: 'from-indigo-500 to-purple-500', icon: TrendingUp },
          { label: 'Total Amount', value: formatCurrency(stats.totalAmount), gradient: 'from-rose-500 to-pink-500', icon: DollarSign, isSmall: true },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                  <p className={`${stat.isSmall ? 'text-2xl' : 'text-4xl'} premium-text mb-1`}>{stat.value}</p>
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
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-all duration-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by consultant, client, or project..."
              className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:bg-white/10"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`group relative px-6 py-4 glass rounded-2xl transition-all duration-300 flex items-center gap-3 overflow-hidden ${showFilters ? 'bg-purple-500/20 border-purple-500/30 shadow-glow-purple' : 'hover:bg-white/10'}`}
          >
            <Filter className={`w-5 h-5 relative z-10 ${showFilters ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'} transition-colors`} />
            <span className={`relative z-10 font-medium ${showFilters ? 'text-purple-400' : 'text-slate-300'}`}>Filters</span>
            <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-300 ${showFilters ? 'rotate-180 text-purple-400' : 'text-slate-400'}`} />
          </button>

          <button
            onClick={() => setFilters({
              consultant: 'all',
              client: 'all',
              status: 'all',
              dateFrom: '',
              dateTo: '',
            })}
            className="px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium"
          >
            Clear
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10 animate-slide-in">
            {[
              { label: 'Consultant', value: filters.consultant, key: 'consultant', options: ['all', ...Array.from(new Set(timesheets.map(t => t.consultant)))] },
              { label: 'Client', value: filters.client, key: 'client', options: ['all', ...Array.from(new Set(timesheets.map(t => t.client)))] },
              { label: 'Status', value: filters.status, key: 'status', options: ['all', 'pending', 'submitted', 'approved', 'rejected'] },
              { label: 'Week Ending', value: filters.dateFrom, key: 'dateFrom', type: 'date' },
            ].map((filter, index) => (
              <div key={index}>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">{filter.label}</label>
                {filter.type === 'date' ? (
                  <input
                    type="date"
                    value={filter.value as string}
                    onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-100 transition-all"
                  />
                ) : (
                  <select
                    value={filter.value as string}
                    onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-100 transition-all"
                  >
                    {filter.options?.map(opt => (
                      <option key={opt} value={opt}>{opt === 'all' ? 'All' : opt}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grouped View - By Consultant */}
      {viewMode === 'grouped' && (
        <div className="space-y-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
          {groupedTimesheets().map((group) => {
            const key = `${group.consultant}-${group.client}`;
            const isExpanded = expandedConsultants[key];
            
            return (
              <div key={key} className="glass rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                {/* Consultant Header */}
                <div 
                  className="p-6 cursor-pointer group"
                  onClick={() => toggleConsultant(key)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow-purple">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-100 mb-1">{group.consultant}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4" />
                            <span>{group.client}</span>
                          </div>
                          <span className="text-slate-600">•</span>
                          <span>{group.project}</span>
                          <span className="text-slate-600">•</span>
                          <span>{group.timesheets.length} weeks submitted</span>
                        </div>
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="flex items-center gap-3 mr-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">Total Hours</p>
                        <p className="text-2xl font-bold text-purple-400">{group.totalHours}h</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-green-400">{formatCurrency(group.totalAmount)}</p>
                      </div>
                      {group.pendingCount > 0 && (
                        <div className="px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                          <p className="text-xs text-yellow-400 font-bold">{group.pendingCount} Pending</p>
                        </div>
                      )}
                    </div>

                    {/* Expand Icon */}
                    <ChevronRight className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''} group-hover:text-purple-400`} />
                  </div>

                  {/* Quick Actions Bar */}
                  {group.pendingCount > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <p className="text-sm text-slate-400">Quick Actions:</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveAll(group.consultant, group.client);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-sm font-medium hover:shadow-glow-green transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve All Pending ({group.pendingCount})
                      </button>
                    </div>
                  )}
                </div>

                {/* Weekly Timesheets */}
                {isExpanded && (
                  <div className="border-t border-white/10 bg-white/5">
                    <div className="p-6 space-y-3">
                      {group.timesheets.map((ts) => (
                        <div key={ts.id} className="group relative glass rounded-2xl p-5 hover:bg-white/5 transition-all duration-300 border border-white/5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-center">
                                <p className="text-xs text-slate-500 mb-1">Week Ending</p>
                                <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
                                  <Calendar className="w-4 h-4 text-purple-400" />
                                  <span className="text-sm font-bold text-slate-200">{ts.weekEnding}</span>
                                </div>
                              </div>

                              <div className="flex-1 grid grid-cols-4 gap-3">
                                <div className="glass rounded-xl p-3">
                                  <p className="text-xs text-slate-500 mb-1">Regular</p>
                                  <p className="text-lg font-bold text-cyan-400">{ts.regularHours}h</p>
                                </div>
                                <div className="glass rounded-xl p-3">
                                  <p className="text-xs text-slate-500 mb-1">Overtime</p>
                                  <p className="text-lg font-bold text-orange-400">{ts.overtimeHours}h</p>
                                </div>
                                <div className="glass rounded-xl p-3">
                                  <p className="text-xs text-slate-500 mb-1">Total</p>
                                  <p className="text-lg font-bold text-purple-400">{ts.totalHours}h</p>
                                </div>
                                <div className="glass rounded-xl p-3">
                                  <p className="text-xs text-slate-500 mb-1">Amount</p>
                                  <p className="text-lg font-bold text-green-400">{formatCurrency(ts.totalAmount)}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 ml-6">
                              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border ${statusColors[ts.status].bg} ${statusColors[ts.status].text} ${statusColors[ts.status].border}`}>
                                {ts.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                                {ts.status === 'rejected' && <XCircle className="w-4 h-4" />}
                                {ts.status === 'pending' && <AlertCircle className="w-4 h-4" />}
                                {ts.status === 'submitted' && <Clock className="w-4 h-4" />}
                                {ts.status.charAt(0).toUpperCase() + ts.status.slice(1)}
                              </span>

                              <button
                                onClick={() => {
                                  setSelectedTimesheet(ts);
                                  setShowDetailModal(true);
                                }}
                                className="px-4 py-2 glass rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group/btn"
                              >
                                <Eye className="w-4 h-4 text-slate-400 group-hover/btn:text-blue-400 transition-colors" />
                                <span className="text-sm text-slate-300 group-hover/btn:text-blue-400 transition-colors">View</span>
                              </button>

                              {ts.status === 'pending' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApprove(ts.id)}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-sm font-medium hover:shadow-glow-green transition-all flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(ts.id)}
                                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl text-white text-sm font-medium hover:shadow-glow-red transition-all flex items-center gap-2"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {ts.notes && (
                            <div className="mt-3 pt-3 border-t border-white/10 flex items-start gap-2">
                              <FileText className="w-4 h-4 text-slate-500 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Notes</p>
                                <p className="text-sm text-slate-400">{ts.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* List View - All Weeks */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 gap-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
          {filteredTimesheets.map((ts) => (
            <div key={ts.id} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-glow-purple">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-100">{ts.consultant}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-sm text-slate-400">{ts.client}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-sm text-slate-500">{ts.project}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3">
                      <div className="glass rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">Regular</p>
                        <p className="text-xl font-bold text-cyan-400">{ts.regularHours}h</p>
                      </div>
                      <div className="glass rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">Overtime</p>
                        <p className="text-xl font-bold text-orange-400">{ts.overtimeHours}h</p>
                      </div>
                      <div className="glass rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">Total Hours</p>
                        <p className="text-xl font-bold text-purple-400">{ts.totalHours}h</p>
                      </div>
                      <div className="glass rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">Amount</p>
                        <p className="text-xl font-bold text-green-400">{formatCurrency(ts.totalAmount)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">Week Ending</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-300">{ts.weekEnding}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border ${statusColors[ts.status].bg} ${statusColors[ts.status].text} ${statusColors[ts.status].border}`}>
                        {ts.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                        {ts.status === 'rejected' && <XCircle className="w-4 h-4" />}
                        {ts.status === 'pending' && <AlertCircle className="w-4 h-4" />}
                        {ts.status === 'submitted' && <Clock className="w-4 h-4" />}
                        {ts.status.charAt(0).toUpperCase() + ts.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTimesheet(ts);
                          setShowDetailModal(true);
                        }}
                        className="px-4 py-2 glass rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group/btn"
                      >
                        <Eye className="w-4 h-4 text-slate-400 group-hover/btn:text-blue-400 transition-colors" />
                        <span className="text-sm text-slate-300 group-hover/btn:text-blue-400 transition-colors">View</span>
                      </button>
                      {ts.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(ts.id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:shadow-glow-green transition-all duration-300 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                            <span className="text-sm text-white font-medium">Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(ts.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl hover:shadow-glow-red transition-all duration-300 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4 text-white" />
                            <span className="text-sm text-white font-medium">Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {ts.notes && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Notes</p>
                        <p className="text-sm text-slate-400">{ts.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTimesheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-slide-in">
          <div className="glass-dark rounded-3xl max-w-3xl w-full p-8 shadow-premium border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl premium-text">Timesheet Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 glass rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow-purple">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-100">{selectedTimesheet.consultant}</h4>
                      <p className="text-sm text-slate-400 mt-1">{selectedTimesheet.client} • {selectedTimesheet.project}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Week Ending</p>
                      <p className="text-lg text-slate-200 font-medium">{selectedTimesheet.weekEnding}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Submitted</p>
                      <p className="text-lg text-slate-200 font-medium">{selectedTimesheet.submittedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6">
                    <h5 className="text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Hours Breakdown
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Regular Hours</span>
                        <span className="text-2xl text-cyan-400 font-bold">{selectedTimesheet.regularHours}h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Overtime Hours</span>
                        <span className="text-2xl text-orange-400 font-bold">{selectedTimesheet.overtimeHours}h</span>
                      </div>
                      <div className="pt-3 border-t border-white/20 flex justify-between items-center">
                        <span className="text-base text-slate-200 font-medium">Total Hours</span>
                        <span className="text-3xl text-purple-400 font-black">{selectedTimesheet.totalHours}h</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h5 className="text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Billing Details
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Bill Rate</span>
                        <span className="text-2xl text-blue-400 font-bold">{formatCurrency(selectedTimesheet.billRate)}/hr</span>
                      </div>
                      <div className="pt-3 border-t border-white/20 flex justify-between items-center">
                        <span className="text-base text-slate-200 font-medium">Total Amount</span>
                        <span className="text-3xl text-green-400 font-black">{formatCurrency(selectedTimesheet.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6">
                    <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider">Status</p>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold border ${statusColors[selectedTimesheet.status].bg} ${statusColors[selectedTimesheet.status].text} ${statusColors[selectedTimesheet.status].border}`}>
                      {selectedTimesheet.status === 'approved' && <CheckCircle className="w-5 h-5" />}
                      {selectedTimesheet.status === 'rejected' && <XCircle className="w-5 h-5" />}
                      {selectedTimesheet.status === 'pending' && <AlertCircle className="w-5 h-5" />}
                      {selectedTimesheet.status === 'submitted' && <Clock className="w-5 h-5" />}
                      {selectedTimesheet.status.charAt(0).toUpperCase() + selectedTimesheet.status.slice(1)}
                    </span>
                  </div>

                  {selectedTimesheet.notes && (
                    <div className="glass rounded-2xl p-6">
                      <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Notes</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{selectedTimesheet.notes}</p>
                    </div>
                  )}
                </div>

                {selectedTimesheet.status === 'pending' && (
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        handleApprove(selectedTimesheet.id);
                        setShowDetailModal(false);
                      }}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white font-semibold hover:shadow-glow-green transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Timesheet
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedTimesheet.id);
                        setShowDetailModal(false);
                      }}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl text-white font-semibold hover:shadow-glow-red transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Timesheet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

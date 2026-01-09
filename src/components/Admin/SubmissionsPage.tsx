import { useState, useEffect } from 'react';
import {
  Search, Filter, Download, Upload, X, Eye, Edit, Trash2,
  FileText, User, Briefcase, Calendar, Sparkles,
  ChevronDown, ArrowUpDown
} from 'lucide-react';
import SubmissionService, { type Submission } from '../../services/submission.service';
import InterviewManagementModal from './InterviewManagementModal';

type SubmissionData = Submission & { id: string };

const statusColors: Record<string, { bg: string, text: string, border: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  submitted: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  interview: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  offered: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  placed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },

  SUBMITTED: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  INTERVIEWING: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  OFFERED: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  PLACED: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  REJECTED: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  ON_HOLD: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  WITHDRAWN: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
  CLOSED: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
};

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showInterviewsModal, setShowInterviewsModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [recruiters, setRecruiters] = useState<{ id: string, name: string }[]>([]);

  const [filters, setFilters] = useState({
    recruiter: 'all',
    candidate: 'all',
    client: 'all',
    vendor: 'all',
    technology: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (filters.recruiter !== 'all') params.recruiterId = filters.recruiter;
        if (filters.client !== 'all') params.client = filters.client;
        if (filters.vendor !== 'all') params.vendor = filters.vendor;
        if (filters.technology !== 'all') params.technology = filters.technology;
        if (filters.status !== 'all') params.status = filters.status;
        if (filters.dateFrom) params.startDate = filters.dateFrom;
        if (filters.dateTo) params.endDate = filters.dateTo;
        if (searchQuery) params.search = searchQuery;

        const response = await SubmissionService.getAllSubmissions(params);

        const mappedSubmissions = response.submissions.map(sub => {
          const candidate = sub.candidate;
          const recruiter = sub.recruiter;

          return {
            ...sub,
            id: sub._id,
            notes: sub.notes || '',
            candidateName: candidate && typeof candidate === 'object' ? (candidate as any).name : (candidate || 'N/A'),
            recruiterName: recruiter && typeof recruiter === 'object' ? (recruiter as any).name : (recruiter || 'N/A'),
          };
        });
        setSubmissions(mappedSubmissions);
      } catch (err: any) {
        console.error('Failed to fetch submissions:', err);
        setError(err.message || 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const data = await SubmissionService.getAnalytics();
        setAnalytics(data.analytics);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      }
    };

    fetchSubmissions();
    fetchAnalytics();
  }, [filters, searchQuery]);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const UserService = (await import('../../services/user.service')).default;
        const response = await UserService.getAllUsers({ role: 'recruiter' });
        setRecruiters(response.users.map(u => ({ id: u._id, name: u.name })));
      } catch (err) {
        console.error('Failed to fetch recruiters:', err);
      }
    };
    fetchRecruiters();
  }, []);

  const filteredSubmissions = submissions.filter(sub => {
    const candidateStr = (sub as any).candidateName || '';
    const recruiterStr = (sub as any).recruiterName || '';
    const clientStr = sub.client || '';
    const techStr = sub.technology || '';

    const matchesSearch =
      candidateStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruiterStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      techStr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (filters.recruiter === 'all' || (sub.recruiter && typeof sub.recruiter === 'object' && sub.recruiter._id === filters.recruiter)) &&
      (filters.client === 'all' || clientStr === filters.client) &&
      (filters.technology === 'all' || techStr === filters.technology) &&
      (filters.status === 'all' || sub.status === filters.status);

    return matchesSearch && matchesFilters;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await SubmissionService.deleteSubmission(id);
        setSubmissions(prev => prev.filter(s => s.id !== id));
      } catch (err: any) {
        console.error('Delete error:', err);
        setError(err.message || 'Failed to delete submission');
      }
    }
  };

  const dashboardStats = {
    total: analytics?.total || submissions.length,
    pending: analytics?.status?.SUBMITTED || submissions.filter(s => s.status === 'SUBMITTED').length,
    interview: analytics?.status?.INTERVIEWING || submissions.filter(s => s.status === 'INTERVIEWING').length,
    placed: analytics?.status?.PLACED || submissions.filter(s => s.status === 'PLACED').length,
  };

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.recruiter !== 'all') params.recruiterId = filters.recruiter;
      if (filters.client !== 'all') params.client = filters.client;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.dateFrom) params.fromDate = filters.dateFrom;
      if (filters.dateTo) params.toDate = filters.dateTo;

      const blob = await SubmissionService.exportCSV(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message || 'Failed to export CSV');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.recruiter !== 'all') params.recruiterId = filters.recruiter;
      if (filters.client !== 'all') params.client = filters.client;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.dateFrom) params.fromDate = filters.dateFrom;
      if (filters.dateTo) params.toDate = filters.dateTo;

      const blob = await SubmissionService.exportPDF(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message || 'Failed to export PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl animate-shake">
          {error}
          <button onClick={() => window.location.reload()} className="ml-4 underline">Retry</button>
        </div>
      )}

      {loading && !submissions.length && (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      )}

      { }
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />

        <div className="relative flex items-center justify-between animate-slide-in">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-glow-blue animate-pulse-glow">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-5xl text-gradient-premium">Submissions</h1>
                <p className="text-slate-400 mt-1 text-sm">Manage all candidate submissions and interviews</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Upload className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="relative z-10 text-slate-300 font-medium">Upload Excel</span>
            </button>
          </div>
        </div>
      </div>

      { }
      <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Submissions', value: dashboardStats.total, gradient: 'from-blue-500 to-cyan-500', icon: FileText },
          { label: 'Pending', value: dashboardStats.pending, gradient: 'from-yellow-500 to-orange-500', icon: Calendar },
          { label: 'In Interview', value: dashboardStats.interview, gradient: 'from-purple-500 to-pink-500', icon: User },
          { label: 'Placed', value: dashboardStats.placed, gradient: 'from-green-500 to-emerald-500', icon: Sparkles },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                  <p className="text-4xl premium-text mb-1">{stat.value}</p>
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
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-all duration-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate, recruiter, client, technology..."
              className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:bg-white/10"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`group relative px-6 py-4 glass rounded-2xl transition-all duration-300 flex items-center gap-3 overflow-hidden ${showFilters ? 'bg-blue-500/20 border-blue-500/30 shadow-glow-blue' : 'hover:bg-white/10'}`}
          >
            <Filter className={`w-5 h-5 relative z-10 ${showFilters ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`} />
            <span className={`relative z-10 font-medium ${showFilters ? 'text-blue-400' : 'text-slate-300'}`}>Filters</span>
            <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-300 ${showFilters ? 'rotate-180 text-blue-400' : 'text-slate-400'}`} />
          </button>

          <button
            onClick={() => setFilters({
              recruiter: 'all',
              candidate: 'all',
              client: 'all',
              vendor: 'all',
              technology: 'all',
              status: 'all',
              dateFrom: '',
              dateTo: '',
            })}
            className="px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium"
          >
            Clear
          </button>

          <button
            onClick={handleExportCSV}
            disabled={loading}
            className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden disabled:opacity-50"
          >
            <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span className="relative z-10 text-slate-300 font-medium">Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={loading}
            className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden disabled:opacity-50"
          >
            <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span className="relative z-10 text-slate-300 font-medium">Export PDF</span>
          </button>
        </div>

        { }
        {showFilters && (
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10 animate-slide-in">
            <div>
              <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">Recruiter</label>
              <select
                value={filters.recruiter}
                onChange={(e) => setFilters({ ...filters, recruiter: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/10 appearance-none cursor-pointer"
              >
                <option value="all">All Recruiters</option>
                {recruiters.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            {[
              { label: 'Client', value: filters.client, key: 'client', options: ['all', 'TechCorp', 'DataInc', 'CloudSys', 'FinTech'] },
              { label: 'Technology', value: filters.technology, key: 'technology', options: ['all', 'React', 'Python', 'AWS', 'Java', 'Node.js'] },
              { label: 'Status', value: filters.status, key: 'status', options: ['all', 'SUBMITTED', 'INTERVIEWING', 'OFFERED', 'PLACED', 'REJECTED', 'ON_HOLD', 'WITHDRAWN', 'CLOSED'] },
            ].map((filter, index) => (
              <div key={index}>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">{filter.label}</label>
                <select
                  value={filter.value}
                  onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/10 appearance-none cursor-pointer capitalize"
                >
                  {filter.options.map(opt => (
                    <option key={opt} value={opt} className="capitalize">{opt === 'all' ? 'All' : opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      { }
      <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in" style={{ animationDelay: '300ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark border-b border-white/10">
              <tr>
                <th className="px-8 py-5 text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold group cursor-pointer hover:text-blue-400 transition-colors">
                    <span>Candidate</span>
                    <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </th>
                <th className="px-8 py-5 text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    <span>Recruiter</span>
                  </div>
                </th>
                <th className="px-8 py-5 text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    <span>Client</span>
                  </div>
                </th>
                <th className="px-8 py-5 text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    <span>Technology</span>
                  </div>
                </th>
                <th className="px-8 py-5 text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold group cursor-pointer hover:text-blue-400 transition-colors">
                    <span>Date</span>
                    <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </th>
                <th className="px-8 py-5 text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    <span>Status</span>
                  </div>
                </th>
                <th className="px-8 py-5 text-right">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSubmissions.map((submission, index) => (
                <tr
                  key={submission.id}
                  className="group hover:bg-gradient-to-r hover:from-blue-500/5 hover:via-cyan-500/5 hover:to-blue-500/5 transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-glow-blue">
                        {((submission as any).candidateName || '').split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium">{(submission as any).candidateName}</p>
                        <p className="text-xs text-slate-500">{submission.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-400">{(submission as any).recruiterName}</td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300">{submission.client}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                      {submission.technology}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-400 text-sm">
                    {new Date(submission.submissionDate || submission.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${statusColors[submission.status]?.bg || 'bg-slate-500/20'} ${statusColors[submission.status]?.text || 'text-slate-400'} border ${statusColors[submission.status]?.border || 'border-slate-500/30'}`}>
                      <div className={`w-2 h-2 rounded-full ${submission.status.toLowerCase() === 'placed' ? 'bg-green-400 animate-pulse-glow' : (statusColors[submission.status]?.text || 'text-slate-400').replace('text-', 'bg-')}`} />
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 transition-all duration-300">
                      <button
                        onClick={() => { setSelectedSubmission(submission); setShowInterviewsModal(true); }}
                        className="p-3 glass rounded-xl hover:bg-purple-500/20 hover:text-purple-400 hover:shadow-glow-purple transition-all duration-300 transform hover:scale-110"
                        title="Manage Interviews"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowDetailModal(true);
                        }}
                        className="p-3 glass rounded-xl hover:bg-blue-500/20 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300 transform hover:scale-110"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowDetailModal(true);
                        }}
                        className="p-3 glass rounded-xl hover:bg-purple-500/20 hover:text-purple-400 hover:shadow-glow-purple transition-all duration-300 transform hover:scale-110"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="p-3 glass rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 transform hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        { }
        <div className="glass-dark px-8 py-5 flex items-center justify-between border-t border-white/10">
          <p className="text-sm text-slate-400">
            Showing <span className="text-blue-400 font-semibold">{filteredSubmissions.length}</span> of <span className="text-slate-300 font-semibold">{submissions.length}</span> submissions
          </p>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 glass rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 font-medium">Previous</button>
            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl text-sm text-white font-semibold shadow-glow-blue">1</button>
            <button className="px-5 py-2.5 glass rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 font-medium">2</button>
            <button className="px-5 py-2.5 glass rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 font-medium">Next</button>
          </div>
        </div>
      </div>

      { }
      {showDetailModal && selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSubmission(null);
          }}
          onUpdate={(id, updatedData) => {
            setSubmissions(prev => prev.map(sub =>
              sub.id === id ? { ...sub, ...updatedData } : sub
            ));
          }}
        />
      )}

      {showInterviewsModal && selectedSubmission && (
        <InterviewManagementModal
          submissionId={selectedSubmission.id}
          candidateName={(selectedSubmission as any).candidateName}
          onClose={() => setShowInterviewsModal(false)}
          onUpdate={() => {
            // Optionally refresh submissions to get updated interview count
          }}
        />
      )}

      { }
      {showUploadModal && (
        <UploadExcelModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}

function SubmissionDetailModal({ submission, onClose, onUpdate }: {
  submission: SubmissionData;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Submission>) => void;
}) {
  const [status, setStatus] = useState(submission.status);
  const [notes, setNotes] = useState(submission.notes);
  const [role, setRole] = useState(submission.role || '');
  const [customFields, setCustomFields] = useState<Record<string, any>>(submission.customFields || {});
  const [reviewer, setReviewer] = useState(typeof submission.reviewer === 'object' ? (submission.reviewer as any)?._id : (submission.reviewer || ''));
  const [reviewers, setReviewers] = useState<{ id: string, name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const UserService = (await import('../../services/user.service')).default;
        const response = await UserService.getAllUsers({ role: 'admin' });
        setReviewers(response.users.map(u => ({ id: u._id, name: u.name })));
      } catch (err) {
        console.error('Failed to fetch admins:', err);
      }
    };
    fetchAdmins();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await SubmissionService.updateSubmission(submission.id, {
        status,
        notes,
        role,
        customFields
      });

      if (reviewer !== (typeof submission.reviewer === 'object' ? (submission.reviewer as any)?._id : submission.reviewer)) {
        await SubmissionService.assignReviewer(submission.id, reviewer);
      }

      onUpdate(submission.id, { status, notes, role, customFields });
      onClose();
    } catch (err: any) {
      console.error('Update error:', err);
      alert(err.message || 'Failed to update submission');
    } finally {
      setSaving(false);
    }
  };

  const handleCustomFieldChange = (key: string, value: any) => {
    setCustomFields(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-[100] p-6 animate-slide-in">
      <div className="relative glass rounded-3xl p-10 max-w-4xl w-full shadow-premium border-2 border-white/10 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-glow-blue">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl text-gradient-premium">Submission Details</h2>
              <p className="text-sm text-slate-400 mt-1">{(submission as any).candidateName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 glass hover:bg-red-500/20 rounded-xl transition-all duration-300 group">
            <X className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Candidate</label>
                <p className="text-slate-200 text-lg">{(submission as any).candidateName}</p>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Recruiter</label>
                <p className="text-slate-200 text-lg">{(submission as any).recruiterName}</p>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Client</label>
                <p className="text-slate-200 text-lg">{submission.client}</p>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Vendor</label>
                <p className="text-slate-200 text-lg">{submission.vendor || 'Direct'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">Role/Position</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 transition-all hover:bg-white/10"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">Assign Reviewer</label>
                <select
                  value={reviewer}
                  onChange={(e) => setReviewer(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 appearance-none cursor-pointer transition-all hover:bg-white/10"
                >
                  <option value="">No Reviewer Assigned</option>
                  {reviewers.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 appearance-none cursor-pointer transition-all hover:bg-white/10 capitalize"
                >
                  <option value="SUBMITTED">Submitted</option>
                  <option value="INTERVIEWING">Interviewing</option>
                  <option value="OFFERED">Offered</option>
                  <option value="PLACED">Placed</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-3">Custom Fields</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Technology', key: 'Technology' },
                  { label: 'Location', key: 'Location' },
                  { label: 'Rate', key: 'Rate' },
                  { label: 'Implementation', key: 'Implementation' }
                ].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs text-slate-500">{field.label}</label>
                    <input
                      type="text"
                      value={customFields[field.key] || ''}
                      onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm text-slate-200 transition-all hover:bg-white/10"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 glass rounded-xl bg-blue-500/5">
                <p className="text-xs text-slate-500 mb-2">Interview History</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">{Array.isArray(submission.interviews) ? submission.interviews.length : 0} rounds completed/scheduled</span>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10 resize-none text-sm"
                placeholder="Add notes about this submission..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 relative px-6 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl overflow-hidden shadow-premium hover:shadow-glow-blue transition-all duration-500 group disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 text-white font-semibold">
                  {saving ? 'Saving...' : 'Save Changes'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadExcelModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const result = await SubmissionService.importSubmissions(file);
      setSuccess(`Successfully imported ${result.imported} submissions!`);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-[100] p-6 animate-slide-in">
      <div className="relative glass rounded-3xl p-10 max-w-lg w-full shadow-premium border-2 border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-glow-blue">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl text-gradient-premium">Upload Excel</h2>
              <p className="text-sm text-slate-400 mt-1">Import bulk submissions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 glass hover:bg-red-500/20 rounded-xl transition-all duration-300 group">
            <X className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm">
              {success}
            </div>
          )}

          <div
            className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer relative"
            onClick={() => document.getElementById('excel-upload')?.click()}
          >
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className={`w-12 h-12 mx-auto mb-4 ${file ? 'text-blue-400' : 'text-slate-400'}`} />
            <p className="text-slate-300 mb-2">{file ? file.name : 'Click to upload or drag and drop'}</p>
            <p className="text-xs text-slate-500">Excel files only (.xlsx, .xls)</p>
          </div>

          <div className="glass rounded-xl p-4">
            <p className="text-sm text-slate-300 mb-3 font-medium">Required Columns:</p>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Candidate Name</li>
              <li>• Recruiter Name</li>
              <li>• Client Name</li>
              <li>• Vendor Name</li>
              <li>• Technology/Skills</li>
              <li>• Role</li>
              <li>• Submission Date</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-6 py-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="flex-1 relative px-6 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl overflow-hidden shadow-premium hover:shadow-glow-blue transition-all duration-500 group disabled:opacity-50"
            >
              <span className="relative z-10 text-white font-semibold">
                {uploading ? 'Uploading...' : 'Upload'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

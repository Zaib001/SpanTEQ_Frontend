import { useState } from 'react';
import { 
  Search, Filter, Download, Upload, X, Eye, Edit, Trash2, 
  FileText, User, Briefcase, Calendar, MapPin, Sparkles,
  ChevronDown, ArrowUpDown
} from 'lucide-react';

interface SubmissionData {
  id: string;
  candidate: string;
  recruiter: string;
  client: string;
  vendor: string;
  technology: string;
  role: string;
  date: string;
  status: 'pending' | 'submitted' | 'interview' | 'offered' | 'placed' | 'rejected';
  notes: string;
  interviews?: number;
}

const mockSubmissions: SubmissionData[] = [
  { id: '1', candidate: 'John Doe', recruiter: 'Sarah Johnson', client: 'TechCorp', vendor: 'VendorA', technology: 'React', role: 'Frontend Developer', date: '2024-03-15', status: 'interview', notes: 'Second round scheduled', interviews: 2 },
  { id: '2', candidate: 'Jane Smith', recruiter: 'Michael Chen', client: 'DataInc', vendor: 'VendorB', technology: 'Python', role: 'Data Engineer', date: '2024-03-14', status: 'placed', notes: 'Offer accepted', interviews: 3 },
  { id: '3', candidate: 'Bob Wilson', recruiter: 'Sarah Johnson', client: 'CloudSys', vendor: 'VendorC', technology: 'AWS', role: 'Cloud Architect', date: '2024-03-13', status: 'offered', notes: 'Awaiting response', interviews: 3 },
  { id: '4', candidate: 'Alice Brown', recruiter: 'Emily Davis', client: 'FinTech', vendor: 'VendorA', technology: 'Java', role: 'Backend Developer', date: '2024-03-12', status: 'submitted', notes: 'Profile sent', interviews: 0 },
  { id: '5', candidate: 'Charlie Davis', recruiter: 'Michael Chen', client: 'StartupX', vendor: 'VendorB', technology: 'Node.js', role: 'Full Stack Developer', date: '2024-03-11', status: 'rejected', notes: 'Not a fit', interviews: 1 },
];

const statusColors = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  submitted: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  interview: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  offered: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  placed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionData[]>(mockSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  
  // Filters
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

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.recruiter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.technology.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = 
      (filters.recruiter === 'all' || sub.recruiter === filters.recruiter) &&
      (filters.client === 'all' || sub.client === filters.client) &&
      (filters.technology === 'all' || sub.technology === filters.technology) &&
      (filters.status === 'all' || sub.status === filters.status);
    
    return matchesSearch && matchesFilters;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    interview: submissions.filter(s => s.status === 'interview').length,
    placed: submissions.filter(s => s.status === 'placed').length,
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Submissions', value: stats.total, gradient: 'from-blue-500 to-cyan-500', icon: FileText },
          { label: 'Pending', value: stats.pending, gradient: 'from-yellow-500 to-orange-500', icon: Calendar },
          { label: 'In Interview', value: stats.interview, gradient: 'from-purple-500 to-pink-500', icon: User },
          { label: 'Placed', value: stats.placed, gradient: 'from-green-500 to-emerald-500', icon: Sparkles },
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

      {/* Controls */}
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

          <button className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden">
            <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span className="relative z-10 text-slate-300 font-medium">Export CSV</span>
          </button>

          <button className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden">
            <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span className="relative z-10 text-slate-300 font-medium">Export PDF</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10 animate-slide-in">
            {[
              { label: 'Recruiter', value: filters.recruiter, key: 'recruiter', options: ['all', 'Sarah Johnson', 'Michael Chen', 'Emily Davis'] },
              { label: 'Client', value: filters.client, key: 'client', options: ['all', 'TechCorp', 'DataInc', 'CloudSys', 'FinTech'] },
              { label: 'Technology', value: filters.technology, key: 'technology', options: ['all', 'React', 'Python', 'AWS', 'Java', 'Node.js'] },
              { label: 'Status', value: filters.status, key: 'status', options: ['all', 'pending', 'submitted', 'interview', 'offered', 'placed', 'rejected'] },
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

      {/* Submissions Table */}
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
                        {submission.candidate.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium">{submission.candidate}</p>
                        <p className="text-xs text-slate-500">{submission.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-400">{submission.recruiter}</td>
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
                    {new Date(submission.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${statusColors[submission.status].bg} ${statusColors[submission.status].text} border ${statusColors[submission.status].border}`}>
                      <div className={`w-2 h-2 rounded-full ${submission.status === 'placed' ? 'bg-green-400 animate-pulse-glow' : statusColors[submission.status].text.replace('text-', 'bg-')}`} />
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowDetailModal(true);
                        }}
                        className="p-3 glass rounded-xl hover:bg-blue-500/20 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300 transform hover:scale-110"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-3 glass rounded-xl hover:bg-purple-500/20 hover:text-purple-400 hover:shadow-glow-purple transition-all duration-300 transform hover:scale-110">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-3 glass rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 transform hover:scale-110">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSubmission(null);
          }}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadExcelModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}

function SubmissionDetailModal({ submission, onClose }: { submission: SubmissionData; onClose: () => void }) {
  const [status, setStatus] = useState(submission.status);
  const [notes, setNotes] = useState(submission.notes);

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-6 animate-slide-in">
      <div className="relative glass rounded-3xl p-10 max-w-2xl w-full shadow-premium border-2 border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-glow-blue">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl text-gradient-premium">Submission Details</h2>
              <p className="text-sm text-slate-400 mt-1">{submission.candidate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 glass hover:bg-red-500/20 rounded-xl transition-all duration-300 group">
            <X className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Candidate</label>
              <p className="text-slate-200 text-lg">{submission.candidate}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Recruiter</label>
              <p className="text-slate-200 text-lg">{submission.recruiter}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Client</label>
              <p className="text-slate-200 text-lg">{submission.client}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Vendor</label>
              <p className="text-slate-200 text-lg">{submission.vendor}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Technology</label>
              <p className="text-slate-200 text-lg">{submission.technology}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Interview Rounds</label>
              <p className="text-slate-200 text-lg">{submission.interviews || 0}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 appearance-none cursor-pointer transition-all hover:bg-white/10 capitalize"
            >
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="placed">Placed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10 resize-none"
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
            <button className="flex-1 relative px-6 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl overflow-hidden shadow-premium hover:shadow-glow-blue transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 text-white font-semibold">Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadExcelModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-6 animate-slide-in">
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
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">Click to upload or drag and drop</p>
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
            <button onClick={onClose} className="flex-1 px-6 py-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium">
              Cancel
            </button>
            <button className="flex-1 relative px-6 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl overflow-hidden shadow-premium hover:shadow-glow-blue transition-all duration-500 group">
              <span className="relative z-10 text-white font-semibold">Upload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

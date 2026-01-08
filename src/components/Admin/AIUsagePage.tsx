import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Bot, Search, Filter, Download, X, Eye, Calendar, User, Clock,
  Video, MessageSquare, ChevronDown, BarChart3,
  CheckCircle, AlertCircle, XCircle, FileText, Zap, Users, Activity,
  Brain, Target, Star, ThumbsUp, ThumbsDown, Loader2
} from 'lucide-react';
import AIService, { type AISession, type AIAnalytics } from '../../services/ai.service';

const interviewTypeColors: Record<string, { bg: string, text: string, icon: any }> = {
  screening: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-400', icon: Users },
  technical: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-400', icon: Brain },
  behavioral: { bg: 'from-green-500 to-emerald-500', text: 'text-green-400', icon: MessageSquare },
  final: { bg: 'from-orange-500 to-amber-500', text: 'text-orange-400', icon: Star },
};

const statusColors: Record<string, { bg: string, text: string, border: string, icon: any }> = {
  Completed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle },
  Active: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: Activity },
  Incomplete: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: AlertCircle },
  failed: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle },
};

const sentimentColors: Record<string, { bg: string, text: string, icon: any }> = {
  positive: { bg: 'from-green-500 to-emerald-500', text: 'text-green-400', icon: ThumbsUp },
  neutral: { bg: 'from-slate-500 to-gray-500', text: 'text-slate-400', icon: MessageSquare },
  negative: { bg: 'from-red-500 to-rose-500', text: 'text-red-400', icon: ThumbsDown },
};

export function AIUsagePage() {
  const [sessions, setSessions] = useState<AISession[]>([]);
  const [analytics, setAnalytics] = useState<AIAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AISession | null>(null);

  const [filters, setFilters] = useState({
    candidate: 'all',
    recruiter: 'all',
    interviewType: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [sessionsData, analyticsData] = await Promise.all([
        AIService.getAISessions(),
        AIService.getAIAnalytics()
      ]);
      setSessions(sessionsData);
      setAnalytics(analyticsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch AI analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch =
        session.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.recruiter.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters =
        (filters.candidate === 'all' || session.candidateName === filters.candidate) &&
        (filters.recruiter === 'all' || session.recruiter === filters.recruiter) &&
        (filters.interviewType === 'all' || session.purpose.toLowerCase() === filters.interviewType) &&
        (filters.status === 'all' || session.sessionStatus === filters.status);

      return matchesSearch && matchesFilters;
    });
  }, [sessions, searchQuery, filters]);

  const stats = useMemo(() => {
    if (!analytics) return {
      totalSessions: 0,
      completedSessions: 0,
      totalDuration: 0,
      totalTokens: 0,
      totalCost: 0,
      avgScore: 0,
      activeCandidates: 0,
      activeRecruiters: 0,
    };
    return analytics;
  }, [analytics]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex items-center gap-6 text-red-400 glass">
          <AlertCircle className="w-10 h-10" />
          <div>
            <h3 className="text-xl font-bold mb-1">Error Loading Analytics</h3>
            <p className="text-red-400/80">{error}</p>
          </div>
          <button
            onClick={() => fetchData()}
            className="ml-auto px-6 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-2xl transition-all font-bold border border-red-500/30"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const TypeIconComponent = ({ type }: { type: string }) => {
    const Icon = interviewTypeColors[type.toLowerCase()]?.icon || Brain;
    return <Icon className="w-8 h-8 text-white" />;
  };

  return (
    <div className="p-8 space-y-6">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-fuchsia-500/20 rounded-2xl border border-fuchsia-500/30">
            <Bot className="w-8 h-8 text-fuchsia-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              AI Interview Analytics
            </h1>
            <p className="text-slate-400 flex items-center gap-2 mt-1">
              <Zap className="w-4 h-4 text-fuchsia-400" />
              Real-time monitoring and quality assessment of AI evaluate sessions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all font-bold border border-slate-700 group ring-1 ring-white/5 active:scale-95"
          >
            <Activity className="w-5 h-5 text-fuchsia-400 group-hover:animate-pulse" />
            Refresh Data
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-2xl transition-all font-bold shadow-lg shadow-fuchsia-500/20 active:scale-95">
            <Download className="w-5 h-5" />
            Export Analytics
          </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sessions', value: stats.totalSessions, icon: Video, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Completed', value: stats.completedSessions, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Avg AI Score', value: `${Math.round(stats.avgScore)}%`, icon: Target, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
          { label: 'Total Duration', value: `${Math.round(stats.totalDuration / 60)}h`, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <div key={i} className="group relative overflow-hidden glass rounded-[2.5rem] p-8 border border-white/5 hover:border-white/10 transition-all duration-500">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[80px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
            <div className="relative z-10">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <p className="text-slate-400 font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Tokens Used', value: stats.totalTokens.toLocaleString(), icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Total Cost', value: formatCurrency(stats.totalCost), icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Active Recruiters', value: stats.activeRecruiters, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="group relative overflow-hidden glass rounded-[2rem] p-6 border border-white/5 hover:border-white/10 transition-all duration-500">
            <div className="relative z-10 flex items-center gap-6">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ring-1 ring-white/10`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                <h3 className="text-xl font-bold tracking-tight">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="glass rounded-[3rem] border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-fuchsia-400 transition-colors" />
              <input
                type="text"
                placeholder="Search candidate, position, or recruiter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500/30 transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all font-bold border active:scale-95 ${showFilters
                    ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400 shadow-lg shadow-fuchsia-500/10'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
              >
                <Filter className="w-5 h-5" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <div className="h-10 w-px bg-white/5 hidden lg:block" />
              <div className="text-sm text-slate-500 font-medium px-4">
                Showing <span className="text-slate-300">{filteredSessions.length}</span> of <span className="text-slate-300">{sessions.length}</span> sessions
              </div>
            </div>
          </div>

          {}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-slate-900/40 rounded-3xl border border-white/5 animate-in slide-in-from-top duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Candidate</label>
                <select
                  value={filters.candidate}
                  onChange={(e) => setFilters({ ...filters, candidate: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-fuchsia-500/20 outline-none"
                >
                  <option value="all">All Candidates</option>
                  {Array.from(new Set(sessions.map(s => s.candidateName))).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Interview Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-fuchsia-500/20 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Active">Active</option>
                  <option value="Incomplete">Incomplete</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-fuchsia-500/20 outline-none text-slate-300"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    candidate: 'all', recruiter: 'all', interviewType: 'all',
                    status: 'all', dateFrom: '', dateTo: ''
                  })}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-6 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">Session Details</th>
                <th className="px-6 py-6 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">Metrics</th>
                <th className="px-6 py-6 text-left text-xs font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">AI evaluation</th>
                <th className="px-6 py-6 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-right text-xs font-bold text-slate-300 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredSessions.map((session) => {
                const statusInfo = statusColors[session.sessionStatus] || statusColors.Active;
                const sentimentInfo = sentimentColors[session.sentiment] || sentimentColors.neutral;

                return (
                  <tr key={session.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
                          {session.candidateName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 group-hover:text-fuchsia-400 transition-colors">{session.candidateName}</p>
                          <p className="text-xs text-slate-500 font-medium">{session.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <User className="w-3.5 h-3.5" />
                          {session.recruiter}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(session.interviewDate).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {session.duration} mins
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Zap className="w-3.5 h-3.5" />
                          {session.tokensUsed.toLocaleString()} tokens
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`text-xl font-black ${session.aiScore >= 80 ? 'text-green-400' : session.aiScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {session.aiScore}
                          </div>
                          <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden max-w-[60px]">
                            <div
                              className={`h-full bg-gradient-to-r ${session.aiScore >= 80 ? 'from-green-500 to-emerald-500' : session.aiScore >= 60 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-rose-500'}`}
                              style={{ width: `${session.aiScore}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <sentimentInfo.icon className={`w-3.5 h-3.5 ${sentimentInfo.text}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${sentimentInfo.text}`}>
                            {session.sentiment}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                        <statusInfo.icon className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">{session.sessionStatus}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedSession(session);
                          setShowDetailModal(true);
                        }}
                        className="p-3 bg-slate-800 hover:bg-fuchsia-500/20 text-slate-400 hover:text-fuchsia-400 rounded-xl transition-all active:scale-95"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 text-slate-500">
              <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-xl font-bold mb-2">No sessions found</p>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {}
      {showDetailModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setShowDetailModal(false)}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass border border-white/10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 no-scrollbar overflow-x-hidden">
            {}
            <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-900/50 backdrop-blur-xl z-10">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${interviewTypeColors[selectedSession.purpose.toLowerCase()]?.bg || interviewTypeColors.screening.bg} flex items-center justify-center shadow-lg`}>
                  <TypeIconComponent type={selectedSession.purpose} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedSession.candidateName}</h2>
                  <p className="text-slate-400 font-medium">Session ID: {selectedSession.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-slate-800/40 rounded-3xl border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Score</p>
                  <p className="text-3xl font-black text-fuchsia-400">{selectedSession.aiScore}%</p>
                </div>
                <div className="p-6 bg-slate-800/40 rounded-3xl border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Time spent</p>
                  <p className="text-2xl font-bold">{selectedSession.duration} mins</p>
                </div>
                <div className="p-6 bg-slate-800/40 rounded-3xl border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Cost</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(selectedSession.cost)}</p>
                </div>
                <div className="p-6 bg-slate-800/40 rounded-3xl border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</p>
                  <p className={`font-bold ${statusColors[selectedSession.sessionStatus]?.text || 'text-slate-400'}`}>
                    {selectedSession.sessionStatus}
                  </p>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-fuchsia-400" />
                    Interview Transcript Summary
                  </h3>
                  <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5 space-y-4">
                    <p className="text-slate-300 leading-relaxed italic">
                      "{selectedSession.notes}"
                    </p>
                    <div className="h-px bg-white/5" />
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Key Topics Discussed</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSession.keyTopics.map((topic, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold text-slate-400">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Activity className="w-6 h-6 text-fuchsia-400" />
                    AI evaluate Deep Dive
                  </h3>
                  <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5 space-y-6">
                    <div className="space-y-2 text-fuchsia-400">
                      <div className="flex justify-between text-sm font-bold">
                        <span>Sentiment evaluation</span>
                        <span className="capitalize">{selectedSession.sentiment}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${sentimentColors[selectedSession.sentiment]?.bg || 'from-slate-500 to-gray-500'}`}
                          style={{ width: selectedSession.sentiment === 'positive' ? '100%' : selectedSession.sentiment === 'neutral' ? '50%' : '20%' }}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: 'Technical Depth', value: 85 },
                        { label: 'Communication', value: 92 },
                        { label: 'Problem Solving', value: 78 }
                      ].map((metric, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>{metric.label}</span>
                            <span>{metric.value}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-600" style={{ width: `${metric.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="flex items-center gap-4 pt-4">
                <button className="flex-1 flex items-center justify-center gap-3 bg-fuchsia-500 hover:bg-fuchsia-600 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-fuchsia-500/20">
                  <FileText className="w-5 h-5" />
                  Generate Full Report
                </button>
                <button className="flex-1 flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold transition-all active:scale-95 border border-slate-700">
                  <Video className="w-5 h-5" />
                  View Recording
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

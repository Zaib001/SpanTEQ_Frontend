import { useState } from 'react';
import { 
  Bot, Search, Filter, Download, X, Eye, Calendar, User, Clock,
  Video, MessageSquare, TrendingUp, Sparkles, ChevronDown, BarChart3,
  CheckCircle, AlertCircle, XCircle, FileText, Zap, Users, Activity,
  Brain, Target, Star, ThumbsUp, ThumbsDown
} from 'lucide-react';

interface AIInterviewSession {
  id: string;
  candidate: string;
  position: string;
  recruiter: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  questionsAsked: number;
  tokensUsed: number;
  interviewType: 'screening' | 'technical' | 'behavioral' | 'final';
  status: 'completed' | 'in-progress' | 'interrupted' | 'failed';
  aiScore: number; // 0-100
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  cost: number;
  notes: string;
}

const mockSessions: AIInterviewSession[] = [
  { 
    id: 'AI-001', 
    candidate: 'Sarah Johnson', 
    position: 'Senior React Developer', 
    recruiter: 'John Smith',
    startTime: '2024-03-15 10:30 AM', 
    endTime: '2024-03-15 11:15 AM',
    duration: 45, 
    questionsAsked: 12,
    tokensUsed: 8500,
    interviewType: 'technical',
    status: 'completed',
    aiScore: 92,
    sentiment: 'positive',
    keyTopics: ['React Hooks', 'State Management', 'Performance'],
    cost: 1.28,
    notes: 'Strong technical skills, excellent communication'
  },
  { 
    id: 'AI-002', 
    candidate: 'Michael Chen', 
    position: 'DevOps Engineer', 
    recruiter: 'Jane Doe',
    startTime: '2024-03-15 02:00 PM', 
    endTime: '2024-03-15 02:35 PM',
    duration: 35, 
    questionsAsked: 10,
    tokensUsed: 6200,
    interviewType: 'screening',
    status: 'completed',
    aiScore: 78,
    sentiment: 'neutral',
    keyTopics: ['AWS', 'Docker', 'CI/CD'],
    cost: 0.93,
    notes: 'Good basic knowledge, needs more experience'
  },
  { 
    id: 'AI-003', 
    candidate: 'Emily Rodriguez', 
    position: 'UX Designer', 
    recruiter: 'John Smith',
    startTime: '2024-03-15 03:30 PM', 
    endTime: '2024-03-15 04:25 PM',
    duration: 55, 
    questionsAsked: 15,
    tokensUsed: 11000,
    interviewType: 'behavioral',
    status: 'completed',
    aiScore: 88,
    sentiment: 'positive',
    keyTopics: ['User Research', 'Design Systems', 'Collaboration'],
    cost: 1.65,
    notes: 'Excellent portfolio, great cultural fit'
  },
  { 
    id: 'AI-004', 
    candidate: 'David Park', 
    position: 'Data Scientist', 
    recruiter: 'Jane Doe',
    startTime: '2024-03-14 11:00 AM', 
    endTime: '2024-03-14 11:28 AM',
    duration: 28, 
    questionsAsked: 8,
    tokensUsed: 4800,
    interviewType: 'technical',
    status: 'interrupted',
    aiScore: 0,
    sentiment: 'neutral',
    keyTopics: ['Machine Learning', 'Python'],
    cost: 0.72,
    notes: 'Technical issues during interview'
  },
  { 
    id: 'AI-005', 
    candidate: 'Lisa Wang', 
    position: 'Product Manager', 
    recruiter: 'John Smith',
    startTime: '2024-03-14 09:00 AM', 
    endTime: '2024-03-14 10:05 AM',
    duration: 65, 
    questionsAsked: 18,
    tokensUsed: 13500,
    interviewType: 'final',
    status: 'completed',
    aiScore: 95,
    sentiment: 'positive',
    keyTopics: ['Product Strategy', 'Stakeholder Management', 'Agile'],
    cost: 2.03,
    notes: 'Exceptional candidate, highly recommended'
  },
  { 
    id: 'AI-006', 
    candidate: 'Robert Taylor', 
    position: 'Backend Developer', 
    recruiter: 'Jane Doe',
    startTime: '2024-03-13 02:30 PM', 
    endTime: '2024-03-13 03:10 PM',
    duration: 40, 
    questionsAsked: 11,
    tokensUsed: 7200,
    interviewType: 'technical',
    status: 'completed',
    aiScore: 65,
    sentiment: 'negative',
    keyTopics: ['Node.js', 'APIs', 'Databases'],
    cost: 1.08,
    notes: 'Limited experience, not suitable for senior role'
  },
];

const interviewTypeColors = {
  screening: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-400', icon: Users },
  technical: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-400', icon: Brain },
  behavioral: { bg: 'from-green-500 to-emerald-500', text: 'text-green-400', icon: MessageSquare },
  final: { bg: 'from-orange-500 to-amber-500', text: 'text-orange-400', icon: Star },
};

const statusColors = {
  completed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle },
  'in-progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: Activity },
  interrupted: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: AlertCircle },
  failed: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle },
};

const sentimentColors = {
  positive: { bg: 'from-green-500 to-emerald-500', text: 'text-green-400', icon: ThumbsUp },
  neutral: { bg: 'from-slate-500 to-gray-500', text: 'text-slate-400', icon: MessageSquare },
  negative: { bg: 'from-red-500 to-rose-500', text: 'text-red-400', icon: ThumbsDown },
};

export function AIUsagePage() {
  const [sessions, setSessions] = useState<AIInterviewSession[]>(mockSessions);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AIInterviewSession | null>(null);
  
  const [filters, setFilters] = useState({
    candidate: 'all',
    recruiter: 'all',
    interviewType: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.recruiter.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = 
      (filters.candidate === 'all' || session.candidate === filters.candidate) &&
      (filters.recruiter === 'all' || session.recruiter === filters.recruiter) &&
      (filters.interviewType === 'all' || session.interviewType === filters.interviewType) &&
      (filters.status === 'all' || session.status === filters.status);
    
    return matchesSearch && matchesFilters;
  });

  const stats = {
    totalSessions: sessions.length,
    completedSessions: sessions.filter(s => s.status === 'completed').length,
    totalDuration: sessions.reduce((sum, s) => sum + s.duration, 0),
    totalTokens: sessions.reduce((sum, s) => sum + s.tokensUsed, 0),
    totalCost: sessions.reduce((sum, s) => sum + s.cost, 0),
    avgScore: sessions.filter(s => s.aiScore > 0).reduce((sum, s, _, arr) => sum + s.aiScore / arr.length, 0),
    activeCandidates: new Set(sessions.map(s => s.candidate)).size,
    activeRecruiters: new Set(sessions.map(s => s.recruiter)).size,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        
        <div className="relative flex items-center justify-between animate-slide-in">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-fuchsia-500 via-purple-500 to-pink-500 rounded-2xl shadow-glow-purple animate-pulse-glow">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-5xl text-gradient-premium">AI Interview Analytics</h1>
                <p className="text-slate-400 mt-1 text-sm">Track and analyze AI-powered candidate interviews</p>
              </div>
            </div>
          </div>
          
          <button className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-fuchsia-400 transition-colors" />
            <span className="relative z-10 text-slate-300 font-medium">Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Sessions', value: stats.totalSessions, gradient: 'from-fuchsia-500 to-pink-500', icon: Bot },
          { label: 'Completed', value: stats.completedSessions, gradient: 'from-green-500 to-emerald-500', icon: CheckCircle },
          { label: 'Active Candidates', value: stats.activeCandidates, gradient: 'from-blue-500 to-cyan-500', icon: Users },
          { label: 'Avg AI Score', value: `${stats.avgScore.toFixed(0)}%`, gradient: 'from-purple-500 to-pink-500', icon: Target },
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

      {/* Usage Metrics */}
      <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '150ms' }}>
        {[
          { label: 'Total Duration', value: `${(stats.totalDuration / 60).toFixed(1)}h`, gradient: 'from-cyan-500 to-blue-500', icon: Clock },
          { label: 'Tokens Used', value: `${(stats.totalTokens / 1000).toFixed(1)}K`, gradient: 'from-indigo-500 to-purple-500', icon: Zap },
          { label: 'Total Cost', value: formatCurrency(stats.totalCost), gradient: 'from-orange-500 to-amber-500', icon: BarChart3 },
          { label: 'Active Recruiters', value: stats.activeRecruiters, gradient: 'from-rose-500 to-pink-500', icon: User },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 bg-gradient-to-br ${stat.gradient} rounded-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
                <p className="text-3xl premium-text">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="glass rounded-3xl p-6 space-y-4 animate-slide-in shadow-premium" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-fuchsia-400 transition-all duration-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate, position, or recruiter..."
              className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:bg-white/10"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`group relative px-6 py-4 glass rounded-2xl transition-all duration-300 flex items-center gap-3 overflow-hidden ${showFilters ? 'bg-fuchsia-500/20 border-fuchsia-500/30 shadow-glow-purple' : 'hover:bg-white/10'}`}
          >
            <Filter className={`w-5 h-5 relative z-10 ${showFilters ? 'text-fuchsia-400' : 'text-slate-400 group-hover:text-fuchsia-400'} transition-colors`} />
            <span className={`relative z-10 font-medium ${showFilters ? 'text-fuchsia-400' : 'text-slate-300'}`}>Filters</span>
            <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-300 ${showFilters ? 'rotate-180 text-fuchsia-400' : 'text-slate-400'}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10 animate-slide-in">
            {[
              { label: 'Candidate', value: filters.candidate, key: 'candidate', options: ['all', ...Array.from(new Set(sessions.map(s => s.candidate)))] },
              { label: 'Recruiter', value: filters.recruiter, key: 'recruiter', options: ['all', ...Array.from(new Set(sessions.map(s => s.recruiter)))] },
              { label: 'Interview Type', value: filters.interviewType, key: 'interviewType', options: ['all', 'screening', 'technical', 'behavioral', 'final'] },
              { label: 'Status', value: filters.status, key: 'status', options: ['all', 'completed', 'in-progress', 'interrupted', 'failed'] },
            ].map((filter, index) => (
              <div key={index}>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">{filter.label}</label>
                <select
                  value={filter.value as string}
                  onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 text-slate-100 transition-all"
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

      {/* Sessions List */}
      <div className="space-y-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
        {filteredSessions.map((session) => {
          const TypeIcon = interviewTypeColors[session.interviewType].icon;
          const StatusIcon = statusColors[session.status].icon;
          const SentimentIcon = sentimentColors[session.sentiment].icon;
          
          return (
            <div key={session.id} className="group relative glass rounded-3xl p-6 hover-lift card-shine overflow-hidden border border-white/10 hover:border-fuchsia-500/30 transition-all duration-300">
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${interviewTypeColors[session.interviewType].bg} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-16 h-16 bg-gradient-to-br ${interviewTypeColors[session.interviewType].bg} rounded-2xl flex items-center justify-center shadow-glow-purple`}>
                      <TypeIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-100">{session.candidate}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${statusColors[session.status].bg} ${statusColors[session.status].text} ${statusColors[session.status].border}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          <span>Recruiter: {session.recruiter}</span>
                        </div>
                        <span className="text-slate-600">•</span>
                        <span className="font-medium">{session.position}</span>
                        <span className="text-slate-600">•</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r ${interviewTypeColors[session.interviewType].bg} rounded-lg text-xs font-bold text-white`}>
                          {session.interviewType.charAt(0).toUpperCase() + session.interviewType.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {session.status === 'completed' && session.aiScore > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">AI Score</p>
                        <div className="flex items-center gap-2">
                          <div className="relative w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                                session.aiScore >= 80 ? 'from-green-500 to-emerald-500' :
                                session.aiScore >= 60 ? 'from-yellow-500 to-orange-500' :
                                'from-red-500 to-rose-500'
                              } rounded-full transition-all duration-500`}
                              style={{ width: `${session.aiScore}%` }}
                            />
                          </div>
                          <span className={`text-2xl font-black ${
                            session.aiScore >= 80 ? 'text-green-400' :
                            session.aiScore >= 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {session.aiScore}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Session Details Grid */}
                <div className="grid grid-cols-6 gap-3 mb-4">
                  <div className="glass rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <p className="text-xs text-slate-500">Duration</p>
                    </div>
                    <p className="text-lg font-bold text-cyan-400">{session.duration}m</p>
                  </div>
                  
                  <div className="glass rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <p className="text-xs text-slate-500">Questions</p>
                    </div>
                    <p className="text-lg font-bold text-purple-400">{session.questionsAsked}</p>
                  </div>
                  
                  <div className="glass rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3.5 h-3.5 text-slate-500" />
                      <p className="text-xs text-slate-500">Tokens</p>
                    </div>
                    <p className="text-lg font-bold text-indigo-400">{(session.tokensUsed / 1000).toFixed(1)}K</p>
                  </div>
                  
                  <div className="glass rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                      <p className="text-xs text-slate-500">Cost</p>
                    </div>
                    <p className="text-lg font-bold text-orange-400">{formatCurrency(session.cost)}</p>
                  </div>
                  
                  <div className="glass rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <SentimentIcon className="w-3.5 h-3.5 text-slate-500" />
                      <p className="text-xs text-slate-500">Sentiment</p>
                    </div>
                    <p className={`text-sm font-bold ${sentimentColors[session.sentiment].text}`}>
                      {session.sentiment.charAt(0).toUpperCase() + session.sentiment.slice(1)}
                    </p>
                  </div>
                  
                  <div className="glass rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <p className="text-xs text-slate-500">Date</p>
                    </div>
                    <p className="text-xs font-medium text-slate-300">{session.startTime.split(' ')[0]}</p>
                  </div>
                </div>

                {/* Key Topics */}
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Key Topics:</span>
                  <div className="flex flex-wrap gap-2">
                    {session.keyTopics.map((topic, index) => (
                      <span key={index} className="px-3 py-1 glass rounded-lg text-xs font-medium text-slate-300 border border-white/10">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-start gap-2 flex-1">
                    <FileText className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Notes</p>
                      <p className="text-sm text-slate-400">{session.notes}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setShowDetailModal(true);
                      }}
                      className="px-5 py-2.5 glass rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group/btn border border-white/10"
                    >
                      <Eye className="w-4 h-4 text-slate-400 group-hover/btn:text-fuchsia-400 transition-colors" />
                      <span className="text-sm text-slate-300 group-hover/btn:text-fuchsia-400 font-medium transition-colors">View Transcript</span>
                    </button>
                    
                    <button className="px-5 py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-xl hover:shadow-glow-purple transition-all duration-300 flex items-center gap-2">
                      <Download className="w-4 h-4 text-white" />
                      <span className="text-sm text-white font-medium">Export</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-slide-in">
          <div className="glass-dark rounded-3xl max-w-4xl w-full p-8 shadow-premium border border-white/20 relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl premium-text">Interview Session Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 glass rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Session Overview */}
                <div className="glass rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${interviewTypeColors[selectedSession.interviewType].bg} rounded-2xl flex items-center justify-center shadow-glow-purple`}>
                      {(() => {
                        const Icon = interviewTypeColors[selectedSession.interviewType].icon;
                        return <Icon className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-100">{selectedSession.candidate}</h4>
                      <p className="text-sm text-slate-400 mt-1">{selectedSession.position}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Recruiter</p>
                      <p className="text-base text-slate-200 font-medium">{selectedSession.recruiter}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Interview Type</p>
                      <p className="text-base text-slate-200 font-medium capitalize">{selectedSession.interviewType}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Status</p>
                      <p className={`text-base font-medium capitalize ${statusColors[selectedSession.status].text}`}>{selectedSession.status}</p>
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-cyan-400" />
                      <h5 className="text-sm text-slate-400 uppercase tracking-wider font-medium">Time & Duration</h5>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Start Time</p>
                        <p className="text-base text-slate-200">{selectedSession.startTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">End Time</p>
                        <p className="text-base text-slate-200">{selectedSession.endTime}</p>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-slate-500 mb-1">Duration</p>
                        <p className="text-2xl text-cyan-400 font-bold">{selectedSession.duration} minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <h5 className="text-sm text-slate-400 uppercase tracking-wider font-medium">AI Metrics</h5>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Questions Asked</p>
                        <p className="text-2xl text-purple-400 font-bold">{selectedSession.questionsAsked}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Tokens Used</p>
                        <p className="text-2xl text-indigo-400 font-bold">{selectedSession.tokensUsed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Cost</p>
                        <p className="text-2xl text-orange-400 font-bold">{formatCurrency(selectedSession.cost)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-green-400" />
                      <h5 className="text-sm text-slate-400 uppercase tracking-wider font-medium">Assessment</h5>
                    </div>
                    {selectedSession.aiScore > 0 ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-2">AI Score</p>
                          <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                            <div 
                              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                                selectedSession.aiScore >= 80 ? 'from-green-500 to-emerald-500' :
                                selectedSession.aiScore >= 60 ? 'from-yellow-500 to-orange-500' :
                                'from-red-500 to-rose-500'
                              } rounded-full transition-all duration-500`}
                              style={{ width: `${selectedSession.aiScore}%` }}
                            />
                          </div>
                          <p className={`text-4xl font-black ${
                            selectedSession.aiScore >= 80 ? 'text-green-400' :
                            selectedSession.aiScore >= 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {selectedSession.aiScore}/100
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Sentiment</p>
                          <p className={`text-lg font-bold capitalize ${sentimentColors[selectedSession.sentiment].text}`}>
                            {selectedSession.sentiment}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No score available</p>
                    )}
                  </div>
                </div>

                {/* Key Topics */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-pink-400" />
                    <h5 className="text-sm text-slate-400 uppercase tracking-wider font-medium">Key Topics Covered</h5>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedSession.keyTopics.map((topic, index) => (
                      <span key={index} className="px-4 py-2 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/30 rounded-xl text-sm font-medium text-fuchsia-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <h5 className="text-sm text-slate-400 uppercase tracking-wider font-medium">Interview Notes</h5>
                  </div>
                  <p className="text-base text-slate-300 leading-relaxed">{selectedSession.notes}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button className="flex-1 px-6 py-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-2xl text-white font-semibold hover:shadow-glow-purple transition-all duration-300 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Full Report
                  </button>
                  <button className="flex-1 px-6 py-4 glass rounded-2xl text-slate-300 font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 border border-white/10">
                    <Video className="w-5 h-5" />
                    View Recording
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

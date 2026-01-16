import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Calendar, DollarSign, Clock,
  FolderOpen, MessageSquare, Sparkles, BarChart3, Wrench, Video,
  UserPlus, Briefcase, PartyPopper, FileUp, Bot, Wallet, Receipt,
  Building2, CreditCard, ChevronDown, ChevronRight, TrendingUp,
  Activity
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import UserService from '../../services/user.service';
import type { UserStats } from '../../services/user.service';

interface NavItemData {
  id: string;
  label: string;
  icon: any;
  path: string;
  gradient: string;
  badge: string | number | null;
}

interface NavItemProps {
  item: NavItemData;
  isNested?: boolean;
  onClose?: () => void;
}

function NavItem({ item, isNested = false, onClose }: NavItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) => `group relative flex items-center gap-3 transition-all duration-300 ${isNested
        ? 'px-3 py-2.5 rounded-xl ml-2'
        : 'px-4 py-3.5 rounded-2xl'
        } ${isActive
          ? 'text-white'
          : 'text-slate-400 hover:text-white'
        }`}
    >
      {({ isActive }) => (
        <>
          { }
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-2xl" />
          )}

          { }
          <div className={`relative flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isNested ? 'w-9 h-9 rounded-xl' : 'w-11 h-11 rounded-xl'
            } ${isActive
              ? `bg-gradient-to-br ${item.gradient} shadow-glow-purple`
              : 'bg-white/5 group-hover:bg-white/10'
            }`}>
            <Icon className={`${isNested ? 'w-4.5 h-4.5' : 'w-5 h-5'} ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
              } transition-colors relative z-10`} />
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl blur-md opacity-50`} />
            )}
          </div>

          { }
          <span className={`relative z-10 font-medium transition-all ${isNested ? 'text-sm' : 'text-sm'
            } ${isActive ? 'text-white' : ''}`}>
            {item.label}
          </span>

          { }
          {item.badge !== null && item.badge !== undefined && item.badge !== 0 && (
            <span className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${isActive
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
              }`}>
              {item.badge}
            </span>
          )}

          { }
          {isActive && (
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 ${isNested ? 'h-6' : 'h-10'
              } bg-gradient-to-b ${item.gradient} rounded-r-full shadow-glow-purple`} />
          )}
        </>
      )}
    </NavLink>
  );
}

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onClose?: () => void;
}

export function Sidebar({ currentPage: _currentPage, onNavigate: _onNavigate, onClose }: SidebarProps) {
  const location = useLocation();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    people: true,
    finance: true,
    operations: true,
    tools: true,
    recruiter_candidates: true,
    recruiter_operations: true,
    recruiter_self_service: true,
    candidate_main: true,
    candidate_finance: true,
    candidate_resources: true,
  });
  const [financeExpanded, setFinanceExpanded] = useState(false);
  const [customBuilderExpanded, setCustomBuilderExpanded] = useState(false);

  const isRecruiter = location.pathname.startsWith('/recruiter');
  const isCandidate = location.pathname.startsWith('/candidate');
  const isAdmin = !isRecruiter && !isCandidate;

  useEffect(() => {

    if (isAdmin) {
      const fetchStats = async () => {
        try {
          const data = await UserService.getUserStats();
          setStats(data);
        } catch (err) {
          console.error('Failed to fetch sidebar stats:', err);
        }
      };
      fetchStats();
      const interval = setInterval(fetchStats, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const adminMainNav = useMemo<NavItemData[]>(() => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      gradient: 'from-purple-500 to-blue-500',
      badge: null
    },
  ], []);

  const adminPeopleNav = useMemo<NavItemData[]>(() => [
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      path: '/admin/users',
      gradient: 'from-blue-500 to-cyan-500',
      badge: stats?.totalUsers || null
    },
    {
      id: 'submissions',
      label: 'Submissions',
      icon: FileText,
      path: '/admin/submissions',
      gradient: 'from-orange-500 to-amber-500',
      badge: stats?.pendingSubmissionsCount || null
    },
    {
      id: 'interviews',
      label: 'Interviews',
      icon: Video,
      path: '/admin/interviews',
      gradient: 'from-violet-500 to-purple-500',
      badge: null
    },
  ], [stats]);

  const adminFinanceNav = useMemo<NavItemData[]>(() => [
    {
      id: 'salaries',
      label: 'Salaries',
      icon: DollarSign,
      path: '/admin/salaries',
      gradient: 'from-emerald-500 to-green-500',
      badge: null
    },
    {
      id: 'timesheets',
      label: 'Timesheets',
      icon: Clock,
      path: '/admin/timesheets',
      gradient: 'from-cyan-500 to-blue-500',
      badge: stats?.pendingTimesheets || null
    },
  ], [stats]);

  const adminFinanceAdvanced = useMemo<NavItemData[]>(() => [
    {
      id: 'revenue-ledger',
      label: 'Revenue Ledger',
      icon: BarChart3,
      path: '/admin/finance/revenue-ledger',
      gradient: 'from-indigo-500 to-blue-500',
      badge: null
    },
    {
      id: 'client-billing',
      label: 'Client Billing',
      icon: Building2,
      path: '/admin/finance/client-billing-profiles',
      gradient: 'from-purple-500 to-pink-500',
      badge: null
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: Receipt,
      path: '/admin/finance/invoices',
      gradient: 'from-blue-500 to-cyan-500',
      badge: null
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      path: '/admin/finance/payments',
      gradient: 'from-green-500 to-teal-500',
      badge: null
    },
  ], []);

  const adminOperationsNav = useMemo<NavItemData[]>(() => [
    {
      id: 'pto',
      label: 'PTO Requests',
      icon: Calendar,
      path: '/admin/pto',
      gradient: 'from-sky-500 to-blue-500',
      badge: stats?.pendingPTO || null
    },
    {
      id: 'company-holidays',
      label: 'Holidays',
      icon: PartyPopper,
      path: '/admin/company-holidays',
      gradient: 'from-yellow-500 to-orange-500',
      badge: null
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FolderOpen,
      path: '/admin/documents',
      gradient: 'from-slate-500 to-gray-500',
      badge: null
    },
    {
      id: 'document-requests',
      label: 'Doc Requests',
      icon: FileUp,
      path: '/admin/document-requests',
      gradient: 'from-indigo-500 to-purple-500',
      badge: stats?.pendingDocRequests || null
    },
  ], [stats]);

  const adminToolsNav = useMemo<NavItemData[]>(() => [
    {
      id: 'ai-usage',
      label: 'AI Usage',
      icon: Bot,
      path: '/admin/ai-usage',
      gradient: 'from-fuchsia-500 to-pink-500',
      badge: null
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      path: '/admin/messages',
      gradient: 'from-blue-500 to-indigo-500',
      badge: null
    },
  ], []);

  const adminCustomBuilderItems = useMemo<NavItemData[]>(() => [
    {
      id: 'new-candidates',
      label: 'New Candidates',
      icon: UserPlus,
      path: '/admin/new-candidates',
      gradient: 'from-green-500 to-emerald-500',
      badge: stats?.newCandidatesCount || null
    },
    {
      id: 'new-recruiters',
      label: 'New Recruiters',
      icon: Briefcase,
      path: '/admin/new-recruiters',
      gradient: 'from-pink-500 to-rose-500',
      badge: stats?.newRecruitersCount || null
    },
  ], [stats]);

  const recruiterMainNav = useMemo<NavItemData[]>(() => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/recruiter/dashboard',
      gradient: 'from-purple-500 to-blue-500',
      badge: null
    },
    {
      id: 'invites',
      label: 'My Submissions',
      icon: Briefcase,
      path: '/recruiter/submissions',
      gradient: 'from-blue-500 to-cyan-500',
      badge: null
    },
  ], []);

  const recruiterOperationsNav = useMemo<NavItemData[]>(() => [
    {
      id: 'interviews',
      label: 'Interviews',
      icon: Calendar,
      path: '/recruiter/interviews',
      gradient: 'from-violet-500 to-purple-500',
      badge: null
    },
    {
      id: 'documents',
      label: 'Document Vault',
      icon: FolderOpen,
      path: '/recruiter/documents',
      gradient: 'from-pink-500 to-rose-500',
      badge: null
    },
  ], []);

  const recruiterCandidatesNav = useMemo<NavItemData[]>(() => [
    {
      id: 'my-candidates',
      label: 'My Candidates',
      icon: Users,
      path: '/recruiter/candidates',
      gradient: 'from-orange-500 to-amber-500',
      badge: null
    }
  ], []);

  const recruiterSelfServiceNav = useMemo<NavItemData[]>(() => [
    {
      id: 'performance',
      label: 'My Performance',
      icon: Activity,
      path: '/recruiter/performance',
      gradient: 'from-emerald-500 to-teal-500',
      badge: null
    },
    {
      id: 'timesheets',
      label: 'My Timesheets',
      icon: Clock,
      path: '/recruiter/timesheets',
      gradient: 'from-cyan-500 to-blue-500',
      badge: null
    },
    {
      id: 'pto',
      label: 'My PTO',
      icon: Calendar,
      path: '/recruiter/pto',
      gradient: 'from-indigo-500 to-purple-500',
      badge: null
    },
    {
      id: 'holidays',
      label: 'Holidays',
      icon: PartyPopper,
      path: '/recruiter/holidays',
      gradient: 'from-yellow-500 to-orange-500',
      badge: null
    },
    {
      id: 'messages',
      label: 'Internal Chat',
      icon: MessageSquare,
      path: '/recruiter/messages',
      gradient: 'from-blue-500 to-indigo-500',
      badge: null
    },
  ], []);


  const candidateMainNav = useMemo<NavItemData[]>(() => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/candidate/dashboard',
      gradient: 'from-purple-500 to-blue-500',
      badge: null
    },
  ], []);

  const candidateWorkNav = useMemo<NavItemData[]>(() => [
    {
      id: 'submissions',
      label: 'My Submissions',
      icon: FileText,
      path: '/candidate/submissions',
      gradient: 'from-orange-500 to-amber-500',
      badge: null
    },
    {
      id: 'interviews',
      label: 'My Interviews',
      icon: Video,
      path: '/candidate/interviews',
      gradient: 'from-violet-500 to-purple-500',
      badge: null
    },
    {
      id: 'timesheet',
      label: 'Timesheets',
      icon: Clock,
      path: '/candidate/timesheet',
      gradient: 'from-cyan-500 to-blue-500',
      badge: null
    },
  ], []);

  const candidateFinanceNav = useMemo<NavItemData[]>(() => [
    {
      id: 'salary',
      label: 'My Salary',
      icon: DollarSign,
      path: '/candidate/salary',
      gradient: 'from-emerald-500 to-green-500',
      badge: null
    },
  ], []);

  const candidateResourcesNav = useMemo<NavItemData[]>(() => [
    {
      id: 'documents',
      label: 'Documents',
      icon: FolderOpen,
      path: '/candidate/documents',
      gradient: 'from-slate-500 to-gray-500',
      badge: null
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      path: '/candidate/messages',
      gradient: 'from-blue-500 to-indigo-500',
      badge: null
    },
  ], []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderAdminLinks = () => (
    <>
      <div>
        {adminMainNav.map(item => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('people')}
          className="w-full flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-400 transition-colors font-black group"
        >
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          <span className="flex-1 text-left">People & Recruitment</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.people ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.people && (
          <div className="space-y-1 animate-slide-in">
            {adminPeopleNav.map(item => (
              <NavItem key={item.id} item={item} onClose={onClose} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('finance')}
          className="w-full flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-400 transition-colors font-black group"
        >
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
          <span className="flex-1 text-left">Finance & Payroll</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.finance ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.finance && (
          <div className="space-y-1 animate-slide-in">
            {adminFinanceNav.map(item => (
              <NavItem key={item.id} item={item} onClose={onClose} />
            ))}

            <button
              onClick={() => setFinanceExpanded(!financeExpanded)}
              className="group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-slate-400 hover:text-white w-full"
            >
              <div className="relative flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all duration-300">
                <Wallet className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors relative z-10" />
              </div>
              <span className="relative z-10 font-medium text-sm">Finance Suite</span>
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-300 ${financeExpanded ? 'rotate-90' : ''}`} />
            </button>

            {financeExpanded && (
              <div className="space-y-1 animate-slide-in">
                {adminFinanceAdvanced.map(item => (
                  <NavItem key={item.id} item={item} isNested />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('operations')}
          className="w-full flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-400 transition-colors font-black group"
        >
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-500" />
          <span className="flex-1 text-left">Operations</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.operations ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.operations && (
          <div className="space-y-1 animate-slide-in">
            {adminOperationsNav.map(item => (
              <NavItem key={item.id} item={item} onClose={onClose} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('tools')}
          className="w-full flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-400 transition-colors font-black group"
        >
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" />
          <span className="flex-1 text-left">Tools & AI</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.tools ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.tools && (
          <div className="space-y-1 animate-slide-in">
            {adminToolsNav.map(item => (
              <NavItem key={item.id} item={item} onClose={onClose} />
            ))}

            <div className="space-y-1">
              <NavLink
                to="/admin/custom-builder"
                className={({ isActive }) => `group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 w-full ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-2xl" />
                    )}
                    <div className={`relative flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-glow-purple' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                      <Wrench className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`} />
                    </div>
                    <span className="relative z-10 font-medium text-sm">Custom Builder</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCustomBuilderExpanded(!customBuilderExpanded);
                      }}
                      className="ml-auto relative z-10"
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${customBuilderExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </>
                )}
              </NavLink>

              {customBuilderExpanded && (
                <div className="space-y-1 animate-slide-in">
                  {adminCustomBuilderItems.map(item => (
                    <NavItem key={item.id} item={item} isNested />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderRecruiterLinks = () => (
    <>
      <div>
        {recruiterMainNav.map(item => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('recruiter_candidates')}
          className="w-full flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-400 transition-colors font-black group"
        >
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          <span className="flex-1 text-left">Candidates</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.recruiter_candidates ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.recruiter_candidates && (
          <div className="space-y-1 animate-slide-in">
            {recruiterCandidatesNav.map(item => (
              <NavItem key={item.id} item={item} onClose={onClose} />
            ))}
          </div>
        )}
      </div>


      <div className="space-y-1">
        <button
          onClick={() => toggleSection('recruiter_operations')}
          className="w-full flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-400 transition-colors font-black group"
        >
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
          <span className="flex-1 text-left">Recruitment Ops</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.recruiter_operations ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.recruiter_operations && (
          <div className="space-y-1 animate-slide-in">
            {recruiterOperationsNav.map(item => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('recruiter_self_service')}
          className="w-full flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-400 transition-colors font-black group"
        >
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <span className="flex-1 text-left">Analysis & Tools</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.recruiter_self_service ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.recruiter_self_service && (
          <div className="space-y-1 animate-slide-in">
            {recruiterSelfServiceNav.map(item => (
              <NavItem key={item.id} item={item} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderCandidateLinks = () => (
    <>
      <div>
        {candidateMainNav.map(item => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('candidate_main')}
          className="w-full flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-400 transition-colors font-black group"
        >
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
          <span className="flex-1 text-left">My Work</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.candidate_main ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.candidate_main && (
          <div className="space-y-1 animate-slide-in">
            {candidateWorkNav.map(item => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('candidate_finance')}
          className="w-full flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-400 transition-colors font-black group"
        >
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
          <span className="flex-1 text-left">Finance</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.candidate_finance ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.candidate_finance && (
          <div className="space-y-1 animate-slide-in">
            {candidateFinanceNav.map(item => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <button
          onClick={() => toggleSection('candidate_resources')}
          className="w-full flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.15em] text-slate-500 hover:text-slate-400 transition-colors font-black group"
        >
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
          <span className="flex-1 text-left">Resources</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedSections.candidate_resources ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.candidate_resources && (
          <div className="space-y-1 animate-slide-in">
            {candidateResourcesNav.map(item => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <aside className="h-full w-full flex flex-col relative overflow-hidden">
      { }
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-blue-500/8 to-pink-500/8" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />

      { }
      <div className="absolute top-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-float" />

      { }
      <div className="relative p-6 mb-2">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow-purple overflow-hidden transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
            <Sparkles className="w-7 h-7 text-white relative z-10 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 animate-spin-slow">
              <div className="h-full w-1/2 bg-gradient-to-r from-transparent to-white/20" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              SpanTeq
            </div>
            <div className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">
              {isRecruiter ? 'Recruiter Portal' : isCandidate ? 'Candidate Portal' : 'Admin Portal'}
            </div>
          </div>
        </div>
      </div>

      { }
      {isAdmin && (
        <div className="relative px-4 mb-4">
          <div className="glass rounded-2xl p-4 border border-white/10">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Active</p>
                  <p className="text-sm font-bold text-white">{stats?.activeUsers || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Pending</p>
                  <p className="text-sm font-bold text-white">{(stats?.pendingPTO || 0) + (stats?.pendingTimesheets || 0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      { }
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-6 pb-6">
          {isRecruiter && renderRecruiterLinks()}
          {isCandidate && renderCandidateLinks()}
          {isAdmin && renderAdminLinks()}
        </div>
      </nav>

      { }
      <div className="p-4 border-t border-white/5">
        <div className="relative p-5 rounded-2xl overflow-hidden group cursor-pointer hover-lift transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-white font-bold">Need Help?</p>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get instant support from our AI assistant
            </p>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-white font-semibold transition-all duration-300 w-full border border-white/10">
              Get Support →
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
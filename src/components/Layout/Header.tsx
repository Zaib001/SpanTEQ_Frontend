import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell, Search, Settings, LogOut, User, ChevronDown,
  Zap, TrendingUp, Clock, Shield, Palette, Moon, Sun,
  HelpCircle, BarChart3, Activity
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import StorageService from '../../services/storage.service';

const pageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/users': 'User Management',
    '/admin/submissions': 'Submissions',
    '/admin/pto': 'PTO Requests',
    '/admin/salaries': 'Salaries',
    '/admin/timesheets': 'Timesheets',
    '/admin/documents': 'Documents',
    '/admin/company-holidays': 'Company Holidays',
    '/admin/document-requests': 'Document Requests',
    '/admin/ai-usage': 'AI Interview Usage',
    '/admin/messages': 'Messages',
    '/admin/custom-builder': 'Custom Builder',
    '/admin/interviews': 'Interviews',
    '/admin/new-candidates': 'New Candidates',
    '/admin/new-recruiters': 'New Recruiters',
    '/admin/finance/revenue-ledger': 'Revenue Ledger',
    '/admin/finance/client-billing-profiles': 'Client Billing Profiles',
    '/admin/finance/invoices': 'Invoices',
    '/admin/finance/payments': 'Payments',

    '/recruiter/dashboard': 'Recruiter Dashboard',
    '/recruiter/candidates': 'My Candidates',
    '/recruiter/submissions': 'Submissions',
    '/recruiter/timesheets': 'Timesheets',
    '/recruiter/pto': 'PTO Requests',

    '/candidate/dashboard': 'My Dashboard',
    '/candidate/submissions': 'My Submissions',
    '/candidate/timesheets': 'My Timesheets',

    '/admin/profile': 'My Profile',
    '/admin/settings': 'Account Settings',
    '/recruiter/profile': 'My Profile',
    '/recruiter/settings': 'Account Settings',
    '/candidate/profile': 'My Profile',
    '/candidate/settings': 'Account Settings',
  };

  if (pathname.startsWith('/recruiter')) return titles[pathname] || 'Recruiter Portal';
  if (pathname.startsWith('/candidate')) return titles[pathname] || 'Candidate Portal';
  return titles[pathname] || 'SpanTeq Admin';
};

const pageSubtitle = (pathname: string): string => {
  const subtitles: Record<string, string> = {
    '/admin/dashboard': 'Overview of your recruitment operations',
    '/admin/users': 'Manage recruiters and candidates',
    '/admin/submissions': 'Track candidate submissions',
    '/admin/pto': 'Manage time-off requests',
    '/admin/salaries': 'Employee compensation management',
    '/admin/timesheets': 'Review and approve timesheets',
    '/admin/documents': 'Document library and management',
    '/admin/company-holidays': 'Company-wide holiday calendar',
    '/admin/document-requests': 'Document request tracking',
    '/admin/ai-usage': 'AI interview analytics and insights',
    '/admin/messages': 'Internal communications',
    '/admin/custom-builder': 'Build custom workflows',
    '/admin/interviews': 'Schedule and manage interviews',
    '/admin/new-candidates': 'Review new candidate applications',
    '/admin/new-recruiters': 'Onboard new recruiters',
    '/admin/finance/revenue-ledger': 'Financial performance tracking',
    '/admin/finance/client-billing-profiles': 'Client billing configuration',
    '/admin/finance/invoices': 'Invoice generation and tracking',
    '/admin/finance/payments': 'Payment processing and history',

    '/recruiter/dashboard': 'Overview of your recruitment pipeline',
    '/recruiter/candidates': 'Manage your candidate pool',
    '/recruiter/submissions': 'Track your submissions',
    '/recruiter/timesheets': 'Approve candidate timesheets',
    '/recruiter/pto': 'Review time-off requests',

    '/candidate/dashboard': 'Overview of your activity',
    '/candidate/submissions': 'Track your job applications',
    '/candidate/timesheets': 'Manage your work logs',

    '/admin/profile': 'Manage your personal information',
    '/admin/settings': 'Security and preferences',
    '/recruiter/profile': 'Manage your personal information',
    '/recruiter/settings': 'Security and preferences',
    '/candidate/profile': 'Manage your personal information',
    '/candidate/settings': 'Security and preferences',
  };

  if (pathname.startsWith('/recruiter')) return subtitles[pathname] || 'Recruiter Workspace';
  if (pathname.startsWith('/candidate')) return subtitles[pathname] || 'Candidate Workspace';
  return subtitles[pathname] || 'Admin Portal';
};

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {

    const storedUser = StorageService.getItem('authUser', true);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    StorageService.clearAuth();
    navigate('/login');
  };

  const notifications = [
    { id: 1, title: 'New Submission', message: 'Sarah Johnson submitted 3 candidates', time: '5 min ago', type: 'success', icon: TrendingUp },
    { id: 2, title: 'Timesheet Pending', message: '8 timesheets require approval', time: '12 min ago', type: 'warning', icon: Clock },
    { id: 3, title: 'Payment Processed', message: 'March payroll completed', time: '1 hour ago', type: 'info', icon: BarChart3 },
    { id: 4, title: 'New Recruiter', message: 'John Doe joined your team', time: '2 hours ago', type: 'success', icon: User },
    { id: 5, title: 'System Update', message: 'Platform updated to v2.5', time: '1 day ago', type: 'info', icon: Zap },
  ];

  const unreadCount = notifications.filter(n => n.type === 'success' || n.type === 'warning').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notificationTypeColors = {
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-blue-500 to-cyan-500',
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-2xl">
      {}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="relative px-8 py-5">
        <div className="flex items-center justify-between gap-8">
          {}
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-white mb-1">{pageTitle(location.pathname)}</h1>
                <p className="text-sm text-slate-400">{pageSubtitle(location.pathname)}</p>
              </div>
            </div>
          </div>

          {}
          <div className="flex-1 max-w-xl">
            <div className={`relative group transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${searchFocused ? 'text-purple-400' : 'text-slate-400'
                }`} />
              <input
                type="text"
                placeholder="Quick search... (Ctrl+K)"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:bg-white/10 backdrop-blur-xl"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs bg-white/10 text-slate-400 rounded-lg border border-white/10">⌘K</kbd>
              </div>
            </div>
          </div>

          {}
          <div className="flex items-center gap-3">
            {}
            <button className="group relative p-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 overflow-hidden">
              <Zap className="w-5 h-5 text-slate-400 group-hover:text-yellow-400 transition-colors relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {}
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`group relative p-3 rounded-xl transition-all duration-300 overflow-hidden ${showNotifications ? 'glass bg-white/10 shadow-glow-purple' : 'glass hover:bg-white/10'
                  }`}
              >
                <Bell className={`w-5 h-5 relative z-10 transition-colors ${showNotifications ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'
                  }`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-slate-900 z-10">
                    {unreadCount}
                  </span>
                )}
              </button>

              {}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-3 w-96 glass-dark rounded-3xl shadow-premium border border-white/20 overflow-hidden animate-slide-in">
                  <div className="p-5 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-white">Notifications</h3>
                      <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-xl text-xs font-bold text-purple-400">
                        {unreadCount} new
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Stay updated with your latest activities</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          className="p-4 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group"
                        >
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${notificationTypeColors[notif.type as keyof typeof notificationTypeColors]} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white mb-1">{notif.title}</p>
                              <p className="text-xs text-slate-400 mb-2">{notif.message}</p>
                              <p className="text-xs text-slate-500">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 border-t border-white/10 bg-white/5">
                    <button className="w-full px-4 py-2.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors rounded-xl hover:bg-white/5">
                      View All Notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {}
            <div ref={settingsRef} className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`group relative p-3 rounded-xl transition-all duration-300 overflow-hidden ${showSettings ? 'glass bg-white/10 shadow-glow-purple' : 'glass hover:bg-white/10'
                  }`}
              >
                <Settings className={`w-5 h-5 relative z-10 transition-all ${showSettings ? 'text-purple-400 rotate-90' : 'text-slate-400 group-hover:text-purple-400 group-hover:rotate-90'
                  }`} />
              </button>

              {}
              {showSettings && (
                <div className="absolute right-0 top-full mt-3 w-80 glass-dark rounded-3xl shadow-premium border border-white/20 overflow-hidden animate-slide-in">
                  <div className="p-5 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10">
                    <h3 className="text-lg font-bold text-white mb-1">Settings</h3>
                    <p className="text-xs text-slate-400">Customize your experience</p>
                  </div>
                  <div className="p-3">
                    {[
                      { icon: Palette, label: 'Appearance', desc: 'Themes and colors', gradient: 'from-pink-500 to-rose-500' },
                      { icon: Shield, label: 'Security', desc: 'Privacy settings', gradient: 'from-blue-500 to-cyan-500' },
                      { icon: Bell, label: 'Notifications', desc: 'Manage alerts', gradient: 'from-purple-500 to-pink-500' },
                      { icon: Activity, label: 'Activity Log', desc: 'View recent actions', gradient: 'from-green-500 to-emerald-500' },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={index}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-white">{item.label}</p>
                            <p className="text-xs text-slate-400">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {}
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />

            {}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`group flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-2xl transition-all duration-300 ${showUserMenu ? 'glass bg-white/10 shadow-glow-purple' : 'glass hover:bg-white/10'
                  }`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <User className="w-5 h-5 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-sm font-bold text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role || 'Guest'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-3 w-64 glass-dark rounded-3xl shadow-premium border border-white/20 overflow-hidden animate-slide-in">
                  <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-400">{user?.email || 'email@example.com'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 glass rounded-lg p-2">
                        <p className="text-xs text-slate-500">Role</p>
                        <p className="text-xs font-bold text-white capitalize">{user?.role || 'Guest'}</p>
                      </div>
                      <div className="flex-1 glass rounded-lg p-2">
                        <p className="text-xs text-slate-500">Status</p>
                        <p className="text-xs font-bold text-green-400">Active</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    {[
                      { icon: User, label: 'My Profile', gradient: 'from-blue-500 to-cyan-500' },
                      { icon: Settings, label: 'Account Settings', gradient: 'from-purple-500 to-pink-500' },
                      { icon: HelpCircle, label: 'Help & Support', gradient: 'from-green-500 to-emerald-500' },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            const rolePrefix = user?.role === 'recruiter' ? '/recruiter'
                              : user?.role === 'candidate' ? '/candidate'
                                : '/admin';

                            if (item.label === 'My Profile') navigate(`${rolePrefix}/profile`);
                            else if (item.label === 'Account Settings') navigate(`${rolePrefix}/settings`);
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <div className={`w-9 h-9 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                    <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-all group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <LogOut className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-300 group-hover:text-red-400 transition-colors">
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, Filter, Plus, Edit, Trash2, Eye, Download,
  Settings2, X, Mail, User, Shield, CheckCircle, XCircle,
  ArrowUpDown, ChevronDown, Sparkles, Users as UsersIcon,
  Lock, Phone, MapPin, Briefcase, DollarSign, Calendar, Award,
  TrendingUp, ChevronRight, ArrowLeft, Save, Clock, Percent,
  Loader2
} from 'lucide-react';
import UserService from '../../services/user.service';
import type { User as ApiUser, UserStats } from '../../services/user.service';
import UserDetailModal from './UserDetailModal';

type UserRole = 'admin' | 'recruiter' | 'candidate';
type PayModel = 'Fixed' | 'Hourly' | 'Percentage' | 'Hybrid';
type BonusFrequency = 'Monthly' | 'Quarterly' | 'Yearly';

interface UserData extends ApiUser {

}

interface CompensationFormData {

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole | '';
  department: string;
  location: string;

  recruiterBaseSalary: string;
  recruiterPTO: string;
  recruiterCarryForward: boolean;
  recruiterMaxCarryForward: string;
  recruiterExcessDeduction: boolean;
  recruiterAutoHolidays: boolean;
  recruiterEffectiveMonth: string;
  recruiterBonusEnabled: boolean;
  recruiterBonusAmount: string;
  recruiterBonusFrequency: BonusFrequency | '';
  recruiterBonusStartMonth: string;
  recruiterBonusEndMonth: string;

  candidatePayModel: PayModel | '';
  candidateFixedSalary: string;
  candidateHourlyRate: string;
  candidateBillRate: string;
  candidatePercentage: string;
  candidateHybridFixedSalary: string;
  candidatePayCycleMonth: string;
  candidateHybridBillRate: string;
  candidateHybridPercentage: string;
}

export function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showColumns, setShowColumns] = useState(false);

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');

  const [stats, setStats] = useState<UserStats>({
    total: 0,
    recruiters: 0,
    candidates: 0,
    active: 0
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    role: true,
    status: true,
    verified: true,
    createdAt: true,
    actions: true,
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesVerified = verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && user.isVerified) ||
      (verifiedFilter === 'unverified' && !user.isVerified);

    return matchesSearch && matchesRole && matchesStatus && matchesVerified;
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 10,
        search: searchQuery,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        isVerified: verifiedFilter !== 'all' ? (verifiedFilter === 'verified') : undefined,
      };

      const response = await UserService.getAllUsers(params);
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setTotalCount(response.total);
    } catch (err: any) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const totalRes = await UserService.getAllUsers({ limit: 1 });
      const recruiterRes = await UserService.getAllUsers({ role: 'recruiter', limit: 1 });
      const candidateRes = await UserService.getAllUsers({ role: 'candidate', limit: 1 });
      const activeRes = await UserService.getAllUsers({ status: 'active', limit: 1 });

      setStats({
        total: totalRes.total,
        recruiters: recruiterRes.total,
        candidates: candidateRes.total,
        active: activeRes.total
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery, roleFilter, statusFilter, verifiedFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await UserService.deleteUser(id);
        fetchUsers();
        fetchStats();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleToggleVerify = async (id: string) => {
    try {
      await UserService.toggleVerification(id);
      fetchUsers();

    } catch (err) {
      console.error('Failed to toggle verification:', err);
      alert('Failed to update verification status');
    }
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      await UserService.exportUsers();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      { }
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        <div className="absolute -top-10 -left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative flex items-center justify-between animate-slide-in">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl shadow-glow-purple animate-pulse-glow">
                <UsersIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-5xl text-gradient-premium">
                  User Management
                </h1>
                <p className="text-slate-400 mt-1 text-sm">Create and manage recruiters, candidates, and admins</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-2xl overflow-hidden shadow-premium hover:shadow-glow-purple transition-all duration-500 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
            </div>
            <div className="relative flex items-center gap-3 text-white">
              <Plus className="w-6 h-6" />
              <span className="font-medium">Add New User</span>
            </div>
          </button>
        </div>
      </div>

      { }
      <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Users', value: stats.total, icon: UsersIcon, gradient: 'from-purple-500 to-blue-500', color: 'purple' },
          { label: 'Recruiters', value: stats.recruiters, icon: Shield, gradient: 'from-blue-500 to-cyan-500', color: 'blue' },
          { label: 'Candidates', value: stats.candidates, icon: User, gradient: 'from-pink-500 to-rose-500', color: 'pink' },
          { label: 'Active Users', value: stats.active, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500', color: 'green' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                  <p className="text-4xl premium-text mb-1">{stat.value}</p>
                </div>
                <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-glow-${stat.color} transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      { }
      <div className="glass rounded-3xl p-6 space-y-4 animate-slide-in shadow-premium relative z-30" style={{ animationDelay: '200ms' }}>
        { }
        <div className="flex items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-all duration-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:bg-white/10 focus:bg-white/10"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-pink-500/0 group-focus-within:from-purple-500/10 group-focus-within:via-blue-500/10 group-focus-within:to-pink-500/10 transition-all duration-500 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden ${showFilters ? 'bg-purple-500/20 border-purple-500/30 shadow-glow-purple' : ''}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <Filter className={`w-5 h-5 relative z-10 ${showFilters ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'} transition-colors`} />
            <span className={`relative z-10 font-medium ${showFilters ? 'text-purple-400' : 'text-slate-300'}`}>Filters</span>
            <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-300 ${showFilters ? 'rotate-180 text-purple-400' : 'text-slate-400'}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowColumns(!showColumns)}
              className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Settings2 className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-purple-400 transition-colors group-hover:rotate-90 duration-500" />
              <span className="relative z-10 text-slate-300 font-medium">Columns</span>
            </button>

            { }
            {showColumns && (
              <div className="absolute top-full right-0 mt-3 w-64 glass rounded-2xl border border-white/10 shadow-premium p-4 z-50 animate-slide-in">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-glow" />
                  <p className="text-sm text-slate-200 font-medium">Customize Columns</p>
                </div>
                {Object.entries(visibleColumns).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer group transition-all">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setVisibleColumns({ ...visibleColumns, [key]: e.target.checked })}
                        className="w-5 h-5 rounded-lg border-2 border-white/20 bg-white/5 checked:bg-gradient-to-br checked:from-purple-500 checked:to-blue-500 transition-all appearance-none cursor-pointer"
                      />
                      {value && (
                        <CheckCircle className="absolute inset-0 w-5 h-5 text-white pointer-events-none" />
                      )}
                    </div>
                    <span className="text-sm text-slate-300 capitalize group-hover:text-white transition-colors">{key}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExport}
            disabled={loading}
            className="group relative px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Download className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-purple-400 transition-colors" />
            <span className="relative z-10 text-slate-300 font-medium">{loading ? 'Exporting...' : 'Export'}</span>
          </button>
        </div>

        { }
        {showFilters && (
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 animate-slide-in">
            {[
              {
                label: 'Role', value: roleFilter, onChange: setRoleFilter, options: [
                  { value: 'all', label: 'All Roles' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'recruiter', label: 'Recruiter' },
                  { value: 'candidate', label: 'Candidate' },
                ]
              },
              {
                label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]
              },
              {
                label: 'Verification', value: verifiedFilter, onChange: setVerifiedFilter, options: [
                  { value: 'all', label: 'All' },
                  { value: 'verified', label: 'Verified' },
                  { value: 'unverified', label: 'Unverified' },
                ]
              },
            ].map((filter, index) => (
              <div key={index}>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">{filter.label}</label>
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all hover:bg-white/10 appearance-none cursor-pointer"
                >
                  {filter.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      { }
      <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in relative z-20" style={{ animationDelay: '300ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark border-b border-white/10">
              <tr>
                {visibleColumns.name && (
                  <th className="px-8 py-5 text-left">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold group cursor-pointer hover:text-purple-400 transition-colors">
                      <span>Name</span>
                      <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </th>
                )}
                {visibleColumns.email && (
                  <th className="px-8 py-5 text-left">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold group cursor-pointer hover:text-purple-400 transition-colors">
                      <span>Email</span>
                      <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </th>
                )}
                {visibleColumns.role && (
                  <th className="px-8 py-5 text-left">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold group cursor-pointer hover:text-purple-400 transition-colors">
                      <span>Role</span>
                      <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </th>
                )}
                {visibleColumns.status && (
                  <th className="px-8 py-5 text-left">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      <span>Status</span>
                    </div>
                  </th>
                )}
                {visibleColumns.verified && (
                  <th className="px-8 py-5 text-left">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      <span>Verified</span>
                    </div>
                  </th>
                )}
                {visibleColumns.createdAt && (
                  <th className="px-8 py-5 text-left">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold group cursor-pointer hover:text-purple-400 transition-colors">
                      <span>Created</span>
                      <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </th>
                )}
                {visibleColumns.actions && (
                  <th className="px-8 py-5 text-right">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                      <p>Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id || user.id}
                    className="group hover:bg-gradient-to-r hover:from-purple-500/5 hover:via-blue-500/5 hover:to-pink-500/5 transition-all duration-300 animate-slide-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {visibleColumns.name && (
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-glow-purple transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 shadow-glow-green" />
                          </div>
                          <span className="text-slate-200 font-medium group-hover:text-white transition-colors">{user.name}</span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.email && (
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-400 group-hover:text-slate-300 transition-colors">{user.email}</span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.role && (
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          user.role === 'recruiter' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                          }`}>
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${user.status === 'active'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                          <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-400 animate-pulse-glow' : 'bg-red-400'}`} />
                          {user.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.verified && (
                      <td className="px-8 py-5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleVerify(user._id || user.id!)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${user.isVerified
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 shadow-glow-green/20'
                            : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                            }`}
                          title={user.isVerified ? "Click to unverify" : "Click to verify"}
                        >
                          {user.isVerified ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-semibold">Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              <span className="text-xs font-semibold">Verify User</span>
                            </>
                          )}
                        </button>
                      </td>
                    )}
                    {visibleColumns.createdAt && (
                      <td className="px-8 py-5 whitespace-nowrap text-slate-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    )}
                    {visibleColumns.actions && (
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 transition-all duration-300">
                          <button
                            onClick={() => { setSelectedUser(user); setShowDetailModal(true); }}
                            className="p-3 glass rounded-xl hover:bg-blue-500/20 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300 transform hover:scale-110"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-3 glass rounded-xl hover:bg-purple-500/20 hover:text-purple-400 hover:shadow-glow-purple transition-all duration-300 transform hover:scale-110"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id || user.id!)}
                            className="p-3 glass rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 transform hover:scale-110"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )))}</tbody>
          </table>
        </div>

        { }
        <div className="glass-dark px-8 py-5 flex items-center justify-between border-t border-white/10">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-400">
              Showing <span className="text-purple-400 font-semibold">{users.length}</span> of <span className="text-slate-300 font-semibold">{totalCount}</span> users
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 glass rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-5 py-2.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl text-sm text-white font-semibold shadow-glow-purple">
              {page}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-5 py-2.5 glass rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      { }
      {(showAddModal || showEditModal) && (
        <UserFormModal
          user={selectedUser}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={async (userData) => {
            try {

              const payload: any = {
                name: `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                role: userData.role,
                phone: userData.phone,
                department: userData.department,
                location: userData.location,

                password: userData.password || undefined
              };

              if (userData.password) payload.password = userData.password;

              if (showEditModal && selectedUser) {
                await UserService.updateUser(selectedUser._id || selectedUser.id!, payload);
              } else {
                if (!userData.password) payload.password = 'Default@123';
                await UserService.createUser(payload);
              }

              setShowAddModal(false);
              setShowEditModal(false);
              setSelectedUser(null);
              fetchUsers();
              fetchStats();
            } catch (err) {
              console.error("Failed to save user", err);
              alert("Failed to save user. Check console for details.");
            }
          }}
        />
      )}

      {showDetailModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

interface UserFormModalProps {
  user: UserData | null;
  onClose: () => void;
  onSave: (formData: CompensationFormData) => void;
}

function UserFormModal({ user, onClose, onSave }: UserFormModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<CompensationFormData>({
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
    email: user?.email || '',
    phone: '',
    password: '',
    role: user?.role || '',
    department: '',
    location: '',
    recruiterBaseSalary: '',
    recruiterPTO: '',
    recruiterCarryForward: false,
    recruiterMaxCarryForward: '',
    recruiterExcessDeduction: false,
    recruiterAutoHolidays: true,
    recruiterEffectiveMonth: '',
    recruiterBonusEnabled: false,
    recruiterBonusAmount: '',
    recruiterBonusFrequency: '',
    recruiterBonusStartMonth: '',
    recruiterBonusEndMonth: '',
    candidatePayModel: '',
    candidateFixedSalary: '',
    candidateHourlyRate: '',
    candidateBillRate: '',
    candidatePercentage: '',
    candidateHybridFixedSalary: '',
    candidatePayCycleMonth: '',
    candidateHybridBillRate: '',
    candidateHybridPercentage: ''
  });

  const updateField = (field: keyof CompensationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const canProceedToStep2 = formData.firstName && formData.lastName && formData.email && formData.role;

  return createPortal(
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-[9999] p-6 animate-slide-in overflow-y-auto">
      <div className="relative w-full max-w-6xl my-8">
        <div className="glass rounded-3xl p-10 shadow-premium border-2 border-white/10">
          { }
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }} />

          <div className="relative">
            { }
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl shadow-glow-purple">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl text-gradient-premium">
                    {user ? 'Edit User' : 'Create New User'}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Step {currentStep} of 2</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 glass hover:bg-red-500/20 rounded-xl transition-all duration-300 group"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>

            { }
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex-1 h-2 rounded-full transition-all ${currentStep >= 1 ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-white/10'}`} />
              <div className={`flex-1 h-2 rounded-full transition-all ${currentStep >= 2 ? 'bg-gradient-to-r from-blue-500 to-pink-500' : 'bg-white/10'}`} />
            </div>

            { }
            {currentStep === 1 && (
              <div className="space-y-6 animate-slide-in">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10"
                        placeholder="john.doe@company.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">
                    Temporary Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10"
                      placeholder="Enter temporary password"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">User will be prompted to change on first login</p>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">
                    User Role <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10 pointer-events-none" />
                    <select
                      value={formData.role}
                      onChange={(e) => updateField('role', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-800/90 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 appearance-none cursor-pointer transition-all hover:bg-slate-800"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="">Select a role...</option>
                      <option value="admin">Admin</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="candidate">Candidate</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">
                      Department
                    </label>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => updateField('department', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10"
                        placeholder="Engineering"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider mb-2">
                      Location
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500 transition-all hover:bg-white/10"
                        placeholder="New York, NY"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2}
                    className={`px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all ${canProceedToStep2
                      ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white shadow-premium hover:shadow-glow-purple hover:scale-105'
                      : 'bg-white/5 text-slate-500 cursor-not-allowed'
                      }`}
                  >
                    Continue to Compensation
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            { }
            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-in max-h-[60vh] overflow-y-auto pr-4">
                { }
                {!formData.role && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                      <Briefcase className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No Role Selected</h3>
                    <p className="text-slate-500 mb-4">Please select a user role in Step 1</p>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Go to Basic Details
                    </button>
                  </div>
                )}

                { }
                {formData.role === 'admin' && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">Admin Role Selected</h3>
                    <p className="text-slate-500">No compensation settings required for admin users</p>
                  </div>
                )}

                { }
                {formData.role === 'recruiter' && (
                  <div className="space-y-6">
                    { }
                    <div className="glass-dark rounded-2xl p-6 border border-blue-500/30">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-200">Recruiter Compensation</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-slate-300 font-medium mb-2">
                            Base Monthly Salary
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input
                              type="number"
                              value={formData.recruiterBaseSalary}
                              onChange={(e) => updateField('recruiterBaseSalary', e.target.value)}
                              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500"
                              placeholder="5000"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-slate-300 font-medium mb-2">
                            Monthly PTO Allocation
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="number"
                              value={formData.recruiterPTO}
                              onChange={(e) => updateField('recruiterPTO', e.target.value)}
                              className="w-full pl-12 pr-16 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500"
                              placeholder="2"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">days</span>
                          </div>
                        </div>
                      </div>

                      { }
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between p-4 glass rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <div>
                              <div className="font-medium text-slate-200">Carry-Forward Allowed</div>
                              <div className="text-xs text-slate-500">Allow unused PTO to roll over</div>
                            </div>
                          </div>
                          <button
                            onClick={() => updateField('recruiterCarryForward', !formData.recruiterCarryForward)}
                            className="relative"
                          >
                            {formData.recruiterCarryForward ? (
                              <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 transition-all">
                                <div className="w-4 h-4 bg-white rounded-full" />
                              </div>
                            ) : (
                              <div className="w-12 h-6 bg-slate-600 rounded-full flex items-center justify-start px-1 transition-all">
                                <div className="w-4 h-4 bg-white rounded-full" />
                              </div>
                            )}
                          </button>
                        </div>

                        {formData.recruiterCarryForward && (
                          <div className="ml-8 animate-slide-in">
                            <label className="block text-sm text-slate-300 font-medium mb-2">
                              Max Carry-Forward Days
                            </label>
                            <input
                              type="number"
                              value={formData.recruiterMaxCarryForward}
                              onChange={(e) => updateField('recruiterMaxCarryForward', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500"
                              placeholder="5"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between p-4 glass rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            <div>
                              <div className="font-medium text-slate-200">Excess PTO Deduction Enabled</div>
                              <div className="text-xs text-slate-500">Deduct from salary if PTO exceeded</div>
                            </div>
                          </div>
                          <button
                            onClick={() => updateField('recruiterExcessDeduction', !formData.recruiterExcessDeduction)}
                            className="relative"
                          >
                            {formData.recruiterExcessDeduction ? (
                              <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 transition-all">
                                <div className="w-4 h-4 bg-white rounded-full" />
                              </div>
                            ) : (
                              <div className="w-12 h-6 bg-slate-600 rounded-full flex items-center justify-start px-1 transition-all">
                                <div className="w-4 h-4 bg-white rounded-full" />
                              </div>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 glass rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <div>
                              <div className="font-medium text-slate-200">Apply Company Holidays Automatically</div>
                              <div className="text-xs text-slate-500">Auto-apply standard holidays</div>
                            </div>
                          </div>
                          <button
                            onClick={() => updateField('recruiterAutoHolidays', !formData.recruiterAutoHolidays)}
                            className="relative"
                          >
                            {formData.recruiterAutoHolidays ? (
                              <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 transition-all">
                                <div className="w-4 h-4 bg-white rounded-full" />
                              </div>
                            ) : (
                              <div className="w-12 h-6 bg-slate-600 rounded-full flex items-center justify-start px-1 transition-all">
                                <div className="w-4 h-4 bg-white rounded-full" />
                              </div>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm text-slate-300 font-medium mb-2">
                          Effective Start Month
                        </label>
                        <input
                          type="month"
                          value={formData.recruiterEffectiveMonth}
                          onChange={(e) => updateField('recruiterEffectiveMonth', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100"
                          style={{ colorScheme: 'dark' }}
                        />
                      </div>
                    </div>

                    { }
                    <div className="glass-dark rounded-2xl p-6 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-200">Recruiter Recurring Bonus</h3>
                        </div>
                        <button
                          onClick={() => updateField('recruiterBonusEnabled', !formData.recruiterBonusEnabled)}
                          className="relative"
                        >
                          {formData.recruiterBonusEnabled ? (
                            <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 transition-all">
                              <div className="w-4 h-4 bg-white rounded-full" />
                            </div>
                          ) : (
                            <div className="w-12 h-6 bg-slate-600 rounded-full flex items-center justify-start px-1 transition-all">
                              <div className="w-4 h-4 bg-white rounded-full" />
                            </div>
                          )}
                        </button>
                      </div>

                      {formData.recruiterBonusEnabled && (
                        <div className="space-y-6 animate-slide-in">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm text-slate-300 font-medium mb-2">
                                Bonus Amount
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input
                                  type="number"
                                  value={formData.recruiterBonusAmount}
                                  onChange={(e) => updateField('recruiterBonusAmount', e.target.value)}
                                  className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500"
                                  placeholder="1000"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm text-slate-300 font-medium mb-2">
                                Bonus Frequency
                              </label>
                              <div className="relative">
                                <select
                                  value={formData.recruiterBonusFrequency}
                                  onChange={(e) => updateField('recruiterBonusFrequency', e.target.value)}
                                  className="w-full px-4 py-3 bg-slate-800/90 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 appearance-none cursor-pointer"
                                  style={{ colorScheme: 'dark' }}
                                >
                                  <option value="">Select frequency...</option>
                                  <option value="Monthly">Monthly</option>
                                  <option value="Quarterly">Quarterly</option>
                                  <option value="Yearly">Yearly</option>
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm text-slate-300 font-medium mb-2">
                                Bonus Start Month
                              </label>
                              <input
                                type="month"
                                value={formData.recruiterBonusStartMonth}
                                onChange={(e) => updateField('recruiterBonusStartMonth', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100"
                                style={{ colorScheme: 'dark' }}
                              />
                            </div>

                            <div>
                              <label className="block text-sm text-slate-300 font-medium mb-2">
                                Bonus End Month <span className="text-slate-500">(Optional)</span>
                              </label>
                              <input
                                type="month"
                                value={formData.recruiterBonusEndMonth}
                                onChange={(e) => updateField('recruiterBonusEndMonth', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100"
                                style={{ colorScheme: 'dark' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                { }
                {formData.role === 'candidate' && (
                  <div className="space-y-6">
                    { }
                    <div>
                      <label className="block text-sm text-slate-300 font-medium mb-3">
                        Candidate Compensation Model
                      </label>
                      <div className="grid grid-cols-4 gap-4">
                        {(['Fixed', 'Hourly', 'Percentage', 'Hybrid'] as PayModel[]).map((model) => (
                          <button
                            key={model}
                            onClick={() => updateField('candidatePayModel', model)}
                            className={`p-4 rounded-xl border-2 transition-all ${formData.candidatePayModel === model
                              ? 'border-emerald-500 bg-emerald-500/20 scale-105'
                              : 'border-white/10 glass hover:border-emerald-500/50'
                              }`}
                          >
                            <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${formData.candidatePayModel === model
                              ? 'bg-emerald-500'
                              : 'bg-slate-700'
                              }`}>
                              {model === 'Fixed' && <DollarSign className={`w-5 h-5 ${formData.candidatePayModel === model ? 'text-white' : 'text-slate-400'}`} />}
                              {model === 'Hourly' && <Clock className={`w-5 h-5 ${formData.candidatePayModel === model ? 'text-white' : 'text-slate-400'}`} />}
                              {model === 'Percentage' && <Percent className={`w-5 h-5 ${formData.candidatePayModel === model ? 'text-white' : 'text-slate-400'}`} />}
                              {model === 'Hybrid' && <TrendingUp className={`w-5 h-5 ${formData.candidatePayModel === model ? 'text-white' : 'text-slate-400'}`} />}
                            </div>
                            <div className={`font-semibold text-sm ${formData.candidatePayModel === model ? 'text-emerald-400' : 'text-slate-300'
                              }`}>
                              {model}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    { }
                    {formData.candidatePayModel === 'Fixed' && (
                      <div className="glass-dark rounded-2xl p-6 border border-emerald-500/30 animate-slide-in">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-emerald-500 rounded-lg">
                            <DollarSign className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-200">Fixed Salary Model</h3>
                        </div>

                        <div>
                          <label className="block text-sm text-slate-300 font-medium mb-2">
                            Fixed Monthly Salary
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input
                              type="number"
                              value={formData.candidateFixedSalary}
                              onChange={(e) => updateField('candidateFixedSalary', e.target.value)}
                              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-100 placeholder-slate-500"
                              placeholder="4000"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    { }
                    {formData.candidatePayModel === 'Hourly' && (
                      <div className="glass-dark rounded-2xl p-6 border border-blue-500/30 animate-slide-in">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-200">Hourly Rate Model</h3>
                        </div>

                        <div>
                          <label className="block text-sm text-slate-300 font-medium mb-2">
                            Hourly Rate
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input
                              type="number"
                              value={formData.candidateHourlyRate}
                              onChange={(e) => updateField('candidateHourlyRate', e.target.value)}
                              className="w-full pl-8 pr-20 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500"
                              placeholder="25"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">/hour</span>
                          </div>
                        </div>
                      </div>
                    )}

                    { }
                    {formData.candidatePayModel === 'Percentage' && (
                      <div className="glass-dark rounded-2xl p-6 border border-purple-500/30 animate-slide-in">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <Percent className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-200">Percentage-Based Model</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm text-slate-300 font-medium mb-2">
                              Client Bill Rate
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                              <input
                                type="number"
                                value={formData.candidateBillRate}
                                onChange={(e) => updateField('candidateBillRate', e.target.value)}
                                className="w-full pl-8 pr-20 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500"
                                placeholder="100"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">/hour</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-slate-300 font-medium mb-2">
                              Candidate Percentage (%)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={formData.candidatePercentage}
                                onChange={(e) => updateField('candidatePercentage', e.target.value)}
                                className="w-full px-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 placeholder-slate-500"
                                placeholder="65"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    { }
                    {formData.candidatePayModel === 'Hybrid' && (
                      <div className="glass-dark rounded-2xl p-6 border border-orange-500/30 animate-slide-in">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-orange-500 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-200">Hybrid Compensation Model</h3>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm text-slate-300 font-medium mb-2">
                              Fixed Monthly Salary (Initial Period)
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                              <input
                                type="number"
                                value={formData.candidateHybridFixedSalary}
                                onChange={(e) => updateField('candidateHybridFixedSalary', e.target.value)}
                                className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100 placeholder-slate-500"
                                placeholder="3000"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-slate-300 font-medium mb-2">
                              Pay Cycle Change Month
                            </label>
                            <input
                              type="month"
                              value={formData.candidatePayCycleMonth}
                              onChange={(e) => updateField('candidatePayCycleMonth', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100"
                              style={{ colorScheme: 'dark' }}
                            />
                            <p className="text-xs text-slate-500 mt-1">When to switch from fixed to percentage-based</p>
                          </div>

                          <div className="pt-4 border-t border-orange-500/30">
                            <h4 className="font-semibold text-slate-300 mb-4">Percentage-Based Period (After Cycle Change)</h4>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm text-slate-300 font-medium mb-2">
                                  Client Bill Rate
                                </label>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                  <input
                                    type="number"
                                    value={formData.candidateHybridBillRate}
                                    onChange={(e) => updateField('candidateHybridBillRate', e.target.value)}
                                    className="w-full pl-8 pr-20 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100 placeholder-slate-500"
                                    placeholder="100"
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">/hour</span>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm text-slate-300 font-medium mb-2">
                                  Candidate Percentage (%)
                                </label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={formData.candidateHybridPercentage}
                                    onChange={(e) => updateField('candidateHybridPercentage', e.target.value)}
                                    className="w-full px-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100 placeholder-slate-500"
                                    placeholder="70"
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between gap-4 pt-6 border-t border-white/10">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Basic Details
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white rounded-xl font-semibold shadow-premium hover:shadow-glow-purple hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {user ? 'Update' : 'Create'} User
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

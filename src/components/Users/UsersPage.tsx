import { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, Mail, Shield, User, Sparkles, UserPlus, ArrowUp } from 'lucide-react';

const usersData = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@spanteq.com', role: 'Recruiter', status: 'Active', verified: true, performance: 94 },
  { id: 2, name: 'Michael Chen', email: 'michael.c@spanteq.com', role: 'Consultant', status: 'Active', verified: true, performance: 98 },
  { id: 3, name: 'Emily Davis', email: 'emily.d@spanteq.com', role: 'Admin', status: 'Active', verified: true, performance: 92 },
  { id: 4, name: 'James Wilson', email: 'james.w@spanteq.com', role: 'Consultant', status: 'Active', verified: true, performance: 88 },
  { id: 5, name: 'Lisa Anderson', email: 'lisa.a@spanteq.com', role: 'Recruiter', status: 'Active', verified: false, performance: 85 },
  { id: 6, name: 'Robert Martinez', email: 'robert.m@spanteq.com', role: 'Consultant', status: 'Inactive', verified: true, performance: 76 },
  { id: 7, name: 'Jennifer Taylor', email: 'jennifer.t@spanteq.com', role: 'Recruiter', status: 'Active', verified: true, performance: 91 },
  { id: 8, name: 'David Brown', email: 'david.b@spanteq.com', role: 'Consultant', status: 'Active', verified: true, performance: 96 },
];

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-in">
        <div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-400">Manage all users, roles, and permissions</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl hover:shadow-glow-purple transition-all duration-300 flex items-center gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Users', value: usersData.length, icon: User, gradient: 'from-purple-500 to-blue-500' },
          { label: 'Active', value: usersData.filter(u => u.status === 'Active').length, icon: ArrowUp, gradient: 'from-green-500 to-emerald-500' },
          { label: 'Admins', value: usersData.filter(u => u.role === 'Admin').length, icon: Shield, gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Unverified', value: usersData.filter(u => !u.verified).length, icon: Mail, gradient: 'from-pink-500 to-rose-500' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass p-4 rounded-xl hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-3xl text-slate-100">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-glow-purple`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass p-4 rounded-xl animate-slide-in" style={{ animationDelay: '150ms' }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'Admin', 'Recruiter', 'Consultant'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterRole === role
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'glass text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {role === 'all' ? 'All Users' : role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredUsers.map((user, index) => (
          <div
            key={user.id}
            className="glass p-6 rounded-2xl hover-lift card-shine group animate-slide-in"
            style={{ animationDelay: `${200 + index * 50}ms` }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-glow-purple">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg text-slate-100">{user.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{user.email}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs ${
                    user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    user.role === 'Recruiter' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  }`}>
                    {user.role}
                  </span>
                  {!user.verified && (
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-xs">
                      Pending Verification
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Performance Score</span>
                <span className="text-purple-400">{user.performance}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full transition-all duration-1000"
                  style={{ width: `${user.performance}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-white/5">
              <button className="flex-1 px-4 py-2 glass rounded-lg hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2 text-sm text-slate-300 hover:text-purple-400">
                <Eye className="w-4 h-4" />
                View
              </button>
              <button className="flex-1 px-4 py-2 glass rounded-lg hover:bg-blue-500/10 transition-all flex items-center justify-center gap-2 text-sm text-slate-300 hover:text-blue-400">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="px-4 py-2 glass rounded-lg hover:bg-red-500/10 transition-all text-sm text-slate-300 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

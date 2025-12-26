import { useState } from 'react';
import { 
  Plus, Search, Edit2, Eye, Building2, Mail, MapPin, 
  CreditCard, X, Globe, Calendar, DollarSign, Clock,
  TrendingUp, Users, ChevronDown, Filter, Zap, Sparkles,
  ArrowUp, Target, BarChart3, Activity
} from 'lucide-react';

interface ClientProfile {
  id: string;
  clientName: string;
  billingEmails: { to: string[]; cc: string[] };
  paymentTerms: number;
  currency: string;
  logo: string;
  billingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  updatedAt: string;
  activeContracts?: number;
  totalRevenue?: number;
  status?: 'active' | 'inactive' | 'pending';
}

const mockProfiles: ClientProfile[] = [
  {
    id: '1',
    clientName: 'TechCorp Solutions',
    billingEmails: { to: ['billing@techcorp.com', 'finance@techcorp.com'], cc: ['manager@techcorp.com'] },
    paymentTerms: 30,
    currency: 'USD',
    logo: 'techcorp-logo.png',
    billingAddress: {
      line1: '123 Tech Street',
      line2: 'Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States'
    },
    updatedAt: '2024-12-10',
    activeContracts: 5,
    totalRevenue: 450000,
    status: 'active'
  },
  {
    id: '2',
    clientName: 'Global Innovations Ltd',
    billingEmails: { to: ['accounts@globalinnov.com'], cc: [] },
    paymentTerms: 45,
    currency: 'USD',
    logo: 'global-logo.png',
    billingAddress: {
      line1: '456 Innovation Ave',
      line2: '',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    updatedAt: '2024-12-08',
    activeContracts: 3,
    totalRevenue: 275000,
    status: 'active'
  },
  {
    id: '3',
    clientName: 'Enterprise Systems Inc',
    billingEmails: { to: ['billing@enterprisesys.com'], cc: ['cfo@enterprisesys.com'] },
    paymentTerms: 15,
    currency: 'USD',
    logo: 'enterprise-logo.png',
    billingAddress: {
      line1: '789 Enterprise Blvd',
      line2: 'Floor 12',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'United States'
    },
    updatedAt: '2024-12-12',
    activeContracts: 8,
    totalRevenue: 620000,
    status: 'active'
  },
  {
    id: '4',
    clientName: 'Digital Dynamics Corp',
    billingEmails: { to: ['finance@digitaldyn.com'], cc: ['admin@digitaldyn.com'] },
    paymentTerms: 30,
    currency: 'USD',
    logo: 'digital-logo.png',
    billingAddress: {
      line1: '321 Digital Way',
      line2: '',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States'
    },
    updatedAt: '2024-11-28',
    activeContracts: 2,
    totalRevenue: 180000,
    status: 'pending'
  },
];

export function ClientBillingProfiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ClientProfile | null>(null);

  const filteredProfiles = mockProfiles.filter(profile =>
    profile.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.billingAddress.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalClients: mockProfiles.length,
    activeClients: mockProfiles.filter(p => p.status === 'active').length,
    totalRevenue: mockProfiles.reduce((sum, p) => sum + (p.totalRevenue || 0), 0),
    avgPaymentTerms: mockProfiles.reduce((sum, p, _, arr) => sum + p.paymentTerms / arr.length, 0),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Ultra-Premium Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 border border-purple-500/20">
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 animate-gradient" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl animate-ping" style={{ animationDuration: '3s' }} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                <Building2 className="w-8 h-8 text-white" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent rounded-2xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white mb-1 tracking-tight">Client Billing Profiles</h1>
                <p className="text-purple-200 font-semibold text-sm">Manage client information and billing configurations</p>
              </div>
            </div>
            
            <button className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-500/30">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                <span className="text-white font-black">Add Client</span>
              </div>
            </button>
          </div>

          {/* Ultra Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: 'Total Clients', 
                value: stats.totalClients, 
                icon: Building2,
                gradient: 'from-purple-500 to-indigo-500',
                change: '+3',
                bgGlow: 'purple'
              },
              { 
                label: 'Active Clients', 
                value: stats.activeClients, 
                icon: Users,
                gradient: 'from-pink-500 to-rose-500',
                change: '+2',
                bgGlow: 'pink'
              },
              { 
                label: 'Total Revenue', 
                value: formatCurrency(stats.totalRevenue), 
                icon: DollarSign,
                gradient: 'from-emerald-500 to-green-500',
                change: '+18%',
                bgGlow: 'emerald'
              },
              { 
                label: 'Avg Payment Terms', 
                value: `${Math.round(stats.avgPaymentTerms)} days`, 
                icon: Clock,
                gradient: 'from-blue-500 to-cyan-500',
                change: '30d',
                bgGlow: 'blue'
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg shadow-${stat.bgGlow}-500/50 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                        <TrendingUp className="w-3 h-3 text-purple-300" strokeWidth={2.5} />
                        <span className="text-xs font-black text-purple-300">{stat.change}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-purple-200 font-bold uppercase tracking-wider mb-2">{stat.label}</div>
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advanced Search */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 border border-white/10 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
        
        <div className="relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client name or location..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all hover:bg-white/10 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Premium Client Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 border border-white/10 backdrop-blur-xl hover:border-purple-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-1">{profile.clientName}</h3>
                    <p className="text-xs text-slate-500 font-medium">ID: {profile.id}</p>
                  </div>
                </div>
                
                <span className={`px-3 py-1.5 rounded-lg text-xs font-black border ${
                  profile.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : profile.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {profile.status?.toUpperCase()}
                </span>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl bg-white/5 p-4 border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                  <div className="relative">
                    <div className="text-xs text-slate-400 font-bold uppercase mb-2 flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                      Active Contracts
                    </div>
                    <div className="text-2xl font-black text-white">{profile.activeContracts}</div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl bg-white/5 p-4 border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
                  <div className="relative">
                    <div className="text-xs text-slate-400 font-bold uppercase mb-2 flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-purple-500" />
                      Total Revenue
                    </div>
                    <div className="text-2xl font-black text-emerald-400">{formatCurrency(profile.totalRevenue || 0)}</div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium mb-0.5">Primary Email</div>
                    <div className="text-sm text-slate-300 font-medium">{profile.billingEmails.to[0]}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium mb-0.5">Location</div>
                    <div className="text-sm text-slate-300 font-medium">
                      {profile.billingAddress.city}, {profile.billingAddress.state}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium mb-0.5">Payment Terms</div>
                    <div className="text-sm text-slate-300 font-medium">{profile.paymentTerms} days</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setSelectedProfile(profile);
                    setShowDetailModal(true);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-sm text-white font-black">View Details</span>
                  </div>
                </button>
                <button className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300">
                  <Edit2 className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 max-w-4xl w-full p-8 shadow-2xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black text-white">Client Profile Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Client Header */}
                <div className="flex items-start gap-4 pb-6 border-b border-white/10">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-black text-white mb-2">{selectedProfile.clientName}</h4>
                    <p className="text-sm text-slate-400 font-medium">Client ID: {selectedProfile.id}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-black border ${
                    selectedProfile.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {selectedProfile.status?.toUpperCase()}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 p-6 border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                    <div className="relative">
                      <div className="text-xs text-slate-400 font-bold uppercase mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-500" />
                        Active Contracts
                      </div>
                      <div className="text-4xl font-black text-white">{selectedProfile.activeContracts}</div>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 p-6 border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                    <div className="relative">
                      <div className="text-xs text-slate-400 font-bold uppercase mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-purple-500" />
                        Total Revenue
                      </div>
                      <div className="text-4xl font-black text-emerald-400">{formatCurrency(selectedProfile.totalRevenue || 0)}</div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      Contact Information
                    </h5>
                    <div className="space-y-3 bg-white/5 rounded-xl p-4 border border-white/10">
                      <div>
                        <div className="text-xs text-slate-500 font-medium mb-1">Primary Emails</div>
                        {selectedProfile.billingEmails.to.map((email, index) => (
                          <div key={index} className="text-sm text-slate-300 font-medium">{email}</div>
                        ))}
                      </div>
                      {selectedProfile.billingEmails.cc.length > 0 && (
                        <div>
                          <div className="text-xs text-slate-500 font-medium mb-1">CC</div>
                          {selectedProfile.billingEmails.cc.map((email, index) => (
                            <div key={index} className="text-sm text-slate-300 font-medium">{email}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-pink-500" />
                      Billing Details
                    </h5>
                    <div className="space-y-3 bg-white/5 rounded-xl p-4 border border-white/10">
                      <div>
                        <div className="text-xs text-slate-500 font-medium mb-1">Payment Terms</div>
                        <div className="text-sm font-black text-white">{selectedProfile.paymentTerms} days</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium mb-1">Currency</div>
                        <div className="text-sm font-black text-white">{selectedProfile.currency}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h5 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    Billing Address
                  </h5>
                  <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-sm text-slate-300 space-y-1 font-medium">
                    <div>{selectedProfile.billingAddress.line1}</div>
                    {selectedProfile.billingAddress.line2 && <div>{selectedProfile.billingAddress.line2}</div>}
                    <div>
                      {selectedProfile.billingAddress.city}, {selectedProfile.billingAddress.state} {selectedProfile.billingAddress.zip}
                    </div>
                    <div>{selectedProfile.billingAddress.country}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-white/10">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30">
                    <div className="flex items-center justify-center gap-2">
                      <Edit2 className="w-4 h-4 text-white" />
                      <span className="text-white font-black">Edit Profile</span>
                    </div>
                  </button>
                  <button className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300">
                    <span className="text-white font-black">View Invoices</span>
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

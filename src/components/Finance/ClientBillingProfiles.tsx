import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit2, Eye, Building2, Mail, MapPin,
  CreditCard, X, Globe, Calendar, DollarSign, Clock,
  TrendingUp, Users, ChevronDown, Filter, Zap, Sparkles,
  ArrowUp, Target, BarChart3, Activity, Loader2
} from 'lucide-react';
import FinanceService from '../../services/finance.service';

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

export function ClientBillingProfiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ClientProfile[]>([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const submissions = await FinanceService.getSubmissions();

      const clientMap: Record<string, any> = {};
      submissions.forEach((s: any) => {
        const clientName = s.client || 'Unknown Client';
        if (!clientMap[clientName]) {
          clientMap[clientName] = {
            id: s._id,
            clientName: clientName,
            activeContracts: 0,
            totalRevenue: 0,
            status: 'active',
            createdAt: s.createdAt
          };
        }
        clientMap[clientName].activeContracts++;
        clientMap[clientName].totalRevenue += 5000;
      });

      const mapped: ClientProfile[] = Object.values(clientMap).map(c => ({
        id: c.id,
        clientName: c.clientName,
        billingEmails: { to: [`billing@${c.clientName.toLowerCase().replace(/\s/g, '')}.com`], cc: [] },
        paymentTerms: 30,
        currency: 'USD',
        logo: '',
        billingAddress: {
          line1: '123 Business Way',
          line2: '',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        },
        updatedAt: c.createdAt,
        activeContracts: c.activeContracts,
        totalRevenue: c.totalRevenue,
        status: 'active'
      }));

      setProfiles(mapped);
    } catch (err: any) {
      console.error('Error fetching client profiles:', err);
      setError('Failed to load client billing profiles.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.billingAddress.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalClients: profiles.length,
    activeClients: profiles.filter(p => p.status === 'active').length,
    totalRevenue: profiles.reduce((sum, p) => sum + (p.totalRevenue || 0), 0),
    avgPaymentTerms: profiles.length > 0 ? profiles.reduce((sum, p) => sum + p.paymentTerms, 0) / profiles.length : 0,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-purple-200 font-bold">Loading Client Profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 border border-purple-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 text-white">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-1">Client Billing Profiles</h1>
                <p className="text-purple-200 font-semibold text-sm">Managing billing for {stats.totalClients} clients</p>
              </div>
            </div>

            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-xl transition-all font-black">
              <Plus className="w-5 h-5 inline mr-2" />
              Add Client
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
            {[
              { label: 'Total Clients', value: stats.totalClients, icon: Building2, gradient: 'from-purple-500 to-indigo-500' },
              { label: 'Active Clients', value: stats.activeClients, icon: Users, gradient: 'from-pink-500 to-rose-500' },
              { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, gradient: 'from-emerald-500 to-green-500' },
              { label: 'Avg Payment', value: `${Math.round(stats.avgPaymentTerms)} days`, icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-xs text-purple-200 font-bold uppercase mb-2">{stat.label}</div>
                <div className="text-3xl font-black">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 border border-white/10 backdrop-blur-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name..."
            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 p-6 hover:border-purple-500/30 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{profile.clientName}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Partner</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-black uppercase">Active</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Contracts</div>
                <div className="text-2xl font-black text-white">{profile.activeContracts}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Rev Estimate</div>
                <div className="text-2xl font-black text-emerald-400">{formatCurrency(profile.totalRevenue || 0)}</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Mail className="w-4 h-4 text-purple-400" />
                {profile.billingEmails.to[0]}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-pink-400" />
                {profile.billingAddress.city}, {profile.billingAddress.state}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedProfile(profile); setShowDetailModal(true); }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-black shadow-lg shadow-purple-900/40"
              >
                View Profile
              </button>
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10"><Edit2 className="w-5 h-5 text-slate-400" /></button>
            </div>
          </div>
        ))}
      </div>

      {showDetailModal && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-white">Client Summary</h2>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-6 h-6 text-slate-400" /></button>
              </div>

              <div className="space-y-6 text-white">
                <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Building2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{selectedProfile.clientName}</h3>
                    <p className="text-slate-400 font-bold underline">Partner Account</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-4">Billing Details</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Primary Billing</div>
                        <div className="text-sm font-bold">{selectedProfile.billingEmails.to[0]}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Terms</div>
                        <div className="text-sm font-bold">{selectedProfile.paymentTerms} Days Net</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-pink-400 uppercase tracking-widest mb-4">Address</h4>
                    <div className="text-sm text-slate-300 leading-relaxed font-medium">
                      {selectedProfile.billingAddress.line1}<br />
                      {selectedProfile.billingAddress.city}, {selectedProfile.billingAddress.state} {selectedProfile.billingAddress.zip}<br />
                      {selectedProfile.billingAddress.country}
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button className="flex-1 py-4 bg-purple-600 rounded-2xl font-black hover:bg-purple-500 shadow-xl shadow-purple-900/40">Download Profile</button>
                  <button onClick={() => setShowDetailModal(false)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black hover:bg-white/10">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

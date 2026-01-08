import { useState, useEffect, useCallback } from 'react';
import {
    Search, Users, Mail, Phone, MapPin, Briefcase, ChevronDown, Eye,
    User as UserIcon, CheckCircle, Clock, X, Calendar, Map, Smartphone,
    Trash2, Edit, Sparkles
} from 'lucide-react';
import RecruiterService from '../../services/recruiter.service';
import type { User } from '../../services/user.service';

export function RecruiterCandidates() {
    const [candidates, setCandidates] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCandidate, setSelectedCandidate] = useState<User | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'candidate',
        location: '',
        status: 'active'
    });

    const fetchCandidates = useCallback(async () => {
        try {
            setLoading(true);
            const data = await RecruiterService.getMyCandidates();
            setCandidates(data);
        } catch (err) {
            console.error('Failed to fetch candidates', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    const filteredCandidates = candidates.filter(user => {
        const matchesSearch =
            (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: candidates.length,
        active: candidates.filter(c => c.status === 'active').length,
        inactive: candidates.filter(c => c.status !== 'active').length,
        new: candidates.filter(c => {
            const created = new Date(c.createdAt || Date.now());
            const now = new Date();
            const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
            return diff < 7;
        }).length
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && selectedCandidate?._id) {
                await RecruiterService.updateCandidate(selectedCandidate._id, formData);
            } else {
                await RecruiterService.createCandidate(formData);
            }
            setShowFormModal(false);
            fetchCandidates();
            resetForm();
        } catch (err) {
            console.error('Operation failed', err);
            alert('Operation failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this candidate?')) return;
        try {
            await RecruiterService.deleteCandidate(id);
            fetchCandidates();
        } catch (err) {
            alert('Failed to delete candidate');
        }
    };

    const openEditModal = (candidate: User) => {
        setSelectedCandidate(candidate);
        setFormData({
            name: candidate.name || '',
            email: candidate.email || '',
            password: '',
            phone: candidate.phone || '',
            role: candidate.role || 'candidate',
            location: candidate.location || '',
            status: candidate.status || 'active'
        });
        setIsEditing(true);
        setShowFormModal(true);
    };

    const openAddModal = () => {
        resetForm();
        setIsEditing(false);
        setShowFormModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            role: 'candidate',
            location: '',
            status: 'active'
        });
        setSelectedCandidate(null);
    };

    return (
        <div className="p-8 space-y-6">
            {}
            <div className="relative">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                <div className="relative flex items-center justify-between mb-2 animate-slide-in">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-glow-blue animate-pulse-glow">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl text-gradient-premium">My Candidates</h1>
                            <p className="text-slate-400 mt-1 text-sm">Manage and track your private talent pool</p>
                        </div>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg hover:shadow-glow-blue hover:scale-105 transition-all duration-300"
                    >
                        <Users className="w-5 h-5" />
                        Add Candidate
                    </button>
                </div>
            </div>

            {}
            <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
                {[
                    { label: 'Total Candidates', value: stats.total, gradient: 'from-blue-500 to-indigo-500', icon: Users },
                    { label: 'Active Status', value: stats.active, gradient: 'from-green-500 to-emerald-500', icon: CheckCircle },
                    { label: 'Inactive / On Bench', value: stats.inactive, gradient: 'from-slate-500 to-slate-700', icon: Clock },
                    { label: 'Recently Added', value: stats.new, gradient: 'from-purple-500 to-pink-500', icon: Sparkles },
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

            {}
            <div className="glass rounded-3xl p-6 mb-8 animate-slide-in shadow-premium" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-all duration-300" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email..."
                            className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:bg-white/10"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 text-slate-300 px-6 py-4 rounded-2xl pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {}
            <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in relative z-20" style={{ animationDelay: '300ms' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="glass-dark border-b border-white/10">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Candidate</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Contact</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Location</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</th>
                                <th className="px-8 py-5 text-right text-xs text-slate-400 uppercase tracking-wider font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading && candidates.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">
                                        <div className="flex justify-center mb-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                                        </div>
                                        Loading candidates...
                                    </td>
                                </tr>
                            ) : filteredCandidates.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">No candidates found matching your criteria.</td>
                                </tr>
                            ) : (
                                filteredCandidates.map((candidate, index) => (
                                    <tr
                                        key={candidate._id || index}
                                        className="group hover:bg-white/5 transition-all duration-300 animate-slide-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-glow-blue">
                                                    {(candidate.name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-slate-200 font-semibold group-hover:text-white transition-colors">{candidate.name}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Briefcase className="w-3 h-3" />
                                                        {candidate.role || 'Candidate'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200 transition-colors">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span className="text-sm">{candidate.email}</span>
                                                </div>
                                                {candidate.phone && (
                                                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-400 transition-colors">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        <span className="text-xs">{candidate.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            {candidate.location ? (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="text-sm">{candidate.location}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-600 text-sm">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider badge-glow ${candidate.status === 'active'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${candidate.status === 'active' ? 'bg-green-400 animate-pulse-glow' : 'bg-slate-400'}`} />
                                                {candidate.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setSelectedCandidate(candidate); setShowDetailModal(true); }}
                                                    className="p-2.5 glass rounded-xl text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(candidate)}
                                                    className="p-2.5 glass rounded-xl text-slate-400 hover:bg-amber-500/20 hover:text-amber-400 hover:shadow-glow-amber transition-all duration-300"
                                                    title="Edit Candidate"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => candidate._id && handleDelete(candidate._id)}
                                                    className="p-2.5 glass rounded-xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:shadow-glow-red transition-all duration-300"
                                                    title="Delete Candidate"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {}
            {showDetailModal && selectedCandidate && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-dark max-w-2xl w-full rounded-[40px] p-10 border border-white/20 shadow-2xl relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 -mr-20 -mt-20" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gradient-premium">Candidate Profile</h2>
                            <button onClick={() => setShowDetailModal(false)} className="p-3 glass rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6 p-6 glass rounded-3xl border border-white/10">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-[32px] flex items-center justify-center text-4xl font-black text-white shadow-glow-blue">
                                    {(selectedCandidate.name || 'U').charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-black text-white">{selectedCandidate.name}</h3>
                                    <div className="flex items-center gap-3 text-slate-400 mt-1">
                                        <Briefcase className="w-4 h-4" />
                                        <span className="font-medium">{selectedCandidate.role || 'Professional Candidate'}</span>
                                    </div>
                                    <div className={`mt-3 w-fit px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${selectedCandidate.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                                        {selectedCandidate.status}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Contact Details</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-200">
                                            <Mail className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm truncate">{selectedCandidate.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-200">
                                            <Smartphone className="w-4 h-4 text-cyan-400" />
                                            <span className="text-sm">{selectedCandidate.phone || 'No phone added'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Additional Info</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-200">
                                            <Map className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm">{selectedCandidate.location || 'Remote / Global'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-200">
                                            <Calendar className="w-4 h-4 text-pink-400" />
                                            <span className="text-sm">Added {new Date(selectedCandidate.createdAt || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setShowDetailModal(false); openEditModal(selectedCandidate); }}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-3xl text-slate-300 font-black tracking-widest hover:bg-white/10 transition-all"
                                >
                                    EDIT PROFILE
                                </button>
                                <button className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl font-black tracking-widest shadow-glow-blue hover:scale-[1.02] transition-all">
                                    SEND MESSAGE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {}
            {showFormModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFormModal(false)} />
                    <div className="relative glass-dark rounded-3xl p-8 w-full max-w-lg border border-white/20 shadow-2xl animate-scale-in">
                        <h2 className="text-2xl font-bold text-white mb-6">{isEditing ? 'Edit Candidate' : 'Add New Candidate'}</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                />
                            </div>
                            {!isEditing && (
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                        placeholder="Set initial password"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className="flex-1 px-4 py-3 glass rounded-xl text-slate-300 hover:text-white transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-bold shadow-lg hover:shadow-glow-blue transition-all"
                                >
                                    {isEditing ? 'Save Changes' : 'Create Candidate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

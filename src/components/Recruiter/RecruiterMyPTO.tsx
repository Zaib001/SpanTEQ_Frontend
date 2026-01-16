import { useState, useEffect } from 'react';
import { Calendar, Plus, X, Clock, CheckCircle, XCircle, Info } from 'lucide-react';
import RecruiterService from '../../services/recruiter.service';
import type { PTORequest } from '../../services/pto.service';

export function RecruiterMyPTO() {
    const [requests, setRequests] = useState<PTORequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        type: 'vacation',
        reason: ''
    });

    useEffect(() => {
        fetchPTO();
    }, []);

    const fetchPTO = async () => {
        try {
            setLoading(true);
            const data = await RecruiterService.getMyPTORequests({ _cb: Date.now() });
            setRequests(data);
        } catch (err) {
            console.error('Failed to fetch PTO requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await RecruiterService.submitMyPTORequest(formData);
            await fetchPTO();
            setShowModal(false);
            setFormData({ from: '', to: '', type: 'vacation', reason: '' });
            alert('PTO request submitted successfully!');
        } catch (err) {
            console.error('Failed to submit PTO request', err);
            alert('Failed to submit PTO request');
        } finally {
            setSubmitting(false);
        }
    };

    const getDays = (start: string, end: string) => {
        if (!start || !end) return 0;
        const s = new Date(start);
        const e = new Date(end);
        if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
        return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    };

    return (
        <div className="p-8 space-y-6">
            <div className="relative flex items-center justify-between mb-8 animate-slide-in">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-glow-purple animate-pulse-glow">
                        <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl text-gradient-premium">My PTO Requests</h1>
                        <p className="text-slate-400 mt-1 text-sm">Apply for leave and track your requests</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-glow-purple hover:scale-105 transition-all duration-300"
                >
                    <Plus className="w-5 h-5" />
                    New Request
                </button>
            </div>

            <div className="grid grid-cols-4 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
                <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full blur-3xl opacity-10" />
                    <p className="text-sm text-slate-400 mb-1">Total Requests</p>
                    <p className="text-3xl font-black text-white">{requests.length}</p>
                </div>
                <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 rounded-full blur-3xl opacity-10" />
                    <p className="text-sm text-slate-400 mb-1">Approved</p>
                    <p className="text-3xl font-black text-white">{requests.filter(r => r.status === 'approved').length}</p>
                </div>
                <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500 rounded-full blur-3xl opacity-10" />
                    <p className="text-sm text-slate-400 mb-1">Pending</p>
                    <p className="text-3xl font-black text-white">{requests.filter(r => r.status === 'pending').length}</p>
                </div>
                <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-10" />
                    <p className="text-sm text-slate-400 mb-1">Est. Balance</p>
                    <p className="text-3xl font-black text-white">10 Days</p>
                </div>
            </div>

            <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in" style={{ animationDelay: '200ms' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="glass-dark border-b border-white/10">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Type</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Duration</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Days</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Requested On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400">Loading your PTO requests...</td>
                                </tr>
                            ) : requests.map((req, index) => (
                                <tr key={req._id} className="hover:bg-white/5 transition-colors group animate-slide-in" style={{ animationDelay: `${index * 20}ms` }}>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-slate-200 text-xs font-bold capitalize border border-white/10">
                                            {req.type === 'sick' ? '🤒' : '🌴'} {req.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 text-sm font-bold">
                                                {new Date(req.from).toLocaleDateString()}
                                            </span>
                                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                                to {new Date(req.to).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-white font-black font-mono">
                                        {getDays(req.from, req.to)} Days
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${req.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            req.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-slate-500 text-xs font-bold font-mono">
                                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            {!loading && requests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-500">No PTO requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-dark max-w-xl w-full rounded-[40px] p-10 border border-white/20 shadow-2xl relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-10 -mr-20 -mt-20" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gradient-premium">New PTO Request</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-3 glass rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.from}
                                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 transition-all hover:bg-white/10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">End Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.to}
                                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-100 transition-all hover:bg-white/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Leave Type *</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['vacation', 'sick', 'personal', 'other'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`px-6 py-4 rounded-2xl border transition-all text-sm font-bold capitalize ${formData.type === type
                                                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-glow-purple'
                                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-1">Reason (Optional)</label>
                                <textarea
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="Briefly describe the reason for your leave..."
                                    className="w-full h-24 bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-[28px] text-slate-300 font-black tracking-widest hover:bg-white/10 transition-all uppercase text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black tracking-widest shadow-glow-purple hover:scale-[1.02] transition-all disabled:opacity-50 uppercase text-xs"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

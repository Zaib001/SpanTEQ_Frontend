import { useState, useEffect } from 'react';
import { Clock, Plus, X, Calendar, FileText } from 'lucide-react';
import RecruiterService from '../../services/recruiter.service';
import type { Timesheet } from '../../services/timesheet.service';

export function RecruiterMyTimesheets() {
    const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        hours: '',
        client: 'Internal'
    });

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const fetchTimesheets = async () => {
        try {
            setLoading(true);
            const data = await RecruiterService.getMyTimesheets({ _cb: Date.now() });
            setTimesheets(data);
        } catch (err) {
            console.error('Failed to fetch timesheets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.from || !formData.to || !formData.hours) {
            alert('Please fill all required fields');
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                from: formData.from,
                to: formData.to,
                hours: Number(formData.hours),
                client: formData.client
            };

            await RecruiterService.submitMyTimesheet(payload);

            await fetchTimesheets();
            setFormData({ from: '', to: '', hours: '', client: 'Internal' });
            setShowModal(false);
            alert('Timesheet submitted successfully!');
        } catch (err) {
            console.error('Failed to submit timesheet', err);
            alert('Failed to submit timesheet. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="relative flex items-center justify-between mb-8 animate-slide-in">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl shadow-glow-blue animate-pulse-glow">
                        <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl text-gradient-premium">My Timesheets</h1>
                        <p className="text-slate-400 mt-1 text-sm">Submit and track your individual working hours</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-glow-blue hover:scale-105 transition-all duration-300"
                >
                    <Plus className="w-5 h-5" />
                    Submit New
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
                <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
                    <p className="text-sm text-slate-400 mb-1">Total Submissions</p>
                    <p className="text-3xl font-black text-white">{timesheets.length}</p>
                </div>
                <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
                    <p className="text-sm text-slate-400 mb-1">Approved Sheets</p>
                    <p className="text-3xl font-black text-white">{timesheets.filter(t => t.status === 'approved').length}</p>
                </div>
                <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
                    <p className="text-sm text-slate-400 mb-1">Pending Review</p>
                    <p className="text-3xl font-black text-white">{timesheets.filter(t => t.status === 'pending').length}</p>
                </div>
            </div>

            <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in" style={{ animationDelay: '200ms' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="glass-dark border-b border-white/10">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Period</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Project/Client</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Hours</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Submitted On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center">
                                        <div className="flex justify-center mb-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                                        </div>
                                        <span className="text-slate-400">Loading your timesheets...</span>
                                    </td>
                                </tr>
                            ) : timesheets.map((ts, index) => (
                                <tr key={ts._id} className="hover:bg-white/5 transition-colors group animate-slide-in" style={{ animationDelay: `${index * 20}ms` }}>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-slate-200">
                                            <Calendar className="w-4 h-4 text-blue-400" />
                                            <span className="font-bold">
                                                {new Date(ts.from).toLocaleDateString()} - {new Date(ts.to).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-300 font-medium whitespace-nowrap">
                                        {ts.client || 'Internal'}
                                    </td>
                                    <td className="px-8 py-5 text-white font-black whitespace-nowrap">
                                        {ts.hours} hrs
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${ts.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            ts.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {ts.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-slate-500 text-xs font-bold font-mono whitespace-nowrap">
                                        {new Date(ts.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {!loading && timesheets.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-slate-400">No Timesheets Found</h3>
                                        <p className="text-slate-600 mt-2">You haven't submitted any timesheets yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-dark max-w-xl w-full rounded-[40px] p-10 border border-white/20 shadow-2xl relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 -mr-20 -mt-20" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gradient-premium">Submit Timesheet</h2>
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
                                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">From Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.from}
                                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 transition-all hover:bg-white/10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">To Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.to}
                                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 transition-all hover:bg-white/10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Total Hours *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.5"
                                        value={formData.hours}
                                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 transition-all hover:bg-white/10"
                                        placeholder="40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Project/Client</label>
                                    <input
                                        type="text"
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 transition-all hover:bg-white/10"
                                        placeholder="Internal/Project Name"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-[28px] text-slate-300 font-black tracking-widest hover:bg-white/10 transition-all uppercase text-xs"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[28px] text-white font-black tracking-widest shadow-glow-blue hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase text-xs"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Timesheet'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Clock, Plus, X } from 'lucide-react';
import CandidateService from '../../services/candidate.service';
import type { Timesheet } from '../../services/timesheet.service';

export function CandidateTimesheet() {
    const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        hours: '',
        client: ''
    });

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const fetchTimesheets = async () => {
        try {
            setLoading(true);
            const data = await CandidateService.getMyTimesheets();
            setTimesheets(data);
        } catch (err) {
            void err;
            console.error(err);
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
            const data = new FormData();
            data.append('from', formData.from);
            data.append('to', formData.to);
            data.append('hours', formData.hours);
            data.append('client', formData.client || 'N/A');

            await CandidateService.submitTimesheet(data);

            await fetchTimesheets();
            setFormData({ from: '', to: '', hours: '', client: '' });
            setShowModal(false);
            alert('Timesheet submitted successfully!');
        } catch (err) {
            void err;
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
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-glow-blue">
                        <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100">My Timesheets</h1>
                        <p className="text-slate-400 mt-1">Submit and view timesheets</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold shadow-glow-blue hover:scale-105 transition-all duration-300"
                >
                    <Plus className="w-5 h-5" />
                    Submit New
                </button>
            </div>

            <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="glass-dark border-b border-white/10">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Period</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Hours</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Submitted On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {timesheets.map((ts) => (
                                <tr key={ts._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-5 text-slate-200 font-medium">
                                        {new Date(ts.from).toLocaleDateString()} - {new Date(ts.to).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-slate-300">
                                        {ts.hours} hrs
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${ts.status === 'approved' ? 'bg-green-500/20 text-green-400' : ts.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {ts.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-slate-400 text-sm">
                                        {new Date(ts.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {!loading && timesheets.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400">No timesheets submitted yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {}
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
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">From Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.from}
                                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">To Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.to}
                                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">Total Hours *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.5"
                                        value={formData.hours}
                                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100"
                                        placeholder="40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">Client</label>
                                    <input
                                        type="text"
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100"
                                        placeholder="Client name"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-300 font-bold hover:bg-white/10 transition-all"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white font-bold shadow-glow-blue hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

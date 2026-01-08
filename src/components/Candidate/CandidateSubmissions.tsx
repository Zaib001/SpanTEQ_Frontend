import { useState, useEffect } from 'react';
import { FileText, Briefcase, Plus, X } from 'lucide-react';
import CandidateService from '../../services/candidate.service';
import type { Submission } from '../../services/submission.service';

export function CandidateSubmissions() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [recruiters, setRecruiters] = useState<Array<{ _id: string; name: string; email: string }>>([]);
    const [formData, setFormData] = useState({
        recruiter: '',
        client: '',
        vendor: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchSubmissions();
        fetchRecruiters();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const data = await CandidateService.getMySubmissions();
            setSubmissions(data);
        } catch (err) {
            void err;
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecruiters = async () => {
        try {
            const data = await CandidateService.getRecruiters();
            setRecruiters(data);
        } catch (err) {
            void err;
            console.error('Failed to fetch recruiters', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.recruiter || !formData.client || !formData.date) {
            alert('Please fill all required fields');
            return;
        }

        try {
            setSubmitting(true);
            await CandidateService.createSubmission({
                recruiter: formData.recruiter,
                client: formData.client,
                vendor: formData.vendor || undefined,
                date: formData.date,
                status: 'pending'
            });

            // Refresh and reset
            await fetchSubmissions();
            setFormData({ recruiter: '', client: '', vendor: '', date: new Date().toISOString().split('T')[0] });
            setShowModal(false);
            alert('Submission created successfully!');
        } catch (err) {
            void err;
            console.error('Failed to create submission', err);
            alert('Failed to create submission. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="relative flex items-center justify-between mb-8 animate-slide-in">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-glow-orange">
                        <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100">My Submissions</h1>
                        <p className="text-slate-400 mt-1">Track status of your applications</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold shadow-glow-orange hover:scale-105 transition-all duration-300"
                >
                    <Plus className="w-5 h-5" />
                    Create Submission
                </button>
            </div>

            <div className="glass rounded-3xl overflow-hidden shadow-premium animate-slide-in">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="glass-dark border-b border-white/10">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Client</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Role</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Submitted On</th>
                                <th className="px-8 py-5 text-left text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {submissions.map((sub) => (
                                <tr key={sub._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-5 text-slate-200 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-slate-500" />
                                            {sub.client}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-300">
                                        {sub.role || 'N/A'}
                                    </td>
                                    <td className="px-8 py-5 text-slate-400 text-sm">
                                        {new Date(sub.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase badge-glow bg-blue-500/20 text-blue-400`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {!loading && submissions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400">No submissions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Submission Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-dark max-w-xl w-full rounded-[40px] p-10 border border-white/20 shadow-2xl relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-10 -mr-20 -mt-20" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gradient-premium">Create Submission</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-3 glass rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-2">Recruiter *</label>
                                <select
                                    required
                                    value={formData.recruiter}
                                    onChange={(e) => setFormData({ ...formData, recruiter: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100"
                                >
                                    <option value="">Select a recruiter</option>
                                    {recruiters.map((rec) => (
                                        <option key={rec._id} value={rec._id} className="bg-slate-900">
                                            {rec.name} ({rec.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-2">Client Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.client}
                                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100"
                                    placeholder="Enter client name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-2">Vendor (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.vendor}
                                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100"
                                    placeholder="Enter vendor name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-2">Submission Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100"
                                />
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
                                    className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white font-bold shadow-glow-orange hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Submission'
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

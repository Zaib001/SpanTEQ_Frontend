import { useState, useEffect } from 'react';
import {
    X, Plus, Trash2, Calendar, Clock, User,
    Video, Phone, MapPin, CheckCircle, AlertCircle,
    Edit2, ChevronRight
} from 'lucide-react';
import InterviewService, { type Interview } from '../../services/interview.service';

interface Props {
    submissionId: string;
    candidateName: string;
    onClose: () => void;
    onUpdate: () => void;
}

export default function InterviewManagementModal({ submissionId, candidateName, onClose, onUpdate }: Props) {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

    const [formData, setFormData] = useState<Partial<Interview>>({
        roundNumber: 1,
        party: 'CLIENT',
        mode: 'VIDEO',
        status: 'SCHEDULED',
        scheduledAt: new Date().toISOString().slice(0, 16),
        notes: '',
        interviewerName: '',
        stageLabel: 'Technical Round'
    });

    useEffect(() => {
        fetchInterviews();
    }, [submissionId]);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const data = await InterviewService.getSubmissionInterviews(submissionId);
            setInterviews(data.sort((a, b) => (a.roundNumber || 0) - (b.roundNumber || 0)));
        } catch (err: any) {
            setError(err.message || 'Failed to fetch interviews');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingInterview) {
                await InterviewService.updateInterview(submissionId, editingInterview.id || (editingInterview as any)._id, formData);
            } else {
                await InterviewService.createInterview(submissionId, formData);
            }
            setShowForm(false);
            setEditingInterview(null);
            fetchInterviews();
            onUpdate();
        } catch (err: any) {
            setError(err.message || 'Failed to save interview');
        }
    };

    const handleDelete = async (interviewId: string) => {
        if (!window.confirm('Delete this interview round?')) return;
        try {
            await InterviewService.deleteInterview(submissionId, interviewId);
            fetchInterviews();
            onUpdate();
        } catch (err: any) {
            setError(err.message || 'Failed to delete interview');
        }
    };

    const openEdit = (interview: Interview) => {
        setEditingInterview(interview);
        setFormData({
            ...interview,
            scheduledAt: interview.scheduledAt ? new Date(interview.scheduledAt).toISOString().slice(0, 16) : ''
        });
        setShowForm(true);
    };

    const openAdd = () => {
        const nextRound = interviews.length > 0 ? Math.max(...interviews.map(i => i.roundNumber || 0)) + 1 : 1;
        setFormData({
            roundNumber: nextRound,
            party: 'CLIENT',
            mode: 'VIDEO',
            status: 'SCHEDULED',
            scheduledAt: new Date().toISOString().slice(0, 16),
            notes: '',
            interviewerName: '',
            stageLabel: `Round ${nextRound}`
        });
        setEditingInterview(null);
        setShowForm(true);
    };

    return (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-[110] p-6 animate-fade-in">
            <div className="relative glass-dark rounded-[40px] p-10 max-w-4xl w-full shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 -mr-20 -mt-20" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-glow-purple">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl text-gradient-premium">Manage Interviews</h2>
                            <p className="text-sm text-slate-400 mt-1">{candidateName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={openAdd}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-all font-semibold border border-blue-500/30"
                        >
                            <Plus className="w-4 h-4" />
                            Add Round
                        </button>
                        <button onClick={onClose} className="p-3 glass hover:bg-red-500/20 rounded-xl transition-all duration-300 group">
                            <X className="w-6 h-6 text-slate-400 group-hover:text-red-400" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4" />
                                Loading interviews...
                            </div>
                        ) : interviews.length === 0 ? (
                            <div className="text-center py-20 glass rounded-3xl border border-dashed border-white/10">
                                <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No interview rounds scheduled yet.</p>
                                <button onClick={openAdd} className="text-blue-400 mt-2 hover:underline">Click to add first round</button>
                            </div>
                        ) : (
                            interviews.map((int, idx) => (
                                <div key={int.id || (int as any)._id} className="group glass rounded-2xl p-5 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-white/5 relative overflow-hidden">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${int.status === 'COMPLETED' ? 'bg-green-500' :
                                        int.status === 'CANCELLED' ? 'bg-red-500' : 'bg-blue-500'
                                        }`} />
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-slate-300">
                                                R{int.roundNumber || idx + 1}
                                            </span>
                                            <h4 className="font-bold text-slate-200">{int.stageLabel || 'Interview Round'}</h4>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(int)} className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(int.id || (int as any)._id)} className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 ml-11">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(int.scheduledAt).toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            {int.mode === 'VIDEO' ? <Video className="w-3.5 h-3.5" /> :
                                                int.mode === 'PHONE' ? <Phone className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                                            {int.mode}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <User className="w-3.5 h-3.5" />
                                            {int.interviewerName || 'TBD'}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                            {int.status === 'COMPLETED' ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> :
                                                int.status === 'CANCELLED' ? <AlertCircle className="w-3.5 h-3.5 text-red-500" /> :
                                                    <Clock className="w-3.5 h-3.5 text-blue-500" />}
                                            <span className={int.status === 'COMPLETED' ? 'text-green-500' : int.status === 'CANCELLED' ? 'text-red-500' : 'text-blue-500'}>
                                                {int.status}
                                            </span>
                                        </div>
                                    </div>
                                    {int.notes && (
                                        <p className="mt-3 ml-11 text-xs text-slate-500 italic p-2 bg-white/5 rounded-lg truncate">
                                            "{int.notes}"
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="glass rounded-3xl p-6 border border-white/10 h-fit bg-white/5">
                        <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                            {editingInterview ? 'Edit Round' : 'Add New Round'}
                            <span className="text-blue-500 text-xs font-mono ml-auto tracking-widest uppercase">
                                {editingInterview ? 'Modification' : 'Creation'}
                            </span>
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Round #</label>
                                    <input
                                        type="number"
                                        value={formData.roundNumber}
                                        onChange={e => setFormData({ ...formData, roundNumber: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Party</label>
                                    <select
                                        value={formData.party}
                                        onChange={e => setFormData({ ...formData, party: e.target.value as any })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200"
                                    >
                                        <option value="CLIENT">Client</option>
                                        <option value="PRIME_VENDOR">Prime Vendor</option>
                                        <option value="VENDOR">Vendor</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Stage Label</label>
                                <input
                                    type="text"
                                    value={formData.stageLabel}
                                    onChange={e => setFormData({ ...formData, stageLabel: e.target.value })}
                                    placeholder="e.g. Technical Screen, Hard Selling"
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Schedule (ISO)</label>
                                <input
                                    type="datetime-local"
                                    value={formData.scheduledAt}
                                    onChange={e => setFormData({ ...formData, scheduledAt: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Mode</label>
                                    <select
                                        value={formData.mode}
                                        onChange={e => setFormData({ ...formData, mode: e.target.value as any })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200"
                                    >
                                        <option value="VIDEO">Video</option>
                                        <option value="PHONE">Phone</option>
                                        <option value="IN_PERSON">In-Person</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200"
                                    >
                                        <option value="SCHEDULED">Scheduled</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                        <option value="NO_SHOW">No Show</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Interviewer Name</label>
                                <input
                                    type="text"
                                    value={formData.interviewerName}
                                    onChange={e => setFormData({ ...formData, interviewerName: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white shadow-lg hover:shadow-glow-blue transition-all"
                            >
                                {editingInterview ? 'Update Round' : 'Schedule Round'}
                            </button>
                            {editingInterview && (
                                <button
                                    type="button"
                                    onClick={() => { setEditingInterview(null); setShowForm(false); }}
                                    className="w-full py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
                                >
                                    Cancel Editing
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

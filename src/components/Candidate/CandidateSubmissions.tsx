import { useState, useEffect } from 'react';
import { FileText, Briefcase, Plus, X, Edit2, Trash2 } from 'lucide-react';
import CandidateService from '../../services/candidate.service';
import type { Submission } from '../../services/submission.service';

export function CandidateSubmissions() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [recruiters, setRecruiters] = useState<{ _id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const initialFormData = {
        recruiter: '',
        client: '',
        vendor: '',
        role: '',
        technology: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
        customFields: [] as { key: string; value: string }[]
    };

    const [formData, setFormData] = useState(initialFormData);

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
            console.error('Failed to fetch recruiters', err);
        }
    };

    const handleEdit = (sub: Submission) => {
        const customFieldsArray = sub.customFields
            ? Object.entries(sub.customFields).map(([key, value]) => ({ key, value: String(value) }))
            : [];

        setFormData({
            recruiter: typeof sub.recruiter === 'string' ? sub.recruiter : sub.recruiter._id,
            client: sub.client,
            vendor: sub.vendor || '',
            role: sub.role || '',
            technology: sub.technology || '',
            notes: sub.notes || '',
            date: new Date(sub.date || sub.submissionDate || '').toISOString().split('T')[0],
            customFields: customFieldsArray
        });
        setEditingId(sub._id);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to withdraw this submission?')) return;
        try {
            await CandidateService.withdrawSubmission(id);
            fetchSubmissions();
            alert('Submission withdrawn successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to withdraw submission');
        }
    };

    const addCustomField = () => {
        setFormData(prev => ({
            ...prev,
            customFields: [...prev.customFields, { key: '', value: '' }]
        }));
    };

    const removeCustomField = (index: number) => {
        setFormData(prev => ({
            ...prev,
            customFields: prev.customFields.filter((_, i) => i !== index)
        }));
    };

    const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
        setFormData(prev => {
            const newFields = [...prev.customFields];
            newFields[index][field] = value;
            return { ...prev, customFields: newFields };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.client || !formData.date || !formData.recruiter) {
            alert('Please fill all required fields');
            return;
        }

        // Convert custom fields array to object
        const customFieldsObj: Record<string, string> = {};
        formData.customFields.forEach(f => {
            if (f.key.trim()) customFieldsObj[f.key.trim()] = f.value;
        });

        const payload = {
            recruiter: formData.recruiter,
            client: formData.client,
            vendor: formData.vendor || undefined,
            role: formData.role || undefined,
            technology: formData.technology || undefined,
            notes: formData.notes || undefined,
            date: formData.date,
            status: 'SUBMITTED', // Explicitly set status to match enum
            customFields: customFieldsObj
        };

        try {
            setSubmitting(true);
            if (editingId) {
                await CandidateService.updateSubmission(editingId, payload);
                alert('Submission updated successfully!');
            } else {
                await CandidateService.createSubmission(payload);
                alert('Submission created successfully!');
            }

            fetchSubmissions();
            setShowModal(false);
            setFormData(initialFormData);
            setEditingId(null);
        } catch (err: any) {
            console.error('Failed to save submission', err);
            alert(err?.response?.data?.message || 'Failed to save submission');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUBMITTED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'INTERVIEWING': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'PLACED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header Section */}
            <div className="relative flex items-center justify-between mb-8 animate-slide-in">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl shadow-glow-orange">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                            My Submissions
                            <span className="text-sm font-medium px-3 py-1 bg-white/5 rounded-full border border-white/10 text-slate-400">
                                {submissions.length} Total
                            </span>
                        </h1>
                        <p className="text-slate-400 mt-1 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-orange-400" />
                            Manage and track your job applications
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData(initialFormData);
                        setShowModal(true);
                    }}
                    className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold shadow-glow-orange hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    New Submission
                </button>
            </div>

            {/* Content Table */}
            <div className="glass rounded-[40px] overflow-hidden shadow-premium border border-white/10 animate-slide-in">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="glass-dark border-b border-white/10">
                            <tr>
                                <th className="px-8 py-6 text-left text-xs text-slate-400 uppercase tracking-widest font-black">Details</th>
                                <th className="px-8 py-6 text-left text-xs text-slate-400 uppercase tracking-widest font-black">Recruiter</th>
                                <th className="px-8 py-6 text-left text-xs text-slate-400 uppercase tracking-widest font-black">Date</th>
                                <th className="px-8 py-6 text-left text-xs text-slate-400 uppercase tracking-widest font-black">Status</th>
                                <th className="px-8 py-6 text-right text-xs text-slate-400 uppercase tracking-widest font-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {submissions.map((sub) => (
                                <tr key={sub._id} className="group hover:bg-white/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-slate-100 font-bold text-lg mb-1 group-hover:text-orange-400 transition-colors">
                                                {sub.client}
                                            </span>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10">
                                                    {sub.role || 'No Role'}
                                                </span>
                                                {sub.technology && (
                                                    <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded border border-orange-500/20">
                                                        {sub.technology}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-slate-300 font-medium">
                                                {typeof sub.recruiter === 'object' ? sub.recruiter.name : 'Unknown Recruiter'}
                                            </span>
                                            <span className="text-xs text-slate-500">{sub.vendor || 'Direct Client'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col text-sm">
                                            <span className="text-slate-300 font-medium">
                                                {new Date(sub.date || sub.submissionDate || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border badge-glow ${getStatusColor(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => handleEdit(sub)}
                                                className="p-3 bg-white/5 hover:bg-orange-500/20 text-slate-400 hover:text-orange-400 rounded-xl transition-all border border-white/5 hover:border-orange-500/30"
                                                title="Edit Submission"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sub._id)}
                                                className="p-3 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-white/5 hover:border-red-500/30"
                                                title="Delete Submission"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && submissions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-6 bg-white/5 rounded-full">
                                                <Briefcase className="w-12 h-12 text-slate-700" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No submissions found</p>
                                            <button
                                                onClick={() => setShowModal(true)}
                                                className="text-orange-500 hover:underline font-bold"
                                            >
                                                Create your first submission
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Submission Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
                    <div className="glass-dark max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-[50px] p-12 border border-white/20 shadow-2xl relative animate-scale-in">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[120px] opacity-10 -mr-20 -mt-20" />

                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-4xl font-black text-gradient-premium mb-2">
                                    {editingId ? 'Edit Submission' : 'New Submission'}
                                </h2>
                                <p className="text-slate-400">Fill in the details for your application</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-4 glass rounded-3xl hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/10"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Recruiter *</label>
                                        <select
                                            required
                                            value={formData.recruiter}
                                            onChange={(e) => setFormData({ ...formData, recruiter: e.target.value })}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 text-slate-100 appearance-none cursor-pointer hover:bg-white/10 transition-all"
                                        >
                                            <option value="" className="bg-slate-900">Select Recruiter</option>
                                            {recruiters.map(r => (
                                                <option key={r._id} value={r._id} className="bg-slate-900">{r.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Client Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.client}
                                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 text-slate-100 placeholder:text-slate-600 hover:bg-white/10 transition-all"
                                            placeholder="Enter client name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Vendor (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.vendor}
                                            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 text-slate-100 placeholder:text-slate-600 hover:bg-white/10 transition-all"
                                            placeholder="Enter vendor name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Role</label>
                                            <input
                                                type="text"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 text-slate-100 placeholder:text-slate-600 hover:bg-white/10 transition-all"
                                                placeholder="e.g. Lead Dev"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Technology</label>
                                            <input
                                                type="text"
                                                value={formData.technology}
                                                onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 text-slate-100 placeholder:text-slate-600 hover:bg-white/10 transition-all"
                                                placeholder="e.g. React"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Submission Date *</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 text-slate-100 hover:bg-white/10 transition-all cursor-text [color-scheme:dark]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Notes</label>
                                        <textarea
                                            rows={1}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 text-slate-100 placeholder:text-slate-600 hover:bg-white/10 transition-all resize-none"
                                            placeholder="Internal notes..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Custom Fields Section */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <h3 className="text-xl font-bold text-slate-200">Custom Fields</h3>
                                    <button
                                        type="button"
                                        onClick={addCustomField}
                                        className="flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Add Field
                                    </button>
                                </div>

                                {formData.customFields.length === 0 ? (
                                    <p className="text-slate-600 text-sm italic text-center py-4 bg-white/[0.02] rounded-3xl border border-dashed border-white/5">
                                        No custom fields added yet
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {formData.customFields.map((field, index) => (
                                            <div key={index} className="flex gap-4 animate-slide-in">
                                                <input
                                                    type="text"
                                                    placeholder="Field Name"
                                                    value={field.key}
                                                    onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                                                    className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Value"
                                                    value={field.value}
                                                    onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                                                    className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-100"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeCustomField(index)}
                                                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="flex gap-4 pt-8 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-5 bg-white/5 border border-white/10 rounded-3xl text-slate-300 font-bold hover:bg-white/10 transition-all active:scale-95"
                                    disabled={submitting}
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl text-white font-black shadow-glow-orange hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        editingId ? 'Save Changes' : 'Create Submission'
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

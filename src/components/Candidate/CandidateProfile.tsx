import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Save, Loader } from 'lucide-react';
import { CandidateService } from '../../services/candidate.service';
import type { CandidateProfile as ICandidateProfile } from '../../services/candidate.service';

export function CandidateProfile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ICandidateProfile | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await CandidateService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
            setError("Failed to load profile data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!profile) return;
        const { name, value } = e.target;
        setProfile(prev => prev ? ({ ...prev, [name]: value }) : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // Only send editable fields
            const updatePayload = {
                phone: profile.phone,
                address: profile.address,
                skills: profile.skills
            };

            await CandidateService.updateProfile(updatePayload);
            setSuccess("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return <div className="p-8 text-center text-slate-400">Profile not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">My Profile</h1>
                <p className="text-slate-400">Manage your personal information and skills</p>
            </div>

            <div className="glass rounded-3xl p-8 border border-white/10 shadow-premium">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name - Read Only */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                <User className="w-4 h-4" /> Full Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                disabled
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed focus:outline-none"
                            />
                        </div>

                        {/* Email - Read Only */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email Address
                            </label>
                            <input
                                type="text"
                                value={profile.email}
                                disabled
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed focus:outline-none"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-400" /> Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={profile.phone || ''}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-purple-400" /> Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={profile.address || ''}
                                onChange={handleChange}
                                placeholder="City, State, Country"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-emerald-400" /> Skills
                        </label>
                        <textarea
                            name="skills"
                            value={profile.skills || ''}
                            onChange={handleChange}
                            placeholder="Java, Python, React, AWS..."
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                        />
                        <p className="text-xs text-slate-500">Separate skills with commas</p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

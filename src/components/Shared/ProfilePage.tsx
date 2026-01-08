import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Save, Camera } from 'lucide-react';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import StorageService from '../../services/storage.service';
import type { User as UserType } from '../../services/user.service';

export function ProfilePage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        department: '',
        location: '',
        about: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);

                const response = await AuthService.getProfile();
                if (response.success) {
                    setUser(response.user);
                    setFormData({
                        name: response.user.name || '',
                        phone: response.user.phone || '',
                        department: response.user.department || '',
                        location: response.user.location || '',
                        about: ''
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        if (!user) return;
        try {
            setSaving(true);

            await UserService.updateUser(user._id, {
                name: formData.name,
                phone: formData.phone,
                department: formData.department,
                location: formData.location
            });

            const currentUser = StorageService.getItem('authUser', true);
            if (currentUser) {
                StorageService.setItem('authUser', { ...currentUser, name: formData.name }, true);
            }
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-400">Loading profile...</div>;
    if (!user) return <div className="p-8 text-slate-400">User not found</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-slide-in">
            {}
            <div className="relative mb-12">
                <div className="h-48 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.05]" />
                </div>
                <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-slate-900 border-4 border-slate-900 overflow-hidden shadow-2xl">
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-white text-slate-900 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-100">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                        <div className="flex items-center gap-3 text-slate-400 mt-1">
                            <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase">
                                {user.role}
                            </span>
                            <span className="flex items-center gap-1 text-sm">
                                <Briefcase className="w-4 h-4" />
                                {user.department || 'No Dept'}
                            </span>
                            <span className="flex items-center gap-1 text-sm">
                                <MapPin className="w-4 h-4" />
                                {user.location || 'Remote'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
                {}
                <div className="space-y-6 lg:col-span-2">
                    {}
                    <div className="glass rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-purple-400" />
                                Personal Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed pl-11"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 pl-11"
                                    />
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City, Country"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 pl-11"
                                    />
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="glass rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-400" />
                                Work Information
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="e.g. Engineering"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined Date</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={new Date(user.createdAt).toLocaleDateString()}
                                        disabled
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed pl-11"
                                    />
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="space-y-6">
                    <div className="glass rounded-3xl p-6 border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">Profile Completion</h3>
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-400 bg-purple-500/10 border border-purple-500/20">
                                        In Progress
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-purple-400">
                                        80%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/5">
                                <div style={{ width: "80%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400">Complete your profile to unlock all features.</p>
                    </div>

                    <div className="glass rounded-3xl p-6 border border-white/10 sticky top-24">
                        <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-glow-purple transition-all disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button className="w-full py-3 bg-white/5 text-slate-300 font-semibold rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

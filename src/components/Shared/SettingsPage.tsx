import { useState } from 'react';
import { Bell, Shield, Lock, Moon, Sun, Monitor, Save } from 'lucide-react';

export function SettingsPage() {
    const [theme, setTheme] = useState('dark');
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        updates: false
    });

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-slide-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-slate-400 mt-1">Manage your preferences and security</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {}
                <div className="glass rounded-3xl p-8 border border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                        <Monitor className="w-5 h-5 text-blue-400" />
                        Appearance
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors" onClick={() => setTheme('dark')}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
                                    <Moon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Dark Mode</p>
                                    <p className="text-xs text-slate-400">Easy on the eyes</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-blue-500' : 'border-slate-600'}`}>
                                {theme === 'dark' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors disabled opacity-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-200 text-orange-500">
                                    <Sun className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Light Mode</p>
                                    <p className="text-xs text-slate-400">Coming soon</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? 'border-orange-500' : 'border-slate-600'}`}>
                                {theme === 'light' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="glass rounded-3xl p-8 border border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                        <Bell className="w-5 h-5 text-purple-400" />
                        Notifications
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-white">Email Notifications</p>
                                <p className="text-xs text-slate-400">Receive updates via email</p>
                            </div>
                            <button
                                onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-purple-500' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.email ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-white">Push Notifications</p>
                                <p className="text-xs text-slate-400">Browser alerts</p>
                            </div>
                            <button
                                onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications.push ? 'bg-purple-500' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.push ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-white">Marketing Updates</p>
                                <p className="text-xs text-slate-400">News and features</p>
                            </div>
                            <button
                                onClick={() => setNotifications(prev => ({ ...prev, updates: !prev.updates }))}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications.updates ? 'bg-purple-500' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.updates ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {}
                <div className="glass rounded-3xl p-8 border border-white/10 md:col-span-2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                        <Shield className="w-5 h-5 text-green-400" />
                        Security
                    </h2>
                    <div className="max-w-xl space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-300">Change Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 pl-11"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 pl-11"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                </div>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 pl-11"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-colors font-bold">
                                <Save className="w-4 h-4" />
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { X, User, Mail, Phone, Shield, MapPin, Briefcase, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { User as ApiUser, PayContract } from '../../services/user.service';
import UserService from '../../services/user.service';
import { useState, useEffect } from 'react';

interface Props {
    user: ApiUser;
    onClose: () => void;
}

export default function UserDetailModal({ user, onClose }: Props) {
    const [contracts, setContracts] = useState<PayContract[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (user.role === 'candidate' || user.role === 'recruiter') {
            fetchHistory();
        }
    }, [user._id]);

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const res = await UserService.getSalaryHistory(user._id || user.id!);
            if (res.success) {
                setContracts(res.contracts);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'inactive': return 'text-red-400 bg-red-500/20 border-red-500/30';
            default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
            case 'recruiter': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            case 'candidate': return 'text-pink-400 bg-pink-500/20 border-pink-500/30';
            default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
        }
    };

    return (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-[100] p-4 md:p-6 animate-slide-in">
            <div className="relative glass rounded-3xl p-6 md:p-8 max-w-5xl w-full shadow-premium border-2 border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-glow-purple">
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h2 className="text-3xl text-gradient-premium font-bold">{user.name}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border ${getStatusColor(user.status)}`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 glass hover:bg-red-500/20 rounded-xl transition-all duration-300 group"
                        >
                            <X className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass bg-white/5 rounded-2xl p-5 space-y-4">
                            <h3 className="text-slate-300 font-semibold border-b border-white/10 pb-2 mb-4">Contact Information</h3>

                            <div className="flex items-center gap-3 text-slate-300">
                                <Mail className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <Phone className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-xs text-slate-500">Phone</p>
                                    <p className="font-medium">{user.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <MapPin className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-xs text-slate-500">Location</p>
                                    <p className="font-medium">{(user as any).location || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass bg-white/5 rounded-2xl p-5 space-y-4">
                            <h3 className="text-slate-300 font-semibold border-b border-white/10 pb-2 mb-4">Account Details</h3>

                            <div className="flex items-center gap-3 text-slate-300">
                                <Briefcase className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-xs text-slate-500">Department</p>
                                    <p className="font-medium">{(user as any).department || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <Shield className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-xs text-slate-500">Permissions</p>
                                    <p className="font-medium">{(user.permissions && user.permissions.length > 0) ? user.permissions.join(', ') : 'Default Role Permissions'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <Calendar className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-xs text-slate-500">Joined Date</p>
                                    <p className="font-medium">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            month: 'long', day: 'numeric', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                {user.isVerified ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <div>
                                    <p className="text-xs text-slate-500">Verification</p>
                                    <p className={`font-medium ${user.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                                        {user.isVerified ? 'Verified Account' : 'Unverified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 glass bg-white/5 rounded-2xl p-5 space-y-4">
                        <h3 className="text-slate-300 font-semibold border-b border-white/10 pb-2 mb-4">Employment & Compensation</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Calendar className="w-5 h-5 text-slate-500" />
                                    <div>
                                        <p className="text-xs text-slate-500">Official Joining Date</p>
                                        <p className="font-medium">
                                            {user.joiningDate
                                                ? new Date(user.joiningDate).toLocaleDateString()
                                                : 'Not Set'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-300">
                                    <Briefcase className="w-5 h-5 text-slate-500" />
                                    <div>
                                        <p className="text-xs text-slate-500">Working Days (Month)</p>
                                        <p className="font-medium">{user.workingDays || 30} Days</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-300">
                                    <Clock className="w-5 h-5 text-slate-500" />
                                    <div>
                                        <p className="text-xs text-slate-500">PTO Limit</p>
                                        <p className="font-medium">{user.ptoLimit || 0} Days/Year</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {user.currentContract ? (
                                    <>
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <div className="w-5 h-5 flex items-center justify-center rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs">$</div>
                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    {user.role === 'recruiter' ? 'Base Salary' : 'Base Rate / Salary'}
                                                </p>
                                                <p className="font-medium">
                                                    {user.currentContract.currency} {user.currentContract.baseRate?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {user.currentContract.commissionShare > 0 && (
                                            <div className="flex items-center gap-3 text-slate-300">
                                                <div className="w-5 h-5 flex items-center justify-center rounded bg-purple-500/20 text-purple-400 font-bold text-xs">%</div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Commission Share</p>
                                                    <p className="font-medium">{user.currentContract.commissionShare}%</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 text-slate-300">
                                            <div className={`w-2 h-2 rounded-full ${user.currentContract.active ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <div>
                                                <p className="text-xs text-slate-500">Contract Status</p>
                                                <p className="font-medium">{user.currentContract.active ? 'Active' : 'Inactive'}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-slate-500 italic">No active contract details</div>
                                )}
                            </div>
                        </div>
                    </div>



                    {/* Salary History Section */}
                    {(user.role === 'candidate' || user.role === 'recruiter') && (
                        <div className="mt-6 glass bg-white/5 rounded-2xl p-5 space-y-4">
                            <h3 className="text-slate-300 font-semibold border-b border-white/10 pb-2 mb-4">Salary History</h3>
                            {loadingHistory ? (
                                <p className="text-slate-500 text-sm">Loading history...</p>
                            ) : contracts.length === 0 ? (
                                <p className="text-slate-500 text-sm">No history found.</p>
                            ) : (
                                <div className="space-y-3">
                                    {contracts.map((contract) => (
                                        <div key={contract._id} className={`p-3 rounded-xl border ${contract.active ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/10'} flex items-center justify-between`}>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-slate-200 font-medium">{contract.payType}</span>
                                                    {contract.active && <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full">Active</span>}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {contract.currency} {contract.baseRate.toLocaleString()}
                                                    {contract.commissionShare ? ` + ${contract.commissionShare}%` : ''}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-400">
                                                    {new Date(contract.startDate).toLocaleDateString()}
                                                </div>
                                                <div className="text-[10px] text-slate-500 uppercase">Start Date</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div >
        </div >
    );
}

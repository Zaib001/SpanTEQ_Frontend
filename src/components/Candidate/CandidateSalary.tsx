import { useState, useEffect } from 'react';
import { DollarSign, FileText, Calendar, PieChart, Loader, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
import SalaryService, { type SalarySnapshot } from '../../services/salary.service';

export function CandidateSalary() {
    const [loading, setLoading] = useState(true);
    const [snapshots, setSnapshots] = useState<SalarySnapshot[]>([]);

    useEffect(() => {
        fetchSnapshots();
    }, []);

    const fetchSnapshots = async () => {
        try {
            setLoading(true);
            const data = await SalaryService.getSnapshots();
            setSnapshots(data);
        } catch (err) {
            console.error("Failed to fetch salary snapshots", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-slate-400 animate-pulse">Loading financial data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2.5s' }} />
            </div>

            <div className="flex items-center justify-between mb-8 animate-slide-in">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-glow-green">
                        <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Financial Overview</h1>
                        <p className="text-slate-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            Track your monthly earnings and deductions
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
                {snapshots.length === 0 ? (
                    <div className="col-span-full text-center p-16 glass rounded-3xl border border-white/10 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <DollarSign className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">No Salary Records</h3>
                        <p className="text-slate-500 max-w-sm">Salary snapshots will appear here once generated.</p>
                    </div>
                ) : (
                    snapshots.map((snap, index) => (
                        <div
                            key={snap._id}
                            className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/20"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                            <div className="relative p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                {/* Left: Date & Status */}
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-emerald-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-white tracking-tight">{snap.month}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${snap.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10'}`}>
                                                {snap.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">{snap.year} • Salary ID: #{snap._id.substring(snap._id.length - 6)}</p>
                                    </div>
                                </div>

                                {/* Middle: Compact Breakdown */}
                                <div className="flex-1 w-full sm:w-auto grid grid-cols-3 gap-2 sm:gap-8 px-4 sm:px-8 border-y sm:border-y-0 sm:border-x border-white/5 py-3 sm:py-0 bg-white/[0.02] sm:bg-transparent rounded-lg sm:rounded-none">
                                    <div className="text-center sm:text-left">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Earnings</p>
                                        <p className="text-sm font-medium text-slate-200">
                                            {((snap.breakdown?.baseSalary || 0) + (snap.breakdown?.bonuses || 0) + (snap.breakdown?.overtime || 0)).toLocaleString()} {snap.currency}
                                        </p>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Deductions</p>
                                        <p className="text-sm font-medium text-red-400">
                                            -{snap.breakdown?.deductions?.toLocaleString()} {snap.currency}
                                        </p>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Bonus</p>
                                        <p className="text-sm font-medium text-emerald-400">
                                            +{snap.breakdown?.bonuses?.toLocaleString()} {snap.currency}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Net & Action */}
                                <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Net Payout</p>
                                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent leading-none">
                                            {snap.totalPayout?.toLocaleString()} <span className="text-sm text-slate-500 font-medium">{snap.currency}</span>
                                        </div>
                                    </div>
                                    <button className="h-10 w-10 rounded-full bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 flex items-center justify-center transition-all group/btn">
                                        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover/btn:text-emerald-400 transition-colors" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

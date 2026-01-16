import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Award, Zap, FileText, DollarSign, CheckCircle } from 'lucide-react';
import RecruiterService from '../../services/recruiter.service';
import { AuthService } from '../../services/auth.service';

export function RecruiterPerformance() {
    const [loading, setLoading] = useState(true);
    const [performance, setPerformance] = useState<any>(null);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                setLoading(true);
                const user = AuthService.getCurrentUser();
                if (user?.id) {
                    const data = await RecruiterService.getRecruiterPerformance(user.id);
                    setPerformance(data);
                }
            } catch (err) {
                console.error('Failed to load performance data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformance();
    }, []);

    const metrics = performance ? [
        { subject: 'Submissions', value: performance.stats?.totalSubmissions || 0, target: 10, icon: FileText, color: '#3b82f6' },
        { subject: 'Placements', value: performance.stats?.placements || 0, target: 2, icon: CheckCircle, color: '#10b981' },
        { subject: 'Interviews', value: performance.stats?.clientInterviews || 0, target: 5, icon: Zap, color: '#f59e0b' },
        { subject: 'Revenue', value: performance.stats?.revenue || 0, target: 5000, icon: DollarSign, color: '#8b5cf6' },
    ] : [];

    if (loading) {
        return <div className="p-8 text-slate-400">Loading performance data...</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
            </div>

            <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl shadow-premium">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-bold text-gradient-premium mb-2">My Performance</h1>
                        <p className="text-slate-400 text-base">Track your recruitment success metrics</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-3xl p-8 animate-slide-in shadow-premium border border-white/10">
                    <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                        Key Performance Indicators
                    </h2>
                    <div className="space-y-6">
                        {metrics.map((metric, index) => {
                            const Icon = metric.icon;
                            // Simple percentage calculation for demo, capped at 100%
                            const percentage = Math.min(100, (metric.value / (metric.target || 1)) * 100);

                            return (
                                <div key={index} className="group relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${metric.color}20` }}>
                                                <Icon className="w-5 h-5" style={{ color: metric.color }} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-slate-200">{metric.subject}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
                                            <p className="text-xs text-slate-500">Target: {metric.target}</p>
                                        </div>
                                    </div>
                                    <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${percentage}%`,
                                                background: `linear-gradient(90deg, ${metric.color}40, ${metric.color})`
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="glass rounded-3xl p-8 animate-slide-in shadow-premium border border-white/10" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                        <Award className="w-6 h-6 text-yellow-400" />
                        Achievements
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-yellow-500/20 rounded-xl">
                                <Award className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <h3 className="text-slate-200 font-bold">Top Recruiter</h3>
                                <p className="text-sm text-slate-400">Ranked #{(performance?.rank) || 'N/A'} among peers</p>
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-slate-200 font-bold">Submission Quality</h3>
                                <p className="text-sm text-slate-400">High acceptance rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

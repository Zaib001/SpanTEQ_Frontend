import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Video, CheckCircle, Loader, Briefcase, ChevronRight, User, Clock1, Calendar1 } from 'lucide-react';
import CandidateService from '../../services/candidate.service';

interface Interview {
    _id: string;
    roundNumber: number;
    mode: string;
    scheduledAt?: string;
    completedAt?: string;
    status: string;
    interviewerName?: string;
    notes?: string;
    clientName: string;
    role: string;
}

export function CandidateInterviews() {
    const [loading, setLoading] = useState(true);
    const [interviews, setInterviews] = useState<Interview[]>([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setLoading(true);
                const submissions = await CandidateService.getMySubmissions();

                const extracted: Interview[] = [];
                submissions.forEach((sub: any) => {
                    if (sub.interviews && Array.isArray(sub.interviews)) {
                        sub.interviews.forEach((int: any) => {
                            extracted.push({
                                ...int,
                                clientName: sub.client,
                                role: sub.role
                            });
                        });
                    }
                });

                extracted.sort((a, b) => {
                    const dateA = new Date(a.scheduledAt || a.completedAt || 0).getTime();
                    const dateB = new Date(b.scheduledAt || b.completedAt || 0).getTime();
                    return dateB - dateA;
                });

                setInterviews(extracted);
            } catch (err) {
                console.error("Failed to fetch interviews", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'COMPLETED': return {
                color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                label: 'Completed'
            };
            case 'SCHEDULED': return {
                color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                label: 'Scheduled'
            };
            case 'CANCELLED': return {
                color: 'text-red-400 bg-red-500/10 border-red-500/20',
                label: 'Cancelled'
            };
            default: return {
                color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
                label: status
            };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-10 h-10 text-purple-500 animate-spin" />
                    <p className="text-slate-400 animate-pulse">Loading interviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Subtle Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-slate-900 via-[#0f1014] to-slate-900" />
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            {/* Header Section */}
            <div className="flex items-end justify-between mb-8">
                <div className="flex items-center justify-between mb-8 animate-slide-in">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-glow-green">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Interviews</h1>
                            <p className="text-slate-400 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-400" />
                                Track your interviews
                            </p>
                        </div>
                    </div>
                </div>
                {/* Stats or Filter could go here */}
                <div className="hidden sm:flex items-center gap-4 bg-white/5 rounded-full px-4 py-1.5 border border-white/5">
                    <span className="text-xs font-medium text-slate-300">
                        <span className="text-purple-400 font-bold">{interviews.filter(i => i.status === 'SCHEDULED').length}</span> Upcoming
                    </span>
                    <div className="w-px h-3 bg-white/10" />
                    <span className="text-xs font-medium text-slate-300">
                        <span className="text-emerald-400 font-bold">{interviews.filter(i => i.status === 'COMPLETED').length}</span> Completed
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02] text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-3 sm:col-span-2">Date & Time</div>
                    <div className="col-span-6 sm:col-span-4">Role & Company</div>
                    <div className="col-span-3 hidden sm:block">Details</div>
                    <div className="col-span-3 text-right">Status</div>
                </div>

                {interviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-slate-600" />
                        </div>
                        <h3 className="text-slate-300 font-medium mb-1">No interviews found</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">You don't have any interviews scheduled at the moment.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {interviews.map((int, index) => {
                            const status = getStatusInfo(int.status);
                            const isVideo = int.mode === 'VIDEO';
                            const date = new Date(int.scheduledAt || '');

                            return (
                                <div
                                    key={int._id}
                                    className="group grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors duration-200"
                                >
                                    {/* Date & Time */}
                                    <div className="col-span-3 sm:col-span-2 flex flex-col justify-center">
                                        {int.scheduledAt ? (
                                            <>
                                                <span className="text-white font-medium text-sm mb-0.5">
                                                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="text-slate-500 text-xs font-medium">
                                                    {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                </span>
                                                <span className="text-slate-600 text-[10px] mt-1">{date.getFullYear()}</span>
                                            </>
                                        ) : (
                                            <span className="text-slate-500 text-xs italic">Scheduling...</span>
                                        )}
                                    </div>

                                    {/* Role & Company */}
                                    <div className="col-span-6 sm:col-span-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium text-sm leading-tight mb-1 group-hover:text-purple-300 transition-colors cursor-pointer">
                                                {int.role}
                                            </h3>
                                            <p className="text-slate-500 text-xs flex items-center gap-1.5">
                                                {int.clientName}
                                                <span className="w-0.5 h-0.5 rounded-full bg-slate-600" />
                                                <span className="uppercase tracking-wide text-[10px]">Round {int.roundNumber}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Details (Hidden on mobile) */}
                                    <div className="col-span-3 hidden sm:flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            {isVideo ? <Video className="w-3.5 h-3.5 text-blue-400" /> : <MapPin className="w-3.5 h-3.5 text-red-400" />}
                                            <span className="font-medium text-slate-300">{int.mode}</span>
                                        </div>
                                        {int.interviewerName && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <User className="w-3.5 h-3.5" />
                                                <span>{int.interviewerName}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status & Action */}
                                    <div className="col-span-3 flex flex-col items-end gap-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.color.replace('bg-', 'bg-opacity-10 ')}`}>
                                            {status.label}
                                        </span>

                                        {int.status === 'SCHEDULED' && isVideo && (
                                            <button className="flex items-center gap-1.5 text-xs text-purple-400 font-medium hover:text-purple-300 transition-colors mt-1 hover:underline">
                                                Join Now <ChevronRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer / Legend */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-xl border border-white/5">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Instructions</h4>
                    <p className="text-slate-500 text-xs">Please join video calls 5 minutes early. Ensure your camera and microphone are working properly.</p>
                </div>
            </div>
        </div>
    );
}

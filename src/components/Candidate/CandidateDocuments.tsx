import { useState, useEffect } from 'react';
import { FileText, Upload, Check, AlertCircle, Clock, Download, Loader, Sparkles, Filter } from 'lucide-react';
import DocumentService, { type DocumentRequest } from '../../services/document.service';
import { AuthService } from '../../services/auth.service';

export function CandidateDocuments() {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<DocumentRequest[]>([]);
    const [uploading, setUploading] = useState<string | null>(null);
    const [error, setError] = useState('');
    const user = AuthService.getCurrentUser();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await DocumentService.getMyRequests();
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch document requests", err);
            setError("Failed to load documents.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (requestId: string, file: File) => {
        try {
            setUploading(requestId);

            // Note: Backend currently mocks upload and lacks multipart support, so we send JSON metadata.
            // In a real implementation with Multer, we would use FormData.
            const req = requests.find(r => r._id === requestId);
            const payload = {
                requestId,
                candidateId: user?.id || '',
                documentType: req?.type || 'OTHER'
            };

            await DocumentService.uploadDocument(payload);
            await fetchRequests();
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload document");
        } finally {
            setUploading(null);
        }
    };

    const handleDownload = async (requestId: string) => {
        try {
            const result = await DocumentService.getDownloadUrl(requestId);
            if (result.success && result.data.downloadUrl) {
                window.open(result.data.downloadUrl, '_blank');
            }
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'APPROVED': return {
                bg: 'bg-emerald-500/10',
                text: 'text-emerald-400',
                border: 'border-emerald-500/20',
                icon: Check
            };
            case 'REJECTED': return {
                bg: 'bg-red-500/10',
                text: 'text-red-400',
                border: 'border-red-500/20',
                icon: AlertCircle
            };
            case 'UPLOADED': return {
                bg: 'bg-blue-500/10',
                text: 'text-blue-400',
                border: 'border-blue-500/20',
                icon: Clock
            };
            default: return {
                bg: 'bg-amber-500/10',
                text: 'text-amber-400',
                border: 'border-amber-500/20',
                icon: Clock
            };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-slate-400 animate-pulse">Loading documents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="flex items-center justify-between mb-8 animate-slide-in">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-glow-blue">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
                        <p className="text-slate-400 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            Manage your onboarding and compliance documents
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 animate-slide-in">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="grid gap-4 animate-slide-in" style={{ animationDelay: '100ms' }}>
                {requests.length === 0 ? (
                    <div className="text-center p-16 glass rounded-3xl border border-white/10 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">No Requests</h3>
                        <p className="text-slate-500 max-w-sm">You don't have any pending document requests at the moment.</p>
                    </div>
                ) : (
                    requests.map((req, index) => {
                        const style = getStatusStyle(req.status);
                        const StatusIcon = style.icon;

                        return (
                            <div
                                key={req._id}
                                className="glass p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all duration-300 hover-lift group relative overflow-hidden"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bg.replace('/10', '')}`} />

                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${style.bg} ${style.border} border group-hover:scale-110 transition-transform duration-300`}>
                                        <FileText className={`w-6 h-6 ${style.text}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                                                {req.type}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${style.bg} ${style.border} ${style.text} flex items-center gap-1.5`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {req.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400">Requested by <span className="text-slate-300">{req.requestedBy?.name}</span></p>

                                        {req.notes && (
                                            <div className="mt-2 text-xs text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg inline-block">
                                                Note: {req.notes}
                                            </div>
                                        )}
                                        {req.rejectionReason && (
                                            <div className="mt-2 text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg inline-block flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" />
                                                Reason: {req.rejectionReason}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pl-4 md:pl-0 border-l md:border-l-0 border-white/5">
                                    {req.status === 'PENDING' || req.status === 'REJECTED' ? (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id={`file-${req._id}`}
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        handleFileUpload(req._id, e.target.files[0]);
                                                    }
                                                }}
                                                disabled={!!uploading}
                                            />
                                            <label
                                                htmlFor={`file-${req._id}`}
                                                className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl cursor-pointer transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-medium ${uploading === req._id ? 'opacity-75 cursor-wait' : ''}`}
                                            >
                                                {uploading === req._id ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Upload className="w-4 h-4" />
                                                )}
                                                {uploading === req._id ? 'Uploading...' : 'Upload File'}
                                            </label>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleDownload(req._id)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-all border border-white/10 hover:border-white/20 font-medium group/btn"
                                        >
                                            <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                                            Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

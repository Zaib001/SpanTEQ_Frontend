import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, Shield, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import AuthService from '../../services/auth.service';

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (pwd.length >= 12) strength++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

        if (strength <= 1) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
        return { strength: 3, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = password ? getPasswordStrength(password) : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            await AuthService.resetPassword(token!, { password });
            setSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
            {}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {}
                <div
                    className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)',
                        top: '-10%',
                        left: '-10%',
                        animation: 'float 20s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(251,146,60,0.2) 50%, transparent 70%)',
                        bottom: '-10%',
                        right: '-10%',
                        animation: 'float 25s ease-in-out infinite',
                    }}
                />

                {}
                <div className="absolute inset-0 opacity-[0.02]">
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="dot-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="20" cy="20" r="1" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
                    </svg>
                </div>
            </div>

            {}
            <button
                onClick={() => navigate('/login')}
                className="absolute top-8 left-8 z-20 flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 text-slate-700 hover:text-slate-900 shadow-lg hover:shadow-xl group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
                <span className="text-sm font-bold">Back to Login</span>
            </button>

            {}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-2xl shadow-slate-900/10 animate-slide-in">
                    {}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-2xl blur-xl opacity-50" />
                                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                                    <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-slate-900">SpanTeq</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform</div>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Reset Password</h1>
                        <p className="text-slate-600 font-medium">Enter your new password below</p>
                    </div>

                    {}
                    {success ? (
                        <div className="space-y-6">
                            <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-green-900 text-center mb-2">Password Reset Successful!</h3>
                                <p className="text-sm text-green-700 text-center font-semibold">
                                    Your password has been updated. Redirecting to login page...
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-lg"
                            >
                                <span>Go to Login</span>
                                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                        </div>
                    ) : (
                        <>
                            {}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                                    <p className="text-sm text-red-800 font-semibold">{error}</p>
                                </div>
                            )}

                            {}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {}
                                <div className="space-y-2">
                                    <label className="block text-sm text-slate-700 font-bold">New Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" strokeWidth={2.5} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 placeholder-slate-400 transition-all duration-300 hover:bg-white font-medium"
                                            required
                                            disabled={loading}
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                                            disabled={loading}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2.5} /> : <Eye className="w-5 h-5" strokeWidth={2.5} />}
                                        </button>
                                    </div>

                                    {}
                                    {password && passwordStrength && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-600 font-semibold">Password strength:</span>
                                                <span className={`font-bold ${passwordStrength.strength === 1 ? 'text-red-600' :
                                                        passwordStrength.strength === 2 ? 'text-yellow-600' :
                                                            'text-green-600'
                                                    }`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                    style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {}
                                <div className="space-y-2">
                                    <label className="block text-sm text-slate-700 font-bold">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" strokeWidth={2.5} />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 placeholder-slate-400 transition-all duration-300 hover:bg-white font-medium"
                                            required
                                            disabled={loading}
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                                            disabled={loading}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" strokeWidth={2.5} /> : <Eye className="w-5 h-5" strokeWidth={2.5} />}
                                        </button>
                                    </div>

                                    {}
                                    {confirmPassword && (
                                        <div className="flex items-center gap-2">
                                            {password === confirmPassword ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                                                    <span className="text-xs text-green-600 font-semibold">Passwords match</span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="w-4 h-4 text-red-600" strokeWidth={2.5} />
                                                    <span className="text-xs text-red-600 font-semibold">Passwords do not match</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {}
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="text-xs font-bold text-slate-700 mb-2">Password must contain:</p>
                                    <ul className="space-y-1 text-xs text-slate-600 font-semibold">
                                        <li className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`} />
                                            At least 8 characters
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                            One uppercase letter
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                            One lowercase letter
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                            One number
                                        </li>
                                    </ul>
                                </div>

                                {}
                                <button
                                    type="submit"
                                    disabled={loading || password !== confirmPassword || password.length < 8}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 relative z-10 animate-spin" strokeWidth={2.5} />
                                            <span className="relative z-10">Resetting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative z-10">Reset Password</span>
                                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                            Protected by enterprise-grade security
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

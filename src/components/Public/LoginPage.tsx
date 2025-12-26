import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, Shield, Zap, CheckCircle } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, navigate directly to admin dashboard
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ultra Premium Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
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
        
        {/* Dot Pattern */}
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

      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 text-slate-700 hover:text-slate-900 shadow-lg hover:shadow-xl group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
        <span className="text-sm font-bold">Back to Home</span>
      </button>

      {/* Main Content Grid */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8 animate-slide-in">
          {/* Logo & Title */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">SpanTeq</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Platform</div>
              </div>
            </div>
            
            <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
              Welcome back to your
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                command center
              </span>
            </h2>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              Access your recruitment operations dashboard and manage your team with enterprise-grade tools.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="space-y-4">
            {[
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'SOC 2 Type II certified platform',
                gradient: 'from-emerald-500 to-teal-500',
                bgGradient: 'from-emerald-50 to-teal-50'
              },
              {
                icon: Zap,
                title: 'Instant Access',
                description: 'Real-time data synchronization',
                gradient: 'from-purple-500 to-blue-500',
                bgGradient: 'from-purple-50 to-blue-50'
              },
              {
                icon: CheckCircle,
                title: 'Always Available',
                description: '99.9% uptime guarantee',
                gradient: 'from-pink-500 to-rose-500',
                bgGradient: 'from-pink-50 to-rose-50'
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 bg-gradient-to-r ${feature.bgGradient} border border-slate-200 rounded-2xl hover:shadow-lg transition-all duration-300`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">{feature.title}</div>
                    <div className="text-xs font-semibold text-slate-600">{feature.description}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '<1min', label: 'Load Time' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-2xl shadow-slate-900/10 animate-slide-in" style={{ animationDelay: '200ms' }}>
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
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

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Admin Sign In</h1>
              <p className="text-slate-600 font-medium">Enter your credentials to access the portal</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm text-slate-700 font-bold">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" strokeWidth={2.5} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@spanteq.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 placeholder-slate-400 transition-all duration-300 hover:bg-white font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm text-slate-700 font-bold">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" strokeWidth={2.5} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-900 placeholder-slate-400 transition-all duration-300 hover:bg-white font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2.5} /> : <Eye className="w-5 h-5" strokeWidth={2.5} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500/50"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-semibold">Remember me</span>
                </label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-700 transition-colors font-bold">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden font-bold text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Sign In</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <p className="text-xs text-slate-700 text-center font-semibold">
                <span className="text-blue-600 font-black">Demo Mode:</span> Enter any email and password to access the admin portal
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Additional Options */}
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/')}
                  className="text-purple-600 hover:text-purple-700 transition-colors font-bold"
                >
                  Contact Admin
                </button>
              </p>
            </div>
          </div>

          {/* Footer Info */}
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

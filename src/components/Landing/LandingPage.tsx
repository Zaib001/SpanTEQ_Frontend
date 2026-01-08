import { ArrowRight, Users, FileText, DollarSign, Clock, Shield, Zap, Sparkles, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-aurora" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-aurora" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-aurora" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {}
      <nav className="glass-dark border-b border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow-glow-purple">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">SpanTeq</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-slate-400 hover:text-white transition-colors">Home</a>
              <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-slate-400 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
              <button
                onClick={onLogin}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl hover:shadow-glow-purple transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Enter Portal</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border border-purple-500/30">
                <Sparkles className="w-4 h-4 text-purple-400 animate-glow" />
                <span className="text-sm text-slate-300">Next-Gen Recruitment Platform</span>
              </div>
              <h1 className="text-7xl mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  Streamline
                </span>
                <br />
                <span className="text-white">Your Recruitment</span>
                <br />
                <span className="text-white">Operations</span>
              </h1>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Manage consultants, track submissions, process timesheets, and handle payouts all in one powerful, ultra-premium platform.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={onLogin}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-2xl hover:shadow-glow-purple transition-all duration-300 flex items-center gap-3 group text-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 glass rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3 text-lg">
                  <span>Watch Demo</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="hidden md:block animate-slide-in" style={{ animationDelay: '200ms' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-3xl blur-3xl opacity-30" />
                <div className="relative glass p-8 rounded-3xl shadow-premium">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 glass rounded-2xl hover-lift">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-glow-purple">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Active Consultants</div>
                        <div className="text-2xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">247</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 glass rounded-2xl hover-lift" style={{ animationDelay: '100ms' }}>
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-glow-blue">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Submissions This Month</div>
                        <div className="text-2xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">1,429</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 glass rounded-2xl hover-lift" style={{ animationDelay: '200ms' }}>
                      <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Total Payouts</div>
                        <div className="text-2xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">$2.4M</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              What SpanTeq Does
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need in one ultra-premium platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Track Hours', desc: 'Effortlessly manage and approve timesheets with automated workflows', gradient: 'from-purple-500 to-blue-500' },
              { icon: FileText, title: 'Submissions', desc: 'Submit profiles and track every stage of recruitment', gradient: 'from-blue-500 to-cyan-500' },
              { icon: DollarSign, title: 'Financial Visibility', desc: 'Complete transparency on payouts and revenue', gradient: 'from-pink-500 to-rose-500' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass p-8 rounded-3xl hover-lift card-shine group animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-glow-purple`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl mb-3 text-slate-100">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-glow" />
          <h2 className="text-5xl mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            Ready to Transform Your Recruitment?
          </h2>
          <p className="text-xl mb-8 text-slate-400">
            Join hundreds of agencies already using SpanTeq
          </p>
          <button
            onClick={onLogin}
            className="px-10 py-5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-2xl hover:shadow-glow-purple transition-all duration-300 text-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Join Now</span>
          </button>
        </div>
      </section>

      {}
      <footer className="glass-dark border-t border-white/5 py-12 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-slate-400">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-lg shadow-glow-purple" />
              <span className="text-xl bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">SpanTeq</span>
            </div>
            <p>&copy; 2025 SpanTeq. Ultra Premium Recruitment Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

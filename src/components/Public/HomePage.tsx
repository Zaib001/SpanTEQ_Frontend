import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Users, FileText, DollarSign, Clock, Shield, Zap, Sparkles, 
  CheckCircle, TrendingUp, Award, Briefcase, Calendar, BarChart3, 
  Play, Layers, ArrowUpRight, Target, Rocket, Brain, HeartHandshake, 
  Lightbulb, Code2, Workflow, ChevronRight, Building2, Trophy, Activity,
  Gauge, Boxes, Network, Database, Cpu, GitBranch, Infinity
} from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflow((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {}
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full opacity-30 blur-3xl transition-all duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)',
            top: `${-300 + mousePosition.y / 20}px`,
            left: `${-300 + mousePosition.x / 20}px`,
            transform: `rotate(${mousePosition.x / 50}deg)`,
          }}
        />
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(251,146,60,0.2) 50%, transparent 70%)',
            bottom: '10%',
            right: '5%',
            animation: 'float 25s ease-in-out infinite',
          }}
        />
        
        {}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="1" fill="currentColor" />
                <circle cx="0" cy="0" r="1" fill="currentColor" />
                <circle cx="100" cy="0" r="1" fill="currentColor" />
                <circle cx="0" cy="100" r="1" fill="currentColor" />
                <circle cx="100" cy="100" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse-glow 8s ease-in-out infinite',
          }}
        />
      </div>

      {}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl rounded-2xl border border-slate-200/50 shadow-2xl shadow-slate-900/10" />
          <div className="relative px-6 py-4 flex items-center gap-8">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:rotate-12 transition-all duration-500">
                  <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                SpanTeq
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {['Features', 'Solutions', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
            
            <button
              onClick={() => navigate('/login')}
              className="group relative px-6 py-2.5 bg-slate-900 text-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2 text-sm font-bold">
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {}
      <section ref={heroRef} className="relative pt-48 pb-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {}
            <div className="space-y-10 animate-slide-in">
              {}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 border border-purple-200/50 rounded-full shadow-xl shadow-purple-500/10">
                <div className="relative flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                  </div>
                  <span className="text-sm font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                    Introducing v2.0
                  </span>
                </div>
                <div className="w-px h-4 bg-gradient-to-b from-purple-300 to-pink-300" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Next-Gen Platform</span>
              </div>

              {}
              <div className="space-y-6">
                <h1 className="text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter">
                  <span className="text-slate-900 block" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.03)' }}>
                    Recruitment
                  </span>
                  <span className="text-slate-900 block" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.03)' }}>
                    operations
                  </span>
                  <span className="relative inline-block mt-2">
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 blur-3xl opacity-40 animate-pulse-glow" />
                    <span 
                      className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent"
                      style={{ 
                        WebkitTextStroke: '1px transparent',
                        paintOrder: 'stroke fill',
                      }}
                    >
                      reimagined
                    </span>
                  </span>
                </h1>
                
                <p className="text-2xl text-slate-600 leading-relaxed max-w-xl font-medium">
                  Transform chaos into clarity. Automate the mundane. 
                  <span className="text-slate-900 font-bold"> Amplify what matters.</span>
                </p>
              </div>

              {}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl shadow-slate-900/30 hover:shadow-slate-900/50 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                  <span className="relative flex items-center gap-3 text-lg">
                    Start Building
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" strokeWidth={2.5} />
                  </span>
                </button>
                
                <button className="group px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-300 flex items-center gap-3">
                  <div className="w-12 h-12 -ml-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-lg">Watch Demo</span>
                </button>
              </div>

              {}
              <div className="flex flex-wrap gap-3 pt-4">
                {[
                  { icon: Zap, label: 'Instant Setup', gradient: 'from-yellow-500 to-orange-500' },
                  { icon: Shield, label: 'SOC 2 Certified', gradient: 'from-emerald-500 to-teal-500' },
                  { icon: Infinity, label: 'Unlimited Scale', gradient: 'from-purple-500 to-pink-500' },
                ].map((pill, i) => {
                  const Icon = pill.icon;
                  return (
                    <div
                      key={i}
                      className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-full hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      <div className={`w-6 h-6 bg-gradient-to-br ${pill.gradient} rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                        <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{pill.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {}
            <div className="relative animate-slide-in perspective-1000" style={{ animationDelay: '200ms' }}>
              {}
              <div 
                className="relative"
                style={{
                  transform: `rotateX(${scrollY / 100}deg) rotateY(${mousePosition.x / 100 - 5}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.1s ease-out',
                }}
              >
                {}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-sm animate-float"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + Math.random() * 2}s`,
                    }}
                  />
                ))}

                {}
                <div className="relative bg-white border border-slate-200/50 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 transform hover:scale-[1.02] transition-all duration-700">
                  {}
                  <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 p-10">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                    
                    <div className="relative flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                          <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Operations Center</div>
                          <div className="text-xs text-white/70 font-semibold flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Live Dashboard
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-3 h-3 rounded-full bg-white/30 backdrop-blur-xl hover:bg-white/50 transition-colors cursor-pointer" />
                        ))}
                      </div>
                    </div>

                    {}
                    <div className="relative grid grid-cols-3 gap-4">
                      {[
                        { icon: Users, value: '247', label: 'Active', change: '+12%', color: 'emerald' },
                        { icon: FileText, value: '1.4K', label: 'Submissions', change: '+23%', color: 'blue' },
                        { icon: DollarSign, value: '$2.1M', label: 'Revenue', change: '+34%', color: 'purple' },
                      ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                          <div 
                            key={i}
                            className="group relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:scale-105 transition-all duration-500 cursor-pointer"
                          >
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-2xl transition-colors" />
                            <Icon className="relative w-8 h-8 text-white mb-4 opacity-90 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                            <div className="relative text-4xl font-black text-white mb-2">{stat.value}</div>
                            <div className="relative text-xs text-white/80 font-bold uppercase tracking-wider mb-3">{stat.label}</div>
                            <div className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 bg-${stat.color}-400/20 rounded-lg`}>
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" strokeWidth={2.5} />
                              <span className="text-xs font-black text-emerald-200">{stat.change}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {}
                  <div className="relative p-10 bg-gradient-to-b from-slate-50 via-white to-slate-50">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm font-black text-slate-900 mb-1 tracking-tight">Performance Metrics</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Real-time analytics</div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Live</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between gap-2.5 h-48">
                      {[55, 70, 60, 85, 65, 95, 75, 88, 70, 92, 80, 100].map((height, i) => (
                        <div
                          key={i}
                          className="group flex-1 relative cursor-pointer"
                        >
                          <div 
                            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-purple-600 via-blue-600 to-pink-600 rounded-t-2xl transition-all duration-700 hover:scale-110"
                            style={{
                              height: `${height}%`,
                              opacity: i === activeWorkflow ? 1 : 0.3,
                              transform: i === activeWorkflow ? 'scale(1.1)' : 'scale(1)',
                            }}
                          >
                            {i === activeWorkflow && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg whitespace-nowrap">
                                {height}%
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {}
                <div 
                  className="absolute -top-10 -left-10 z-20 animate-float"
                  style={{ 
                    transform: `translateY(${scrollY * 0.05}px) translateZ(50px)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform duration-300">
                        <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Efficiency</div>
                        <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">+47%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute -bottom-10 -right-10 z-20 animate-float"
                  style={{ 
                    animationDelay: '1s',
                    transform: `translateY(${-scrollY * 0.05}px) translateZ(50px)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl shadow-pink-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform duration-300">
                        <Clock className="w-8 h-8 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Saved</div>
                        <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">15h/wk</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="absolute -inset-20 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="features" className="relative py-40 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          {}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-xl shadow-slate-900/5 mb-8">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Platform Capabilities</span>
            </div>
            <h2 className="text-6xl lg:text-7xl font-black tracking-tighter mb-8">
              <span className="text-slate-900 block">Everything you need.</span>
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent block">
                Nothing you don't.
              </span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Enterprise-grade tools designed for <span className="text-slate-900 font-bold">modern recruitment</span> operations
            </p>
          </div>

          {}
          <div className="grid md:grid-cols-12 gap-6">
            {}
            <div className="md:col-span-8 md:row-span-2 group relative bg-slate-900 rounded-3xl p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px',
                }} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-6">
                      <Clock className="w-4 h-4 text-purple-400" strokeWidth={2.5} />
                      <span className="text-xs font-black text-white uppercase tracking-wider">Core Engine</span>
                    </div>
                    <h3 className="text-5xl font-black text-white mb-4 leading-tight">
                      Intelligent
                      <br />
                      Timesheet Engine
                    </h3>
                    <p className="text-xl text-slate-300 max-w-2xl leading-relaxed font-medium">
                      Automated workflows that transform hours of manual work into seconds of precision. 
                      Built for scale, designed for simplicity.
                    </p>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                    <Zap className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Auto-Approval', value: '94%', icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500' },
                    { label: 'Time Saved', value: '10hrs', icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
                    { label: 'Processing', value: '<1min', icon: Zap, gradient: 'from-purple-500 to-pink-500' },
                    { label: 'Accuracy', value: '99.9%', icon: Award, gradient: 'from-orange-500 to-amber-500' },
                  ].map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                      <div 
                        key={i}
                        className="group/card relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-500 cursor-pointer"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center mb-4 group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-300 shadow-xl`}>
                          <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="text-4xl font-black text-white mb-2">{metric.value}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{metric.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {}
            {[
              {
                icon: FileText,
                title: 'Submissions',
                description: 'Real-time tracking with intelligent routing',
                gradient: 'from-blue-600 to-cyan-600',
                metric: '95%',
                metricLabel: 'Success'
              },
              {
                icon: DollarSign,
                title: 'Payroll',
                description: 'Instant calculations & compliance',
                gradient: 'from-pink-600 to-rose-600',
                metric: '<1min',
                metricLabel: 'Processing'
              },
              {
                icon: Calendar,
                title: 'PTO',
                description: 'Smart tracking & automation',
                gradient: 'from-emerald-600 to-teal-600',
                metric: '2min',
                metricLabel: 'Approval'
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                description: 'Deep insights & predictions',
                gradient: 'from-orange-600 to-amber-600',
                metric: '100+',
                metricLabel: 'Metrics'
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="md:col-span-4 group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium mb-6">{feature.description}</p>
                  
                  <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{feature.metricLabel}</div>
                      <div className={`text-3xl font-black bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                        {feature.metric}
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-2 transition-all duration-300" strokeWidth={2.5} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="relative py-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-6xl lg:text-7xl font-black tracking-tighter mb-6">
              <span className="text-slate-900">See it in action.</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                Experience the difference.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {}
            <div className="group relative bg-slate-900 rounded-3xl p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '30px 30px',
                }} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Workflow className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white">Automated Workflows</h3>
                    <p className="text-sm text-slate-400 font-semibold">From timesheet submission to final payment—fully automated, zero friction.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { step: 'Submit', desc: 'Timesheet', color: 'purple' },
                    { step: 'Approve', desc: 'Auto-validation', color: 'blue' },
                    { step: 'Calculate', desc: 'Salary processing', color: 'pink' },
                    { step: 'Process', desc: 'Payment disbursed', color: 'emerald' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group/step">
                      <div className={`w-12 h-12 bg-white/${activeWorkflow === i ? '20' : '10'} backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 group-hover/step:bg-white/30 transition-all duration-300`}>
                        <span className="text-lg font-black text-white">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r from-${item.color}-500 via-${item.color}-400 to-${item.color}-300 rounded-full transition-all duration-1000`}
                            style={{ 
                              width: activeWorkflow >= i ? '100%' : '0%',
                              transition: 'width 1.5s ease-out'
                            }}
                          />
                        </div>
                      </div>
                      <div className="min-w-[140px]">
                        <div className="text-sm font-black text-white">{item.step}</div>
                        <div className="text-xs text-slate-400 font-semibold">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {}
            <div className="bg-white border border-slate-200 rounded-3xl p-12 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <BarChart3 className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">Real-Time Intelligence</h3>
                  <p className="text-sm text-slate-600 font-semibold">Live data, instant insights, actionable analytics—always at your fingertips.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: 'Processing Speed', value: '<1min', gradientText: 'from-violet-600 to-purple-700', gradientBar: 'from-violet-500 to-purple-600', bgBar: 'bg-violet-100', progress: 95 },
                  { label: 'Approval Rate', value: '94%', gradientText: 'from-blue-600 to-cyan-700', gradientBar: 'from-blue-500 to-cyan-600', bgBar: 'bg-blue-100', progress: 94 },
                  { label: 'Time Savings', value: '15h/wk', gradientText: 'from-fuchsia-600 to-pink-700', gradientBar: 'from-fuchsia-500 to-pink-600', bgBar: 'bg-fuchsia-100', progress: 88 },
                  { label: 'Accuracy', value: '99.9%', gradientText: 'from-emerald-600 to-teal-700', gradientBar: 'from-emerald-500 to-teal-600', bgBar: 'bg-emerald-100', progress: 99 },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-black text-slate-600 uppercase tracking-wider">{metric.label}</span>
                      <span className={`text-3xl font-black bg-gradient-to-r ${metric.gradientText} bg-clip-text text-transparent`}>
                        {metric.value}
                      </span>
                    </div>
                    <div className={`h-3 ${metric.bgBar} rounded-full overflow-hidden`}>
                      <div 
                        className={`h-full bg-gradient-to-r ${metric.gradientBar} rounded-full transition-all duration-1000 shadow-lg`}
                        style={{ width: `${metric.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="about" className="relative py-40 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-8">
          {}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-xl shadow-slate-900/5 mb-8">
              <HeartHandshake className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Our Foundation</span>
            </div>
            <h2 className="text-6xl lg:text-7xl font-black tracking-tighter mb-8">
              <span className="text-slate-900 block">Built by recruiters.</span>
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent block">
                Perfected through experience.
              </span>
            </h2>
          </div>

          {}
          <div className="relative grid lg:grid-cols-3 gap-8 mb-24">
            {}
            <div className="hidden lg:block absolute top-20 left-[16.66%] right-[16.66%] h-1 bg-gradient-to-r from-amber-300 via-blue-300 to-purple-300 opacity-20" />
            
            {[
              {
                icon: Lightbulb,
                number: '01',
                title: 'The Challenge',
                description: 'Manual processes. Disconnected tools. Countless hours lost to administrative chaos.',
                gradient: 'from-amber-600 to-orange-600',
                accent: 'from-amber-100 to-orange-100'
              },
              {
                icon: Code2,
                number: '02',
                title: 'The Vision',
                description: 'A unified platform that eliminates busywork and empowers teams to focus on placements.',
                gradient: 'from-blue-600 to-cyan-600',
                accent: 'from-blue-100 to-cyan-100'
              },
              {
                icon: Rocket,
                number: '03',
                title: 'The Impact',
                description: 'Transforming recruitment operations with automation, intelligence, and seamless workflows.',
                gradient: 'from-purple-600 to-pink-600',
                accent: 'from-purple-100 to-pink-100'
              },
            ].map((story, i) => {
              const Icon = story.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white border border-slate-200 rounded-3xl p-10 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${story.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-8">
                      <div className={`w-20 h-20 bg-gradient-to-br ${story.gradient} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                        <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="text-7xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">
                        {story.number}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">{story.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium text-lg">{story.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {}
          <div className="relative bg-slate-900 rounded-3xl p-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20" />
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139,92,246,0.2), transparent 50%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.2), transparent 50%)',
            }} />
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl">
                <Target className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-5xl font-black text-white mb-8 leading-tight">
                Eliminate administrative chaos.
                <br />
                Empower recruitment excellence.
              </h3>
              <p className="text-2xl text-slate-300 leading-relaxed font-medium">
                We believe the future of recruitment operations is <span className="text-white font-bold">automated</span>, 
                <span className="text-white font-bold"> intelligent</span>, and <span className="text-white font-bold">beautifully simple</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="solutions" className="relative py-40">
        <div className="max-w-7xl mx-auto px-8">
          {}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-xl shadow-slate-900/5 mb-8">
              <Building2 className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Role-Based Solutions</span>
            </div>
            <h2 className="text-6xl lg:text-7xl font-black tracking-tighter mb-8">
              <span className="text-slate-900 block">Tailored experiences.</span>
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent block">
                Every role. Every need.
              </span>
            </h2>
          </div>

          {}
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                role: 'Candidates',
                tagline: 'Simplified operations',
                description: 'Submit timesheets, track earnings, manage work—all in one seamless experience.',
                features: [
                  'One-click timesheet submission',
                  'Real-time earnings dashboard',
                  'Instant PTO requests',
                  'Secure document vault'
                ],
                gradient: 'from-purple-600 to-blue-600',
                bgGradient: 'from-purple-50 to-blue-50',
              },
              {
                icon: Shield,
                role: 'Recruiters',
                tagline: 'Close faster',
                description: 'Focus on placements while automation handles submissions, tracking, and commissions.',
                features: [
                  'Automated submission tracking',
                  'Performance analytics',
                  'Commission calculations',
                  'Client relationship tools'
                ],
                gradient: 'from-blue-600 to-cyan-600',
                bgGradient: 'from-blue-50 to-cyan-50',
              },
              {
                icon: Zap,
                role: 'Admins',
                tagline: 'Complete control',
                description: 'Oversee operations, automate approvals, gain insights—all from one powerful dashboard.',
                features: [
                  'Bulk approval workflows',
                  'Instant payroll processing',
                  'Advanced analytics',
                  'Granular permissions'
                ],
                gradient: 'from-pink-600 to-rose-600',
                bgGradient: 'from-pink-50 to-rose-50',
              },
            ].map((solution, i) => {
              const Icon = solution.icon;
              return (
                <div
                  key={i}
                  className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-2 transition-all duration-500"
                >
                  {}
                  <div className={`relative bg-gradient-to-br ${solution.bgGradient} p-10 border-b border-slate-200`}>
                    <div className={`w-20 h-20 bg-gradient-to-br ${solution.gradient} rounded-3xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                      <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="text-xs font-black text-purple-600 uppercase tracking-widest mb-3">{solution.tagline}</div>
                    <h3 className="text-4xl font-black text-slate-900 mb-4">{solution.role}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium text-lg">{solution.description}</p>
                  </div>

                  {}
                  <div className="p-10">
                    <div className="space-y-4 mb-8">
                      {solution.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-3 group/item">
                          <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform">
                            <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                          </div>
                          <span className="text-slate-700 font-bold">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-4 bg-slate-50 hover:bg-slate-900 text-slate-900 hover:text-white rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-3 border-2 border-slate-200 hover:border-slate-900 group/btn">
                      Explore Features
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="relative py-40">
        <div className="max-w-6xl mx-auto px-8">
          <div className="relative bg-slate-900 rounded-3xl p-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-pink-600/30" />
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(139,92,246,0.3), transparent 40%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.3), transparent 40%), radial-gradient(circle at 50% 80%, rgba(236,72,153,0.3), transparent 40%)',
            }} />
            
            <div className="relative z-10 text-center space-y-12">
              <div className="inline-block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full blur-3xl opacity-50 animate-pulse-glow" />
                  <Rocket className="relative w-24 h-24 text-white mx-auto" strokeWidth={2} />
                </div>
              </div>
              
              <div>
                <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tighter">
                  Ready to transform
                  <br />
                  your operations?
                </h2>
                <p className="text-2xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                  Join the future of recruitment operations management
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                <button
                  onClick={() => navigate('/login')}
                  className="group px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-lg shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-3">
                    Get Started Now
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" strokeWidth={2.5} />
                  </span>
                </button>
                <button className="px-12 py-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white rounded-2xl font-black text-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                  Schedule Demo
                </button>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-10 pt-8">
                {[
                  { icon: Shield, label: 'Enterprise Security' },
                  { icon: Zap, label: 'Instant Deployment' },
                  { icon: CheckCircle, label: '24/7 Support' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
                        <Icon className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
                      </div>
                      <span className="font-bold text-white">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <footer className="relative border-t border-slate-200 bg-white py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            {}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">SpanTeq</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform</div>
                </div>
              </div>
              <p className="text-slate-600 mb-8 max-w-md leading-relaxed font-medium text-lg">
                The all-in-one recruitment operations platform. Built by recruiters, perfected through experience.
              </p>
              <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl inline-flex">
                <Shield className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                <span className="text-sm font-black text-emerald-900">SOC 2 Type II Certified</span>
              </div>
            </div>
            
            {}
            {[
              { title: 'Product', links: ['Features', 'Solutions', 'Security', 'Integrations'] },
              { title: 'Company', links: ['About', 'Careers', 'Contact', 'Blog'] },
            ].map((column, i) => (
              <div key={i}>
                <h4 className="font-black text-slate-900 mb-6 text-sm uppercase tracking-widest">{column.title}</h4>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase()}`} className="text-slate-600 hover:text-slate-900 transition-colors font-bold flex items-center gap-2 group">
                        <span>{link}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 font-bold">
              &copy; 2025 SpanTeq. All rights reserved.
            </p>
            <div className="flex gap-8">
              <button onClick={() => navigate('/privacy-policy')} className="text-slate-600 hover:text-slate-900 transition-colors font-bold">
                Privacy Policy
              </button>
              <button onClick={() => navigate('/terms-and-conditions')} className="text-slate-600 hover:text-slate-900 transition-colors font-bold">
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

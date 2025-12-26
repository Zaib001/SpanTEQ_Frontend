import { UserPlus, Sparkles, Mail, Phone, Briefcase, MapPin } from 'lucide-react';

export function NewCandidatesPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        
        <div className="relative animate-slide-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-2xl shadow-glow-blue animate-pulse-glow">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-5xl text-gradient-premium">New Candidates</h1>
              <p className="text-slate-400 mt-1 text-sm">Onboard and manage new candidate profiles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-10 shadow-premium animate-slide-in" style={{ animationDelay: '100ms' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-teal-400 mx-auto mb-4 animate-glow" />
            <h2 className="text-3xl text-gradient-premium mb-2">Add New Candidate</h2>
            <p className="text-slate-400">Fill in candidate information to create their profile</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-100 placeholder-slate-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-100 placeholder-slate-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-100 placeholder-slate-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-100 placeholder-slate-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Primary Skill
                </label>
                <input
                  type="text"
                  placeholder="React Developer"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-100 placeholder-slate-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider">Experience (Years)</label>
                <input
                  type="number"
                  placeholder="5"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-100 placeholder-slate-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button className="flex-1 px-6 py-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium">
                Cancel
              </button>
              <button className="flex-1 relative px-6 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-xl overflow-hidden shadow-premium hover:shadow-glow-blue transition-all duration-500 group">
                <span className="relative z-10 text-white font-semibold">Add Candidate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

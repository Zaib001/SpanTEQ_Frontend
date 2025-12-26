import { Briefcase, Sparkles, Mail, Phone, Award, Building } from 'lucide-react';

export function NewRecruitersPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        
        <div className="relative animate-slide-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 rounded-2xl shadow-glow-purple animate-pulse-glow">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-5xl text-gradient-premium">New Recruiters</h1>
              <p className="text-slate-400 mt-1 text-sm">Onboard and manage new recruiter profiles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-10 shadow-premium animate-slide-in" style={{ animationDelay: '100ms' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-rose-400 mx-auto mb-4 animate-glow" />
            <h2 className="text-3xl text-gradient-premium mb-2">Add New Recruiter</h2>
            <p className="text-slate-400">Create a new recruiter profile to expand your team</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider">First Name</label>
                <input
                  type="text"
                  placeholder="Sarah"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-slate-100 placeholder-slate-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  placeholder="Johnson"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-slate-100 placeholder-slate-500 transition-all"
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
                placeholder="sarah.johnson@spanteq.com"
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-slate-100 placeholder-slate-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 987-6543"
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-slate-100 placeholder-slate-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Department
                </label>
                <select 
                  className="w-full px-4 py-4 bg-slate-800/90 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-slate-100 appearance-none cursor-pointer hover:bg-slate-800 transition-all"
                  style={{ colorScheme: 'dark' }}
                >
                  <option className="bg-slate-800 text-slate-100">IT Recruitment</option>
                  <option className="bg-slate-800 text-slate-100">Finance Recruitment</option>
                  <option className="bg-slate-800 text-slate-100">Healthcare Recruitment</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-slate-300 font-medium uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Specialization
                </label>
                <input
                  type="text"
                  placeholder="Software Engineering"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-slate-100 placeholder-slate-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button className="flex-1 px-6 py-4 glass rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-300 font-medium">
                Cancel
              </button>
              <button className="flex-1 relative px-6 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 rounded-xl overflow-hidden shadow-premium hover:shadow-glow-purple transition-all duration-500 group">
                <span className="relative z-10 text-white font-semibold">Add Recruiter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

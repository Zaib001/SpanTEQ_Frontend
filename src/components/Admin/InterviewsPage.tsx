import { Video, Calendar, User, Briefcase, MapPin, Clock, CheckCircle, Sparkles } from 'lucide-react';

export function InterviewsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        
        <div className="relative animate-slide-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl shadow-glow-purple animate-pulse-glow">
              <Video className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-5xl text-gradient-premium">Interviews</h1>
              <p className="text-slate-400 mt-1 text-sm">Schedule and track interview rounds</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Scheduled Today', value: '12', gradient: 'from-violet-500 to-purple-500', icon: Calendar },
          { label: 'This Week', value: '47', gradient: 'from-purple-500 to-fuchsia-500', icon: Clock },
          { label: 'Completed', value: '284', gradient: 'from-fuchsia-500 to-pink-500', icon: CheckCircle },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative glass rounded-2xl p-6 hover-lift card-shine overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                  <p className="text-4xl premium-text mb-1">{stat.value}</p>
                </div>
                <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-3xl p-8 shadow-premium animate-slide-in" style={{ animationDelay: '200ms' }}>
        <div className="text-center py-20">
          <Sparkles className="w-16 h-16 text-violet-400 mx-auto mb-4 animate-glow" />
          <h3 className="text-2xl text-slate-200 mb-2">Interview Management</h3>
          <p className="text-slate-400 mb-6">Schedule, track, and manage all interview rounds</p>
          <button className="px-8 py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl hover:shadow-glow-purple transition-all duration-500 text-white font-medium">
            Schedule Interview
          </button>
        </div>
      </div>
    </div>
  );
}

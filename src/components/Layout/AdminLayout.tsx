import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatPanel } from './ChatPanel';

export function AdminLayout() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-72 z-40">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="relative ml-72 min-h-screen z-10">
        <Header />
        <main className="relative z-10">
          <Outlet />
        </main>
      </div>
      
      {/* Chat Panel - Fixed on right side */}
      <ChatPanel />
    </div>
  );
}
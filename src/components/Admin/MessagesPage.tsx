import { useState } from 'react';
import { MessageSquare, Send, Search, User, Shield, Briefcase, Sparkles, Paperclip } from 'lucide-react';

interface Conversation {
  id: string;
  participant: string;
  role: 'admin' | 'recruiter' | 'candidate';
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

const mockConversations: Conversation[] = [
  { id: '1', participant: 'Sarah Johnson', role: 'recruiter', lastMessage: 'Thanks for the update on the TechCorp submission', timestamp: '2 min ago', unread: 2, avatar: 'SJ' },
  { id: '2', participant: 'Michael Chen', role: 'recruiter', lastMessage: 'Can we discuss the new candidate pipeline?', timestamp: '1 hour ago', unread: 0, avatar: 'MC' },
  { id: '3', participant: 'Emily Davis', role: 'candidate', lastMessage: 'When will my timesheet be approved?', timestamp: '3 hours ago', unread: 1, avatar: 'ED' },
  { id: '4', participant: 'James Wilson', role: 'candidate', lastMessage: 'Received the offer letter, thank you!', timestamp: '1 day ago', unread: 0, avatar: 'JW' },
];

const mockMessages: Message[] = [
  { id: '1', sender: 'Sarah Johnson', content: 'Hi! I wanted to check on the status of the TechCorp submission.', timestamp: '10:30 AM', isOwn: false },
  { id: '2', sender: 'You', content: 'Hi Sarah! The submission is currently in the interview stage. They scheduled second round for next week.', timestamp: '10:32 AM', isOwn: true },
  { id: '3', sender: 'Sarah Johnson', content: 'Thats great news! Should I prepare any additional documents?', timestamp: '10:35 AM', isOwn: false },
  { id: '4', sender: 'You', content: 'Yes, please have the candidate prepare their technical portfolio and be ready to discuss their recent projects.', timestamp: '10:38 AM', isOwn: true },
  { id: '5', sender: 'Sarah Johnson', content: 'Thanks for the update on the TechCorp submission', timestamp: '10:40 AM', isOwn: false },
];

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(mockConversations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const filteredConversations = mockConversations.filter(conv =>
    conv.participant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: String(messages.length + 1),
      sender: 'You',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'recruiter': return Briefcase;
      case 'candidate': return User;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-pink-500';
      case 'recruiter': return 'from-blue-500 to-cyan-500';
      case 'candidate': return 'from-green-500 to-emerald-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {}
      <div className="relative animate-slide-in">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        
        <div className="relative flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-glow-blue animate-pulse-glow">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-5xl text-gradient-premium">Messages</h1>
            <p className="text-slate-400 mt-1 text-sm">Internal communication center</p>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-280px)] animate-slide-in" style={{ animationDelay: '100ms' }}>
        {}
        <div className="glass rounded-3xl overflow-hidden shadow-premium flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv, index) => {
              const RoleIcon = getRoleIcon(conv.role);
              const isActive = selectedConversation.id === conv.id;
              
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-all duration-300 border-l-4 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500' 
                      : 'border-transparent'
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(conv.role)} rounded-xl flex items-center justify-center text-white font-semibold shadow-glow-blue`}>
                      {conv.avatar}
                    </div>
                    {conv.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse-glow">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-slate-200 font-medium">{conv.participant}</p>
                      <span className="text-xs text-slate-500">{conv.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <RoleIcon className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500 capitalize">{conv.role}</span>
                    </div>
                    <p className={`text-sm truncate ${conv.unread > 0 ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {}
        <div className="col-span-2 glass rounded-3xl overflow-hidden shadow-premium flex flex-col">
          {}
          <div className="p-6 border-b border-white/10 glass-dark">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${getRoleColor(selectedConversation.role)} rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-glow-blue`}>
                {selectedConversation.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-xl text-slate-100 font-medium">{selectedConversation.participant}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {(() => {
                    const RoleIcon = getRoleIcon(selectedConversation.role);
                    return <RoleIcon className="w-4 h-4 text-slate-400" />;
                  })()}
                  <span className="text-sm text-slate-400 capitalize">{selectedConversation.role}</span>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-glow ml-2" />
                  <span className="text-sm text-green-400">Online</span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} animate-slide-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`max-w-[70%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                  {!message.isOwn && (
                    <p className="text-xs text-slate-400 mb-1 ml-1">{message.sender}</p>
                  )}
                  <div
                    className={`p-4 rounded-2xl ${
                      message.isOwn
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-glow-blue'
                        : 'glass border border-white/10 text-slate-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.isOwn ? 'text-blue-100' : 'text-slate-500'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="p-6 border-t border-white/10 glass-dark">
            <div className="flex items-end gap-3">
              <button className="p-3 glass rounded-xl hover:bg-white/10 transition-all duration-300 group">
                <Paperclip className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </button>
              
              <div className="flex-1 relative group">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500 resize-none transition-all"
                />
              </div>
              
              <button
                onClick={handleSend}
                disabled={!messageText.trim()}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl overflow-hidden shadow-premium hover:shadow-glow-blue transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative flex items-center gap-2 text-white">
                  <Send className="w-5 h-5" />
                  <span className="font-medium">Send</span>
                </div>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Press Enter to send • Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  );
}

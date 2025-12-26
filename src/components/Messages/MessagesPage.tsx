import { useState } from 'react';
import { Send, Paperclip, Smile, Search, MoreVertical, Phone, Video, Sparkles } from 'lucide-react';

const conversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Lead Recruiter',
    lastMessage: 'Thanks for the update on the TechCorp submission',
    timestamp: '10:45 AM',
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Senior Consultant',
    lastMessage: 'I submitted my timesheet for this week',
    timestamp: '9:30 AM',
    unread: 0,
    online: true
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Admin',
    lastMessage: 'Can you review the Q4 financial report?',
    timestamp: 'Yesterday',
    unread: 1,
    online: false
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Consultant',
    lastMessage: 'PTO request submitted for Dec 20-24',
    timestamp: 'Yesterday',
    unread: 0,
    online: false
  },
];

const messages = [
  {
    id: 1,
    sender: 'Sarah Johnson',
    content: 'Hi! I wanted to give you an update on the TechCorp submission.',
    timestamp: '10:40 AM',
    isMe: false
  },
  {
    id: 2,
    sender: 'Me',
    content: 'Great! How did it go?',
    timestamp: '10:42 AM',
    isMe: true
  },
  {
    id: 3,
    sender: 'Sarah Johnson',
    content: 'The client loved the candidate profile. They want to schedule an interview next week!',
    timestamp: '10:43 AM',
    isMe: false
  },
  {
    id: 4,
    sender: 'Me',
    content: 'That\'s excellent news! Let me know when you have the interview details.',
    timestamp: '10:44 AM',
    isMe: true
  },
  {
    id: 5,
    sender: 'Sarah Johnson',
    content: 'Thanks for the update on the TechCorp submission',
    timestamp: '10:45 AM',
    isMe: false
  },
];

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 h-[calc(100vh-5rem)]">
      <div className="glass rounded-2xl h-full flex overflow-hidden shadow-premium">
        {/* Conversations List */}
        <div className="w-80 border-r border-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">Messages</h2>
              <Sparkles className="w-5 h-5 text-purple-400 animate-glow" />
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-100 placeholder-slate-500 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 border-b border-white/5 hover:bg-white/5 transition-all duration-300 text-left group ${
                  selectedConversation === conv.id ? 'bg-purple-500/10' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-glow-purple">
                      {conv.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full animate-glow" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="text-sm text-slate-100">{conv.name}</div>
                        <div className="text-xs text-slate-500">{conv.role}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-slate-400">{conv.timestamp}</span>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full text-xs flex items-center justify-center animate-glow">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/5 glass-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-glow-purple">
                    SJ
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full animate-glow" />
                </div>
                <div>
                  <div className="text-slate-100">Sarah Johnson</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-glow" />
                    Online
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 glass rounded-lg hover:bg-white/10 transition-all group">
                  <Phone className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                </button>
                <button className="p-2 glass rounded-lg hover:bg-white/10 transition-all group">
                  <Video className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                </button>
                <button className="p-2 glass rounded-lg hover:bg-white/10 transition-all group">
                  <MoreVertical className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} animate-slide-in`}
              >
                <div
                  className={`max-w-md px-5 py-3 rounded-2xl ${
                    message.isMe
                      ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white shadow-glow-purple rounded-br-md'
                      : 'glass text-slate-100 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm mb-1">{message.content}</p>
                  <p
                    className={`text-xs ${
                      message.isMe ? 'text-white/70' : 'text-slate-500'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/5 glass-dark">
            <div className="flex items-end gap-3">
              <button className="p-3 glass rounded-xl hover:bg-white/10 transition-all group">
                <Paperclip className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
              </button>
              <button className="p-3 glass rounded-xl hover:bg-white/10 transition-all group">
                <Smile className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-100 placeholder-slate-500 transition-all"
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="p-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl hover:shadow-glow-purple transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Send className="w-5 h-5 relative z-10 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

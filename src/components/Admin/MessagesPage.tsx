import { useState, useEffect } from 'react';
import { MessageSquare, Send, Search, User, Shield, Briefcase, Sparkles, Paperclip, Loader2 } from 'lucide-react';
import ChatService, { type ChatMessage, type Conversation as APIConversation } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

// No mock data needed anymore, using real API via ChatService

export function MessagesPage() {
  const user = AuthService.getCurrentUser();
  const [conversations, setConversations] = useState<APIConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<APIConversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [foundUsers, setFoundUsers] = useState<any[]>([]);
  const [isSearchingNew, setIsSearchingNew] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.userId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        searchNewUsers();
      } else {
        setFoundUsers([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchNewUsers = async () => {
    try {
      setIsSearchingNew(true);
      const users = await ChatService.searchUsers(searchQuery);
      // Filter out users who are already in conversations
      const newUsers = users.filter(u => !conversations.some(c => c.userId === u._id) && u._id !== user?.id);
      setFoundUsers(newUsers);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setIsSearchingNew(false);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await ChatService.getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      setLoadingMessages(true);
      const data = await ChatService.getMessages(userId);
      setMessages(data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const sentMessage = await ChatService.sendMessage(selectedConversation.userId, messageText);
      setMessages([...messages, sentMessage]);
      setMessageText('');
      // Update last message in sidebar
      setConversations(prev => prev.map(c =>
        c.userId === selectedConversation.userId
          ? { ...c, lastMessage: { ...c.lastMessage, message: messageText, createdAt: new Date().toISOString() } }
          : c
      ));
    } catch (err) {
      console.error('Error sending message:', err);
    }
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
      { }
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

      { }
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-280px)] animate-slide-in" style={{ animationDelay: '100ms' }}>
        { }
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
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                {filteredConversations.map((conv, index) => {
                  const RoleIcon = getRoleIcon(conv.userRole);
                  const isActive = selectedConversation?.userId === conv.userId;

                  return (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-all duration-300 border-l-4 ${isActive
                          ? 'bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500'
                          : 'border-transparent'
                        }`}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(conv.userRole)} rounded-xl flex items-center justify-center text-white font-semibold shadow-glow-blue uppercase`}>
                          {conv.userName.substring(0, 2)}
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse-glow">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-slate-200 font-medium">{conv.userName}</p>
                          <span className="text-xs text-slate-500">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <RoleIcon className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500 capitalize">{conv.userRole}</span>
                        </div>
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                          {conv.lastMessage.message}
                        </p>
                      </div>
                    </button>
                  );
                })}

                {foundUsers.length > 0 && (
                  <div className="border-t border-white/10">
                    <div className="p-4 bg-white/5 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Search Results</p>
                    </div>
                    <div className="flex flex-col">
                      {foundUsers.map((u) => {
                        const RoleIcon = getRoleIcon(u.role);
                        return (
                          <button
                            key={u._id}
                            onClick={() => {
                              const newConv: APIConversation = {
                                userId: u._id,
                                userName: u.name,
                                userEmail: u.email,
                                userRole: u.role,
                                lastMessage: {
                                  _id: 'new',
                                  message: 'Start a conversation...',
                                  createdAt: new Date().toISOString(),
                                  readAt: null
                                },
                                unreadCount: 0
                              };
                              setSelectedConversation(newConv);
                              setMessages([]);
                              setFoundUsers([]);
                              setSearchQuery('');
                            }}
                            className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all text-left border-l-4 border-transparent"
                          >
                            <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(u.role)} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm uppercase`}>
                              {u.name.substring(0, 2)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-sm text-slate-200 font-bold truncate group-hover:text-blue-400 transition-colors">{u.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <RoleIcon className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] text-slate-500 capitalize">{u.role}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {searchQuery.trim().length > 1 && filteredConversations.length === 0 && foundUsers.length === 0 && !isSearchingNew && (
                  <div className="p-10 text-center animate-fadeIn">
                    <p className="text-slate-500 text-sm italic">No users found matching "{searchQuery}"</p>
                  </div>
                )}
              </>
            )
            }
          </div>
        </div>

        { }
        <div className="col-span-2 glass rounded-3xl overflow-hidden shadow-premium flex flex-col">
          { }
          {selectedConversation && (
            <div className="p-6 border-b border-white/10 glass-dark">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${getRoleColor(selectedConversation.userRole)} rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-glow-blue`}>
                  {selectedConversation.userName.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl text-slate-100 font-medium">{selectedConversation.userName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const RoleIcon = getRoleIcon(selectedConversation.userRole);
                      return <RoleIcon className="w-4 h-4 text-slate-400" />;
                    })()}
                    <span className="text-sm text-slate-400 capitalize">{selectedConversation.userRole}</span>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-glow ml-2" />
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          { }
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loadingMessages ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-500 text-sm">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3 text-slate-500">
                <MessageSquare className="w-12 h-12 opacity-20" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : messages.map((message, index) => {
              const isOwn = message.senderId._id === user?.id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    {!isOwn && (
                      <p className="text-xs text-slate-400 mb-1 ml-1">{message.senderId.name}</p>
                    )}
                    <div
                      className={`p-4 rounded-2xl ${isOwn
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-glow-blue'
                        : 'glass border border-white/10 text-slate-200'
                        }`}
                    >
                      <p className="text-sm leading-relaxed">{message.message}</p>
                      <p className={`text-xs mt-2 ${isOwn ? 'text-blue-100' : 'text-slate-500'}`}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          { }
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

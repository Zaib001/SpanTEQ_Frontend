import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Send, X, Minimize2, Maximize2, Bot, User,
  Sparkles, Paperclip, Smile, MoreVertical, Zap, Clock, CheckCheck, Loader2, ChevronLeft
} from 'lucide-react';
import ChatService, { type ChatMessage, type Conversation as APIConversation } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

// Shared interfaces now imported from ChatService
interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'read';
}

const quickActions = [
  { label: 'View Pending Timesheets', icon: Clock, gradient: 'from-cyan-500 to-blue-500' },
  { label: 'Check Today\'s Interviews', icon: Zap, gradient: 'from-purple-500 to-pink-500' },
  { label: 'Revenue Summary', icon: Sparkles, gradient: 'from-green-500 to-emerald-500' },
];

export function ChatPanel() {
  const user = AuthService.getCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [conversations, setConversations] = useState<APIConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<APIConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && view === 'list') {
      fetchConversations();
    }
  }, [isOpen, view]);

  useEffect(() => {
    if (selectedConversation && view === 'chat') {
      fetchMessages(selectedConversation.userId);
    }
  }, [selectedConversation, view]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await ChatService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      setLoading(true);
      const data = await ChatService.getMessages(userId);
      setMessages(data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedConversation) return;

    const text = inputValue;
    setInputValue('');

    try {
      const sentMessage = await ChatService.sendMessage(selectedConversation.userId, text);
      setMessages(prev => [...prev, sentMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      { }
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl shadow-glow-purple flex items-center justify-center z-40 hover:scale-110 transition-all duration-300 group overflow-hidden"
        >
          <MessageSquare className="w-7 h-7 text-white relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-slate-900 animate-pulse flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          { }
          <div className="absolute inset-0 rounded-2xl border-2 border-purple-400 animate-ping opacity-20" />
        </button>
      )}

      { }
      {isOpen && (
        <div className={`fixed right-8 z-40 glass-dark rounded-3xl shadow-premium border border-white/20 overflow-hidden transition-all duration-300 ${isMinimized
          ? 'bottom-8 w-96 h-20'
          : 'bottom-8 w-[28rem] h-[700px]'
          }`}>
          { }
          <div className="relative border-b border-white/10">
            { }
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />

            <div className="relative p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {view === 'chat' && (
                    <button
                      onClick={() => setView('list')}
                      className="p-2 hover:bg-white/10 rounded-xl transition-all mr-1"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                  )}
                  <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow-purple overflow-hidden">
                    {view === 'chat' && selectedConversation ? (
                      <span className="text-white font-bold">{selectedConversation.userName.substring(0, 2).toUpperCase()}</span>
                    ) : (
                      <MessageSquare className="w-6 h-6 text-white relative z-10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      {view === 'chat' && selectedConversation ? selectedConversation.userName : 'My Messages'}
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </h3>
                    <p className="text-[10px] text-green-400 flex items-center gap-1 font-medium">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      {view === 'chat' ? 'Online' : `${conversations.length} active threads`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2.5 glass rounded-xl hover:bg-white/10 transition-all group"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    ) : (
                      <Minimize2 className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 glass rounded-xl hover:bg-red-500/20 transition-all group"
                  >
                    <X className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          { }
          {!isMinimized && (
            <>
              <div className="h-[calc(700px-220px)] overflow-y-auto p-5 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-slate-900/20">
                {loading && (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                  </div>
                )}

                {view === 'list' && !loading && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Recent Conversations</p>
                    <div className="grid gap-2">
                      {conversations.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-sm italic">
                          No active conversations found.
                        </div>
                      ) : conversations.map((conv) => (
                        <button
                          key={conv.userId}
                          onClick={() => {
                            setSelectedConversation(conv);
                            setView('chat');
                          }}
                          className="group w-full flex items-center gap-3 p-3 glass rounded-2xl hover:bg-white/10 transition-all text-left"
                        >
                          <div className={`w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform uppercase`}>
                            {conv.userName.substring(0, 2)}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="text-sm text-white font-bold truncate">
                                {conv.userName}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate">
                              {conv.lastMessage.message}
                            </p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                              {conv.unreadCount}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {view === 'chat' && !loading && (
                  <>
                    {messages.map((message) => {
                      const isOwn = message.senderId._id === user?.id;
                      return (
                        <div
                          key={message._id}
                          className={`flex gap-3 animate-slide-in ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isOwn
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                            }`}>
                            {isOwn ? (
                              <User className="w-4.5 h-4.5 text-white" />
                            ) : (
                              <Bot className="w-4.5 h-4.5 text-white" />
                            )}
                          </div>

                          <div className={`flex-1 ${isOwn ? 'flex justify-end' : ''}`}>
                            <div className={`inline-block max-w-[85%] ${isOwn
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl rounded-tr-md'
                              : 'glass rounded-2xl rounded-tl-md'
                              } p-4 shadow-premium`}>
                              <p className={`text-sm leading-relaxed ${isOwn ? 'text-white' : 'text-slate-200'
                                }`}>
                                {message.message}
                              </p>
                              <div className={`flex items-center gap-2 mt-2 ${isOwn ? 'justify-end' : ''}`}>
                                <p className={`text-xs ${isOwn ? 'text-purple-100' : 'text-slate-500'
                                  }`}>
                                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                <div ref={messagesEndRef} />
              </div>

              { }
              <div className="relative border-t border-white/10 p-5 bg-gradient-to-t from-slate-900/50 to-transparent">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={view === 'chat' ? "Type a message..." : "Select a conversation to reply..."}
                      disabled={view === 'list'}
                      rows={1}
                      className="w-full px-5 py-4 pr-20 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-slate-100 placeholder-slate-500 resize-none transition-all hover:bg-white/10 disabled:opacity-50"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-1">
                      <button className="p-2 glass rounded-xl hover:bg-white/10 transition-all group">
                        <Paperclip className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </button>
                      <button className="p-2 glass rounded-xl hover:bg-white/10 transition-all group">
                        <Smile className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="relative p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl hover:shadow-glow-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
                  >
                    <Send className="w-5 h-5 text-white relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-slate-500">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Powered by AI • Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Enter</kbd> to send
                  </p>
                  <p className="text-xs text-slate-600">{inputValue.length}/500</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

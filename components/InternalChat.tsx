
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';

interface InternalChatProps {
  user: User;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const InternalChat: React.FC<InternalChatProps> = ({ user, isOpen, setIsOpen, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.displayName,
      content: input,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInput('');

    if (input.toLowerCase().includes('help') || input.includes('مساعدة')) {
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          senderId: 'system',
          senderName: 'بوت النظام',
          content: 'دعم لومينا الفني هنا. كيف يمكنني مساعدتك اليوم؟',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }, 1000);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-40"
        >
          <i className="fas fa-comments text-xl"></i>
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-indigo-600">
            {messages.length % 5}
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 left-6 w-80 md:w-96 glass-card h-[500px] rounded-3xl overflow-hidden z-50 flex flex-col shadow-2xl animate-in slide-in-from-bottom-12 duration-300 text-right">
          <div className="h-16 px-6 bg-indigo-600 flex items-center justify-between">
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">الدردشة الداخلية</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                <i className="fas fa-users"></i>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center text-sm italic">
                <p>ابدأ محادثة آمنة مع زملائك...</p>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className={`flex flex-col ${m.senderId === user.id ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{m.senderName}</span>
                    <span className="text-[9px] opacity-30">{m.timestamp}</span>
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.senderId === user.id ? 'bg-indigo-600 text-white rounded-tl-none' : 'bg-white/10 rounded-tr-none'}`}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex gap-2">
            <button type="submit" className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-colors">
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 text-right"
            />
          </form>
        </div>
      )}
    </>
  );
};

export default InternalChat;

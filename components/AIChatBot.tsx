
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { User, Product, Order, Branch } from '../types';

interface AIChatBotProps {
  user: User;
  data: {
    products: Product[];
    orders: Order[];
    branches: Branch[];
    users: User[];
    totalSales: number;
  };
}

const AIChatBot: React.FC<AIChatBotProps> = ({ user, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; time: string }[]>([
    { role: 'ai', text: `مرحباً بك يا ${user.displayName}! أنا مساعدك الذكي في لومينا برو. كيف يمكنني مساعدتك في تحليل البيانات اليوم؟`, time: new Date().toLocaleTimeString('ar-EG') }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    const time = new Date().toLocaleTimeString('ar-EG');
    setMessages(prev => [...prev, { role: 'user', text: userText, time }]);
    setInput('');
    setIsTyping(true);

    try {
      // إعداد السياق للذكاء الاصطناعي (تحويل البيانات لملخص نصي)
      const systemContext = `
        أنت المساعد الذكي لنظام "لومينا برو" (Lumina Pro).
        المستخدم الحالي: ${user.displayName} (دوره: ${user.role}).
        بيانات النظام الحالية:
        - عدد المنتجات: ${data.products.length}
        - إجمالي المبيعات: ${data.totalSales} دولار
        - عدد الطلبات: ${data.orders.length}
        - عدد الفروع: ${data.branches.length}
        - قائمة المنتجات: ${data.products.map(p => `${p.name} (السعر: ${p.price}, المخزون: ${p.stock})`).join(', ')}
        - قائمة الفروع: ${data.branches.map(b => b.name).join(', ')}
        - آخر 5 طلبات: ${data.orders.slice(-5).map(o => `${o.userName} اشتري بـ ${o.totalValue} دولار`).join(', ')}
        
        أجب على أسئلة المستخدم باللغة العربية بأسلوب احترافي ومختصر. إذا سألك عن إحصائيات، استخدم البيانات أعلاه.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: systemContext,
          temperature: 0.7,
        },
      });

      const aiResponse = response.text || "عذراً، لم أستطع معالجة هذا الطلب حالياً.";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse, time: new Date().toLocaleTimeString('ar-EG') }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "حدث خطأ أثناء الاتصال بالخادم الذكي. تأكد من إعداد مفتاح API.", time: new Date().toLocaleTimeString('ar-EG') }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* زر المساعد العائم */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-24 w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 border-2 border-white/20"
          title="المساعد الذكي AI"
        >
          <i className="fas fa-robot text-xl"></i>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
        </button>
      )}

      {/* نافذة المحادثة */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 w-80 md:w-96 glass-card h-[500px] rounded-3xl overflow-hidden z-50 flex flex-col shadow-2xl animate-in zoom-in-90 duration-300 text-right">
          <div className="h-16 px-6 bg-gradient-to-r from-purple-700 to-indigo-700 flex items-center justify-between">
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">المساعد الذكي (AI)</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                <i className="fas fa-magic"></i>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/5">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-start' : 'items-end'}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">
                    {m.role === 'user' ? 'أنت' : 'مساعد لومينا'}
                  </span>
                  <span className="text-[9px] opacity-30">{m.time}</span>
                </div>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tl-none' 
                    : 'bg-white/10 text-white rounded-tr-none border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex flex-col items-end">
                <div className="bg-white/10 p-3 rounded-2xl rounded-tr-none flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleAskAI} className="p-4 border-t border-white/10 flex gap-2">
            <button 
              type="submit" 
              disabled={isTyping}
              className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white hover:bg-purple-500 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="اسألني عن المبيعات أو المخزون..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-purple-500 text-right"
              disabled={isTyping}
            />
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatBot;

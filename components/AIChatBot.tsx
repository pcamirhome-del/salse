
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
    { role: 'ai', text: `أهلاً بك يا ${user.displayName}. أنا مساعدك الذكي المرتبط بقاعدة بيانات لومينا برو. اسألني عن المبيعات، المخزون، أو الموظفين.`, time: new Date().toLocaleTimeString('ar-EG') }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      const systemContext = `
        أنت المساعد الذكي لنظام لومينا برو (Lumina Pro).
        لديك صلاحية كاملة لرؤية قاعدة البيانات المحلية للنظام حالياً:
        - الموظف الحالي: ${user.displayName}.
        - إجمالي مبيعات الشركة الحالية: ${data.totalSales.toLocaleString()} دولار.
        - إجمالي عدد الفواتير: ${data.orders.length}.
        - عدد المنتجات في المخازن: ${data.products.length}.
        - قائمة المنتجات وتوفرها: ${data.products.map(p => `${p.name} (باقي منه ${p.stock})`).join(', ')}.
        - عدد الفروع النشطة: ${data.branches.length}.
        - الموظفين المسجلين: ${data.users.map(u => u.displayName).join(', ')}.

        أجب على المستخدم باللغة العربية بأسلوب ذكي، واثق ومختصر. إذا سألك عن "أكثر منتج مباع" أو "أفضل فرع"، استخدم البيانات المتاحة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: systemContext,
          temperature: 0.6,
        },
      });

      const aiResponse = response.text || "عذراً، لم أستطع الوصول لتحليل البيانات حالياً.";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse, time: new Date().toLocaleTimeString('ar-EG') }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "تحدث معي مرة أخرى، يبدو أن هناك ضغطاً على الخادم الذكي.", time: new Date().toLocaleTimeString('ar-EG') }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-24 w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 border-2 border-white/20"
        >
          <i className="fas fa-brain text-xl"></i>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 left-6 w-[340px] md:w-[400px] glass-card h-[550px] rounded-3xl overflow-hidden z-50 flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="h-16 px-6 bg-gradient-to-r from-purple-700 to-indigo-800 flex items-center justify-between">
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <i className="fas fa-xmark"></i>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-white leading-none">محلل لومينا الذكي</p>
                <p className="text-[10px] text-green-400">متصل بقاعدة البيانات</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                <i className="fas fa-robot text-white"></i>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-start' : 'items-end'}`}>
                <div className="flex items-baseline gap-2 mb-1 px-1">
                  <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">
                    {m.role === 'user' ? 'طلبك' : 'تحليل النظام'}
                  </span>
                  <span className="text-[8px] opacity-20">{m.time}</span>
                </div>
                <div className={`max-w-[90%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tl-none shadow-md shadow-indigo-900/20' 
                    : 'bg-white/10 text-white/90 rounded-tr-none border border-white/5 shadow-lg'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex flex-col items-end">
                <div className="bg-white/5 p-3 rounded-2xl rounded-tr-none flex gap-1 items-center border border-white/5">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleAskAI} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
            <button 
              type="submit" 
              disabled={isTyping}
              className="w-12 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all disabled:opacity-30"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="مثال: من هو الموظف الأكثر مبيعاً؟"
              className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 text-right text-white placeholder:opacity-30"
              disabled={isTyping}
            />
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatBot;

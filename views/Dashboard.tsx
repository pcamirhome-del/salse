
import React, { useState, useEffect } from 'react';
import { Order, Product } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { getPredictiveInsights } from '../services/geminiService';

interface DashboardProps {
  orders: Order[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders, products }) => {
  const [aiInsights, setAiInsights] = useState<string>("جاري تحليل البيانات الأخيرة...");
  const totalValue = orders.reduce((sum, o) => sum + o.totalValue, 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.length, 0);

  useEffect(() => {
    const fetchInsights = async () => {
      const insights = await getPredictiveInsights(orders, products);
      setAiInsights(insights);
    };
    if (orders.length > 0) fetchInsights();
  }, [orders, products]);

  const chartData = orders.slice(-7).map(o => ({
    time: new Date(o.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    total: o.totalValue
  }));

  const stockData = products.map(p => ({
    name: p.name,
    stock: p.stock
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6 text-right">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">ذكاء الأعمال والسوق</h2>
          <p className="opacity-60 text-sm">مقاييس المبيعات والمخزون في الوقت الفعلي</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 glass-card rounded-lg text-xs font-semibold hover:bg-white/20 transition-all">
            <i className="fas fa-download ml-2"></i>تصدير PDF
          </button>
        </div>
      </header>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المبيعات', value: `${totalValue.toLocaleString()} $`, icon: 'fa-dollar-sign', color: 'text-green-400' },
          { label: 'عدد الطلبات', value: orders.length, icon: 'fa-shopping-cart', color: 'text-blue-400' },
          { label: 'الوحدات المباعة', value: totalItemsSold, icon: 'fa-box', color: 'text-purple-400' },
          { label: 'الفروع النشطة', value: '2', icon: 'fa-map-marker-alt', color: 'text-indigo-400' },
        ].map((card, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs opacity-60 uppercase font-bold tracking-widest">{card.label}</p>
              <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${card.color}`}>
              <i className={`fas ${card.icon} text-xl`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الرسم البياني الرئيسي */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl h-[400px] flex flex-col">
          <h4 className="font-bold mb-6 flex items-center">
            <i className="fas fa-chart-area ml-3 text-indigo-400"></i>سرعة المبيعات
          </h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} reversed />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} orientation="right" />
                <Tooltip 
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', fontSize: '12px', textAlign: 'right' }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* لوحة توقعات الذكاء الاصطناعي */}
        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <h4 className="font-bold mb-4 flex items-center">
            <i className="fas fa-robot ml-3 text-purple-400"></i>توقعات الذكاء الاصطناعي
          </h4>
          <div className="flex-1 bg-white/5 rounded-xl p-4 overflow-y-auto text-right">
            <div className="prose prose-invert text-sm">
              <p className="text-purple-300 font-semibold mb-2 italic">تحليل بناءً على الحركة الأخيرة:</p>
              <div className="whitespace-pre-line text-white/80 leading-relaxed">
                {aiInsights}
              </div>
            </div>
          </div>
          <button className="mt-4 w-full py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-lg text-xs font-bold transition-all border border-purple-500/30">
            تحديث التحليل
          </button>
        </div>
      </div>

      {/* مستويات المخزون */}
      <div className="glass-card p-6 rounded-2xl">
        <h4 className="font-bold mb-6 flex items-center">
          <i className="fas fa-warehouse ml-3 text-orange-400"></i>حالة المخزون الحالية
        </h4>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} orientation="right" />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
              <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useState } from 'react';
import { User, Market } from '../types';

interface CRMProps {
  user: User;
  markets: Market[];
  onAddMarket: (m: Market) => void;
  onDeleteMarket: (id: string) => void;
}

const CRM: React.FC<CRMProps> = ({ user, markets, onAddMarket, onDeleteMarket }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const [newName, setNewName] = useState('');
  const [newManager, setNewManager] = useState('');
  const [newSupervisor, setNewSupervisor] = useState('');
  const [newLogistics, setNewLogistics] = useState('');

  const filteredMarkets = markets.filter(m => 
    (m.createdBy === user.id || user.role === 'ADMIN') &&
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMarket: Market = {
      id: `MKT-${Date.now()}`,
      name: newName,
      manager: newManager,
      supervisor: newSupervisor,
      logistics: newLogistics,
      createdBy: user.id
    };
    onAddMarket(newMarket);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName(''); setNewManager(''); setNewSupervisor(''); setNewLogistics('');
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">دليل الأسواق والعملاء</h2>
          <p className="opacity-60 text-sm">إدارة علاقات العملاء ولوجستيات الفروع</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <i className="fas fa-plus"></i> إضافة سوق جديد
        </button>
      </div>

      <div className="glass-card p-4 rounded-2xl">
        <div className="relative mb-6">
          <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 opacity-40"></i>
          <input 
            type="text"
            placeholder="البحث عن سوق بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-right"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMarkets.length === 0 ? (
            <div className="col-span-full py-12 text-center opacity-40">لا توجد أسواق أو ليس لديك صلاحية الوصول.</div>
          ) : (
            filteredMarkets.map(m => (
              <div 
                key={m.id} 
                className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group text-right"
                onClick={() => setSelectedMarket(m)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <i className="fas fa-store text-xl"></i>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteMarket(m.id); }}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                <h4 className="text-lg font-bold">{m.name}</h4>
                <div className="mt-3 space-y-1 text-sm opacity-60">
                  <p><i className="fas fa-user-tie ml-2 w-5 text-left"></i> {m.manager}</p>
                  <p><i className="fas fa-truck ml-2 w-5 text-left"></i> {m.logistics}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-right">
          <div className="glass-card w-full max-w-lg rounded-3xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">{selectedMarket.name}</h3>
              <button onClick={() => setSelectedMarket(null)} className="p-2 opacity-50 hover:opacity-100 transition-all">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <label className="text-[10px] uppercase opacity-40 font-bold block mb-1">مدير الفرع</label>
                  <p className="font-semibold">{selectedMarket.manager}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <label className="text-[10px] uppercase opacity-40 font-bold block mb-1">المشرف</label>
                  <p className="font-semibold">{selectedMarket.supervisor}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <label className="text-[10px] uppercase opacity-40 font-bold block mb-1">معلومات اللوجستيات والتوريد</label>
                <p>{selectedMarket.logistics}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-all">تعديل التفاصيل</button>
                <button 
                  onClick={() => setSelectedMarket(null)}
                  className="px-6 py-3 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-right">
          <form onSubmit={handleAddSubmit} className="glass-card w-full max-w-md rounded-3xl p-8 animate-in slide-in-from-bottom-8 duration-300">
            <h3 className="text-2xl font-bold mb-6">تسجيل سوق جديد</h3>
            <div className="space-y-4">
              <input 
                type="text" placeholder="اسم السوق" required 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-right"
                value={newName} onChange={e => setNewName(e.target.value)}
              />
              <input 
                type="text" placeholder="اسم المدير" required 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-right"
                value={newManager} onChange={e => setNewManager(e.target.value)}
              />
              <input 
                type="text" placeholder="المشرف المسؤول" required 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-right"
                value={newSupervisor} onChange={e => setNewSupervisor(e.target.value)}
              />
              <textarea 
                placeholder="ملاحظات اللوجستيات" required 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 min-h-[100px] text-right"
                value={newLogistics} onChange={e => setNewLogistics(e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-8">
              <button type="submit" className="flex-1 py-3 bg-indigo-600 rounded-xl font-bold">حفظ السوق</button>
              <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 bg-white/5 rounded-xl font-bold">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CRM;

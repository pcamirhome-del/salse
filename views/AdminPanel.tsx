
import React, { useState } from 'react';
import { User, Role, Branch, Product } from '../types';

interface AdminPanelProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onBroadcast: (msg: string) => void;
  isLockdown: boolean;
  setIsLockdown: (val: boolean) => void;
  branches: Branch[];
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  users, setUsers, onBroadcast, isLockdown, setIsLockdown, branches, setBranches, products, setProducts 
}) => {
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'inventory' | 'system'>('users');

  const toggleUserPermissions = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u, permissions: { ...u.permissions, canViewAllOrders: !u.permissions.canViewAllOrders }
    } : u));
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    onBroadcast(broadcastMsg);
    setBroadcastMsg('');
    alert("تم إرسال الإعلان لجميع المستخدمين بنجاح!");
  };

  return (
    <div className="space-y-6 text-right">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">لوحة التحكم الإدارية</h2>
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          {[
            { id: 'users', label: 'المستخدمين' },
            { id: 'inventory', label: 'المخزون' },
            { id: 'system', label: 'النظام' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 opacity-60'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'users' && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-white/5 text-xs uppercase tracking-widest opacity-50">
              <tr>
                <th className="px-6 py-4">المستخدم</th>
                <th className="px-6 py-4">الدور</th>
                <th className="px-6 py-4">الرؤية العامة للطلبات</th>
                <th className="px-6 py-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        {u.username[0].toUpperCase()}
                      </div>
                      <span>{u.displayName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${u.role === Role.ADMIN ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {u.role === Role.ADMIN ? 'مدير' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleUserPermissions(u.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none 
                      ${u.permissions.canViewAllOrders ? 'bg-indigo-600' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 
                        ${u.permissions.canViewAllOrders ? '-translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <button className="p-2 opacity-40 hover:opacity-100"><i className="fas fa-edit"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl">
            <h4 className="font-bold mb-4">إدارة الفروع</h4>
            <div className="space-y-3">
              {branches.map(b => (
                <div key={b.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                  <span>{b.name}</span>
                  <span className="text-xs opacity-50">{b.location}</span>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm opacity-50">+ إضافة فرع</button>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <h4 className="font-bold mb-4">مخزون المنتجات</h4>
            <div className="space-y-3">
               {products.slice(0, 4).map(p => (
                <div key={p.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                  <span>{p.name}</span>
                  <span className={`px-2 py-1 rounded-lg text-[10px] ${p.stock < 50 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                    المخزون: {p.stock}
                  </span>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm opacity-50">+ إضافة منتج</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl">
            <h4 className="font-bold mb-4 flex items-center text-red-400">
              <i className="fas fa-exclamation-triangle ml-3"></i>منطقة الخطر
            </h4>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-right">
                  <p className="font-bold text-sm">إغلاق النظام الشامل (Lockdown)</p>
                  <p className="text-xs opacity-60">تسجيل خروج فوري للجميع ومنع الدخول.</p>
                </div>
                <button 
                  onClick={() => setIsLockdown(!isLockdown)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${isLockdown ? 'bg-green-600' : 'bg-red-600 hover:bg-red-500'}`}
                >
                  {isLockdown ? 'إلغاء الإغلاق' : 'تفعيل الإغلاق'}
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h4 className="font-bold mb-4 flex items-center">
              <i className="fas fa-bullhorn ml-3 text-indigo-400"></i>بث إعلان عام
            </h4>
            <form onSubmit={handleBroadcast} className="space-y-4 text-right">
              <textarea 
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                placeholder="اكتب إعلاناً سيظهر لجميع المستخدمين..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500/50 text-right"
              />
              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                إرسال الإشعار
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

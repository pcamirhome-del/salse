
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
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User State
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<Role>(Role.USER);
  const [newCanViewAll, setNewCanViewAll] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `USR-${Date.now()}`,
      username: newUsername,
      displayName: newDisplayName,
      role: newRole,
      permissions: { canViewAllOrders: newCanViewAll }
    };
    setUsers([...users, newUser]);
    setShowAddUserModal(false);
    setNewUsername(''); setNewDisplayName(''); setNewCanViewAll(false);
    alert("تم إضافة المستخدم بنجاح");
  };

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
    alert("تم إرسال الإعلان بنجاح!");
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
        <div className="space-y-4">
          <div className="flex justify-end">
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
            >
              <i className="fas fa-user-plus ml-2"></i> إضافة مستخدم جديد
            </button>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-white/5 text-xs uppercase tracking-widest opacity-50">
                <tr>
                  <th className="px-6 py-4">المستخدم</th>
                  <th className="px-6 py-4">الدور</th>
                  <th className="px-6 py-4">رؤية جميع الطلبات</th>
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
                        <div>
                          <p className="font-bold">{u.displayName}</p>
                          <p className="text-[10px] opacity-40">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${u.role === Role.ADMIN ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {u.role === Role.ADMIN ? 'مدير' : 'موظف'}
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
                      <button 
                        onClick={() => setUsers(users.filter(usr => usr.id !== u.id))}
                        className="p-2 text-red-400/40 hover:text-red-400 transition-colors"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* إضافة مستخدم مودال */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddUser} className="glass-card w-full max-w-md rounded-3xl p-8 animate-in slide-in-from-bottom-8">
            <h3 className="text-2xl font-bold mb-6">إنشاء حساب موظف</h3>
            <div className="space-y-4">
              <input 
                type="text" placeholder="اسم المستخدم (Username)" required 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-right"
                value={newUsername} onChange={e => setNewUsername(e.target.value)}
              />
              <input 
                type="text" placeholder="اسم العرض الكامل" required 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-right"
                value={newDisplayName} onChange={e => setNewDisplayName(e.target.value)}
              />
              <div className="flex gap-4">
                <select 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-right"
                  value={newRole} onChange={e => setNewRole(e.target.value as Role)}
                >
                  <option value={Role.USER}>موظف مبيعات</option>
                  <option value={Role.ADMIN}>مدير نظام</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-sm">رؤية جميع مبيعات الشركة</span>
                <input 
                  type="checkbox" 
                  checked={newCanViewAll} 
                  onChange={e => setNewCanViewAll(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="submit" className="flex-1 py-3 bg-indigo-600 rounded-xl font-bold">حفظ المستخدم</button>
              <button type="button" onClick={() => setShowAddUserModal(false)} className="px-6 py-3 bg-white/5 rounded-xl font-bold">إلغاء</button>
            </div>
          </form>
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
               {products.map(p => (
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
          <div className="glass-card p-6 rounded-2xl border border-red-500/20">
            <h4 className="font-bold mb-4 flex items-center text-red-400">
              <i className="fas fa-exclamation-triangle ml-3"></i>منطقة الخطر
            </h4>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-right">
                  <p className="font-bold text-sm">وضع الطوارئ (Lockdown)</p>
                  <p className="text-xs opacity-60">سيتم طرد جميع الموظفين من النظام فوراً.</p>
                </div>
                <button 
                  onClick={() => setIsLockdown(!isLockdown)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${isLockdown ? 'bg-green-600' : 'bg-red-600 hover:bg-red-500'}`}
                >
                  {isLockdown ? 'تعطيل الطوارئ' : 'تفعيل الطوارئ'}
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h4 className="font-bold mb-4 flex items-center">
              <i className="fas fa-bullhorn ml-3 text-indigo-400"></i>بث إعلان عام للموظفين
            </h4>
            <form onSubmit={handleBroadcast} className="space-y-4 text-right">
              <textarea 
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                placeholder="اكتب رسالة ستظهر فوراً عند جميع الموظفين..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500/50 text-right"
              />
              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all">
                إرسال الآن
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

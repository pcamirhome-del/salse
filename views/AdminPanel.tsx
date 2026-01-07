
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

  // حالة المستخدم الجديد
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<Role>(Role.USER);
  const [newCanViewAll, setNewCanViewAll] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.find(u => u.username === newUsername)) {
      alert("اسم المستخدم موجود مسبقاً!");
      return;
    }
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
    alert("تم إنشاء حساب الموظف بنجاح.");
  };

  return (
    <div className="space-y-6 text-right">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">لوحة الإدارة المركزية</h2>
          <p className="text-sm opacity-60">تحكم كامل في المستخدمين، المخزون، وإعدادات النظام.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          {[
            { id: 'users', label: 'الموظفين' },
            { id: 'inventory', label: 'المخزون' },
            { id: 'system', label: 'إعدادات النظام' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 opacity-60'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-indigo-600/10 p-4 rounded-2xl border border-indigo-500/20">
            <span className="text-sm font-medium">عدد الموظفين الحاليين: {users.length}</span>
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg"
            >
              <i className="fas fa-user-plus ml-2"></i> إنشاء حساب جديد
            </button>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-white/5 text-xs uppercase tracking-widest opacity-50">
                <tr>
                  <th className="px-6 py-4">الموظف</th>
                  <th className="px-6 py-4">الدور الوظيفي</th>
                  <th className="px-6 py-4">رؤية التقارير</th>
                  <th className="px-6 py-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
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
                        {u.role === Role.ADMIN ? 'مدير نظام' : 'موظف مبيعات'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm opacity-70">
                      {u.permissions.canViewAllOrders ? 'مفتوح' : 'خاص بفرعه'}
                    </td>
                    <td className="px-6 py-4 text-left">
                      {u.username !== 'admin' && (
                        <button 
                          onClick={() => setUsers(users.filter(usr => usr.id !== u.id))}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <i className="fas fa-user-minus"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* مودال إنشاء مستخدم جديد - يظهر للمدير فقط */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddUser} className="glass-card w-full max-w-md rounded-3xl p-8 animate-in slide-in-from-bottom-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <i className="fas fa-id-card text-indigo-400"></i>
              بيانات الحساب الجديد
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs opacity-60 mr-1">اسم المستخدم (للدخول)</label>
                <input 
                  type="text" placeholder="مثال: ahmed_2024" required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-right"
                  value={newUsername} onChange={e => setNewUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs opacity-60 mr-1">الاسم الكامل للموظف</label>
                <input 
                  type="text" placeholder="الاسم الذي سيظهر في التقارير" required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-right"
                  value={newDisplayName} onChange={e => setNewDisplayName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs opacity-60 mr-1">الصلاحية</label>
                  <select 
                    className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-right"
                    value={newRole} onChange={e => setNewRole(e.target.value as Role)}
                  >
                    <option value={Role.USER}>موظف مبيعات</option>
                    <option value={Role.ADMIN}>مدير نظام</option>
                  </select>
                </div>
                <div className="flex flex-col justify-center gap-1">
                   <label className="text-[10px] opacity-60">رؤية الطلبات العامة</label>
                   <input 
                      type="checkbox" 
                      checked={newCanViewAll} 
                      onChange={e => setNewCanViewAll(e.target.checked)}
                      className="w-6 h-6 accent-indigo-600 mt-1"
                    />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold shadow-lg">تثبيت الحساب</button>
              <button type="button" onClick={() => setShowAddUserModal(false)} className="px-6 py-3 bg-white/5 rounded-xl font-bold hover:bg-white/10">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* باقي تبويبات الإدارة */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-building text-blue-400"></i> إدارة الفروع
            </h4>
            <div className="space-y-3">
              {branches.map(b => (
                <div key={b.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center hover:bg-white/10 transition-all">
                  <span>{b.name}</span>
                  <span className="text-xs opacity-50">{b.location}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-boxes text-orange-400"></i> المنتجات والمستودعات
            </h4>
            <div className="space-y-3">
               {products.map(p => (
                <div key={p.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                  <span>{p.name}</span>
                  <span className={`px-2 py-1 rounded-lg text-[10px] ${p.stock < 50 ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-green-500/20 text-green-300'}`}>
                    المخزون: {p.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

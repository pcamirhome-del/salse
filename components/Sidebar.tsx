
import React from 'react';
import { Role } from '../types';

interface SidebarProps {
  isOpen: boolean;
  activeView: string;
  onViewChange: (view: any) => void;
  userRole: Role;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, onViewChange, userRole, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: 'fa-chart-line' },
    { id: 'sales', label: 'مكتب المبيعات', icon: 'fa-cash-register' },
    { id: 'crm', label: 'إدارة العملاء', icon: 'fa-users' },
  ];

  if (userRole === Role.ADMIN) {
    menuItems.push({ id: 'admin', label: 'الإدارة والنظام', icon: 'fa-user-shield' });
  }

  return (
    <aside 
      className={`fixed inset-y-0 right-0 w-64 glass-card border-l-0 transition-transform duration-300 z-30 flex flex-col
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center ml-3">
          <i className="fas fa-bolt text-white"></i>
        </div>
        <span className="font-bold text-lg tracking-tight">لومينا برو</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              onViewChange(item.id);
              onClose();
            }}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all
            ${activeView === item.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
              : 'hover:bg-white/10 opacity-70 hover:opacity-100'}`}
          >
            <i className={`fas ${item.icon} ml-3 w-6`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-2xl p-4 text-center">
          <div className="text-xs opacity-50 mb-1 uppercase tracking-widest">الدعم الفني</div>
          <p className="text-xs mb-3">هل تحتاج لمساعدة في النظام؟</p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition-colors">
            اتصل بالمسؤول
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

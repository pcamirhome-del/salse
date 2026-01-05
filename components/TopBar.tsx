
import React, { useState } from 'react';
import { User, Notification, ThemeType } from '../types';

interface TopBarProps {
  user: User;
  onLogout: () => void;
  onToggleSidebar: () => void;
  notifications: Notification[];
  onThemeToggle: () => void;
  theme: ThemeType;
}

const TopBar: React.FC<TopBarProps> = ({ user, onLogout, onToggleSidebar, notifications, onThemeToggle, theme }) => {
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-white/10 z-20 sticky top-0 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>
        <h1 className="font-bold text-xl hidden md:block">لومينا برو</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={onThemeToggle}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="تغيير المظهر"
        >
          <i className={`fas ${theme === 'light' ? 'fa-moon' : theme === 'dark' ? 'fa-glass-water' : 'fa-sun'}`}></i>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
          >
            <i className="fas fa-bell"></i>
            {notifications.length > 0 && (
              <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          {showNotifs && (
            <div className="absolute left-0 mt-2 w-72 glass-card rounded-xl overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <span className="font-semibold">الإشعارات</span>
                <span className="text-xs opacity-60">{notifications.length} جديد</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center opacity-50 text-sm">لا توجد إشعارات حالياً</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer text-right">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-blue-400">{n.from}</span>
                        <span className="text-[10px] opacity-40">{n.timestamp}</span>
                      </div>
                      <p className="text-xs">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-r border-white/10 pr-4">
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-semibold">{user.displayName}</span>
            <span className="text-[10px] opacity-60 uppercase tracking-widest">{user.role === 'ADMIN' ? 'مسؤول' : 'مستخدم'}</span>
          </div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center transition-all hover:scale-105"
            title="تسجيل الخروج"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

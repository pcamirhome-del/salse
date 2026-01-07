
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Role, Order, Product, Branch, Market, Notification, ChatMessage, ThemeType } from './types';
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_BRANCHES, INITIAL_MARKETS } from './constants';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import SalesDesk from './views/SalesDesk';
import AdminPanel from './views/AdminPanel';
import CRM from './views/CRM';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import InternalChat from './components/InternalChat';
import AIChatBot from './components/AIChatBot';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<ThemeType>('glassy');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'sales' | 'admin' | 'crm' | 'chat'>('dashboard');
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('lumina_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lumina_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('lumina_branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lumina_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [markets, setMarkets] = useState<Market[]>(() => {
    const saved = localStorage.getItem('lumina_markets');
    return saved ? JSON.parse(saved) : INITIAL_MARKETS;
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLockdown, setIsLockdown] = useState(false);

  useEffect(() => {
    localStorage.setItem('lumina_users', JSON.stringify(users));
    localStorage.setItem('lumina_products', JSON.stringify(products));
    localStorage.setItem('lumina_branches', JSON.stringify(branches));
    localStorage.setItem('lumina_orders', JSON.stringify(orders));
    localStorage.setItem('lumina_markets', JSON.stringify(markets));
  }, [users, products, branches, orders, markets]);

  useEffect(() => {
    if (isLockdown) setCurrentUser(null);
  }, [isLockdown]);

  const handleLogin = (username: string) => {
    const user = users.find(u => u.username === username);
    if (!user) {
      alert("مستخدم غير موجود");
      return;
    }
    if (isLockdown && user.role !== Role.ADMIN) {
      alert("النظام في حالة صيانة حالياً.");
      return;
    }
    setCurrentUser(user);
  };

  const handleLogout = () => setCurrentUser(null);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => { if (window.innerWidth < 1024) setIsSidebarOpen(false); };

  const addOrder = (order: Order) => setOrders(prev => [...prev, order]);

  const broadcastNotification = (msg: string) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      message: msg,
      timestamp: new Date().toLocaleTimeString('ar-EG'),
      from: currentUser?.displayName || 'المدير',
      type: 'Broadcast'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const filteredOrders = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === Role.ADMIN || currentUser.permissions.canViewAllOrders) return orders;
    return orders.filter(o => o.userId === currentUser.id);
  }, [orders, currentUser]);

  const themeClasses = {
    light: 'bg-gray-50 text-gray-900',
    dark: 'bg-slate-900 text-gray-100',
    glassy: 'glassy-theme text-white'
  };

  if (!currentUser) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Login onLogin={handleLogin} users={users} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-500 ${themeClasses[theme]} ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeView={activeView} 
        onViewChange={setActiveView} 
        userRole={currentUser.role}
        onClose={closeSidebar}
      />

      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'mr-0 md:mr-64' : 'mr-0'}`}
        onClick={() => window.innerWidth < 1024 && isSidebarOpen && setIsSidebarOpen(false)}
      >
        <TopBar 
          user={currentUser} 
          onLogout={handleLogout} 
          onToggleSidebar={toggleSidebar}
          notifications={notifications}
          onThemeToggle={() => setTheme(t => t === 'light' ? 'dark' : t === 'dark' ? 'glassy' : 'light')}
          theme={theme}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <motion.div key="dash" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}}>
                <Dashboard orders={filteredOrders} products={products} />
              </motion.div>
            )}
            {activeView === 'sales' && (
              <motion.div key="sales" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}}>
                <SalesDesk 
                  user={currentUser} 
                  products={products} 
                  branches={branches} 
                  onPostOrder={addOrder} 
                />
              </motion.div>
            )}
            {activeView === 'crm' && (
              <motion.div key="crm" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}}>
                <CRM 
                  user={currentUser} 
                  markets={markets} 
                  onAddMarket={(m) => setMarkets([...markets, m])}
                  onDeleteMarket={(id) => setMarkets(markets.filter(m => m.id !== id))}
                />
              </motion.div>
            )}
            {activeView === 'admin' && currentUser.role === Role.ADMIN && (
              <motion.div key="admin" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}}>
                <AdminPanel 
                  users={users} 
                  setUsers={setUsers} 
                  onBroadcast={broadcastNotification}
                  isLockdown={isLockdown}
                  setIsLockdown={setIsLockdown}
                  branches={branches}
                  setBranches={setBranches}
                  products={products}
                  setProducts={setProducts}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* شات الموظفين الداخلي */}
      <InternalChat 
        user={currentUser} 
        isOpen={isChatOpen} 
        setIsOpen={setIsChatOpen}
        messages={chatMessages}
        setMessages={setChatMessages}
      />

      {/* المساعد الذكي AI - مطلع على كامل البيانات */}
      <AIChatBot 
        user={currentUser}
        data={{
          products,
          orders,
          branches,
          users,
          totalSales: orders.reduce((sum, o) => sum + o.totalValue, 0)
        }}
      />
    </div>
  );
};

export default App;

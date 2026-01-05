
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
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<ThemeType>('glassy');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'sales' | 'admin' | 'crm' | 'chat'>('dashboard');
  
  // App State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLockdown, setIsLockdown] = useState(false);

  // Load from storage for "Offline Mode" simulation
  useEffect(() => {
    const savedOrders = localStorage.getItem('lumina_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    const savedNotifications = localStorage.getItem('lumina_notifications');
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  // Auto-sync simulation
  useEffect(() => {
    localStorage.setItem('lumina_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (isLockdown) {
      setCurrentUser(null);
    }
  }, [isLockdown]);

  const handleLogin = (user: User) => {
    if (isLockdown && user.role !== Role.ADMIN) {
      alert("System is currently in lockdown for maintenance.");
      return;
    }
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => { if (window.innerWidth < 1024) setIsSidebarOpen(false); };

  const addOrder = (order: Order) => {
    const newOrders = [...orders, order];
    setOrders(newOrders);
    // Audit log simulation
    console.log(`Audit: ${order.userName} posted order ${order.id}`);
  };

  const broadcastNotification = (msg: string) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      message: msg,
      timestamp: new Date().toLocaleTimeString(),
      from: currentUser?.displayName || 'Admin',
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
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeView={activeView} 
        onViewChange={setActiveView} 
        userRole={currentUser.role}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}
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

      {/* Floating Chat */}
      <InternalChat 
        user={currentUser} 
        isOpen={isChatOpen} 
        setIsOpen={setIsChatOpen}
        messages={chatMessages}
        setMessages={setChatMessages}
      />
    </div>
  );
};

export default App;

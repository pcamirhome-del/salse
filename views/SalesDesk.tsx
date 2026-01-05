
import React, { useState } from 'react';
import { User, Product, Branch, Order } from '../types';

interface SalesDeskProps {
  user: User;
  products: Product[];
  branches: Branch[];
  onPostOrder: (order: Order) => void;
}

const SalesDesk: React.FC<SalesDeskProps> = ({ user, products, branches, onPostOrder }) => {
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || '');
  const [cart, setCart] = useState<{ productId: string; name: string; quantity: number; price: number }[]>([]);
  const [posting, setPosting] = useState(false);

  const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.productId === product.id);
      if (existing) {
        return prev.map(p => p.productId === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { productId: product.id, name: product.name, quantity: 1, price: product.price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.productId !== productId));
  };

  const handlePost = async () => {
    if (cart.length === 0) return;
    setPosting(true);
    
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        userId: user.id,
        userName: user.displayName,
        branchId: selectedBranch,
        branchName: branches.find(b => b.id === selectedBranch)?.name || 'غير معروف',
        timestamp: new Date().toISOString(),
        items: [...cart],
        totalValue,
        status: 'Posted'
      };

      onPostOrder(newOrder);
      setCart([]);
      setPosting(false);
      alert("تم ترحيل الطلب بنجاح");
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-right">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">كتالوج المنتجات</h3>
            <div className="flex gap-2">
               <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none"
               >
                 {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
               </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/10 transition-all group">
                <div className="text-right">
                  <h4 className="font-bold">{p.name}</h4>
                  <p className="text-xs opacity-50">{p.category}</p>
                  <p className="text-indigo-400 font-bold mt-1">{p.price} $</p>
                </div>
                <button 
                  onClick={() => addToCart(p)}
                  className="w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-transform group-active:scale-95"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="glass-card p-6 rounded-2xl sticky top-24 flex flex-col h-[calc(100vh-140px)]">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <i className="fas fa-shopping-basket ml-3 text-indigo-400"></i>السلة الحالية
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                <i className="fas fa-ghost text-4xl mb-4"></i>
                <p>السلة فارغة</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.productId} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex-1 text-right">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs opacity-50">{item.quantity} × {item.price} $</p>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg mr-2">
                    <i className="fas fa-trash-alt text-sm"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>الإجمالي</span>
              <span className="text-indigo-400">{totalValue.toFixed(2)} $</span>
            </div>
            
            <button 
              onClick={handlePost}
              disabled={cart.length === 0 || posting}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all
                ${cart.length === 0 || posting 
                  ? 'bg-white/5 opacity-50 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-500 shadow-xl shadow-green-600/20 active:scale-[0.98]'}`}
            >
              {posting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  <span>ترحيل الطلب</span>
                  <i className="fas fa-paper-plane"></i>
                </>
              )}
            </button>
            <p className="text-[10px] text-center opacity-40 uppercase tracking-widest">ترحيل إلى سجل الأستاذ العام</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDesk;

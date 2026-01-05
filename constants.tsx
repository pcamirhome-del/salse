
import React from 'react';
import { Product, Branch, User, Role, Market } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'شاشة لومينا OLED 55 بوصة', category: 'إلكترونيات', price: 1200, stock: 50 },
  { id: 'p2', name: 'محول الترا هب برو', category: 'إكسسوارات', price: 150, stock: 200 },
  { id: 'p3', name: 'هاتف نوفا الذكي 12', category: 'جوالات', price: 899, stock: 30 },
];

export const INITIAL_BRANCHES: Branch[] = [
  { id: 'b1', name: 'مركز وسط المدينة', location: 'شارع الملك فهد 101' },
  { id: 'b2', name: 'فرع المنطقة الغربية', location: 'طريق الكورنيش 405' },
];

export const INITIAL_USERS: User[] = [
  { 
    id: 'u1', 
    username: 'admin', 
    displayName: 'المدير العام', 
    role: Role.ADMIN, 
    permissions: { canViewAllOrders: true } 
  },
  { 
    id: 'u2', 
    username: 'ahmed', 
    displayName: 'أحمد مندوب المبيعات', 
    role: Role.USER, 
    permissions: { canViewAllOrders: false } 
  },
];

export const INITIAL_MARKETS: Market[] = [
  { 
    id: 'm1', 
    name: 'كارفور مترو', 
    manager: 'سارة جاسم', 
    supervisor: 'ماجد التميمي', 
    logistics: 'يومياً 9 صباحاً', 
    createdBy: 'u1' 
  },
];

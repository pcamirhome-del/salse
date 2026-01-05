
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: Role;
  permissions: {
    canViewAllOrders: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  branchId: string;
  branchName: string;
  timestamp: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  totalValue: number;
  status: 'Draft' | 'Posted';
}

export interface Market {
  id: string;
  name: string;
  manager: string;
  supervisor: string;
  logistics: string;
  createdBy: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  from: string;
  type: 'Broadcast' | 'Alert' | 'System';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export type ThemeType = 'light' | 'dark' | 'glassy';

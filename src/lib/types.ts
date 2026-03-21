export interface User {
  userId: string;
  username: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  categoryId: string;
  category?: { id: string; name: string };
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItemId: string;
  menuItem: MenuItem;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: { username: string };
  items: OrderItem[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export const ORDER_STATUS_MAP: Record<string, string> = {
  pending: "已下单",
  preparing: "制作中",
  completed: "已完成",
  picked_up: "已取餐",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  picked_up: "bg-gray-100 text-gray-800",
};

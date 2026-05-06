import api from './api';
import type { Product } from './products';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | string;

export interface OrderItem {
  product: Product | {
    _id: string;
    name: string;
    price?: number;
    unit?: string;
    images?: string[];
    producer?: {
      _id: string;
      name: string;
    };
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  buyer?: {
    _id: string;
    name?: string;
    email?: string;
  };
}

export interface CreateOrderPayload {
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice?: number;
  }>;
  deliveryAddress?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  deliveryMethod?: string;
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
}

export const ordersApi = {
  async getMyOrders(): Promise<Order[]> {
    const response = await api.get('/orders/me');
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    const response = await api.post('/orders', payload);
    return response.data;
  },

  async getProducerOrders(): Promise<Order[]> {
    const response = await api.get('/orders/producer/me');
    return response.data;
  },
};

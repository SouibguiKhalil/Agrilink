import api from './api';

export interface UserProfile {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'buyer' | 'producer' | 'admin';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
  };
}

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    producer: {
      _id: string;
      name: string;
    };
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  updatedAt: string;
}

export const accountService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async getOrders(): Promise<Order[]> {
    const response = await api.get('/orders/me');
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put('/auth/me', data);
    return response.data;
  },

  async updateAddress(address: UserProfile['address']): Promise<UserProfile> {
    const response = await api.put('/auth/me/address', { address });
    return response.data;
  },
};

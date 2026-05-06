import api from './api';

export interface ProducerLocation {
  address?: string;
  city?: string;
  region?: string;
  country?: string;
}

export interface ProducerProfile {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  city?: string;
  region?: string;
  phone?: string;
  email?: string;
  location?: ProducerLocation;
  categories?: string[];
  badges?: string[];
  isVerified?: boolean;
}

export interface ProducerProfileWithProducts {
  producer: ProducerProfile;
  products?: ProducerProduct[];
}

export interface ProducerUser {
  _id: string;
  role: 'buyer' | 'producer' | 'admin';
  name?: string;
  email: string;
  producerId?: string;
}

export interface ProducerProduct {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  stock?: number;
  images?: string[];
  badges?: string[];
  isActive?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  totalSales?: number;
}

export interface ProducerOrderItem {
  product: {
    _id: string;
    name: string;
  };
  quantity: number;
  price: number;
}

export interface ProducerOrder {
  _id: string;
  createdAt: string;
  status: string;
  total: number;
  items: ProducerOrderItem[];
  customerName?: string;
}

export const producersApi = {
  async getProducers(search?: string): Promise<ProducerProfile[]> {
    const response = await api.get('/producers', {
      params: search ? { search } : undefined,
    });
    return response.data;
  },

  async getById(id: string): Promise<ProducerProfileWithProducts> {
    const response = await api.get(`/producers/${id}`);
    return response.data;
  },

  async getMyProfile(): Promise<ProducerProfileWithProducts> {
    const response = await api.get('/auth/me');
    const producerId = response.data?.producer?._id;
    if (!producerId) {
      throw new Error('Aucun profil producteur trouvé');
    }
    const producerResponse = await api.get(`/producers/${producerId}`);
    return producerResponse.data;
  },

  async updateMyProfile(payload: Partial<ProducerProfile>): Promise<ProducerProfile> {
    const response = await api.put('/producers/me', payload);
    return response.data;
  },

  async getOrders(): Promise<ProducerOrder[]> {
    const response = await api.get('/orders/producer/me');
    return response.data;
  },
};

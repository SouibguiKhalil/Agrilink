import api from './api';
import type { AuthUser } from './auth';

export interface BuyerAddress {
  _id?: string;
  label?: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface BuyerProfile extends AuthUser {
  imageUrl?: string;
}

const normalizeAddress = (address?: BuyerAddress | null): BuyerAddress[] => {
  if (!address) return [];
  return [{ ...address, _id: address._id || 'default' }];
};

export const buyersApi = {
  async updateMe(payload: Partial<BuyerProfile>): Promise<BuyerProfile> {
    const response = await api.put('/auth/me', payload);
    return response.data;
  },

  async getAddresses(): Promise<BuyerAddress[]> {
    const response = await api.get('/auth/me');
    return normalizeAddress(response.data?.user?.address || response.data?.address);
  },

  async addAddress(payload: Omit<BuyerAddress, '_id'>): Promise<BuyerAddress> {
    const response = await api.put('/auth/me', { address: payload });
    const addr = response.data?.address || response.data?.user?.address || payload;
    return { ...addr, _id: addr._id || 'default' };
  },

  async updateAddress(id: string, payload: Partial<BuyerAddress>): Promise<BuyerAddress> {
    const response = await api.put('/auth/me', { address: payload });
    const addr = response.data?.address || response.data?.user?.address || payload;
    return { ...addr, _id: addr._id || id || 'default' };
  },

  async deleteAddress(_id: string): Promise<void> {
    await api.put('/auth/me', { address: null });
  },
};

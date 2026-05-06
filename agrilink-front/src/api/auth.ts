import api from './api';

export type UserRole = 'buyer' | 'producer' | 'admin';

export interface AuthUser {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  role: UserRole | string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
  };
}

export interface ProducerSummary {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  location?: {
    address?: string;
    city?: string;
    region?: string;
  };
  badges?: string[];
}

export interface AuthMeResponse {
  user: AuthUser;
  producer?: ProducerSummary | null;
}

export const authApi = {
  async getMe(): Promise<AuthMeResponse> {
    const token = localStorage.getItem('agrilink_token') || localStorage.getItem('userToken');
    const response = await api.get('/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  },

  async updateMe(payload: Partial<AuthUser>): Promise<AuthUser> {
    const response = await api.put('/auth/me', payload);
    return response.data;
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.patch('/auth/change-password', payload);
  },
};

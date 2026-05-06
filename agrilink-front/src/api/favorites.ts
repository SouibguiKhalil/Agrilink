import api from './api';
import type { Product } from './products';

export interface FavoriteItem extends Product {}

export const favoritesApi = {
  async getFavorites(): Promise<FavoriteItem[]> {
    const response = await api.get('/favorites');
    return response.data;
  },

  async addFavorite(productId: string): Promise<void> {
    await api.post(`/favorites/${productId}`);
  },

  async removeFavorite(productId: string): Promise<void> {
    await api.delete(`/favorites/${productId}`);
  },
};

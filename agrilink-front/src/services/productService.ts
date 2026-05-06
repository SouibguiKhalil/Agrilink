import api from './api';

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  producer: {
    _id: string;
    name: string;
  };
  images: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export const getProducts = async (params?: {
  category?: string;
  producerId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (productData: FormData) => {
  try {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: FormData) => {
  try {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit ${id}:`, error);
    throw error;
  }
};

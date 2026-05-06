import api from './api';

export type ProductStatus = 'pending' | 'approved' | 'rejected';

export interface ProductProducer {
  _id: string;
  name: string;
  city?: string;
  region?: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  stock?: number;
  images?: string[];
  badges?: string[];
  imageUrl?: string;
  producer?: ProductProducer;
  isActive?: boolean;
  status?: ProductStatus;
  totalSales?: number;
}

export interface ProductPayload {
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  stock?: number;
  images?: string[];
  badges?: string[];
  imageUrl?: string;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  labels?: string[];
  page?: number;
  limit?: number;
  producerId?: string;
}

export const productsApi = {
  async getProducts(params?: ProductQuery): Promise<Product[]> {
    const response = await api.get('/products', {
      params: {
        search: params?.search,
        category: params?.category,
        labels: params?.labels?.length ? params.labels.join(',') : undefined,
        page: params?.page,
        limit: params?.limit,
      },
    });
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getByProducer(producerId: string): Promise<Product[]> {
    const response = await api.get('/products', { params: { producerId } });
    return response.data;
  },

  async createProduct(payload: ProductPayload): Promise<Product> {
    const response = await api.post('/products', payload);
    return response.data;
  },

  async updateProduct(productId: string, payload: Partial<ProductPayload>): Promise<Product> {
    const response = await api.put(`/products/${productId}`, payload);
    return response.data;
  },

  async deleteProduct(productId: string): Promise<void> {
    await api.delete(`/products/${productId}`);
  },

  async uploadProductImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.imageUrl as string;
  },

  async uploadProducerImage(formData: FormData): Promise<string> {
    const response = await api.post('/upload/producer-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.imageUrl as string;
  },
};

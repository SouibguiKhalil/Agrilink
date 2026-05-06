import api from './api';

export const uploadApi = {
  async uploadProfile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.imageUrl as string;
  },
};

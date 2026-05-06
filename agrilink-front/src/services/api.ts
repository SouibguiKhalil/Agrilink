import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrilink_token') || localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const handleResponse = (response: any) => {
  return response.data;
};

export const handleError = (error: any) => {
  if (error.response) {
    console.error('Erreur de reponse:', error.response.data);
    console.error('Statut:', error.response.status);
    console.error('En-tetes:', error.response.headers);
    throw new Error(error.response.data.message || 'Une erreur est survenue');
  } else if (error.request) {
    console.error('Erreur de requete:', error.request);
    throw new Error('Pas de reponse du serveur. Verifiez votre connexion.');
  } else {
    console.error('Erreur:', error.message);
    throw new Error('Erreur lors de la configuration de la requete');
  }
};

export default api;

import { useState, useEffect, useCallback } from 'react';
import { authApi, type AuthMeResponse, type ProducerSummary } from '../api/auth';
import {
  producersApi,
  type ProducerUser,
  type ProducerProfile,
  type ProducerOrder,
} from '../api/producers';
import { productsApi, type Product } from '../api/products';

interface LoadingState {
  user: boolean;
  profile: boolean;
  products: boolean;
  orders: boolean;
}

interface ErrorState {
  user?: string;
  profile?: string;
  products?: string;
  orders?: string;
}

export const useProducerDashboard = () => {
  const [user, setUser] = useState<(ProducerUser & { producer?: ProducerSummary | null }) | null>(null);
  const [producerId, setProducerId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProducerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<ProducerOrder[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    user: true,
    profile: true,
    products: true,
    orders: true,
  });
  const [error, setError] = useState<ErrorState>({});

  const fetchUser = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, user: true }));
      const current: AuthMeResponse = await authApi.getMe();
      const baseUser = current.user as ProducerUser;
      setUser({ ...baseUser, producer: current.producer });

      if (baseUser.role !== 'producer') {
        setError(prev => ({
          ...prev,
          user: 'Acces reserve aux comptes producteurs.',
        }));
        setProducerId(null);
      } else {
        const id = current.producer?._id || baseUser.producerId || baseUser._id;
        setProducerId(id);
        setError(prev => ({ ...prev, user: undefined }));
      }
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      setError(prev => ({
        ...prev,
        user: "Impossible de charger l'utilisateur connecte.",
      }));
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  }, []);

  const fetchProfile = useCallback(
    async (id?: string) => {
      const targetId = id || producerId;
      if (!targetId) return;
      try {
        setLoading(prev => ({ ...prev, profile: true }));
        const data = await producersApi.getById(targetId);
        setProfile(data.producer);
        setError(prev => ({ ...prev, profile: undefined }));
      } catch (err) {
        console.error('Failed to fetch producer profile:', err);
        setError(prev => ({
          ...prev,
          profile: 'Impossible de charger le profil producteur.',
        }));
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    },
    [producerId]
  );

  const fetchProducts = useCallback(
    async (id?: string) => {
      const targetId = id || producerId;
      if (!targetId) return;
      try {
        setLoading(prev => ({ ...prev, products: true }));
        const data = await productsApi.getByProducer(targetId);
        setProducts(data);
        setError(prev => ({ ...prev, products: undefined }));
      } catch (err) {
        console.error('Failed to fetch producer products:', err);
        setError(prev => ({
          ...prev,
          products: 'Impossible de charger les produits du producteur.',
        }));
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    },
    [producerId]
  );

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const data = await producersApi.getOrders();
      setOrders(data);
      setError(prev => ({ ...prev, orders: undefined }));
    } catch (err) {
      console.error('Failed to fetch producer orders:', err);
      setError(prev => ({
        ...prev,
        orders: 'Impossible de charger les commandes du producteur.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!producerId) return;
    fetchProfile(producerId);
    fetchProducts(producerId);
    fetchOrders();
  }, [producerId, fetchProfile, fetchProducts, fetchOrders]);

  return {
    user,
    producerId,
    profile,
    products,
    orders,
    loading,
    error,
    refreshUser: fetchUser,
    refreshProfile: () => fetchProfile(),
    refreshProducts: () => fetchProducts(),
    refreshOrders: fetchOrders,
  };
};

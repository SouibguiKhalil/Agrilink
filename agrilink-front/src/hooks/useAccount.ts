import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authApi, type AuthUser, type AuthMeResponse, type ProducerSummary } from '../api/auth';

type UseAccountOptions = {
  autoFetch?: boolean;
  redirectOnError?: boolean;
};

export type AccountUser = AuthUser & { producer?: ProducerSummary | null };

export const useAccount = (options?: UseAccountOptions) => {
  const { autoFetch = true, redirectOnError = true } = options || {};
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('agrilink_token') || localStorage.getItem('userToken');

    if (!token) {
      setUser(null);
      setError('Session expiree. Merci de vous reconnecter.');
      setLoading(false);
      if (redirectOnError) {
        navigate('/login');
      }
      return;
    }

    try {
      setLoading(true);
      const data: AuthMeResponse = await authApi.getMe();
      const merged: AccountUser = { ...data.user, producer: data.producer };
      setUser(merged);
      setError(null);
    } catch (err) {
      setError('Impossible de charger votre compte. Veuillez vous reconnecter.');

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('agrilink_token');
        localStorage.removeItem('userToken');
        if (redirectOnError) {
          navigate('/login');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, redirectOnError]);

  useEffect(() => {
    if (autoFetch) {
      loadUser();
    }
  }, [autoFetch, loadUser]);

  return {
    user,
    loading,
    error,
    reload: loadUser,
  };
};

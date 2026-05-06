import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../hooks/useAccount';
import { BuyerProfilePage } from './BuyerProfilePage';

export const AccountEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, error } = useAccount();

  useEffect(() => {
    if (loading) return;
    if (user?.role === 'producer') {
      navigate('/account/producer/profile', { replace: true });
    }
  }, [loading, user?.role, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#F2E8CF] border-t-[#386641] rounded-full animate-spin" />
        <p className="text-sm text-gray-600">Chargement de votre compte...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-sm p-6 space-y-4">
          <p className="text-lg font-semibold text-[#386641]">Connexion requise</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return <BuyerProfilePage />;
};

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import { AccountSidebar } from '../components/AccountSidebar';
import { Button } from '../components/Button';
import { useAccount } from '../hooks/useAccount';

const roleLabels: Record<string, string> = {
  buyer: 'Acheteur',
  producer: 'Producteur',
  admin: 'Admin',
};

export const BuyerAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, error, reload } = useAccount();

  useEffect(() => {
    if (!loading && user?.role === 'producer') {
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
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => navigate('/login')}>
              Se connecter
            </Button>
            <Button variant="outline" onClick={reload}>
              Reessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const addressParts = [
    user.address?.street,
    [user.address?.postalCode, user.address?.city].filter(Boolean).join(' ').trim() || undefined,
    user.address?.region,
  ].filter(Boolean);
  const addressDisplay = addressParts.join(', ') || 'Adresse non renseignee';
  const roleLabel = roleLabels[user.role as string] || user.role || 'Utilisateur';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountSidebar activeKey="buyer-profile" user={user} loading={loading} error={error} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Mon compte</p>
              <h1
                className="text-2xl text-[#386641] mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {user.name}
              </h1>
              <p className="text-sm text-gray-600">{roleLabel}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={reload}>
                Actualiser
              </Button>
              <Button variant="primary" onClick={() => navigate('/produits')}>
                Decouvrir les produits
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2
              className="text-xl text-[#386641] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Informations personnelles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-lg p-4 flex items-start gap-3">
                <div className="p-2 bg-[#F2E8CF] rounded-lg">
                  <Mail className="w-5 h-5 text-[#386641]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg p-4 flex items-start gap-3">
                <div className="p-2 bg-[#F2E8CF] rounded-lg">
                  <Phone className="w-5 h-5 text-[#386641]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telephone</p>
                  <p className="text-gray-900">{user.phone || 'Non renseigne'}</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg p-4 flex items-start gap-3 sm:col-span-2">
                <div className="p-2 bg-[#F2E8CF] rounded-lg">
                  <MapPin className="w-5 h-5 text-[#386641]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="text-gray-900">{addressDisplay}</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg p-4 flex items-start gap-3">
                <div className="p-2 bg-[#F2E8CF] rounded-lg">
                  <Shield className="w-5 h-5 text-[#386641]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gray-900">{roleLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerAccountPage;

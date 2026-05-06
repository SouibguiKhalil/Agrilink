import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, BadgeCheck, Loader2, Mail, Phone } from 'lucide-react';
import { AccountSidebar } from '../components/AccountSidebar';
import { Button } from '../components/Button';
import { useAccount, type AccountUser } from '../hooks/useAccount';
import { producersApi, type ProducerProfileWithProducts } from '../api/producers';

export const ProducerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: loadingUser, error: accountError } = useAccount();
  const producerId = useMemo(() => (user as AccountUser | null)?.producer?._id, [user]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProducerProfileWithProducts | null>(null);

  useEffect(() => {
    if (!loadingUser && (!user || user.role !== 'producer')) {
      navigate('/login');
    }
  }, [user, loadingUser, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!producerId) return;
      try {
        setLoading(true);
        const response = await producersApi.getById(producerId);
        setData(response);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le profil producteur.');
      } finally {
        setLoading(false);
      }
    };
    if (producerId) {
      loadProfile();
    }
  }, [producerId]);

  const profile = data?.producer;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountSidebar
            activeKey="producer-profile"
            user={user as any}
            loading={loadingUser}
            error={accountError}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-[#386641] animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
              {error}
            </div>
          ) : !profile ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-700">Aucun profil producteur trouvé.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Informations personnelles
                  </h2>
                  <p className="text-sm text-gray-600">Vos informations de compte producteur</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/account/producer/settings')}>
                  Mettre à jour
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-10 h-10 p-2 rounded-lg bg-[#F2E8CF] text-[#386641]" />
                  <div>
                    <p className="text-sm text-gray-600">Nom</p>
                    <p className="text-gray-900">{profile.name || 'Non renseigné'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-10 h-10 p-2 rounded-lg bg-[#F2E8CF] text-[#386641]" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{user?.email || 'Non renseigné'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-10 h-10 p-2 rounded-lg bg-[#F2E8CF] text-[#386641]" />
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="text-gray-900">{user?.phone || 'Non renseigné'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-10 h-10 p-2 rounded-lg bg-[#F2E8CF] text-[#386641]" />
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="text-gray-900">
                      {profile.location?.address ||
                        [profile.location?.city, profile.location?.region].filter(Boolean).join(', ') ||
                        'Adresse non renseignée'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BadgeCheck className="w-10 h-10 p-2 rounded-lg bg-[#F2E8CF] text-[#386641]" />
                  <div>
                    <p className="text-sm text-gray-600">Rôle</p>
                    <p className="text-gray-900">Producteur</p>
                  </div>
                </div>
              </div>

              {profile.badges && profile.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-[#F2E8CF] text-[#386641]"
                    >
                      <BadgeCheck className="w-3 h-3" />
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProducerProfilePage;

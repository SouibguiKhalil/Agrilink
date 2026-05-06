import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload } from 'lucide-react';
import { AccountSidebar } from '../components/AccountSidebar';
import { Button } from '../components/Button';
import { useAccount, type AccountUser } from '../hooks/useAccount';
import { producersApi, type ProducerProfile } from '../api/producers';
import { authApi } from '../api/auth';
import { productsApi } from '../api/products';

type FormState = {
  userName: string;
  userEmail: string;
  userPhone: string;
  farmName: string;
  description: string;
  imageUrl: string;
  address: string;
  city: string;
  region: string;
  badges: string;
};

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiOrigin = apiBase.replace(/\/api\/?$/, '');

export const ProducerSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, loading: loadingUser, error: accountError, reload } = useAccount();
  const producerId = useMemo(() => (user as AccountUser | null)?.producer?._id, [user]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    userName: '',
    userEmail: '',
    userPhone: '',
    farmName: '',
    description: '',
    imageUrl: '',
    address: '',
    city: '',
    region: '',
    badges: '',
  });

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
        const data = await producersApi.getById(producerId);
        const profile = data.producer as ProducerProfile;
        setForm({
          userName: user?.name || '',
          userEmail: user?.email || '',
          userPhone: (user as AccountUser | null)?.phone || '',
          farmName: profile.name || '',
          description: profile.description || '',
          imageUrl: profile.imageUrl || '',
          address: profile.location?.address || '',
          city: profile.location?.city || '',
          region: profile.location?.region || '',
          badges: (profile.badges || []).join(', '),
        });
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger votre profil producteur.');
      } finally {
        setLoading(false);
      }
    };
    if (producerId) {
      loadProfile();
    }
  }, [producerId, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLocalUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const imageUrl = await productsApi.uploadProducerImage(formData);
      setForm(prev => ({ ...prev, imageUrl }));
      setSuccess('Image uploadée avec succès.');
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'upload de l'image.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLocalUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      await Promise.all([
        authApi.updateMe({
          name: form.userName,
          phone: form.userPhone,
        }),
        producersApi.updateMyProfile({
          name: form.farmName,
          description: form.description,
          imageUrl: form.imageUrl,
          location: {
            address: form.address,
            city: form.city,
            region: form.region,
          },
          badges: form.badges
            .split(',')
            .map((b) => b.trim())
            .filter(Boolean),
        }),
      ]);
      await reload();
      setSuccess('Profil mis à jour.');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour du profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountSidebar activeKey="producer-settings" user={user as any} loading={loadingUser} error={accountError} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div>
            <p className="text-sm text-gray-500">Mon compte · Producteur</p>
            <h1 className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
              Paramètres du producteur
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-[#386641] animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <h2 className="text-lg font-semibold text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Informations du producteur
                  </h2>
                  <p className="text-sm text-gray-600">Mettez à jour vos informations principales</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nom & prénom du producteur</label>
                    <input
                      type="text"
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nom de la ferme</label>
                    <input
                      type="text"
                      name="farmName"
                      value={form.farmName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Téléphone</label>
                    <input
                      type="text"
                      name="userPhone"
                      value={form.userPhone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email (lecture seule)</label>
                    <input
                      type="email"
                      name="userEmail"
                      value={form.userEmail}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Image (URL)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="https://..."
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="whitespace-nowrap"
                      >
                        <Upload className="w-4 h-4" />
                        Ajouter depuis local
                      </Button>
                    </div>
                    {form.imageUrl && (
                      <img
                        src={form.imageUrl.startsWith('/uploads') ? `${apiOrigin}${form.imageUrl}` : form.imageUrl}
                        alt="aperçu"
                        className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Badges (séparés par virgule)</label>
                    <input
                      type="text"
                      name="badges"
                      value={form.badges}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="bio, local..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Localisation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <label className="block text-sm text-gray-600 mb-1">Adresse</label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Ville</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Région</label>
                      <input
                        type="text"
                        name="region"
                        value={form.region}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Pays</label>
                      <input
                        type="text"
                        name="country"
                        value="Tunisie"
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-green-700">{success}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" type="button" onClick={() => navigate('/account/producer/profile')}>
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? 'Enregistrement...' : 'Mettre à jour'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProducerSettingsPage;

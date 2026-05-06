import React, { useEffect, useState } from 'react';
import { BuyerSidebar } from '../components/BuyerSidebar';
import { Button } from '../components/Button';
import { useAccount } from '../hooks/useAccount';
import { buyersApi } from '../api/buyers';
import { authApi } from '../api/auth';
import { uploadApi } from '../api/upload';
import { resolveUploadUrl } from '../utils/images';

export const BuyerSettingsPage: React.FC = () => {
  const { user, reload } = useAccount();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    region: '',
    postalCode: '',
    imageUrl: '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        region: user.address?.region || '',
        postalCode: user.address?.postalCode || '',
        imageUrl: user.imageUrl || '',
      });
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage(null);
    setError(null);
    try {
      await buyersApi.updateMe({
        name: form.name,
        phone: form.phone,
        imageUrl: form.imageUrl,
        address: {
          street: form.street,
          city: form.city,
          region: form.region,
          postalCode: form.postalCode,
        } as any,
      } as any);
      setMessage('Profil mis à jour.');
      await reload();
    } catch (err) {
      console.error(err);
      setError('Mise à jour impossible.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      setError('Merci de renseigner les deux mots de passe.');
      return;
    }
    setSavingPassword(true);
    setMessage(null);
    setError(null);
    try {
      await authApi.changePassword(passwords);
      setMessage('Mot de passe mis à jour.');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      console.error(err);
      setError('Changement de mot de passe impossible.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    setSavingProfile(true);
    try {
      const imageUrl = await uploadApi.uploadProfile(file);
      setForm((prev) => ({ ...prev, imageUrl }));
      setMessage('Photo mise à jour, pensez à sauvegarder le profil.');
    } catch (err) {
      console.error(err);
      setError('Upload impossible.');
    } finally {
      setSavingProfile(false);
    }
  };

  const avatar = resolveUploadUrl(form.imageUrl);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <BuyerSidebar />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <h1 className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
            Paramètres du compte
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-[#F2E8CF] flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-[#386641]">👤</span>
                )}
              </div>
              <div>
                <label className="block">
                  <span className="text-sm text-gray-700">Photo de profil</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 text-sm"
                    onChange={(e) => handleUpload(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleProfileSave}>
              <input
                type="text"
                placeholder="Nom complet"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Téléphone"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Rue"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
              <input
                type="text"
                placeholder="Ville"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Région"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
              <input
                type="text"
                placeholder="Code postal"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              />
              <input
                type="text"
                placeholder="Email (lecture seule)"
                className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2"
                value={user?.email || ''}
                disabled
              />
              <div className="flex items-end">
                <Button type="submit" variant="primary" size="md" disabled={savingProfile}>
                  Sauvegarder le profil
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
              Mot de passe
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handlePasswordSave}>
              <input
                type="password"
                placeholder="Mot de passe actuel"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />
              <div className="md:col-span-2">
                <Button type="submit" variant="outline" size="md" disabled={savingPassword}>
                  Mettre à jour le mot de passe
                </Button>
              </div>
            </form>
          </div>

          {(message || error) && (
            <div className={`rounded-lg p-3 ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {error || message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

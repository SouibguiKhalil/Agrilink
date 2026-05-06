import React, { useEffect, useState } from 'react';
import { BuyerSidebar } from '../components/BuyerSidebar';
import { buyersApi, type BuyerAddress } from '../api/buyers';
import { Button } from '../components/Button';
import { MapPin, Trash2, Edit2, Save } from 'lucide-react';

const emptyAddress: BuyerAddress = {
  _id: '',
  label: '',
  street: '',
  city: '',
  region: '',
  postalCode: '',
  country: '',
  isDefault: false,
};

export const BuyerAddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<BuyerAddress[]>([]);
  const [form, setForm] = useState<BuyerAddress>(emptyAddress);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await buyersApi.getAddresses();
      setAddresses(data || []);
      if (!selectedAddressId && data && data.length > 0) {
        setSelectedAddressId(data[0]._id || 'default');
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger vos adresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => setForm(emptyAddress);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form._id) {
        const updated = await buyersApi.updateAddress(form._id, {
          label: form.label,
          street: form.street,
          city: form.city,
          region: form.region,
          postalCode: form.postalCode,
          country: form.country,
          isDefault: form.isDefault,
        });
        setAddresses((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
        setSelectedAddressId(updated._id || 'default');
      } else {
        const { _id, ...payload } = form;
        const created = await buyersApi.addAddress({
          ...payload,
        });
        setAddresses((prev) => [created, ...prev]);
        setSelectedAddressId(created._id || 'default');
      }
      resetForm();
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Enregistrement impossible. Vérifiez les champs.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (addr: BuyerAddress) => {
    setForm(addr);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await buyersApi.deleteAddress(id);
      setAddresses([]);
      setSelectedAddressId(null);
    } catch (err) {
      console.error(err);
      setError('Suppression impossible.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <BuyerSidebar />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <h1 className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
            Mes adresses
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              {form._id ? 'Modifier une adresse' : 'Ajouter une adresse'}
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Label (maison, bureau...)"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.label || ''}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
              <input
                type="text"
                placeholder="Rue"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.street || ''}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
              <input
                type="text"
                placeholder="Ville"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.city || ''}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Région"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.region || ''}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
              <input
                type="text"
                placeholder="Code postal"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.postalCode || ''}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              />
              <input
                type="text"
                placeholder="Pays"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={form.country || ''}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={!!form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                />
                Adresse par défaut
              </label>
              <div className="flex gap-3 mt-2">
                <Button type="submit" variant="primary" size="sm" disabled={saving}>
                  {form._id ? (
                    <>
                      <Save className="w-4 h-4" />
                      Mettre à jour
                    </>
                  ) : (
                    'Ajouter'
                  )}
                </Button>
                {form._id && (
                  <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                    Annuler
                  </Button>
                )}
              </div>
            </form>
            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
          </div>

          <div className="space-y-3">
            {loading && (
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-20 bg-white rounded-xl shadow-sm animate-pulse" />
                ))}
              </div>
            )}

            {!loading &&
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-start justify-between border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-[#F2E8CF] rounded-lg">
                      <MapPin className="w-5 h-5 text-[#386641]" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">
                        {addr.label || 'Adresse'}
                        {addr.isDefault && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#F2E8CF] text-[#386641]">
                            Par défaut
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-700">
                        {[addr.street, addr.postalCode, addr.city, addr.region, addr.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                      onClick={() => handleEdit(addr)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(addr._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

            {!loading && addresses.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 text-gray-600">
                Aucune adresse enregistrée.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

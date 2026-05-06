import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Store, Tractor } from 'lucide-react';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { useAccount } from '../hooks/useAccount';
import { buyersApi, type BuyerAddress } from '../api/buyers';
import { ordersApi } from '../api/orders';

const deliveryOptions = [
  { key: 'domicile', label: 'À domicile', icon: Home },
  { key: 'point-relais', label: 'Point relais', icon: Store },
  { key: 'ferme', label: 'À la ferme', icon: Tractor },
];

export const DeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, selectedAddress, setSelectedAddress, deliveryMethod, setDeliveryMethod, subtotal, clearCart } = useCart();
  const { user } = useAccount();
  const [addresses, setAddresses] = useState<BuyerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BuyerAddress>({
    _id: '',
    label: '',
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    isDefault: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await buyersApi.getAddresses();
        const filled = data?.length ? data : [];
        setAddresses(filled);
        if (!selectedAddress) {
          const defaultAddr = filled.find((a) => a.isDefault) || filled[0];
          if (defaultAddr) setSelectedAddress(defaultAddr);
          else if (user?.address) setSelectedAddress(user.address);
        }
      } catch (err) {
        console.error(err);
        if (user?.address) {
          setSelectedAddress(user.address);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setSelectedAddress, selectedAddress, user?.address]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 mb-4">Votre panier est vide.</p>
          <Button variant="primary" onClick={() => navigate('/produits')}>Retour aux produits</Button>
        </div>
      </div>
    );
  }

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { _id, ...payload } = form;
      const created = await buyersApi.addAddress(payload);
      setAddresses((prev) => [created, ...prev]);
      setSelectedAddress(created);
      setForm({
        _id: '',
        label: '',
        street: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
        isDefault: false,
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Impossible d’enregistrer cette adresse.');
    } finally {
      setSaving(false);
    }
  };

  const handleValidateOrder = async () => {
    if (!deliveryMethod) {
      setError('Choisissez une méthode de livraison.');
      return;
    }
    if (!selectedAddress) {
      setError('Choisissez ou ajoutez une adresse.');
      return;
    }
    setSaving(true);
    try {
      const order = await ordersApi.create({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        subtotal,
        total: subtotal,
        deliveryAddress: selectedAddress,
        deliveryMethod,
      });
      clearCart();
      navigate(`/panier/confirmation/${order._id}`);
    } catch (err) {
      console.error(err);
      setError('Commande impossible pour le moment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-[#386641] text-2xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Livraison
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg text-[#386641] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Adresses
              </h3>

              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer ${
                        selectedAddress && (selectedAddress as any)._id === addr._id
                          ? 'border-[#386641] bg-[#F2E8CF]'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        className="mt-1"
                        checked={Boolean(selectedAddress && (selectedAddress as any)._id === addr._id)}
                        onChange={() => setSelectedAddress(addr)}
                      />
                      <div>
                        <p className="text-gray-900 font-medium">{addr.label || 'Adresse'}</p>
                        <p className="text-sm text-gray-700">
                          {[addr.street, addr.postalCode, addr.city, addr.region, addr.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg text-[#386641] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Ajouter une adresse
              </h3>
              <form className="space-y-2" onSubmit={handleSubmitAddress}>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Label (maison, bureau...)"
                  value={form.label || ''}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                />
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Rue"
                  value={form.street || ''}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ville"
                    value={form.city || ''}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                  <input
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Région"
                    value={form.region || ''}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Code postal"
                    value={form.postalCode || ''}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  />
                  <input
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Pays"
                    value={form.country || ''}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  />
                </div>
                <Button type="submit" variant="primary" size="sm" disabled={saving}>
                  Sauvegarder l’adresse
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Méthode de livraison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deliveryOptions.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setDeliveryMethod(key)}
                className={`border rounded-lg p-4 flex items-center gap-3 text-left ${
                  deliveryMethod === key ? 'border-[#386641] bg-[#F2E8CF]' : 'border-gray-200'
                }`}
              >
                <Icon className="w-5 h-5 text-[#386641]" />
                <span className="text-gray-800">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/panier')}>Retour au panier</Button>
          <Button variant="primary" onClick={handleValidateOrder} disabled={saving}>
            Valider la commande
          </Button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { AccountSidebar } from '../components/AccountSidebar';
import { Button } from '../components/Button';
import { useAccount, type AccountUser } from '../hooks/useAccount';
import { productsApi, type Product, type ProductPayload } from '../api/products';

type ProductFormState = ProductPayload & {
  imageUrl?: string;
  badgesText?: string;
};

const emptyForm: ProductFormState = {
  name: '',
  description: '',
  category: '',
  price: 0,
  unit: '',
  stock: 0,
  images: [],
  badges: [],
  imageUrl: '',
  badgesText: '',
};

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiOrigin = apiBase.replace(/\/api\/?$/, '');
const defaultPlaceholder =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="%23f2f2f2"/><text x="50%" y="50%" font-size="16" font-family="Arial" fill="%23868686" text-anchor="middle" alignment-baseline="middle">Image produit</text></svg>';

const resolveImageUrl = (raw?: string) => {
  if (!raw) return defaultPlaceholder;
  if (raw.startsWith('http')) return raw;
  if (raw.startsWith('/uploads')) return `${apiOrigin}${raw}`;
  return raw;
};

export const ProducerProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: loadingUser, error: accountError } = useAccount();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);

  const producerId = useMemo(() => (user as AccountUser | null)?.producer?._id, [user]);

  useEffect(() => {
    if (!loadingUser && (!user || user.role !== 'producer')) {
      navigate('/login');
    }
  }, [user, loadingUser, navigate]);

  const loadProducts = async () => {
    if (!producerId) return;
    try {
      setLoading(true);
      const data = await productsApi.getByProducer(producerId);
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger vos produits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (producerId) {
      loadProducts();
    }
  }, [producerId]);

  const openModal = (product?: Product) => {
    if (product) {
      setSelectedProductId(product._id);
      setForm({
        name: product.name,
        description: product.description || '',
        category: product.category,
        price: product.price,
        unit: product.unit,
        stock: product.stock ?? 0,
        images: product.images || [],
        badges: product.badges || [],
        imageUrl: product.images?.[0] || '',
        badgesText: (product.badges || []).join(', '),
      });
    } else {
      setSelectedProductId(null);
      setForm(emptyForm);
      setFile(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(emptyForm);
    setFile(null);
    setSelectedProductId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!producerId) return;

    try {
      setIsSubmitting(true);

      let imageUrl = form.imageUrl?.trim();

      if (file) {
        imageUrl = await productsApi.uploadProductImage(file);
      }

      const payload: ProductPayload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: form.price,
        unit: form.unit,
        stock: form.stock,
        images: imageUrl ? [imageUrl] : [],
        imageUrl,
        badges: (form.badgesText || '')
          .split(',')
          .map((b) => b.trim())
          .filter(Boolean),
      };

      if (selectedProductId) {
        await productsApi.updateProduct(selectedProductId, payload);
      } else {
        await productsApi.createProduct(payload);
      }

      await loadProducts();
      closeModal();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la sauvegarde du produit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await productsApi.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      console.error(err);
      setError('Impossible de supprimer ce produit.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountSidebar
            activeKey="producer-products"
            user={user as any}
            loading={loadingUser}
            error={accountError}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Mon compte · Producteur</p>
              <h1 className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                Mes produits
              </h1>
            </div>
            <Button variant="primary" onClick={() => openModal()}>
              <Plus className="w-4 h-4" />
              Ajouter un produit
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-[#386641] animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-gray-700 mb-3">Vous n'avez pas encore ajouté de produits.</p>
              <Button variant="primary" onClick={() => openModal()}>
                Ajouter mon premier produit
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(product => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={resolveImageUrl(product.images?.[0])}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = defaultPlaceholder;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() => openModal(product)}
                        aria-label="Modifier"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() => handleDelete(product._id)}
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                    <span>Prix: {product.price.toFixed(2)} DT / {product.unit}</span>
                    <span>Stock: {product.stock ?? 0}</span>
                    <span>Statut: {product.isActive !== false ? 'Actif' : 'Inactif'}</span>
                    <span>Badges: {(product.badges || []).join(', ') || '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#386641]">
                {selectedProductId ? 'Modifier le produit' : 'Ajouter un produit'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                Fermer
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nom</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Catégorie</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Prix</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleNumberChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Unité</label>
                  <input
                    type="text"
                    name="unit"
                    value={form.unit}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="kg, pièce..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleNumberChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">URL de l'image</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Upload image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Badges (séparés par des virgules)</label>
                <input
                  type="text"
                  name="badgesText"
                  value={form.badgesText}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="bio, local, saisonnier..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProducerProductsPage;

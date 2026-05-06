import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { productsApi, type Product } from '../api/products';
import { resolveUploadUrl } from '../utils/images';
import { useCart } from '../context/CartContext';

const PAGE_SIZE = 9;
const placeholderImage = 'https://via.placeholder.com/400x400?text=Produit';

export const ProductsPage: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  const loadProducts = useCallback(
    async (options?: { search?: string; category?: string; labels?: string[]; page?: number }) => {
      setLoading(true);
      try {
        const data = await productsApi.getProducts({
          search: options?.search,
          category: options?.category,
          labels: options?.labels,
          page: options?.page,
          limit: PAGE_SIZE,
        });
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les produits.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      loadProducts({
        search: searchTerm.trim(),
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        labels: selectedLabels,
        page: currentPage,
      });
    }, 300);
    return () => clearTimeout(handle);
  }, [currentPage, loadProducts, searchTerm, selectedCategory, selectedLabels]);

  const categories = useMemo(() => {
    const base = new Set<string>();
    products.forEach((p) => p.category && base.add(p.category));
    return ['Tous les produits', ...Array.from(base)];
  }, [products]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.images?.[0] || product.imageUrl,
        producerId: product.producer?._id,
        producerName: product.producer?.name,
      },
      1
    );
  };

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paginated = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-[#386641] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Nos produits
          </h1>
          <p className="text-gray-600">
            {loading ? 'Chargement...' : `Découvrez ${products.length} produits frais et locaux`}
          </p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Filtres
              </h3>

              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-3">Recherche</h4>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Chercher un produit..."
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-3">Catégories</h4>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === (index === 0 ? 'all' : category)}
                        onChange={() => {
                          setSelectedCategory(index === 0 ? 'all' : category);
                          setCurrentPage(1);
                        }}
                        className="text-[#386641]"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-3">Labels</h4>
                <div className="space-y-2">
                  {['bio', 'local', 'saisonnier', 'promo'].map((label, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLabels.includes(label)}
                        onChange={() => toggleLabel(label)}
                        className="text-[#386641] rounded"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLabels([]);
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </aside>

          <main className="flex-1">
            <div className="lg:hidden mb-6">
              <Button variant="ghost" size="md" onClick={() => setFilterOpen(true)} className="w-full">
                <SlidersHorizontal className="w-5 h-5" />
                Filtres
              </Button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                {loading ? 'Chargement...' : `${products.length} produits trouvés`}
              </p>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" disabled>
                <option>Trier par : Pertinence</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    image={resolveUploadUrl(product.images?.[0] || product.imageUrl) || placeholderImage}
                    name={product.name}
                    price={product.price}
                    unit={product.unit}
                    producer={product.producer?.name || 'Producteur'}
                    badges={(product.badges || []) as any}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Précédent
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 rounded-lg border ${
                    page === currentPage
                      ? 'bg-[#386641] text-white border-[#386641]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Suivant
              </Button>
            </div>
          </main>
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                Filtres
              </h3>
              <button onClick={() => setFilterOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-3">Recherche</h4>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Chercher un produit..."
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-3">Catégories</h4>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category-mobile"
                        checked={selectedCategory === (index === 0 ? 'all' : category)}
                        onChange={() => {
                          setSelectedCategory(index === 0 ? 'all' : category);
                          setCurrentPage(1);
                        }}
                        className="text-[#386641]"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm text-gray-600 mb-3">Labels</h4>
                <div className="space-y-2">
                  {['bio', 'local', 'saisonnier', 'promo'].map((label, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLabels.includes(label)}
                        onChange={() => toggleLabel(label)}
                        className="text-[#386641] rounded"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <Button variant="primary" size="md" className="w-full" onClick={() => setFilterOpen(false)}>
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { producersApi, type ProducerProfile } from '../api/producers';
import { productsApi, type Product } from '../api/products';
import { ProductCard } from '../components/ProductCard';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiOrigin = apiBase.replace(/\/api\/?$/, '');
const fallbackProductImage = 'https://via.placeholder.com/400x400?text=Produit';

const resolveImage = (image?: string | null) => {
  if (!image) return fallbackProductImage;
  const normalized = image.startsWith('http')
    ? image
    : image.startsWith('/')
      ? image
      : `/${image}`;
  if (normalized.startsWith('/uploads')) return `${apiOrigin}${normalized}`;
  return normalized;
};

const sanitizeBadges = (badges?: string[]) =>
  (badges || []).filter((b): b is 'bio' | 'local' | 'saisonnier' | 'promo' =>
    ['bio', 'local', 'saisonnier', 'promo'].includes(b)
  );

export const ProducerStorePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [producer, setProducer] = useState<ProducerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const producerData = await producersApi.getById(id);
        setProducer(producerData.producer);

        const productsList =
          (producerData.products && producerData.products.length > 0
            ? producerData.products
            : await productsApi.getByProducer(id)) || [];

        setProducts(productsList);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger la boutique du producteur.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const producerLocation = producer?.location?.city || producer?.city || 'Localisation non renseignée';

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F2E8CF] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/producteurs" className="text-sm text-[#386641] hover:underline inline-flex items-center gap-2">
            ← Retour aux producteurs
          </Link>

          <div className="mt-6 grid gap-6 md:grid-cols-[1fr]">
            <div className="flex flex-col gap-3">
              <h1 className="text-[#386641] text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
                {producer?.name || 'Boutique producteur'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-gray-700">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#6A994E]" />
                  {producerLocation}
                </span>
                {producer?.categories?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {producer.categories.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-white text-[#386641] border border-[#386641]/20 text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {producer?.description && (
                <p className="text-gray-700 max-w-3xl">{producer.description}</p>
              )}
              {producer?._id && (
                <Link
                  to={`/producteur/${producer._id}`}
                  className="inline-flex text-sm text-[#386641] hover:underline mt-2"
                >
                  Voir la fiche producteur
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[#386641] text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
              Produits de la boutique
            </h2>
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {error && !loading && <p className="text-red-600">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="text-gray-600">Aucun produit disponible pour ce producteur pour le moment.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  image={resolveImage(product.images?.[0] || product.imageUrl)}
                  name={product.name}
                  price={product.price}
                  unit={product.unit}
                  producer={producer?.name || 'Producteur'}
                  badges={sanitizeBadges(product.badges)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

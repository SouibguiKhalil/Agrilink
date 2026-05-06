import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Award } from 'lucide-react';
import { producersApi, type ProducerProfileWithProducts } from '../api/producers';
import { productsApi, type Product } from '../api/products';
import { ProductCard } from '../components/ProductCard';
import { resolveUploadUrl } from '../utils/images';

const placeholderImage = 'https://via.placeholder.com/600x400?text=Producteur';

export const ProducerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProducerProfileWithProducts | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const producerData = await producersApi.getById(id);
        setData(producerData);

        if (producerData.products?.length) {
          setProducts(producerData.products);
        } else {
          const fetched = await productsApi.getProducts({ producerId: id });
          setProducts(fetched);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le producteur.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const producer = data?.producer;
  const image = resolveUploadUrl(producer?.imageUrl || (producer as any)?.image) || placeholderImage;
  const badges = (producer?.badges || []).filter(Boolean);
  const address = [producer?.location?.city || producer?.city, producer?.location?.region || producer?.region]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F2E8CF] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/producteurs" className="text-sm text-[#386641] hover:underline inline-flex items-center gap-2">
            ← Retour aux producteurs
          </Link>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1">
              <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                <img src={image} alt={producer?.name} className="w-full h-64 object-cover" />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-3">
              <h1 className="text-3xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                {producer?.name}
              </h1>
              {producer?.description && <p className="text-gray-700">{producer.description}</p>}
              {address && (
                <p className="inline-flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-[#6A994E]" />
                  {address}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {producer?.phone && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border text-sm">
                    <Phone className="w-4 h-4 text-[#6A994E]" /> {producer.phone}
                  </span>
                )}
                {producer?.email && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border text-sm">
                    <Mail className="w-4 h-4 text-[#6A994E]" /> {producer.email}
                  </span>
                )}
              </div>
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border text-sm text-[#386641]">
                      <Award className="w-4 h-4" /> {b}
                    </span>
                  ))}
                </div>
              )}
              {producer?.categories?.length ? (
                <div className="flex flex-wrap gap-2">
                  {producer.categories.map((cat, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-white text-[#386641] border border-[#386641]/20 text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              ) : null}
              {producer?._id && (
                <div className="pt-4">
                  <Link
                    to={`/producteur/${producer._id}/boutique`}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-[#386641] text-white hover:bg-[#6A994E] transition"
                  >
                    Voir la boutique
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-[#386641] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Produits de ce producteur
          </h2>
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
                  image={resolveUploadUrl(product.images?.[0] || product.imageUrl) || placeholderImage}
                  name={product.name}
                  price={product.price}
                  unit={product.unit}
                  producer={producer?.name || 'Producteur'}
                  badges={(product.badges || []) as any}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

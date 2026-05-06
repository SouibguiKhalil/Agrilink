import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Minus, Plus, ShoppingCart, Heart, Share2, Truck, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { productsApi, type Product } from '../api/products';
import { favoritesApi } from '../api/favorites';
import { useCart } from '../context/CartContext';
import { resolveUploadUrl } from '../utils/images';

const placeholderImage = 'https://via.placeholder.com/400x400?text=Produit';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteAdded, setFavoriteAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await productsApi.getProductById(id);
        setProduct(data);
        setError(null);

        if (data?.category) {
          const rel = await productsApi.getProducts({ category: data.category, limit: 6 });
          setRelated(rel.filter((p) => p._id !== data._id));
        } else {
          setRelated([]);
        }
      } catch (err) {
        console.error(err);
        setError('Impossible de charger ce produit.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const images: string[] = useMemo(() => {
    const list = product?.images?.length ? product.images : product?.imageUrl ? [product.imageUrl] : [];
    if (!list || list.length === 0) return [];
    return list
      .map((img) => resolveUploadUrl(img) || '')
      .filter((img) => img.length > 0);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
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
      quantity
    );
    navigate('/panier');
  };

  const handleAddFavorite = async () => {
    if (!id) return;
    setFavoriteLoading(true);
    try {
      await favoritesApi.addFavorite(id);
      setFavoriteAdded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-6 w-1/3 bg-gray-200 animate-pulse mb-6 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="h-[500px] bg-gray-100 rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Produit introuvable'}</p>
          <Link to="/produits" className="text-[#386641] underline">
            Retourner aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-[#6A994E]">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/produits" className="hover:text-[#6A994E]">Produits</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <ImageWithFallback
                src={images[selectedImage] || placeholderImage}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-[#386641]' : 'border-transparent'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {(product.badges || []).map((badge, index) => (
                <Badge key={index} type={badge as any} />
              ))}
            </div>

            <h1 className="text-[#386641] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                {product.price.toFixed(2)} DT
              </span>
              <span className="text-lg text-gray-600">/ {product.unit}</span>
            </div>

            <p className="text-gray-700 mb-6">
              {product.description || 'Produit disponible auprès de nos producteurs locaux.'}
            </p>

            <Link
              to={product.producer?._id ? `/producteur/${product.producer._id}` : '#'}
              className="block bg-[#F2E8CF] rounded-xl p-4 mb-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#386641] font-semibold">
                  {product.producer?.name?.[0] || 'P'}
                </div>
                <div>
                  <h4 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {product.producer?.name || 'Producteur'}
                  </h4>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{product.producer?.city || product.producer?.region || 'Local'}</span>
                  </div>
                  {product.producer?._id && (
                    <Link
                      to={`/producteur/${product.producer._id}/boutique`}
                      className="text-sm text-[#386641] underline mt-1 inline-block"
                    >
                      Voir la boutique
                    </Link>
                  )}
                </div>
              </div>
            </Link>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-green-800">
                En stock : {product.stock ?? '—'}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">Quantité</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-x border-gray-300 py-3"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-gray-600">
                  Total : {(product.price * quantity).toFixed(2)} DT
                </span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Button variant="primary" size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier
              </Button>
              <button
                className={`p-4 border border-gray-300 rounded-lg hover:bg-gray-50 ${favoriteAdded ? 'text-[#BC4749]' : ''}`}
                disabled={favoriteLoading || !id}
                onClick={handleAddFavorite}
              >
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#6A994E] mt-0.5" />
                <div>
                  <p className="text-gray-900">Livraison possible selon le producteur</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#6A994E] mt-0.5" />
                <div>
                  <p className="text-gray-900">Délais communiqués après commande</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[#386641] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Autres produits similaires
          </h2>
          {related.length === 0 ? (
            <p className="text-gray-600">Aucun autre produit pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  image={resolveUploadUrl(p.images?.[0] || p.imageUrl) || placeholderImage}
                  name={p.name}
                  price={p.price}
                  unit={p.unit}
                  producer={p.producer?.name || 'Producteur'}
                  badges={(p.badges || []) as any}
                  onAddToCart={() =>
                    addToCart({
                      productId: p._id,
                      name: p.name,
                      price: p.price,
                      unit: p.unit,
                      image: p.images?.[0] || p.imageUrl,
                      producerId: p.producer?._id,
                      producerName: p.producer?.name,
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

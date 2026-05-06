import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { BuyerSidebar } from '../components/BuyerSidebar';
import { favoritesApi, type FavoriteItem } from '../api/favorites';
import { resolveUploadUrl } from '../utils/images';
import { Button } from '../components/Button';

export const BuyerFavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await favoritesApi.getFavorites();
      setFavorites(data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger vos favoris.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await favoritesApi.removeFavorite(id);
      setFavorites((prev) => prev.filter((fav) => fav._id !== id));
    } catch (err) {
      console.error(err);
      setError('Suppression impossible. Réessayez.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <BuyerSidebar />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
              Mes favoris
            </h1>
            <Button variant="outline" size="sm" onClick={load}>Actualiser</Button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 bg-white rounded-xl shadow-sm animate-pulse" />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-red-100 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && favorites.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-600">
              Aucun favori pour le moment.
            </div>
          )}

          {!loading && !error && favorites.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav) => {
                const image = resolveUploadUrl(fav.images?.[0] || (fav as any).imageUrl);
                return (
                  <div key={fav._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                    <div className="relative h-44 bg-gray-100">
                      {image ? (
                        <img src={image} alt={fav.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Image</div>
                      )}
                      <button
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:text-red-500"
                        onClick={() => handleRemove(fav._id)}
                        aria-label="Retirer des favoris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-2">
                      <h3 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {fav.name}
                      </h3>
                      <p className="text-lg text-[#386641] font-semibold">
                        {fav.price?.toFixed(2)} DT <span className="text-sm text-gray-500">/ {fav.unit}</span>
                      </p>
                      {fav.producer?.name && (
                        <p className="text-sm text-gray-600">par {fav.producer.name}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <Link to={`/produit/${fav._id}`} className="text-[#386641] hover:underline text-sm inline-flex items-center gap-1">
                          Voir le produit
                        </Link>
                        <div className="inline-flex items-center gap-1 text-sm text-[#BC4749]">
                          <Heart className="w-4 h-4" />
                          <span>Favori</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

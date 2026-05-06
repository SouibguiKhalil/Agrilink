import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Package, ShoppingBag, MapPin, BadgeCheck, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '../components/Button';
import { AccountSidebar } from '../components/AccountSidebar';
import { useProducerDashboard } from '../hooks/useProducerDashboard';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  helper?: string;
  icon: React.ReactNode;
}> = ({ title, value, helper, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-600">{title}</h3>
      <div className="p-2 bg-[#F2E8CF] rounded-lg">{icon}</div>
    </div>
    <p className="text-3xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
      {value}
    </p>
    {helper && <p className="text-sm text-gray-600 mt-1">{helper}</p>}
  </div>
);

export const ProducerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    profile,
    products,
    orders,
    loading,
    error,
    refreshProfile,
  } = useProducerDashboard();

  const isLoadingMain = loading.user || loading.profile;

  const activeProductsCount = products.filter(p => p.isActive !== false).length;
  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(order =>
    ['pending', 'processing', 'en_cours'].includes(order.status as string)
  ).length;

  if (error.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg w-full space-y-3">
          <p className="text-lg font-semibold text-[#386641]">Accès réservé</p>
          <p className="text-sm text-gray-600">{error.user}</p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={refreshProfile}>
              Réessayer
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountSidebar
            activeKey="producer-profile"
            user={user as any}
            loading={loading.user}
            error={error.user}
            onSelect={(key) => {
              if (key === 'producer-products') navigate('/account/producer/products');
              if (key === 'producer-settings') navigate('/account/producer/settings');
              if (key === 'producer-profile') navigate('/account/producer/profile');
            }}
          />
        </div>

        <div className="lg:col-span-3">
          {isLoadingMain || !profile ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-[#386641] animate-spin mb-3" />
              <p className="text-sm text-gray-600">Chargement du tableau de bord producteur...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm text-gray-500">Mon profil</p>
                  <h1
                    className="text-2xl md:text-3xl text-[#386641] mb-1"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {profile.name}
                  </h1>
                  <p className="text-gray-600">
                    {profile.location?.city || profile.location?.region
                      ? [profile.location?.city, profile.location?.region].filter(Boolean).join(', ')
                      : 'Localisation non renseignée'}
                  </p>
                  {user && (
                    <p className="text-sm text-gray-500 mt-1">
                      {user.email} · Producteur
                    </p>
                  )}
                  {profile.description && (
                    <p className="text-sm text-gray-700 mt-3">{profile.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.badges?.map(badge => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-[#F2E8CF] text-[#386641]"
                    >
                      <BadgeCheck className="w-3 h-3" />
                      {badge}
                    </span>
                  ))}
                  <Button variant="outline" onClick={() => navigate('/account/producer/settings')}>
                    Mettre à jour
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  title="Ventes totales"
                  value={`${totalSales.toFixed(2)} DT`}
                  helper="Depuis le début"
                  icon={<TrendingUp className="w-5 h-5 text-[#386641]" />}
                />
                <StatCard
                  title="Commandes"
                  value={orders.length}
                  helper={`${pendingOrders} en attente`}
                  icon={<ShoppingBag className="w-5 h-5 text-[#386641]" />}
                />
                <StatCard
                  title="Produits actifs"
                  value={activeProductsCount}
                  helper={`sur ${products.length} produits`}
                  icon={<Package className="w-5 h-5 text-[#386641]" />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Produits
                      </h2>
                      <p className="text-sm text-gray-600">Vos produits disponibles</p>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/account/producer/products')}>
                      Gérer mes produits
                    </Button>
                  </div>

                  {loading.products && products.length === 0 ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-10 bg-gray-100 rounded" />
                      <div className="h-10 bg-gray-100 rounded" />
                      <div className="h-10 bg-gray-100 rounded" />
                    </div>
                  ) : products.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucun produit pour l’instant.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm text-gray-600">Produit</th>
                            <th className="text-left py-3 px-4 text-sm text-gray-600">Prix</th>
                            <th className="text-left py-3 px-4 text-sm text-gray-600">Stock</th>
                            <th className="text-left py-3 px-4 text-sm text-gray-600">Statut</th>
                            <th className="text-left py-3 px-4 text-sm text-gray-600">Ventes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.slice(0, 5).map(product => (
                            <tr key={product._id} className="border-b hover:bg-gray-50">
                              <td className="py-4 px-4 text-gray-900">{product.name}</td>
                              <td className="py-4 px-4 text-gray-900">
                                {product.price.toFixed(2)} DT{product.unit ? ` / ${product.unit}` : ''}
                              </td>
                              <td className="py-4 px-4">
                                <span className={product.stock === 0 ? 'text-red-600' : 'text-gray-900'}>
                                  {product.stock ?? 0} {product.unit ?? ''}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs ${
                                    product.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {product.isActive !== false ? 'Actif' : 'Inactif'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-900">{product.totalSales ?? 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {error.products && (
                    <p className="mt-3 text-sm text-red-600">{error.products}</p>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Commandes récentes
                      </h2>
                      <p className="text-sm text-gray-600">Les dernières commandes reçues</p>
                    </div>
                    <MapPin className="w-5 h-5 text-[#386641]" />
                  </div>

                  {loading.orders && orders.length === 0 ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-16 bg-gray-100 rounded" />
                      <div className="h-16 bg-gray-100 rounded" />
                    </div>
                  ) : orders.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucune commande pour le moment.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map(order => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-500">
                                {format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: fr })}
                              </p>
                              <p className="text-[#386641] font-semibold">
                                Commande #{order._id.slice(-6).toUpperCase()}
                              </p>
                              {order.customerName && (
                                <p className="text-sm text-gray-600">Client : {order.customerName}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {order.items?.length || 0} article(s)
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${
                                order.status === 'delivered' || order.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t mt-3">
                            <span className="text-lg text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                              {order.total.toFixed(2)} DT
                            </span>
                            <Button variant="ghost" size="sm">
                              Voir détails
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {error.orders && (
                    <p className="mt-3 text-sm text-red-600">{error.orders}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboardPage;

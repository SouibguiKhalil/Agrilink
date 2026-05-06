import React, { useState } from 'react';
import { TrendingUp, Package, ShoppingBag, Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '../components/Button';
import { useProducerDashboard } from '../hooks/useProducerDashboard';
import { AccountSidebar, type AccountSidebarSectionKey } from '../components/AccountSidebar';

const AccountProducerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'produits' | 'commandes' | 'profil'>('produits');
  const { user, profile, products, orders, loading, error } = useProducerDashboard();

  const isLoadingMain = loading.user || loading.profile;

  const mapTabToSidebarKey = (tab: 'produits' | 'commandes' | 'profil'): AccountSidebarSectionKey => {
    switch (tab) {
      case 'produits':
        return 'producer-products';
      case 'commandes':
        return 'producer-orders';
      case 'profil':
      default:
        return 'producer-profile';
    }
  };

  const handleSidebarSelect = (key: AccountSidebarSectionKey) => {
    if (key === 'producer-products') {
      setActiveTab('produits');
    } else if (key === 'producer-orders') {
      setActiveTab('commandes');
    } else if (key === 'producer-profile') {
      setActiveTab('profil');
    }
  };

  if (error.user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-5 rounded-lg">
            <p className="font-semibold mb-1">Accès réservé aux producteurs</p>
            <p className="text-sm">{error.user}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingMain || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order =>
    ['pending', 'processing', 'en_cours'].includes(order.status as string)
  ).length;
  const activeProductsCount = products.filter(p => p.isActive !== false).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountSidebar
              activeKey={mapTabToSidebarKey(activeTab)}
              onSelect={handleSidebarSelect}
            />
          </div>

          <div className="lg:col-span-3">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className="text-[#386641] mb-1 text-2xl md:text-3xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {profile.name || 'Mon exploitation'}
            </h1>
            <p className="text-gray-600">
              {profile.city || profile.region
                ? [profile.city, profile.region].filter(Boolean).join(', ')
                : 'Producteur local'}
            </p>
            {user && (
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.badges?.map(badge => (
              <span
                key={badge}
                className="px-3 py-1 rounded-full text-xs bg-[#F2E8CF] text-[#386641]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Ventes totales</h3>
              <div className="p-2 bg-[#F2E8CF] rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#386641]" />
              </div>
            </div>
            <p
              className="text-3xl text-[#386641]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {totalSales.toFixed(2)} DT
            </p>
            <p className="text-sm text-gray-600 mt-1">Depuis le début</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Commandes</h3>
              <div className="p-2 bg-[#F2E8CF] rounded-lg">
                <ShoppingBag className="w-5 h-5 text-[#386641]" />
              </div>
            </div>
            <p
              className="text-3xl text-[#386641]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {totalOrders}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {pendingOrders} en attente
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Produits actifs</h3>
              <div className="p-2 bg-[#F2E8CF] rounded-lg">
                <Package className="w-5 h-5 text-[#386641]" />
              </div>
            </div>
            <p
              className="text-3xl text-[#386641]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {activeProductsCount}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              sur {products.length} produits
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b px-6">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('produits')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'produits'
                    ? 'border-[#386641] text-[#386641]'
                    : 'border-transparent text-gray-600 hover:text-[#386641]'
                }`}
              >
                Mes produits
              </button>
              <button
                onClick={() => setActiveTab('commandes')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'commandes'
                    ? 'border-[#386641] text-[#386641]'
                    : 'border-transparent text-gray-600 hover:text-[#386641]'
                }`}
              >
                Mes commandes
              </button>
              <button
                onClick={() => setActiveTab('profil')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'profil'
                    ? 'border-[#386641] text-[#386641]'
                    : 'border-transparent text-gray-600 hover:text-[#386641]'
                }`}
              >
                Mon profil
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'produits' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-[#386641]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Mes produits
                  </h2>
                  <Button variant="primary" size="md">
                    <Plus className="w-5 h-5" />
                    Ajouter un produit
                  </Button>
                </div>

                {loading.products && products.length === 0 ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-10 bg-gray-100 rounded" />
                    <div className="h-10 bg-gray-100 rounded" />
                    <div className="h-10 bg-gray-100 rounded" />
                  </div>
                ) : products.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Vous n'avez pas encore ajouté de produits.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Produit</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Prix</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Stock</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Statut</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product._id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                                <span className="text-gray-900">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-900">
                              {product.price.toFixed(2)} DT{product.unit ? ` / ${product.unit}` : ''}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={
                                  product.stock === 0
                                    ? 'text-red-600'
                                    : 'text-gray-900'
                                }
                              >
                                {product.stock ?? 0} {product.unit ?? ''}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  product.isActive !== false
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {product.isActive !== false ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded">
                                  <Edit className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded">
                                  {product.isActive !== false ? (
                                    <EyeOff className="w-4 h-4 text-gray-600" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-gray-600" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {error.products && (
                  <p className="mt-4 text-sm text-red-600">{error.products}</p>
                )}
              </div>
            )}

            {activeTab === 'commandes' && (
              <div>
                <h2
                  className="text-[#386641] mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Mes commandes
                </h2>

                {loading.orders && orders.length === 0 ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-20 bg-gray-100 rounded" />
                    <div className="h-20 bg-gray-100 rounded" />
                  </div>
                ) : error.orders ? (
                  <p className="text-sm text-red-600">{error.orders}</p>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Vous n'avez pas encore reçu de commandes.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3
                              className="text-[#386641] mb-1"
                              style={{ fontFamily: 'var(--font-heading)' }}
                            >
                              Commande #{order._id.slice(-6).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {format(new Date(order.createdAt), 'dd MMMM yyyy', {
                                locale: fr,
                              })}
                              {order.items?.length
                                ? ` • ${order.items.length} article(s)`
                                : ''}
                            </p>
                            {order.customerName && (
                              <p className="text-sm text-gray-600 mt-1">
                                Client : {order.customerName}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              order.status === 'delivered' ||
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t">
                          <span
                            className="text-lg text-[#386641]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
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
              </div>
            )}

            {activeTab === 'profil' && (
              <div>
                <h2
                  className="text-[#386641] mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Profil de la ferme
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Nom de la ferme
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Ville</label>
                    <input
                      type="text"
                      value={profile.city || ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Région</label>
                    <input
                      type="text"
                      value={profile.region || ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={profile.description || ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                {user && (
                  <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Email du compte
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProducerPage;

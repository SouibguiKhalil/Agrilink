import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, ShoppingBag } from 'lucide-react';
import { ordersApi, type Order } from '../api/orders';
import { useAccount } from '../hooks/useAccount';
import { AccountSidebar } from '../components/AccountSidebar';

export const ProducerOrdersPage: React.FC = () => {
  const { user, loading: loadingUser, error: userError } = useAccount();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const producerId = (user as any)?.producer?._id;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await ordersApi.getProducerOrders();
        setOrders(data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger vos commandes.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!producerId) return [];
    return orders.map((order) => {
      const filteredItems = order.items.filter((item: any) => {
        const prod = item.product?.producer || item.producer;
        if (!prod) return false;
        return prod._id ? prod._id === producerId : prod.toString() === producerId;
      });
      const totalForProducer = filteredItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      );
      return { ...order, items: filteredItems, total: totalForProducer };
    }).filter((order) => order.items.length > 0);
  }, [orders, producerId]);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#F2E8CF] border-t-[#386641] rounded-full animate-spin" />
        <p className="text-sm text-gray-600">Chargement de votre compte...</p>
      </div>
    );
  }

  if (userError || !producerId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-sm p-6 space-y-4">
          <p className="text-lg font-semibold text-[#386641]">Connexion requise</p>
          <p className="text-sm text-gray-600">{userError || 'Profil producteur introuvable'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountSidebar activeKey="producer-orders" user={user as any} loading={loadingUser} error={userError} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
              Commandes
            </h1>
          </div>

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-xl shadow-sm animate-pulse" />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-red-100 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && filteredOrders.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-600">
              Aucune commande pour le moment.
            </div>
          )}

          {!loading && !error && filteredOrders.length > 0 && (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F2E8CF] flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-[#386641]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Commande</p>
                        <p className="text-gray-900 font-medium">
                          {order.orderNumber || order._id}
                        </p>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {order.buyer?.email && (
                          <p className="text-xs text-gray-500">Acheteur : {order.buyer.name || order.buyer.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#F2E8CF] text-[#386641] text-sm">
                        {order.status}
                      </span>
                      <p className="text-lg text-[#386641] font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {order.total.toFixed(2)} DT
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                        <div>
                          <p className="text-gray-900">{(item as any).name || item.product?.name}</p>
                          <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                        </div>
                        <p className="text-[#386641] font-semibold">
                          {((item.price || 0) * (item.quantity || 0)).toFixed(2)} DT
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

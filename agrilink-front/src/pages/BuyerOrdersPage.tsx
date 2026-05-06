import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ShoppingBag, ChevronRight } from 'lucide-react';
import { BuyerSidebar } from '../components/BuyerSidebar';
import { Button } from '../components/Button';
import { ordersApi, type Order } from '../api/orders';
import { resolveUploadUrl } from '../utils/images';

export const BuyerOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await ordersApi.getMyOrders();
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

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('fr-FR') : '';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <BuyerSidebar />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
              Mes commandes
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

          {!loading && !error && orders.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-600">
              Aucune commande pour le moment.
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
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
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
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
                    {order.items.slice(0, 3).map((item, idx) => {
                      const image = resolveUploadUrl(
                        (item.product as any)?.images?.[0] || (item.product as any)?.imageUrl
                      );
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {image ? (
                              <img src={image} alt={(item.product as any).name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-900">{(item.product as any).name}</p>
                            <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/mon-compte/commandes/${order._id}`)}>
                      Détails
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => navigate('/produits')}>
                      Recommander
                    </Button>
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

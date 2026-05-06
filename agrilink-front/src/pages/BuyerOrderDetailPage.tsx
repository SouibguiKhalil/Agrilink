import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { BuyerSidebar } from '../components/BuyerSidebar';
import { ordersApi, type Order } from '../api/orders';
import { resolveUploadUrl } from '../utils/images';

export const BuyerOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await ordersApi.getById(id);
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le détail de la commande.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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
            <div className="flex items-center gap-3">
              <Link to="/mon-compte/commandes" className="text-[#386641] hover:underline inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Link>
            </div>
          </div>

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-xl shadow-sm animate-pulse" />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-red-100 text-red-700">
              {error}
            </div>
          )}

          {order && !loading && !error && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Commande</p>
                  <p className="text-xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {order.orderNumber || order._id}
                  </p>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(order.createdAt)}</span>
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

              <div className="space-y-4">
                {order.items.map((item, idx) => {
                  const product: any = item.product;
                  const image = resolveUploadUrl(product?.images?.[0] || product?.imageUrl);
                  return (
                    <div key={idx} className="flex items-center gap-4 border border-gray-100 rounded-lg p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        {image ? (
                          <img src={image} alt={product?.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{product?.name}</p>
                        <p className="text-sm text-gray-500">
                          Qté: {item.quantity} · {(item.price ?? 0).toFixed(2)} DT / {product?.unit || 'u'}
                        </p>
                      </div>
                      <p className="text-[#386641] font-semibold">
                        {(item.price * item.quantity).toFixed(2)} DT
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

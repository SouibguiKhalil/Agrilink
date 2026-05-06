import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, MapPin } from 'lucide-react';
import { ordersApi, type Order } from '../api/orders';
import { resolveUploadUrl } from '../utils/images';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const orderId = id || new URLSearchParams(location.search).get('orderId') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Aucune commande à afficher.');
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const data = await ordersApi.getById(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger la confirmation de commande.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F2E8CF] border-t-[#386641] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-600">{error || 'Commande introuvable.'}</p>
          <Link to="/produits" className="text-[#386641] underline">Retour aux produits</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-[#386641]" />
          <div>
            <p className="text-sm text-gray-600">Commande confirmée</p>
            <h1 className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
              N° {order.orderNumber || order._id}
            </h1>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-700">Total payé : <strong>{order.total.toFixed(2)} DT</strong></p>
          <p className="text-gray-700">Statut : <span className="px-2 py-1 rounded-full bg-[#F2E8CF] text-[#386641] text-sm">{order.status}</span></p>
          <p className="text-sm text-gray-500">Date : {new Date(order.createdAt).toLocaleString('fr-FR')}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
            Articles
          </h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => {
              const product: any = item.product;
              const image = resolveUploadUrl(product?.images?.[0] || product?.imageUrl);
              return (
                <div key={idx} className="flex items-center gap-4 border border-gray-100 rounded-lg p-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    {image ? (
                      <img src={image} alt={product?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{product?.name}</p>
                    <p className="text-sm text-gray-600">Qté: {item.quantity}</p>
                    {product?.producer?.name && (
                      <p className="text-xs text-gray-500">Producteur: {product.producer.name}</p>
                    )}
                  </div>
                  <p className="text-[#386641] font-semibold">
                    {(item.price * item.quantity).toFixed(2)} DT
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {order && (
          <div className="space-y-2">
            <h3 className="text-lg text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
              Livraison
            </h3>
            {order as any && (order as any).address ? (
              <p className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-4 h-4 mt-1 text-[#386641]" />
                <span>
                  {[
                    (order as any).address?.street,
                    (order as any).address?.postalCode,
                    (order as any).address?.city,
                    (order as any).address?.region,
                    (order as any).address?.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </p>
            ) : (
              <p className="text-gray-600">Adresse non renseignée.</p>
            )}
            {(order as any).deliveryMethod && (
              <p className="text-gray-700">Méthode : {(order as any).deliveryMethod}</p>
            )}
          </div>
        )}

        <div className="pt-4 flex gap-3">
          <Link to="/produits" className="text-[#386641] underline">Continuer mes achats</Link>
        </div>
      </div>
    </div>
  );
};

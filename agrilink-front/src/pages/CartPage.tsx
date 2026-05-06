import React from 'react';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { resolveUploadUrl } from '../utils/images';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  const handleQuantityChange = (id: string, value: number) => {
    if (value < 1) return;
    updateQuantity(id, value);
  };

  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-[#386641] mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
            Mon panier
          </h1>
          <div className="bg-white rounded-xl p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-[#386641] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Votre panier est vide
            </h3>
            <p className="text-gray-600 mb-6">Découvrez nos produits frais et locaux</p>
            <Button variant="primary" size="md" onClick={() => navigate('/produits')}>
              Parcourir les produits
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-[#386641] mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Mon panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#386641] text-white flex items-center justify-center text-sm">
                    1
                  </div>
                  <span className="text-[#386641]">Panier</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm">
                    2
                  </div>
                  <span className="text-gray-500">Livraison</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm">
                    3
                  </div>
                  <span className="text-gray-500">Confirmation</span>
                </div>
              </div>
            </div>

            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <ImageWithFallback
                      src={resolveUploadUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-[#386641] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">{item.producerName || 'Producteur'}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border-x border-gray-300 py-2"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {item.price.toFixed(2)} DT / {item.unit}
                        </p>
                        <p className="text-xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {(item.price * item.quantity).toFixed(2)} DT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <Button variant="ghost" size="md" className="flex-1" onClick={() => navigate('/produits')}>
                Continuer mes achats
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-[#386641] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Récapitulatif
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total ({totalItems} articles)</span>
                  <span>{subtotal.toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Livraison</span>
                  <span className="text-[#6A994E]">Gratuite</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg">Total</span>
                <span className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {total.toFixed(2)} DT
                </span>
              </div>

              <Button variant="primary" size="lg" className="w-full mb-4" onClick={() => navigate('/panier/livraison')}>
                Valider la commande
                <ArrowRight className="w-5 h-5" />
              </Button>

              <div className="bg-[#F2E8CF] rounded-lg p-4">
                <h4 className="text-sm text-[#386641] mb-2">Mode de retrait</h4>
                <p className="text-sm text-gray-700">
                  Vous pourrez choisir votre mode de retrait à l'étape suivante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

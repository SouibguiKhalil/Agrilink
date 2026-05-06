import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { AccountSidebar, type AccountSidebarSectionKey } from '../components/AccountSidebar';

export const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'commandes' | 'favoris' | 'profil' | 'adresses' | 'parametres'>('commandes');

  const orders = [
    {
      id: '12345',
      date: '15 novembre 2025',
      status: 'Livrée',
      total: 28.50,
      items: 3,
      producer: 'Ferme Ben Ahmed',
      image: 'https://images.unsplash.com/photo-1560433802-62c9db426a4d?w=100'
    },
    {
      id: '12344',
      date: '8 novembre 2025',
      status: 'En préparation',
      total: 45.00,
      items: 5,
      producer: 'Laiterie Sahel',
      image: 'https://images.unsplash.com/photo-1635714293982-65445548ac42?w=100'
    }
  ];

  const favorites = [
    {
      image: 'https://images.unsplash.com/photo-1560433802-62c9db426a4d?w=200',
      name: 'Tomates bio de saison',
      producer: 'Ferme Ben Ahmed',
      price: 3.50
    },
    {
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200',
      name: 'Huile d\'olive extra vierge',
      producer: 'Coopérative El Oued',
      price: 25.00
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <AccountSidebar
              activeKey={
                activeTab === 'commandes'
                  ? 'buyer-orders'
                  : activeTab === 'favoris'
                  ? 'buyer-favorites'
                  : activeTab === 'profil'
                  ? 'buyer-profile'
                  : activeTab === 'adresses'
                  ? 'buyer-addresses'
                  : 'buyer-settings'
              }
              onSelect={(key: AccountSidebarSectionKey) => {
                if (key === 'buyer-orders') setActiveTab('commandes');
                else if (key === 'buyer-favorites') setActiveTab('favoris');
                else if (key === 'buyer-profile') setActiveTab('profil');
                else if (key === 'buyer-addresses') setActiveTab('adresses');
                else if (key === 'buyer-settings') setActiveTab('parametres');
              }}
            />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {activeTab === 'commandes' && (
              <div>
                <h2 className="text-[#386641] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  Mes commandes
                </h2>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                              Commande #{order.id}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              order.status === 'Livrée' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{order.date} • {order.items} articles</p>
                        </div>
                        <p className="text-xl text-[#386641] mt-2 md:mt-0" style={{ fontFamily: 'var(--font-heading)' }}>
                          {order.total.toFixed(2)} DT
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                        <ImageWithFallback
                          src={order.image}
                          alt={order.producer}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{order.producer}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Détails
                          </Button>
                          {order.status === 'Livrée' && (
                            <Button variant="primary" size="sm">
                              Recommander
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favoris' && (
              <div>
                <h2 className="text-[#386641] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  Mes favoris
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm group">
                      <div className="relative h-48">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-[#386641] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{item.producer}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                            {item.price.toFixed(2)} DT
                          </span>
                          <Button variant="primary" size="sm">
                            Ajouter au panier
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profil' && (
              <div>
                <h2 className="text-[#386641] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  Mon profil
                </h2>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Prénom</label>
                      <input
                        type="text"
                        defaultValue="Leila"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#386641]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Nom</label>
                      <input
                        type="text"
                        defaultValue="Mansour"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#386641]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="leila.mansour@email.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#386641]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        defaultValue="+216 20 123 456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#386641]"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button variant="primary" size="md">
                      Enregistrer les modifications
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'adresses' && (
              <div>
                <h2 className="text-[#386641] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  Mes adresses
                </h2>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-[#6A994E]">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Domicile
                      </h3>
                      <span className="px-3 py-1 bg-[#6A994E] text-white rounded-full text-xs">
                        Par défaut
                      </span>
                    </div>
                    <p className="text-gray-700">
                      12 Avenue Habib Bourguiba<br />
                      Tunis 1000<br />
                      Tunisie
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                      <Button variant="ghost" size="sm">
                        Supprimer
                      </Button>
                    </div>
                  </div>

                  <Button variant="primary" size="md">
                    Ajouter une adresse
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>    </div>
  );
};

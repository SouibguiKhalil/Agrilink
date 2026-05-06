import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, MapPin } from 'lucide-react';
import { useAccount } from '../hooks/useAccount';
import { resolveUploadUrl } from '../utils/images';

type MenuItem = {
  key: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to: string;
};

const menu: MenuItem[] = [
  { key: 'profile', label: 'Mon profil', icon: User, to: '/mon-compte' },
  { key: 'orders', label: 'Mes commandes', icon: ShoppingBag, to: '/mon-compte/commandes' },
  { key: 'favorites', label: 'Mes favoris', icon: Heart, to: '/mon-compte/favoris' },
  { key: 'addresses', label: 'Mes adresses', icon: MapPin, to: '/mon-compte/adresses' },
  { key: 'settings', label: 'Paramètres', icon: Settings, to: '/mon-compte/parametres' },
];

export const BuyerSidebar: React.FC = () => {
  const { user, loading, error } = useAccount();
  const location = useLocation();
  const [avatarError, setAvatarError] = useState(false);

  const fullImage = resolveUploadUrl(user?.imageUrl);

  useEffect(() => {
    setAvatarError(false);
  }, [fullImage]);

  return (
    <aside className="bg-white rounded-xl p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="flex flex-col items-center mb-4">
          {fullImage && !avatarError ? (
            <img
              src={fullImage}
              alt="Photo de profil"
              className="w-24 h-24 rounded-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#F2E8CF] flex items-center justify-center">
              <User className="w-12 h-12 text-[#386641]" />
            </div>
          )}
        </div>
        {loading ? (
          <>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto animate-pulse" />
          </>
        ) : (
          <>
            <h3 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
              {user?.name || user?.email || 'Mon compte'}
            </h3>
            {user?.email && <p className="text-sm text-gray-600">{user.email}</p>}
          </>
        )}
        {error && !loading && (
          <p className="text-xs text-red-600 mt-2">{error}</p>
        )}
      </div>

      <nav className="space-y-2">
        {menu.map(({ key, label, icon: Icon, to }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={key}
              to={to}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-[#F2E8CF] text-[#386641]' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

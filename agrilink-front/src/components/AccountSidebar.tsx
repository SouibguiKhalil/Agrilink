import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ShoppingBag, Settings, MapPin, Package, Heart } from 'lucide-react';
import { useAccount } from '../hooks/useAccount';
import type { AuthUser } from '../api/auth';

export type AccountSidebarSectionKey =
  | 'buyer-orders'
  | 'buyer-favorites'
  | 'buyer-profile'
  | 'buyer-addresses'
  | 'buyer-settings'
  | 'producer-products'
  | 'producer-orders'
  | 'producer-favorites'
  | 'producer-settings'
  | 'producer-profile';

export interface AccountSidebarProps {
  activeKey?: AccountSidebarSectionKey;
  onSelect?: (key: AccountSidebarSectionKey) => void;
  user?: AuthUser | null;
  loading?: boolean;
  error?: string | null;
}

type SidebarMenuItem = {
  key: AccountSidebarSectionKey;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to?: string;
};

const getMenuItems = (role?: AuthUser['role']): SidebarMenuItem[] => {
  if (role === 'producer') {
    return [
      { key: 'producer-products', label: 'Mes produits', icon: Package, to: '/account/producer/products' },
      { key: 'producer-orders', label: 'Commandes', icon: ShoppingBag, to: '/producteur/commandes' },
      { key: 'producer-settings', label: 'Parametres', icon: Settings, to: '/account/producer/settings' },
    ];
  }

  return [
    { key: 'buyer-orders', label: 'Mes commandes', icon: ShoppingBag },
    { key: 'buyer-favorites', label: 'Mes favoris', icon: Heart },
    { key: 'buyer-profile', label: 'Mon profil', icon: User },
    { key: 'buyer-addresses', label: 'Mes adresses', icon: MapPin },
    { key: 'buyer-settings', label: 'Parametres', icon: Settings },
  ];
};

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeKey,
  onSelect,
  user: providedUser,
  loading: externalLoading,
  error: externalError,
}) => {
  const [avatarError, setAvatarError] = useState(false);
  const { user: fetchedUser, loading: hookLoading, error: hookError } = useAccount({
    autoFetch: true,
  });
  const location = useLocation();

  const user = fetchedUser ?? providedUser;
  const isLoading = externalLoading ?? hookLoading;
  const error = externalError ?? hookError;

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.email ||
    'Mon compte';

  const menuItems = getMenuItems(user?.role);
  const currentPath = location.pathname;
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
  const producerImage =
    (user as any)?.producer?.imageUrl ?? (fetchedUser as any)?.producer?.imageUrl;
  const fullImageUrl = producerImage
    ? producerImage.startsWith('/uploads')
      ? `${baseUrl}${producerImage}`
      : producerImage
    : undefined;

  useEffect(() => {
    setAvatarError(false);
  }, [fullImageUrl]);

  return (
    <aside className="bg-white rounded-xl p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="flex flex-col items-center mb-4">
          {fullImageUrl && !avatarError ? (
            <img
              src={fullImageUrl}
              alt="Photo du producteur"
              className="w-24 h-24 rounded-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#F2E8CF] flex items-center justify-center">
              <User className="w-12 h-12 text-[#386641]" />
            </div>
          )}
        </div>
        {isLoading ? (
          <>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto animate-pulse" />
          </>
        ) : (
          <>
            <h3 className="text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
              {displayName}
            </h3>
            {user?.email && <p className="text-sm text-gray-600">{user.email}</p>}
            {user?.role && (
              <p className="mt-1 text-xs inline-flex px-2 py-1 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wide">
                {user.role === 'buyer' && 'Acheteur'}
                {user.role === 'producer' && 'Producteur'}
                {user.role === 'admin' && 'Admin'}
                {!['buyer', 'producer', 'admin'].includes(String(user.role)) && user.role}
              </p>
            )}
          </>
        )}
      </div>

      {error && !isLoading && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <nav className="space-y-2">
        {menuItems.map(({ key, label, icon: Icon, to }) => {
          const isActive = activeKey === key || (to && currentPath === to);

          if (to) {
            return (
              <Link
                key={key}
                to={to}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive ? 'bg-[#F2E8CF] text-[#386641]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          }

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect && onSelect(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                isActive ? 'bg-[#F2E8CF] text-[#386641]' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

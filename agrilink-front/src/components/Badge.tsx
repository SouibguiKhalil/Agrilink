import React from 'react';

interface BadgeProps {
  type: 'bio' | 'local' | 'saisonnier' | 'promo';
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ type, children }) => {
  const styles = {
    bio: 'bg-[#6A994E] text-white',
    local: 'bg-[#A7C957] text-[#386641]',
    saisonnier: 'bg-[#F2E8CF] text-[#386641] border border-[#A7C957]',
    promo: 'bg-[#BC4749] text-white'
  };

  const labels = {
    bio: '🌿 Bio',
    local: '📍 Local',
    saisonnier: '🌱 Saisonnier',
    promo: '🔥 Promo'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${styles[type]}`}>
      {children || labels[type]}
    </span>
  );
};

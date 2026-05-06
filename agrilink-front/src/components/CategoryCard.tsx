import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CategoryCardProps {
  icon: string;
  name: string;
  count?: number;
  image?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ icon, name, count, image }) => {
  const link = `/produits?category=${encodeURIComponent(name)}`;
  return (
    <a 
      href={link}
      className="group relative bg-[#F2E8CF] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {image ? (
        <div className="relative h-48">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              {name}
            </h3>
            {count && (
              <p className="text-sm text-white/90">{count} produits</p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center h-48 flex flex-col items-center justify-center">
          <div className="text-5xl mb-3">{icon}</div>
          <h3 className="text-[#386641] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {name}
          </h3>
          {count && (
            <p className="text-sm text-gray-600">{count} produits</p>
          )}
        </div>
      )}
    </a>
  );
};

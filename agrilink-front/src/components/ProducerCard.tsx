import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

type BadgeType = 'bio' | 'local' | 'saisonnier' | 'promo';

interface ProducerCardProps {
  id?: string;
  href?: string;
  storeHref?: string;
  image: string;
  name: string;
  location?: string;
  categories: string[];
  badges?: Array<BadgeType | string>;
}

export const ProducerCard: React.FC<ProducerCardProps> = ({
  id,
  href,
  storeHref,
  image,
  name,
  location = '',
  categories,
  badges = []
}) => {
  const detailLink = href ?? (id ? `/producteur/${id}` : '/producteurs');
  const storeLink = storeHref ?? (id ? `/producteur/${id}/boutique` : '/producteurs');
  const validBadges = badges.filter((badge): badge is BadgeType =>
    ['bio', 'local', 'saisonnier', 'promo'].includes(badge as BadgeType)
  );

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <Link to={detailLink}>
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {validBadges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {validBadges.map((badge, index) => (
                <Badge key={index} type={badge} />
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={detailLink}>
          <h3 className="text-[#386641] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 text-[#6A994E]" />
          <span>{location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {categories.filter(Boolean).map((category, index) => (
            <span 
              key={index}
              className="px-2.5 py-1 bg-[#F2E8CF] text-[#386641] rounded-full text-xs"
            >
              {category}
            </span>
          ))}
        </div>

        <Link to={storeLink} className="flex items-center gap-2 text-[#6A994E] text-sm group-hover:gap-3 transition-all">
          <span>Voir la boutique</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

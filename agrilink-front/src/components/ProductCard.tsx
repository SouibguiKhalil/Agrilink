import React from 'react';
import { MapPin, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { Button } from './Button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  id?: string;
  image: string;
  name: string;
  price: number;
  unit: string;
  producer: string;
  distance?: string;
  badges?: Array<'bio' | 'local' | 'saisonnier' | 'promo'>;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  name,
  price,
  unit,
  producer,
  distance,
  badges = [],
  onAddToCart
}) => {
  const detailLink = id ? `/produit/${id}` : undefined;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {detailLink ? (
          <Link to={detailLink}>
            <ImageWithFallback
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        ) : (
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} type={badge} />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        {detailLink ? (
          <Link to={detailLink}>
            <h3 className="text-[#386641] mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {name}
            </h3>
          </Link>
        ) : (
          <h3 className="text-[#386641] mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {name}
          </h3>
        )}
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl text-[#386641]" style={{ fontFamily: 'var(--font-heading)' }}>
            {price.toFixed(2)} DT
          </span>
          <span className="text-sm text-gray-500">/ {unit}</span>
        </div>

        <div className="mb-3 text-sm text-gray-600">
          <p className="mb-1">{producer}</p>
          {distance && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{distance}</span>
            </div>
          )}
        </div>

        <Button 
          variant="primary" 
          size="sm" 
          className="w-full"
          onClick={onAddToCart}
        >
          <ShoppingCart className="w-4 h-4" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
};

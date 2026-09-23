import React, { useState } from 'react';
import { Property } from '../../types/realEstate';
import { useCms } from '../../context/CmsContext';
import { Heart, Scale, Bed, Bath, Maximize2, MapPin, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const { navigate, isFavorite, toggleFavorite, isInCompare, addToCompare, removeFromCompare } = useCms();
  const [imageError, setImageError] = useState(false);

  const favorited = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const formatPrice = (price: number, status: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
    return status === 'For Rent' ? `${formatted}/mo` : formatted;
  };

  const handleCardClick = () => {
    navigate({ name: 'property-detail', slug: property.slug });
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const statusBadgeBg = {
    'For Sale': 'bg-[#0F2433] text-white',
    'For Rent': 'bg-[#667C70] text-white',
    'Sold': 'bg-slate-700 text-white',
    'Pending': 'bg-[#C8A46B] text-[#0F2433]',
  }[property.status];

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-lg overflow-hidden border border-[#E5E7E8] hover:border-[#C8A46B]/40 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Visual Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {!imageError ? (
          <img
            src={property.mainImage}
            alt={property.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0F2433] to-[#1E3A5F] text-white p-6 text-center">
            <span className="font-brand-mark text-lg text-[#C8A46B] mb-1">PREMIER</span>
            <span className="text-xs text-white/70 font-sans">{property.title}</span>
          </div>
        )}

        {/* Top Floating Status & Category Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span
            className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded shadow-sm ${statusBadgeBg}`}
          >
            {property.status}
          </span>
          {property.featured && (
            <span className="bg-white/95 text-[#0F2433] text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded shadow-sm border border-[#E5E7E8]">
              Featured
            </span>
          )}
        </div>

        {/* Top Right Quick Actions: Favorite & Compare */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleCompareClick}
            aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
            className={`p-2 rounded-full transition-all backdrop-blur-md cursor-pointer ${
              inCompare
                ? 'bg-[#C8A46B] text-[#0F2433] shadow-md'
                : 'bg-black/30 hover:bg-black/60 text-white'
            }`}
            title="Compare Property"
          >
            <Scale className="w-4 h-4" />
          </button>
          <button
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
            className={`p-2 rounded-full transition-all backdrop-blur-md cursor-pointer ${
              favorited
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-black/30 hover:bg-black/60 text-white'
            }`}
            title="Save Property"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Property Type Badge at bottom left of image */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] font-medium tracking-wide bg-black/60 text-white/95 backdrop-blur-md px-2 py-0.5 rounded">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="space-y-2">
          {/* Price */}
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-bold font-sans tracking-tight text-[#0F2433] group-hover:text-[#C8A46B] transition-colors">
              {formatPrice(property.price, property.status)}
            </span>
            <span className="text-[11px] font-mono text-[#667078] tracking-wider">
              {property.propertyId}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-[#0F2433] line-clamp-1 leading-snug">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#667078]">
            <MapPin className="w-3.5 h-3.5 text-[#C8A46B] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Architectural Specs (Beds | Baths | Sq Ft) */}
        <div className="pt-4 mt-4 border-t border-[#E5E7E8]">
          <div className="flex items-center justify-between text-xs text-[#667078] tabular-nums font-medium">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-[#0F2433]" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-[#0F2433]" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#0F2433]" />
              <span>{property.propertySize.toLocaleString()} Sq Ft</span>
            </div>
          </div>

          {/* Card Footer Action */}
          {!compact && (
            <div className="mt-4 pt-3 flex items-center justify-between">
              <span className="text-xs text-[#667078] font-medium">
                {property.neighborhood}
              </span>
              <span className="text-xs font-semibold text-[#0F2433] group-hover:text-[#C8A46B] inline-flex items-center gap-1 transition-colors">
                View Property <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

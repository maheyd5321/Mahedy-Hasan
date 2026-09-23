import React from 'react';
import { useCms } from '../context/CmsContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { SeoHead } from '../components/seo/SeoHead';
import { Heart, ArrowRight, Trash2, ShieldCheck, Share2 } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { favorites, properties, toggleFavorite, navigate } = useCms();

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Saved Estates & Favorites | PREMIER Real Estate"
        description="Your saved luxury residences, penthouses, and private compounds."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7E8] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
              <Heart className="w-3.5 h-3.5 fill-[#C8A46B]" />
              <span>Private Client Registry</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
              My Saved Residences
            </h1>
            <p className="text-xs text-[#667078] mt-1">
              You have {favoriteProperties.length} saved property dossier{favoriteProperties.length === 1 ? '' : 's'}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ name: 'properties' })}
              className="px-4 py-2 bg-[#0F2433] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#1E3A5F] transition-colors cursor-pointer"
            >
              Browse More Listings
            </button>
          </div>
        </div>

        {favoriteProperties.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-[#E5E7E8] text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#0F2433]">No Saved Properties Yet</h3>
            <p className="text-xs text-[#667078] leading-relaxed">
              Tap the heart icon on any property card or detail dossier to bookmark and compare
              exclusive architectural residences.
            </p>
            <button
              onClick={() => navigate({ name: 'properties' })}
              className="bg-[#C8A46B] hover:bg-[#b8955b] text-[#0F2433] text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded shadow cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useCms } from '../context/CmsContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { SeoHead } from '../components/seo/SeoHead';
import { MapPin, TrendingUp, Home, CheckCircle2, ArrowRight } from 'lucide-react';

export const LocationDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const { locations, properties, navigate } = useCms();

  const location = locations.find((l) => l.slug.toLowerCase() === slug.toLowerCase()) || locations[0];
  const locationProperties = properties.filter(
    (p) => p.city.toLowerCase() === location.city.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#F8F6F1] pb-20">
      <SeoHead locationGuide={location} />

      {/* Hero Banner with Scrim */}
      <section className="relative h-[420px] bg-[#0F2433] text-white flex items-center overflow-hidden">
        <img
          src={location.heroImage}
          alt={location.title}
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2433] via-[#0F2433]/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#C8A46B]/20 border border-[#C8A46B]/40 text-[#C8A46B] text-xs font-bold tracking-widest uppercase">
            <MapPin className="w-3.5 h-3.5" />
            <span>Prime Real Estate Market</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">
            {location.title}
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed">
            {location.description}
          </p>
        </div>
      </section>

      {/* Market Metrics Strip */}
      <section className="bg-white border-b border-[#E5E7E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <div>
              <span className="text-[#667078] font-bold uppercase tracking-wider block">
                Average Market Price
              </span>
              <div className="text-2xl font-bold text-[#0F2433] mt-1 font-sans">
                ${(location.avgPrice / 1000000).toFixed(2)}M
              </div>
            </div>
            <div>
              <span className="text-[#667078] font-bold uppercase tracking-wider block">
                Active Listings
              </span>
              <div className="text-2xl font-bold text-[#0F2433] mt-1 font-sans">
                {locationProperties.length} Properties
              </div>
            </div>
            <div>
              <span className="text-[#667078] font-bold uppercase tracking-wider block">
                Popular Architecture
              </span>
              <div className="text-sm font-semibold text-[#0F2433] mt-1">
                {location.popularTypes.join(' · ')}
              </div>
            </div>
            <div>
              <span className="text-[#667078] font-bold uppercase tracking-wider block">
                State & Jurisdiction
              </span>
              <div className="text-sm font-semibold text-[#0F2433] mt-1">
                {location.state}, {location.country}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {/* Lifestyle Highlights */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E7E8]">
          <h3 className="font-display text-xl font-bold text-[#0F2433] mb-4">
            Living in {location.city}: Distinctive Lifestyle Attributes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {location.lifestyleHighlights.map((hl, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-4 rounded-lg bg-[#F8F6F1] border border-[#E5E7E8]"
              >
                <CheckCircle2 className="w-5 h-5 text-[#C8A46B] shrink-0 mt-0.5" />
                <p className="text-xs text-[#283238] font-medium leading-relaxed">{hl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location Properties Repeater */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E7E8] pb-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
                Curated Inventory
              </span>
              <h2 className="font-display text-2xl font-bold text-[#0F2433]">
                Available Estates in {location.city} ({locationProperties.length})
              </h2>
            </div>
          </div>

          {locationProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locationProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-[#E5E7E8] space-y-4">
              <p className="text-sm text-[#667078]">
                Currently all residences in {location.city} are held in private off-market escrow.
              </p>
              <button
                onClick={() => navigate({ name: 'properties' })}
                className="px-5 py-2.5 bg-[#0F2433] text-white text-xs font-bold uppercase rounded"
              >
                View All Active Markets
              </button>
            </div>
          )}
        </div>

        {/* Explore Other Locations */}
        <div className="pt-8 border-t border-[#E5E7E8]">
          <h3 className="font-display text-xl font-bold text-[#0F2433] mb-6">
            Explore Other Premier Markets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {locations
              .filter((l) => l.slug !== location.slug)
              .map((otherLoc) => (
                <div
                  key={otherLoc.slug}
                  onClick={() => navigate({ name: 'location-detail', slug: otherLoc.slug })}
                  className="group p-5 bg-white rounded-lg border border-[#E5E7E8] hover:border-[#C8A46B] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-display font-bold text-base text-[#0F2433] group-hover:text-[#C8A46B] transition-colors">
                      {otherLoc.title}
                    </h4>
                    <span className="text-xs text-[#667078]">
                      Avg ${(otherLoc.avgPrice / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#0F2433] group-hover:text-[#C8A46B] group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

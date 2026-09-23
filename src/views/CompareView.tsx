import React from 'react';
import { useCms } from '../context/CmsContext';
import { SeoHead } from '../components/seo/SeoHead';
import {
  Scale,
  X,
  ArrowRight,
  Trash2,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Building,
  Check,
  Minus,
} from 'lucide-react';

export const CompareView: React.FC = () => {
  const { compareList, properties, removeFromCompare, clearCompare, navigate, openScheduleModal } =
    useCms();

  const compareProperties = properties.filter((p) => compareList.includes(p.id));

  const allAmenitiesToCompare = [
    'Pool',
    'Garage',
    'Garden',
    'Balcony',
    'Gym',
    'Air conditioning',
    'Furnished',
    'Wine Cellar',
    'Smart Home',
    'Waterfront',
    'Elevator',
    'Pet friendly',
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Compare Residences Side-by-Side | PREMIER Real Estate"
        description="Comprehensive architectural comparison of prices, square footage, amenities, and locations."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7E8] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
              <Scale className="w-3.5 h-3.5" />
              <span>Architectural Matrix</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
              Compare Properties
            </h1>
            <p className="text-xs text-[#667078] mt-1">
              Evaluating {compareProperties.length} of 3 maximum residences side by side.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {compareProperties.length > 0 && (
              <button
                onClick={clearCompare}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={() => navigate({ name: 'properties' })}
              className="px-4 py-2 bg-[#0F2433] text-white text-xs font-bold uppercase rounded hover:bg-[#1E3A5F] transition-colors"
            >
              Add More Properties
            </button>
          </div>
        </div>

        {compareProperties.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-[#E5E7E8] text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C8A46B] flex items-center justify-center mx-auto">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#0F2433]">No Properties Selected</h3>
            <p className="text-xs text-[#667078] leading-relaxed">
              Click the balance scale icon on any property card or detail page to compare up to 3
              estates side-by-side.
            </p>
            <button
              onClick={() => navigate({ name: 'properties' })}
              className="bg-[#C8A46B] hover:bg-[#b8955b] text-[#0F2433] text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded shadow cursor-pointer inline-flex items-center gap-2"
            >
              <span>Browse Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5E7E8] overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E7E8] bg-slate-50">
                  <th className="p-4 w-44 font-bold uppercase text-[#0F2433] tracking-wider">
                    Specification
                  </th>
                  {compareProperties.map((p) => (
                    <th key={p.id} className="p-4 min-w-[280px] align-top">
                      <div className="relative space-y-3">
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute top-0 right-0 p-1 rounded-full bg-slate-200 hover:bg-rose-100 hover:text-rose-600 text-slate-500 transition-colors"
                          title="Remove from compare"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="aspect-[16/10] w-full rounded overflow-hidden bg-slate-100">
                          <img
                            src={p.mainImage}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-[#C8A46B] uppercase tracking-wider">
                            {p.status} · {p.propertyType}
                          </span>
                          <h4
                            onClick={() => navigate({ name: 'property-detail', slug: p.slug })}
                            className="font-display font-bold text-sm text-[#0F2433] hover:text-[#C8A46B] transition-colors cursor-pointer line-clamp-1"
                          >
                            {p.title}
                          </h4>
                          <p className="text-xs text-[#667078]">{p.location}</p>
                          <div className="text-base font-bold text-[#0F2433] font-sans mt-1">
                            ${p.price.toLocaleString()}
                          </div>
                        </div>

                        <button
                          onClick={() => openScheduleModal(p)}
                          className="w-full bg-[#0F2433] text-white hover:bg-[#1E3A5F] py-1.5 rounded text-[11px] font-bold uppercase transition-colors"
                        >
                          Schedule Viewing
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7E8]">
                {/* Price / SqFt */}
                <tr>
                  <td className="p-4 font-bold text-[#0F2433] bg-slate-50/60">Price / Sq Ft</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-4 font-mono font-semibold text-[#0F2433]">
                      ${Math.round(p.price / p.propertySize).toLocaleString()} / sq ft
                    </td>
                  ))}
                </tr>

                {/* Bedrooms & Bathrooms */}
                <tr>
                  <td className="p-4 font-bold text-[#0F2433] bg-slate-50/60">Beds & Baths</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#283238]">
                      {p.bedrooms} Beds · {p.bathrooms} Baths
                    </td>
                  ))}
                </tr>

                {/* Interior Size */}
                <tr>
                  <td className="p-4 font-bold text-[#0F2433] bg-slate-50/60">Interior Size</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#283238] font-medium">
                      {p.propertySize.toLocaleString()} Sq Ft
                    </td>
                  ))}
                </tr>

                {/* Lot Size */}
                <tr>
                  <td className="p-4 font-bold text-[#0F2433] bg-slate-50/60">Lot Size</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#283238]">
                      {p.lotSize > 0 ? `${(p.lotSize / 43560).toFixed(2)} Acres` : 'Condo Unit'}
                    </td>
                  ))}
                </tr>

                {/* Year Built */}
                <tr>
                  <td className="p-4 font-bold text-[#0F2433] bg-slate-50/60">Year Built</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#283238]">
                      {p.yearBuilt}
                    </td>
                  ))}
                </tr>

                {/* Neighborhood & ZIP */}
                <tr>
                  <td className="p-4 font-bold text-[#0F2433] bg-slate-50/60">Neighborhood</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-4 text-[#283238]">
                      {p.neighborhood} ({p.zip})
                    </td>
                  ))}
                </tr>

                {/* Amenities Comparison */}
                {allAmenitiesToCompare.map((amenity) => (
                  <tr key={amenity}>
                    <td className="p-4 font-semibold text-[#667078] bg-slate-50/40">{amenity}</td>
                    {compareProperties.map((p) => {
                      const hasAmenity = p.amenities.some(
                        (a) => a.toLowerCase() === amenity.toLowerCase()
                      );
                      return (
                        <td key={p.id} className="p-4">
                          {hasAmenity ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <Check className="w-4 h-4 text-emerald-600" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-300">
                              <Minus className="w-4 h-4" /> None
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

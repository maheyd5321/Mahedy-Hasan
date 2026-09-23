import React, { useState, useMemo, useEffect } from 'react';
import { useCms } from '../context/CmsContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { SeoHead } from '../components/seo/SeoHead';
import { Property, PropertyStatus, PropertyType } from '../types/realEstate';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  LayoutGrid,
  MapPin,
  Map as MapIcon,
  ChevronDown,
  Building,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  Sparkles,
} from 'lucide-react';

export const PropertiesView: React.FC = () => {
  const { properties, currentRoute, navigate } = useCms();

  // Search filter states
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [city, setCity] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [bathrooms, setBathrooms] = useState<string>('all');
  const [minSqFt, setMinSqFt] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'featured' | 'size-desc'
  >('featured');

  // UI States
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'split-map'>('grid');
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  // Read initial route filters if passed from home hero or nav
  useEffect(() => {
    if (currentRoute.name === 'properties' && currentRoute.initialFilter) {
      if (currentRoute.initialFilter.status) {
        setStatus(currentRoute.initialFilter.status);
      }
      if (currentRoute.initialFilter.city) {
        setCity(currentRoute.initialFilter.city);
      }
      if (currentRoute.initialFilter.type) {
        setPropertyType(currentRoute.initialFilter.type);
      }
    }
  }, [currentRoute]);

  const allAmenities = [
    'Pool',
    'Garage',
    'Garden',
    'Balcony',
    'Parking',
    'Gym',
    'Air conditioning',
    'Furnished',
    'Pet friendly',
    'Wine Cellar',
    'Smart Home',
    'Waterfront',
    'Elevator',
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setQuery('');
    setStatus('all');
    setPropertyType('all');
    setCity('all');
    setMinPrice(0);
    setMaxPrice(10000000);
    setBedrooms('all');
    setBathrooms('all');
    setMinSqFt(0);
    setSelectedAmenities([]);
    setSortBy('featured');
  };

  // Extract unique cities from current properties collection
  const citiesList = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => set.add(p.city));
    return Array.from(set).sort();
  }, [properties]);

  // Combined multi-filter logic (replicating Wix Velo wix-data query)
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Query search
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchLoc = p.location.toLowerCase().includes(q);
          const matchZip = p.zip.toLowerCase().includes(q);
          const matchId = p.propertyId.toLowerCase().includes(q);
          const matchNeighborhood = p.neighborhood.toLowerCase().includes(q);
          if (!matchTitle && !matchLoc && !matchZip && !matchId && !matchNeighborhood) {
            return false;
          }
        }

        // Status
        if (status !== 'all' && p.status !== status) return false;

        // Property Type
        if (propertyType !== 'all' && p.propertyType !== propertyType) return false;

        // City
        if (city !== 'all' && p.city.toLowerCase() !== city.toLowerCase()) return false;

        // Price
        if (p.price < minPrice || p.price > maxPrice) return false;

        // Bedrooms
        if (bedrooms !== 'all') {
          const minBeds = parseInt(bedrooms, 10);
          if (p.bedrooms < minBeds) return false;
        }

        // Bathrooms
        if (bathrooms !== 'all') {
          const minBaths = parseFloat(bathrooms);
          if (p.bathrooms < minBaths) return false;
        }

        // SqFt
        if (minSqFt > 0 && p.propertySize < minSqFt) return false;

        // Amenities (all selected must be present)
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenity) =>
            p.amenities.some((a) => a.toLowerCase() === amenity.toLowerCase())
          );
          if (!hasAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        }
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'size-desc') {
          return b.propertySize - a.propertySize;
        }
        return 0;
      });
  }, [
    properties,
    query,
    status,
    propertyType,
    city,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minSqFt,
    selectedAmenities,
    sortBy,
  ]);

  const activeFilterCount =
    (status !== 'all' ? 1 : 0) +
    (propertyType !== 'all' ? 1 : 0) +
    (city !== 'all' ? 1 : 0) +
    (minPrice > 0 || maxPrice < 10000000 ? 1 : 0) +
    (bedrooms !== 'all' ? 1 : 0) +
    (bathrooms !== 'all' ? 1 : 0) +
    (minSqFt > 0 ? 1 : 0) +
    selectedAmenities.length;

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-8 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Luxury Real Estate Portfolio | All Properties"
        description="Filter and discover verified luxury properties, villas, and penthouses. Dynamic Wix CMS repeaters with real-time multi-filter queries."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7E8] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dynamic CMS Listings Portfolio</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
              Properties & Estates
            </h1>
            <p className="text-xs text-[#667078] mt-1">
              Showing{' '}
              <strong className="text-[#0F2433] font-semibold">{filteredProperties.length}</strong> of{' '}
              {properties.length} active residences in inventory
            </p>
          </div>

          {/* View Mode & Mobile Filter Trigger */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#0F2433] text-white px-4 py-2.5 rounded-md text-xs font-bold tracking-wider uppercase shadow cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#C8A46B]" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            {/* Grid vs Split Map Toggle */}
            <div className="flex items-center bg-white border border-[#E5E7E8] rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#0F2433] text-white' : 'text-slate-600 hover:text-[#0F2433]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('split-map')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'split-map'
                    ? 'bg-[#0F2433] text-white'
                    : 'text-slate-600 hover:text-[#0F2433]'
                }`}
                title="Map & List Split View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold bg-white border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] cursor-pointer"
              >
                <option value="featured">Most Featured</option>
                <option value="newest">Newest Listed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="size-desc">Largest Sq Ft</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Primary Filter Bar (Desktop) */}
        <div className="hidden lg:block bg-white rounded-lg border border-[#E5E7E8] p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-5 gap-4">
            {/* Search Query */}
            <div className="col-span-2 relative">
              <input
                type="text"
                placeholder="Search by neighborhood, city, address, or ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-xs border border-[#E5E7E8] rounded-md pl-9 pr-3 py-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status (For Sale / Rent / Sold / Pending) */}
            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs font-medium border border-[#E5E7E8] rounded-md px-3 py-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white cursor-pointer"
              >
                <option value="all">Status: All Statuses</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
                <option value="Pending">Pending Under Contract</option>
                <option value="Sold">Sold / Closed</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full text-xs font-medium border border-[#E5E7E8] rounded-md px-3 py-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white cursor-pointer"
              >
                <option value="all">Type: All Types</option>
                <option value="Villa">Modern Villa</option>
                <option value="Condo">Condo / Penthouse</option>
                <option value="House">Single Family House</option>
                <option value="Apartment">Luxury Apartment</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land / Acreage</option>
              </select>
            </div>

            {/* City */}
            <div>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs font-medium border border-[#E5E7E8] rounded-md px-3 py-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white cursor-pointer"
              >
                <option value="all">Location: All Markets</option>
                {citiesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Filter Line (Price, Beds, Baths, Reset) */}
          <div className="grid grid-cols-5 gap-4 pt-3 border-t border-[#E5E7E8] text-xs">
            {/* Price Max */}
            <div>
              <label className="block text-[10px] font-semibold text-[#667078] uppercase mb-1">
                Max Price
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white"
              >
                <option value={10000000}>No Max Price</option>
                <option value={1000000}>Up to $1,000,000</option>
                <option value={2000000}>Up to $2,000,000</option>
                <option value={3500000}>Up to $3,500,000</option>
                <option value={5000000}>Up to $5,000,000</option>
                <option value={7500000}>Up to $7,500,000</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-[10px] font-semibold text-[#667078] uppercase mb-1">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white"
              >
                <option value="all">Any Beds</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-[10px] font-semibold text-[#667078] uppercase mb-1">
                Bathrooms
              </label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white"
              >
                <option value="all">Any Baths</option>
                <option value="2">2+ Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
              </select>
            </div>

            {/* Min Sq Ft */}
            <div>
              <label className="block text-[10px] font-semibold text-[#667078] uppercase mb-1">
                Min Size
              </label>
              <select
                value={minSqFt}
                onChange={(e) => setMinSqFt(Number(e.target.value))}
                className="w-full border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white"
              >
                <option value={0}>Any Size</option>
                <option value={2000}>2,000+ Sq Ft</option>
                <option value={3500}>3,500+ Sq Ft</option>
                <option value={5000}>5,000+ Sq Ft</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full flex items-center justify-center gap-1.5 py-2 border border-[#E5E7E8] hover:border-slate-400 rounded-md text-slate-600 hover:text-[#0F2433] font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>
          </div>

          {/* Amenities checklist row */}
          <div className="pt-3 border-t border-[#E5E7E8]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667078] block mb-2">
              Filter by Amenities:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {allAmenities.map((amenity) => {
                const active = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer border ${
                      active
                        ? 'bg-[#0F2433] text-white border-[#0F2433]'
                        : 'bg-slate-50 hover:bg-slate-100 text-[#283238] border-[#E5E7E8]'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Filter Badges Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Applied Filters:</span>
            {status !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#E5E7E8] text-[#0F2433] px-2.5 py-1 rounded">
                Status: {status}
                <button onClick={() => setStatus('all')}>
                  <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                </button>
              </span>
            )}
            {propertyType !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#E5E7E8] text-[#0F2433] px-2.5 py-1 rounded">
                Type: {propertyType}
                <button onClick={() => setPropertyType('all')}>
                  <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                </button>
              </span>
            )}
            {city !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#E5E7E8] text-[#0F2433] px-2.5 py-1 rounded">
                City: {city}
                <button onClick={() => setCity('all')}>
                  <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                </button>
              </span>
            )}
            {selectedAmenities.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 bg-white border border-[#E5E7E8] text-[#0F2433] px-2.5 py-1 rounded"
              >
                {a}
                <button onClick={() => toggleAmenity(a)}>
                  <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-[#C8A46B] hover:underline font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Content View: Grid or Split Map */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E7E8] p-12 text-center space-y-4 max-w-lg mx-auto my-12">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#0F2433]">
              No Matching Residences Found
            </h3>
            <p className="text-xs text-[#667078] leading-relaxed">
              We couldn't find any properties matching your current criteria combination. Try
              loosening your price thresholds or removing specific amenity filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#0F2433] text-white text-xs font-bold tracking-wider uppercase rounded-md hover:bg-[#1E3A5F] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View (Dynamic CMS Repeaters) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          /* Split Map + List View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px]">
            {/* Left Property List (5 cols) */}
            <div className="lg:col-span-6 space-y-4 max-h-[850px] overflow-y-auto pr-2">
              {filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  onMouseEnter={() => setHoveredPropertyId(prop.id)}
                  onMouseLeave={() => setHoveredPropertyId(null)}
                >
                  <PropertyCard property={prop} compact />
                </div>
              ))}
            </div>

            {/* Right Interactive Visual Map (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900 rounded-xl overflow-hidden border border-[#E5E7E8] relative min-h-[500px] flex flex-col">
              {/* Map Simulator Canvas */}
              <div className="relative flex-1 w-full bg-[#1A2634] p-6 flex flex-col justify-between overflow-hidden">
                {/* Background Map Grid Graphic */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C8A46B_1px,transparent_1px)] [background-size:24px_24px]" />

                {/* Top Map Badge */}
                <div className="relative z-10 flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-2 rounded border border-white/10 text-white text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C8A46B]" />
                    <span>Interactive Real Estate GIS Map</span>
                  </div>
                  <span className="font-mono text-[#C8A46B] text-[11px]">
                    {filteredProperties.length} Geocoded Pins
                  </span>
                </div>

                {/* Interactive Property Pins scattered across territory */}
                <div className="relative z-10 flex-1 grid grid-cols-3 gap-6 items-center justify-center p-4">
                  {filteredProperties.slice(0, 9).map((prop, idx) => {
                    const isHovered = hoveredPropertyId === prop.id;
                    return (
                      <div
                        key={prop.id}
                        onClick={() => navigate({ name: 'property-detail', slug: prop.slug })}
                        onMouseEnter={() => setHoveredPropertyId(prop.id)}
                        className={`cursor-pointer transition-all duration-300 transform ${
                          isHovered ? 'scale-110 z-30' : 'hover:scale-105 z-10'
                        }`}
                      >
                        <div
                          className={`px-2.5 py-1 rounded shadow-xl text-center text-xs font-bold border transition-all ${
                            isHovered
                              ? 'bg-[#C8A46B] text-[#0F2433] border-white ring-4 ring-[#C8A46B]/40'
                              : 'bg-[#0F2433] text-white border-[#C8A46B]'
                          }`}
                        >
                          <p className="font-mono text-[11px]">
                            ${(prop.price / 1000).toFixed(0)}k
                          </p>
                          <p className="text-[9px] truncate max-w-[80px] opacity-80">{prop.city}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Map Bottom Legend */}
                <div className="relative z-10 bg-black/70 backdrop-blur-md p-3 rounded text-[11px] text-white/80 flex items-center justify-between border border-white/10">
                  <span>Hover or tap any price pin to preview estate profile</span>
                  <span className="text-[#C8A46B] font-semibold">Live Coordinates Active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E7E8] pb-3">
                <h3 className="font-display text-lg font-bold text-[#0F2433]">Filter Residences</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-xs border border-[#E5E7E8] rounded-md p-2"
                >
                  <option value="all">All Statuses</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Pending">Pending</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-xs border border-[#E5E7E8] rounded-md p-2"
                >
                  <option value="all">All Types</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo / Penthouse</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs border border-[#E5E7E8] rounded-md p-2"
                >
                  <option value="all">All Cities</option>
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full text-xs border border-[#E5E7E8] rounded-md p-2"
                >
                  <option value="all">Any</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                  <option value="4">4+ Beds</option>
                </select>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#0F2433] mb-2">Amenities</label>
                <div className="flex flex-wrap gap-1.5">
                  {allAmenities.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`text-[11px] px-2 py-1 rounded border ${
                        selectedAmenities.includes(a)
                          ? 'bg-[#0F2433] text-white'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7E8] flex items-center gap-3">
              <button
                onClick={handleResetFilters}
                className="w-1/2 py-2.5 border border-[#E5E7E8] rounded text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-[#0F2433] text-white rounded text-xs font-bold uppercase"
              >
                Apply ({filteredProperties.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

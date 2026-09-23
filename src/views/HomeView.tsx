import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { SeoHead } from '../components/seo/SeoHead';
import {
  Search,
  MapPin,
  Home,
  DollarSign,
  Bed,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Quote,
  Star,
  Building2,
  TrendingUp,
  Compass,
} from 'lucide-react';
import heroVillaImg from '../assets/images/hero_luxury_villa_exterior_1790144251662.jpg';

export const HomeView: React.FC = () => {
  const { properties, agents, locations, navigate } = useCms();

  // Search Bar state
  const [searchStatus, setSearchStatus] = useState<'For Sale' | 'For Rent'>('For Sale');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchMinPrice, setSearchMinPrice] = useState('0');
  const [searchMaxPrice, setSearchMaxPrice] = useState('all');
  const [searchBedrooms, setSearchBedrooms] = useState('all');

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 4);
  const latestProperties = [...properties]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      name: 'properties',
      initialFilter: {
        status: searchStatus,
        city: searchLocation || undefined,
        type: searchType !== 'all' ? searchType : undefined,
      },
    });
  };

  const propertyTypesList = [
    { name: 'Modernist Villas', count: properties.filter((p) => p.propertyType === 'Villa').length, icon: Home, type: 'Villa' },
    { name: 'Skyline Penthouses', count: properties.filter((p) => p.propertyType === 'Condo').length, icon: Building2, type: 'Condo' },
    { name: 'Architectural Estates', count: properties.filter((p) => p.propertyType === 'House').length, icon: Sparkles, type: 'House' },
    { name: 'High-Rise Residences', count: properties.filter((p) => p.propertyType === 'Apartment').length, icon: TrendingUp, type: 'Apartment' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <SeoHead
        title="PREMIER Real Estate | Luxury Architectural Residences & CMS Platform"
        description="Explore exclusive luxury properties, modern villas, and skyline penthouses. Built on Wix CMS dynamic repeaters with Velo inventory architecture."
      />

      {/* 1. HERO + PROPERTY SEARCH */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center bg-[#0F2433] text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Scrim Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroVillaImg}
            alt="Ultra Luxury Villa at Sunset"
            className="w-full h-full object-cover object-center brightness-60 scale-105 animate-subtleZoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2433] via-[#0F2433]/50 to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#C8A46B]/40 text-[#C8A46B] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Architectural Living · Powered by Wix CMS & Velo</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Find Your Next Architectural Masterpiece
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto font-sans leading-relaxed">
            Discover premier modern estates, waterfront villas, and skyline penthouses across the nation’s
            most coveted enclaves. Managed seamlessly via scalable CMS inventory.
          </p>

          {/* Search Box Interface */}
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 text-[#283238] max-w-4xl mx-auto border border-[#E5E7E8]">
            {/* Buy / Rent Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E5E7E8] pb-4 mb-4">
              <button
                type="button"
                onClick={() => setSearchStatus('For Sale')}
                className={`px-5 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                  searchStatus === 'For Sale'
                    ? 'bg-[#0F2433] text-white shadow-sm'
                    : 'text-[#0F2433]/70 hover:text-[#0F2433] hover:bg-slate-100'
                }`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => setSearchStatus('For Rent')}
                className={`px-5 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                  searchStatus === 'For Rent'
                    ? 'bg-[#0F2433] text-white shadow-sm'
                    : 'text-[#0F2433]/70 hover:text-[#0F2433] hover:bg-slate-100'
                }`}
              >
                Rent Luxury
              </button>
              <div className="ml-auto hidden sm:block text-xs text-[#667078]">
                {properties.length} Active Listings in CMS
              </div>
            </div>

            {/* Input Grid */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Location Input */}
              <div className="text-left">
                <label className="block text-[10px] font-bold tracking-wider uppercase text-[#0F2433] mb-1">
                  Location / City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Austin, Dallas, Miami..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full text-xs font-medium border border-[#E5E7E8] rounded-md pl-8 pr-3 py-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                  />
                  <MapPin className="w-4 h-4 text-[#C8A46B] absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div className="text-left">
                <label className="block text-[10px] font-bold tracking-wider uppercase text-[#0F2433] mb-1">
                  Property Type
                </label>
                <div className="relative">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full text-xs font-medium border border-[#E5E7E8] rounded-md pl-8 pr-3 py-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white cursor-pointer"
                  >
                    <option value="all">All Property Types</option>
                    <option value="Villa">Modern Villa</option>
                    <option value="Condo">Skyline Condo / Penthouse</option>
                    <option value="House">Architectural House</option>
                    <option value="Apartment">Luxury Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                  <Home className="w-4 h-4 text-[#C8A46B] absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Price Range */}
              <div className="text-left">
                <label className="block text-[10px] font-bold tracking-wider uppercase text-[#0F2433] mb-1">
                  Price Range
                </label>
                <div className="relative">
                  <select
                    value={searchMaxPrice}
                    onChange={(e) => setSearchMaxPrice(e.target.value)}
                    className="w-full text-xs font-medium border border-[#E5E7E8] rounded-md pl-8 pr-3 py-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white cursor-pointer"
                  >
                    <option value="all">Any Price</option>
                    <option value="1000000">Up to $1,000,000</option>
                    <option value="2500000">Up to $2,500,000</option>
                    <option value="5000000">Up to $5,000,000</option>
                    <option value="10000000">Up to $10,000,000+</option>
                  </select>
                  <DollarSign className="w-4 h-4 text-[#C8A46B] absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="text-left">
                <label className="block text-[10px] font-bold tracking-wider uppercase text-[#0F2433] mb-1">
                  Bedrooms
                </label>
                <div className="relative">
                  <select
                    value={searchBedrooms}
                    onChange={(e) => setSearchBedrooms(e.target.value)}
                    className="w-full text-xs font-medium border border-[#E5E7E8] rounded-md pl-8 pr-3 py-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white cursor-pointer"
                  >
                    <option value="all">Any Bedrooms</option>
                    <option value="2">2+ Beds</option>
                    <option value="3">3+ Beds</option>
                    <option value="4">4+ Beds</option>
                    <option value="5">5+ Beds</option>
                  </select>
                  <Bed className="w-4 h-4 text-[#C8A46B] absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Search Action Button */}
              <div className="text-left flex flex-col justify-end">
                <button
                  type="submit"
                  className="w-full bg-[#C8A46B] hover:bg-[#b8955b] text-[#0F2433] font-bold text-xs tracking-wider uppercase py-2.5 px-4 rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer h-[38px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROPERTIES (Dynamic CMS Repeater) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
              Handpicked Portfolio
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
              Featured Properties
            </h2>
            <p className="text-sm text-[#667078] mt-2 max-w-xl">
              Flagship architectural residences exhibiting extraordinary design, peerless craftsmanship,
              and premier geographical presence.
            </p>
          </div>
          <button
            onClick={() => navigate({ name: 'properties' })}
            className="text-xs font-bold tracking-wider uppercase text-[#0F2433] hover:text-[#C8A46B] inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            Explore All Listings
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dynamic Repeater Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* 3. BROWSE BY PROPERTY TYPE */}
      <section className="py-16 bg-white border-y border-[#E5E7E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
              Architectural Styles
            </span>
            <h2 className="font-display text-3xl font-bold text-[#0F2433] mt-1">
              Browse by Property Type
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypesList.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.name}
                  onClick={() =>
                    navigate({
                      name: 'properties',
                      initialFilter: { type: item.type },
                    })
                  }
                  className="group bg-[#F8F6F1] hover:bg-[#0F2433] p-8 rounded-lg border border-[#E5E7E8] hover:border-[#0F2433] transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-14 h-14 rounded-full bg-white group-hover:bg-[#C8A46B] text-[#0F2433] flex items-center justify-center transition-colors shadow-sm">
                    <IconComp className="w-7 h-7 transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#0F2433] group-hover:text-white transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#667078] group-hover:text-white/70 transition-colors font-medium">
                    {item.count} Active Properties
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EXPLORE POPULAR LOCATIONS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
              Premier Regions
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
              Explore Popular Locations
            </h2>
            <p className="text-sm text-[#667078] mt-2 max-w-xl">
              Immerse yourself in dynamic metropolitan enclaves and waterfront retreats, each supported
              by specialized local market data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.slug}
              onClick={() => navigate({ name: 'location-detail', slug: loc.slug })}
              className="group relative h-80 rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
            >
              <img
                src={loc.heroImage}
                alt={loc.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2433] via-[#0F2433]/40 to-transparent" />

              <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-1">
                <span className="text-[11px] font-semibold text-[#C8A46B] tracking-wider uppercase">
                  {loc.state}, {loc.country}
                </span>
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-[#C8A46B] transition-colors">
                  {loc.city}
                </h3>
                <div className="flex items-center justify-between text-xs text-white/80 pt-2 border-t border-white/20">
                  <span>Avg: ${(loc.avgPrice / 1000000).toFixed(2)}M</span>
                  <span className="flex items-center gap-1 text-[#C8A46B] font-semibold">
                    View Enclave <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LATEST PROPERTIES (Dynamic List) */}
      <section className="py-20 bg-white border-y border-[#E5E7E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
                Freshly Listed
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
                Latest Properties Added
              </h2>
              <p className="text-sm text-[#667078] mt-2 max-w-xl">
                Real-time inventory dynamically refreshed directly from the PREMIER Wix CMS database.
              </p>
            </div>
            <button
              onClick={() => navigate({ name: 'properties' })}
              className="text-xs font-bold tracking-wider uppercase text-[#0F2433] hover:text-[#C8A46B] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Browse Full Inventory
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
            The PREMIER Distinction
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
            Why High-Net-Worth Clients Choose PREMIER
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Off-Market Access',
              desc: 'Over 40% of our ultra-luxury transactions occur confidentially prior to public MLS broadcast.',
              icon: KeyRound,
            },
            {
              title: 'Architectural Curation',
              desc: 'Every home in our inventory is vetted by our architectural and structural advisory board.',
              icon: Award,
            },
            {
              title: 'Velo-Powered CMS Tech',
              desc: 'Native Wix Studio dynamic collections guarantee rapid listing turnaround and zero broken links.',
              icon: ShieldCheck,
            },
            {
              title: 'Fiduciary Precision',
              desc: 'Uncompromising discretion, legal rigor, and concierge escrow settlement from contract to key.',
              icon: CheckCircle2,
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white p-8 rounded-lg border border-[#E5E7E8] space-y-4 hover:border-[#C8A46B]/40 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-[#0F2433] text-[#C8A46B] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F2433]">{feature.title}</h3>
                <p className="text-xs text-[#667078] leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. MEET OUR AGENTS */}
      <section className="py-20 bg-white border-y border-[#E5E7E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
              Private Client Directors
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
              Meet Our Senior Advisory Agents
            </h2>
            <p className="text-sm text-[#667078] mt-2">
              Each property is championed by a dedicated partner with deep regional expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => navigate({ name: 'agent-detail', slug: agent.slug })}
                className="group bg-[#F8F6F1] rounded-lg overflow-hidden border border-[#E5E7E8] hover:border-[#C8A46B] transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-slate-200 relative">
                  <img
                    src={agent.profilePhoto}
                    alt={agent.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-white flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#C8A46B] fill-[#C8A46B]" />
                    <span>{agent.rating} ({agent.reviewCount})</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between space-y-2">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0F2433] group-hover:text-[#C8A46B] transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-[#C8A46B] font-semibold tracking-wide">
                      {agent.position}
                    </p>
                    <p className="text-xs text-[#667078] mt-2 line-clamp-2">
                      {agent.specialization}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5E7E8] text-[11px] text-[#0F2433] font-semibold flex items-center justify-between">
                    <span>{agent.areasServed.slice(0, 2).join(' · ')}</span>
                    <span className="text-[#C8A46B] flex items-center gap-1">
                      Profile <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
            Client Endorsements
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
            Reputations Built on Discretion
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote:
                'PREMIER secured our Westlake modern villa entirely off-market within 14 days. Their architectural depth and contract execution are unmatched in Texas.',
              client: 'Arthur & Victoria Sterling',
              role: 'Private Family Office, Austin',
            },
            {
              quote:
                'Marcus represented the sale of our Dallas Arts District penthouse with total confidentiality. Sold above target valuation with zero public marketing friction.',
              client: 'Caroline Dupont',
              role: 'Tech Executive, Dallas & San Francisco',
            },
            {
              quote:
                'From yacht dock depth verifications in Miami to closing, Sophia’s advisory was faultless. The digital CMS portal made evaluating properties effortless.',
              client: 'Dr. Henrik Lindqvist',
              role: 'International Investor, Miami',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-lg border border-[#E5E7E8] relative flex flex-col justify-between space-y-4"
            >
              <Quote className="w-8 h-8 text-[#C8A46B]/30 mb-1" />
              <p className="text-sm text-[#283238] italic leading-relaxed">
                "{item.quote}"
              </p>
              <div className="pt-4 border-t border-[#E5E7E8]">
                <h4 className="font-display font-bold text-sm text-[#0F2433]">{item.client}</h4>
                <p className="text-xs text-[#667078]">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CTA SECTION */}
      <section className="bg-[#0F2433] text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
            Private Advisory Invitation
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Acquire or List an Exceptional Estate?
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            Connect with our managing partners for a confidential portfolio consultation, private
            viewing itinerary, or discreet property valuation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate({ name: 'submit-property' })}
              className="bg-[#C8A46B] hover:bg-[#b8955b] text-[#0F2433] font-bold text-xs tracking-wider uppercase px-8 py-3.5 rounded-md transition-all shadow-lg cursor-pointer"
            >
              List Your Property
            </button>
            <button
              onClick={() => navigate({ name: 'properties' })}
              className="border border-white/30 hover:border-white text-white font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-md transition-all cursor-pointer hover:bg-white/10"
            >
              Browse Active Listings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

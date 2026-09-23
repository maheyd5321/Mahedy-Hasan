import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { SeoHead } from '../components/seo/SeoHead';
import {
  Heart,
  Scale,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Building,
  Car,
  DollarSign,
  Phone,
  Mail,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Video,
  Compass,
  ArrowRight,
  Calculator,
  X,
  Sparkles,
} from 'lucide-react';

export const PropertyDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const {
    properties,
    agents,
    navigate,
    isFavorite,
    toggleFavorite,
    isInCompare,
    addToCompare,
    removeFromCompare,
    openScheduleModal,
    submitInquiry,
  } = useCms();

  const property = properties.find((p) => p.slug === slug);
  const agent = property ? agents.find((a) => a.id === property.agentId) : null;

  // Gallery states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'virtual-tour' | 'video'>('photos');

  // Inquiry Form state
  const [inqName, setInqName] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqMessage, setInqMessage] = useState(
    property ? `I would like to receive confidential information regarding ${property.title} (ID: ${property.propertyId}).` : ''
  );
  const [inqContactMethod, setInqContactMethod] = useState<'Email' | 'Phone' | 'WhatsApp'>('Email');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Mortgage Calculator state
  const [homePrice, setHomePrice] = useState<number>(property?.price || 1500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);

  // If property not found
  if (!property) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-[#E5E7E8] space-y-4">
          <Building className="w-12 h-12 text-[#C8A46B] mx-auto" />
          <h2 className="font-display text-2xl font-bold text-[#0F2433]">Property Not Found</h2>
          <p className="text-xs text-[#667078]">
            The requested CMS record has either been transitioned off-market or the dynamic URL has
            been archived.
          </p>
          <button
            onClick={() => navigate({ name: 'properties' })}
            className="px-6 py-2.5 bg-[#0F2433] text-white text-xs font-bold uppercase rounded-md"
          >
            Return to Active Inventory
          </button>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const formatPrice = (p: number, s: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(p);
    return s === 'For Rent' ? `${formatted}/month` : formatted;
  };

  // Similar properties repeater
  const similarProperties = properties
    .filter((p) => p.id !== property.id && (p.city === property.city || p.propertyType === property.propertyType))
    .slice(0, 3);

  // Mortgage calculation logic
  const loanAmount = homePrice * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPrincipalAndInterest =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : loanAmount / numberOfPayments;

  const estimatedTaxesMonthly = (property.propertyTaxYearly || homePrice * 0.012) / 12;
  const estimatedInsuranceMonthly = (homePrice * 0.0035) / 12;
  const totalMonthlyEstimate =
    monthlyPrincipalAndInterest + estimatedTaxesMonthly + estimatedInsuranceMonthly + (property.hoaFeesPerMonth || 0);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName || !inqEmail || !inqPhone) return;

    submitInquiry({
      name: inqName,
      email: inqEmail,
      phone: inqPhone,
      message: inqMessage,
      preferredContact: inqContactMethod,
      propertyId: property.propertyId,
      propertyTitle: property.title,
      agentId: property.agentId,
      agentName: agent?.name,
    });

    setInquirySubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] pb-20">
      <SeoHead property={property} />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#E5E7E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs text-[#667078]">
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
            <button onClick={() => navigate({ name: 'home' })} className="hover:text-[#0F2433]">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate({ name: 'properties' })} className="hover:text-[#0F2433]">
              Properties
            </button>
            <span>/</span>
            <button
              onClick={() => navigate({ name: 'location-detail', slug: property.city.toLowerCase() })}
              className="hover:text-[#0F2433]"
            >
              {property.city}
            </button>
            <span>/</span>
            <span className="text-[#0F2433] font-medium truncate max-w-[200px]">{property.title}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => (inCompare ? removeFromCompare(property.id) : addToCompare(property.id))}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                inCompare
                  ? 'bg-[#C8A46B] text-[#0F2433]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{inCompare ? 'In Compare' : 'Compare'}</span>
            </button>
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                favorited
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-white' : ''}`} />
              <span>{favorited ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Property Hero & Title Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#E5E7E8] pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#0F2433] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                {property.status}
              </span>
              <span className="bg-[#C8A46B]/20 text-[#0F2433] border border-[#C8A46B]/40 text-xs font-semibold px-2.5 py-1 rounded">
                {property.propertyType}
              </span>
              <span className="font-mono text-xs text-[#667078]">
                MLS #{property.propertyId}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2433] leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-[#667078]">
              <MapPin className="w-4 h-4 text-[#C8A46B] shrink-0" />
              <span>
                {property.neighborhood}, {property.city}, {property.state} {property.zip} · {property.country}
              </span>
            </div>
          </div>

          {/* Price and CTA cluster */}
          <div className="flex flex-col lg:items-end gap-3 shrink-0">
            <div className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-[#0F2433]">
              {formatPrice(property.price, property.status)}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => openScheduleModal(property)}
                className="bg-[#C8A46B] hover:bg-[#b8955b] text-[#0F2433] font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-md transition-all shadow cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule a Viewing</span>
              </button>
              <a
                href={`tel:${agent?.phone || '+15128942200'}`}
                className="border border-[#0F2433] hover:bg-[#0F2433] hover:text-white text-[#0F2433] font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-md transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Agent</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Media & Interactive Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Media Mode Tabs */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-[#0F2433] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-[#E5E7E8]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#C8A46B]" />
            <span>High-Res Photos ({property.gallery.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('virtual-tour')}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'virtual-tour'
                ? 'bg-[#0F2433] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-[#E5E7E8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A46B]" />
            <span>3D Virtual Tour Walkthrough</span>
          </button>
          {property.videoUrl && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-[#0F2433] text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-[#E5E7E8]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#C8A46B]" />
              <span>Cinematic Film</span>
            </button>
          )}
        </div>

        {activeTab === 'photos' && (
          <div className="space-y-3">
            {/* Primary Showcase Viewport */}
            <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-[#E5E7E8] shadow-lg">
              <img
                src={property.gallery[activeImageIndex] || property.mainImage}
                alt={`${property.title} view ${activeImageIndex + 1}`}
                className="w-full h-full object-cover object-center cursor-pointer"
                onClick={() => setIsFullscreenGallery(true)}
              />

              {/* Prev / Next Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : property.gallery.length - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md cursor-pointer transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev < property.gallery.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md cursor-pointer transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Fullscreen Trigger */}
              <button
                onClick={() => setIsFullscreenGallery(true)}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-md backdrop-blur-md flex items-center gap-1.5 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View Fullscreen Gallery ({property.gallery.length})</span>
              </button>

              <div className="absolute bottom-4 left-4 bg-black/60 text-white/90 text-xs px-2.5 py-1 rounded backdrop-blur-md font-mono">
                {activeImageIndex + 1} / {property.gallery.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {property.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-28 h-18 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#C8A46B] ring-2 ring-[#C8A46B]/40'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3D Virtual Tour Simulator */}
        {activeTab === 'virtual-tour' && (
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-[#E5E7E8] p-8 flex flex-col items-center justify-center text-center text-white space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#C8A46B]/20 border border-[#C8A46B] text-[#C8A46B] flex items-center justify-center">
              <Compass className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <span className="text-xs font-mono text-[#C8A46B] tracking-widest uppercase">
                Interactive Matterport 3D Engine
              </span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">
                Virtual Spatial Walkthrough
              </h3>
              <p className="text-xs text-white/70 max-w-md mx-auto mt-2">
                Click and drag to navigate through the grand salon, private primary suites, cantilevered
                terrace, and wine room. High precision photogrammetry at 4K resolution.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('photos')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded"
              >
                Return to Photos
              </button>
              <button
                onClick={() => openScheduleModal(property)}
                className="px-5 py-2 bg-[#C8A46B] hover:bg-[#b8955b] text-[#0F2433] text-xs font-bold uppercase rounded shadow"
              >
                Schedule In-Person Walkthrough
              </button>
            </div>
          </div>
        )}

        {/* Video Tour */}
        {activeTab === 'video' && property.videoUrl && (
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-[#E5E7E8]">
            <iframe
              src={property.videoUrl}
              title="Cinematic Property Tour"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Main Details Grid: 2 Columns (Content Left 8 cols, Inquiry/Agent Right 4 cols) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (8 cols): Overview, Description, Amenities, Map, Mortgage */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. Overview Specs Grid */}
            <div className="bg-white rounded-xl border border-[#E5E7E8] p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-[#0F2433] mb-6 pb-3 border-b border-[#E5E7E8]">
                Property Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#667078] block">
                    Bedrooms
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[#0F2433] font-bold text-lg">
                    <Bed className="w-5 h-5 text-[#C8A46B]" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#667078] block">
                    Bathrooms
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[#0F2433] font-bold text-lg">
                    <Bath className="w-5 h-5 text-[#C8A46B]" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#667078] block">
                    Interior Living
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[#0F2433] font-bold text-lg">
                    <Maximize2 className="w-5 h-5 text-[#C8A46B]" />
                    <span>{property.propertySize.toLocaleString()} Sq Ft</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#667078] block">
                    Lot Size
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[#0F2433] font-bold text-lg">
                    <Building className="w-5 h-5 text-[#C8A46B]" />
                    <span>
                      {property.lotSize > 0
                        ? `${(property.lotSize / 43560).toFixed(2)} Acres`
                        : 'Condo Unit'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#667078] block">
                    Year Built
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[#0F2433] font-bold text-base">
                    <Calendar className="w-4 h-4 text-[#C8A46B]" />
                    <span>{property.yearBuilt}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#667078] block">
                    Property Type
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[#0F2433] font-bold text-base">
                    <Building className="w-4 h-4 text-[#C8A46B]" />
                    <span>{property.propertyType}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#667078] block">
                    Parking
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[#0F2433] font-bold text-base">
                    <Car className="w-4 h-4 text-[#C8A46B]" />
                    <span>{property.parkingSpaces || 2} Spaces</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#667078] block">
                    Price Per Sq Ft
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[#0F2433] font-bold text-base font-mono">
                    <DollarSign className="w-4 h-4 text-[#C8A46B]" />
                    <span>
                      ${Math.round(property.price / property.propertySize).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Full Property Description */}
            <div className="bg-white rounded-xl border border-[#E5E7E8] p-6 shadow-sm space-y-4">
              <h2 className="font-display text-xl font-bold text-[#0F2433] pb-3 border-b border-[#E5E7E8]">
                Architectural Statement & Details
              </h2>
              <div className="text-[#283238] text-sm leading-relaxed space-y-4">
                <p>{property.description}</p>
                <p>
                  Every detail has been carefully specified to honor the dialogue between natural
                  surroundings and timeless contemporary design. Floor-to-ceiling high-efficiency insulated
                  glazing, custom acoustic treatments, and seamless architectural reveals create a serene
                  living atmosphere.
                </p>
              </div>
            </div>

            {/* 3. Features & Amenities Icon Grid */}
            <div className="bg-white rounded-xl border border-[#E5E7E8] p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-[#0F2433] pb-3 border-b border-[#E5E7E8] mb-6">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-[#F8F6F1] border border-[#E5E7E8] text-xs font-semibold text-[#0F2433]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C8A46B] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Interactive Location & Nearby Map Integration */}
            <div className="bg-white rounded-xl border border-[#E5E7E8] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7E8]">
                <h2 className="font-display text-xl font-bold text-[#0F2433]">
                  Location & Neighborhood Connectivity
                </h2>
                <span className="text-xs font-mono text-[#667078]">
                  GPS: {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}
                </span>
              </div>

              {/* Visual Map Canvas Representation */}
              <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-slate-900 border border-[#E5E7E8] p-6 flex flex-col justify-between">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#C8A46B_1px,transparent_1px)] [background-size:20px_20px]" />

                <div className="relative z-10 flex items-center justify-between bg-black/70 backdrop-blur-md px-3 py-2 rounded text-xs text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C8A46B]" />
                    <span className="font-semibold">{property.location}</span>
                  </div>
                  <span className="text-[#C8A46B] text-[11px] font-mono">Wix Maps Verified</span>
                </div>

                {/* Central pin graphic */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                  <div className="w-12 h-12 rounded-full bg-[#0F2433] border-2 border-[#C8A46B] text-[#C8A46B] flex items-center justify-center shadow-2xl animate-bounce">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="bg-white text-[#0F2433] font-bold text-xs px-3 py-1 rounded shadow-md mt-2">
                    {property.title}
                  </span>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-2 bg-black/70 backdrop-blur-md p-2.5 rounded text-[11px] text-white/80">
                  <div>
                    <span className="text-white/50 block">Airport Access</span>
                    <span className="font-semibold">18 min drive</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Private Aviation</span>
                    <span className="font-semibold">12 min drive</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Fine Dining Enclave</span>
                    <span className="font-semibold">5 min walk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Mortgage Payment Estimator Calculator */}
            <div className="bg-white rounded-xl border border-[#E5E7E8] p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7E8]">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#C8A46B]" />
                  <h2 className="font-display text-xl font-bold text-[#0F2433]">
                    Mortgage & Financing Calculator
                  </h2>
                </div>
                <span className="text-xs text-[#667078]">Instant Estimator</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Sliders / Inputs */}
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Home Price</span>
                      <span className="font-mono text-[#0F2433]">${homePrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={500000}
                      max={15000000}
                      step={50000}
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                      className="w-full accent-[#C8A46B]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Down Payment ({downPaymentPercent}%)</span>
                      <span className="font-mono text-[#0F2433]">
                        ${((homePrice * downPaymentPercent) / 100).toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      step={5}
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-[#C8A46B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold block mb-1">Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full border border-[#E5E7E8] rounded p-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Loan Term</label>
                      <select
                        value={loanTermYears}
                        onChange={(e) => setLoanTermYears(Number(e.target.value))}
                        className="w-full border border-[#E5E7E8] rounded p-2 text-xs bg-white"
                      >
                        <option value={15}>15-Year Fixed</option>
                        <option value={30}>30-Year Fixed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Estimated Monthly Payment Breakdown Card */}
                <div className="bg-[#0F2433] text-white p-6 rounded-xl space-y-4">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#C8A46B]">
                    Estimated Monthly Payment
                  </span>
                  <div className="text-3xl font-bold font-sans text-white">
                    ${Math.round(totalMonthlyEstimate).toLocaleString()}{' '}
                    <span className="text-xs font-normal text-white/70">/ month</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                    <div className="flex justify-between text-white/80">
                      <span>Principal & Interest:</span>
                      <span className="font-mono font-semibold">
                        ${Math.round(monthlyPrincipalAndInterest).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Estimated Property Taxes:</span>
                      <span className="font-mono font-semibold">
                        ${Math.round(estimatedTaxesMonthly).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Hazard & Home Insurance:</span>
                      <span className="font-mono font-semibold">
                        ${Math.round(estimatedInsuranceMonthly).toLocaleString()}
                      </span>
                    </div>
                    {property.hoaFeesPerMonth ? (
                      <div className="flex justify-between text-white/80">
                        <span>HOA Dues:</span>
                        <span className="font-mono font-semibold">
                          ${property.hoaFeesPerMonth}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Agent Card & Direct Inquiry Form */}
          <div className="lg:col-span-4 space-y-6">
            {/* Agent Profile Box */}
            {agent && (
              <div className="bg-white rounded-xl border border-[#E5E7E8] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={agent.profilePhoto}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#C8A46B]"
                  />
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#0F2433] leading-tight">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-[#C8A46B] font-semibold">{agent.position}</p>
                    <p className="text-[11px] text-[#667078] font-mono mt-0.5">
                      Lic. #{agent.licenseNumber}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#667078] leading-relaxed line-clamp-3">{agent.bio}</p>

                <div className="space-y-2 pt-2 border-t border-[#E5E7E8] text-xs">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center justify-between p-2.5 rounded bg-slate-50 hover:bg-slate-100 text-[#0F2433] font-semibold transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C8A46B]" />
                      <span>{agent.phone}</span>
                    </div>
                    <span className="text-[#C8A46B] text-[11px] uppercase">Direct</span>
                  </a>

                  <a
                    href={`mailto:${agent.email}?subject=Inquiry on ${property.title} (${property.propertyId})`}
                    className="flex items-center justify-between p-2.5 rounded bg-slate-50 hover:bg-slate-100 text-[#0F2433] font-semibold transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#C8A46B]" />
                      <span className="truncate max-w-[180px]">{agent.email}</span>
                    </div>
                    <span className="text-[#C8A46B] text-[11px] uppercase">Email</span>
                  </a>
                </div>

                <button
                  onClick={() => navigate({ name: 'agent-detail', slug: agent.slug })}
                  className="w-full text-center text-xs font-semibold text-[#0F2433] hover:text-[#C8A46B] pt-1 block cursor-pointer transition-colors"
                >
                  View Full Broker Profile & Portfolio →
                </button>
              </div>
            )}

            {/* Direct Property Inquiry CTA Box */}
            <div className="bg-white rounded-xl border border-[#E5E7E8] p-6 shadow-md space-y-4">
              <div className="border-b border-[#E5E7E8] pb-3">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#C8A46B]">
                  Confidential Inquiry
                </span>
                <h3 className="font-display text-xl font-bold text-[#0F2433]">
                  Interested in this property?
                </h3>
                <p className="text-xs text-[#667078] mt-1">
                  Transmitted directly into PREMIER Wix CMS inquiry registry for immediate response.
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">Inquiry Dispatched</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Thank you, <strong className="text-emerald-900">{inqName}</strong>. Our managing
                    director has received your dossier inquiry for{' '}
                    <strong className="text-emerald-900">{property.title}</strong> and will connect
                    via {inqContactMethod}.
                  </p>
                  <button
                    onClick={() => setInquirySubmitted(false)}
                    className="text-xs text-emerald-900 underline font-semibold mt-2"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={inqName}
                      onChange={(e) => setInqName(e.target.value)}
                      className="w-full text-xs border border-[#E5E7E8] rounded p-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={inqEmail}
                      onChange={(e) => setInqEmail(e.target.value)}
                      className="w-full text-xs border border-[#E5E7E8] rounded p-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={inqPhone}
                      onChange={(e) => setInqPhone(e.target.value)}
                      className="w-full text-xs border border-[#E5E7E8] rounded p-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                      Preferred Contact Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Email', 'Phone', 'WhatsApp'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setInqContactMethod(method)}
                          className={`text-xs py-1.5 rounded text-center border font-medium cursor-pointer ${
                            inqContactMethod === method
                              ? 'bg-[#0F2433] text-white border-[#0F2433]'
                              : 'bg-slate-50 text-slate-700 border-[#E5E7E8]'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      value={inqMessage}
                      onChange={(e) => setInqMessage(e.target.value)}
                      className="w-full text-xs border border-[#E5E7E8] rounded p-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0F2433] hover:bg-[#1E3A5F] text-white font-bold text-xs tracking-wider uppercase py-3 rounded-md transition-all shadow cursor-pointer"
                  >
                    Request Information Dossier
                  </button>

                  <button
                    type="button"
                    onClick={() => openScheduleModal(property)}
                    className="w-full bg-[#C8A46B] hover:bg-[#b8955b] text-[#0F2433] font-bold text-xs tracking-wider uppercase py-2.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Private Viewing</span>
                  </button>
                </form>
              )}

              <div className="pt-3 border-t border-[#E5E7E8] text-[11px] text-[#667078] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A46B] shrink-0" />
                <span>Confidential NDA representation guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Section (Dynamic Repeater) */}
      {similarProperties.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-[#E5E7E8]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
                Curated Recommendations
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2433]">
                Similar Architectural Residences
              </h2>
            </div>
            <button
              onClick={() => navigate({ name: 'properties' })}
              className="text-xs font-bold uppercase tracking-wider text-[#0F2433] hover:text-[#C8A46B] inline-flex items-center gap-1"
            >
              All Listings <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Gallery Lightbox Modal */}
      {isFullscreenGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div>
              <h3 className="font-display text-lg font-bold">{property.title}</h3>
              <p className="text-xs text-white/60">
                Photo {activeImageIndex + 1} of {property.gallery.length}
              </p>
            </div>
            <button
              onClick={() => setIsFullscreenGallery(false)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image with navigation */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={property.gallery[activeImageIndex]}
              alt={`Full view ${activeImageIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded"
            />
            <button
              onClick={() =>
                setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : property.gallery.length - 1))
              }
              className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black text-white cursor-pointer"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={() =>
                setActiveImageIndex((prev) => (prev < property.gallery.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black text-white cursor-pointer"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto py-2 justify-center">
            {property.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-12 rounded overflow-hidden shrink-0 border-2 ${
                  activeImageIndex === idx ? 'border-[#C8A46B]' : 'border-transparent opacity-50'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

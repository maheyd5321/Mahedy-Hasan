import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { SeoHead } from '../components/seo/SeoHead';
import { PropertyType } from '../types/realEstate';
import {
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Building,
  DollarSign,
  ArrowRight,
  Info,
} from 'lucide-react';

export const SubmitPropertyView: React.FC = () => {
  const { submitProperty, navigate } = useCms();

  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [city, setCity] = useState('Austin');
  const [state, setState] = useState('Texas');
  const [propertyType, setPropertyType] = useState<PropertyType>('House');
  const [saleOrRent, setSaleOrRent] = useState<'For Sale' | 'For Rent'>('For Sale');
  const [price, setPrice] = useState<number>(1200000);
  const [bedrooms, setBedrooms] = useState<number>(4);
  const [bathrooms, setBathrooms] = useState<number>(3.5);
  const [sizeSqFt, setSizeSqFt] = useState<number>(3200);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !email || !phone || !propertyAddress) return;

    submitProperty({
      ownerName,
      email,
      phone,
      propertyAddress,
      city,
      state,
      propertyType,
      saleOrRent,
      price,
      bedrooms,
      bathrooms,
      sizeSqFt,
      description:
        description ||
        `Custom luxury residence located at ${propertyAddress} in ${city}, ${state}. High-end finishes, private grounds.`,
      images: imageUrl
        ? [imageUrl]
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="List Your Property | PREMIER Real Estate Advisory"
        description="Submit your luxury home or architectural estate for representation by PREMIER. Enters our confidential CMS review queue."
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#C8A46B]/20 border border-[#C8A46B]/40 text-[#C8A46B] text-xs font-bold tracking-widest uppercase">
            <Building className="w-3.5 h-3.5" />
            <span>Owner & Broker Intake Portal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2433]">
            List Your Estate with PREMIER
          </h1>
          <p className="text-sm text-[#667078] max-w-xl mx-auto leading-relaxed">
            Submit your residence for confidential valuation and private client representation.
            Submissions enter our secure <strong>Pending Review</strong> CMS queue before being
            published.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-10 rounded-xl border border-[#E5E7E8] text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-bold text-[#0F2433]">
                Submission Received into CMS
              </h2>
              <p className="text-xs text-[#667078] font-semibold uppercase tracking-wider">
                Status: Pending Broker Review
              </p>
            </div>
            <p className="text-sm text-[#283238] max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-[#0F2433]">{ownerName}</strong>. Your property
              dossier for <strong className="text-[#0F2433]">{propertyAddress}</strong> has been
              logged into the Wix CMS staging environment. An advisory partner will contact you at{' '}
              <strong className="text-[#0F2433]">{email}</strong> within 24 hours to review
              marketing parameters and title verifications.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate({ name: 'cms-admin', defaultTab: 'submissions' })}
                className="px-6 py-2.5 bg-[#0F2433] text-white text-xs font-bold uppercase tracking-wider rounded shadow hover:bg-[#1E3A5F]"
              >
                Inspect Submission in CMS Admin
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 border border-[#E5E7E8] text-slate-700 text-xs font-bold uppercase rounded hover:bg-slate-50"
              >
                Submit Another Property
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-[#E5E7E8] p-8 shadow-sm space-y-8"
          >
            {/* Step 1: Owner Contact Information */}
            <div>
              <h3 className="font-display text-lg font-bold text-[#0F2433] pb-2 border-b border-[#E5E7E8] mb-4">
                1. Owner & Representative Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robert Langdon"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Property Specifications */}
            <div>
              <h3 className="font-display text-lg font-bold text-[#0F2433] pb-2 border-b border-[#E5E7E8] mb-4">
                2. Property Location & Classification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    Property Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1402 Canyon View Pass"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 text-[#0F2433]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    Listing Intent
                  </label>
                  <select
                    value={saleOrRent}
                    onChange={(e) => setSaleOrRent(e.target.value as any)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 bg-white"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent / Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 bg-white"
                  >
                    <option value="House">Single Family House</option>
                    <option value="Villa">Modern Villa</option>
                    <option value="Condo">Condo / Penthouse</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land / Lot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    Target Price ($)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Dimensions & Architectural Description */}
            <div>
              <h3 className="font-display text-lg font-bold text-[#0F2433] pb-2 border-b border-[#E5E7E8] mb-4">
                3. Dimensions, Details & Photography
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    Living Area (Sq Ft)
                  </label>
                  <input
                    type="number"
                    value={sizeSqFt}
                    onChange={(e) => setSizeSqFt(Number(e.target.value))}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                  Primary Image URL (or Leave Blank for High-Res Default)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 pl-9"
                  />
                  <UploadCloud className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                  Architectural Summary & Upgrades
                </label>
                <textarea
                  rows={4}
                  placeholder="Mention custom finishes, swimming pool, landscape architect, smart home integration, or views..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs border border-[#E5E7E8] rounded p-2.5 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                />
              </div>
            </div>

            {/* Disclaimer & Submission Notice */}
            <div className="bg-[#F8F6F1] p-4 rounded-lg border border-[#E5E7E8] text-xs text-[#667078] flex items-start gap-3">
              <Info className="w-5 h-5 text-[#C8A46B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0F2433]">Discreet Review Policy:</strong> All listing
                submissions enter our encrypted internal CMS workflow in a{' '}
                <span className="font-semibold text-[#0F2433]">"Pending Review"</span> status.
                PREMIER never publishes properties automatically to ensure title veracity, copyright
                licensing of photography, and fiduciary compliance.
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F2433] hover:bg-[#1E3A5F] text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-md transition-all shadow cursor-pointer"
            >
              Submit Property Dossier to Review Queue
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

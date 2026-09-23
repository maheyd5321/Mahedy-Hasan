import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { SeoHead } from '../components/seo/SeoHead';
import {
  Phone,
  Mail,
  Award,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Building,
  ArrowRight,
} from 'lucide-react';

export const AgentDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const { agents, properties, submitInquiry } = useCms();

  const agent = agents.find((a) => a.slug === slug) || agents[0];
  const agentProperties = properties.filter((p) => p.agentId === agent.id);

  const [inqName, setInqName] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqMessage, setInqMessage] = useState(
    `Hello ${agent.name}, I am seeking confidential advisory regarding properties in your portfolio.`
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName || !inqEmail) return;

    submitInquiry({
      name: inqName,
      email: inqEmail,
      phone: inqPhone,
      message: inqMessage,
      preferredContact: 'Email',
      propertyId: 'GENERAL-ADVISORY',
      propertyTitle: `Direct Broker Consultation with ${agent.name}`,
      agentId: agent.id,
      agentName: agent.name,
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead agent={agent} />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Agent Profile Header Card */}
        <div className="bg-white rounded-xl border border-[#E5E7E8] p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Agent Photo */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-[#C8A46B] shadow-md bg-slate-100 relative">
                <img
                  src={agent.profilePhoto}
                  alt={agent.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-white flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#C8A46B] fill-[#C8A46B]" />
                  <span>
                    {agent.rating} ({agent.reviewCount} Reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Agent Bio & Credentials */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
                  Licensed Private Real Estate Partner
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
                  {agent.name}
                </h1>
                <p className="text-sm font-semibold text-[#0F2433]/80">{agent.position}</p>
                <p className="text-xs font-mono text-[#667078] mt-1">
                  License #{agent.licenseNumber} · PREMIER Real Estate Group
                </p>
              </div>

              <p className="text-sm text-[#283238] leading-relaxed">{agent.bio}</p>

              {/* Specialization & Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E5E7E8] text-xs">
                <div>
                  <span className="font-bold uppercase text-[#667078] block mb-1">
                    Areas Served
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.areasServed.map((area) => (
                      <span
                        key={area}
                        className="bg-[#F8F6F1] border border-[#E5E7E8] text-[#0F2433] px-2 py-0.5 rounded font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold uppercase text-[#667078] block mb-1">
                    Specialization
                  </span>
                  <span className="text-[#0F2433] font-semibold">{agent.specialization}</span>
                </div>
              </div>

              {/* Direct Contact Cluster */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href={`tel:${agent.phone}`}
                  className="bg-[#0F2433] hover:bg-[#1E3A5F] text-white font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-md transition-all shadow flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#C8A46B]" />
                  <span>Call {agent.phone}</span>
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="border border-[#0F2433] text-[#0F2433] hover:bg-[#0F2433] hover:text-white font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-md transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#C8A46B]" />
                  <span>Email Broker</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Active Listings Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E7E8] pb-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
                CMS Portfolio
              </span>
              <h2 className="font-display text-2xl font-bold text-[#0F2433]">
                Represented Properties by {agent.name} ({agentProperties.length})
              </h2>
            </div>
          </div>

          {agentProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agentProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl text-center border border-[#E5E7E8]">
              <p className="text-sm text-[#667078]">
                All public listings currently under contract. Inquire directly for off-market
                holdings.
              </p>
            </div>
          )}
        </div>

        {/* Direct Broker Consultation Form */}
        <div className="bg-white rounded-xl border border-[#E5E7E8] p-8 shadow-sm max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
              Direct Inquiry
            </span>
            <h3 className="font-display text-2xl font-bold text-[#0F2433]">
              Consult Confidentially with {agent.name}
            </h3>
            <p className="text-xs text-[#667078]">
              Your inquiry is logged securely in the PREMIER CRM and routed directly to {agent.name}.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-sm">Message Received</h4>
              <p className="text-xs text-emerald-800">
                Thank you, {inqName}. {agent.name} will review your inquiry and connect promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5"
                    placeholder="e.g. Marcus Sterling"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={inqEmail}
                    onChange={(e) => setInqEmail(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2.5"
                    placeholder="you@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={inqPhone}
                  onChange={(e) => setInqPhone(e.target.value)}
                  className="w-full text-xs border border-[#E5E7E8] rounded p-2.5"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#0F2433] mb-1">
                  Message / Advisory Requirements
                </label>
                <textarea
                  rows={3}
                  value={inqMessage}
                  onChange={(e) => setInqMessage(e.target.value)}
                  className="w-full text-xs border border-[#E5E7E8] rounded p-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F2433] hover:bg-[#1E3A5F] text-white font-bold text-xs tracking-wider uppercase py-3 rounded-md transition-all shadow cursor-pointer"
              >
                Send Private Message to {agent.name}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

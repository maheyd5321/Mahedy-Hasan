import React from 'react';
import { PremierLogo } from '../brand/PremierLogo';
import { useCms } from '../../context/CmsContext';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useCms();

  return (
    <footer className="bg-[#0B1B27] text-[#D9E0E3] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Philosophy (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate({ name: 'home' })}
              className="cursor-pointer inline-block"
            >
              <PremierLogo variant="light" size="md" />
            </div>
            <p className="text-sm text-[#D9E0E3]/80 leading-relaxed max-w-sm">
              PREMIER is an architectural real estate advisory representing iconic modern estates,
              high-rise penthouses, and private coastal compounds. Built on dynamic Wix CMS
              architecture with real-time Velo inventory management.
            </p>
            <div className="pt-2 space-y-2 text-xs text-[#D9E0E3]/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C8A46B]" />
                <span>300 West 6th Street, Suite 2100, Austin, TX 78701</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C8A46B]" />
                <span>+1 (512) 894-2200 · Direct Private Client Line</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C8A46B]" />
                <span>concierge@premier-luxury.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Prime Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest text-[#C8A46B] uppercase">
              Prime Markets
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Austin & Westlake', slug: 'austin' },
                { name: 'Dallas & Arts District', slug: 'dallas' },
                { name: 'Miami & Biscayne Bay', slug: 'miami' },
                { name: 'Houston & River Oaks', slug: 'houston' },
              ].map((loc) => (
                <li key={loc.slug}>
                  <button
                    onClick={() => navigate({ name: 'location-detail', slug: loc.slug })}
                    className="hover:text-[#C8A46B] transition-colors cursor-pointer text-left"
                  >
                    {loc.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate({ name: 'properties' })}
                  className="text-xs text-[#C8A46B] hover:underline pt-1 inline-flex items-center gap-1"
                >
                  View All Markets <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Property Types */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest text-[#C8A46B] uppercase">
              Collections
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                'Modernist Villas',
                'Skyline Penthouses',
                'Deepwater Waterfront',
                'Historic Estates',
                'Architectural Compounds',
              ].map((type) => (
                <li key={type}>
                  <button
                    onClick={() => navigate({ name: 'properties' })}
                    className="hover:text-[#C8A46B] transition-colors cursor-pointer"
                  >
                    {type}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate({ name: 'submit-property' })}
                  className="text-xs text-[#C8A46B] hover:underline pt-1 inline-flex items-center gap-1"
                >
                  List Your Property <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: CMS Architecture & Client Advisory */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest text-[#C8A46B] uppercase">
              Platform & CMS
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate({ name: 'cms-admin' })}
                  className="hover:text-[#C8A46B] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A46B]" />
                  Wix CMS Admin Panel
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'cms-admin', defaultTab: 'velo' })}
                  className="hover:text-[#C8A46B] transition-colors cursor-pointer"
                >
                  Velo Code Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'favorites' })}
                  className="hover:text-[#C8A46B] transition-colors cursor-pointer"
                >
                  Saved Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'compare' })}
                  className="hover:text-[#C8A46B] transition-colors cursor-pointer"
                >
                  Property Comparison Tool
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'agent-detail', slug: 'eleanor-vance' })}
                  className="hover:text-[#C8A46B] transition-colors cursor-pointer"
                >
                  Private Broker Directory
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Verification */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#D9E0E3]/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C8A46B]" />
            <span>
              Equal Housing Opportunity · Licensed Brokerage #TX-0598412 · Powered by Wix Studio &
              Velo CMS Architecture
            </span>
          </div>
          <p>© {new Date().getFullYear()} PREMIER Real Estate Group LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

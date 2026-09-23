import React, { useState } from 'react';
import { PremierLogo } from '../brand/PremierLogo';
import { useCms } from '../../context/CmsContext';
import { Heart, Scale, Phone, Menu, X, Database, PlusCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentRoute, navigate, favorites, compareList, setIsCompareDrawerOpen } = useCms();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Properties', route: { name: 'properties' } as const },
    { label: 'Buy', route: { name: 'properties', initialFilter: { status: 'For Sale' } } as const },
    { label: 'Rent', route: { name: 'properties', initialFilter: { status: 'For Rent' } } as const },
    { label: 'Locations', route: { name: 'location-detail', slug: 'austin' } as const },
    { label: 'Agents', route: { name: 'agent-detail', slug: 'eleanor-vance' } as const },
    { label: 'List Property', route: { name: 'submit-property' } as const },
  ];

  const handleNav = (r: any) => {
    navigate(r);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F2433] text-white shadow-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Brand Wordmark */}
          <div
            onClick={() => handleNav({ name: 'home' })}
            className="cursor-pointer group flex items-center py-2"
          >
            <PremierLogo variant="light" size="md" />
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive =
                currentRoute.name === link.route.name &&
                (!('slug' in link.route) ||
                  ('slug' in currentRoute && currentRoute.slug === (link.route as any).slug));

              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.route)}
                  className={`text-sm tracking-wide font-medium transition-colors hover:text-[#C8A46B] relative py-1 cursor-pointer ${
                    isActive ? 'text-[#C8A46B]' : 'text-white/90'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A46B]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Favorites, Compare, CMS Admin, Call Agent) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Compare Trigger */}
            <button
              onClick={() => setIsCompareDrawerOpen(true)}
              className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Compare Properties"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8A46B] text-[#0F2433] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Favorites Link */}
            <button
              onClick={() => handleNav({ name: 'favorites' })}
              className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8A46B] text-[#0F2433] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* CMS & Velo Admin Button */}
            <button
              onClick={() => handleNav({ name: 'cms-admin' })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-md transition-all cursor-pointer"
              title="Wix CMS Database & Velo Code Inspector"
            >
              <Database className="w-3.5 h-3.5 text-[#C8A46B]" />
              <span>CMS Admin</span>
            </button>

            {/* Call Action Button */}
            <a
              href="tel:+15128942200"
              className="hidden md:flex items-center gap-2 bg-[#C8A46B] hover:bg-[#b8955b] text-[#0F2433] font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-md transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>(512) 894-2200</span>
            </a>
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNav({ name: 'favorites' })}
              className="p-2 text-white relative"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8A46B] text-[#0F2433] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/90 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1B27] border-t border-white/10 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.route)}
                className="text-left px-3 py-2 text-sm text-white/90 hover:text-[#C8A46B] hover:bg-white/5 rounded-md font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => handleNav({ name: 'cms-admin' })}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/10 text-white rounded-md text-sm font-medium"
            >
              <Database className="w-4 h-4 text-[#C8A46B]" />
              Wix CMS & Velo Inspector
            </button>
            <button
              onClick={() => handleNav({ name: 'submit-property' })}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#C8A46B] text-[#0F2433] font-semibold rounded-md text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              List Your Property
            </button>
            <a
              href="tel:+15128942200"
              className="flex items-center justify-center gap-2 w-full py-2.5 border border-white/20 text-white rounded-md text-sm font-medium"
            >
              <Phone className="w-4 h-4 text-[#C8A46B]" />
              Call Concierge: (512) 894-2200
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

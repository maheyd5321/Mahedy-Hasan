/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CmsProvider, useCms } from './context/CmsContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CompareDrawer } from './components/property/CompareDrawer';
import { ScheduleViewingModal } from './components/property/ScheduleViewingModal';

import { HomeView } from './views/HomeView';
import { PropertiesView } from './views/PropertiesView';
import { PropertyDetailView } from './views/PropertyDetailView';
import { AgentDetailView } from './views/AgentDetailView';
import { LocationDetailView } from './views/LocationDetailView';
import { FavoritesView } from './views/FavoritesView';
import { CompareView } from './views/CompareView';
import { SubmitPropertyView } from './views/SubmitPropertyView';
import { CmsAdminView } from './views/CmsAdminView';

const AppContent: React.FC = () => {
  const { currentRoute } = useCms();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  const renderRoute = () => {
    switch (currentRoute.name) {
      case 'home':
        return <HomeView />;
      case 'properties':
        return <PropertiesView />;
      case 'property-detail':
        return <PropertyDetailView slug={currentRoute.slug} />;
      case 'agent-detail':
        return <AgentDetailView slug={currentRoute.slug} />;
      case 'location-detail':
        return <LocationDetailView slug={currentRoute.slug} />;
      case 'favorites':
        return <FavoritesView />;
      case 'compare':
        return <CompareView />;
      case 'submit-property':
        return <SubmitPropertyView />;
      case 'cms-admin':
        return <CmsAdminView defaultTab={currentRoute.defaultTab} />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1] text-[#283238] font-sans antialiased selection:bg-[#C8A46B]/30 selection:text-[#0F2433]">
      <Header />
      <main className="flex-1">{renderRoute()}</main>
      <Footer />
      <CompareDrawer />
      <ScheduleViewingModal />
    </div>
  );
};

export default function App() {
  return (
    <CmsProvider>
      <AppContent />
    </CmsProvider>
  );
}

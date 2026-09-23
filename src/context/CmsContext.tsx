import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  Agent,
  LocationGuide,
  Inquiry,
  ViewingRequest,
  PropertySubmission,
  InquiryStatus,
} from '../types/realEstate';
import {
  INITIAL_PROPERTIES,
  INITIAL_AGENTS,
  INITIAL_LOCATIONS,
  INITIAL_INQUIRIES,
  INITIAL_VIEWINGS,
  INITIAL_SUBMISSIONS,
} from '../data/initialData';

export type AppRoute =
  | { name: 'home' }
  | { name: 'properties'; initialFilter?: { status?: string; city?: string; type?: string } }
  | { name: 'property-detail'; slug: string }
  | { name: 'agent-detail'; slug: string }
  | { name: 'location-detail'; slug: string }
  | { name: 'favorites' }
  | { name: 'compare' }
  | { name: 'submit-property' }
  | { name: 'cms-admin'; defaultTab?: 'properties' | 'inquiries' | 'viewings' | 'submissions' | 'velo' };

interface CmsContextType {
  properties: Property[];
  agents: Agent[];
  locations: LocationGuide[];
  inquiries: Inquiry[];
  viewings: ViewingRequest[];
  submissions: PropertySubmission[];
  favorites: string[];
  compareList: string[];
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  submitInquiry: (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
    preferredContact: 'Email' | 'Phone' | 'WhatsApp';
    propertyId: string;
    propertyTitle: string;
    agentId: string;
    agentName?: string;
  }) => { success: boolean; id: string };
  submitViewingRequest: (data: {
    name: string;
    email: string;
    phone: string;
    propertyId: string;
    propertyTitle: string;
    preferredDate: string;
    preferredTime: string;
    message?: string;
  }) => { success: boolean; id: string };
  submitProperty: (data: Omit<PropertySubmission, 'id' | 'status' | 'submittedAt'>) => { success: boolean; id: string };
  addPropertyToCms: (data: Omit<Property, 'id' | 'slug' | 'propertyId' | 'dateAdded'>) => Property;
  updatePropertyInCms: (id: string, updates: Partial<Property>) => void;
  deletePropertyFromCms: (id: string) => void;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  approveSubmission: (id: string) => void;
  rejectSubmission: (id: string) => void;
  resetAllToDefault: () => void;
  selectedScheduleProperty: Property | null;
  openScheduleModal: (property: Property) => void;
  closeScheduleModal: () => void;
  isCompareDrawerOpen: boolean;
  setIsCompareDrawerOpen: (open: boolean) => void;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Properties State (with localStorage persistence)
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('premier_properties');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROPERTIES;
  });

  // 2. Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem('premier_inquiries');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INQUIRIES;
  });

  // 3. Viewings State
  const [viewings, setViewings] = useState<ViewingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('premier_viewings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_VIEWINGS;
  });

  // 4. Property Submissions State
  const [submissions, setSubmissions] = useState<PropertySubmission[]>(() => {
    try {
      const saved = localStorage.getItem('premier_submissions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SUBMISSIONS;
  });

  // 5. Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('premier_favorites');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['prop-1', 'prop-3'];
  });

  // 6. Compare List (up to 3 properties)
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  // 7. Schedule Viewing Modal
  const [selectedScheduleProperty, setSelectedScheduleProperty] = useState<Property | null>(null);

  // 8. Navigation & URL State
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    // Parse initial URL hash or path
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('/properties/')) {
      const slug = hash.replace('/properties/', '');
      return { name: 'property-detail', slug };
    }
    if (hash.startsWith('/agents/')) {
      const slug = hash.replace('/agents/', '');
      return { name: 'agent-detail', slug };
    }
    if (hash.startsWith('/locations/')) {
      const slug = hash.replace('/locations/', '');
      return { name: 'location-detail', slug };
    }
    if (hash === '/properties') return { name: 'properties' };
    if (hash === '/favorites') return { name: 'favorites' };
    if (hash === '/compare') return { name: 'compare' };
    if (hash === '/submit-property') return { name: 'submit-property' };
    if (hash === '/cms-admin') return { name: 'cms-admin' };
    return { name: 'home' };
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('premier_properties', JSON.stringify(properties));
    } catch (e) {
      console.error(e);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem('premier_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('premier_viewings', JSON.stringify(viewings));
    } catch (e) {
      console.error(e);
    }
  }, [viewings]);

  useEffect(() => {
    try {
      localStorage.setItem('premier_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error(e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem('premier_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Handle URL hash changes
  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    let hash = '';
    switch (route.name) {
      case 'home':
        hash = '';
        break;
      case 'properties':
        hash = '/properties';
        break;
      case 'property-detail':
        hash = `/properties/${route.slug}`;
        break;
      case 'agent-detail':
        hash = `/agents/${route.slug}`;
        break;
      case 'location-detail':
        hash = `/locations/${route.slug}`;
        break;
      case 'favorites':
        hash = '/favorites';
        break;
      case 'compare':
        hash = '/compare';
        break;
      case 'submit-property':
        hash = '/submit-property';
        break;
      case 'cms-admin':
        hash = '/cms-admin';
        break;
    }
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addToCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 3) {
        // Replace the oldest
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
    setIsCompareDrawerOpen(true);
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item !== id));
  };

  const isInCompare = (id: string) => compareList.includes(id);

  const clearCompare = () => {
    setCompareList([]);
    setIsCompareDrawerOpen(false);
  };

  const submitInquiry = (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
    preferredContact: 'Email' | 'Phone' | 'WhatsApp';
    propertyId: string;
    propertyTitle: string;
    agentId: string;
    agentName?: string;
  }) => {
    const id = `inq-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newInquiry: Inquiry = {
      id,
      ...data,
      date: dateStr,
      status: 'New',
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    return { success: true, id };
  };

  const submitViewingRequest = (data: {
    name: string;
    email: string;
    phone: string;
    propertyId: string;
    propertyTitle: string;
    preferredDate: string;
    preferredTime: string;
    message?: string;
  }) => {
    const id = `view-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newViewing: ViewingRequest = {
      id,
      ...data,
      status: 'Pending',
      createdAt,
    };
    setViewings((prev) => [newViewing, ...prev]);
    return { success: true, id };
  };

  const submitProperty = (data: Omit<PropertySubmission, 'id' | 'status' | 'submittedAt'>) => {
    const id = `sub-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const submittedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newSub: PropertySubmission = {
      id,
      ...data,
      status: 'Pending Review',
      submittedAt,
    };
    setSubmissions((prev) => [newSub, ...prev]);
    return { success: true, id };
  };

  const addPropertyToCms = (data: Omit<Property, 'id' | 'slug' | 'propertyId' | 'dateAdded'>) => {
    const idNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `prop-${Date.now()}`;
    const propertyId = `PR-${idNum}`;
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${data.city.toLowerCase()}`;
    const now = new Date().toISOString().split('T')[0];

    const newProp: Property = {
      ...data,
      id: newId,
      propertyId,
      slug,
      dateAdded: now,
    };

    setProperties((prev) => [newProp, ...prev]);
    return newProp;
  };

  const updatePropertyInCms = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deletePropertyFromCms = (id: string) => {
    setProperties((prev) => prev.filter((item) => item.id !== id));
    setFavorites((prev) => prev.filter((item) => item !== id));
    setCompareList((prev) => prev.filter((item) => item !== id));
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const approveSubmission = (subId: string) => {
    const sub = submissions.find((s) => s.id === subId);
    if (!sub) return;

    // Convert submission into published CMS property
    addPropertyToCms({
      title: `${sub.bedrooms} Bed ${sub.propertyType} on ${sub.propertyAddress}`,
      status: sub.saleOrRent,
      propertyType: sub.propertyType,
      price: sub.price,
      location: `${sub.city}, ${sub.state}`,
      country: 'United States',
      state: sub.state,
      city: sub.city,
      neighborhood: 'Downtown / Metro',
      zip: '78701',
      bedrooms: sub.bedrooms,
      bathrooms: sub.bathrooms,
      propertySize: sub.sizeSqFt,
      lotSize: sub.sizeSqFt * 2,
      yearBuilt: 2023,
      description: sub.description,
      mainImage: sub.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      gallery: sub.images.length > 0 ? sub.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      amenities: ['Garage', 'Air conditioning', 'Smart Home'],
      featured: false,
      agentId: 'agent-1',
      seoTitle: `${sub.bedrooms} Bed ${sub.propertyType} in ${sub.city}, ${sub.state} | PREMIER`,
      seoDescription: `Approved luxury property in ${sub.city}. ${sub.bedrooms} Beds, ${sub.bathrooms} Baths, ${sub.sizeSqFt} sq ft.`,
      coordinates: { lat: 30.2672, lng: -97.7431 },
    });

    setSubmissions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: 'Approved' } : s))
    );
  };

  const rejectSubmission = (subId: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: 'Rejected' } : s))
    );
  };

  const resetAllToDefault = () => {
    setProperties(INITIAL_PROPERTIES);
    setInquiries(INITIAL_INQUIRIES);
    setViewings(INITIAL_VIEWINGS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setFavorites(['prop-1', 'prop-3']);
    setCompareList([]);
    localStorage.removeItem('premier_properties');
    localStorage.removeItem('premier_inquiries');
    localStorage.removeItem('premier_viewings');
    localStorage.removeItem('premier_submissions');
    localStorage.removeItem('premier_favorites');
  };

  const openScheduleModal = (prop: Property) => {
    setSelectedScheduleProperty(prop);
  };

  const closeScheduleModal = () => {
    setSelectedScheduleProperty(null);
  };

  return (
    <CmsContext.Provider
      value={{
        properties,
        agents: INITIAL_AGENTS,
        locations: INITIAL_LOCATIONS,
        inquiries,
        viewings,
        submissions,
        favorites,
        compareList,
        currentRoute,
        navigate,
        toggleFavorite,
        isFavorite,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        submitInquiry,
        submitViewingRequest,
        submitProperty,
        addPropertyToCms,
        updatePropertyInCms,
        deletePropertyFromCms,
        updateInquiryStatus,
        approveSubmission,
        rejectSubmission,
        resetAllToDefault,
        selectedScheduleProperty,
        openScheduleModal,
        closeScheduleModal,
        isCompareDrawerOpen,
        setIsCompareDrawerOpen,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) throw new Error('useCms must be used within a CmsProvider');
  return context;
};

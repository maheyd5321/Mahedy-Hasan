export type PropertyStatus = 'For Sale' | 'For Rent' | 'Sold' | 'Pending';

export type PropertyType =
  | 'House'
  | 'Apartment'
  | 'Condo'
  | 'Villa'
  | 'Townhouse'
  | 'Commercial'
  | 'Land';

export interface Property {
  id: string;
  propertyId: string; // e.g. "PR-8042"
  title: string;
  slug: string; // e.g. "modern-3-bedroom-villa-austin"
  status: PropertyStatus;
  propertyType: PropertyType;
  price: number;
  location: string; // e.g. "Austin, Texas"
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  propertySize: number; // sq ft
  lotSize: number; // sq ft or acres converted
  yearBuilt: number;
  description: string;
  mainImage: string;
  gallery: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  amenities: string[];
  featured: boolean;
  agentId: string;
  dateAdded: string;
  seoTitle: string;
  seoDescription: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  parkingSpaces?: number;
  hoaFeesPerMonth?: number;
  propertyTaxYearly?: number;
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  profilePhoto: string;
  position: string;
  bio: string;
  phone: string;
  email: string;
  licenseNumber: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
  areasServed: string[];
  rating: number;
  reviewCount: number;
  specialization: string;
}

export type InquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Closed';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: 'Email' | 'Phone' | 'WhatsApp';
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  agentName?: string;
  date: string;
  status: InquiryStatus;
}

export interface ViewingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyTitle: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}

export interface PropertySubmission {
  id: string;
  ownerName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  city: string;
  state: string;
  propertyType: PropertyType;
  saleOrRent: 'For Sale' | 'For Rent';
  price: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  description: string;
  images: string[];
  status: 'Pending Review' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface LocationGuide {
  slug: string;
  city: string;
  state: string;
  country: string;
  title: string;
  heroImage: string;
  description: string;
  avgPrice: number;
  totalListings: number;
  popularTypes: string[];
  lifestyleHighlights: string[];
}

export interface SearchFiltersState {
  query: string;
  status: 'all' | PropertyStatus;
  propertyType: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string; // 'all' | '1' | '2' | '3' | '4' | '5+'
  bathrooms: string; // 'all' | '1' | '2' | '3' | '4+'
  minSqFt: number;
  maxSqFt: number;
  yearBuiltMin: number;
  amenities: string[];
  sortBy: 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'featured' | 'size-desc';
}

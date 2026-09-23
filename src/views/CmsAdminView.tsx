import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { SeoHead } from '../components/seo/SeoHead';
import { Property, PropertyStatus, PropertyType, ViewingRequest } from '../types/realEstate';
import {
  Database,
  Code2,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  Copy,
  CheckCheck,
  UserCheck,
} from 'lucide-react';

export const CmsAdminView: React.FC<{ defaultTab?: 'properties' | 'submissions' | 'inquiries' | 'viewings' | 'velo' }> = ({
  defaultTab = 'properties',
}) => {
  const {
    properties,
    agents,
    locations,
    inquiries,
    viewings,
    submissions,
    addPropertyToCms,
    updatePropertyInCms,
    deletePropertyFromCms,
    approveSubmission,
    navigate,
  } = useCms();

  const [activeTab, setActiveTab] = useState<'properties' | 'submissions' | 'inquiries' | 'viewings' | 'velo'>(
    defaultTab
  );

  // Search & Filter within admin table
  const [adminSearch, setAdminSearch] = useState('');

  // Add Property Modal / State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('Austin');
  const [newPrice, setNewPrice] = useState(1450000);
  const [newStatus, setNewStatus] = useState<PropertyStatus>('For Sale');
  const [newType, setNewType] = useState<PropertyType>('Villa');
  const [newBeds, setNewBeds] = useState(4);
  const [newBaths, setNewBaths] = useState(3.5);
  const [newSqFt, setNewSqFt] = useState(3400);
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newFeatured, setNewFeatured] = useState(false);

  // Velo Code tab helper
  const [selectedVeloSnippet, setSelectedVeloSnippet] = useState<
    'dataset' | 'filters' | 'dynamicPage' | 'favorites' | 'backendHooks'
  >('filters');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addPropertyToCms({
      title: newTitle,
      city: newCity,
      state: 'Texas',
      country: 'USA',
      location: `${newCity}, Texas`,
      neighborhood: `${newCity} Heights`,
      zip: '78701',
      price: newPrice,
      status: newStatus,
      propertyType: newType,
      bedrooms: newBeds,
      bathrooms: newBaths,
      propertySize: newSqFt,
      lotSize: 18000,
      yearBuilt: 2024,
      parkingSpaces: 2,
      featured: newFeatured,
      description:
        newDesc ||
        `Newly introduced architectural masterpiece in ${newCity}. Expansive glass spans, private landscaped grounds, and state-of-the-art climate and lighting technology.`,
      seoTitle: `${newTitle} | Luxury Real Estate in ${newCity}`,
      seoDescription:
        newDesc ||
        `Explore ${newTitle}, a premier architectural estate located in ${newCity}, Texas.`,
      mainImage:
        newImage ||
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        newImage ||
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Pool', 'Garage', 'Garden', 'Smart Home', 'Air conditioning'],
      coordinates: { lat: 30.2672, lng: -97.7431 },
      agentId: agents[0]?.id || 'ag-1',
    });

    setIsAddOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewImage('');
  };

  const copyVeloCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const veloCodes = {
    filters: `// ============================================================
// WIX STUDIO / VELO: Properties Collection Dynamic Multi-Filter
// Page Code: properties-page.js
// Description: Queries 'Properties' collection using wix-data with
// simultaneous status, type, location, price range & amenity filters.
// ============================================================
import wixData from 'wix-data';

$w.onReady(function () {
  initMultiFilterListeners();
  loadProperties();
});

function initMultiFilterListeners() {
  $w('#searchLocationInput').onInput(debounce(loadProperties, 300));
  $w('#statusDropdown').onChange(loadProperties);
  $w('#typeDropdown').onChange(loadProperties);
  $w('#priceRangeSlider').onChange(loadProperties);
  $w('#bedroomsDropdown').onChange(loadProperties);
  $w('#sortOrderDropdown').onChange(loadProperties);
}

export function loadProperties() {
  let query = wixData.query("Properties");

  const status = $w('#statusDropdown').value;
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const propType = $w('#typeDropdown').value;
  if (propType && propType !== "all") {
    query = query.eq("propertyType", propType);
  }

  const locationText = $w('#searchLocationInput').value;
  if (locationText && locationText.trim().length > 0) {
    query = query.contains("city", locationText)
                 .or(query.contains("neighborhood", locationText))
                 .or(query.contains("title", locationText));
  }

  const maxPrice = Number($w('#priceRangeSlider').value);
  if (maxPrice && maxPrice > 0) {
    query = query.le("price", maxPrice);
  }

  const minBeds = Number($w('#bedroomsDropdown').value);
  if (minBeds && minBeds > 0) {
    query = query.ge("bedrooms", minBeds);
  }

  // Sorting
  const sort = $w('#sortOrderDropdown').value;
  if (sort === "price-asc") query = query.ascending("price");
  else if (sort === "price-desc") query = query.descending("price");
  else query = query.descending("_createdDate");

  query.find()
    .then((results) => {
      if (results.items.length > 0) {
        $w('#propertiesRepeater').data = results.items;
        $w('#noResultsBox').collapse();
      } else {
        $w('#propertiesRepeater').data = [];
        $w('#noResultsBox').expand();
      }
      $w('#resultsCountText').text = \`\${results.totalCount} Properties Found\`;
    })
    .catch((err) => console.error("CMS Query error:", err));
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`,
    dynamicPage: `// ============================================================
// WIX STUDIO / VELO: Dynamic Property Item Page Code
// Page Code: properties-[slug].js (Properties (Item))
// Automatically binds CMS item, initializes lightbox, mortgage calculator,
// and prefills the inquiry form with Property ID and Title.
// ============================================================
import wixLocation from 'wix-location';
import wixData from 'wix-data';

$w.onReady(function () {
  $w('#dynamicDataset').onReady(() => {
    const property = $w('#dynamicDataset').getCurrentItem();
    
    // 1. Format Currency & Specs Display
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(property.price);
    
    $w('#priceText').text = property.status === 'For Rent' 
      ? \`\${formattedPrice}/month\` 
      : formattedPrice;

    // 2. Prefill Confidential Inquiry Form
    $w('#inquiryPropertyIdInput').value = property.propertyId;
    $w('#inquiryPropertyTitleInput').value = property.title;

    // 3. Load Agent Reference Item
    if (property.agentId) {
      wixData.get("Agents", property.agentId)
        .then((agent) => {
          $w('#agentNameText').text = agent.name;
          $w('#agentPhoto').src = agent.profilePhoto;
          $w('#agentPhoneBtn').link = \`tel:\${agent.phone}\`;
          $w('#agentEmailBtn').link = \`mailto:\${agent.email}\`;
        });
    }

    // 4. Setup Dynamic Lightbox & Virtual Tour
    $w('#viewGalleryBtn').onClick(() => {
      wixWindow.openLightbox("PropertyGalleryLightbox", { gallery: property.gallery });
    });
  });
});`,
    favorites: `// ============================================================
// WIX STUDIO / VELO: User Favorites & Account Persistence
// Public Code: public/favorites.js
// Stores favorite property IDs in wix-storage (guest) or
// persists directly to 'UserFavorites' CMS collection for members.
// ============================================================
import { local } from 'wix-storage';
import wixUsers from 'wix-users';
import wixData from 'wix-data';

const STORAGE_KEY = 'premier_favorites';

export async function toggleFavorite(propertyId) {
  if (wixUsers.currentUser.loggedIn) {
    const userId = wixUsers.currentUser.id;
    const existing = await wixData.query("UserFavorites")
      .eq("userId", userId)
      .eq("propertyId", propertyId)
      .find();

    if (existing.items.length > 0) {
      await wixData.remove("UserFavorites", existing.items[0]._id);
      return false; // Removed
    } else {
      await wixData.insert("UserFavorites", { userId, propertyId, savedDate: new Date() });
      return true; // Added
    }
  } else {
    // Guest fallback using local storage
    let favs = JSON.parse(local.getItem(STORAGE_KEY) || '[]');
    const index = favs.indexOf(propertyId);
    if (index > -1) {
      favs.splice(index, 1);
      local.setItem(STORAGE_KEY, JSON.stringify(favs));
      return false;
    } else {
      favs.push(propertyId);
      local.setItem(STORAGE_KEY, JSON.stringify(favs));
      return true;
    }
  }
}`,
    backendHooks: `// ============================================================
// WIX STUDIO / VELO: Backend Data Hooks
// Backend Code: backend/data.js
// Validates submissions, auto-generates SEO-friendly URLs,
// and enforces 'Pending Review' security status on owner submissions.
// ============================================================

export function Properties_beforeInsert(item, context) {
  // 1. Auto-generate URL-friendly slug if not provided
  if (!item.slug) {
    item.slug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // 2. Auto-generate unique Property ID (MLS code)
  if (!item.propertyId) {
    const prefix = item.city ? item.city.slice(0, 3).toUpperCase() : 'PRM';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    item.propertyId = \`\${prefix}-\${randNum}\`;
  }

  // 3. Fallback defaults
  if (!item.status) item.status = 'For Sale';
  if (!item.featured) item.featured = false;

  return item;
}

export function PropertySubmissions_beforeInsert(item, context) {
  // Enforce pending review status - NEVER auto-publish user submissions
  item.status = 'Pending Review';
  item.submittedDate = new Date();
  return item;
}`,
    dataset: `// ============================================================
// WIX STUDIO / VELO: CMS Collection Schema Representation
// Export: Wix CMS Collections Definition
// ============================================================
export const WixCmsCollections = {
  Properties: {
    fields: [
      { key: "title", type: "Text", required: true },
      { key: "slug", type: "Text", unique: true, index: true },
      { key: "propertyId", type: "Text", unique: true },
      { key: "price", type: "Number", index: true },
      { key: "status", type: "Enum", choices: ["For Sale", "For Rent", "Sold", "Pending"] },
      { key: "propertyType", type: "Enum", choices: ["House", "Apartment", "Condo", "Villa", "Townhouse"] },
      { key: "bedrooms", type: "Number" },
      { key: "bathrooms", type: "Number" },
      { key: "propertySize", type: "Number" },
      { key: "city", type: "Text", index: true },
      { key: "state", type: "Text" },
      { key: "agentId", type: "Reference", referencedCollection: "Agents" },
      { key: "mainImage", type: "Image" },
      { key: "gallery", type: "MediaGallery" },
      { key: "featured", type: "Boolean" },
      { key: "seoTitle", type: "Text" },
      { key: "seoDescription", type: "Text" }
    ]
  },
  Agents: {
    fields: [
      { key: "name", type: "Text" },
      { key: "slug", type: "Text", unique: true },
      { key: "position", type: "Text" },
      { key: "phone", type: "Text" },
      { key: "email", type: "Text" },
      { key: "profilePhoto", type: "Image" },
      { key: "licenseNumber", type: "Text" }
    ]
  },
  Inquiries: {
    fields: [
      { key: "name", type: "Text" },
      { key: "email", type: "Text" },
      { key: "phone", type: "Text" },
      { key: "propertyId", type: "Text" },
      { key: "propertyTitle", type: "Text" },
      { key: "message", type: "Text" }
    ]
  }
};`,
  };

  const filteredAdminProperties = properties.filter((p) => {
    if (!adminSearch) return true;
    const s = adminSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(s) ||
      p.city.toLowerCase().includes(s) ||
      p.propertyId.toLowerCase().includes(s) ||
      p.status.toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Wix CMS & Velo Administration | PREMIER Real Estate"
        description="Live CMS collection inventory management, pending submissions moderation, inquiry log, and Velo source code inspector."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7E8] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#C8A46B]">
              <Database className="w-4 h-4" />
              <span>Wix Studio CMS & Velo Architecture Dashboard</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0F2433] mt-1">
              CMS Database & Inventory Manager
            </h1>
            <p className="text-xs text-[#667078] mt-1">
              Administer dynamic CMS collections, approve property submissions, and inspect live
              Wix Velo backend controllers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-[#0F2433] hover:bg-[#1E3A5F] text-white font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-md transition-all shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C8A46B]" />
              <span>Add Property to CMS</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E5E7E8] pb-2">
          {[
            { id: 'properties', label: `Properties (${properties.length})`, icon: Layers },
            {
              id: 'submissions',
              label: `Submissions Queue (${submissions.length})`,
              icon: Clock,
            },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Mail },
            { id: 'viewings', label: `Viewing Requests (${viewings.length})`, icon: Calendar },
            { id: 'velo', label: 'Velo Code & Schema', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer shrink-0 ${
                  active
                    ? 'bg-[#0F2433] text-white shadow-sm'
                    : 'bg-white text-[#283238] hover:bg-slate-100 border border-[#E5E7E8]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#C8A46B]' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROPERTIES COLLECTION TABLE */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-xl border border-[#E5E7E8] shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Filter table by title, city, status, ID..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full text-xs border border-[#E5E7E8] rounded-md pl-8 pr-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <div className="text-xs text-[#667078]">
                Changes immediately persist to the PREMIER Wix CMS inventory state.
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-[#E5E7E8] text-[#0F2433] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Estate & Image</th>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Specs</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7E8]">
                  {filteredAdminProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.mainImage}
                            alt={prop.title}
                            className="w-12 h-10 object-cover rounded shadow-sm"
                          />
                          <div>
                            <span
                              onClick={() => navigate({ name: 'property-detail', slug: prop.slug })}
                              className="font-display font-bold text-sm text-[#0F2433] hover:text-[#C8A46B] transition-colors cursor-pointer line-clamp-1"
                            >
                              {prop.title}
                            </span>
                            <span className="text-[11px] text-[#667078] block">
                              /properties/{prop.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-[#0F2433]">
                        {prop.propertyId}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={prop.status}
                          onChange={(e) =>
                            updatePropertyInCms(prop.id, { status: e.target.value as PropertyStatus })
                          }
                          className="text-[11px] font-semibold border border-[#E5E7E8] rounded px-2 py-1 bg-white cursor-pointer"
                        >
                          <option value="For Sale">For Sale</option>
                          <option value="For Rent">For Rent</option>
                          <option value="Pending">Pending</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-[#283238] font-medium">{prop.propertyType}</td>

                      <td className="py-3 px-4 font-mono font-bold text-[#0F2433]">
                        ${prop.price.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-[#667078]">{prop.city}, {prop.state}</td>

                      <td className="py-3 px-4 text-[#667078]">
                        {prop.bedrooms}b · {prop.bathrooms}ba · {prop.propertySize} sqft
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => updatePropertyInCms(prop.id, { featured: !prop.featured })}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                            prop.featured
                              ? 'bg-[#C8A46B] text-[#0F2433]'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {prop.featured ? 'Yes' : 'No'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate({ name: 'property-detail', slug: prop.slug })}
                            className="p-1 text-slate-500 hover:text-[#0F2433] rounded hover:bg-slate-100"
                            title="Preview Dynamic Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePropertyFromCms(prop.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                            title="Delete from CMS"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTY SUBMISSIONS QUEUE (Pending Review) */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-xl border border-[#E5E7E8] shadow-sm p-6 space-y-6">
            <div className="border-b border-[#E5E7E8] pb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#C8A46B]">
                Moderation Workflow
              </span>
              <h2 className="font-display text-2xl font-bold text-[#0F2433]">
                Pending Property Submissions ({submissions.length})
              </h2>
              <p className="text-xs text-[#667078] mt-1">
                Submissions from homeowners or external agents. Verifying title, photography, and
                licensing prior to publishing to the live Wix CMS inventory.
              </p>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12 text-[#667078] text-xs">
                No submissions currently waiting in the review queue.
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-lg border border-[#E5E7E8] bg-[#F8F6F1] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            sub.status === 'Pending Review'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                        <span className="text-xs font-semibold text-[#0F2433]">
                          {sub.saleOrRent} · {sub.propertyType}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#0F2433]">
                          ${sub.price.toLocaleString()}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base text-[#0F2433]">
                        {sub.propertyAddress}, {sub.city}, {sub.state}
                      </h3>

                      <p className="text-xs text-[#667078]">
                        Submitted by: <strong className="text-[#0F2433]">{sub.ownerName}</strong> (
                        {sub.email} · {sub.phone}) on {new Date(sub.submittedAt).toLocaleDateString()}
                      </p>

                      <p className="text-xs text-[#283238] bg-white p-2.5 rounded border border-[#E5E7E8]">
                        "{sub.description}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {sub.status === 'Pending Review' && (
                        <button
                          onClick={() => approveSubmission(sub.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold tracking-wider uppercase px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Publish to CMS</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INQUIRIES LOG */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-xl border border-[#E5E7E8] shadow-sm p-6 space-y-4">
            <div className="border-b border-[#E5E7E8] pb-4">
              <h2 className="font-display text-2xl font-bold text-[#0F2433]">
                Client Inquiries Registry ({inquiries.length})
              </h2>
              <p className="text-xs text-[#667078] mt-1">
                Real-time inquiry transmissions with auto-bound property references.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-12 text-[#667078] text-xs">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y border-[#E5E7E8] font-bold text-[#0F2433] uppercase">
                      <th className="p-3">Client</th>
                      <th className="p-3">Contact Method</th>
                      <th className="p-3">Property Dossier</th>
                      <th className="p-3">Message</th>
                      <th className="p-3">Assigned Broker</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7E8]">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <strong className="text-[#0F2433] block">{inq.name}</strong>
                          <span className="text-[#667078] text-[11px]">
                            {inq.email} · {inq.phone}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-[#0F2433]">
                          {inq.preferredContact || 'Email'}
                        </td>
                        <td className="p-3 font-semibold text-[#0F2433]">
                          {inq.propertyTitle} ({inq.propertyId})
                        </td>
                        <td className="p-3 text-[#283238] max-w-xs">{inq.message}</td>
                        <td className="p-3 text-[#667078]">{inq.agentName || 'General Concierge'}</td>
                        <td className="p-3 text-[#667078] font-mono">
                          {new Date(inq.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: VIEWING REQUESTS */}
        {activeTab === 'viewings' && (
          <div className="bg-white rounded-xl border border-[#E5E7E8] shadow-sm p-6 space-y-4">
            <div className="border-b border-[#E5E7E8] pb-4">
              <h2 className="font-display text-2xl font-bold text-[#0F2433]">
                Viewing & Tour Schedule ({viewings.length})
              </h2>
              <p className="text-xs text-[#667078] mt-1">
                Confirmed private tour appointments submitted through the viewing request scheduler.
              </p>
            </div>

            {viewings.length === 0 ? (
              <div className="text-center py-12 text-[#667078] text-xs">
                No tour requests scheduled yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y border-[#E5E7E8] font-bold text-[#0F2433] uppercase">
                      <th className="p-3">Visitor Name</th>
                      <th className="p-3">Property</th>
                      <th className="p-3">Preferred Date</th>
                      <th className="p-3">Time Window</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7E8]">
                    {viewings.map((vr: ViewingRequest) => (
                      <tr key={vr.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#0F2433]">{vr.name}</td>
                        <td className="p-3 font-semibold text-[#0F2433]">
                          {vr.propertyTitle} ({vr.propertyId})
                        </td>
                        <td className="p-3 font-mono text-[#0F2433]">{vr.preferredDate}</td>
                        <td className="p-3 font-semibold text-[#C8A46B]">{vr.preferredTime}</td>
                        <td className="p-3 text-[#667078]">
                          {vr.phone} · {vr.email}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                            {vr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: VELO CODE EXPLORER & ARCHITECTURE */}
        {activeTab === 'velo' && (
          <div className="bg-white rounded-xl border border-[#E5E7E8] shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7E8] pb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#C8A46B]">
                  Wix Velo Source Code
                </span>
                <h2 className="font-display text-2xl font-bold text-[#0F2433]">
                  Production Velo Scripts & Backend Data Hooks
                </h2>
                <p className="text-xs text-[#667078] mt-1">
                  Ready to copy and paste directly into Wix Studio Page Code & Backend Modules.
                </p>
              </div>

              <button
                onClick={() => copyVeloCode(veloCodes[selectedVeloSnippet])}
                className="bg-[#0F2433] hover:bg-[#1E3A5F] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow self-start sm:self-auto"
              >
                {copiedSnippet ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#C8A46B]" />}
                <span>{copiedSnippet ? 'Copied to Clipboard!' : 'Copy Code Snippet'}</span>
              </button>
            </div>

            {/* Snippet Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'filters', label: '1. Multi-Filter Repeater (properties-page.js)' },
                { id: 'dynamicPage', label: '2. Dynamic Item Page (properties-[slug].js)' },
                { id: 'favorites', label: '3. Favorites Persistence (public/favorites.js)' },
                { id: 'backendHooks', label: '4. Backend Validation Hooks (backend/data.js)' },
                { id: 'dataset', label: '5. CMS Collections Schema (JSON)' },
              ].map((snip) => (
                <button
                  key={snip.id}
                  onClick={() => setSelectedVeloSnippet(snip.id as any)}
                  className={`text-xs px-3 py-1.5 rounded font-semibold cursor-pointer border ${
                    selectedVeloSnippet === snip.id
                      ? 'bg-[#0F2433] text-white border-[#0F2433]'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-[#E5E7E8]'
                  }`}
                >
                  {snip.label}
                </button>
              ))}
            </div>

            {/* Code Block Container */}
            <div className="bg-[#0F172A] rounded-lg p-5 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800 shadow-inner">
              <pre>{veloCodes[selectedVeloSnippet]}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E5E7E8] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E7E8] pb-3">
              <h3 className="font-display text-xl font-bold text-[#0F2433]">
                Create New Property Record in CMS
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Cliffside Sanctuary"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2 bg-white"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2 bg-white"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Condo">Condo / Penthouse</option>
                    <option value="House">Single Family House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={newBeds}
                    onChange={(e) => setNewBeds(Number(e.target.value))}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newBaths}
                    onChange={(e) => setNewBaths(Number(e.target.value))}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">
                    Interior Sq Ft
                  </label>
                  <input
                    type="number"
                    value={newSqFt}
                    onChange={(e) => setNewSqFt(Number(e.target.value))}
                    className="w-full text-xs border border-[#E5E7E8] rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">
                  Main Image URL (or Leave Empty for Architectural Default)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full text-xs border border-[#E5E7E8] rounded p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#0F2433] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs border border-[#E5E7E8] rounded p-2"
                  placeholder="Architectural summary..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={newFeatured}
                  onChange={(e) => setNewFeatured(e.target.checked)}
                  className="accent-[#C8A46B]"
                />
                <label htmlFor="featuredCheck" className="text-xs font-semibold text-[#0F2433]">
                  Feature on Homepage Hero & Flagship Repeater
                </label>
              </div>

              <div className="pt-4 border-t border-[#E5E7E8] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F2433] text-white text-xs font-bold uppercase rounded hover:bg-[#1E3A5F]"
                >
                  Save & Publish to CMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

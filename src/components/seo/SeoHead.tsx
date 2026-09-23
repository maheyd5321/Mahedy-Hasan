import React, { useEffect } from 'react';
import { Property, Agent, LocationGuide } from '../../types/realEstate';

interface SeoHeadProps {
  title?: string;
  description?: string;
  property?: Property;
  agent?: Agent;
  locationGuide?: LocationGuide;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  property,
  agent,
  locationGuide,
}) => {
  useEffect(() => {
    let resolvedTitle = 'PREMIER Real Estate | Luxury Property Platform & CMS';
    let resolvedDesc =
      'Premium real estate platform with dynamic CMS properties, Velo filtering, agent profiles, location guides, viewing scheduler, and property inventory management.';

    if (property) {
      resolvedTitle = property.seoTitle || `${property.title} | PREMIER Real Estate`;
      resolvedDesc = property.seoDescription || property.description.slice(0, 160);
    } else if (agent) {
      resolvedTitle = `${agent.name} - ${agent.position} | PREMIER Real Estate`;
      resolvedDesc = agent.bio.slice(0, 160);
    } else if (locationGuide) {
      resolvedTitle = `Luxury Real Estate in ${locationGuide.city}, ${locationGuide.state} | PREMIER`;
      resolvedDesc = locationGuide.description.slice(0, 160);
    } else if (title) {
      resolvedTitle = `${title} | PREMIER Real Estate`;
      if (description) resolvedDesc = description;
    }

    document.title = resolvedTitle;

    // Update meta tags
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', resolvedDesc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', resolvedTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', resolvedDesc);

    // Inject JSON-LD Schema
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) existingScript.remove();

    if (property) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: property.title,
        description: property.description,
        image: property.gallery,
        url: window.location.href,
        datePosted: property.dateAdded,
        offers: {
          '@type': 'Offer',
          price: property.price,
          priceCurrency: 'USD',
          availability: property.status === 'Sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        },
        itemOffered: {
          '@type': 'SingleFamilyResidence',
          name: property.title,
          numberOfBedrooms: property.bedrooms,
          numberOfBathroomsTotal: property.bathrooms,
          floorSize: {
            '@type': 'QuantitativeValue',
            value: property.propertySize,
            unitCode: 'FTK',
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: property.neighborhood,
            addressLocality: property.city,
            addressRegion: property.state,
            postalCode: property.zip,
            addressCountry: property.country,
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: property.coordinates.lat,
            longitude: property.coordinates.lng,
          },
        },
      });
      document.head.appendChild(script);
    } else if (agent) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: agent.name,
        jobTitle: agent.position,
        telephone: agent.phone,
        email: agent.email,
        image: agent.profilePhoto,
        areaServed: agent.areasServed,
      });
      document.head.appendChild(script);
    }
  }, [title, description, property, agent, locationGuide]);

  return null;
};

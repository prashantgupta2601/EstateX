import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { mockProperties } from '@/lib/mock-data/properties';
import { getPropertyById } from '@/lib/mock-data/api-simulation';
import PropertyDetailsClient from '@/components/property/property-details-client';
import PropertyDetailsSkeleton from '@/components/skeletons/property-details-skeleton';

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === id);
  if (!property) return {};

  const bhk = property.bedrooms > 0 ? `${property.bedrooms} BHK ` : '';
  const typeLabel = property.type === 'sale' ? 'for sale' : 'for rent';
  const title = `${property.title} - ${bhk}in ${property.location.address}, ${property.location.city} | EstateX`;

  const priceText = property.price >= 10000000 
    ? `₹${(property.price / 10000000).toFixed(2)} Cr` 
    : property.price >= 100000 
      ? `₹${(property.price / 100000).toFixed(1)} L` 
      : `₹${property.price.toLocaleString('en-IN')}`;

  const description = `${bhk}${property.propertyType} ${typeLabel} in ${property.location.address}, ${property.location.city}. Area: ${property.area} ${property.areaUnit || 'sqft'}, Price: ${priceText}. View details, photos and contact seller.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: property.images.length > 0 ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = await params;
  const propertyPromise = getPropertyById(id);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 py-6 md:py-10 flex flex-col gap-6 text-left">
        <Suspense fallback={<PropertyDetailsSkeleton />}>
          <PropertyDetailsClient propertyPromise={propertyPromise} />
        </Suspense>
      </div>
    </div>
  );
}

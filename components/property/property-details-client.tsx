'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Property } from '@/types/property';
import ImageGallery from '@/components/property/image-gallery';
import PropertySpecs from '@/components/property/property-specs';
import SellerContactCard from '@/components/property/seller-contact-card';
import PriceTrends from '@/components/property/price-trends';
import SimilarProperties from '@/components/property/similar-properties';
import PropertyDetailsActions from '@/components/property/property-details-actions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import NearbyMapWrapper from '@/components/property/nearby-map-wrapper';

interface PropertyDetailsClientProps {
  propertyPromise: Promise<Property | undefined>;
}

export default function PropertyDetailsClient({ propertyPromise }: PropertyDetailsClientProps) {
  const property = use(propertyPromise);

  if (!property) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-muted-foreground select-none pb-2 border-b border-border/25">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-muted-foreground/60">&gt;</span>
        <Link href="/properties" className="hover:text-primary transition-colors">Properties</Link>
        <span className="text-muted-foreground/60">&gt;</span>
        <span className="capitalize">{property.location.city}</span>
        <span className="text-muted-foreground/60">&gt;</span>
        <span className="text-foreground line-clamp-1 max-w-[150px] sm:max-w-none">{property.title}</span>
      </nav>

      {/* Navigation & Actions Header */}
      <div className="flex items-center justify-between">
        <Link href="/properties">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer rounded-xl">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Listings</span>
          </Button>
        </Link>
        <PropertyDetailsActions property={property} />
      </div>

      {/* Property Image Gallery */}
      <ImageGallery images={property.images} />

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* Left Column: Property Details & Info */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <PropertySpecs property={property} />

          {/* Seller Contact Card for Mobile/Tablet */}
          <div className="block lg:hidden">
            <SellerContactCard property={property} />
          </div>

          {/* Locality Price Trends section */}
          <PriceTrends address={property.location.address} city={property.location.city} />

          {/* Nearby Places Map */}
          {property.location.coordinates && (
            <NearbyMapWrapper 
              lat={property.location.coordinates.lat} 
              lng={property.location.coordinates.lng} 
              title={property.title} 
            />
          )}

        </div>

        {/* Right Column: Agent Info & Sticky Contact Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <aside className="sticky top-24 flex flex-col gap-6">
            <SellerContactCard property={property} />
          </aside>
        </div>

      </div>

      {/* Similar Properties Section */}
      <SimilarProperties 
        currentPropertyId={property.id} 
        city={property.location.city} 
        type={property.type} 
      />
    </div>
  );
}

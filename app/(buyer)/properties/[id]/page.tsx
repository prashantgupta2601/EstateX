import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockProperties } from '@/lib/mock-data/properties';
import ImageGallery from '@/components/property/image-gallery';
import PropertySpecs from '@/components/property/property-specs';
import SellerContactCard from '@/components/property/seller-contact-card';
import PropertyCard from '@/components/property/property-card';
import PropertyDetailsActions from '@/components/property/property-details-actions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SinglePropertyMapWrapper from '@/components/property/single-property-map-wrapper';

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    notFound();
  }

  // Find 3 similar properties (in the same city, or same type, excluding current)
  const similarProperties = mockProperties
    .filter((p) => p.id !== property.id && (p.location.city === property.location.city || p.type === property.type))
    .slice(0, 3);



  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 py-6 md:py-10 flex flex-col gap-6 text-left animate-fade-in">
        
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

            {/* Map Location */}
            {property.location.coordinates && (
              <section className="text-left flex flex-col gap-4">
                <h2 className="text-xl font-bold text-foreground">Location Map</h2>
                <SinglePropertyMapWrapper 
                  lat={property.location.coordinates.lat} 
                  lng={property.location.coordinates.lng} 
                  title={property.title} 
                  address={property.location.address}
                />
              </section>
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
        {similarProperties.length > 0 && (
          <section className="text-left mt-10 pt-10 border-t border-border/40">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-6">Similar Properties You May Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((similarProp) => (
                <div key={similarProp.id} className="h-full">
                  <PropertyCard property={similarProp} />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

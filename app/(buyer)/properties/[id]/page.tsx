import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockProperties } from '@/lib/mock-data/properties';
import ImageGallery from '@/components/property/image-gallery';
import PropertySpecs from '@/components/property/property-specs';
import SellerContactCard from '@/components/property/seller-contact-card';
import PriceTrends from '@/components/property/price-trends';
import SimilarProperties from '@/components/property/similar-properties';
import PropertyDetailsActions from '@/components/property/property-details-actions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import NearbyMapWrapper from '@/components/property/nearby-map-wrapper';

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyDetailsPageProps) {
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
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    notFound();
  }



  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 py-6 md:py-10 flex flex-col gap-6 text-left animate-fade-in">
        
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
    </div>
  );
}

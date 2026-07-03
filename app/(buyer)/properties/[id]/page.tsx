import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockProperties } from '@/lib/mock-data/properties';
import ImageGallery from '@/components/property/image-gallery';
import PropertySpecs from '@/components/property/property-specs';
import PropertyCard from '@/components/property/property-card';
import InquiryForm from '@/components/property/inquiry-form';
import PropertyDetailsActions from '@/components/property/property-details-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Mail, 
  Phone, 
  ArrowLeft
} from 'lucide-react';
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
              
              {/* Agent Card */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-md flex flex-col gap-5 text-left">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border border-border">
                    {property.agent.image ? (
                      <AvatarImage src={property.agent.image} alt={property.agent.name} className="object-cover animate-fade-in" />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                      {property.agent.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-foreground">{property.agent.name}</h3>
                    {property.agent.isVerified && property.agent.role && (
                      <Badge className={`w-fit mt-1 border-none font-bold text-[9px] uppercase tracking-wider ${
                        property.agent.role === 'owner' 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}>
                        {property.agent.role === 'owner' ? 'Verified Owner' : 'Verified Broker'}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                      <strong>{property.agent.rating || 4.8}</strong> Rating
                    </span>
                  </div>
                </div>

                <hr className="border-border/60" />

                <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span>{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <span className="break-all">{property.agent.email}</span>
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* Inquiry Form component */}
                <InquiryForm propertyTitle={property.title} agentName={property.agent.name} />

              </div>

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

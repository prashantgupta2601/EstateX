import React, { Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { mockProperties } from '@/lib/mock-data/properties';
import PropertyGallery from '@/components/property/property-gallery';
import PropertyCard from '@/components/property/property-card';
import InquiryForm from '@/components/property/inquiry-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dumbbell, 
  Waves, 
  Zap, 
  Flower, 
  Shield, 
  Wifi, 
  Car, 
  Smile, 
  ArrowUpCircle, 
  Home, 
  PhoneCall, 
  Sparkles,
  BedDouble, 
  Bath, 
  Square, 
  Calendar, 
  Building2, 
  MapPin, 
  Star, 
  Mail, 
  Phone, 
  ArrowLeft, 
  Heart, 
  Share2,
  ShieldCheck
} from 'lucide-react';
import { formatIndianCurrency } from '@/lib/utils/emi-calculator';
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

  // Helper function to resolve Lucide Icon for amenities
  const renderAmenityIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'dumbbell': return <Dumbbell className="h-5 w-5 text-primary shrink-0" />;
      case 'waves': return <Waves className="h-5 w-5 text-primary shrink-0" />;
      case 'zap': return <Zap className="h-5 w-5 text-primary shrink-0" />;
      case 'flower': return <Flower className="h-5 w-5 text-primary shrink-0" />;
      case 'shield': return <Shield className="h-5 w-5 text-primary shrink-0" />;
      case 'wifi': return <Wifi className="h-5 w-5 text-primary shrink-0" />;
      case 'car': return <Car className="h-5 w-5 text-primary shrink-0" />;
      case 'smile': return <Smile className="h-5 w-5 text-primary shrink-0" />;
      case 'arrowupcircle': return <ArrowUpCircle className="h-5 w-5 text-primary shrink-0" />;
      case 'home': return <Home className="h-5 w-5 text-primary shrink-0" />;
      case 'phonecall': return <PhoneCall className="h-5 w-5 text-primary shrink-0" />;
      default: return <Sparkles className="h-5 w-5 text-primary shrink-0" />;
    }
  };

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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" className="rounded-full cursor-pointer hover:bg-muted" aria-label="Share property">
              <Share2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
            <Button variant="outline" size="icon-sm" className="rounded-full cursor-pointer hover:bg-muted" aria-label="Add to favorites">
              <Heart className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
        </div>

        {/* Title and Price Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 pb-6 border-b border-border/40">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className="bg-primary text-primary-foreground border-none font-bold px-3 py-0.5 rounded-md text-xs uppercase tracking-wider">
                For {property.type === 'sale' ? 'Sale' : 'Rent'}
              </Badge>
              {property.isVerified && (
                <Badge className="bg-success text-success-foreground border-none font-bold px-3 py-0.5 rounded-md text-xs flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified Listing</span>
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {property.title}
            </h1>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}</span>
            </p>
          </div>
          <div className="flex flex-col md:text-right shrink-0">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Asking Price</span>
            <span className="text-2xl md:text-3xl font-extrabold text-primary">
              {formatIndianCurrency(property.price)}
              {property.type === 'rent' && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
            </span>
          </div>
        </div>

        {/* Property Image Gallery */}
        <PropertyGallery images={property.images} />

        {/* Details Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
          
          {/* Left Column: Property Details & Info */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Core Overview Specs */}
            <section className="bg-card/30 border border-border/60 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Property Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                
                {/* Bedrooms */}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <BedDouble className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bedrooms</span>
                    <span className="text-sm font-bold text-foreground">{property.bedrooms} BHK</span>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Bath className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bathrooms</span>
                    <span className="text-sm font-bold text-foreground">{property.bathrooms} Baths</span>
                  </div>
                </div>

                {/* Area */}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Square className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Super Area</span>
                    <span className="text-sm font-bold text-foreground">{property.area.toLocaleString()} {property.areaUnit || 'sqft'}</span>
                  </div>
                </div>

                {/* Year Built */}
                {property.yearBuilt && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Year Built</span>
                      <span className="text-sm font-bold text-foreground">{property.yearBuilt}</span>
                    </div>
                  </div>
                )}

                {/* Parking Spaces */}
                {property.parkingSpaces !== undefined && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <Car className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Parking</span>
                      <span className="text-sm font-bold text-foreground">{property.parkingSpaces > 0 ? `${property.parkingSpaces} Spaces` : 'No Reserved'}</span>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Listing Status</span>
                    <span className="text-sm font-bold text-foreground capitalize">{property.status}</span>
                  </div>
                </div>

              </div>
            </section>

            {/* Description */}
            <section className="text-left">
              <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </section>

            {/* Amenities Grid */}
            <section className="text-left">
              <h2 className="text-xl font-bold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card/25 hover:bg-card/45 transition-colors">
                    {renderAmenityIcon(amenity.icon)}
                    <span className="text-xs font-semibold text-foreground">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </section>

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
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
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

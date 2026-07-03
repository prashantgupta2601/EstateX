'use client';

import React from 'react';
import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Bed, 
  Bath, 
  Maximize, 
  Layers, 
  Calendar, 
  Armchair, 
  Car,
  Dumbbell,
  Waves,
  Zap,
  ArrowUpDown,
  Shield,
  Droplet,
  ChefHat,
  Flower,
  Building,
  Wifi,
  AirVent,
  Coffee,
  Sparkles
} from 'lucide-react';

interface PropertySpecsProps {
  property: Property;
}

export default function PropertySpecs({ property }: PropertySpecsProps) {
  // Format Price in Indian Rupees
  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    let formatted = '';
    if (price >= 10000000) {
      formatted = `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      formatted = `₹${(price / 100000).toFixed(1)} Lac`;
    } else {
      formatted = `₹${price.toLocaleString('en-IN')}`;
    }
    return type === 'rent' ? `${formatted}/mo` : formatted;
  };

  // Calculate Price per Sqft (only for sale)
  const pricePerSqft = property.type === 'sale' && property.area > 0
    ? Math.round(property.price / property.area)
    : null;

  // Calculate Age of Property
  const currentYear = new Date().getFullYear();
  const propertyAge = property.yearBuilt 
    ? `${currentYear - property.yearBuilt} Years`
    : 'New Construction';

  // Helper to get Lucide icon for amenities
  const getAmenityIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'dumbbell': return <Dumbbell className="h-5 w-5 text-primary shrink-0" />;
      case 'waves': return <Waves className="h-5 w-5 text-primary shrink-0" />;
      case 'zap': return <Zap className="h-5 w-5 text-primary shrink-0" />;
      case 'arrowupdown':
      case 'lift': return <ArrowUpDown className="h-5 w-5 text-primary shrink-0" />;
      case 'shield':
      case 'security': return <Shield className="h-5 w-5 text-primary shrink-0" />;
      case 'droplet': return <Droplet className="h-5 w-5 text-primary shrink-0" />;
      case 'chefhat': return <ChefHat className="h-5 w-5 text-primary shrink-0" />;
      case 'flower': return <Flower className="h-5 w-5 text-primary shrink-0" />;
      case 'building': return <Building className="h-5 w-5 text-primary shrink-0" />;
      case 'wifi': return <Wifi className="h-5 w-5 text-primary shrink-0" />;
      case 'airvent': return <AirVent className="h-5 w-5 text-primary shrink-0" />;
      case 'coffee': return <Coffee className="h-5 w-5 text-primary shrink-0" />;
      default: return <Sparkles className="h-5 w-5 text-primary shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Title & Price Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          {property.isVerified && (
            <Badge className="bg-success text-success-foreground border-none font-bold px-3 py-0.5 rounded-md text-xs flex items-center gap-1 shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Listing</span>
            </Badge>
          )}
          <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-0.5 rounded-md text-xs uppercase tracking-wider">
            For {property.type === 'sale' ? 'Sale' : 'Rent'}
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border/40">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              {property.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
            </p>
          </div>
          
          <div className="flex flex-col md:items-end shrink-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Asking Price</span>
            <span className="text-3xl font-black text-primary">
              {formatPrice(property.price, property.type)}
            </span>
            {pricePerSqft && (
              <span className="text-xs text-muted-foreground font-semibold mt-1">
                ₹{pricePerSqft.toLocaleString('en-IN')}/{property.areaUnit || 'sqft'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Key Specs Grid */}
      <section className="bg-card/25 border border-border/60 rounded-3xl p-6 shadow-xs">
        <h3 className="text-lg font-bold text-foreground mb-4">Property Specifications</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {/* BHK */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Bed className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bedrooms</span>
              <span className="text-sm font-bold text-foreground">{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A'}</span>
            </div>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Bath className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bathrooms</span>
              <span className="text-sm font-bold text-foreground">{property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'N/A'}</span>
            </div>
          </div>

          {/* Area */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Maximize className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Super Area</span>
              <span className="text-sm font-bold text-foreground">
                {property.area.toLocaleString()} {property.areaUnit || 'sqft'}
              </span>
            </div>
          </div>

          {/* Floor */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Floor</span>
              <span className="text-sm font-bold text-foreground">
                {property.floor && property.totalFloors 
                  ? `${property.floor} of ${property.totalFloors}`
                  : 'Ground Floor'}
              </span>
            </div>
          </div>

          {/* Property Age */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Age of Property</span>
              <span className="text-sm font-bold text-foreground">{propertyAge}</span>
            </div>
          </div>

          {/* Furnishing */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Armchair className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Furnishing</span>
              <span className="text-sm font-bold text-foreground">{property.furnishingStatus || 'Unfurnished'}</span>
            </div>
          </div>

          {/* Parking */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Car className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Parking</span>
              <span className="text-sm font-bold text-foreground">
                {property.parkingSpaces && property.parkingSpaces > 0
                  ? `${property.parkingSpaces} Covered`
                  : 'No Reserved'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* About this Property */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xl font-bold text-foreground">About this Property</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {property.description}
        </p>
      </section>

      {/* Amenities Grid */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-foreground">Amenities</h3>
        {property.amenities && property.amenities.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {property.amenities.map((amenity) => (
              <div 
                key={amenity.id} 
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card/20 hover:bg-card/45 hover:border-border-hover transition-all duration-300"
              >
                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                  {getAmenityIcon(amenity.icon || amenity.name)}
                </div>
                <span className="text-xs font-bold text-foreground">{amenity.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No amenities specified for this property.</p>
        )}
      </section>
    </div>
  );
}

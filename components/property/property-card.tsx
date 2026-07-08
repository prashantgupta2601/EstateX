'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Bed, Maximize, ShieldCheck, GitCompare } from 'lucide-react';
import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/lib/hooks/use-comparison';
import { useWishlist } from '@/lib/hooks/use-wishlist';
import { toast } from '@/components/ui/toast';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { addToCompare, removeFromCompare, isInCompare, isMounted } = useComparison();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isMounted ? isInWishlist(property.id) : false;
  const isCompared = isMounted ? isInCompare(property.id) : false;

  // Format Price in Indian Rupees (Lakhs/Crores)
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

  return (
    <div className={`group flex flex-col h-full rounded-2xl border bg-card text-card-foreground shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden ${
      isCompared
        ? 'border-primary ring-1 ring-primary/20 bg-primary/[0.01]'
        : 'border-border/60'
    }`}>
      {/* Image & Badge Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {property.images?.[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No Image Available
          </div>
        )}

        {/* Gradient Overlay for visual quality */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Top Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Verified Badge */}
          {property.isVerified ? (
            <Badge className="bg-success text-success-foreground border-none flex items-center gap-1 shadow-sm px-2.5 py-0.5 rounded-full text-xs font-semibold pointer-events-auto">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified</span>
            </Badge>
          ) : (
            <div />
          )}

          {/* Action Buttons (Wishlist & Compare) */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Compare Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isCompared) {
                  removeFromCompare(property.id);
                } else {
                  addToCompare(property.id);
                }
              }}
              className={`p-2 rounded-full backdrop-blur-md border shadow-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isCompared
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-white/80 dark:bg-black/50 border-white/20 text-muted-foreground hover:text-foreground'
              }`}
              aria-label={isCompared ? `Remove ${property.title} from comparison` : `Add ${property.title} to comparison`}
            >
              <GitCompare className="h-4 w-4" />
            </button>

            {/* Wishlist Heart Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isWishlisted) {
                  removeFromWishlist(property.id);
                  toast("Removed from Wishlist");
                } else {
                  addToWishlist(property.id);
                  toast("Added to Wishlist");
                }
              }}
              className={`p-2 rounded-full backdrop-blur-md border shadow-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isWishlisted
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-white/80 dark:bg-black/50 border-white/20 text-muted-foreground hover:text-foreground'
              }`}
              aria-label={isWishlisted ? `Remove ${property.title} from wishlist` : `Add ${property.title} to wishlist`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Listing Type Tag (Buy/Rent) */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="capitalize text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
            For {property.type}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="flex flex-col flex-1 p-4 md:p-5">
        {/* Price & Primary Specs */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            {formatPrice(property.price, property.type)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold line-clamp-1 text-foreground mb-1 hover:text-primary transition-colors">
          <Link href={`/properties/${property.id}`} className="focus-visible:outline-none focus-visible:underline decoration-primary decoration-2">{property.title}</Link>
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="line-clamp-1">
            {property.location.address}, {property.location.city}
          </span>
        </div>

        {/* Core Specs Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/40 text-xs text-muted-foreground mb-5 mt-auto">
          {property.bedrooms > 0 ? (
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-muted-foreground/80 shrink-0" />
              <span>{property.bedrooms} BHK Apartment</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="capitalize font-medium text-foreground/80">{property.propertyType}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 justify-end">
            <Maximize className="h-4 w-4 text-muted-foreground/80 shrink-0" />
            <span>{property.area.toLocaleString()} {property.areaUnit || 'sqft'}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/properties/${property.id}`} className="w-full focus-visible:outline-none">
          <Button
            variant="outline"
            className="w-full h-9 rounded-xl font-semibold border-primary/20 text-primary hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          >
            View Details
          </Button>
        </Link>

        {/* Compare Checkbox */}
        <div className="mt-3 flex items-center justify-center border-t border-border/30 pt-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer select-none py-0.5">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={(e) => {
                e.stopPropagation();
                if (isCompared) {
                  removeFromCompare(property.id);
                } else {
                  addToCompare(property.id);
                }
              }}
              className="rounded border-border text-primary focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary h-3.5 w-3.5 cursor-pointer accent-primary"
            />
            <span>Compare Property</span>
          </label>
        </div>
      </div>
    </div>
  );
}

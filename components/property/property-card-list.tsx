'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Bed, Maximize, ShieldCheck, Calendar } from 'lucide-react';
import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PropertyCardListProps {
  property: Property;
}

export default function PropertyCardList({ property }: PropertyCardListProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const postedDate = new Date(property.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group flex flex-col sm:flex-row rounded-2xl border border-border/60 bg-card text-card-foreground shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full sm:w-72 md:w-80 shrink-0 aspect-video sm:aspect-auto sm:min-h-[220px] overflow-hidden bg-muted">
        {property.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No Image Available
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {property.isVerified ? (
            <Badge className="bg-success text-success-foreground border-none flex items-center gap-1 shadow-sm px-2.5 py-0.5 rounded-full text-xs font-semibold pointer-events-auto">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified</span>
            </Badge>
          ) : (
            <div />
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={`p-2 rounded-full backdrop-blur-md border shadow-md transition-all duration-300 pointer-events-auto hover:scale-110 active:scale-95 ${
              isWishlisted
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-white/80 dark:bg-black/50 border-white/20 text-muted-foreground hover:text-foreground'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Listing Type Tag */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="capitalize text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
            For {property.type}
          </span>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col flex-1 p-4 md:p-5 gap-2">
        {/* Price */}
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold tracking-tight text-foreground">
            {formatPrice(property.price, property.type)}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
            <Calendar className="h-3 w-3" />
            <span>{postedDate}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold line-clamp-1 text-foreground hover:text-primary transition-colors">
          <Link href={`/properties/${property.id}`}>{property.title}</Link>
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="line-clamp-1">
            {property.location.address}, {property.location.city}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-1 leading-relaxed">
          {property.description}
        </p>

        {/* Specs + Action Row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {property.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-muted-foreground/80 shrink-0" />
                <span>{property.bedrooms} BHK</span>
              </div>
            ) : (
              <span className="capitalize font-medium text-foreground/80">{property.propertyType}</span>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-muted-foreground/80 shrink-0" />
              <span>{property.area.toLocaleString()} {property.areaUnit || 'sqft'}</span>
            </div>
          </div>

          <Link href={`/properties/${property.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl font-semibold border-primary/20 text-primary hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

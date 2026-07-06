'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Check, Minus, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/lib/hooks/use-wishlist';
import { toast } from '@/components/ui/toast';

interface ComparisonTableProps {
  compareList: Property[];
  removeFromCompare: (id: string) => void;
}

export default function ComparisonTable({ compareList, removeFromCompare }: ComparisonTableProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Calculate highlights
  const minPrice = useMemo(() => {
    return Math.min(...compareList.map((p) => p.price));
  }, [compareList]);

  const minPricePerSqft = useMemo(() => {
    return Math.min(...compareList.map((p) => p.price / p.area));
  }, [compareList]);

  const maxArea = useMemo(() => {
    return Math.max(...compareList.map((p) => p.area));
  }, [compareList]);

  // 2. Format Price
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

  const getFurnishingStatus = (desc: string) => {
    const d = desc.toLowerCase();
    if ((d.includes('fully furnished') || d.includes('furnished')) && !d.includes('semi-furnished') && !d.includes('semi furnished')) {
      return 'Furnished';
    }
    if (d.includes('semi-furnished') || d.includes('semi furnished')) {
      return 'Semi-Furnished';
    }
    return 'Unfurnished';
  };

  // Determine dynamic column widths: specs + properties
  // If we have 2 properties compared, we split: specs = 20%, properties = 40% each
  // If 3 properties: specs = 16%, properties = 28% each
  // If 4 properties: specs = 16%, properties = 21% each
  const colWidthClass = compareList.length === 2 
    ? 'w-[40%]' 
    : compareList.length === 3 
      ? 'w-[28%]' 
      : 'w-[21%]';

  const specsColWidthClass = compareList.length === 2 
    ? 'w-[20%]' 
    : 'w-[16%]';

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-border bg-card/15 shadow-sm max-w-full">
      <table className="w-full border-collapse min-w-[800px] text-left table-fixed">
        <thead>
          <tr className="border-b border-border/60 bg-muted/20">
            {/* Sticky Label Column Header */}
            <th className={`p-5 font-bold text-sm text-muted-foreground ${specsColWidthClass} align-top sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>
              Property Specs
            </th>
            
            {/* Property Column Headers */}
            {compareList.map((property) => (
              <th key={property.id} className={`p-5 font-bold text-foreground ${colWidthClass} align-top border-l border-border/40 relative bg-card/30 z-10`}>
                {/* Remove button */}
                <button
                  onClick={() => removeFromCompare(property.id)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-muted/60 text-muted-foreground hover:bg-red-500 hover:text-white hover:scale-105 transition-all duration-200 cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="flex flex-col gap-3 pr-6">
                  {/* Image */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
                    {property.images?.[0] ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 150px, 200px"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Title & Location */}
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground line-clamp-2 min-h-[2.5rem] leading-tight hover:text-primary transition-colors">
                      <Link href={`/properties/${property.id}`}>{property.title}</Link>
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1 font-semibold">
                      {property.location.city}, {property.location.state}
                    </p>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-border/40 text-xs">
          
          {/* Price */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Price</td>
            {compareList.map((property) => {
              const isBest = property.price === minPrice;
              return (
                <td 
                  key={property.id} 
                  className={`p-4 text-sm border-l border-border/40 transition-colors ${
                    isBest 
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-black' 
                      : 'font-extrabold text-primary'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{formatPrice(property.price, property.type)}</span>
                    {isBest && <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold font-mono">Lowest</span>}
                  </div>
                </td>
              );
            })}
          </tr>

          {/* Price per sqft */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Price per Sqft</td>
            {compareList.map((property) => {
              const pricePerSqft = property.price / property.area;
              const isBest = pricePerSqft === minPricePerSqft;
              return (
                <td 
                  key={property.id} 
                  className={`p-4 border-l border-border/40 transition-colors font-semibold ${
                    isBest 
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-black' 
                      : 'text-foreground/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>₹{Math.round(pricePerSqft).toLocaleString('en-IN')}/sqft</span>
                    {isBest && <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold font-mono">Best Value</span>}
                  </div>
                </td>
              );
            })}
          </tr>

          {/* BHK */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>BHK / Bedrooms</td>
            {compareList.map((property) => (
              <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40 font-medium">
                {property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A'}
              </td>
            ))}
          </tr>

          {/* Area */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Super Area</td>
            {compareList.map((property) => {
              const isBest = property.area === maxArea;
              return (
                <td 
                  key={property.id} 
                  className={`p-4 border-l border-border/40 transition-colors font-semibold ${
                    isBest 
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-black' 
                      : 'text-foreground/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{property.area.toLocaleString()} {property.areaUnit || 'sqft'}</span>
                    {isBest && <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold font-mono">Largest</span>}
                  </div>
                </td>
              );
            })}
          </tr>

          {/* Property Type */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Property Type</td>
            {compareList.map((property) => (
              <td key={property.id} className="p-4 text-foreground/80 capitalize border-l border-border/40 font-semibold">
                {property.propertyType}
              </td>
            ))}
          </tr>

          {/* Furnishing */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Furnishing</td>
            {compareList.map((property) => (
              <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40 font-medium">
                {property.furnishingStatus || getFurnishingStatus(property.description)}
              </td>
            ))}
          </tr>

          {/* Floor */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Floor Preference</td>
            {compareList.map((property) => (
              <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40 font-medium">
                {property.floor !== undefined && property.totalFloors !== undefined
                  ? `${property.floor} of ${property.totalFloors}`
                  : 'N/A'}
              </td>
            ))}
          </tr>

          {/* Parking */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Parking</td>
            {compareList.map((property) => (
              <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40">
                {property.parkingSpaces !== undefined && property.parkingSpaces > 0 
                  ? `${property.parkingSpaces} Spaces` 
                  : 'No Reserved'}
              </td>
            ))}
          </tr>

          {/* Amenities */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Amenities</td>
            {compareList.map((property) => (
              <td key={property.id} className="p-4 text-foreground/70 border-l border-border/40 leading-relaxed font-medium">
                {property.amenities.map(a => a.name).join(', ') || 'N/A'}
              </td>
            ))}
          </tr>

          {/* Locality */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Locality</td>
            {compareList.map((property) => (
              <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40 font-medium">
                {property.location.address}
              </td>
            ))}
          </tr>

          {/* City */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>City</td>
            {compareList.map((property) => (
              <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40 font-semibold">
                {property.location.city}
              </td>
            ))}
          </tr>

          {/* Verification */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Verification</td>
            {compareList.map((property) => (
              <td key={property.id} className="p-4 border-l border-border/40">
                {property.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                    <Minus className="h-3.5 w-3.5" />
                    <span>Unverified</span>
                  </span>
                )}
              </td>
            ))}
          </tr>

          {/* Posted By */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-4 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Posted By</td>
            {compareList.map((property) => (
              <td key={property.id} className="p-4 text-foreground/80 capitalize border-l border-border/40 font-semibold">
                {property.agent.role}
              </td>
            ))}
          </tr>

          {/* Action Row */}
          <tr className="hover:bg-muted/10 transition-colors">
            <td className={`p-5 font-bold text-muted-foreground bg-muted/5 sticky left-0 bg-card dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]`}>Actions</td>
            {compareList.map((property) => {
              const isWishlisted = isMounted ? isInWishlist(property.id) : false;
              return (
                <td key={property.id} className="p-5 border-l border-border/40">
                  <div className="flex flex-col gap-2.5">
                    {/* View Details Button */}
                    <Link href={`/properties/${property.id}`} className="w-full">
                      <Button className="w-full rounded-xl text-[10px] font-bold bg-primary hover:bg-primary/95 text-primary-foreground h-9 cursor-pointer flex items-center justify-center gap-1">
                        <span>View Details</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>

                    {/* Wishlist Button */}
                    <Button
                      variant={isWishlisted ? 'destructive' : 'outline'}
                      onClick={() => {
                        if (isWishlisted) {
                          removeFromWishlist(property.id);
                          toast('Removed from Wishlist');
                        } else {
                          addToWishlist(property.id);
                          toast('Added to Wishlist');
                        }
                      }}
                      className="w-full rounded-xl text-[10px] font-bold h-9 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                      <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                    </Button>
                  </div>
                </td>
              );
            })}
          </tr>

        </tbody>
      </table>
    </div>
  );
}

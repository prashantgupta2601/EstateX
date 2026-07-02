'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, GitCompare, ArrowLeft, Check, Minus, ShieldCheck, ExternalLink } from 'lucide-react';
import { useEstate } from '@/lib/context/estate-context';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, isMounted } = useEstate();

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

  const checkHasAmenity = (property: Property, query: string) => {
    return property.amenities.some((a) => {
      const name = a.name.toLowerCase();
      return name.includes(query.toLowerCase());
    });
  };

  const keyAmenities = [
    { label: 'Swimming Pool', query: 'pool' },
    { label: 'Gym / Fitness', query: 'gym' },
    { label: 'Power Backup', query: 'power' },
    { label: 'Reserved Parking', query: 'parking' },
    { label: 'Elevator / Lift', query: 'lift' },
    { label: '24x7 Security', query: 'security' },
    { label: 'Free Wi-Fi', query: 'wifi' },
  ];

  if (!isMounted) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-pulse">
        <div className="pb-6 border-b border-border/40">
          <div className="h-9 w-48 bg-muted rounded-xl mb-2" />
          <div className="h-4 w-64 bg-muted rounded-md" />
        </div>
        <div className="h-96 w-full bg-card/25 rounded-3xl border border-border/40" />
      </div>
    );
  }

  // State 1: Completely Empty Comparison List
  if (compareList.length === 0) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-fade-in">
        <div className="pb-6 border-b border-border/40">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Compare Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">Compare details and pricing side-by-side.</p>
        </div>
        
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border/85 rounded-3xl bg-card/25 min-h-[450px]">
          <div className="p-4.5 rounded-full bg-primary/10 text-primary mb-5">
            <GitCompare className="h-8 w-8 stroke-[2]" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No Properties Selected</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            You haven&apos;t added any properties to compare yet. Go back to listings and click the compare icon on any property.
          </p>
          <Link href="/properties" className="mt-6">
            <Button className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 shadow-md cursor-pointer flex items-center gap-1.5 h-11">
              <ArrowLeft className="h-4 w-4" />
              <span>Browse Properties</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // State 2: Only 1 Property Selected (Need at least 2)
  if (compareList.length === 1) {
    const singleProperty = compareList[0];
    return (
      <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-fade-in">
        <div className="pb-6 border-b border-border/40">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Compare Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">Compare details and pricing side-by-side.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main message */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start justify-center py-16 px-6 text-center lg:text-left border border-dashed border-border/85 rounded-3xl bg-card/25 min-h-[350px]">
            <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
              <GitCompare className="h-7 w-7 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Add More Properties</h3>
            <p className="mt-2 text-xs text-muted-foreground max-w-md leading-relaxed">
              You have selected **{singleProperty.title}** for comparison. Select at least one more property from listings to view their side-by-side details.
            </p>
            <div className="flex gap-3 items-center mt-6">
              <Link href="/properties">
                <Button className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 shadow-md cursor-pointer text-xs h-10">
                  Browse Properties
                </Button>
              </Link>
              <button
                onClick={clearCompare}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Clear comparison list
              </button>
            </div>
          </div>

          {/* Current selected property card review */}
          <div className="lg:col-span-5 flex flex-col gap-4 border border-border/60 bg-card rounded-2xl p-4 shadow-sm relative overflow-hidden max-w-sm mx-auto w-full">
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                onClick={() => removeFromCompare(singleProperty.id)}
                className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
              {singleProperty.images?.[0] ? (
                <Image
                  src={singleProperty.images[0]}
                  alt={singleProperty.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            <div>
              <span className="text-lg font-extrabold text-foreground block">
                {formatPrice(singleProperty.price, singleProperty.type)}
              </span>
              <h4 className="font-bold text-sm text-foreground line-clamp-1 mt-1">
                {singleProperty.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {singleProperty.location.address}, {singleProperty.location.city}
              </p>
              <Link href={`/properties/${singleProperty.id}`} className="mt-4 block">
                <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold border-primary/20 text-primary hover:bg-primary/5 cursor-pointer">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 3: 2 or 3 properties selected (Renders comparison table)
  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Compare Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">Compare details and specifications side-by-side.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/properties">
            <Button variant="outline" size="sm" className="rounded-xl font-semibold border-border text-foreground hover:bg-muted cursor-pointer flex items-center gap-1.5 h-10 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Listings</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={clearCompare}
            className="text-xs font-bold text-muted-foreground hover:text-red-500 cursor-pointer h-10 px-3 rounded-xl hover:bg-red-500/5 transition-colors"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Comparison Grid container (Horizontal Scrollable for responsive view) */}
      <div className="w-full overflow-x-auto rounded-3xl border border-border bg-card/15 shadow-sm max-w-full">
        <table className="w-full border-collapse min-w-[700px] text-left table-fixed">
          <thead>
            <tr className="border-b border-border/60 bg-muted/20">
              {/* Row Header column */}
              <th className="p-5 font-bold text-sm text-muted-foreground w-1/4 align-top">
                Property Specs
              </th>
              
              {/* Property columns */}
              {compareList.map((property) => (
                <th key={property.id} className="p-5 font-bold text-foreground w-1/4 align-top border-l border-border/40 relative">
                  {/* Remove Column button */}
                  <button
                    onClick={() => removeFromCompare(property.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-muted/65 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                    title="Remove from comparison"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex flex-col gap-3 pr-6">
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
                      {property.images?.[0] ? (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    {/* Title */}
                    <div>
                      <h3 className="text-sm font-extrabold text-foreground line-clamp-2 min-h-[2.5rem] leading-tight">
                        {property.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">
                        {property.location.city}, {property.location.state}
                      </p>
                    </div>
                  </div>
                </th>
              ))}

              {/* Dummy Column if less than 3 properties, to prompt selection */}
              {compareList.length < 3 && (
                <th className="p-5 font-bold text-foreground w-1/4 align-top border-l border-border/40 bg-muted/5">
                  <div className="flex flex-col items-center justify-center h-full min-h-[140px] border-2 border-dashed border-border/60 rounded-2xl p-4 text-center">
                    <span className="text-xs font-bold text-muted-foreground block mb-2">Compare Another?</span>
                    <Link href="/properties">
                      <Button size="sm" className="rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[10px] font-bold h-8 cursor-pointer">
                        Add Property
                      </Button>
                    </Link>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border/40 text-xs">
            {/* Price */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Price</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 font-extrabold text-primary text-sm border-l border-border/40">
                  {formatPrice(property.price, property.type)}
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* Location */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Location</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 text-foreground/90 border-l border-border/40 leading-relaxed">
                  {property.location.address}, {property.location.city}
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* Property Type */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Property Type</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 text-foreground/80 capitalize border-l border-border/40 font-semibold">
                  {property.propertyType}
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* Purpose */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Purpose</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 border-l border-border/40">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    property.type === 'sale' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                  }`}>
                    For {property.type === 'sale' ? 'Buy / Sale' : 'Rent'}
                  </span>
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* BHK / Bedrooms */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">BHK / Bedrooms</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40 font-medium">
                  {property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A'}
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* Bathrooms */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Bathrooms</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40 font-medium">
                  {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* Super Area */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Super Area</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40 font-semibold">
                  {property.area.toLocaleString()} {property.areaUnit || 'sqft'}
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* Furnishing */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Furnishing</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40">
                  {getFurnishingStatus(property.description)}
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* Year Built */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Year Built</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40">
                  {property.yearBuilt || 'N/A'}
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* Parking */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Parking</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 text-foreground/80 border-l border-border/40">
                  {property.parkingSpaces !== undefined && property.parkingSpaces > 0 
                    ? `${property.parkingSpaces} Spaces` 
                    : 'No Reserved'}
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* Verified Status */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Verification</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 border-l border-border/40">
                  {property.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                      Unverified
                    </span>
                  )}
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>

            {/* Popular Amenities Rows */}
            {keyAmenities.map((amenity) => (
              <tr key={amenity.label}>
                <td className="p-4 font-bold text-muted-foreground bg-muted/5">{amenity.label}</td>
                {compareList.map((property) => {
                  const hasAmenity = checkHasAmenity(property, amenity.query);
                  return (
                    <td key={property.id} className="p-4 border-l border-border/40">
                      {hasAmenity ? (
                        <div className="p-1 rounded-full bg-success/10 text-success w-fit">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-full bg-muted/40 text-muted-foreground/60 w-fit">
                          <Minus className="h-4 w-4" />
                        </div>
                      )}
                    </td>
                  );
                })}
                {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
              </tr>
            ))}

            {/* Action Row */}
            <tr>
              <td className="p-4 font-bold text-muted-foreground bg-muted/5">Actions</td>
              {compareList.map((property) => (
                <td key={property.id} className="p-4 border-l border-border/40">
                  <div className="flex flex-col gap-2">
                    <Link href={`/properties/${property.id}`} className="w-full">
                      <Button className="w-full rounded-xl text-[10px] font-bold bg-primary hover:bg-primary/95 text-primary-foreground h-9 cursor-pointer flex items-center justify-center gap-1">
                        <span>Details</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(property.id)}
                      className="w-full text-center text-[10px] font-bold text-red-500 hover:underline py-1.5 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              ))}
              {compareList.length < 3 && <td className="p-4 border-l border-border/40 bg-muted/5" />}
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

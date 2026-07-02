'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Search, ChevronRight } from 'lucide-react';
import { useEstate } from '@/lib/context/estate-context';
import { mockProperties } from '@/lib/mock-data/properties';
import PropertyCard from '@/components/property/property-card';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { wishlist, isMounted } = useEstate();

  // Filter properties in the wishlist
  const wishlistedProperties = mockProperties.filter((property) =>
    wishlist.includes(property.id)
  );

  if (!isMounted) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-pulse">
        <div className="pb-6 border-b border-border/40">
          <div className="h-9 w-48 bg-muted rounded-xl mb-2" />
          <div className="h-4 w-64 bg-muted rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4 border border-border/40 rounded-2xl p-4 bg-card/20">
              <div className="h-48 w-full bg-muted rounded-xl" />
              <div className="flex flex-col gap-2">
                <div className="h-5 w-5/6 bg-muted rounded-md" />
                <div className="h-4 w-2/3 bg-muted rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-fade-in">
      {/* Page Header */}
      <div className="pb-6 border-b border-border/40">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Your Wishlist
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {wishlistedProperties.length} {wishlistedProperties.length === 1 ? 'property' : 'properties'} saved.
        </p>
      </div>

      {wishlistedProperties.length > 0 ? (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlistedProperties.map((property) => (
            <div key={property.id} className="h-full">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border/85 rounded-3xl bg-card/25 min-h-[450px] animate-fade-in">
          <div className="p-4.5 rounded-full bg-red-500/10 text-red-500 mb-5 relative group">
            <Heart className="h-8 w-8 stroke-[2] group-hover:scale-110 transition-transform duration-300 fill-red-500/10" />
            <Search className="h-4 w-4 absolute bottom-2 right-2 text-primary bg-background dark:bg-black rounded-full p-0.5" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Your Wishlist is Empty</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            You haven&apos;t saved any properties yet. Explore our listings and click the heart icon on any property to save it here.
          </p>
          <Link href="/properties" className="mt-6">
            <Button className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 shadow-md cursor-pointer flex items-center gap-1.5 h-11">
              <span>Explore Properties</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import PropertyCard from '@/components/property/property-card';
import { mockProperties } from '@/lib/mock-data/properties';
import { Button } from '@/components/ui/button';

export default function FeaturedProperties() {
  // Only display properties marked as featured (in our mock data, they all are, but we'll show first 6 for visual spacing)
  const featuredListings = mockProperties.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="text-left">
            <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" /> Handpicked Collection
            </span>
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Featured Properties
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Explore our verified and hand-curated premier residential and commercial properties in prime locations.
            </p>
          </div>
          <Link href="/properties" className="shrink-0">
            <Button variant="outline" className="rounded-xl flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/5 cursor-pointer font-semibold">
              <span>Explore All Listings</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Responsive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredListings.map((property) => (
            <div key={property.id} className="h-full">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

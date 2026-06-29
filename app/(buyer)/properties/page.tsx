import React from 'react';
import { Metadata } from 'next';
import { mockProperties } from '@/lib/mock-data/properties';
import PropertyCard from '@/components/property/property-card';
import { SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Properties Listing | EstateX',
  description: 'Browse all verified and premium residential and commercial properties on EstateX.',
};

export default function PropertiesPage() {
  const properties = mockProperties;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/40 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Properties in India
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {properties.length} Properties Found
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-8 items-start">
        {/* Left Sidebar Placeholder (for future filters) */}
        <aside className="w-68 shrink-0 hidden lg:flex flex-col gap-6 p-6 rounded-2xl border border-border bg-card/50 min-h-[500px]">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <h2 className="font-bold text-base flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
            </h2>
            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">
              Clear All
            </span>
          </div>
          <div className="text-sm text-muted-foreground italic">
            Filter controls will be added in the next step.
          </div>
        </aside>

        {/* Right Main Grid Area */}
        <div className="flex-1">
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="h-full">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-2xl">
              <p className="font-semibold text-muted-foreground">No properties match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

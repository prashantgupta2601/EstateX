'use client';

import React, { useState } from 'react';
import { mockProperties } from '@/lib/mock-data/properties';
import PropertyCard from '@/components/property/property-card';
import FilterSidebar from '@/components/property/filter-sidebar';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function PropertiesListClient() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

        {/* Mobile Filters Trigger */}
        <div className="lg:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" className="flex items-center gap-2 rounded-xl border-border/80 text-foreground font-semibold px-4 cursor-pointer">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <span>Filters</span>
                </Button>
              }
            />
            <SheetContent side="right" className="p-6 overflow-y-auto max-w-xs sm:max-w-sm">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterSidebar onApply={() => setIsFilterOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sticky Sidebar */}
        <aside className="w-68 shrink-0 hidden lg:block sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
          <FilterSidebar className="p-6 rounded-2xl border border-border bg-card/50" />
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

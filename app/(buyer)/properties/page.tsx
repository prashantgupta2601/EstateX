import React, { Suspense } from 'react';
import { Metadata } from 'next';
import PropertiesListClient from '@/components/property/properties-list-client';
import { Skeleton } from '@/components/ui/skeleton';
import FilterSidebarSkeleton from '@/components/skeletons/filter-sidebar-skeleton';
import PropertyCardSkeleton from '@/components/skeletons/property-card-skeleton';
import { getProperties } from '@/lib/mock-data/api-simulation';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const purpose = resolvedParams.purpose;

  let title = 'Premium Properties in India | EstateX';
  let description = 'Browse verified and premium residential and commercial properties on EstateX.';

  if (purpose === 'buy') {
    title = 'Properties for Sale in India | EstateX';
    description = 'Explore premium homes, apartments, and villas for sale in India. Verified listings on EstateX.';
  } else if (purpose === 'rent') {
    title = 'Properties for Rent in India | EstateX';
    description = 'Find luxury flats, apartments, and commercial spaces for rent in India. Verified listings on EstateX.';
  } else if (purpose === 'commercial') {
    title = 'Commercial Real Estate in India | EstateX';
    description = 'Browse premium offices, retail spaces, and land for business on EstateX.';
  }

  return {
    title,
    description,
  };
}

function PropertiesListFallback() {
  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/40 gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-60 rounded-xl" />
          <Skeleton className="h-4 w-36 rounded-lg mt-1" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl md:self-end" />
      </div>

      {/* Main Skeleton Content */}
      <div className="flex gap-8 items-start w-full">
        {/* Sidebar Skeleton */}
        <aside className="w-68 shrink-0 hidden lg:block sticky top-24 max-h-[calc(100vh-120px)] p-6 rounded-2xl border border-border/60 bg-card/15">
          <FilterSidebarSkeleton />
        </aside>

        {/* Listings Grid Skeleton */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  const propertiesPromise = getProperties();

  return (
    <Suspense fallback={<PropertiesListFallback />}>
      <PropertiesListClient propertiesPromise={propertiesPromise} />
    </Suspense>
  );
}

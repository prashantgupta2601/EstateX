import React, { Suspense } from 'react';
import { Metadata } from 'next';
import PropertiesListClient from '@/components/property/properties-list-client';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Search Properties | EstateX',
  description: 'Search and filter verified premium residential and commercial properties on EstateX.',
};

function SearchListFallback() {
  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/45 gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-60 rounded-xl" />
          <Skeleton className="h-4 w-36 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl md:self-end" />
      </div>

      {/* Main Skeleton */}
      <div className="flex gap-8 items-start">
        {/* Sidebar Skeleton */}
        <aside className="w-68 shrink-0 hidden lg:flex flex-col gap-6 p-6 rounded-2xl border border-border/60 bg-card/30">
          <div className="flex justify-between items-center pb-4 border-b border-border/40">
            <Skeleton className="h-5 w-28 rounded-lg" />
            <Skeleton className="h-5 w-12 rounded-lg" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-6 w-full rounded-lg" />
          </div>
          <hr className="border-border/20" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
          </div>
        </aside>

        {/* Listings Grid Skeleton */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4 border border-border/40 rounded-2xl p-4 bg-card/20">
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchListFallback />}>
      <PropertiesListClient />
    </Suspense>
  );
}

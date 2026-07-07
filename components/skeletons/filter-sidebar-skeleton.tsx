'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function FilterSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border/40">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-12 rounded-md" />
      </div>

      {/* Purpose Tabs */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16 rounded-md" />
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-muted/20 border border-border/60 rounded-xl">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-7 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
      </div>

      {/* Property Types */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24 rounded-md" />
        <div className="flex flex-col gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4.5 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* BHK */}
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-4 w-14 rounded-md" />
        <div className="flex gap-2.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Furnishing */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      {/* Amenities */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-20 rounded-md" />
        <div className="flex flex-col gap-2.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4.5 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

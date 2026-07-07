'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/40 bg-card overflow-hidden">
      {/* Image Aspect ratio box */}
      <Skeleton className="aspect-video w-full" />

      {/* Details Box */}
      <div className="flex flex-col flex-1 p-4 md:p-5 gap-3.5">
        {/* Price Row */}
        <Skeleton className="h-6 w-1/3 rounded-md" />

        {/* Title */}
        <Skeleton className="h-5 w-5/6 rounded-md" />

        {/* Location */}
        <Skeleton className="h-4 w-1/2 rounded-md" />

        {/* Specs bar divider */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/40 text-xs mt-auto">
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md justify-self-end" />
        </div>

        {/* View button placeholder */}
        <Skeleton className="h-9 w-full rounded-xl" />

        {/* Compare label checkbox placeholder */}
        <div className="flex items-center justify-center border-t border-border/30 pt-3">
          <Skeleton className="h-4.5 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}

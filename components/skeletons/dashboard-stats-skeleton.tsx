'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardStatsSkeleton() {
  return (
    <div className="flex flex-col gap-6 text-left w-full animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-64 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md mt-1" />
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-12 rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-16 rounded-md mt-2" />
            </div>
          </Card>
        ))}
      </div>

      {/* Activity grid skeletons (matches the overview pages layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <Card className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 border border-border/60 bg-background/30 rounded-xl flex flex-col gap-2">
                <Skeleton className="h-4 w-2/3 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3 w-1/3 rounded-md mt-1" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 border border-border/60 bg-background/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3 w-full">
                  <Skeleton className="h-10 w-14 rounded-lg shrink-0" />
                  <div className="flex flex-col gap-1.5 w-full">
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <Skeleton className="h-3.5 w-1/4 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

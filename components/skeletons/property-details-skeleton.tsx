'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertyDetailsSkeleton() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 py-6 md:py-10 flex flex-col gap-6 text-left animate-pulse">
        {/* Breadcrumb Navigation */}
        <div className="flex gap-2 pb-2 border-b border-border/25">
          <Skeleton className="h-4.5 w-12 rounded-md" />
          <span className="text-muted-foreground/60">&gt;</span>
          <Skeleton className="h-4.5 w-20 rounded-md" />
          <span className="text-muted-foreground/60">&gt;</span>
          <Skeleton className="h-4.5 w-16 rounded-md" />
          <span className="text-muted-foreground/60">&gt;</span>
          <Skeleton className="h-4.5 w-28 rounded-md" />
        </div>

        {/* Back and actions header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        {/* Property Image Gallery Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] md:h-[450px]">
          <Skeleton className="md:col-span-2 h-full rounded-2xl md:rounded-3xl" />
          <div className="hidden md:grid grid-cols-2 col-span-2 gap-4 h-full">
            <Skeleton className="h-full rounded-2xl" />
            <Skeleton className="h-full rounded-2xl" />
            <Skeleton className="h-full rounded-2xl" />
            <Skeleton className="h-full rounded-2xl" />
          </div>
        </div>

        {/* Details Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
          {/* Left Column: Details & Info */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Title & Price Section */}
            <div className="flex flex-col gap-3 pb-6 border-b border-border/40">
              <Skeleton className="h-8 w-1/4 rounded-md" />
              <div className="flex justify-between items-end gap-4 mt-2">
                <div className="flex flex-col gap-2.5 w-full">
                  <Skeleton className="h-7 w-2/3 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-8 w-28 rounded-md" />
                </div>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="bg-card/20 border border-border/40 rounded-3xl p-6 flex flex-col gap-4">
              <Skeleton className="h-5 w-40 rounded-md" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <Skeleton className="h-3.5 w-12 rounded-md" />
                      <Skeleton className="h-4.5 w-16 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-36 rounded-md" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
            </div>

            {/* Amenities Section */}
            <div className="flex flex-col gap-4">
              <Skeleton className="h-5 w-24 rounded-md" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/30 bg-card/10">
                    <Skeleton className="h-8 w-8 rounded-xl" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Contact Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="border border-border/40 bg-card/25 rounded-3xl p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3.5 pb-4 border-b border-border/40">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4.5 w-24 rounded-md" />
                  <Skeleton className="h-3.5 w-16 rounded-md" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

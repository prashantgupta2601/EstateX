'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import MapErrorBoundary from '@/components/ui/map-error-boundary';

const SinglePropertyMap = dynamic(
  () => import('@/components/property/single-property-map'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[350px] rounded-3xl border border-border/80 bg-card/25 flex items-center justify-center animate-pulse">
        <span className="text-sm font-semibold text-muted-foreground animate-bounce">Loading Map View...</span>
      </div>
    ),
  }
);

interface SinglePropertyMapWrapperProps {
  lat: number;
  lng: number;
  title: string;
  address: string;
}

export default function SinglePropertyMapWrapper({ lat, lng, title, address }: SinglePropertyMapWrapperProps) {
  return (
    <MapErrorBoundary>
      <SinglePropertyMap lat={lat} lng={lng} title={title} address={address} />
    </MapErrorBoundary>
  );
}

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const NearbyMap = dynamic(
  () => import('@/components/property/nearby-map'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] rounded-3xl border border-border/80 bg-card/25 flex items-center justify-center animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground animate-bounce">Loading Nearby Landmarks Map...</span>
        </div>
      </div>
    ),
  }
);

interface NearbyMapWrapperProps {
  lat: number;
  lng: number;
  title: string;
}

export default function NearbyMapWrapper({ lat, lng, title }: NearbyMapWrapperProps) {
  return <NearbyMap lat={lat} lng={lng} title={title} />;
}

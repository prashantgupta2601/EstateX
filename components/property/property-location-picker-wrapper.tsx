'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import MapErrorBoundary from '@/components/ui/map-error-boundary';

const PropertyLocationPicker = dynamic(
  () => import('@/components/property/property-location-picker'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[280px] rounded-2xl border border-border/80 bg-card/25 flex items-center justify-center animate-pulse">
        <span className="text-sm font-semibold text-muted-foreground animate-bounce">Loading Location Picker Map...</span>
      </div>
    ),
  }
);

interface PropertyLocationPickerWrapperProps {
  lat: number;
  lng: number;
  city?: string;
  onChange: (lat: number, lng: number) => void;
}

export default function PropertyLocationPickerWrapper({
  lat,
  lng,
  city,
  onChange,
}: PropertyLocationPickerWrapperProps) {
  return (
    <MapErrorBoundary>
      <PropertyLocationPicker lat={lat} lng={lng} city={city} onChange={onChange} />
    </MapErrorBoundary>
  );
}

'use client';

import React, { useMemo } from 'react';
import { mockProperties } from '@/lib/mock-data/properties';
import PropertyCard from '@/components/property/property-card';

interface SimilarPropertiesProps {
  currentPropertyId: string;
  city: string;
  type: 'sale' | 'rent';
}

export default function SimilarProperties({ currentPropertyId, city, type }: SimilarPropertiesProps) {
  const similar = useMemo(() => {
    return mockProperties
      .filter((p) => p.id !== currentPropertyId && (p.location.city === city || p.type === type))
      .slice(0, 3);
  }, [currentPropertyId, city, type]);

  if (similar.length === 0) return null;

  return (
    <section className="text-left mt-10 pt-10 border-t border-border/40 w-full">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-6">Similar Properties You May Like</h2>
      
      {/* Horizontal snap scroll container on mobile/tablet, 3-column grid on desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:pb-0 scrollbar-hide">
        {similar.map((prop) => (
          <div 
            key={prop.id} 
            className="w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-align-start snap-always"
          >
            <PropertyCard property={prop} />
          </div>
        ))}
      </div>
    </section>
  );
}

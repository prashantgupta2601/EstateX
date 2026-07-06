'use client';

import React, { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { useComparison } from '@/lib/hooks/use-comparison';
import { mockProperties } from '@/lib/mock-data/properties';
import { Button } from '@/components/ui/button';

export default function ComparisonBar() {
  const { comparison, removeFromCompare, clearComparison, isMounted } = useComparison();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isMounted) {
      setShouldRender(true);
    }
  }, [isMounted]);

  const compareList = useMemo(() => {
    return mockProperties.filter((p) => comparison.includes(p.id));
  }, [comparison]);

  if (!shouldRender) return null;

  const isVisible = comparison.length >= 2;

  // Create an array of exactly 4 slots
  const slots = Array.from({ length: 4 }).map((_, index) => {
    return compareList[index] || null;
  });

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 p-4 md:px-6 md:pb-6 transition-all duration-500 ease-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-28 opacity-0 pointer-events-none'
      }`}
    >
      <div className="mx-auto max-w-5xl w-full bg-background/85 dark:bg-black/80 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl md:rounded-3xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Summary Info */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto text-center sm:text-left justify-center sm:justify-start">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
            <GitCompare className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-foreground text-sm">Compare Properties</h4>
            <p className="text-xs text-muted-foreground">
              {comparison.length} of 4 selected
            </p>
          </div>
        </div>

        {/* Middle: Thumbnails List / Slots */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-2 md:my-0">
          {slots.map((property, index) => {
            if (property) {
              return (
                <div
                  key={property.id}
                  className="group relative flex items-center gap-2 bg-card/60 border border-border/45 rounded-xl p-1.5 pr-3 hover:border-primary/40 transition-all duration-300 animate-in zoom-in-95 duration-200"
                >
                  <div className="relative h-10 w-14 rounded-lg overflow-hidden bg-muted">
                    {property.images?.[0] ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center text-[8px] text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col text-left max-w-[100px] sm:max-w-[120px]">
                    <span className="text-[10px] font-bold line-clamp-1 text-foreground leading-tight">
                      {property.title}
                    </span>
                    <span className="text-[9px] font-semibold text-primary">
                      ₹{property.price >= 10000000 
                        ? `${(property.price / 10000000).toFixed(2)} Cr` 
                        : property.price >= 100000 
                          ? `${(property.price / 100000).toFixed(1)} Lac` 
                          : property.price.toLocaleString('en-IN')
                      }
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCompare(property.id)}
                    className="p-1 rounded-full bg-muted/65 hover:bg-red-500 hover:text-white transition-colors duration-200 cursor-pointer ml-1"
                    aria-label={`Remove ${property.title}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            } else {
              return (
                <div
                  key={`empty-${index}`}
                  className="hidden sm:flex items-center justify-center h-13 w-28 border border-dashed border-border/65 rounded-xl text-[10px] font-bold text-muted-foreground/60 bg-muted/5 select-none"
                >
                  + Add Slot
                </div>
              );
            }
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <button
            type="button"
            onClick={clearComparison}
            className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-3 py-2 rounded-xl"
          >
            Clear
          </button>
          
          <Link href="/compare">
            <Button
              disabled={comparison.length < 2}
              className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95 shadow-md px-5 flex items-center gap-2 cursor-pointer h-10 text-xs"
            >
              <span>Compare Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

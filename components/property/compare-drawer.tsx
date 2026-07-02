'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { useEstate } from '@/lib/context/estate-context';
import { Button } from '@/components/ui/button';

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare, isMounted } = useEstate();

  if (!isMounted || compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:px-6 md:pb-6 pointer-events-none animate-slide-up">
      <div className="mx-auto max-w-4xl w-full bg-background/85 dark:bg-black/80 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl md:rounded-3xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
        
        {/* Left Side: Count & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto text-center sm:text-left justify-center sm:justify-start">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
            <GitCompare className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-foreground text-sm">Compare Properties</h4>
            <p className="text-xs text-muted-foreground">
              {compareList.length} of 3 selected.
              {compareList.length < 2 && ' Add at least 2 properties to compare.'}
            </p>
          </div>
        </div>

        {/* Middle: Thumbnails List */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-2 md:my-0">
          {compareList.map((property) => (
            <div
              key={property.id}
              className="group relative flex items-center gap-2 bg-card/60 border border-border/40 rounded-xl p-1.5 pr-3 hover:border-primary/40 transition-all duration-300"
            >
              {/* Compact Image */}
              <div className="relative h-10 w-14 rounded-lg overflow-hidden bg-muted">
                {property.images?.[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center text-[8px] text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div className="flex flex-col text-left max-w-[120px]">
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

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeFromCompare(property.id)}
                className="p-1 rounded-full bg-muted/65 hover:bg-red-500 hover:text-white transition-colors duration-200 cursor-pointer ml-1"
                aria-label={`Remove ${property.title} from compare`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Add More Placeholder (if list has fewer than 3 properties) */}
          {compareList.length < 3 && (
            <div className="hidden sm:flex items-center justify-center h-11 w-24 border border-dashed border-border/70 rounded-xl text-[10px] font-bold text-muted-foreground bg-muted/10">
              + Add Property
            </div>
          )}
        </div>

        {/* Right Side: Primary Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-3 py-2 rounded-xl"
          >
            Clear All
          </button>
          
          <Link href="/compare">
            <Button
              disabled={compareList.length < 2}
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

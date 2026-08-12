'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import {
  CITIES_LIST,
  CityName,
  PropertyMode,
  cityPropertyLinksData,
} from '@/lib/mock-data/city-property-links';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function CityPropertyLinks() {
  const [activeCity, setActiveCity] = useState<CityName>('Bangalore');
  const [mode, setMode] = useState<PropertyMode>('buy');

  const activeCityData = cityPropertyLinksData[activeCity];
  const currentCategories = activeCityData ? activeCityData[mode] : [];

  return (
    <section className="py-12 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Dynamic Mode Toggle */}
        <div className="flex flex-col items-start mb-8">
          <div className="flex flex-wrap items-center gap-x-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            <span>Property Options in Top Cities for</span>
            <DropdownMenu>
              <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-extrabold cursor-pointer border-b-2 border-primary pb-0.5"
                  aria-label="Toggle Buy or Rent mode"
                >
                  <span>{mode === 'buy' ? 'Buy' : 'Rent'}</span>
                  <ChevronDown className="h-6 w-6 text-primary" />
                </button>
              }
            />
              <DropdownMenuContent align="start" className="w-32 bg-popover shadow-lg rounded-xl border border-border">
                <DropdownMenuItem
                  onClick={() => setMode('buy')}
                  className={cn(
                    'font-semibold text-sm py-2 px-3 cursor-pointer',
                    mode === 'buy' ? 'text-primary font-bold bg-primary/10' : 'text-foreground'
                  )}
                >
                  Buy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setMode('rent')}
                  className={cn(
                    'font-semibold text-sm py-2 px-3 cursor-pointer',
                    mode === 'rent' ? 'text-primary font-bold bg-primary/10' : 'text-foreground'
                  )}
                >
                  Rent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Yellow/amber underline accent below heading */}
          <div className="w-20 h-1 bg-amber-400 mt-3 rounded-full" />
        </div>

        {/* City Tabs Row */}
        <div className="w-full border-b border-border mb-8 overflow-x-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex space-x-6 sm:space-x-8 min-w-max pb-3">
            {CITIES_LIST.map((city) => {
              const isActive = activeCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setActiveCity(city)}
                  className={cn(
                    'text-base transition-all duration-200 cursor-pointer whitespace-nowrap pb-3 -mb-[15px]',
                    isActive
                      ? 'font-bold text-primary border-b-[3px] border-primary'
                      : 'font-medium text-muted-foreground hover:text-foreground'
                  )}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Grid (4 columns desktop, 2 tablet, 1 mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentCategories.map((categoryGroup, index) => (
            <div key={index} className="flex flex-col">
              <h3 className="text-base font-bold text-foreground mb-3">
                {categoryGroup.title}
              </h3>
              <ul className="flex flex-col space-y-1">
                {categoryGroup.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.url}
                      className="py-1 text-sm font-normal text-slate-700 dark:text-slate-300 hover:text-primary hover:underline transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Subtle View All Link at Bottom */}
        <div className="mt-10 pt-4 border-t border-border/40 flex items-center justify-start">
          <Link
            href={`/properties?city=${encodeURIComponent(activeCity)}&type=${mode}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline transition-all group"
          >
            <span>View All Properties in {activeCity}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Map, Landmark } from 'lucide-react';
import { mockCities } from '@/lib/mock-data/cities';

export default function PopularCities() {
  return (
    <section className="py-16 bg-muted/40 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-primary mb-2">
            <Landmark className="h-3.5 w-3.5" /> Regional Coverage
          </span>
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Explore Properties by City
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find residential houses, premium apartments, commercial spaces, and plots in India's major real estate hubs.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockCities.map((city) => (
            <Link
              key={city.id}
              href={`/search?city=${encodeURIComponent(city.name)}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[3/4] shadow-xs hover:shadow-lg transition-all duration-300 border border-border/30"
            >
              {/* City Background Image */}
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-colors duration-300 group-hover:from-black/95 group-hover:via-black/45" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-left">
                {/* Floating Map Icon */}
                <div className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Map className="h-4 w-4" />
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {city.name}
                </h3>
                <p className="text-xs md:text-sm text-white/85 mt-1 font-medium">
                  {city.propertyCount.toLocaleString('en-IN')}+ Properties
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

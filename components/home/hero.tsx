'use client';

import React from 'react';
import PropertySearchBar from './property-search-bar';
import { ShieldCheck, Building2, Users2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b border-border/40 bg-gradient-to-br from-blue-50/60 via-indigo-50/20 to-background py-16 md:py-24 lg:py-32 dark:from-slate-950 dark:via-indigo-950/20 dark:to-background">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] right-[-5%] -z-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10" />
      <div className="absolute bottom-[-10%] left-[-5%] -z-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Sub-badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-primary mb-6 animate-fade-in">
          <Building2 className="h-3.5 w-3.5" />
          The Premium Real Estate Marketplace
        </span>

        {/* Hero Tagline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-3xl leading-[1.1] mb-6">
          Find Your <span className="text-primary bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent dark:to-indigo-400">Dream Property</span>
        </h1>

        {/* Hero Description */}
        <p className="mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground mb-10">
          Discover, compare, and secure premium homes, commercial properties, and residential plots in your preferred localities. Simple, transparent, and built around you.
        </p>

        {/* Search Bar Component */}
        <div className="w-full mb-12">
          <PropertySearchBar />
        </div>

        {/* Quick Stats/Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 mt-4 max-w-3xl w-full border-t border-border/50 pt-8 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Verified Listings</h3>
              <p className="text-xs text-muted-foreground">100% authenticated properties</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Premium Localities</h3>
              <p className="text-xs text-muted-foreground">Top properties in prime areas</p>
            </div>
          </div>

          <div className="flex items-start gap-3 col-span-2 md:col-span-1 justify-center md:justify-start">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Users2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Direct Assistance</h3>
                <p className="text-xs text-muted-foreground">Personal agents on demand</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

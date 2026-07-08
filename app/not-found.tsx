'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center select-none animate-in fade-in duration-300">
      {/* Creative SVG/Lucide Illustration */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Large stylized 404 background text */}
        <span className="text-[120px] sm:text-[160px] font-black tracking-tighter text-muted/25 dark:text-muted/10 leading-none">
          404
        </span>
        {/* House/Property Icon overlaid in center */}
        <div className="absolute p-4 rounded-3xl bg-primary/10 border-2 border-primary/20 text-primary shadow-xl backdrop-blur-xs animate-bounce duration-1000">
          <Home className="h-10 w-10 stroke-[2]" />
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-4 p-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
          <HelpCircle className="h-4 w-4" />
        </div>
      </div>

      {/* Heading & Details */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
        Property Not Found
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-8 leading-relaxed font-semibold">
        The page you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-sm">
        <Link href="/" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-sm shadow-md cursor-pointer flex items-center gap-2 justify-center">
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </Button>
        </Link>
        <Link href="/properties" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-sm border-border hover:bg-muted cursor-pointer flex items-center gap-2 justify-center">
            <Search className="h-4 w-4" />
            <span>Search Properties</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

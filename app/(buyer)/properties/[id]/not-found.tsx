'use client';

import React from 'react';
import Link from 'next/link';
import { Search, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center select-none animate-in fade-in duration-300">
      <div className="relative mb-6">
        <div className="p-4 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 text-amber-500 shadow-lg">
          <EyeOff className="h-10 w-10 stroke-[2]" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3">
        Listing Not Found
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-8 leading-relaxed font-semibold">
        This property listing is no longer available. It may have been sold, rented, or removed by the owner.
      </p>

      <div className="flex gap-4 items-center justify-center w-full max-w-sm">
        <Link href="/properties" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-sm shadow-md cursor-pointer flex items-center gap-2 justify-center">
            <Search className="h-4 w-4" />
            <span>Browse Similar Properties</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

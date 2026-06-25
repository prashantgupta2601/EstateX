import React from 'react';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary">
        Find Your Next Perfect Place to Live
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        Discover, view, and compare the best properties in your area. Simple, transparent, and quick.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="/search"
          className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Browse Properties
        </a>
        <a href="/compare" className="text-sm font-semibold leading-6 text-foreground hover:underline">
          Compare Options <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

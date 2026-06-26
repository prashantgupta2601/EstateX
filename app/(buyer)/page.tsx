import React from 'react';
import Hero from '@/components/home/hero';
import FeaturedProperties from '@/components/home/featured-properties';
import PopularCities from '@/components/home/popular-cities';

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Featured Properties Section */}
      <FeaturedProperties />

      {/* Popular Cities Section */}
      <PopularCities />

      {/* Main content grid (additional sections can be added here) */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Why Choose EstateX?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We provide a seamless and secure real estate browsing and transaction experience with premium features.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border/50 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-foreground">Advanced Search</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Filter properties by exact location, type, price, and features to find the perfect fit.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border/50 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-foreground">Compare Options</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Compare your favorite properties side-by-side on prices, amenities, and details.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border/50 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-foreground">Verified Sellers</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Deal directly with verified owners, premium builders, and vetted agencies.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

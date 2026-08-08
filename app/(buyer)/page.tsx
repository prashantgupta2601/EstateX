import React from 'react';
import Hero from '@/components/home/hero';
import FeaturedProperties from '@/components/home/featured-properties';
import AiRecommendations from '@/components/home/ai-recommendations';
import PopularCities from '@/components/home/popular-cities';
import TrustSection from '@/components/home/trust-section';

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Featured Properties Section */}
      <FeaturedProperties />

      {/* AI Recommendations Section */}
      <AiRecommendations />

      {/* Popular Cities Section */}
      <PopularCities />

      {/* Trust & Stats Section */}
      <TrustSection />
    </div>
  );
}

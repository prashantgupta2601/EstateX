'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, Loader2, RefreshCw, Check, Building, MapPin, Layers, IndianRupee, AlertCircle } from 'lucide-react';
import PropertyCard from '@/components/property/property-card';
import { Property } from '@/types/property';
import { mockProperties } from '@/lib/mock-data/properties';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useWishlist } from '@/lib/hooks/use-wishlist';
import { useAIUsage } from '@/lib/ai/usage-tracker';
import { useFeatureFlags } from '@/lib/hooks/use-feature-flags';
import { AIUsageIndicator, AIGeminiAttribution } from '@/components/ai/ai-usage-indicator';

interface UserPreferences {
  purpose: 'buy' | 'rent';
  budgetMin: number;
  budgetMax: number;
  bhk: number[];
  cities: string[];
  propertyTypes: string[];
  amenities: string[];
  furnishing: string;
}

const CITY_OPTIONS = ['Gurugram', 'New Delhi', 'Mumbai', 'Bengaluru', 'Pune', 'Noida'];
const BHK_OPTIONS = [1, 2, 3, 4];

const LOCAL_STORAGE_KEY = 'estatex_ai_preferences';

export default function AiRecommendations() {
  const { wishlist } = useWishlist();
  const { isFeatureEnabled, aiFeatures } = useFeatureFlags();
  const recUsage = useAIUsage('recommendations');

  const isAllowed = aiFeatures && isFeatureEnabled('ai-recommendations');
  
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Form draft state
  const [purpose, setPurpose] = useState<'buy' | 'rent'>('buy');
  const [budgetMin, setBudgetMin] = useState<number>(2000000);
  const [budgetMax, setBudgetMax] = useState<number>(30000000);
  const [selectedBhk, setSelectedBhk] = useState<number[]>([2, 3]);
  const [selectedCities, setSelectedCities] = useState<string[]>(['Gurugram', 'New Delhi']);

  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: UserPreferences = JSON.parse(saved);
        setPreferences(parsed);
        setPurpose(parsed.purpose);
        setBudgetMin(parsed.budgetMin);
        setBudgetMax(parsed.budgetMax);
        setSelectedBhk(parsed.bhk || [2, 3]);
        setSelectedCities(parsed.cities || ['Gurugram']);
        setIsFormOpen(false);
        fetchRecommendations(parsed);
      } else {
        setIsFormOpen(true);
      }
    } catch (e) {
      console.error('Failed to load preferences:', e);
      setIsFormOpen(true);
    }
  }, []);

  const fetchRecommendations = async (userPrefs: UserPreferences) => {
    if (!isAllowed || !recUsage.canUse || isLoading) return;

    setIsLoading(true);
    setHasError(false);
    try {
      recUsage.increment();
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            purpose: userPrefs.purpose,
            budget: { min: userPrefs.budgetMin, max: userPrefs.budgetMax },
            bhk: userPrefs.bhk,
            cities: userPrefs.cities,
            propertyTypes: userPrefs.propertyTypes || [],
            amenities: userPrefs.amenities || [],
            furnishing: userPrefs.furnishing || '',
          },
          viewedPropertyIds: [],
          wishlistPropertyIds: wishlist,
        }),
      });

      if (!response.ok) {
        throw new Error('AI temporarily unavailable. Please try again.');
      }

      const data = await response.json();
      const recIds: string[] = data.recommendedIds || [];
      const recReasons: Record<string, string> = data.reasons || {};

      setReasons(recReasons);

      let matchedProps = mockProperties.filter((p) => recIds.includes(p.id));

      if (matchedProps.length === 0) {
        matchedProps = mockProperties
          .filter((p) => (userPrefs.purpose === 'buy' ? p.type === 'sale' : p.type === 'rent'))
          .slice(0, 6);
      }

      setRecommendations(matchedProps);
      toast('AI recommendations updated using Gemini!', 'success');
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      setHasError(true);
      toast('AI temporarily unavailable. Please try again.', 'error');
      setRecommendations(mockProperties.slice(0, 6));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();

    const newPrefs: UserPreferences = {
      purpose,
      budgetMin,
      budgetMax,
      bhk: selectedBhk,
      cities: selectedCities,
      propertyTypes: ['apartment', 'villa'],
      amenities: [],
      furnishing: 'any',
    };

    setPreferences(newPrefs);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPrefs));
    setIsFormOpen(false);
    fetchRecommendations(newPrefs);
  };

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const toggleBhk = (bhk: number) => {
    setSelectedBhk((prev) =>
      prev.includes(bhk) ? prev.filter((b) => b !== bhk) : [...prev, bhk]
    );
  };

  if (!isMounted) return null;

  return (
    <section id="ai-recommendations" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none">
      <div className="flex flex-col gap-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-4">
          <div className="flex flex-col gap-1 text-left">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Personalized AI Match</span>
              </span>
              {!isAllowed && (
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Disabled by Admin
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Recommended Properties for You
            </h2>
            <p className="text-xs text-muted-foreground">
              Smart vector matching based on your saved budget, locality preferences, and wishlist activity.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <AIUsageIndicator featureKey="recommendations" />
              {preferences && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!isAllowed || !recUsage.canUse || isLoading}
                  onClick={() => setIsFormOpen(true)}
                  className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 font-bold text-xs h-9 px-4 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Refine Preferences</span>
                </Button>
              )}
            </div>
            <AIGeminiAttribution />
          </div>
        </div>

        {/* Error retry bar */}
        {hasError && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              AI temporarily unavailable. Please try again.
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => preferences && fetchRecommendations(preferences)}
              className="h-7 text-xs font-bold text-rose-600 border-rose-500/30 hover:bg-rose-500/20"
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </div>
        )}

        {/* Form Modal / Accordion Card */}
        {isFormOpen && (
          <form onSubmit={handleSavePreferences} className="flex flex-col gap-5 p-6 rounded-3xl bg-card border border-primary/25 shadow-lg animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">Tell us what you're looking for</h3>
              </div>
              {preferences && (
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              
              {/* 1. Purpose Toggle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Property Purpose</label>
                <div className="grid grid-cols-2 gap-1.5 bg-muted/60 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setPurpose('buy');
                      setBudgetMin(2000000);
                      setBudgetMax(30000000);
                    }}
                    className={`py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      purpose === 'buy' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPurpose('rent');
                      setBudgetMin(15000);
                      setBudgetMax(150000);
                    }}
                    className={`py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      purpose === 'rent' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Rent
                  </button>
                </div>
              </div>

              {/* 2. Budget Max slider/inputs */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground flex justify-between">
                  <span>Max Budget</span>
                  <span className="text-primary font-black">
                    {purpose === 'buy'
                      ? `₹ ${(budgetMax / 100000).toFixed(0)} Lakhs`
                      : `₹ ${(budgetMax / 1000).toFixed(0)}k/mo`}
                  </span>
                </label>
                <input
                  type="range"
                  min={purpose === 'buy' ? 1000000 : 5000}
                  max={purpose === 'buy' ? 100000000 : 500000}
                  step={purpose === 'buy' ? 500000 : 5000}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>

              {/* 3. Preferred Cities */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Target Cities</label>
                <div className="flex flex-wrap gap-1">
                  {CITY_OPTIONS.map((c) => {
                    const isSelected = selectedCities.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCity(c)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-background border-border/60 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. BHK Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">Bedrooms (BHK)</label>
                <div className="flex gap-1.5">
                  {BHK_OPTIONS.map((b) => {
                    const isSelected = selectedBhk.includes(b);
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => toggleBhk(b)}
                        className={`flex-1 h-9 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-background border-border/80 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {b} BHK
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={!isAllowed || !recUsage.canUse || isLoading}
                className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 h-10 text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI is thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Get AI Matches ✨</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Loading Spinner State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="p-3 rounded-full bg-primary/10 text-primary border border-primary/20 animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <span className="text-sm font-extrabold text-foreground animate-pulse">AI is thinking...</span>
            <p className="text-xs text-muted-foreground">Matching property vector embeddings with your preferences</p>
          </div>
        )}

        {/* Recommendations Cards Grid */}
        {!isLoading && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {recommendations.map((property) => {
              const aiReason = reasons[property.id] || `Matches your ${property.location.city} location & budget preferences`;
              return (
                <div key={property.id} className="flex flex-col gap-2 group">
                  {/* AI Match Reason Banner */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-1.5 text-left flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-[11px] font-bold text-primary leading-tight">
                      {aiReason}
                    </span>
                  </div>

                  <PropertyCard property={property} />
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

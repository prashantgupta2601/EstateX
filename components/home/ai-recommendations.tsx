'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, Loader2, RefreshCw, ChevronDown, Check, Building, MapPin, Layers, IndianRupee } from 'lucide-react';
import PropertyCard from '@/components/property/property-card';
import { Property } from '@/types/property';
import { mockProperties } from '@/lib/mock-data/properties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useWishlist } from '@/lib/hooks/use-wishlist';

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
const TYPE_OPTIONS = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'Villa/House' },
  { value: 'commercial', label: 'Commercial' },
];

const LOCAL_STORAGE_KEY = 'estatex_ai_preferences';

export default function AiRecommendations() {
  const { wishlist } = useWishlist();
  
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form draft state
  const [purpose, setPurpose] = useState<'buy' | 'rent'>('buy');
  const [budgetMin, setBudgetMin] = useState<number>(2000000); // 20 Lacs
  const [budgetMax, setBudgetMax] = useState<number>(30000000); // 3 Cr
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
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            purpose: userPrefs.purpose,
            budget: { min: userPrefs.budgetMin, max: userPrefs.budgetMax },
            bhk: userPrefs.bhk,
            cities: userPrefs.cities,
            propertyTypes: userPrefs.propertyTypes,
            amenities: userPrefs.amenities,
            furnishing: userPrefs.furnishing,
          },
          viewedPropertyIds: [],
          wishlistPropertyIds: wishlist,
        }),
      });

      const data = await response.json();
      const recIds: string[] = data.recommendedIds || [];
      const recReasons: Record<string, string> = data.reasons || {};

      setReasons(recReasons);

      // Filter properties matching recommended IDs or fallback
      let matchedProps = mockProperties.filter((p) => recIds.includes(p.id));

      if (matchedProps.length === 0) {
        // Fallback filter if AI API returned empty or mismatch
        matchedProps = mockProperties
          .filter((p) => (userPrefs.purpose === 'buy' ? p.type === 'sale' : p.type === 'rent'))
          .slice(0, 6);
      }

      setRecommendations(matchedProps);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      toast('Failed to load AI recommendations. Showing featured matches.', 'error');
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
      propertyTypes: ['apartment', 'house'],
      amenities: ['Gym', 'Swimming Pool', 'Security'],
      furnishing: 'Semi-Furnished',
    };

    setPreferences(newPrefs);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    setIsFormOpen(false);
    fetchRecommendations(newPrefs);
    toast('Preferences updated! Generating AI recommendations...', 'success');
  };

  const toggleBhk = (bhkVal: number) => {
    setSelectedBhk(prev => 
      prev.includes(bhkVal) ? prev.filter(b => b !== bhkVal) : [...prev, bhkVal]
    );
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const formatPriceReadable = (val: number) => {
    if (purpose === 'rent') {
      return `₹ ${val.toLocaleString('en-IN')}/mo`;
    }
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(1)} Lac`;
    }
    return `₹ ${val.toLocaleString('en-IN')}`;
  };

  if (!isMounted) return null;

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/20 to-background border-y border-border/40">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0 mt-1">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-primary">AI Matchmaker</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Live</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Recommended for You
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Curated property matches generated specifically for your preferences using Gemini AI
              </p>
            </div>
          </div>

          {preferences && !isFormOpen && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(true)}
              className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 font-bold text-xs h-9 px-4 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Refine Preferences</span>
            </Button>
          )}
        </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
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

              {/* 2. BHK Selection Chips */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground">BHK Configuration</label>
                <div className="flex gap-1.5">
                  {BHK_OPTIONS.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => toggleBhk(val)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedBhk.includes(val)
                          ? 'bg-primary/10 border-primary text-primary font-black'
                          : 'bg-background border-border/80 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {val} BHK
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Budget Range Inputs */}
              <div className="flex flex-col gap-1.5 lg:col-span-2">
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                  <span>Budget Range</span>
                  <span className="text-primary">{formatPriceReadable(budgetMin)} - {formatPriceReadable(budgetMax)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="h-10 text-xs font-semibold rounded-xl"
                  />
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="h-10 text-xs font-semibold rounded-xl"
                  />
                </div>
              </div>

            </div>

            {/* 4. Preferred Cities */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground">Preferred Cities</label>
              <div className="flex flex-wrap gap-2">
                {CITY_OPTIONS.map(city => {
                  const isSelected = selectedCities.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleCity(city)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-background border-border/80 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      <span>{city}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border/30">
              <Button
                type="submit"
                className="h-10 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs px-6 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="h-4 w-4" />
                <span>Get AI Recommendations ✨</span>
              </Button>
            </div>
          </form>
        )}

        {/* Recommended Property Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(prop => (
              <div key={prop.id} className="flex flex-col gap-2">
                {/* AI Reason Badge / Tooltip Header */}
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary flex items-start gap-2 shadow-xs">
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-tight">
                    <strong className="font-extrabold text-primary block text-[11px]">Why Recommended:</strong>
                    {reasons[prop.id] || `Matches your ${prop.bedrooms} BHK requirement in ${prop.location.city}.`}
                  </span>
                </div>

                <PropertyCard property={prop} />
              </div>
            ))}
          </div>
        ) : !isFormOpen && (
          <div className="text-center py-10 bg-card rounded-2xl border border-border/40 p-6">
            <p className="text-xs text-muted-foreground font-bold">No property recommendations found matching your criteria.</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(true)}
              className="mt-3 rounded-xl border-primary/30 text-primary font-bold text-xs"
            >
              Refine Preferences
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}

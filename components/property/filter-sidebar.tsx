'use client';

import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatIndianCurrencyShort } from '@/lib/utils/emi-calculator';
import { SlidersHorizontal, Check, RefreshCw } from 'lucide-react';

export interface FilterState {
  purpose: string; // 'buy' | 'rent' | 'commercial' | 'any'
  location: string;
  priceRange: number[];
  propertyTypes: string[];
  bhk: string[];
  selectedAmenities: string[];
  furnishing: string;
  // Advanced filters
  postedBy?: string;
  propertyAge?: string[];
  floorPreference?: string;
  facing?: string;
  waterSupply?: string;
  overlooking?: string[];
  availableFrom?: string | null;
  city?: string;
  locality?: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onApply?: () => void;
  className?: string;
}

export default function FilterSidebar({ filters, onChange, onApply, className }: FilterSidebarProps) {
  // Determine dynamic price range parameters based on purpose
  const isRent = filters.purpose === 'rent';
  const MIN_PRICE = isRent ? 5000 : 1000000;      // 5k vs 10 Lac
  const MAX_PRICE = isRent ? 300000 : 50000000;    // 3 Lac vs 5 Cr
  const STEP = isRent ? 2000 : 500000;             // 2k vs 5 Lac

  // Sync state during render when filters or limits change to avoid useEffect setState warnings
  const [prevPriceRange, setPrevPriceRange] = useState<number[]>(filters.priceRange);
  const [prevPurpose, setPrevPurpose] = useState<string>(filters.purpose);
  const [localPriceRange, setLocalPriceRange] = useState<number[]>(() => {
    const clampedMin = Math.max(MIN_PRICE, Math.min(MAX_PRICE, filters.priceRange[0]));
    const clampedMax = Math.max(MIN_PRICE, Math.min(MAX_PRICE, filters.priceRange[1]));
    return [clampedMin, clampedMax];
  });

  if (
    filters.priceRange[0] !== prevPriceRange[0] ||
    filters.priceRange[1] !== prevPriceRange[1] ||
    filters.purpose !== prevPurpose
  ) {
    setPrevPriceRange(filters.priceRange);
    setPrevPurpose(filters.purpose);
    const clampedMin = Math.max(MIN_PRICE, Math.min(MAX_PRICE, filters.priceRange[0]));
    const clampedMax = Math.max(MIN_PRICE, Math.min(MAX_PRICE, filters.priceRange[1]));
    setLocalPriceRange([clampedMin, clampedMax]);
  }

  // Debounced parent state update for slider
  useEffect(() => {
    if (localPriceRange[0] !== filters.priceRange[0] || localPriceRange[1] !== filters.priceRange[1]) {
      const timer = setTimeout(() => {
        onChange({ ...filters, priceRange: localPriceRange });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [localPriceRange, filters, onChange]);

  const propertyTypesOptions = [
    { label: 'Apartment', value: 'apartment' },
    { label: 'Villa / House', value: 'villa' },
    { label: 'Plot / Land', value: 'plot' },
    { label: 'Office Space', value: 'office' },
    { label: 'Shop / Retail', value: 'shop' },
  ];

  const bhkOptions = ['1', '2', '3', '4', '4+'];

  const amenitiesOptions = [
    { label: 'Parking', value: 'parking' },
    { label: 'Lift', value: 'lift' },
    { label: 'Power Backup', value: 'power-backup' },
    { label: 'Gym', value: 'gym' },
    { label: 'Swimming Pool', value: 'swimming-pool' },
    { label: 'Security (24x7)', value: 'security' },
  ];

  const furnishingOptions = ['Any', 'Furnished', 'Semi-Furnished', 'Unfurnished'];

  // Toggle Property Type Checkbox
  const togglePropertyType = (val: string) => {
    const updated = filters.propertyTypes.includes(val)
      ? filters.propertyTypes.filter((item) => item !== val)
      : [...filters.propertyTypes, val];
    onChange({ ...filters, propertyTypes: updated });
  };

  // Toggle BHK Chips
  const toggleBhk = (val: string) => {
    const updated = filters.bhk.includes(val)
      ? filters.bhk.filter((item) => item !== val)
      : [...filters.bhk, val];
    onChange({ ...filters, bhk: updated });
  };

  // Toggle Amenities Checkbox
  const toggleAmenity = (val: string) => {
    const updated = filters.selectedAmenities.includes(val)
      ? filters.selectedAmenities.filter((item) => item !== val)
      : [...filters.selectedAmenities, val];
    onChange({ ...filters, selectedAmenities: updated });
  };

  // Reset all filters (preserving the current purpose)
  const handleClearAll = () => {
    onChange({
      purpose: filters.purpose,
      location: filters.location,
      priceRange: [MIN_PRICE, MAX_PRICE],
      propertyTypes: [],
      bhk: [],
      selectedAmenities: [],
      furnishing: 'Any',
    });
  };

  return (
    <div className={`flex flex-col gap-6 text-left ${className}`}>
      
      {/* Header (desktop/tablet) */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <h2 className="font-bold text-base flex items-center gap-2 text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" /> Filter Options
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="h-8 text-xs font-semibold text-primary hover:text-primary/90 px-2 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Purpose Section */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-muted-foreground">Purpose</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Buy', value: 'buy' },
            { label: 'Rent', value: 'rent' },
            { label: 'Commercial', value: 'commercial' },
          ].map((opt) => {
            const isSelected = filters.purpose === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const targetRent = opt.value === 'rent';
                  const newMin = targetRent ? 5000 : 1000000;
                  const newMax = targetRent ? 300000 : 50000000;
                  onChange({
                    ...filters,
                    purpose: opt.value,
                    priceRange: [newMin, newMax],
                  });
                }}
                className={`h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                    : 'bg-background border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-border/40" />

      {/* Price Range Section */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-muted-foreground">Price Range</label>
        </div>
        <div className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg w-fit">
          {formatIndianCurrencyShort(localPriceRange[0])} - {formatIndianCurrencyShort(localPriceRange[1])}
        </div>
        <Slider
          value={localPriceRange}
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          onValueChange={(val) => setLocalPriceRange(val as number[])}
          className="mt-1"
        />
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground/60">
          <span>{isRent ? '₹5k' : '₹10 Lac'}</span>
          <span>{isRent ? '₹3 Lac' : '₹5 Cr'}</span>
        </div>
      </div>

      <hr className="border-border/40" />

      {/* Property Type Section */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-muted-foreground">Property Type</label>
        <div className="flex flex-col gap-2">
          {propertyTypesOptions.map((opt) => {
            const isChecked = filters.propertyTypes.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground cursor-pointer select-none py-0.5"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => togglePropertyType(opt.value)}
                    className="sr-only"
                  />
                  <div
                    className={`size-4.5 rounded border transition-colors flex items-center justify-center ${
                      isChecked
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border/80 bg-background hover:border-primary/60'
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
                <span className="font-medium">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <hr className="border-border/40" />

      {/* BHK Section */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-muted-foreground">Bedrooms (BHK)</label>
        <div className="flex flex-wrap gap-2">
          {bhkOptions.map((opt) => {
            const isSelected = filters.bhk.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleBhk(opt)}
                className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                    : 'bg-background border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {opt} BHK
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-border/40" />

      {/* Amenities Section */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-muted-foreground">Amenities</label>
        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
          {amenitiesOptions.map((opt) => {
            const isChecked = filters.selectedAmenities.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground cursor-pointer select-none py-0.5"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAmenity(opt.value)}
                    className="sr-only"
                  />
                  <div
                    className={`size-4.5 rounded border transition-colors flex items-center justify-center ${
                      isChecked
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border/80 bg-background hover:border-primary/60'
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
                <span className="font-medium">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <hr className="border-border/40" />

      {/* Furnishing Section */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-muted-foreground">Furnishing</label>
        <div className="flex flex-col gap-2">
          {furnishingOptions.map((opt) => {
            const isChecked = filters.furnishing === opt;
            return (
              <label
                key={opt}
                className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground cursor-pointer select-none py-0.5"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="furnishing"
                    checked={isChecked}
                    onChange={() => onChange({ ...filters, furnishing: opt })}
                    className="sr-only"
                  />
                  <div
                    className={`size-4.5 rounded-full border transition-all flex items-center justify-center ${
                      isChecked
                        ? 'border-primary'
                        : 'border-border/80 bg-background hover:border-primary/60'
                    }`}
                  >
                    {isChecked && <div className="size-2 rounded-full bg-primary" />}
                  </div>
                </div>
                <span className="font-medium">{opt}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Mobile-only Apply Filters Button */}
      {onApply && (
        <div className="mt-4 pt-4 border-t border-border/40 lg:hidden">
          <Button
            onClick={onApply}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold shadow-md cursor-pointer"
          >
            Apply Filters
          </Button>
        </div>
      )}

    </div>
  );
}

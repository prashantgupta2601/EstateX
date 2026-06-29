'use client';

import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatIndianCurrencyShort } from '@/lib/utils/emi-calculator';
import { SlidersHorizontal, Check, RefreshCw } from 'lucide-react';

interface FilterSidebarProps {
  onApply?: () => void;
  className?: string;
}

export default function FilterSidebar({ onApply, className }: FilterSidebarProps) {
  // Limits
  const MIN_PRICE = 1000000; // 10 Lac
  const MAX_PRICE = 50000000; // 5 Cr
  const STEP = 500000; // 5 Lac

  // Local Filter States
  const [priceRange, setPriceRange] = useState<number[]>([MIN_PRICE, MAX_PRICE]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [bhk, setBhk] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [furnishing, setFurnishing] = useState<string>('Any');

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
    setPropertyTypes((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  // Toggle BHK Chips
  const toggleBhk = (val: string) => {
    setBhk((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  // Toggle Amenities Checkbox
  const toggleAmenity = (val: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  // Reset all filters
  const handleClearAll = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setPropertyTypes([]);
    setBhk([]);
    setSelectedAmenities([]);
    setFurnishing('Any');
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

      {/* Price Range Section */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-muted-foreground">Price Range</label>
        </div>
        <div className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg w-fit">
          {formatIndianCurrencyShort(priceRange[0])} - {formatIndianCurrencyShort(priceRange[1])}
        </div>
        <Slider
          value={priceRange}
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          onValueChange={(val) => setPriceRange(val as number[])}
          className="mt-1"
        />
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground/60">
          <span>₹10 Lac</span>
          <span>₹5 Cr</span>
        </div>
      </div>

      <hr className="border-border/40" />

      {/* Property Type Section */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-muted-foreground">Property Type</label>
        <div className="flex flex-col gap-2">
          {propertyTypesOptions.map((opt) => {
            const isChecked = propertyTypes.includes(opt.value);
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
            const isSelected = bhk.includes(opt);
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
            const isChecked = selectedAmenities.includes(opt.value);
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
            const isChecked = furnishing === opt;
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
                    onChange={() => setFurnishing(opt)}
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

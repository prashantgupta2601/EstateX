'use client';

import React, { useState, useEffect } from 'react';
import { FilterState } from '@/components/property/filter-sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatIndianCurrencyShort } from '@/lib/utils/emi-calculator';
import { 
  Check, 
  RefreshCw,
  Home,
  User,
  Compass,
  Layers,
  Droplet,
  Eye,
  CalendarCheck
} from 'lucide-react';

interface AdvancedFiltersModalProps {
  filters: FilterState;
  onApply: (newFilters: FilterState) => void;
  trigger: React.ReactElement;
}

// Helpers to compute counts
export function getActiveFiltersCount(filters: FilterState): number {
  let count = 0;
  if (filters.purpose && filters.purpose !== 'any') count++;
  
  const isRent = filters.purpose === 'rent';
  const defMin = isRent ? 5000 : 1000000;
  const defMax = isRent ? 300000 : 50000000;
  if (filters.priceRange && (filters.priceRange[0] !== defMin || filters.priceRange[1] !== defMax)) {
    count++;
  }
  
  if (filters.propertyTypes && filters.propertyTypes.length > 0) count++;
  if (filters.bhk && filters.bhk.length > 0) count++;
  if (filters.selectedAmenities && filters.selectedAmenities.length > 0) count++;
  if (filters.furnishing && filters.furnishing !== 'Any') count++;
  
  // Advanced filters
  if (filters.postedBy && filters.postedBy !== 'any') count++;
  if (filters.propertyAge && filters.propertyAge.length > 0) count++;
  if (filters.floorPreference && filters.floorPreference !== 'any') count++;
  if (filters.facing && filters.facing !== 'any') count++;
  if (filters.waterSupply && filters.waterSupply !== 'any') count++;
  if (filters.overlooking && filters.overlooking.length > 0) count++;
  if (filters.purpose === 'rent' && filters.availableFrom) count++;
  
  return count;
}

export function getActiveAdvancedFiltersCount(filters: FilterState): number {
  let count = 0;
  if (filters.postedBy && filters.postedBy !== 'any') count++;
  if (filters.propertyAge && filters.propertyAge.length > 0) count++;
  if (filters.floorPreference && filters.floorPreference !== 'any') count++;
  if (filters.facing && filters.facing !== 'any') count++;
  if (filters.waterSupply && filters.waterSupply !== 'any') count++;
  if (filters.overlooking && filters.overlooking.length > 0) count++;
  if (filters.purpose === 'rent' && filters.availableFrom) count++;
  return count;
}

export default function AdvancedFiltersModal({ filters, onApply, trigger }: AdvancedFiltersModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [isMobile, setIsMobile] = useState(false);

  // Resize listener to determine viewport type
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync state when opening
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setLocalFilters({
        ...filters,
        postedBy: filters.postedBy || 'any',
        propertyAge: filters.propertyAge || [],
        floorPreference: filters.floorPreference || 'any',
        facing: filters.facing || 'any',
        waterSupply: filters.waterSupply || 'any',
        overlooking: filters.overlooking || [],
        availableFrom: filters.availableFrom || null,
      });
    }
  };

  const handleClearAll = () => {
    const isRent = localFilters.purpose === 'rent';
    const defMin = isRent ? 5000 : 1000000;
    const defMax = isRent ? 300000 : 50000000;
    setLocalFilters({
      purpose: localFilters.purpose,
      location: localFilters.location,
      priceRange: [defMin, defMax],
      propertyTypes: [],
      bhk: [],
      selectedAmenities: [],
      furnishing: 'Any',
      postedBy: 'any',
      propertyAge: [],
      floorPreference: 'any',
      facing: 'any',
      waterSupply: 'any',
      overlooking: [],
      availableFrom: null,
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    setIsOpen(false);
  };

  // State manipulation handlers
  const togglePropertyType = (val: string) => {
    const propertyTypes = localFilters.propertyTypes || [];
    const updated = propertyTypes.includes(val)
      ? propertyTypes.filter((item) => item !== val)
      : [...propertyTypes, val];
    setLocalFilters({ ...localFilters, propertyTypes: updated });
  };

  const toggleBhk = (val: string) => {
    const bhk = localFilters.bhk || [];
    const updated = bhk.includes(val)
      ? bhk.filter((item) => item !== val)
      : [...bhk, val];
    setLocalFilters({ ...localFilters, bhk: updated });
  };

  const toggleAmenity = (val: string) => {
    const selectedAmenities = localFilters.selectedAmenities || [];
    const updated = selectedAmenities.includes(val)
      ? selectedAmenities.filter((item) => item !== val)
      : [...selectedAmenities, val];
    setLocalFilters({ ...localFilters, selectedAmenities: updated });
  };

  const togglePropertyAge = (val: string) => {
    const ages = localFilters.propertyAge || [];
    const updated = ages.includes(val)
      ? ages.filter((item) => item !== val)
      : [...ages, val];
    setLocalFilters({ ...localFilters, propertyAge: updated });
  };

  const toggleOverlooking = (val: string) => {
    const overlooking = localFilters.overlooking || [];
    const updated = overlooking.includes(val)
      ? overlooking.filter((item) => item !== val)
      : [...overlooking, val];
    setLocalFilters({ ...localFilters, overlooking: updated });
  };

  // Render options mapping
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
  
  const postedByOptions = [
    { label: 'Any', value: 'any' },
    { label: 'Owner', value: 'owner' },
    { label: 'Broker', value: 'broker' },
    { label: 'Builder', value: 'builder' }
  ];

  const ageOptions = [
    { label: 'Under Construction', value: 'under-construction' },
    { label: 'Ready to Move', value: 'ready-to-move' },
    { label: '0-1 yr', value: '0-1' },
    { label: '1-5 yrs', value: '1-5' },
    { label: '5+ yrs', value: '5+' }
  ];

  const floorOptions = [
    { label: 'Any', value: 'any' },
    { label: 'Ground', value: 'ground' },
    { label: 'Low Rise (1-4)', value: 'low-rise' },
    { label: 'High Rise (5+)', value: 'high-rise' }
  ];

  const facingOptions = [
    { label: 'Any', value: 'any' },
    { label: 'East', value: 'east' },
    { label: 'West', value: 'west' },
    { label: 'North', value: 'north' },
    { label: 'South', value: 'south' }
  ];

  const waterOptions = [
    { label: 'Any', value: 'any' },
    { label: 'Corporation', value: 'corporation' },
    { label: 'Borewell', value: 'borewell' },
    { label: 'Both', value: 'both' }
  ];

  const overlookOptions = [
    { label: 'Garden', value: 'garden' },
    { label: 'Road', value: 'road' },
    { label: 'Pool', value: 'pool' },
    { label: 'Main Road', value: 'main-road' }
  ];

  // Dynamic parameters
  const isRent = localFilters.purpose === 'rent';
  const MIN_PRICE = isRent ? 5000 : 1000000;
  const MAX_PRICE = isRent ? 300000 : 50000000;
  const STEP = isRent ? 2000 : 500000;

  const totalActive = getActiveFiltersCount(localFilters);

  // Render form content in a two-column or single-column layout
  const renderFilterContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 pb-20 lg:pb-6 text-left relative">
      
      {/* LEFT COLUMN: Basic Filters */}
      <div className="flex flex-col gap-6">
        
        {/* Purpose */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
            <Home className="h-4 w-4 text-primary" /> Purpose
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Buy', value: 'buy' },
              { label: 'Rent', value: 'rent' },
              { label: 'Commercial', value: 'commercial' },
            ].map((opt) => {
              const isSelected = localFilters.purpose === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    const targetRent = opt.value === 'rent';
                    const newMin = targetRent ? 5000 : 1000000;
                    const newMax = targetRent ? 300000 : 50000000;
                    setLocalFilters({
                      ...localFilters,
                      purpose: opt.value,
                      priceRange: [newMin, newMax],
                    });
                  }}
                  className={`h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                      : 'bg-card border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Price Slider */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground">Price Range</label>
          <div className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg w-fit">
            {formatIndianCurrencyShort(localFilters.priceRange[0])} - {formatIndianCurrencyShort(localFilters.priceRange[1])}
          </div>
          <Slider
            value={localFilters.priceRange}
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            onValueChange={(val) => setLocalFilters({ ...localFilters, priceRange: val as number[] })}
            className="mt-1"
          />
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground/60">
            <span>{isRent ? '₹5k' : '₹10 Lac'}</span>
            <span>{isRent ? '₹3 Lac' : '₹5 Cr'}</span>
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Property Type */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground">Property Type</label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypesOptions.map((opt) => {
              const isChecked = (localFilters.propertyTypes || []).includes(opt.value);
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

        {/* BHK */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground">Bedrooms (BHK)</label>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map((opt) => {
              const isSelected = (localFilters.bhk || []).includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleBhk(opt)}
                  className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                      : 'bg-card border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {opt} BHK
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Furnishing */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground">Furnishing Status</label>
          <div className="grid grid-cols-2 gap-2">
            {furnishingOptions.map((opt) => {
              const isChecked = localFilters.furnishing === opt;
              return (
                <label
                  key={opt}
                  className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground cursor-pointer select-none py-0.5"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="modal-furnishing"
                      checked={isChecked}
                      onChange={() => setLocalFilters({ ...localFilters, furnishing: opt })}
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

        <hr className="border-border/40" />

        {/* Amenities */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground">Amenities</label>
          <div className="grid grid-cols-2 gap-2">
            {amenitiesOptions.map((opt) => {
              const isChecked = (localFilters.selectedAmenities || []).includes(opt.value);
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

      </div>

      {/* RIGHT COLUMN: Advanced Filters */}
      <div className="flex flex-col gap-6">

        {/* Posted By */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
            <User className="h-4 w-4 text-primary" /> Posted By
          </label>
          <div className="grid grid-cols-2 gap-2">
            {postedByOptions.map((opt) => {
              const isChecked = (localFilters.postedBy || 'any') === opt.value;
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground cursor-pointer select-none py-0.5"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="modal-postedby"
                      checked={isChecked}
                      onChange={() => setLocalFilters({ ...localFilters, postedBy: opt.value })}
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
                  <span className="font-medium">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Property Age */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-primary" /> Property Age
          </label>
          <div className="flex flex-wrap gap-2">
            {ageOptions.map((opt) => {
              const isSelected = (localFilters.propertyAge || []).includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => togglePropertyAge(opt.value)}
                  className={`h-9 px-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                      : 'bg-card border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Floor Preference */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-primary" /> Floor Preference
          </label>
          <div className="grid grid-cols-2 gap-2">
            {floorOptions.map((opt) => {
              const isChecked = (localFilters.floorPreference || 'any') === opt.value;
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground cursor-pointer select-none py-0.5"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="modal-floor"
                      checked={isChecked}
                      onChange={() => setLocalFilters({ ...localFilters, floorPreference: opt.value })}
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
                  <span className="font-medium">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Facing */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-primary" /> Facing (Direction)
          </label>
          <div className="flex flex-wrap gap-2">
            {facingOptions.map((opt) => {
              const isSelected = (localFilters.facing || 'any') === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, facing: opt.value })}
                  className={`h-9 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                      : 'bg-card border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Water Supply */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
            <Droplet className="h-4 w-4 text-primary" /> Water Supply
          </label>
          <div className="grid grid-cols-2 gap-2">
            {waterOptions.map((opt) => {
              const isChecked = (localFilters.waterSupply || 'any') === opt.value;
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground cursor-pointer select-none py-0.5"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="modal-water"
                      checked={isChecked}
                      onChange={() => setLocalFilters({ ...localFilters, waterSupply: opt.value })}
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
                  <span className="font-medium">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Overlooking */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-primary" /> Overlooking
          </label>
          <div className="grid grid-cols-2 gap-2">
            {overlookOptions.map((opt) => {
              const isChecked = (localFilters.overlooking || []).includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-foreground cursor-pointer select-none py-0.5"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOverlooking(opt.value)}
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

        {/* Available From (Date picker) - only visible for rent purpose */}
        {isRent && (
          <>
            <hr className="border-border/40" />
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4 text-primary" /> Available From
              </label>
              <input
                type="date"
                value={localFilters.availableFrom || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, availableFrom: e.target.value || null })}
                className="flex h-11 w-full rounded-2xl border border-border/80 bg-background px-3.5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              />
            </div>
          </>
        )}

      </div>

      {/* FOOTER ACTIONS - Fixed positioning for Sheet bottom drawer on mobile, static inside dialog for desktop */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border flex items-center justify-between lg:static lg:border-t-0 lg:p-0 lg:mt-8 z-50">
        <Button
          variant="ghost"
          onClick={handleClearAll}
          className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Clear All
        </Button>
        <Button
          onClick={handleApply}
          className="rounded-xl px-6 h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-black shadow-md cursor-pointer flex items-center gap-2"
        >
          <span>Apply {totalActive} Filters</span>
        </Button>
      </div>

    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger render={trigger} />
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-6 overflow-y-auto bg-card text-left border-t border-border/80">
          <SheetHeader className="text-left mb-6">
            <div className="flex items-center justify-between pr-6">
              <SheetTitle className="text-lg font-black text-foreground">Advanced Filters</SheetTitle>
            </div>
          </SheetHeader>
          {renderFilterContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-card border border-border/80 shadow-2xl p-6 text-left">
        <DialogHeader className="text-left mb-6 flex flex-row items-center justify-between pr-6">
          <DialogTitle className="text-lg font-black text-foreground">Advanced Filters</DialogTitle>
        </DialogHeader>
        {renderFilterContent()}
      </DialogContent>
    </Dialog>
  );
}

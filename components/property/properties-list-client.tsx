'use client';

import React, { useState, useMemo } from 'react';
import { mockProperties } from '@/lib/mock-data/properties';
import PropertyCard from '@/components/property/property-card';
import PropertyCardList from '@/components/property/property-card-list';
import FilterSidebar, { FilterState } from '@/components/property/filter-sidebar';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { formatIndianCurrencyShort } from '@/lib/utils/emi-calculator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'area-desc';
type ViewMode = 'grid' | 'list';

export default function PropertiesListClient() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Default Limits
  const MIN_PRICE = 1000000;
  const MAX_PRICE = 50000000;

  const defaultFilters: FilterState = {
    priceRange: [MIN_PRICE, MAX_PRICE],
    propertyTypes: [],
    bhk: [],
    selectedAmenities: [],
    furnishing: 'Any',
  };

  // Lifted state
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Check if price filter is dirty (modified from defaults)
  const isPriceFilterActive = useMemo(() => {
    return filters.priceRange[0] !== MIN_PRICE || filters.priceRange[1] !== MAX_PRICE;
  }, [filters, MIN_PRICE, MAX_PRICE]);

  // Compute live-filtered properties array
  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      // 1. Price Range filter (only apply if explicitly modified)
      if (isPriceFilterActive) {
        if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
          return false;
        }
      }

      // 2. Property Type filter
      if (filters.propertyTypes.length > 0) {
        const matches = filters.propertyTypes.some((ft) => {
          if (ft === 'apartment') return property.propertyType === 'apartment' || property.propertyType === 'condo';
          if (ft === 'villa') return property.propertyType === 'house';
          if (ft === 'plot') return property.propertyType === 'land';
          if (ft === 'office' || ft === 'shop') return property.propertyType === 'commercial';
          return false;
        });
        if (!matches) return false;
      }

      // 3. BHK (Bedrooms) filter
      if (filters.bhk.length > 0) {
        const matches = filters.bhk.some((b) => {
          if (b === '4+') return property.bedrooms >= 4;
          return property.bedrooms === parseInt(b, 10);
        });
        if (!matches) return false;
      }

      // 4. Amenities filter (ALL selected must match - AND joined)
      if (filters.selectedAmenities.length > 0) {
        const hasAll = filters.selectedAmenities.every((fa) => {
          return property.amenities.some((a) => {
            const name = a.name.toLowerCase();
            if (fa === 'parking') return name.includes('parking') || name.includes('garage') || name.includes('gated');
            if (fa === 'lift') return name.includes('lift') || name.includes('elevator');
            if (fa === 'power-backup') return name.includes('power') || name.includes('backup');
            if (fa === 'gym') return name.includes('gym') || name.includes('fitness');
            if (fa === 'swimming-pool') return name.includes('pool') || name.includes('swimming');
            if (fa === 'security') return name.includes('security') || name.includes('guard');
            return name.includes(fa);
          });
        });
        if (!hasAll) return false;
      }

      // 5. Furnishing filter (matches strings inside the description)
      if (filters.furnishing !== 'Any') {
        const desc = property.description.toLowerCase();
        if (filters.furnishing === 'Furnished') {
          const isFurnished = (desc.includes('fully furnished') || desc.includes('furnished')) && !desc.includes('semi-furnished') && !desc.includes('semi furnished');
          if (!isFurnished) return false;
        } else if (filters.furnishing === 'Semi-Furnished') {
          const isSemi = desc.includes('semi-furnished') || desc.includes('semi furnished');
          if (!isSemi) return false;
        } else if (filters.furnishing === 'Unfurnished') {
          const isUnfurnished = desc.includes('unfurnished') || (!desc.includes('furnished') && !desc.includes('semi-furnished') && !desc.includes('semi furnished'));
          if (!isUnfurnished) return false;
        }
      }

      return true;
    });
  }, [filters, isPriceFilterActive]);

  // Sort the filtered properties
  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'area-desc':
        sorted.sort((a, b) => b.area - a.area);
        break;
      case 'relevance':
      default:
        // Keep original order (featured first, then by creation date)
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
    }
    return sorted;
  }, [filteredProperties, sortBy]);

  // Determine if any filters are active
  const isFiltersActive = useMemo(() => {
    return (
      isPriceFilterActive ||
      filters.propertyTypes.length > 0 ||
      filters.bhk.length > 0 ||
      filters.selectedAmenities.length > 0 ||
      filters.furnishing !== 'Any'
    );
  }, [filters, isPriceFilterActive]);

  // Individual chip removal handlers
  const removePriceFilter = () => setFilters((p) => ({ ...p, priceRange: [MIN_PRICE, MAX_PRICE] }));
  const removePropertyTypeFilter = (val: string) => setFilters((p) => ({ ...p, propertyTypes: p.propertyTypes.filter((x) => x !== val) }));
  const removeBhkFilter = (val: string) => setFilters((p) => ({ ...p, bhk: p.bhk.filter((x) => x !== val) }));
  const removeAmenityFilter = (val: string) => setFilters((p) => ({ ...p, selectedAmenities: p.selectedAmenities.filter((x) => x !== val) }));
  const removeFurnishingFilter = () => setFilters((p) => ({ ...p, furnishing: 'Any' }));
  const clearAllFilters = () => setFilters(defaultFilters);

  const sortLabels: Record<SortOption, string> = {
    'relevance': 'Relevance',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'newest': 'Newest First',
    'area-desc': 'Area: Large to Small',
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/40 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Properties in India
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sortedProperties.length} {sortedProperties.length === 1 ? 'Property' : 'Properties'} Found
          </p>
        </div>

        {/* Mobile Filters Trigger */}
        <div className="lg:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" className="flex items-center gap-2 rounded-xl border-border/80 text-foreground font-semibold px-4 cursor-pointer">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <span>Filters</span>
                </Button>
              }
            />
            <SheetContent side="right" className="p-6 overflow-y-auto max-w-xs sm:max-w-sm">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterSidebar filters={filters} onChange={setFilters} onApply={() => setIsFilterOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Toolbar Row: Sort + View Toggle */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <span className="text-xs font-bold text-muted-foreground hidden sm:block">Sort by:</span>
          <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
            <SelectTrigger className="w-[190px] text-xs font-semibold cursor-pointer">
              <SelectValue>{sortLabels[sortBy]}</SelectValue>
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="area-desc">Area: Large to Small</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-border/80 p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Filters Row */}
      {isFiltersActive && (
        <div className="flex flex-wrap items-center gap-2 py-1.5 border-b border-border/20 pb-4">
          <span className="text-xs font-bold text-muted-foreground mr-1">Active Filters:</span>
          
          {/* Price Range Chip */}
          {isPriceFilterActive && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span>{formatIndianCurrencyShort(filters.priceRange[0])} - {formatIndianCurrencyShort(filters.priceRange[1])}</span>
              <button onClick={removePriceFilter} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer text-primary/80 hover:text-primary">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          {/* Property Types Chips */}
          {filters.propertyTypes.map((type) => (
            <span key={type} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
              <span>{type === 'villa' ? 'Villa / House' : type === 'plot' ? 'Plot / Land' : type === 'office' ? 'Office Space' : type === 'shop' ? 'Shop / Retail' : type}</span>
              <button onClick={() => removePropertyTypeFilter(type)} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer text-primary/80 hover:text-primary">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}

          {/* BHK Chips */}
          {filters.bhk.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span>{b} BHK</span>
              <button onClick={() => removeBhkFilter(b)} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer text-primary/80 hover:text-primary">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}

          {/* Amenities Chips */}
          {filters.selectedAmenities.map((amenity) => (
            <span key={amenity} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
              <span>{amenity.replace('-', ' ')}</span>
              <button onClick={() => removeAmenityFilter(amenity)} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer text-primary/80 hover:text-primary">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}

          {/* Furnishing Chip */}
          {filters.furnishing !== 'Any' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span>{filters.furnishing}</span>
              <button onClick={removeFurnishingFilter} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer text-primary/80 hover:text-primary">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="h-7 text-xs font-bold text-muted-foreground hover:text-foreground px-2 py-0 cursor-pointer ml-1"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sticky Sidebar */}
        <aside className="w-68 shrink-0 hidden lg:block sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
          <FilterSidebar filters={filters} onChange={setFilters} className="p-6 rounded-2xl border border-border bg-card/50" />
        </aside>

        {/* Right Main Grid/List Area */}
        <div className="flex-1">
          {sortedProperties.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProperties.map((property) => (
                  <div key={property.id} className="h-full">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {sortedProperties.map((property) => (
                  <PropertyCardList key={property.id} property={property} />
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border/85 rounded-3xl bg-card/25 min-h-[400px]">
              <div className="p-4.5 rounded-full bg-primary/10 text-primary mb-5">
                <SlidersHorizontal className="h-8 w-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No Properties Found</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                No listings match your search options. Try widening your price range, reducing amenities, or resetting filters.
              </p>
              <Button
                onClick={clearAllFilters}
                className="mt-6 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 shadow-md cursor-pointer"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

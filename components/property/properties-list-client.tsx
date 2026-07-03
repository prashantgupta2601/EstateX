'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { mockProperties } from '@/lib/mock-data/properties';
import PropertyCard from '@/components/property/property-card';
import PropertyCardList from '@/components/property/property-card-list';
import FilterSidebar, { FilterState } from '@/components/property/filter-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, X, LayoutGrid, List, Map, ArrowUpDown } from 'lucide-react';
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

const PropertyMap = dynamic(
  () => import('@/components/property/property-map'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-3xl border border-border/80 bg-card/25 flex items-center justify-center animate-pulse">
        <span className="text-sm font-semibold text-muted-foreground animate-bounce">Loading Map View...</span>
      </div>
    ),
  }
);

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'area-desc';
type ViewMode = 'grid' | 'list' | 'map';

export default function PropertiesListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  // --- 1. Parse URL Query Parameters to Derive State ---
  const purpose = (searchParams.get('purpose') || 'any') as 'buy' | 'rent' | 'commercial' | 'any';
  const location = searchParams.get('location') || searchParams.get('city') || '';

  const isRent = purpose === 'rent';
  const MIN_PRICE = isRent ? 5000 : 1000000;
  const MAX_PRICE = isRent ? 300000 : 50000000;

  const priceMin = searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!, 10) : MIN_PRICE;
  const priceMax = searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!, 10) : MAX_PRICE;

  const typeParam = searchParams.get('type');
  const bhkParam = searchParams.get('bhk');
  const amenitiesParam = searchParams.get('amenities');
  const furnishing = searchParams.get('furnishing') || 'Any';

  // Assemble derived filter state object
  const filters = useMemo<FilterState>(() => {
    const propertyTypes = typeParam ? typeParam.split(',') : [];
    const bhk = bhkParam ? bhkParam.split(',') : [];
    const selectedAmenities = amenitiesParam ? amenitiesParam.split(',') : [];

    return {
      purpose,
      location,
      priceRange: [priceMin, priceMax],
      propertyTypes,
      bhk,
      selectedAmenities,
      furnishing,
    };
  }, [purpose, location, priceMin, priceMax, typeParam, bhkParam, amenitiesParam, furnishing]);

  // Local state for search text input (so typing is smooth)
  const [prevLocation, setPrevLocation] = useState<string>(location);
  const [localSearch, setLocalSearch] = useState<string>(location);

  if (location !== prevLocation) {
    setPrevLocation(location);
    setLocalSearch(location);
  }

  // --- 2. Centralized URL Navigation Handler ---
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();

    // 1. Purpose
    if (newFilters.purpose && newFilters.purpose !== 'any') {
      params.set('purpose', newFilters.purpose);
    }

    // 2. Location
    if (newFilters.location.trim()) {
      params.set('location', newFilters.location.trim());
    }

    // 3. Price Range (only append if different from the default limits based on purpose)
    const targetRent = newFilters.purpose === 'rent';
    const defMin = targetRent ? 5000 : 1000000;
    const defMax = targetRent ? 300000 : 50000000;

    if (newFilters.priceRange[0] !== defMin) {
      params.set('priceMin', newFilters.priceRange[0].toString());
    }
    if (newFilters.priceRange[1] !== defMax) {
      params.set('priceMax', newFilters.priceRange[1].toString());
    }

    // 4. Property Types
    if (newFilters.propertyTypes.length > 0) {
      params.set('type', newFilters.propertyTypes.join(','));
    }

    // 5. BHK
    if (newFilters.bhk.length > 0) {
      params.set('bhk', newFilters.bhk.join(','));
    }

    // 6. Amenities
    if (newFilters.selectedAmenities.length > 0) {
      params.set('amenities', newFilters.selectedAmenities.join(','));
    }

    // 7. Furnishing
    if (newFilters.furnishing && newFilters.furnishing !== 'Any') {
      params.set('furnishing', newFilters.furnishing);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router]);

  // Specific Handlers
  const handleSortChange = (val: SortOption) => {
    setSortBy(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange({ ...filters, location: localSearch.trim() });
  };

  const handlePurposeChange = (val: string) => {
    const targetRent = val === 'rent';
    const newMin = targetRent ? 5000 : 1000000;
    const newMax = targetRent ? 300000 : 50000000;

    handleFilterChange({
      ...filters,
      purpose: val,
      priceRange: [newMin, newMax],
    });
  };

  // --- 3. Compute Live Filtered Properties ---
  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      // 1. Purpose filter (Buy vs Rent vs Commercial vs Any)
      if (filters.purpose && filters.purpose !== 'any') {
        if (filters.purpose === 'buy' && property.type !== 'sale') return false;
        if (filters.purpose === 'rent' && property.type !== 'rent') return false;
        if (filters.purpose === 'commercial' && property.propertyType !== 'commercial') return false;
      }

      // 2. Keyword/Location search (matches city, address, state, title, description)
      if (filters.location) {
        const q = filters.location.toLowerCase().trim();
        const city = property.location.city.toLowerCase();
        const address = property.location.address.toLowerCase();
        const state = property.location.state.toLowerCase();
        const title = property.title.toLowerCase();
        const desc = property.description.toLowerCase();

        const matches =
          city.includes(q) ||
          address.includes(q) ||
          state.includes(q) ||
          title.includes(q) ||
          desc.includes(q);

        if (!matches) return false;
      }

      // 3. Price range filter (guaranteed safe boundaries)
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }

      // 4. Property Type filter
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

      // 5. BHK (Bedrooms) filter
      if (filters.bhk.length > 0) {
        const matches = filters.bhk.some((b) => {
          if (b === '4+') return property.bedrooms >= 4;
          return property.bedrooms === parseInt(b, 10);
        });
        if (!matches) return false;
      }

      // 6. Amenities filter (AND matching)
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

      // 7. Furnishing filter
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
  }, [filters]);

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

  // Check if price filter is dirty (modified from defaults based on purpose)
  const isPriceFilterActive = useMemo(() => {
    return filters.priceRange[0] !== MIN_PRICE || filters.priceRange[1] !== MAX_PRICE;
  }, [filters.priceRange, MIN_PRICE, MAX_PRICE]);

  // Check if any filters are active
  const isFiltersActive = useMemo(() => {
    return (
      isPriceFilterActive ||
      filters.propertyTypes.length > 0 ||
      filters.bhk.length > 0 ||
      filters.selectedAmenities.length > 0 ||
      filters.furnishing !== 'Any'
    );
  }, [filters, isPriceFilterActive]);

  // Chip removal handlers
  const removePriceFilter = () => handleFilterChange({ ...filters, priceRange: [MIN_PRICE, MAX_PRICE] });
  const removePropertyTypeFilter = (val: string) => handleFilterChange({ ...filters, propertyTypes: filters.propertyTypes.filter((x) => x !== val) });
  const removeBhkFilter = (val: string) => handleFilterChange({ ...filters, bhk: filters.bhk.filter((x) => x !== val) });
  const removeAmenityFilter = (val: string) => handleFilterChange({ ...filters, selectedAmenities: filters.selectedAmenities.filter((x) => x !== val) });
  const removeFurnishingFilter = () => handleFilterChange({ ...filters, furnishing: 'Any' });
  const clearAllFilters = () => handleFilterChange({
    purpose: filters.purpose,
    location: filters.location,
    priceRange: [MIN_PRICE, MAX_PRICE],
    propertyTypes: [],
    bhk: [],
    selectedAmenities: [],
    furnishing: 'Any',
  });

  const sortLabels: Record<SortOption, string> = {
    'relevance': 'Relevance',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'newest': 'Newest First',
    'area-desc': 'Area: Large to Small',
  };

  const getHeadingTitle = () => {
    let base = 'Properties';
    if (filters.purpose === 'buy') base = 'Properties for Sale';
    else if (filters.purpose === 'rent') base = 'Properties for Rent';
    else if (filters.purpose === 'commercial') base = 'Commercial Properties';

    if (filters.location) {
      return `${base} in ${filters.location.charAt(0).toUpperCase() + filters.location.slice(1)}`;
    }
    return `${base} in India`;
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-fade-in">
      
      {/* Page Header & Search controls */}
      <div className="flex flex-col gap-6 pb-6 border-b border-border/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground capitalize">
              {getHeadingTitle()}
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
                <FilterSidebar filters={filters} onChange={handleFilterChange} onApply={() => setIsFilterOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Premium Search & Purpose Tabs bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-card/45 backdrop-blur-md border border-border/60 rounded-2xl p-4 shadow-xs">
          {/* Keyword Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search by city, locality, project..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="h-11 w-full pl-3 pr-4 rounded-xl border-border bg-background/50 hover:bg-background/80 focus-visible:bg-background transition-colors text-sm"
              />
            </div>
            <Button
              type="submit"
              className="h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Search</span>
            </Button>
          </form>

          {/* Separator for desktop */}
          <div className="hidden md:block h-8 w-px bg-border/60" />

          {/* Purpose Toggle (All / Buy / Rent / Commercial) */}
          <div className="flex items-center gap-1 rounded-xl border border-border/85 bg-background/30 p-1">
            {[
              { label: 'All', value: 'any' },
              { label: 'Buy', value: 'buy' },
              { label: 'Rent', value: 'rent' },
              { label: 'Commercial', value: 'commercial' },
            ].map((tab) => {
              const isSelected = filters.purpose === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handlePurposeChange(tab.value)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toolbar Row: Sort + View Toggle */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <span className="text-xs font-bold text-muted-foreground hidden sm:block">Sort by:</span>
          <Select value={sortBy} onValueChange={(val) => handleSortChange(val as SortOption)}>
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
            type="button"
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
            type="button"
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
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label="Map view"
          >
            <Map className="h-4 w-4" />
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
          <FilterSidebar filters={filters} onChange={handleFilterChange} className="p-6 rounded-2xl border border-border bg-card/50" />
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
            ) : viewMode === 'list' ? (
              <div className="flex flex-col gap-5">
                {sortedProperties.map((property) => (
                  <PropertyCardList key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <PropertyMap properties={sortedProperties} />
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

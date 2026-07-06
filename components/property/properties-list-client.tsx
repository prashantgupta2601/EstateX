'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { mockProperties } from '@/lib/mock-data/properties';
import PropertyCard from '@/components/property/property-card';
import PropertyCardList from '@/components/property/property-card-list';
import EmptyState from '@/components/property/empty-state';
import FilterSidebar, { FilterState } from '@/components/property/filter-sidebar';
import AdvancedFiltersModal, { getActiveAdvancedFiltersCount } from '@/components/property/advanced-filters-modal';
import LocationAutocomplete from '@/components/ui/location-autocomplete';
import { LocalityItem } from '@/lib/mock-data/localities';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SlidersHorizontal, X, LayoutGrid, List, Map, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
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

// Helper Skeleton components for loading simulation
function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 border border-border/40 rounded-2xl p-4 bg-card/20 animate-pulse h-full">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="flex flex-col gap-2.5 mt-2">
        <Skeleton className="h-5 w-1/3 rounded-md" />
        <Skeleton className="h-6 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/40 my-4">
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl mt-auto" />
    </div>
  );
}

function PropertyCardListSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 border border-border/40 rounded-2xl p-4 bg-card/20 animate-pulse">
      <Skeleton className="h-48 sm:h-40 w-full sm:w-72 md:w-80 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col justify-between py-1 gap-3">
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-border/40">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'area-desc';
type ViewMode = 'grid' | 'list' | 'map';

// Deterministic mock property helper to support advanced filters without changing the DB file
function getDeterministicPropertyDetails(id: string, agentRole: string, floorVal: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const postedBy = agentRole || 'broker';

  const ageOptions = ['under-construction', 'ready-to-move', '0-1', '1-5', '5+'];
  const propertyAge = ageOptions[(hash + 1) % ageOptions.length];

  const floorPreference = floorVal === 0 
    ? 'ground' 
    : floorVal >= 5 
      ? 'high-rise' 
      : 'low-rise';

  const facingOptions = ['east', 'west', 'north', 'south'];
  const facing = facingOptions[(hash + 2) % facingOptions.length];

  const waterSupply = ['corporation', 'borewell', 'both'][(hash + 3) % 3];

  const overlookOptions = ['garden', 'road', 'pool', 'main-road'];
  const overlooking = [
    overlookOptions[(hash + 4) % overlookOptions.length],
    overlookOptions[(hash + 5) % overlookOptions.length]
  ];

  const availableFromDays = (hash % 20) + 1;
  const date = new Date('2026-07-04');
  date.setDate(date.getDate() + availableFromDays);
  const availableFrom = date.toISOString().split('T')[0];

  return {
    postedBy,
    propertyAge,
    floorPreference,
    facing,
    waterSupply,
    overlooking,
    availableFrom
  };
}

export default function PropertiesListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Derive sortBy from URL parameter (e.g. ?sort=price_asc)
  const sortByParam = searchParams.get('sort');
  const sortBy = useMemo((): SortOption => {
    if (!sortByParam) return 'relevance';
    const p = sortByParam.replace('_', '-');
    if (['relevance', 'price-asc', 'price-desc', 'newest', 'area-desc'].includes(p)) {
      return p as SortOption;
    }
    return 'relevance';
  }, [sortByParam]);

  // --- 1. Parse URL Query Parameters to Derive State ---
  const purpose = (searchParams.get('purpose') || 'any') as 'buy' | 'rent' | 'commercial' | 'any';
  const location = searchParams.get('city') || searchParams.get('location') || '';

  const isRent = purpose === 'rent';
  const MIN_PRICE = isRent ? 5000 : 1000000;
  const MAX_PRICE = isRent ? 300000 : 50000000;

  const priceMin = searchParams.get('minPrice') 
    ? parseInt(searchParams.get('minPrice')!, 10) 
    : searchParams.get('priceMin') 
      ? parseInt(searchParams.get('priceMin')!, 10) 
      : MIN_PRICE;

  const priceMax = searchParams.get('maxPrice') 
    ? parseInt(searchParams.get('maxPrice')!, 10) 
    : searchParams.get('priceMax') 
      ? parseInt(searchParams.get('priceMax')!, 10) 
      : MAX_PRICE;

  const typeParam = searchParams.get('type');
  const bhkParam = searchParams.get('bhk');
  const amenitiesParam = searchParams.get('amenities');
  
  const furnishedParam = searchParams.get('furnished') || searchParams.get('furnishing');
  const furnishing = useMemo(() => {
    if (!furnishedParam) return 'Any';
    const p = furnishedParam.toLowerCase();
    if (p === 'furnished') return 'Furnished';
    if (p === 'semi-furnished' || p === 'semi_furnished') return 'Semi-Furnished';
    if (p === 'unfurnished') return 'Unfurnished';
    return 'Any';
  }, [furnishedParam]);

  // Advanced search parameters
  const postedBy = searchParams.get('postedBy') || 'any';
  const propertyAgeParam = searchParams.get('propertyAge');
  const floorPreference = searchParams.get('floorPreference') || 'any';
  const facing = searchParams.get('facing') || 'any';
  const waterSupply = searchParams.get('waterSupply') || 'any';
  const overlookingParam = searchParams.get('overlooking');
  const availableFrom = searchParams.get('availableFrom') || null;
  const locality = searchParams.get('locality') || '';

  // Assemble derived filter state object
  const filters = useMemo<FilterState>(() => {
    const propertyTypes = typeParam ? typeParam.split(',') : [];
    const bhk = bhkParam ? bhkParam.split(',') : [];
    const selectedAmenities = amenitiesParam ? amenitiesParam.split(',') : [];
    const propertyAge = propertyAgeParam ? propertyAgeParam.split(',') : [];
    const overlooking = overlookingParam ? overlookingParam.split(',') : [];

    return {
      purpose,
      location,
      priceRange: [priceMin, priceMax],
      propertyTypes,
      bhk,
      selectedAmenities,
      furnishing,
      // Advanced
      postedBy,
      propertyAge,
      floorPreference,
      facing,
      waterSupply,
      overlooking,
      availableFrom,
      // Autocomplete
      locality,
    };
  }, [
    purpose, 
    location, 
    priceMin, 
    priceMax, 
    typeParam, 
    bhkParam, 
    amenitiesParam, 
    furnishing,
    postedBy,
    propertyAgeParam,
    floorPreference,
    facing,
    waterSupply,
    overlookingParam,
    availableFrom,
    locality,
  ]);

  // Local state for search text input (so typing is smooth)
  const [prevLocation, setPrevLocation] = useState<string>(location);
  const [localSearch, setLocalSearch] = useState<string>(location);
  const [localSelectedItem, setLocalSelectedItem] = useState<LocalityItem | undefined>(undefined);

  if (location !== prevLocation) {
    setPrevLocation(location);
    setLocalSearch(location);
    setLocalSelectedItem(undefined);
  }

  // --- 2. Centralized URL Navigation Handler ---
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setCurrentPage(1);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);

    const params = new URLSearchParams();

    // 1. Purpose
    if (newFilters.purpose && newFilters.purpose !== 'any') {
      params.set('purpose', newFilters.purpose);
    }

    // 2. Location (City)
    if (newFilters.location.trim()) {
      params.set('city', newFilters.location.trim());
    }

    // 3. Price Range (only append if different from the default limits based on purpose)
    const targetRent = newFilters.purpose === 'rent';
    const defMin = targetRent ? 5000 : 1000000;
    const defMax = targetRent ? 300000 : 50000000;

    if (newFilters.priceRange[0] !== defMin) {
      params.set('minPrice', newFilters.priceRange[0].toString());
    }
    if (newFilters.priceRange[1] !== defMax) {
      params.set('maxPrice', newFilters.priceRange[1].toString());
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
      params.set('furnished', newFilters.furnishing.toLowerCase());
    }

    // 8. Posted By
    if (newFilters.postedBy && newFilters.postedBy !== 'any') {
      params.set('postedBy', newFilters.postedBy);
    }

    // 9. Property Age
    if (newFilters.propertyAge && newFilters.propertyAge.length > 0) {
      params.set('propertyAge', newFilters.propertyAge.join(','));
    }

    // 10. Floor Preference
    if (newFilters.floorPreference && newFilters.floorPreference !== 'any') {
      params.set('floorPreference', newFilters.floorPreference);
    }

    // 11. Facing
    if (newFilters.facing && newFilters.facing !== 'any') {
      params.set('facing', newFilters.facing);
    }

    // 12. Water Supply
    if (newFilters.waterSupply && newFilters.waterSupply !== 'any') {
      params.set('waterSupply', newFilters.waterSupply);
    }

    // 13. Overlooking
    if (newFilters.overlooking && newFilters.overlooking.length > 0) {
      params.set('overlooking', newFilters.overlooking.join(','));
    }

    // 14. Available From
    if (newFilters.purpose === 'rent' && newFilters.availableFrom) {
      params.set('availableFrom', newFilters.availableFrom);
    }

    // 15. Preserve Sort
    const currentSort = searchParams.get('sort');
    if (currentSort) {
      params.set('sort', currentSort);
    }

    // 16. Locality
    if (newFilters.locality && newFilters.locality.trim()) {
      params.set('locality', newFilters.locality.trim());
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  // Specific Handlers
  const handleSortChange = (val: SortOption) => {
    setCurrentPage(1);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);

    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', val.replace('-', '_'));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedFilters = {
      ...filters,
      location: localSelectedItem ? localSelectedItem.city : localSearch.trim(),
      locality: localSelectedItem && localSelectedItem.type === 'locality' ? localSelectedItem.name : '',
    };
    
    handleFilterChange(updatedFilters);
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

      // 2. City & Locality filters (or fallback search keyword matching)
      if (filters.locality) {
        const qLocality = filters.locality.toLowerCase().trim();
        const matchesLocality = property.location.address.toLowerCase().includes(qLocality);
        if (!matchesLocality) return false;
        
        if (filters.location) {
          const qCity = filters.location.toLowerCase().trim();
          const matchesCity = property.location.city.toLowerCase() === qCity;
          if (!matchesCity) return false;
        }
      } else if (filters.location) {
        const q = filters.location.toLowerCase().trim();
        const city = property.location.city.toLowerCase();
        
        // If it is an exact city name in localities, match equality, else fall back to text match
        const isKnownCity = ['mumbai', 'new delhi', 'gurugram', 'noida', 'bengaluru', 'hyderabad', 'chennai', 'pune'].includes(q);
        if (isKnownCity) {
          if (city !== q) return false;
        } else {
          const address = property.location.address.toLowerCase();
          const state = property.location.state.toLowerCase();
          const title = property.title.toLowerCase();
          const desc = property.description.toLowerCase();
          const matchesKeyword =
            city.includes(q) ||
            address.includes(q) ||
            state.includes(q) ||
            title.includes(q) ||
            desc.includes(q);
          if (!matchesKeyword) return false;
        }
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

      // 8. Advanced Filters
      const details = getDeterministicPropertyDetails(property.id, property.agent.role || 'broker', property.floor || 0);

      // Posted By
      if (filters.postedBy && filters.postedBy !== 'any') {
        if (details.postedBy !== filters.postedBy) return false;
      }

      // Property Age
      if (filters.propertyAge && filters.propertyAge.length > 0) {
        if (!filters.propertyAge.includes(details.propertyAge)) return false;
      }

      // Floor Preference
      if (filters.floorPreference && filters.floorPreference !== 'any') {
        if (details.floorPreference !== filters.floorPreference) return false;
      }

      // Facing
      if (filters.facing && filters.facing !== 'any') {
        if (details.facing !== filters.facing) return false;
      }

      // Water Supply
      if (filters.waterSupply && filters.waterSupply !== 'any') {
        if (filters.waterSupply === 'both') {
          if (details.waterSupply !== 'both') return false;
        } else {
          if (details.waterSupply !== filters.waterSupply && details.waterSupply !== 'both') return false;
        }
      }

      // Overlooking
      if (filters.overlooking && filters.overlooking.length > 0) {
        const matchesAll = filters.overlooking.every((o) => details.overlooking.includes(o));
        if (!matchesAll) return false;
      }

      // Available From (Rent properties only)
      if (filters.purpose === 'rent' && filters.availableFrom) {
        if (details.availableFrom > filters.availableFrom) return false;
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

  // --- Pagination Logic ---
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(sortedProperties.length / ITEMS_PER_PAGE);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedProperties, currentPage]);

  // Pagination UI Component
  const renderPagination = () => {
    if (totalPages <= 1 || viewMode === 'map') return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-xl flex items-center gap-1 cursor-pointer font-semibold"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {pages.map((p) => {
          const isActive = currentPage === p;
          return (
            <Button
              key={p}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(p)}
              className={`w-9 h-9 rounded-xl font-bold cursor-pointer ${
                isActive ? 'shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="rounded-xl flex items-center gap-1 cursor-pointer font-semibold"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Chip removal handlers
  const removePriceFilter = () => handleFilterChange({ ...filters, priceRange: [MIN_PRICE, MAX_PRICE] });
  const removePropertyTypeFilter = (val: string) => handleFilterChange({ ...filters, propertyTypes: filters.propertyTypes.filter((x) => x !== val) });
  const removeBhkFilter = (val: string) => handleFilterChange({ ...filters, bhk: filters.bhk.filter((x) => x !== val) });
  const removeAmenityFilter = (val: string) => handleFilterChange({ ...filters, selectedAmenities: filters.selectedAmenities.filter((x) => x !== val) });
  const removeFurnishingFilter = () => handleFilterChange({ ...filters, furnishing: 'Any' });
  const clearAllFilters = () => handleFilterChange({
    purpose: filters.purpose,
    location: '',
    priceRange: [MIN_PRICE, MAX_PRICE],
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
    locality: '',
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
            <div className="relative flex-1 w-full">
              <LocationAutocomplete 
                value={localSearch} 
                onChange={(val, item) => {
                  setLocalSearch(val);
                  setLocalSelectedItem(item);
                }}
                placeholder="Search by city or locality..."
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
        {/* Sort Dropdown & Advanced Filters Trigger */}
        <div className="flex items-center gap-3">
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

          <AdvancedFiltersModal 
            filters={filters} 
            onApply={handleFilterChange} 
            trigger={
              <Button 
                variant="outline" 
                className="flex items-center gap-2 rounded-xl border-border/80 text-foreground font-semibold px-4 cursor-pointer text-xs h-9 relative"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                <span>Advanced Filters</span>
                {(() => {
                  const activeAdvancedCount = getActiveAdvancedFiltersCount(filters);
                  return activeAdvancedCount > 0 ? (
                    <span className="bg-primary text-primary-foreground text-[9px] font-black h-5 px-2 flex items-center justify-center rounded-full shadow-xs shrink-0 ml-1">
                      +{activeAdvancedCount} filters active
                    </span>
                  ) : null;
                })()}
              </Button>
            }
          />
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
        <div className="flex-1 flex flex-col gap-6">
          {isLoading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : viewMode === 'list' ? (
              <div className="flex flex-col gap-5">
                {[...Array(5)].map((_, i) => (
                  <PropertyCardListSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="w-full h-[600px] rounded-3xl border border-border/80 bg-card/25 flex items-center justify-center animate-pulse">
                <span className="text-sm font-semibold text-muted-foreground animate-bounce">Loading Map View...</span>
              </div>
            )
          ) : sortedProperties.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                  {paginatedProperties.map((property) => (
                    <div key={property.id} className="h-full">
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              ) : viewMode === 'list' ? (
                <div className="flex flex-col gap-5 animate-fade-in">
                  {paginatedProperties.map((property) => (
                    <PropertyCardList key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="animate-fade-in">
                  <PropertyMap properties={sortedProperties} />
                </div>
              )}
              {renderPagination()}
            </>
          ) : (
            <EmptyState onClearFilters={clearAllFilters} />
          )}
        </div>
      </div>
    </div>
  );
}

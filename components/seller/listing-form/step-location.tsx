'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { ListingFormValues } from '@/lib/validations/listing-form';
import { ChevronRight, ChevronLeft, MapPin, Crosshair, HelpCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { mockCities } from '@/lib/mock-data/cities';
import { mockLocalities, LocalityItem } from '@/lib/mock-data/localities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Coordinates and State mapping for the 8 cities
const CITY_COORDINATES: Record<string, { lat: number; lng: number; state: string }> = {
  mumbai: { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  'new delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  bengaluru: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  gurugram: { lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  pune: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  hyderabad: { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  chennai: { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  kolkata: { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
};

// Dynamically import Leaflet map to avoid SSR/window issues
const LocationMap = dynamic(
  () => import('./location-map'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[280px] rounded-2xl border border-border/60 bg-muted/20 flex items-center justify-center animate-pulse">
        <span className="text-xs font-bold text-muted-foreground animate-bounce">Loading Interactive Map...</span>
      </div>
    ),
  }
);

interface StepLocationProps {
  register: UseFormRegister<ListingFormValues>;
  setValue: UseFormSetValue<ListingFormValues>;
  watch: UseFormWatch<ListingFormValues>;
  errors: FieldErrors<ListingFormValues>;
  trigger: UseFormTrigger<ListingFormValues>;
  onNext: () => void;
  onBack: () => void;
}

export default function StepLocation({
  register,
  setValue,
  watch,
  errors,
  trigger,
  onNext,
  onBack
}: StepLocationProps) {
  
  // Watch fields
  const city = watch('locationDetails.city') || '';
  const locality = watch('locationDetails.locality') || '';
  const lat = watch('locationDetails.lat') || 28.4595;
  const lng = watch('locationDetails.lng') || 77.0266;

  // Local state for locality autocomplete dropdown
  const [localitySuggestions, setLocalitySuggestions] = useState<LocalityItem[]>([]);
  const [isLocalityOpen, setIsLocalityOpen] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Close autocomplete on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setIsLocalityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter localities based on selected city & query
  const getFilteredLocalities = (query: string, selectedCity: string) => {
    if (!selectedCity) return [];
    
    // Find all localities belonging to the selected city
    const cityLocalities = mockLocalities.filter(
      (item) => item.city.toLowerCase() === selectedCity.toLowerCase() && item.type === 'locality'
    );

    if (!query.trim()) {
      return cityLocalities;
    }

    const q = query.toLowerCase().trim();
    return cityLocalities.filter((item) => item.name.toLowerCase().includes(q));
  };

  // Re-center map and update state/coords when city selection changes
  const handleCityChange = (newCity: string | null) => {
    if (!newCity) return;
    setValue('locationDetails.city', newCity);
    setValue('locationDetails.locality', ''); // Reset locality on city change

    const key = newCity.toLowerCase();
    if (CITY_COORDINATES[key]) {
      const { lat: cityLat, lng: cityLng, state: cityState } = CITY_COORDINATES[key];
      setValue('locationDetails.lat', cityLat);
      setValue('locationDetails.lng', cityLng);
      setValue('locationDetails.state', cityState);
    }
  };

  // Use browser geolocation to move center & pin
  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setValue('locationDetails.lat', userLat);
          setValue('locationDetails.lng', userLng);
          toast('Location updated to your current position.', 'success');
        },
        (error) => {
          console.error('Error fetching location:', error);
          toast('Could not retrieve your location. Check browser permissions.', 'error');
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast('Geolocation is not supported by your browser.', 'error');
    }
  };

  const handleNext = async () => {
    const isValid = await trigger('locationDetails');
    if (isValid) {
      onNext();
    } else {
      toast('Please enter a valid address and correct details.', 'error');
    }
  };

  // Handle autocomplete input text changes
  const handleLocalityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue('locationDetails.locality', query);
    
    const filtered = getFilteredLocalities(query, city);
    setLocalitySuggestions(filtered);
    setIsLocalityOpen(true);
    setActiveSuggestionIdx(-1);
  };

  const handleSelectLocality = (item: LocalityItem) => {
    setValue('locationDetails.locality', item.name);
    setIsLocalityOpen(false);
  };

  // Keyboard navigation for autocomplete suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isLocalityOpen || localitySuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIdx((prev) => 
        prev + 1 >= localitySuggestions.length ? 0 : prev + 1
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIdx((prev) => 
        prev - 1 < 0 ? localitySuggestions.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIdx >= 0 && activeSuggestionIdx < localitySuggestions.length) {
        handleSelectLocality(localitySuggestions[activeSuggestionIdx]);
      }
    } else if (e.key === 'Escape') {
      setIsLocalityOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
        <MapPin className="h-4.5 w-4.5 text-primary" />
        <span>Property Location</span>
      </div>

      {/* City & Locality/Area Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City Select */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">City</label>
          <Select value={city} onValueChange={handleCityChange}>
            <SelectTrigger className="w-full h-11 rounded-xl bg-background/50 border-border/80 flex items-center justify-between px-3.5 focus-visible:ring-primary/45">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {mockCities.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  <span className="flex items-center gap-2 text-xs font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {c.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.locationDetails?.city && (
            <span className="text-[11px] text-destructive font-bold">{errors.locationDetails.city.message}</span>
          )}
        </div>

        {/* Locality with Autocomplete */}
        <div ref={autocompleteRef} className="flex flex-col gap-1.5 relative text-left">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Locality / Area</label>
          <Input 
            type="text"
            placeholder="e.g. Bandra or Sector 54"
            value={locality}
            onChange={handleLocalityInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              const filtered = getFilteredLocalities(locality, city);
              setLocalitySuggestions(filtered);
              setIsLocalityOpen(true);
            }}
            className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold"
          />
          {isLocalityOpen && localitySuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-[68px] max-h-48 overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-lg z-50 text-left">
              {localitySuggestions.map((item, idx) => {
                const isSelected = idx === activeSuggestionIdx;
                return (
                  <li
                    key={item.id}
                    onClick={() => handleSelectLocality(item)}
                    onMouseEnter={() => setActiveSuggestionIdx(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer select-none transition-colors ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-foreground hover:bg-muted/70'
                    }`}
                  >
                    <MapPin className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`} />
                    <span className="truncate">{item.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
          {errors.locationDetails?.locality && (
            <span className="text-[11px] text-destructive font-bold">{errors.locationDetails.locality.message}</span>
          )}
        </div>
      </div>

      {/* Full Address (Textarea) */}
      <div className="flex flex-col gap-1.5 text-left">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Address</label>
        <textarea
          placeholder="Enter the complete building name, flat number, street and sector address"
          {...register('locationDetails.streetAddress')}
          className="flex min-h-[80px] w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-xs font-semibold focus-visible:ring-primary/45 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.locationDetails?.streetAddress && (
          <span className="text-[11px] text-destructive font-bold">{errors.locationDetails.streetAddress.message}</span>
        )}
      </div>

      {/* Landmark & Pincode Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Landmark (Optional) */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Landmark (Optional)</label>
          <Input 
            type="text"
            placeholder="e.g. Near HDFC Bank"
            {...register('locationDetails.landmark')}
            className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold"
          />
        </div>

        {/* Pincode */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pincode</label>
          <Input 
            type="text"
            maxLength={6}
            placeholder="e.g. 122001"
            {...register('locationDetails.pincode')}
            className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold"
          />
          {errors.locationDetails?.pincode && (
            <span className="text-[11px] text-destructive font-bold">{errors.locationDetails.pincode.message}</span>
          )}
        </div>
      </div>

      {/* Leaflet Map Interactive Pin Picker */}
      <div className="flex flex-col gap-2 mt-2 text-left">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5" title="Drag the pin to your exact property location.">
            <span className="text-xs font-bold text-foreground">Interactive Location Map</span>
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/80 cursor-help" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseMyLocation}
            className="rounded-xl h-8 text-[11px] font-bold border-border/85 flex items-center gap-1.5 hover:bg-muted/30 cursor-pointer"
          >
            <Crosshair className="h-3.5 w-3.5 text-primary" />
            <span>Use My Location</span>
          </Button>
        </div>

        <div className="w-full h-[280px] rounded-2xl overflow-hidden border border-border/60 shadow-sm relative">
          <LocationMap 
            lat={lat} 
            lng={lng} 
            onChange={(newLat, newLng) => {
              setValue('locationDetails.lat', newLat);
              setValue('locationDetails.lng', newLng);
            }} 
          />
        </div>

        {/* Coordinates display (Readonly, auto-updated) */}
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Latitude</label>
            <Input 
              type="text"
              readOnly
              value={lat !== undefined ? lat.toFixed(6) : ''}
              className="rounded-xl bg-muted/30 border-border/80 h-9 text-xs font-semibold cursor-not-allowed text-muted-foreground select-none focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Longitude</label>
            <Input 
              type="text"
              readOnly
              value={lng !== undefined ? lng.toFixed(6) : ''}
              className="rounded-xl bg-muted/30 border-border/80 h-9 text-xs font-semibold cursor-not-allowed text-muted-foreground select-none focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="flex justify-between pt-4 border-t border-border/25 mt-4">
        <Button 
          type="button" 
          variant="ghost"
          onClick={onBack}
          className="rounded-xl border border-border/80 h-10 font-bold text-xs cursor-pointer px-4"
        >
          <ChevronLeft className="h-4.5 w-4.5 mr-1" />
          <span>Back</span>
        </Button>
        <Button 
          type="button" 
          onClick={handleNext}
          className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 h-10 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border-none"
        >
          <span>Next Step</span>
          <ChevronRight className="h-4.5 w-4.5" />
        </Button>
      </div>

    </div>
  );
}

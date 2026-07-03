'use client';

import React, { useState } from 'react';
import { Search, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationAutocomplete from '@/components/ui/location-autocomplete';
import { LocalityItem } from '@/lib/mock-data/localities';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useRouter } from 'next/navigation';

export default function PropertySearchBar() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<string>('buy');
  const [location, setLocation] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<LocalityItem | undefined>(undefined);
  const [propertyType, setPropertyType] = useState<string>('Apartment');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (purpose) params.set('purpose', purpose);
    
    if (selectedItem) {
      params.set('city', selectedItem.city);
      if (selectedItem.type === 'locality') {
        params.set('locality', selectedItem.name);
      }
    } else if (location.trim()) {
      params.set('city', location.trim());
    }

    if (propertyType) params.set('type', propertyType.toLowerCase());
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Purpose Tabs (Buy / Rent / Commercial) */}
      <Tabs
        value={purpose}
        onValueChange={(val) => setPurpose(val as string)}
        className="w-fit mb-3"
      >
        <TabsList className="bg-background/90 p-1 border border-border/40 shadow-xs">
          <TabsTrigger value="buy" className="px-4 py-1.5 font-semibold text-sm">
            Buy
          </TabsTrigger>
          <TabsTrigger value="rent" className="px-4 py-1.5 font-semibold text-sm">
            Rent
          </TabsTrigger>
          <TabsTrigger value="commercial" className="px-4 py-1.5 font-semibold text-sm">
            Commercial
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main Search Panel */}
      <form
        onSubmit={handleSearch}
        className="bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row gap-4 items-stretch md:items-center"
      >
        {/* Location Input Group */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 px-1">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Location
          </label>
          <div className="relative flex-grow w-full">
            <LocationAutocomplete 
              value={location} 
              onChange={(val, item) => {
                setLocation(val);
                setSelectedItem(item);
              }}
              placeholder="Enter city or locality"
            />
          </div>
        </div>

        {/* Separator for desktop */}
        <div className="hidden md:block h-10 w-px bg-border/60 self-end mb-1" />

        {/* Property Type Dropdown Group */}
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 px-1">
            <Home className="h-3.5 w-3.5 text-primary" /> Property Type
          </label>
          <Select value={propertyType} onValueChange={(val) => setPropertyType(val || 'Apartment')}>
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-background/50 text-left hover:bg-background/80 focus-visible:bg-background transition-colors font-medium text-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border shadow-lg">
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Plot">Plot</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          size="lg"
          className="h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 md:self-end shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="h-4 w-4 stroke-[2.5]" />
          <span>Search</span>
        </Button>
      </form>
    </div>
  );
}

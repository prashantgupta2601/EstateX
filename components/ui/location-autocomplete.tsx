'use client';

import React, { useState, useEffect, useRef } from 'react';
import { mockLocalities, LocalityItem } from '@/lib/mock-data/localities';
import { MapPin, Building2 } from 'lucide-react';
import { Input } from './input';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, selectedItem?: LocalityItem) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = 'Enter city or locality',
  className = '',
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocalityItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val); // Fallback string search update

    if (val.trim().length >= 2) {
      const q = val.toLowerCase().trim();
      const filtered = mockLocalities.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(q);
        const cityMatch = item.city.toLowerCase().includes(q);
        return nameMatch || cityMatch;
      });
      setSuggestions(filtered.slice(0, 8));
      setIsOpen(true);
      setActiveIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (item: LocalityItem) => {
    const displayVal = item.type === 'locality' ? `${item.name}, ${item.city}` : item.name;
    onChange(displayVal, item); // Sync city/locality metadata back
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 >= suggestions.length ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 < 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value.trim().length >= 2) {
            setIsOpen(true);
          }
        }}
        className="h-11 w-full pl-3 pr-4 rounded-xl border-border bg-background/50 hover:bg-background/80 focus-visible:bg-background transition-colors text-sm"
      />

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-lg z-50 text-left">
          {suggestions.map((item, idx) => {
            const isSelected = idx === activeIndex;
            const isLocality = item.type === 'locality';
            return (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer select-none transition-colors ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-muted/70'
                }`}
              >
                {isLocality ? (
                  <MapPin className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`} />
                ) : (
                  <Building2 className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`} />
                )}
                <div className="flex-1 min-w-0">
                  <span className="block truncate text-sm font-bold leading-none">
                    {item.name}
                  </span>
                  {isLocality && (
                    <span className={`block truncate text-[10px] mt-1 font-semibold ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      City: {item.city}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md ${
                  isSelected
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {item.type}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

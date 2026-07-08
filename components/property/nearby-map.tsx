'use client';

import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getNearbyPlaces } from '@/lib/mock-data/nearby-places';

// Leaflet styles
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface NearbyMapProps {
  lat: number;
  lng: number;
  title: string;
}

type FilterType = 'all' | 'school' | 'hospital' | 'metro' | 'mall' | 'restaurant';

export default function NearbyMap({ lat, lng, title }: NearbyMapProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const position: [number, number] = [lat, lng];

  // Get nearby places dynamically
  const allPlaces = useMemo(() => getNearbyPlaces(lat, lng), [lat, lng]);

  // Filter nearby places
  const filteredPlaces = useMemo(() => {
    if (activeFilter === 'all') return allPlaces;
    return allPlaces.filter((p) => p.type === activeFilter);
  }, [allPlaces, activeFilter]);

  // Map of categories to classes/colors/icons
  const categoryConfig: Record<string, { colorClass: string; label: string; dotClass: string }> = {
    school: { colorClass: 'bg-blue-500', label: 'Schools', dotClass: 'bg-blue-500' },
    hospital: { colorClass: 'bg-emerald-500', label: 'Hospitals', dotClass: 'bg-emerald-500' },
    metro: { colorClass: 'bg-orange-500', label: 'Metro', dotClass: 'bg-orange-500' },
    mall: { colorClass: 'bg-purple-500', label: 'Malls', dotClass: 'bg-purple-500' },
    restaurant: { colorClass: 'bg-amber-500', label: 'Restaurants', dotClass: 'bg-amber-500' },
  };

  // Helper to create a custom HTML Leaflet icon
  const createDivIcon = (colorClass: string, isPrimary = false) => {
    const size = isPrimary ? 'h-5 w-5' : 'h-3.5 w-3.5';
    const pingSize = isPrimary ? 'h-6 w-6' : 'h-4 w-4';
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div class="relative flex items-center justify-center">
               <div class="animate-ping absolute inline-flex ${pingSize} rounded-full ${colorClass} opacity-60"></div>
               <div class="relative inline-flex rounded-full ${size} ${colorClass} border-2 border-white shadow-md"></div>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Title block */}
      <div>
        <h3 className="text-xl font-bold text-foreground">Nearby Landmarks</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Explore transit, education, healthcare, and dining near this listing</p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 py-1">
        {(['all', 'school', 'hospital', 'metro', 'mall', 'restaurant'] as FilterType[]).map((type) => {
          const isActive = activeFilter === type;
          const label = type === 'all' ? 'All' : categoryConfig[type].label;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setActiveFilter(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isActive 
                  ? 'bg-primary border-primary text-primary-foreground shadow-xs' 
                  : 'bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Leaflet Map */}
      <div className="w-full h-[260px] sm:h-[320px] md:h-[360px] rounded-3xl overflow-hidden border border-border/80 shadow-md relative z-10">
        <MapContainer
          center={position}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Primary Property Marker */}
          <Marker position={position} icon={createDivIcon('bg-rose-500', true)}>
            <Popup>
              <div className="flex flex-col gap-0.5 p-0.5 max-w-[200px]">
                <h4 className="font-extrabold text-xs text-foreground line-clamp-1">{title}</h4>
                <p className="text-[10px] text-muted-foreground">Property Location</p>
              </div>
            </Popup>
          </Marker>

          {/* Nearby Place Markers */}
          {filteredPlaces.map((place, idx) => {
            const config = categoryConfig[place.type];
            return (
              <Marker 
                key={idx} 
                position={[place.lat, place.lng]} 
                icon={createDivIcon(config.colorClass, false)}
              >
                <Popup>
                  <div className="flex flex-col gap-0.5 p-0.5 max-w-[200px] text-left">
                    <h4 className="font-bold text-xs text-foreground leading-tight">{place.name}</h4>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] font-semibold text-muted-foreground capitalize">
                      <span className={`h-2 w-2 rounded-full ${config.dotClass}`} />
                      <span>{place.type} &bull; {place.distanceKm} km away</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend Block */}
      <div className="bg-card/20 border border-border/60 rounded-2xl p-4 flex flex-wrap gap-x-6 gap-y-3 items-center justify-center text-xs font-bold text-muted-foreground shadow-xs">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse border-2 border-white shadow-xs" />
          <span>Subject Property</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500 border-2 border-white shadow-xs" />
          <span>Schools</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
          <span>Hospitals</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-orange-500 border-2 border-white shadow-xs" />
          <span>Metro Stations</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-purple-500 border-2 border-white shadow-xs" />
          <span>Malls</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-500 border-2 border-white shadow-xs" />
          <span>Restaurants</span>
        </div>
      </div>
    </div>
  );
}

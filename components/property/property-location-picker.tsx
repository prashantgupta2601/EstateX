'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Major cities centers for auto-centering
const CITY_COORDINATES: Record<string, [number, number]> = {
  gurugram: [28.4595, 77.0266],
  noida: [28.5355, 77.3910],
  delhi: [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  mumbai: [19.0760, 72.8777],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  pune: [18.5204, 73.8567],
  kolkata: [22.5726, 88.3639],
};

interface PropertyLocationPickerProps {
  lat: number;
  lng: number;
  city?: string;
  onChange: (lat: number, lng: number) => void;
}

// Inner component to handle flyTo / setView when center updates externally
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Inner component to handle click events on the map
function MapEventsHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function PropertyLocationPicker({
  lat,
  lng,
  city = '',
  onChange,
}: PropertyLocationPickerProps) {
  const [localLat, setLocalLat] = useState(lat.toString());
  const [localLng, setLocalLng] = useState(lng.toString());
  const markerRef = useRef<L.Marker>(null);

  // Sync inputs with parent state
  useEffect(() => {
    setLocalLat(lat.toFixed(6));
    setLocalLng(lng.toFixed(6));
  }, [lat, lng]);

  // Sync with selected city when city prop changes
  useEffect(() => {
    if (!city) return;
    const key = city.toLowerCase().trim();
    if (CITY_COORDINATES[key]) {
      const [cityLat, cityLng] = CITY_COORDINATES[key];
      // Only update if current coords are far away from city center (prevents resetting user choice)
      const distance = Math.sqrt(Math.pow(lat - cityLat, 2) + Math.pow(lng - cityLng, 2));
      if (distance > 0.1) {
        onChange(cityLat, cityLng);
      }
    }
  }, [city, onChange, lat, lng]);

  // Handle marker drag
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          onChange(latLng.lat, latLng.lng);
        }
      },
    }),
    [onChange]
  );

  // Custom premium marker icon
  const customMarkerIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div class="relative flex items-center justify-center">
               <div class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-50"></div>
               <div class="relative inline-flex rounded-full h-5 w-5 bg-primary border-2 border-white shadow-md"></div>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  // Set coordinates manually from input fields
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLat = parseFloat(localLat);
    const parsedLng = parseFloat(localLng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      if (parsedLat >= -90 && parsedLat <= 90 && parsedLng >= -180 && parsedLng <= 180) {
        onChange(parsedLat, parsedLng);
      }
    }
  };

  // Get current location from navigator
  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
          alert('Could not retrieve your location. Please check your browser permissions.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const position: [number, number] = [lat, lng];

  return (
    <div className="flex flex-col gap-4 text-left font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4.5 w-4.5 text-primary" />
          <span className="text-xs font-bold text-foreground">Select Coordinates on Map</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLocateMe}
          className="rounded-xl h-8 text-[11px] font-semibold border-border/85 flex items-center gap-1.5 hover:bg-muted/30 cursor-pointer"
        >
          <Crosshair className="h-3.5 w-3.5" />
          <span>Locate Me</span>
        </Button>
      </div>

      {/* Map display */}
      <div className="w-full h-[280px] rounded-2xl overflow-hidden border border-border/60 shadow-inner relative z-10">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={position} />
          <MapEventsHandler onClick={onChange} />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={customMarkerIcon}
          />
        </MapContainer>
      </div>

      {/* Lat Lng manual inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Latitude</label>
          <Input
            type="number"
            step="0.000001"
            value={localLat}
            onChange={(e) => setLocalLat(e.target.value)}
            className="rounded-xl h-9 border-border/80 text-xs"
            placeholder="Latitude"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Longitude</label>
          <Input
            type="number"
            step="0.000001"
            value={localLng}
            onChange={(e) => setLocalLng(e.target.value)}
            className="rounded-xl h-9 border-border/80 text-xs"
            placeholder="Longitude"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Button
            type="button"
            onClick={handleManualSubmit}
            variant="secondary"
            className="w-full h-9 rounded-xl text-xs font-semibold hover:bg-muted/40 cursor-pointer"
          >
            Apply Coords
          </Button>
        </div>
      </div>

      <span className="text-[10px] text-muted-foreground">
        Tip: Click anywhere on the map or drag the green-ringed pin to adjust coordinates.
      </span>
    </div>
  );
}

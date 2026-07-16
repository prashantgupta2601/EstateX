'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface LocationMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

// MapController reacts to lat/lng updates by calling map.setView
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function LocationMap({ lat, lng, onChange }: LocationMapProps) {
  const markerRef = useRef<L.Marker>(null);

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

  const customMarkerIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div class="relative flex items-center justify-center">
               <div class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-40"></div>
               <div class="relative inline-flex rounded-full h-5 w-5 bg-primary border-2 border-white shadow-md"></div>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  const position: [number, number] = [lat, lng];

  return (
    <div className="w-full h-full min-h-[280px] rounded-2xl overflow-hidden border border-border/60 shadow-inner relative z-10">
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
        <MapController center={position} />
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
          icon={customMarkerIcon}
        />
      </MapContainer>
    </div>
  );
}

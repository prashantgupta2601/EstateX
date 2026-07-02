'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Leaflet styles
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface SinglePropertyMapProps {
  lat: number;
  lng: number;
  title: string;
  address: string;
}

export default function SinglePropertyMap({ lat, lng, title, address }: SinglePropertyMapProps) {
  const position: [number, number] = [lat, lng];

  return (
    <div className="w-full h-[350px] rounded-3xl overflow-hidden border border-border/80 shadow-md relative z-10">
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
        <Marker position={position}>
          <Popup>
            <div className="flex flex-col gap-1 p-0.5 max-w-[200px]">
              <h4 className="font-bold text-xs text-foreground line-clamp-1">{title}</h4>
              <p className="text-[10px] text-muted-foreground line-clamp-2">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

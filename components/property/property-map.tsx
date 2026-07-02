'use client';

import React, { useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Property } from '@/types/property';
import { formatIndianCurrency } from '@/lib/utils/emi-calculator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';

// Leaflet styles
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Map controller component to handle view updates when properties change
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface PropertyMapProps {
  properties: Property[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  // Compute map center and zoom level based on properties
  const { center, zoom } = useMemo(() => {
    if (!properties || properties.length === 0) {
      return { center: [20.5937, 78.9629] as [number, number], zoom: 5 };
    }

    let totalLat = 0;
    let totalLng = 0;
    let count = 0;
    const cities = new Set<string>();

    properties.forEach((p) => {
      if (p.location.coordinates) {
        totalLat += p.location.coordinates.lat;
        totalLng += p.location.coordinates.lng;
        count++;
        cities.add(p.location.city.toLowerCase());
      }
    });

    if (count === 0) {
      return { center: [20.5937, 78.9629] as [number, number], zoom: 5 };
    }

    const avgLat = totalLat / count;
    const avgLng = totalLng / count;
    const zoomLevel = cities.size === 1 ? 11 : 5;

    return { center: [avgLat, avgLng] as [number, number], zoom: zoomLevel };
  }, [properties]);

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-border/80 shadow-md relative z-10">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} zoom={zoom} />

        {properties.map((property) => {
          if (!property.location.coordinates) return null;
          return (
            <Marker
              key={property.id}
              position={[property.location.coordinates.lat, property.location.coordinates.lng]}
            >
              <Popup className="premium-map-popup">
                <div className="flex flex-col gap-2 w-48 text-left p-0.5">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                    {property.images?.[0] ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                    {property.isVerified && (
                      <Badge className="absolute top-1.5 left-1.5 bg-success text-success-foreground border-none flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold">
                        <ShieldCheck className="h-2.5 w-2.5" />
                        <span>Verified</span>
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-extrabold text-foreground">
                      {formatIndianCurrency(property.price)}
                      {property.type === 'rent' && <span className="text-[10px] font-normal text-muted-foreground">/mo</span>}
                    </span>
                    <h4 className="text-xs font-bold line-clamp-1 hover:text-primary transition-colors">
                      {property.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {property.location.address}, {property.location.city}
                    </p>
                  </div>
                  <Link href={`/properties/${property.id}`} className="w-full mt-1">
                    <Button size="sm" className="w-full h-8 rounded-lg text-xs font-semibold cursor-pointer">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  Plus, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  Edit3, 
  Archive, 
  Trash2,
  ExternalLink 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockProperties } from '@/lib/mock-data/properties';

export default function SellerPropertiesPage() {
  const [properties, setProperties] = useState(mockProperties.slice(0, 4)); // Show a subset of properties

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Crore`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success-foreground border border-success/20">
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Pending Approval
          </span>
        );
      case 'sold':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-650 border border-slate-500/20">
            Archived
          </span>
        );
    }
  };

  const handleDelete = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Properties</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and track your listed properties</p>
        </div>
        
        <Link href="/seller/properties/add">
          <Button className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 shadow-xs cursor-pointer flex items-center gap-1.5 h-10 text-xs">
            <Plus className="h-4.5 w-4.5" />
            <span>Add New Property</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {properties.length > 0 ? (
          properties.map((property) => (
            <Card key={property.id} className="rounded-2xl border-border/40 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
              <CardContent className="p-0 flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 bg-muted">
                  <Image 
                    src={property.images[0] || 'https://placehold.co/600x400'} 
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 256px"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {getStatusBadge(property.status)}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs border border-white/10">
                      {property.propertyType}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-lg font-extrabold text-foreground tracking-tight line-clamp-1">
                        {property.title}
                      </span>
                      <span className="text-base font-black text-primary shrink-0">
                        {formatPrice(property.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{property.location.address}, {property.location.city}</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
                      {property.description}
                    </p>
                  </div>

                  {/* Specs & Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <BedDouble className="h-4 w-4" />
                        <span>{property.bedrooms} BHK</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize className="h-4 w-4" />
                        <span>{property.area} {property.areaUnit}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`/properties/${property.id}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8.5 w-8.5 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer" title="View Public Listing">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/seller/properties/edit/${property.id}`}>
                        <Button variant="ghost" size="icon" className="h-8.5 w-8.5 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer" title="Edit Listing">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8.5 w-8.5 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer" title="Archive Listing">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(property.id)}
                        className="h-8.5 w-8.5 rounded-xl border border-border/80 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer" 
                        title="Delete Listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center border border-dashed border-border/80 rounded-3xl bg-card/20 flex flex-col items-center justify-center">
            <Building2 className="h-10 w-10 text-muted-foreground/60 mb-3" />
            <h3 className="text-lg font-bold text-foreground">No properties listed</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">Start listing your properties to receive direct enquiries from buyers.</p>
            <Link href="/seller/properties/add" className="mt-4">
              <Button size="sm" className="rounded-xl font-bold cursor-pointer">Add Property</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

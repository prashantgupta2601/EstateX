import React from 'react';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="aspect-video w-full bg-muted relative">
        {property.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="h-full w-full object-cover" 
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image Available
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{property.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">
            {property.currency || '$'}{property.price.toLocaleString()}
          </span>
          <span className="capitalize text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
            For {property.type}
          </span>
        </div>
      </div>
    </div>
  );
}

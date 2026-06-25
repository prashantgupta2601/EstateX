import React from 'react';

interface PropertyGalleryProps {
  images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      <div className="md:col-span-2 aspect-video relative overflow-hidden rounded-lg bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={images[0]} 
          alt="Primary property image" 
          className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform" 
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 md:col-span-2 gap-2">
        {images.slice(1, 3).map((img, index) => (
          <div key={index} className="aspect-video relative overflow-hidden rounded-lg bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={img} 
              alt={`Property detail ${index + 1}`} 
              className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform" 
            />
          </div>
        ))}
        {images.length > 3 && (
          <div className="aspect-video relative overflow-hidden rounded-lg bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80">
            <span className="text-lg font-bold">+{images.length - 3} More</span>
          </div>
        )}
      </div>
    </div>
  );
}

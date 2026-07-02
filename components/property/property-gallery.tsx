'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full rounded-3xl bg-muted flex items-center justify-center text-muted-foreground border border-border/80">
        No images available
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const showNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const showPrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Main large image */}
        <div 
          onClick={() => openLightbox(0)}
          className="md:col-span-2 aspect-[4/3] md:aspect-video relative overflow-hidden rounded-3xl bg-muted border border-border/80 cursor-pointer group"
        >
          <Image 
            src={images[0]} 
            alt="Primary property image" 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Small thumbnail side-column */}
        <div className="grid grid-cols-2 md:grid-cols-1 md:col-span-2 gap-3">
          {images.slice(1, 3).map((img, index) => (
            <div 
              key={index} 
              onClick={() => openLightbox(index + 1)}
              className="aspect-video relative overflow-hidden rounded-3xl bg-muted border border-border/80 cursor-pointer group"
            >
              <Image 
                src={img} 
                alt={`Property detail ${index + 1}`} 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
          {images.length > 3 ? (
            <div 
              onClick={() => openLightbox(3)}
              className="aspect-video relative overflow-hidden rounded-3xl bg-muted border border-border/80 cursor-pointer flex items-center justify-center hover:bg-muted/80 transition-colors group"
            >
              {/* Blur backdrop for remaining count */}
              <Image 
                src={images[3]} 
                alt="Remaining properties teaser" 
                fill
                className="object-cover opacity-40 blur-[1px] transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <span className="relative z-10 text-xl font-extrabold text-foreground bg-background/80 px-4 py-2 rounded-2xl border border-border/40 backdrop-blur-xs shadow-md">
                +{images.length - 3} More
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          showCloseButton={false} 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl p-0 bg-transparent border-none ring-0 shadow-none outline-none flex flex-col items-center justify-center sm:max-w-none"
        >
          {/* Main Overlay Wrapper */}
          <div className="relative w-full aspect-[4/3] md:aspect-video max-h-[80vh] rounded-3xl overflow-hidden bg-black/95 border border-white/10 shadow-2xl flex items-center justify-center">
            
            {/* Top Bar inside Lightbox */}
            <div className="absolute top-4 left-4 right-4 right-0 z-50 flex items-center justify-between text-white/90">
              <span className="text-sm font-semibold bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                Image {activeIndex + 1} of {images.length}
              </span>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/80 border border-white/10 transition-colors cursor-pointer text-white"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full">
              <Image
                src={images[activeIndex]}
                alt={`Property photo ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  className="absolute left-4 p-3 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/80 border border-white/10 transition-all cursor-pointer text-white shadow-md active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-4 p-3 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/80 border border-white/10 transition-all cursor-pointer text-white shadow-md active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails row below main picture (desktop only) */}
          {images.length > 1 && (
            <div className="hidden md:flex gap-2 mt-4 max-w-full overflow-x-auto py-2 px-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
              {images.map((img, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isActive ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


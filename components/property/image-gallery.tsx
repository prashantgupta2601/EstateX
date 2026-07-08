'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = () => {
    setLightboxIndex(activeIndex);
    setIsOpen(true);
  };

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % (images?.length || 1));
  }, [images?.length]);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + (images?.length || 1)) % (images?.length || 1));
  }, [images?.length]);

  // Keyboard navigation support inside lightbox
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video md:aspect-[21/9] w-full rounded-3xl bg-muted flex items-center justify-center text-muted-foreground border border-border/80">
        No images available
      </div>
    );
  }

  return (
    <>
      <section 
        role="region" 
        aria-label="Property image gallery" 
        className="flex flex-col gap-4 w-full"
      >
      {/* Main Large Image Display */}
      <div 
        role="button"
        tabIndex={0}
        onClick={handleOpenLightbox}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenLightbox();
          }
        }}
        aria-label={`Property image ${activeIndex + 1} of ${images.length}. Click or press Enter to view fullscreen.`}
        className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-3xl bg-muted border border-border/80 cursor-pointer group shadow-sm focus-visible:ring-3 focus-visible:ring-primary focus-visible:outline-hidden"
      >
        <Image
          src={images[activeIndex]}
          alt={`Property view ${activeIndex + 1} of ${images.length}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="100vw"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
        
        {/* Image Counter Overlay */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip Below */}
      <div className="flex items-center gap-3 overflow-x-auto py-1" aria-label="Gallery thumbnails">
        {images.map((img, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Select property photo ${idx + 1}`}
              aria-current={isActive ? 'true' : 'false'}
              className={`relative w-24 sm:w-28 h-16 sm:h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-hidden ${
                isActive ? 'border-primary scale-[1.03] shadow-md' : 'border-border/60 opacity-70 hover:opacity-100 hover:border-border'
              }`}
            >
              <Image
                src={img}
                alt={`Property thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 96px, 112px"
              />
            </button>
          );
        })}
      </div>
    </section>

      {/* Fullscreen Lightbox Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          showCloseButton={false}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl p-0 bg-transparent border-none ring-0 shadow-none outline-none flex flex-col items-center justify-center sm:max-w-none"
        >
          {/* Main Overlay Wrapper */}
          <div className="relative w-full aspect-[4/3] md:aspect-video max-h-[85vh] rounded-3xl overflow-hidden bg-black/95 border border-white/10 shadow-2xl flex items-center justify-center">
            
            {/* Top Bar inside Lightbox */}
            <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between text-white/90">
              <span className="text-sm font-semibold bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                Image {lightboxIndex + 1} of {images.length}
              </span>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/85 border border-white/10 transition-colors cursor-pointer text-white shadow-md active:scale-95"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full">
              <Image
                src={images[lightboxIndex]}
                alt={`Property photo ${lightboxIndex + 1}`}
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
                  onClick={handlePrev}
                  className="absolute left-4 p-3 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/85 border border-white/10 transition-all cursor-pointer text-white shadow-md active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 p-3 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/85 border border-white/10 transition-all cursor-pointer text-white shadow-md active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails row below main picture inside lightbox (desktop only) */}
          {images.length > 1 && (
            <div className="hidden md:flex gap-2 mt-4 max-w-full overflow-x-auto py-2 px-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
              {images.map((img, index) => {
                const isActive = lightboxIndex === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isActive ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Lightbox thumbnail ${index + 1}`}
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
    </>
  );
}

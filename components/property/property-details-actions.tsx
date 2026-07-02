'use client';

import React, { useState } from 'react';
import { Heart, Share2, GitCompare, Check } from 'lucide-react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { useEstate } from '@/lib/context/estate-context';

interface PropertyDetailsActionsProps {
  property: Property;
}

export default function PropertyDetailsActions({ property }: PropertyDetailsActionsProps) {
  const { toggleWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare, isMounted } = useEstate();
  const [copied, setCopied] = useState(false);

  const isWishlisted = isMounted ? isInWishlist(property.id) : false;
  const isCompared = isMounted ? isInCompare(property.id) : false;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex items-center gap-3 relative">
      {/* Share Toast Feedback */}
      {copied && (
        <span className="absolute -top-10 right-0 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-md shadow-md animate-fade-in-down">
          Link copied to clipboard!
        </span>
      )}

      {/* Share Button */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleShare}
        className="rounded-full cursor-pointer hover:bg-muted relative"
        aria-label="Share property"
      >
        {copied ? (
          <Check className="h-4 w-4 text-success animate-scale-up" />
        ) : (
          <Share2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        )}
      </Button>

      {/* Compare Button */}
      <Button
        variant={isCompared ? 'default' : 'outline'}
        size="icon-sm"
        onClick={() => {
          if (isCompared) {
            removeFromCompare(property.id);
          } else {
            const res = addToCompare(property);
            if (!res.success) {
              alert(res.message);
            }
          }
        }}
        className={`rounded-full cursor-pointer hover:bg-muted ${
          isCompared ? 'bg-primary text-primary-foreground' : ''
        }`}
        aria-label={isCompared ? 'Remove from compare' : 'Add to compare'}
      >
        <GitCompare className={`h-4 w-4 ${isCompared ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} />
      </Button>

      {/* Wishlist Button */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => toggleWishlist(property.id)}
        className={`rounded-full cursor-pointer transition-colors hover:bg-muted ${
          isWishlisted ? 'bg-red-500 border-red-500 hover:bg-red-600 text-white' : ''
        }`}
        aria-label="Add to favorites"
      >
        <Heart
          className={`h-4 w-4 ${
            isWishlisted ? 'fill-current text-white' : 'text-muted-foreground hover:text-foreground'
          }`}
        />
      </Button>
    </div>
  );
}

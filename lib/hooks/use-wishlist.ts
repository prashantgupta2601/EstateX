import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/toast';

const WISHLIST_EVENT = 'estatehub_wishlist_change';

const getSavedWishlist = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('estatehub_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to parse wishlist from localStorage:', e);
    return [];
  }
};

export function useWishlist() {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  // Fetch wishlist from API when authenticated, or sync with localStorage when guest
  useEffect(() => {
    let isMounted = true;

    if (isAuthenticated) {
      fetch('/api/wishlist')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && data && Array.isArray(data.propertyIds)) {
            setWishlist(data.propertyIds);
            localStorage.setItem('estatehub_wishlist', JSON.stringify(data.propertyIds));
          }
        })
        .catch((err) => {
          console.warn('Wishlist API fetch fallback to local storage:', err);
          if (isMounted) setWishlist(getSavedWishlist());
        });
    } else {
      setWishlist(getSavedWishlist());
    }

    const handleSync = () => {
      setWishlist(getSavedWishlist());
    };

    window.addEventListener(WISHLIST_EVENT, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener(WISHLIST_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [isAuthenticated]);

  const updateWishlistLocal = useCallback((newWishlist: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('estatehub_wishlist', JSON.stringify(newWishlist));
        setWishlist(newWishlist);
        window.dispatchEvent(new Event(WISHLIST_EVENT));
      } catch (e) {
        console.error('Failed to save wishlist to localStorage:', e);
      }
    }
  }, []);

  const addToWishlist = useCallback(
    async (id: string) => {
      // Optimistic update
      const current = wishlist.includes(id) ? wishlist : [...wishlist, id];
      updateWishlistLocal(current);

      if (isAuthenticated) {
        try {
          const res = await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId: id }),
          });
          if (res.ok) {
            toast('Property added to your wishlist', 'success');
          }
        } catch (err) {
          console.error('Failed to add to database wishlist:', err);
        }
      } else {
        toast('Saved to wishlist. Log in to sync across devices!');
      }
    },
    [wishlist, isAuthenticated, updateWishlistLocal]
  );

  const removeFromWishlist = useCallback(
    async (id: string) => {
      // Optimistic update
      const current = wishlist.filter((item) => item !== id);
      updateWishlistLocal(current);

      if (isAuthenticated) {
        try {
          const res = await fetch(`/api/wishlist?propertyId=${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            toast('Property removed from your wishlist');
          }
        } catch (err) {
          console.error('Failed to remove from database wishlist:', err);
        }
      }
    },
    [wishlist, isAuthenticated, updateWishlistLocal]
  );

  const isInWishlist = useCallback(
    (id: string) => {
      return wishlist.includes(id);
    },
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    updateWishlistLocal([]);
  }, [updateWishlistLocal]);

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
}

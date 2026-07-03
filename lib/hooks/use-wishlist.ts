import { useState, useEffect, useCallback } from 'react';

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
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Initialize on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setWishlist(getSavedWishlist());
    }, 0);

    const handleSync = () => {
      setWishlist(getSavedWishlist());
    };

    window.addEventListener(WISHLIST_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(WISHLIST_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const updateWishlist = useCallback((newWishlist: string[]) => {
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

  const addToWishlist = useCallback((id: string) => {
    const current = getSavedWishlist();
    if (!current.includes(id)) {
      updateWishlist([...current, id]);
    }
  }, [updateWishlist]);

  const removeFromWishlist = useCallback((id: string) => {
    const current = getSavedWishlist();
    if (current.includes(id)) {
      updateWishlist(current.filter((item) => item !== id));
    }
  }, [updateWishlist]);

  const isInWishlist = useCallback((id: string) => {
    return wishlist.includes(id);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    updateWishlist([]);
  }, [updateWishlist]);

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
}

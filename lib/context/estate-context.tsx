'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property } from '@/types/property';

interface EstateContextType {
  wishlist: string[];
  compareList: Property[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  addToCompare: (property: Property) => { success: boolean; message: string };
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  isMounted: boolean;
}

const EstateContext = createContext<EstateContextType | undefined>(undefined);

export function EstateProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedWishlist = localStorage.getItem('estatex_wishlist');
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
        const savedCompare = localStorage.getItem('estatex_compare');
        if (savedCompare) {
          setCompareList(JSON.parse(savedCompare));
        }
      } catch (e) {
        console.error('Failed to load estate data from localStorage:', e);
      }
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage when wishlist changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('estatex_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e);
    }
  }, [wishlist, isMounted]);

  // Save to localStorage when compareList changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('estatex_compare', JSON.stringify(compareList));
    } catch (e) {
      console.error('Failed to save comparison list to localStorage:', e);
    }
  }, [compareList, isMounted]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: string) => {
    return wishlist.includes(id);
  };

  const addToCompare = (property: Property): { success: boolean; message: string } => {
    if (compareList.some((p) => p.id === property.id)) {
      return { success: false, message: 'Property is already in the comparison list.' };
    }
    if (compareList.length >= 3) {
      return { success: false, message: 'You can compare up to 3 properties at a time.' };
    }
    setCompareList((prev) => [...prev, property]);
    return { success: true, message: 'Added to comparison list.' };
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((property) => property.id !== id));
  };

  const isInCompare = (id: string) => {
    return compareList.some((property) => property.id === id);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <EstateContext.Provider
      value={{
        wishlist,
        compareList,
        toggleWishlist,
        isInWishlist,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        isMounted,
      }}
    >
      {children}
    </EstateContext.Provider>
  );
}

export function useEstate() {
  const context = useContext(EstateContext);
  if (context === undefined) {
    throw new Error('useEstate must be used within an EstateProvider');
  }
  return context;
}

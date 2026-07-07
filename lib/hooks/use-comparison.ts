'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/toast';

const COMPARISON_EVENT = 'estatex_comparison_change';
const COMPARISON_STORAGE_KEY = 'estatex_comparison_ids';

const getSavedComparison = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = sessionStorage.getItem(COMPARISON_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to parse comparison list from sessionStorage:', e);
    return [];
  }
};

export function useComparison() {
  const [comparison, setComparison] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize and synchronize state
  useEffect(() => {
    const timer = setTimeout(() => {
      setComparison(getSavedComparison());
      setIsMounted(true);
    }, 0);

    const handleSync = () => {
      setComparison(getSavedComparison());
    };

    window.addEventListener(COMPARISON_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(COMPARISON_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const updateComparison = useCallback((newComparison: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(newComparison));
        setComparison(newComparison);
        window.dispatchEvent(new Event(COMPARISON_EVENT));
      } catch (e) {
        console.error('Failed to save comparison list to sessionStorage:', e);
      }
    }
  }, []);

  const addToCompare = useCallback((id: string) => {
    const current = getSavedComparison();
    if (current.includes(id)) return;
    if (current.length >= 4) {
      toast('You can compare up to 4 properties at a time.', 'error');
      return;
    }
    updateComparison([...current, id]);
  }, [updateComparison]);

  const removeFromCompare = useCallback((id: string) => {
    const current = getSavedComparison();
    if (current.includes(id)) {
      updateComparison(current.filter((item) => item !== id));
    }
  }, [updateComparison]);

  const isInCompare = useCallback((id: string) => {
    return comparison.includes(id);
  }, [comparison]);

  const clearComparison = useCallback(() => {
    updateComparison([]);
  }, [updateComparison]);

  return {
    comparison,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearComparison,
    isMounted,
  };
}

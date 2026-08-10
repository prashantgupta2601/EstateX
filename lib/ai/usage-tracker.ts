'use client';

import { useState, useEffect, useCallback } from 'react';

export type AIFeatureKey =
  | 'descriptionGenerations'
  | 'pricePredictions'
  | 'recommendations'
  | 'chatMessages'
  | 'imageAnalyses';

export interface AIUsageState {
  descriptionGenerations: number;
  pricePredictions: number;
  recommendations: number;
  chatMessages: number;
  imageAnalyses: number;
  lastResetDate: string; // Format: YYYY-MM-DD
}

export const AI_DAILY_LIMITS: Record<AIFeatureKey, number> = {
  descriptionGenerations: 10,
  pricePredictions: 5,
  recommendations: 20,
  chatMessages: 50,
  imageAnalyses: 30,
};

const STORAGE_KEY = 'estatex_ai_usage';
const USAGE_EVENT_NAME = 'estatex_ai_usage_changed';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_STATE: AIUsageState = {
  descriptionGenerations: 0,
  pricePredictions: 0,
  recommendations: 0,
  chatMessages: 0,
  imageAnalyses: 0,
  lastResetDate: getTodayString(),
};

/**
 * Get current AI usage from localStorage with automatic daily reset check.
 */
export function getAIUsage(): AIUsageState {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  const today = getTodayString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialState = { ...DEFAULT_STATE, lastResetDate: today };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
      return initialState;
    }

    const parsed: AIUsageState = JSON.parse(raw);
    if (parsed.lastResetDate !== today) {
      // Midnight reset triggered
      const resetState: AIUsageState = {
        descriptionGenerations: 0,
        pricePredictions: 0,
        recommendations: 0,
        chatMessages: 0,
        imageAnalyses: 0,
        lastResetDate: today,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetState));
      return resetState;
    }

    return parsed;
  } catch (e) {
    console.error('Failed to parse AI usage from localStorage:', e);
    return { ...DEFAULT_STATE, lastResetDate: today };
  }
}

/**
 * Get the daily usage limit for a given feature.
 */
export function getFeatureLimit(featureKey: AIFeatureKey): number {
  return AI_DAILY_LIMITS[featureKey] || 10;
}

/**
 * Get the remaining uses today for a feature.
 */
export function getRemainingUses(featureKey: AIFeatureKey): number {
  const usage = getAIUsage();
  const limit = getFeatureLimit(featureKey);
  const used = usage[featureKey] || 0;
  return Math.max(0, limit - used);
}

/**
 * Check if the user has remaining quota to run the feature.
 */
export function checkCanUse(featureKey: AIFeatureKey): boolean {
  return getRemainingUses(featureKey) > 0;
}

/**
 * Increment usage count for a feature and dispatch update event.
 */
export function incrementUsage(featureKey: AIFeatureKey): void {
  if (typeof window === 'undefined') return;

  const usage = getAIUsage();
  const limit = getFeatureLimit(featureKey);
  const currentCount = usage[featureKey] || 0;

  if (currentCount >= limit) {
    console.warn(`Daily limit reached for ${featureKey}`);
    return;
  }

  const updatedUsage: AIUsageState = {
    ...usage,
    [featureKey]: currentCount + 1,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsage));
    window.dispatchEvent(new Event(USAGE_EVENT_NAME));
  } catch (e) {
    console.error('Failed to update AI usage in localStorage:', e);
  }
}

/**
 * Custom React hook to track and reactively update usage state for a feature.
 */
export function useAIUsage(featureKey: AIFeatureKey) {
  const [remaining, setRemaining] = useState<number>(() => getRemainingUses(featureKey));
  const limit = getFeatureLimit(featureKey);

  const refresh = useCallback(() => {
    setRemaining(getRemainingUses(featureKey));
  }, [featureKey]);

  useEffect(() => {
    refresh();

    const handleStorageChange = () => refresh();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(USAGE_EVENT_NAME, handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(USAGE_EVENT_NAME, handleStorageChange);
    };
  }, [refresh]);

  const canUse = remaining > 0;

  return {
    remaining,
    limit,
    canUse,
    used: limit - remaining,
    increment: () => incrementUsage(featureKey),
    refresh,
  };
}

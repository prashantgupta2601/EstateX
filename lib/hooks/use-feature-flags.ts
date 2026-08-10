'use client';

import { useState, useEffect, useCallback } from 'react';

export interface FeatureFlagItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const STORAGE_KEY = 'estatex_feature_flags';
const EVENT_NAME = 'estatex_feature_flags_changed';

export const DEFAULT_FEATURE_FLAGS: FeatureFlagItem[] = [
  {
    id: 'ai-features',
    name: 'AI Features Master Switch',
    description: 'Enable or disable all AI powered capabilities platform-wide.',
    enabled: true,
  },
  {
    id: 'ai-recommendations',
    name: 'AI Property Recommendations',
    description: 'Deliver personalized property suggestions using AI vector search.',
    enabled: true,
  },
  {
    id: 'ai-description',
    name: 'AI Description Generator',
    description: 'Auto-generate attractive listing descriptions from property attributes.',
    enabled: true,
  },
  {
    id: 'ai-price-prediction',
    name: 'AI Price Prediction',
    description: 'Provide estimated market price ranges using historical transaction data.',
    enabled: true,
  },
  {
    id: 'ai-chat-assistant',
    name: 'AI Chat Assistant',
    description: 'Enable conversational AI concierge for buyer and seller inquiries.',
    enabled: true,
  },
  {
    id: 'ai-image-analysis',
    name: 'AI Property Image Analyzer',
    description: 'Analyze seller photo quality and provide lighting/composition suggestions.',
    enabled: true,
  },
];

export function getStoredFeatureFlags(): FeatureFlagItem[] {
  if (typeof window === 'undefined') return DEFAULT_FEATURE_FLAGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FEATURE_FLAGS;
    const parsed: FeatureFlagItem[] = JSON.parse(raw);
    
    // Ensure all default AI flags are present
    const merged = DEFAULT_FEATURE_FLAGS.map(def => {
      const existing = parsed.find(p => p.id === def.id);
      return existing || def;
    });
    return merged;
  } catch {
    return DEFAULT_FEATURE_FLAGS;
  }
}

export function saveStoredFeatureFlags(flags: FeatureFlagItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (e) {
    console.error('Failed to save feature flags:', e);
  }
}

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlagItem[]>(() => getStoredFeatureFlags());

  const refresh = useCallback(() => {
    setFlags(getStoredFeatureFlags());
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener(EVENT_NAME, handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, [refresh]);

  const isFeatureEnabled = useCallback((id: string): boolean => {
    const masterAi = flags.find(f => f.id === 'ai-features');
    if (masterAi && !masterAi.enabled && id.startsWith('ai-')) {
      return false;
    }
    const target = flags.find(f => f.id === id);
    return target ? target.enabled : true;
  }, [flags]);

  const masterAi = flags.find(f => f.id === 'ai-features');
  const aiFeatures = masterAi ? masterAi.enabled : true;

  return {
    flags,
    aiFeatures,
    isFeatureEnabled,
    saveFlags: saveStoredFeatureFlags,
  };
}

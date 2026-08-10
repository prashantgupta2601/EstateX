'use client';

import React from 'react';
import { useAIUsage, AIFeatureKey } from '@/lib/ai/usage-tracker';
import { AlertCircle, Clock } from 'lucide-react';

interface AIUsageIndicatorProps {
  featureKey: AIFeatureKey;
  className?: string;
  showText?: boolean;
}

export function AIUsageIndicator({
  featureKey,
  className = '',
  showText = true,
}: AIUsageIndicatorProps) {
  const { remaining, limit, canUse } = useAIUsage(featureKey);
  const percentage = Math.min(100, Math.max(0, (remaining / limit) * 100));

  let barColor = 'bg-primary';
  if (remaining === 0) {
    barColor = 'bg-rose-500';
  } else if (remaining <= 2) {
    barColor = 'bg-amber-500';
  }

  return (
    <div className={`flex flex-col gap-1 w-full max-w-[220px] ${className}`}>
      {showText && (
        <div className="flex items-center justify-between text-[10px] font-bold">
          {canUse ? (
            <span className="text-muted-foreground">
              <span className="text-foreground font-black">{remaining}</span>/{limit} uses remaining today
            </span>
          ) : (
            <span className="text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              Daily limit reached
            </span>
          )}
        </div>
      )}

      {/* Thin Progress bar */}
      <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {!canUse && (
        <div className="flex items-center gap-1 text-[9px] text-rose-500 font-semibold mt-0.5">
          <Clock className="h-2.5 w-2.5 shrink-0" />
          <span>Resets at midnight</span>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Google Gemini attribution component required by Google terms
 */
export function AIGeminiAttribution({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 text-[10px] text-muted-foreground/75 font-medium select-none ${className}`}>
      <span>Powered by</span>
      <span className="font-bold text-foreground/80 tracking-tight">Google Gemini</span>
    </div>
  );
}

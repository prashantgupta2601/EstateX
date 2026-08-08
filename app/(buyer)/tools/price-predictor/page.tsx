import React from 'react';
import { Metadata } from 'next';
import { Sparkles, Calculator, ShieldCheck, TrendingUp } from 'lucide-react';
import PricePredictor from '@/components/tools/price-predictor';

export const metadata: Metadata = {
  title: 'AI Property Price Predictor | EstateX',
  description: 'Estimate accurate market valuations for Indian real estate properties powered by Gemini AI.',
};

export default function PricePredictorPage() {
  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header Banner */}
        <div className="flex flex-col items-center text-center gap-3 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent p-8 rounded-3xl border border-primary/20 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>AI Market Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            AI Property Price Predictor
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Get instant, data-driven property valuation estimates for Indian real estate markets powered by Google Gemini AI.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-4">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-card border border-border/60 text-xs font-bold text-foreground">
              <Calculator className="h-4 w-4 text-primary shrink-0" />
              <span>Instant Valuation Range</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-card border border-border/60 text-xs font-bold text-foreground">
              <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>2024-2025 Market Trends</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-card border border-border/60 text-xs font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>AI Confidence Scoring</span>
            </div>
          </div>
        </div>

        {/* Embedded Standalone Predictor Tool */}
        <PricePredictor />

      </div>
    </div>
  );
}

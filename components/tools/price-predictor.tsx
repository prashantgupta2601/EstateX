'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Loader2, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Building,
  MapPin,
  Maximize2,
  Layers,
  Compass,
  Clock,
  Sofa,
  Check,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useAIUsage } from '@/lib/ai/usage-tracker';
import { useFeatureFlags } from '@/lib/hooks/use-feature-flags';
import { AIUsageIndicator, AIGeminiAttribution } from '@/components/ai/ai-usage-indicator';

export interface PricePredictorInput {
  propertyType: string;
  bhk: string;
  area: string | number;
  city: string;
  locality: string;
  floor: string | number;
  furnishing: string;
  propertyAge: string;
  facing: string;
  amenities: string[];
}

export interface PredictionResult {
  estimatedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  pricePerSqft: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  marketTrend: 'rising' | 'stable' | 'falling';
}

interface PricePredictorProps {
  initialValues?: Partial<PricePredictorInput>;
  onApplyPrice?: (price: number) => void;
}

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'independent-house', label: 'Independent House' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
];

const BHK_OPTIONS = ['1', '2', '3', '4', '5+'];

const FURNISHING_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'furnished', label: 'Fully Furnished' },
];

const AGE_OPTIONS = [
  { value: '0-1-years', label: 'Under Construction / New' },
  { value: '1-5-years', label: '1 to 5 Years' },
  { value: '5-10-years', label: '5 to 10 Years' },
  { value: '10+-years', label: '10+ Years' },
];

const FACING_OPTIONS = [
  { value: 'east', label: 'East' },
  { value: 'north-east', label: 'North-East' },
  { value: 'north', label: 'North' },
  { value: 'west', label: 'West' },
  { value: 'south', label: 'South' },
];

const POPULAR_AMENITIES = [
  'Swimming Pool',
  'Gym',
  '24/7 Security',
  'Power Backup',
  'Clubhouse',
  'Park / Garden',
  'Elevator',
  'Reserved Parking',
];

export default function PricePredictor({
  initialValues,
  onApplyPrice,
}: PricePredictorProps) {
  const { isFeatureEnabled, aiFeatures } = useFeatureFlags();
  const priceUsage = useAIUsage('pricePredictions');

  const isAllowed = aiFeatures && isFeatureEnabled('ai-price-prediction');

  const [formData, setFormData] = useState<PricePredictorInput>({
    propertyType: initialValues?.propertyType || 'apartment',
    bhk: initialValues?.bhk || '3',
    area: initialValues?.area || 1400,
    city: initialValues?.city || 'Gurugram',
    locality: initialValues?.locality || 'Golf Course Road',
    floor: initialValues?.floor || 4,
    furnishing: initialValues?.furnishing || 'semi-furnished',
    propertyAge: initialValues?.propertyAge || '1-5-years',
    facing: initialValues?.facing || 'east',
    amenities: initialValues?.amenities || ['Gym', 'Power Backup', '24/7 Security'],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predictionError, setPredictionError] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllowed || !priceUsage.canUse || isLoading) return;

    setIsLoading(true);
    setPredictionError(false);
    try {
      priceUsage.increment();
      const response = await fetch('/api/ai/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.estimatedPrice) {
        throw new Error(data.error || 'AI temporarily unavailable. Please try again.');
      }

      setPrediction(data);
      toast('Price prediction generated successfully using Gemini AI! ✨', 'success');
    } catch (error: unknown) {
      setPredictionError(true);
      console.error('Price prediction error:', error);
      toast('AI temporarily unavailable. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPriceReadable = (val: number) => {
    if (!val || isNaN(val)) return '₹ 0';
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Crore`;
    }
    if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹ ${val.toLocaleString('en-IN')}`;
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>High Confidence</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-600 border border-amber-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Medium Confidence</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-600 border border-blue-500/30">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Standard Confidence</span>
          </span>
        );
    }
  };

  const isResidential = ['apartment', 'villa', 'independent-house'].includes(formData.propertyType);

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto w-full">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Gemini AI Price Evaluator</span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Real Estate Price Predictor</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Estimate accurate market property valuations using Google Gemini trained on city benchmarks.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <AIUsageIndicator featureKey="pricePredictions" />
          <AIGeminiAttribution />
        </div>
      </div>

      {!isAllowed && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>AI Price Predictor is currently disabled by Admin in Settings.</span>
        </div>
      )}

      <form onSubmit={handlePredict} className="flex flex-col gap-5 bg-card/60 border border-border/80 rounded-2xl p-6 shadow-sm">
        
        {/* 1. Property Type & BHK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-primary" />
              <span>Property Type</span>
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              className="h-10 rounded-xl bg-background/80 border border-border/80 px-3 text-xs font-semibold focus:outline-hidden focus:border-primary"
            >
              {PROPERTY_TYPES.map(pt => (
                <option key={pt.value} value={pt.value}>{pt.label}</option>
              ))}
            </select>
          </div>

          {isResidential && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>BHK Config</span>
              </label>
              <div className="flex gap-1.5">
                {BHK_OPTIONS.map(bhkVal => (
                  <button
                    key={bhkVal}
                    type="button"
                    onClick={() => setFormData({ ...formData, bhk: bhkVal })}
                    className={`flex-1 h-10 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      formData.bhk === bhkVal
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background/80 border-border/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {bhkVal} BHK
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. City & Locality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>City</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Gurugram, Mumbai, Bengaluru"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="h-10 rounded-xl text-xs font-semibold"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>Locality / Sector</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Sector 54, Indiranagar, Bandra"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              className="h-10 rounded-xl text-xs font-semibold"
              required
            />
          </div>
        </div>

        {/* 3. Area (sqft) & Furnishing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5 text-primary" />
              <span>Super Built-up Area (sqft)</span>
            </label>
            <Input
              type="number"
              placeholder="e.g. 1500"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="h-10 rounded-xl text-xs font-semibold"
              min={100}
              max={50000}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Sofa className="h-3.5 w-3.5 text-primary" />
              <span>Furnishing Status</span>
            </label>
            <select
              value={formData.furnishing}
              onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
              className="h-10 rounded-xl bg-background/80 border border-border/80 px-3 text-xs font-semibold focus:outline-hidden focus:border-primary"
            >
              {FURNISHING_OPTIONS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Age & Facing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Property Age</span>
            </label>
            <select
              value={formData.propertyAge}
              onChange={(e) => setFormData({ ...formData, propertyAge: e.target.value })}
              className="h-10 rounded-xl bg-background/80 border border-border/80 px-3 text-xs font-semibold focus:outline-hidden focus:border-primary"
            >
              {AGE_OPTIONS.map(a => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span>Facing Direction</span>
            </label>
            <select
              value={formData.facing}
              onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
              className="h-10 rounded-xl bg-background/80 border border-border/80 px-3 text-xs font-semibold focus:outline-hidden focus:border-primary"
            >
              {FACING_OPTIONS.map(fc => (
                <option key={fc.value} value={fc.value}>{fc.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Amenities Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground">Select Key Amenities</label>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_AMENITIES.map(amenity => {
              const isSelected = formData.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-background/50 border-border/60 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                  <span>{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {predictionError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between font-bold">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              AI temporarily unavailable. Please try again.
            </span>
            <Button size="sm" variant="ghost" type="button" onClick={handlePredict} className="h-7 text-xs font-bold text-rose-600 hover:bg-rose-500/20">
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </div>
        )}

        <Button
          type="submit"
          disabled={!isAllowed || !priceUsage.canUse || isLoading}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is thinking...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Predict Price ✨</span>
            </>
          )}
        </Button>
      </form>

      {/* Results Card */}
      {prediction && (
        <div className="flex flex-col gap-5 bg-linear-to-br from-card to-card/90 border border-primary/25 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Estimated Property Value</span>
              <div className="text-3xl font-black text-primary tracking-tight mt-0.5">
                {formatPriceReadable(prediction.estimatedPrice)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getConfidenceBadge(prediction.confidence)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-left">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Estimated Range</span>
              <p className="text-xs font-black text-foreground mt-0.5">
                {formatPriceReadable(prediction.priceRange.min)} - {formatPriceReadable(prediction.priceRange.max)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-left">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Average Rate / Sqft</span>
              <p className="text-xs font-black text-foreground mt-0.5">
                ₹ {prediction.pricePerSqft?.toLocaleString('en-IN') || '0'} / sqft
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-left">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Micro-market Trend</span>
              <div className="flex items-center gap-1 text-xs font-black text-foreground mt-0.5">
                {prediction.marketTrend === 'rising' ? (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" /> Rising (+4.8% YoY)
                  </span>
                ) : prediction.marketTrend === 'falling' ? (
                  <span className="text-rose-500 flex items-center gap-1">
                    <TrendingDown className="h-4 w-4" /> Softening
                  </span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-1">
                    <Minus className="h-4 w-4" /> Stable Market
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 text-left space-y-1">
            <span className="text-[11px] font-extrabold text-primary flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> AI Valuation Rationale
            </span>
            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
              {prediction.reasoning}
            </p>
          </div>

          {onApplyPrice && (
            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                onClick={() => onApplyPrice(prediction.estimatedPrice)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
              >
                Apply Predicted Price ({formatPriceReadable(prediction.estimatedPrice)})
              </Button>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <AIGeminiAttribution />
          </div>
        </div>
      )}

    </div>
  );
}

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
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

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
  { value: 'office', label: 'Office' },
  { value: 'shop', label: 'Shop' },
  { value: 'warehouse', label: 'Warehouse' },
];

const BHK_OPTIONS = ['1', '2', '3', '4', '4+'];

const FURNISHING_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'furnished', label: 'Fully Furnished' },
];

const AGE_OPTIONS = [
  { value: 'under-construction', label: 'Under Construction' },
  { value: 'less-than-1-year', label: 'Less than 1 Year' },
  { value: '1-5-years', label: '1 - 5 Years' },
  { value: '5-10-years', label: '5 - 10 Years' },
  { value: '10-plus-years', label: '10+ Years' },
];

const FACING_OPTIONS = [
  { value: 'east', label: 'East' },
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'west', label: 'West' },
  { value: 'any', label: 'Any / Unknown' },
];

const POPULAR_AMENITIES = [
  'Gym', 'Swimming Pool', 'Security', 'Clubhouse', 'Power Backup', 
  'Lift', 'Park', 'Reserved Parking', 'Visitor Parking', 'CCTV Security'
];

export default function PricePredictor({ initialValues, onApplyPrice }: PricePredictorProps) {
  const [formData, setFormData] = useState<PricePredictorInput>({
    propertyType: initialValues?.propertyType || 'apartment',
    bhk: initialValues?.bhk || '3',
    area: initialValues?.area || '1200',
    city: initialValues?.city || 'Gurgaon',
    locality: initialValues?.locality || 'DLF Phase 5',
    floor: initialValues?.floor || '5',
    furnishing: initialValues?.furnishing || 'semi-furnished',
    propertyAge: initialValues?.propertyAge || '1-5-years',
    facing: initialValues?.facing || 'east',
    amenities: initialValues?.amenities || ['Security', 'Lift', 'Power Backup'],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const isResidential = ['apartment', 'villa', 'independent-house'].includes(formData.propertyType);

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city?.trim() || !formData.locality?.trim()) {
      toast('Please provide City and Locality for price prediction.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.estimatedPrice) {
        throw new Error(data.error || 'Failed to predict price');
      }

      setPrediction(data);
      toast('Price prediction generated successfully!', 'success');
    } catch (error: any) {
      console.error('Price prediction error:', error);
      toast(error?.message || 'Price prediction failed. Please try again.', 'error');
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
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-600 border border-rose-500/30">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Low Confidence</span>
          </span>
        );
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'rising':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Rising Market ↑</span>
          </span>
        );
      case 'falling':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-600 border border-rose-500/30">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Falling Market ↓</span>
          </span>
        );
      case 'stable':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-600 border border-blue-500/30">
            <Minus className="h-3.5 w-3.5" />
            <span>Stable Market →</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <form onSubmit={handlePredict} className="flex flex-col gap-5 bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-border/60 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground">AI Property Valuation</h2>
              <p className="text-xs text-muted-foreground">Fill in property specifications to estimate 2024-2025 market value</p>
            </div>
          </div>
        </div>

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
              placeholder="e.g. Mumbai, Gurgaon, Bangalore"
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
              placeholder="e.g. Bandra West, DLF Phase 5, HSR Layout"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              className="h-10 rounded-xl text-xs font-semibold"
              required
            />
          </div>
        </div>

        {/* 3. Area, Floor, Furnishing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5 text-primary" />
              <span>Super Area (sqft)</span>
            </label>
            <Input
              type="number"
              placeholder="e.g. 1200"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="h-10 rounded-xl text-xs font-semibold"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>Floor Number</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. 5 or Ground"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              className="h-10 rounded-xl text-xs font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Sofa className="h-3.5 w-3.5 text-primary" />
              <span>Furnishing</span>
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

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing market data...</span>
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
        <div className="flex flex-col gap-5 bg-gradient-to-br from-card to-card/90 border border-primary/25 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Estimated Property Value</span>
              <div className="text-3xl font-black text-primary tracking-tight mt-0.5">
                {formatPriceReadable(prediction.estimatedPrice)}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                (₹ {prediction.estimatedPrice.toLocaleString('en-IN')})
              </span>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {getConfidenceBadge(prediction.confidence)}
                {getTrendBadge(prediction.marketTrend)}
              </div>
              {prediction.pricePerSqft > 0 && (
                <span className="text-xs font-bold text-foreground bg-muted/80 px-2.5 py-1 rounded-lg">
                  ₹ {prediction.pricePerSqft.toLocaleString('en-IN')} / sqft
                </span>
              )}
            </div>
          </div>

          {/* Visual Price Range Bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
              <span>Min: {formatPriceReadable(prediction.priceRange.min)}</span>
              <span className="text-primary font-black">Estimated: {formatPriceReadable(prediction.estimatedPrice)}</span>
              <span>Max: {formatPriceReadable(prediction.priceRange.max)}</span>
            </div>

            <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border/40">
              <div className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500/40 via-primary to-emerald-500/40 rounded-full w-full" />
              {/* Indicator marker */}
              {(() => {
                const min = prediction.priceRange.min;
                const max = prediction.priceRange.max;
                const est = prediction.estimatedPrice;
                const pct = max > min ? Math.min(Math.max(((est - min) / (max - min)) * 100, 10), 90) : 50;
                return (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary shadow-md transform -translate-x-1/2"
                    style={{ left: `${pct}%` }}
                    title={`Estimated: ${formatPriceReadable(est)}`}
                  />
                );
              })()}
            </div>
          </div>

          {/* Reasoning */}
          {prediction.reasoning && (
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 text-xs italic text-muted-foreground leading-relaxed">
              <strong className="not-italic font-bold text-foreground block mb-1">Market Insight & Reasoning:</strong>
              "{prediction.reasoning}"
            </div>
          )}

          {/* Action button if embedded in seller form */}
          {onApplyPrice && (
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={() => onApplyPrice(prediction.estimatedPrice)}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 h-9 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Check className="h-4 w-4" />
                <span>Apply Price to Listing (₹ {prediction.estimatedPrice.toLocaleString('en-IN')})</span>
              </Button>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground/75 text-center italic border-t border-border/30 pt-3 mt-1">
            AI estimate for reference only. Actual prices may vary based on market conditions.
          </p>
        </div>
      )}
    </div>
  );
}

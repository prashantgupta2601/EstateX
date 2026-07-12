'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  User, 
  Briefcase, 
  ArrowRight, 
  Check, 
  Sparkles, 
  MapPin, 
  Phone, 
  UserCircle2, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { sellerProfile } from '@/lib/mock-data/seller';

type Role = 'owner' | 'broker' | 'builder';
type Plan = 'free' | 'basic' | 'pro';

interface OnboardingData {
  name: string;
  phone: string;
  city: string;
  role: Role;
  plan: Plan;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    phone: '',
    city: '',
    role: 'broker',
    plan: 'free'
  });

  useEffect(() => {
    // Load from existing profile if available
    const storedProfile = localStorage.getItem('estatex_seller_profile');
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      setFormData(prev => ({
        ...prev,
        name: parsed.name || '',
        phone: parsed.phone || '',
        city: parsed.city || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        name: sellerProfile.name,
        phone: sellerProfile.phone,
        city: 'Gurugram'
      }));
    }
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex flex-col gap-6 text-left py-12 items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-muted-foreground animate-pulse">Initializing onboarding...</span>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectRole = (role: Role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSelectPlan = (plan: Plan) => {
    setFormData(prev => ({ ...prev, plan }));
    
    if (plan !== 'free') {
      toast('Payment details pending. You will complete payment after setup.', 'success');
    }
    setStep(4);
  };

  const saveAndComplete = (redirectPath: string) => {
    // Update local profile representation
    const storedProfile = localStorage.getItem('estatex_seller_profile');
    let currentProfile = {};
    if (storedProfile) {
      currentProfile = JSON.parse(storedProfile);
    }
    const updatedProfile = {
      ...currentProfile,
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      role: formData.role,
      plan: formData.plan,
      totalListings: 0,
      activeListings: 0
    };
    
    localStorage.setItem('estatex_seller_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('estatex_seller_onboarding_completed', 'true');
    localStorage.setItem('estatex_seller_kyc_status', 'not_started'); // Reset kyc status for new seller
    
    toast('Onboarding completed! Welcome to EstateX.', 'success');
    router.push(redirectPath);
  };

  const progressPercent = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-6 max-w-2xl mx-auto w-full px-4 animate-in fade-in duration-300">
      
      {/* Step Indicator Header */}
      <div className="w-full flex flex-col gap-3.5 mb-8 select-none">
        <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
          <span className="text-primary font-black uppercase tracking-wider">Step {step} of 4</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/10">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <Card className="w-full rounded-3xl border-border/40 bg-card/75 backdrop-blur-md shadow-2xl p-4 sm:p-6 text-left">
        
        {/* STEP 1: Welcome Screen */}
        {step === 1 && (
          <div className="flex flex-col gap-6 py-2 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-amber-500 fill-amber-500/10 animate-pulse" />
                Welcome to EstateHub for Sellers!
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Let's set up your account to start listing properties and receiving buyer leads.</p>
            </div>

            <div className="h-px bg-border/25" />

            <div className="flex flex-col gap-4">
              <span className="text-sm font-bold text-foreground">Why list your properties on EstateHub?</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: '10M+ Active Buyers',
                    desc: 'Get unmatched search visibility and reach genuine property seekers across India.'
                  },
                  {
                    title: 'Instant Lead Matching',
                    desc: 'Receive real-time notifications on WhatsApp for matching premium buyer leads.'
                  },
                  {
                    title: 'Direct Broker Contacts',
                    desc: 'Message and negotiate directly with verified clients without third-party holds.'
                  },
                  {
                    title: 'Zero Hidden Commissions',
                    desc: 'No commission deductions. Pay a simple transparent flat rate (or start free!).'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-extrabold text-foreground">{item.title}</span>
                      <span className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/20 mt-2">
              <Button 
                onClick={() => setStep(2)}
                className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 shadow-xs cursor-pointer h-10 text-xs flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Simplified Profile Setup */}
        {step === 2 && (
          <div className="flex flex-col gap-6 py-2 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <UserCircle2 className="h-6.5 w-6.5 text-primary" />
                Setup Your Seller Profile
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Provide a few basic details so buyers know who they are contacting.</p>
            </div>

            <div className="h-px bg-border/25" />

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <Input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Prashant Gupta"
                  required
                  className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-10 text-xs font-semibold"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="e.g. +91 98765 43210"
                    required
                    className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-10 text-xs font-semibold pl-8"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                </div>
              </div>

              {/* City */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Operating City</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Gurugram"
                    required
                    className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-10 text-xs font-semibold pl-8"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                </div>
              </div>

              {/* Role Radio Cards */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Are you a:</label>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  {[
                    { value: 'owner', label: 'Owner', icon: User, desc: 'Individually listing own properties' },
                    { value: 'broker', label: 'Broker', icon: Building2, desc: 'Real Estate Agent / Consultancy' },
                    { value: 'builder', label: 'Builder', icon: Briefcase, desc: 'Construction Firm / Developer' }
                  ].map(role => {
                    const Icon = role.icon;
                    const isSelected = formData.role === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleSelectRole(role.value as Role)}
                        className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10' 
                            : 'border-border/80 hover:bg-muted/20 text-foreground'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground/80'}`}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold">{role.label}</span>
                          <span className="text-[9px] text-muted-foreground leading-snug mt-1 hidden sm:block max-w-[130px]">{role.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border/20 mt-2">
              <Button 
                variant="ghost" 
                className="rounded-xl border border-border/80 h-10 font-bold text-xs cursor-pointer px-4"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                onClick={() => {
                  if (!formData.name || !formData.phone || !formData.city) {
                    toast('Please fill out all required fields.', 'error');
                    return;
                  }
                  setStep(3);
                }}
                className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 h-10 text-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="h-4.5 w-4.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Plan Selection */}
        {step === 3 && (
          <div className="flex flex-col gap-6 py-2 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <TrendingUp className="h-6.5 w-6.5 text-primary" />
                Select Seller Subscription
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Select a subscription plan that fits your business needs. You can change plans at any time.</p>
            </div>

            <div className="h-px bg-border/25" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Free Plan */}
              <div className="border border-border/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-background/50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-wider text-muted-foreground uppercase">Trial</span>
                  <h3 className="text-base font-bold text-foreground mt-1">Free Plan</h3>
                  <div className="flex items-baseline gap-1 mt-2.5">
                    <span className="text-xl font-black text-foreground">₹0</span>
                    <span className="text-[10px] text-muted-foreground font-bold">/ month</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-[11px] text-muted-foreground font-semibold">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>1 active property listing</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Standard search rank</span>
                    </li>
                  </ul>
                </div>
                <Button 
                  onClick={() => handleSelectPlan('free')}
                  variant="outline" 
                  className="w-full mt-5 rounded-xl border-border/85 font-bold h-9 text-xs cursor-pointer hover:bg-muted/40"
                >
                  Start Free
                </Button>
              </div>

              {/* Basic Plan */}
              <div className="border border-border/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-background/50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-wider text-blue-500 uppercase">Growth</span>
                  <h3 className="text-base font-bold text-foreground mt-1">Basic Plan</h3>
                  <div className="flex items-baseline gap-1 mt-2.5">
                    <span className="text-xl font-black text-foreground">₹999</span>
                    <span className="text-[10px] text-muted-foreground font-bold">/ month</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-[11px] text-muted-foreground font-semibold">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>5 active property listings</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>2x search rank priority</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>WhatsApp lead alerts</span>
                    </li>
                  </ul>
                </div>
                <Button 
                  onClick={() => handleSelectPlan('basic')}
                  className="w-full mt-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 text-xs cursor-pointer border-none"
                >
                  Choose Basic
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="border-2 border-primary/25 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all bg-primary/5 relative">
                <div className="absolute top-3 right-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 px-1.5 py-0.2 rounded-md text-[8px] font-black uppercase">
                  Best Value
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-wider text-primary uppercase">Business</span>
                  <h3 className="text-base font-bold text-foreground mt-1">Pro Plan</h3>
                  <div className="flex items-baseline gap-1 mt-2.5">
                    <span className="text-xl font-black text-foreground">₹2,499</span>
                    <span className="text-[10px] text-muted-foreground font-bold">/ month</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-[11px] text-muted-foreground font-semibold">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Unlimited listings</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>3x search priority rank</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Verified Broker badge</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Dedicated RM</span>
                    </li>
                  </ul>
                </div>
                <Button 
                  onClick={() => handleSelectPlan('pro')}
                  className="w-full mt-5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-9 text-xs cursor-pointer"
                >
                  Choose Pro
                </Button>
              </div>

            </div>

            <div className="flex justify-between pt-4 border-t border-border/20 mt-2">
              <Button 
                variant="ghost" 
                className="rounded-xl border border-border/80 h-10 font-bold text-xs cursor-pointer px-4"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Success / Post First Property */}
        {step === 4 && (
          <div className="flex flex-col gap-6 py-2 items-center text-center animate-in zoom-in-95 duration-500">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full animate-bounce">
              <ShieldCheck className="h-10 w-10" />
            </div>
            
            <div className="flex flex-col gap-1.5 max-w-sm">
              <h2 className="text-2xl font-black text-foreground tracking-tight select-none">
                You're All Set, {formData.name}!
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Your seller onboarding is completed successfully. Now, post your first property listing to start receiving buyer leads immediately.
              </p>
            </div>

            <div className="h-px bg-border/25 w-full my-1" />

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
              <Button 
                onClick={() => saveAndComplete('/seller/dashboard')}
                variant="outline"
                className="rounded-xl border-border/80 font-bold h-10 text-xs cursor-pointer flex-1 w-full"
              >
                Explore Dashboard
              </Button>
              <Button 
                onClick={() => saveAndComplete('/seller/listings/new')}
                className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-10 text-xs cursor-pointer flex-1 w-full"
              >
                Post Property Now
              </Button>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
}

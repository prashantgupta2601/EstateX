'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  Camera, 
  Globe, 
  MapPin, 
  Lock, 
  Upload, 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { sellerProfile } from '@/lib/mock-data/seller';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  company: string;
  reraNumber: string;
  city: string;
  bio: string;
  website: string;
  avatar: string;
}

export default function SellerProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    reraNumber: '',
    city: '',
    bio: '',
    website: '',
    avatar: ''
  });

  const [kycStatus, setKycStatus] = useState<'not_started' | 'pending' | 'verified'>('verified');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // KYC Wizard state
  const [kycStep, setKycStep] = useState<1 | 2 | 3>(1);
  const [docType, setDocType] = useState<'aadhaar' | 'pan' | 'passport'>('aadhaar');
  const [frontFileName, setFrontFileName] = useState<string>('');
  const [backFileName, setBackFileName] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem('estatex_seller_profile');
    const storedKyc = localStorage.getItem('estatex_seller_kyc_status');
    
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile));
    } else {
      const initialProfile: ProfileData = {
        name: sellerProfile.name,
        email: sellerProfile.email,
        phone: sellerProfile.phone,
        whatsapp: '+91 98765 43210',
        company: 'Gupta Realty Group',
        reraNumber: 'RERA-HR-12345',
        city: 'Gurugram',
        bio: 'Premier Real Estate Broker with over 8 years of experience specializing in luxury residential apartments, villas, and commercial properties in Delhi NCR.',
        website: 'https://guptarealty.com',
        avatar: ''
      };
      setProfileData(initialProfile);
      localStorage.setItem('estatex_seller_profile', JSON.stringify(initialProfile));
    }

    if (storedKyc) {
      setKycStatus(storedKyc as any);
    } else {
      setKycStatus('verified'); // Default as mock-data has verified
      localStorage.setItem('estatex_seller_kyc_status', 'verified');
    }

    setIsMounted(true);
  }, []);

  // KYC pending auto-approval simulation (5 seconds)
  useEffect(() => {
    if (kycStatus === 'pending') {
      const timer = setTimeout(() => {
        setKycStatus('verified');
        localStorage.setItem('estatex_seller_kyc_status', 'verified');
        toast('KYC approved! You are now a Verified Broker. ✅', 'success');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [kycStatus]);

  if (!isMounted) {
    return (
      <div className="flex flex-col gap-6 text-left py-12 items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-muted-foreground animate-pulse">Loading your profile...</span>
      </div>
    );
  }

  const initials = profileData.name.split(' ').map(n => n[0]).join('');

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData(prev => ({
        ...prev,
        avatar: reader.result as string
      }));
      toast('Avatar changed successfully. Click Save Changes to persist.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const triggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('estatex_seller_profile', JSON.stringify(profileData));
    toast('Profile changes saved successfully.', 'success');
  };

  const startKycWizard = () => {
    setKycStep(1);
    setFrontFileName('');
    setBackFileName('');
    setDialogOpen(true);
  };

  const handleKycSubmit = () => {
    setKycStatus('pending');
    localStorage.setItem('estatex_seller_kyc_status', 'pending');
    toast('Documents submitted for verification. Usually takes 24-48 hours.', 'success');
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Profile & KYC</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your seller profile and check verification credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Basic Info Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-xs shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-foreground">Basic Profile Information</CardTitle>
              <CardDescription>Update your personal details, agency credentials, and contact info.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveChanges} className="flex flex-col gap-6">
                
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-muted/20 border border-border/40">
                  <div 
                    onClick={triggerAvatarUpload}
                    className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-primary/25 cursor-pointer group shadow-inner bg-background flex items-center justify-center shrink-0"
                  >
                    {profileData.avatar ? (
                      <AvatarImage src={profileData.avatar} alt={profileData.name} className="object-cover h-full w-full" />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl h-full w-full flex items-center justify-center">
                        {initials}
                      </AvatarFallback>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="text-center sm:text-left">
                    <h4 className="text-sm font-bold text-foreground">Profile Picture</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Click to upload an image. PNG, JPG or WEBP formats up to 2MB allowed.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={triggerAvatarUpload}
                      className="mt-2.5 rounded-xl text-xs font-bold border-border/80 h-8 cursor-pointer"
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>

                {/* Form fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                    <Input 
                      type="text" 
                      name="name" 
                      value={profileData.name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Prashant Gupta"
                      required
                      className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-10 text-xs font-semibold"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      Email
                      <Lock className="h-3 w-3 text-muted-foreground/75" />
                    </label>
                    <div className="relative">
                      <Input 
                        type="email" 
                        name="email" 
                        value={profileData.email} 
                        readOnly 
                        disabled
                        className="rounded-xl bg-muted/40 border-border/80 focus-visible:ring-transparent h-10 text-xs font-semibold text-muted-foreground pr-8 cursor-not-allowed"
                      />
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</label>
                    <Input 
                      type="text" 
                      name="phone" 
                      value={profileData.phone} 
                      onChange={handleInputChange} 
                      placeholder="e.g. +91 98765 43210"
                      required
                      className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-10 text-xs font-semibold"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">WhatsApp Number (Optional)</label>
                    <Input 
                      type="text" 
                      name="whatsapp" 
                      value={profileData.whatsapp} 
                      onChange={handleInputChange} 
                      placeholder="e.g. +91 98765 43210"
                      className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-10 text-xs font-semibold"
                    />
                  </div>

                  {/* Company / Agency */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Company/Agency Name</label>
                    <Input 
                      type="text" 
                      name="company" 
                      value={profileData.company} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Gupta Realty Group"
                      className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-10 text-xs font-semibold"
                    />
                  </div>

                  {/* RERA Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">RERA Registration Number (Optional)</label>
                    <Input 
                      type="text" 
                      name="reraNumber" 
                      value={profileData.reraNumber} 
                      onChange={handleInputChange} 
                      placeholder="e.g. RERA-HR-12345"
                      className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-10 text-xs font-semibold"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">City</label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        name="city" 
                        value={profileData.city} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Gurugram"
                        required
                        className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-10 text-xs font-semibold pl-8"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    </div>
                  </div>

                  {/* Website URL */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Website URL</label>
                    <div className="relative">
                      <Input 
                        type="url" 
                        name="website" 
                        value={profileData.website} 
                        onChange={handleInputChange} 
                        placeholder="e.g. https://guptarealty.com"
                        className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-10 text-xs font-semibold pl-8"
                      />
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">About/Bio</label>
                    <textarea 
                      name="bio" 
                      value={profileData.bio} 
                      onChange={handleInputChange} 
                      placeholder="Briefly describe your services, specialized regions, etc..."
                      rows={4}
                      className="rounded-xl bg-background/50 border border-border/80 focus-visible:ring-primary/45 w-full p-3 text-xs font-semibold outline-hidden resize-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    type="submit" 
                    className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 shadow-xs cursor-pointer h-10 text-xs"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Verification Status & Badge */}
        <div className="flex flex-col gap-6">
          {/* Card 1: Verification Status */}
          <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-xs shadow-xs">
            <CardHeader className="pb-3 border-b border-border/25">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Verification Status
              </CardTitle>
              <CardDescription>Security validation and credentials log</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4 text-xs font-medium">
              
              {/* Phone Verified */}
              <div className="flex items-center justify-between py-1.5 border-b border-border/25">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Phone Verification
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  Verified ✅
                </span>
              </div>

              {/* Email Verified */}
              <div className="flex items-center justify-between py-1.5 border-b border-border/25">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email Verification
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  Verified ✅
                </span>
              </div>

              {/* Identity Verification */}
              <div className="flex items-center justify-between py-1.5 border-b border-border/25">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Identity Verification
                </span>
                {kycStatus === 'verified' && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    Verified ✅
                  </span>
                )}
                {kycStatus === 'pending' && (
                  <span className="text-amber-500 font-bold flex items-center gap-1" title="Awaiting document review">
                    Pending ⏳
                  </span>
                )}
                {kycStatus === 'not_started' && (
                  <span className="text-red-500 font-bold flex items-center gap-1">
                    Not submitted ❌
                  </span>
                )}
              </div>

              {/* RERA Verification (Dynamic) */}
              {profileData.reraNumber.trim() && (
                <div className="flex items-center justify-between py-1.5 border-b border-border/25 animate-in slide-in-from-top-2 duration-350">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    RERA Verification
                  </span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    Verified ✅
                  </span>
                </div>
              )}

              {/* KYC Button */}
              <div className="mt-3">
                {kycStatus === 'verified' ? (
                  <Button 
                    disabled 
                    className="w-full rounded-xl text-xs font-bold h-10 border border-emerald-500/25 bg-emerald-500/5 text-emerald-600 cursor-not-allowed opacity-100 flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="h-4.5 w-4.5" />
                    <span>KYC Approved</span>
                  </Button>
                ) : kycStatus === 'pending' ? (
                  <div className="flex flex-col gap-2">
                    <Button 
                      disabled 
                      className="w-full rounded-xl text-xs font-bold h-10 border border-amber-500/25 bg-amber-500/5 text-amber-600 cursor-not-allowed opacity-100 flex items-center justify-center gap-2"
                    >
                      <div className="h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>KYC Pending Review</span>
                    </Button>
                    <span className="text-[10px] text-amber-500 text-center font-bold">
                      Approving automatically in 5s...
                    </span>
                  </div>
                ) : (
                  <Button 
                    onClick={startKycWizard}
                    className="w-full rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-10 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Complete KYC</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Broker Badge & Trust status */}
          <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-xs shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">Broker Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              {kycStatus === 'verified' ? (
                /* Verified View */
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center p-6 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl gap-3 text-center flex-col animate-in zoom-in-95 duration-500">
                    <Badge className="bg-emerald-500 text-white font-bold text-[10px] uppercase px-3 py-1 border-none tracking-wider select-none shrink-0 h-6">
                      Verified Broker
                    </Badge>
                    <span className="text-xs font-bold text-foreground mt-1">Trust Credential Active</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Your seller account has been verified. The "Verified Broker" trust badge is now displayed next to your listings and contact card, boosting search visibility and lead quality.
                    </p>
                  </div>
                </div>
              ) : (
                /* Unverified / Get Verified CTA */
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="flex flex-col text-xs">
                        <span className="font-bold text-foreground">Get Verified Badge</span>
                        <p className="text-muted-foreground mt-0.5">Complete your KYC verification to stand out from regular agents.</p>
                      </div>
                    </div>

                    <div className="h-px bg-border/25" />

                    <div className="flex flex-col gap-2.5 text-xs text-muted-foreground font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Up to 3x higher search rankings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Featured badge on listings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>WhatsApp lead matching notifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>RERA badge verification highlights</span>
                      </div>
                    </div>

                    <Button 
                      onClick={startKycWizard}
                      variant="outline" 
                      className="w-full rounded-xl border-primary/45 text-primary hover:bg-primary/5 font-bold h-9.5 cursor-pointer mt-1"
                    >
                      Get Verified Now
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Complete KYC Multi-Step Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-card border border-border/80 p-5 gap-4">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground flex items-center gap-2 select-none">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Seller KYC Verification
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Verify your identity to claim the Verified Broker badge.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper Header indicator */}
          <div className="grid grid-cols-3 gap-2 py-1 select-none">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${kycStep >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${kycStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${kycStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground uppercase font-black tracking-wider pb-2 border-b border-border/25">
            <span className={kycStep === 1 ? 'text-primary font-bold' : ''}>1. Doc Type</span>
            <span className={kycStep === 2 ? 'text-primary font-bold' : ''}>2. Upload Files</span>
            <span className={kycStep === 3 ? 'text-primary font-bold' : ''}>3. Review</span>
          </div>

          {/* STEP 1: Select Document Type */}
          {kycStep === 1 && (
            <div className="flex flex-col gap-4.5 py-2 animate-in fade-in duration-300">
              <span className="text-xs font-bold text-foreground">Select Government Issued ID:</span>
              <div className="flex flex-col gap-2.5">
                {[
                  { value: 'aadhaar', label: 'Aadhaar Card (UIDAI)' },
                  { value: 'pan', label: 'PAN Card (Income Tax Dept)' },
                  { value: 'passport', label: 'Indian Passport' }
                ].map(doc => (
                  <button
                    key={doc.value}
                    type="button"
                    onClick={() => setDocType(doc.value as any)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold cursor-pointer text-left transition-all ${
                      docType === doc.value 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-border/80 hover:bg-muted/30 text-foreground'
                    }`}
                  >
                    <span>{doc.label}</span>
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                      docType === doc.value ? 'border-primary' : 'border-border/80'
                    }`}>
                      {docType === doc.value && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Upload Front + Back Images */}
          {kycStep === 2 && (
            <div className="flex flex-col gap-4 py-2 animate-in fade-in duration-300">
              <span className="text-xs font-bold text-foreground capitalize">Upload {docType} Copy:</span>
              
              <div className="flex flex-col gap-3">
                {/* Front Image */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Front Page</label>
                  <div 
                    onClick={() => frontInputRef.current?.click()}
                    className={`border border-dashed border-border/80 rounded-xl p-4.5 flex items-center justify-center flex-col text-center cursor-pointer transition-colors bg-muted/10 hover:bg-muted/20`}
                  >
                    <input 
                      type="file" 
                      ref={frontInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFrontFileName(file.name);
                      }}
                    />
                    {frontFileName ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[200px]">{frontFileName}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-muted-foreground/80 mb-1" />
                        <span className="text-xs font-bold text-foreground">Click to upload document front</span>
                        <span className="text-[10px] text-muted-foreground/85 mt-0.5">Supports PNG, JPG, WEBP</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Back Image (Not required for PAN) */}
                {docType !== 'pan' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Back Page</label>
                    <div 
                      onClick={() => backInputRef.current?.click()}
                      className={`border border-dashed border-border/80 rounded-xl p-4.5 flex items-center justify-center flex-col text-center cursor-pointer transition-colors bg-muted/10 hover:bg-muted/20`}
                    >
                      <input 
                        type="file" 
                        ref={backInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setBackFileName(file.name);
                        }}
                      />
                      {backFileName ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-primary">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          <span className="truncate max-w-[200px]">{backFileName}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-muted-foreground/80 mb-1" />
                          <span className="text-xs font-bold text-foreground">Click to upload document back</span>
                          <span className="text-[10px] text-muted-foreground/85 mt-0.5">Supports PNG, JPG, WEBP</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Review + Submit */}
          {kycStep === 3 && (
            <div className="flex flex-col gap-4 py-2 animate-in fade-in duration-300">
              <span className="text-xs font-bold text-foreground">Confirm Documents Summary:</span>
              <div className="p-4 rounded-xl border border-border/40 bg-muted/25 flex flex-col gap-3 text-xs font-bold text-muted-foreground">
                <div className="flex items-center justify-between border-b border-border/20 pb-2">
                  <span>Document Type</span>
                  <span className="text-foreground uppercase">{docType}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/20 pb-2">
                  <span>Front Page Copy</span>
                  <span className="text-foreground truncate max-w-[180px]">{frontFileName || 'No file selected'}</span>
                </div>
                {docType !== 'pan' && (
                  <div className="flex items-center justify-between border-b border-border/20 pb-2">
                    <span>Back Page Copy</span>
                    <span className="text-foreground truncate max-w-[180px]">{backFileName || 'No file selected'}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-850 dark:text-amber-300 font-semibold leading-relaxed text-[11px] mt-1 select-none">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" />
                  <span>By submitting, you certify that these documents are authentic and represent your correct legal identity.</span>
                </div>
              </div>
            </div>
          )}

          {/* Dialog Footer Actions */}
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            {kycStep > 1 ? (
              <Button 
                variant="ghost" 
                className="rounded-xl border border-border/80 h-9 font-bold text-xs cursor-pointer w-full sm:w-auto"
                onClick={() => setKycStep(prev => (prev - 1) as any)}
              >
                Back
              </Button>
            ) : (
              <DialogClose render={<Button variant="ghost" className="rounded-xl border border-border/80 h-9 font-bold text-xs cursor-pointer w-full sm:w-auto" />}>
                Cancel
              </DialogClose>
            )}

            {kycStep < 3 ? (
              <Button 
                className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground h-9 font-bold text-xs cursor-pointer w-full sm:w-auto"
                disabled={(kycStep === 2 && !frontFileName) || (kycStep === 2 && docType !== 'pan' && !backFileName)}
                onClick={() => setKycStep(prev => (prev + 1) as any)}
              >
                Next
              </Button>
            ) : (
              <Button 
                className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground h-9 font-bold text-xs cursor-pointer w-full sm:w-auto"
                onClick={handleKycSubmit}
              >
                Submit Documents
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

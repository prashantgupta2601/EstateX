'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Home, Building2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

export default function SignupPage() {
  const router = useRouter();
  
  // States
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // 1. Full name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // 3. Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // 4. Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // 5. Confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // 6. Agree to terms
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Signup form submitted:', { role, fullName, email, phone, password });
      toast('Verification OTP sent (mock)');
      // Redirect to OTP verification
      router.push('/verify-otp');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="text-center">
        <h2 className="text-xl font-black text-foreground">Create Account</h2>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Join EstateX today to find or post properties.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Role Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            I am registering as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Buyer Card */}
            <div
              onClick={() => setRole('buyer')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center cursor-pointer select-none transition-all duration-300 ${
                role === 'buyer'
                  ? 'border-primary bg-primary/5 text-primary scale-[1.02] shadow-xs'
                  : 'border-border/85 bg-background/20 text-muted-foreground hover:bg-muted/30 hover:border-border'
              }`}
            >
              <Home className="h-5 w-5 mb-2" />
              <span className="text-xs font-black">I&apos;m a Buyer</span>
              <span className="text-[9px] mt-1 font-medium leading-tight">Looking to buy/rent</span>
            </div>
            
            {/* Seller Card */}
            <div
              onClick={() => setRole('seller')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center cursor-pointer select-none transition-all duration-300 ${
                role === 'seller'
                  ? 'border-primary bg-primary/5 text-primary scale-[1.02] shadow-xs'
                  : 'border-border/85 bg-background/20 text-muted-foreground hover:bg-muted/30 hover:border-border'
              }`}
            >
              <Building2 className="h-5 w-5 mb-2" />
              <span className="text-xs font-black">I&apos;m a Seller/Broker</span>
              <span className="text-[9px] mt-1 font-medium leading-tight">Looking to list/broker</span>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: undefined });
              }}
              placeholder="John Doe"
              className={`pl-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background ${
                errors.fullName ? 'border-destructive focus-visible:ring-destructive' : 'border-border/80'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="name@example.com"
              className={`pl-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background ${
                errors.email ? 'border-destructive focus-visible:ring-destructive' : 'border-border/80'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Phone Number
          </label>
          <div className="relative flex items-stretch rounded-xl border border-border/80 bg-background/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <div className="flex items-center gap-1.5 px-3 bg-muted border-r border-border/80 text-muted-foreground text-sm font-semibold select-none">
              <Phone className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>+91</span>
            </div>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                setPhone(cleaned.slice(0, 10));
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder="98765 43210"
              className={`flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-11 rounded-none bg-transparent`}
            />
          </div>
          {errors.phone && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="•••••••• (min 8 chars)"
              className={`pl-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background ${
                errors.password ? 'border-destructive focus-visible:ring-destructive' : 'border-border/80'
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              placeholder="••••••••"
              className={`pl-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background ${
                errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : 'border-border/80'
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.confirmPassword}</span>
            </p>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="flex flex-col gap-1 py-1">
          <div className="flex items-start gap-2 select-none">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: undefined });
              }}
              className="h-4 w-4 rounded-md border-border bg-background/50 text-primary focus:ring-primary/20 accent-primary mt-0.5 cursor-pointer"
            />
            <label htmlFor="agreeTerms" className="text-xs text-muted-foreground font-semibold leading-tight cursor-pointer">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline font-bold">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline font-bold">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.agreeTerms}</span>
            </p>
          )}
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          className="h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md cursor-pointer mt-2 text-sm"
        >
          Create Account
        </Button>
      </form>

      {/* Redirection */}
      <div className="text-center mt-2">
        <p className="text-xs text-muted-foreground font-semibold">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

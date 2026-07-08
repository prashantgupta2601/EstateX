'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // 1. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // 2. Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Login attempt:', { email, password, rememberMe });
      toast('Login successful (mock)');
      router.push('/dashboard');
    }
  };

  const handleSocialClick = (platform: string) => {
    toast(`Continue with ${platform} coming soon`);
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="text-center">
        <h2 className="text-xl font-black text-foreground">Welcome Back</h2>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Sign in to manage your wishlist, comparisons, and bookings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
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

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <Link 
              href="/forgot-password" 
              className="text-[10px] font-bold text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="••••••••"
              className={`pl-10 pr-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background ${
                errors.password ? 'border-destructive focus-visible:ring-destructive' : 'border-border/80'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center gap-2 py-1 select-none">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded-md border-border bg-background/50 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-xs text-muted-foreground font-semibold cursor-pointer">
            Remember me on this device
          </label>
        </div>

        {/* Submit button */}
        <Button 
          type="submit" 
          className="h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md cursor-pointer mt-2 text-sm"
        >
          Sign In
        </Button>
      </form>

      {/* Social login separator */}
      <div className="flex items-center gap-3 py-2">
        <div className="h-px bg-border/60 flex-1" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">or continue with</span>
        <div className="h-px bg-border/60 flex-1" />
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialClick('Google')}
          className="h-10 rounded-xl text-xs font-bold border-border/80 hover:bg-muted text-foreground flex items-center justify-center gap-2 cursor-pointer bg-background/30"
        >
          <svg className="h-4 w-4 mr-0.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.68 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span>Google</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialClick('Facebook')}
          className="h-10 rounded-xl text-xs font-bold border-border/80 hover:bg-muted text-foreground flex items-center justify-center gap-2 cursor-pointer bg-background/30"
        >
          <svg className="h-4 w-4 mr-0.5 text-[#1877F2] fill-current" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </Button>
      </div>

      {/* Footer redirection link */}
      <div className="text-center mt-2">
        <p className="text-xs text-muted-foreground font-semibold">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

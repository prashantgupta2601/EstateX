'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Email address is required');
      return;
    } else if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    console.log('Password reset requested for:', email);
    toast('Password reset link sent (mock)');
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {!submitted ? (
        <>
          <div className="text-center">
            <h2 className="text-xl font-black text-foreground">Forgot Password?</h2>
            <p className="text-xs text-muted-foreground mt-1.5 font-medium leading-relaxed">
              Enter your email address and we will send you a link to reset your password.
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
                    if (error) setError(null);
                  }}
                  placeholder="name@example.com"
                  className={`pl-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background ${
                    error ? 'border-destructive focus-visible:ring-destructive' : 'border-border/80'
                  }`}
                />
              </div>
              {error && (
                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            {/* Submit */}
            <Button 
              type="submit" 
              className="h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md cursor-pointer mt-2 text-sm flex items-center justify-center gap-1.5"
            >
              <span>Send Reset Link</span>
            </Button>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-6 px-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-2xl gap-4 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-500 dark:text-emerald-400 shadow-inner animate-pulse">
            <Mail className="h-8 w-8 stroke-[1.5]" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-black text-foreground">Link Sent Successfully</h2>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs">
              Reset link sent to <strong className="text-foreground">{email}</strong>. Check your inbox.
            </p>
          </div>
        </div>
      )}

      {/* Redirection */}
      <div className="text-center mt-2 flex flex-col items-center">
        <div className="h-px bg-border/60 w-full mb-4" />
        
        <Link 
          href="/login" 
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
}

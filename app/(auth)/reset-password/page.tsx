'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criteria
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteria = [
    { label: '8+ characters', met: hasMinLength },
    { label: 'Uppercase letter', met: hasUppercase },
    { label: 'Number', met: hasNumber },
    { label: 'Special character', met: hasSpecial },
  ];

  const strengthScore = criteria.filter((c) => c.met).length;

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-emerald-500';
      default:
        return 'bg-muted';
    }
  };

  const getStrengthLabel = (score: number) => {
    if (password.length === 0) return '';
    switch (score) {
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError('Password is required');
      return;
    }

    if (strengthScore < 4) {
      setError('Password does not meet all strength requirements');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    console.log('Password reset successfully');
    toast('Password reset successful!');
    router.push('/login');
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="text-center">
        <h2 className="text-xl font-black text-foreground">Set New Password</h2>
        <p className="text-xs text-muted-foreground mt-1.5 font-medium leading-relaxed">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              className={`pl-10 pr-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background ${
                error && !password ? 'border-destructive focus-visible:ring-destructive' : 'border-border/80'
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

          {/* Strength Indicator */}
          <div className="flex flex-col gap-1.5 mt-1 select-none">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Password Strength
              </span>
              {password.length > 0 && (
                <span className={`text-[10px] font-black ${
                  strengthScore === 1 ? 'text-red-500' :
                  strengthScore === 2 ? 'text-orange-500' :
                  strengthScore === 3 ? 'text-yellow-500' :
                  'text-emerald-500'
                }`}>
                  {getStrengthLabel(strengthScore)}
                </span>
              )}
            </div>
            
            {/* 4-segment visual bar */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    index <= strengthScore 
                      ? getStrengthColor(strengthScore) 
                      : 'bg-muted/80 dark:bg-muted/30'
                  }`}
                />
              ))}
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-2 mt-1.5 text-[10px] sm:text-[11px] font-bold">
              {criteria.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {c.met ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3] shrink-0" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45 ml-1.5 mr-0.5 shrink-0" />
                  )}
                  <span className={c.met ? 'text-foreground/85 transition-colors' : 'text-muted-foreground/75'}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5 mt-1">
          <label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              className={`pl-10 pr-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background ${
                error && (password !== confirmPassword || !confirmPassword) ? 'border-destructive focus-visible:ring-destructive' : 'border-border/80'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-[10px] text-destructive font-semibold flex items-center gap-1.5 mt-1">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {/* Submit */}
        <Button 
          type="submit" 
          className="h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md cursor-pointer mt-3 text-sm flex items-center justify-center gap-1.5"
        >
          <span>Reset Password</span>
        </Button>
      </form>
    </div>
  );
}

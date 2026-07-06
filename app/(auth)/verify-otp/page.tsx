'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import OtpInput from '@/components/ui/otp-input';

export default function VerifyOtpPage() {
  const router = useRouter();
  
  // State
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Countdown timer for Resend button
  useEffect(() => {
    if (secondsLeft === 0) return;
    
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Performs actual validation check
  const handleVerify = (otpCode: string) => {
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP code');
      return;
    }

    if (otpCode === '123456') {
      setError(null);
      toast('Phone number verified successfully');
      router.push('/');
    } else {
      setError('Invalid OTP, please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(otp);
  };

  const handleResend = () => {
    toast('A new 6-digit OTP has been sent');
    setOtp('');
    setError(null);
    setSecondsLeft(30);
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* Page Header */}
      <div className="text-center">
        <h2 className="text-xl font-black text-foreground">Verify Your Phone Number</h2>
        <p className="text-xs text-muted-foreground mt-1.5 font-medium leading-relaxed">
          Enter the 6-digit OTP sent to <strong className="text-foreground">+91 XXXXXX1234</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Reusable OTP Input boxes (triggers auto-verify immediately on complete) */}
        <div className="flex flex-col gap-2">
          <OtpInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (error) setError(null);
            }}
            onComplete={handleVerify}
            length={6}
            disabled={false}
          />
          {error && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 justify-center mt-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Resend Action with Countdown Timer */}
        <div className="text-center select-none">
          {secondsLeft > 0 ? (
            <button
              type="button"
              disabled
              className="text-xs text-muted-foreground font-semibold cursor-not-allowed opacity-80"
            >
              Resend OTP in {secondsLeft}s
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-xs text-primary hover:underline font-bold cursor-pointer transition-colors"
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Submit / Verification Button */}
        <Button 
          type="submit" 
          className="h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md cursor-pointer mt-1 text-sm flex items-center justify-center gap-1.5"
        >
          <KeyRound className="h-4 w-4" />
          <span>Verify Code</span>
        </Button>
      </form>

      {/* Redirection */}
      <div className="text-center mt-2 flex flex-col items-center">
        <div className="h-px bg-border/60 w-full mb-4" />
        
        <Link 
          href="/signup" 
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Change Phone Number</span>
        </Link>
      </div>

    </div>
  );
}

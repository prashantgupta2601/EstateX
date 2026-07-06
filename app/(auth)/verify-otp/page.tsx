'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first box on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (!value) return;

    const newOtp = [...otp];
    // Take only the last character if paste/multi-character entry occurs
    newOtp[index] = value[value.length - 1];
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input box
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      
      // If current box is empty, clear the previous box and focus it
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Just clear current box
        newOtp[index] = '';
        setOtp(newOtp);
      }
      setError(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    
    if (pasteData.length === 6) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      setError(null);
      // Focus last box
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP code sent to your phone');
      return;
    }

    console.log('OTP Verified successfully:', otpCode);
    toast('Account verified successfully (mock)');
    router.push('/properties');
  };

  const handleResend = () => {
    toast('A new 6-digit OTP has been sent (mock)');
    setOtp(new Array(6).fill(''));
    setError(null);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="text-center">
        <h2 className="text-xl font-black text-foreground">Verify OTP</h2>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          We sent a 6-digit verification code to your registered mobile number.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* OTP Input Boxes Grid */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center gap-2 max-w-sm mx-auto w-full">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                className="h-12 w-12 text-center text-lg font-black rounded-xl border border-border/80 bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase outline-hidden"
              />
            ))}
          </div>
          {error && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 justify-center mt-1">
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
          <KeyRound className="h-4 w-4" />
          <span>Verify & Register</span>
        </Button>
      </form>

      {/* Resend Action */}
      <div className="text-center mt-2 flex flex-col gap-4">
        <p className="text-xs text-muted-foreground font-semibold">
          Didn&apos;t receive the code?{' '}
          <button 
            type="button" 
            onClick={handleResend}
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            Resend OTP
          </button>
        </p>
        
        <div className="h-px bg-border/60" />
        
        <Link 
          href="/signup" 
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold self-center transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Registration</span>
        </Link>
      </div>
    </div>
  );
}

'use client';

import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

export default function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split string value into array of individual digits
  const otpArray = value.split('').concat(new Array(length).fill('')).slice(0, length);

  // Focus the first empty box or the first box on mount
  useEffect(() => {
    const focusIndex = value.length < length ? value.length : length - 1;
    if (inputRefs.current[focusIndex] && !disabled) {
      inputRefs.current[focusIndex]?.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (disabled) return;

    // Take only the last character entered
    const digit = val[val.length - 1] || '';

    // Create a new OTP string
    const newOtpArray = [...otpArray];
    newOtpArray[index] = digit;
    
    // Join and clean up values beyond length
    const combinedVal = newOtpArray.join('').slice(0, length);
    onChange(combinedVal);

    // Call complete if finished
    if (combinedVal.length === length && onComplete) {
      onComplete(combinedVal);
    }

    // Auto-focus next box if digit is entered
    if (digit && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const newOtpArray = [...otpArray];
      
      // If current box is empty, clear the previous box and focus it
      if (!otpArray[index] && index > 0 && inputRefs.current[index - 1]) {
        newOtpArray[index - 1] = '';
        onChange(newOtpArray.join('').slice(0, length));
        inputRefs.current[index - 1]?.focus();
      } else {
        // Just clear current box
        newOtpArray[index] = '';
        onChange(newOtpArray.join('').slice(0, length));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    
    if (pasteData) {
      onChange(pasteData);
      
      // Call complete if pasted data fills all boxes
      if (pasteData.length === length && onComplete) {
        onComplete(pasteData);
      }

      // Focus appropriate box (either the last filled box or the next empty box)
      const focusIndex = pasteData.length < length ? pasteData.length : length - 1;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-between items-center gap-2 max-w-sm mx-auto w-full">
      {otpArray.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { inputRefs.current[idx] = el; }}
          type="text"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          onFocus={() => {
            // Place cursor at the end
            if (inputRefs.current[idx]) {
              const input = inputRefs.current[idx];
              if (input) {
                const len = input.value.length;
                input.setSelectionRange(len, len);
              }
            }
          }}
          className="h-12 w-12 text-center text-lg font-black rounded-xl border border-border/80 bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-hidden disabled:opacity-50 disabled:cursor-not-allowed select-none"
        />
      ))}
    </div>
  );
}

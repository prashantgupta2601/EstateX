import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster } from '@/components/ui/toast';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 dark:from-slate-950 dark:via-indigo-950/10 dark:to-slate-900 px-4 py-12 md:py-16">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        
        {/* Brand Logo Header */}
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 duration-300">
          <Image 
            src="/estatex_logo.png" 
            alt="EstateX Logo" 
            width={40} 
            height={40} 
            className="h-10 w-10 object-contain rounded-xl shadow-xs"
          />
          <span className="text-2xl font-black tracking-tight text-primary">EstateX</span>
        </Link>
        
        {/* Centered Auth Card */}
        <div className="w-full bg-card/85 backdrop-blur-md border border-border/80 rounded-3xl p-6 md:p-8 shadow-2xl">
          {children}
        </div>
        
      </div>
      <Toaster />
    </div>
  );
}

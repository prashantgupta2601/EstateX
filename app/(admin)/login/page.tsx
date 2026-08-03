'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      const msg = 'Please enter both email address and password';
      setErrorMsg(msg);
      toast(msg, 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Check admin credentials
      if (email.trim().toLowerCase() === 'admin@estatehub.com' && password === 'admin123') {
        // Set mock admin_session cookie
        document.cookie = 'admin_session=true; path=/; max-age=86400';
        toast('Admin login successful! Welcome to Control Center.', 'success');
        router.push(from);
      } else {
        setIsLoading(false);
        const msg = 'Invalid credentials. Please check your admin email and password.';
        setErrorMsg(msg);
        toast(msg, 'error');
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-8">
        <div className="p-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/20">
          <ShieldCheck className="h-9 w-9 stroke-[2.5]" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            EstateHub <span className="text-amber-400">Admin</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Sign in to access global moderation, analytics & control panel.
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-6">
        
        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="admin-email" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@estatehub.com"
                className="pl-10 h-11 rounded-xl bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-amber-500 focus-visible:border-amber-500"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <div className="flex items-center justify-between">
              <label htmlFor="admin-password" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Demo: admin123</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 rounded-xl bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-amber-500 focus-visible:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 mt-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Panel</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </Button>

        </form>

        {/* Demo Helper Note */}
        <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 text-center flex flex-col gap-1">
          <span className="font-bold text-slate-300">Default Demo Credentials:</span>
          <span className="font-mono text-amber-400">admin@estatehub.com / admin123</span>
        </div>

      </div>

    </div>
  );
}

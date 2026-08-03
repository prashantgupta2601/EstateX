'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  DollarSign, 
  ClipboardCheck, 
  Flag, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const stats = [
    {
      title: 'Pending Approvals',
      value: '24',
      change: '+12% vs last week',
      isPositive: true,
      icon: ClipboardCheck,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      href: '/admin/approvals',
    },
    {
      title: 'Total Active Sellers',
      value: '1,420',
      change: '+8.4% this month',
      isPositive: true,
      icon: Building2,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      href: '/admin/sellers',
    },
    {
      title: 'Monthly Platform Revenue',
      value: '₹14.8L',
      change: '+18.2% vs target',
      isPositive: true,
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      href: '/admin/revenue',
    },
    {
      title: 'Reported Content',
      value: '7',
      change: '-3 since yesterday',
      isPositive: true,
      icon: Flag,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      href: '/admin/reports',
    },
  ];

  const recentApprovals = [
    { id: 'PROP-9021', title: 'DLF Cyber City Office Suite', seller: 'Gurgaon Realty Ltd', price: '₹4.2 Cr', status: 'Pending Review', date: '10 mins ago' },
    { id: 'PROP-9022', title: 'Luxury 4BHK Villa in Jubilee Hills', seller: 'Telangana Homes', price: '₹8.5 Cr', status: 'Pending Review', date: '25 mins ago' },
    { id: 'PROP-9023', title: 'Sea Facing Apartment Bandra West', seller: 'Apex Developers', price: '₹12.0 Cr', status: 'Approved', date: '1 hour ago' },
  ];

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            System Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time operations, moderation queue & platform metrics summary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 font-bold text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
            System Live & Healthy
          </Badge>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="rounded-3xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-all p-5 shadow-lg group cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{stat.title}</span>
                  <div className={`p-2.5 rounded-2xl border ${stat.color} transition-transform group-hover:scale-105`}>
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  <span className="text-2xl font-black text-white tracking-tight">{stat.value}</span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{stat.change}</span>
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Moderation Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Moderation Queue */}
        <Card className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-black text-white">Recent Listing Approvals</h2>
            </div>
            <Link href="/admin/approvals">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl">
                View All Queue
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentApprovals.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-200">{item.title}</span>
                    <Badge className="bg-slate-800 text-slate-400 text-[9px] font-mono">{item.id}</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {item.seller} • <strong className="text-slate-300">{item.price}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">{item.date}</span>
                  <Badge className={`text-[10px] font-bold ${
                    item.status === 'Approved' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Platform Quick Links */}
        <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-black text-white">Admin Quick Actions</h2>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link href="/admin/approvals" className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition-all">
              <span>Moderate Pending Listings</span>
              <ArrowUpRight className="h-4 w-4 text-amber-400" />
            </Link>

            <Link href="/admin/verifications" className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition-all">
              <span>Verify Broker KYC Applications</span>
              <ArrowUpRight className="h-4 w-4 text-amber-400" />
            </Link>

            <Link href="/admin/subscription-plans" className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition-all">
              <span>Manage Subscription Plans</span>
              <ArrowUpRight className="h-4 w-4 text-amber-400" />
            </Link>

            <Link href="/admin/logs" className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition-all">
              <span>View Audit & Activity Logs</span>
              <ArrowUpRight className="h-4 w-4 text-amber-400" />
            </Link>
          </div>
        </Card>

      </div>

    </div>
  );
}

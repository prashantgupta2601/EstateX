'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  CheckCircle, 
  Users, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { sellerProfile } from '@/lib/mock-data/seller';

// Mock daily views data for the last 7 days (mini-chart)
const mockViewsData = [
  { day: 'Mon', views: 28 },
  { day: 'Tue', views: 35 },
  { day: 'Wed', views: 42 },
  { day: 'Thu', views: 30 },
  { day: 'Fri', views: 48 },
  { day: 'Sat', views: 25 },
  { day: 'Sun', views: 26 },
];

// Mock recent leads (last 5 leads)
const mockRecentLeads = [
  {
    id: 'lead-1',
    buyerName: 'Aarav Mehta',
    email: 'aarav@example.com',
    phone: '+91 99887 76655',
    propertyTitle: 'Premium 3 BHK Apartment - Bandra',
    date: 'Today, 10:30 AM',
    status: 'new'
  },
  {
    id: 'lead-2',
    buyerName: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    phone: '+91 98765 43210',
    propertyTitle: 'Spacious 4 BHK Villa - HSR Layout',
    date: 'Yesterday, 4:15 PM',
    status: 'contacted'
  },
  {
    id: 'lead-3',
    buyerName: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phone: '+91 88776 65544',
    propertyTitle: 'Cozy 2 BHK Flat - Powai',
    date: '2 days ago',
    status: 'qualified'
  },
  {
    id: 'lead-4',
    buyerName: 'Vikram Malhotra',
    email: 'vikram@example.com',
    phone: '+91 77665 54433',
    propertyTitle: 'Commercial Office Space - BKC',
    date: '4 days ago',
    status: 'new'
  },
  {
    id: 'lead-5',
    buyerName: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91 91122 33445',
    propertyTitle: 'Penthouse Suite - Worli',
    date: '5 days ago',
    status: 'contacted'
  }
];

export default function SellerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [totalListingsCount, setTotalListingsCount] = useState(sellerProfile.totalListings);
  const [activeListingsCount, setActiveListingsCount] = useState(sellerProfile.activeListings);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('estatex_seller_listings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTotalListingsCount(parsed.length);
        setActiveListingsCount(parsed.filter((l: any) => l.status === 'active').length);
      } catch (e) {
        console.error('Failed to parse seller listings from localStorage', e);
      }
    }
  }, []);

  const maskPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const clean = phone.trim();
    if (clean.length > 5) {
      return clean.slice(0, -5) + 'XXXXX';
    }
    return 'XXXXX';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            New
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Contacted
          </span>
        );
      case 'qualified':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Qualified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300">
      
      {/* 6. Plan status banner */}
      {sellerProfile.plan === 'free' ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold">You are on Free Plan.</span>
              <span className="text-xs opacity-90 mt-0.5">
                Upgrade to post unlimited properties and get featured listings.
              </span>
            </div>
          </div>
          <Link href="/seller/subscription" className="shrink-0">
            <Button size="sm" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 h-9 shadow-xs hover:scale-[1.01] transition-all cursor-pointer">
              Upgrade Now
            </Button>
          </Link>
        </div>
      ) : sellerProfile.plan === 'pro' ? (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
          <CheckCircle className="h-5 w-5 text-emerald-650 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold">Pro Plan Active</span>
            <span className="text-xs opacity-90 mt-0.5">
              Your subscription is active and will renew on January 15, 2027.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300">
          <CheckCircle className="h-5 w-5 text-blue-650 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold">Basic Plan Active</span>
            <span className="text-xs opacity-90 mt-0.5">
              Enjoy active property listings and standard leads matching.
            </span>
          </div>
        </div>
      )}

      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Welcome back, {sellerProfile.name}. Monitor your leads, views, and listings performance.
          </p>
        </div>
      </div>

      {/* 2. Stats row (4 cards with icons + trend indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Listings */}
        <Card className="rounded-2xl border-border/40 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Listings</span>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Building2 className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{totalListingsCount}</div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              <span>+20%</span>
              <span className="text-muted-foreground font-medium ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Listings */}
        <Card className="rounded-2xl border-border/40 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Listings</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <CheckCircle className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{activeListingsCount}</div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              <span>+14%</span>
              <span className="text-muted-foreground font-medium ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Leads */}
        <Card className="rounded-2xl border-border/40 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Leads</span>
            <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Users className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">47</div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-red-500 dark:text-red-400 font-bold">
              <ArrowDownRight className="h-3.5 w-3.5 shrink-0" />
              <span>-4%</span>
              <span className="text-muted-foreground font-medium ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Views */}
        <Card className="rounded-2xl border-border/40 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Profile Views</span>
            <div className="p-2.5 bg-violet-500/10 text-violet-500 rounded-xl">
              <Eye className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">234</div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              <span>+12%</span>
              <span className="text-muted-foreground font-medium ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 3. Quick Actions row (4 buttons) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted/20 border border-border/30 rounded-2xl p-4">
        <Link href="/seller/properties/add" className="w-full">
          <Button className="w-full rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold shadow-xs transition-all cursor-pointer h-10 text-xs">
            <Plus className="h-4 w-4 mr-1.5" />
            Post New Property
          </Button>
        </Link>
        <Link href="/seller/leads" className="w-full">
          <Button variant="outline" className="w-full rounded-xl border-border/80 hover:bg-muted font-bold transition-all cursor-pointer h-10 text-xs">
            View All Leads
          </Button>
        </Link>
        <Link href="/seller/subscription" className="w-full">
          <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xs transition-all cursor-pointer h-10 text-xs border border-amber-600/10">
            Upgrade Plan
          </Button>
        </Link>
        <Link href="/seller/analytics" className="w-full">
          <Button variant="outline" className="w-full rounded-xl border-border/80 hover:bg-muted font-bold transition-all cursor-pointer h-10 text-xs">
            View Analytics
          </Button>
        </Link>
      </div>

      {/* Leads Table and Mini Chart Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 4. Recent Leads table (last 5 leads) */}
        <Card className="rounded-2xl border-border/40 shadow-xs lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="flex-1">
            <CardHeader className="pb-4 border-b border-border/40">
              <span className="text-base font-extrabold text-foreground">Recent Leads</span>
            </CardHeader>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground text-xs font-bold uppercase tracking-wider bg-muted/20">
                    <th className="py-3.5 px-4 font-bold">Buyer Name</th>
                    <th className="py-3.5 px-4 font-bold">Property</th>
                    <th className="py-3.5 px-4 font-bold">Phone</th>
                    <th className="py-3.5 px-4 font-bold">Date</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/45">
                  {mockRecentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-muted/10 transition-colors font-medium">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar size="sm" className="h-7 w-7 border border-border/60">
                            <AvatarFallback className="bg-primary/15 text-primary font-black text-[10px]">
                              {lead.buyerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-foreground text-xs">{lead.buyerName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs max-w-[200px] truncate text-muted-foreground">
                        {lead.propertyTitle}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-foreground">
                        {maskPhoneNumber(lead.phone)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {lead.date}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(lead.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-border/40 bg-muted/10 flex items-center justify-end">
            <Link href="/seller/leads" className="text-xs font-black text-primary hover:text-primary/90 flex items-center gap-0.5 hover:underline">
              <span>View All Leads</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>

        {/* 5. Listing Performance mini-chart */}
        <Card className="rounded-2xl border-border/40 shadow-xs flex flex-col justify-between">
          <div>
            <CardHeader className="pb-4">
              <span className="text-base font-extrabold text-foreground">Listing Performance</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Profile views per day (Last 7 Days)
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full mt-2">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockViewsData}
                      margin={{ top: 10, right: 5, left: -25, bottom: 5 }}
                    >
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 650 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 650 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <ChartTooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border)/80)',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: 'hsl(var(--foreground))',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                        }}
                      />
                      <Bar 
                        dataKey="views" 
                        fill="var(--color-primary, #3b82f6)" 
                        radius={[6, 6, 0, 0]}
                        maxBarSize={30}
                        name="Daily Views"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-muted/40 animate-pulse rounded-2xl flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-semibold">Loading performance...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
          <div className="p-4 border-t border-border/40 bg-muted/10 flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground font-semibold">
              Total Views (7 Days): <span className="font-bold text-foreground">234</span>
            </span>
          </div>
        </Card>

      </div>

    </div>
  );
}

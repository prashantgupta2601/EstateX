'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Plus, 
  ArrowUpRight, 
  MessageSquare, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { sellerProfile } from '@/lib/mock-data/seller';

// Mock analytics data for leads traffic over 6 months
const mockChartData = [
  { month: 'Jan', leads: 24, views: 180 },
  { month: 'Feb', leads: 35, views: 240 },
  { month: 'Mar', leads: 48, views: 320 },
  { month: 'Apr', leads: 40, views: 290 },
  { month: 'May', leads: 55, views: 410 },
  { month: 'Jun', leads: 68, views: 520 },
];

// Mock recent leads
const mockRecentLeads = [
  {
    id: 'lead-1',
    buyerName: 'Aarav Mehta',
    email: 'aarav@example.com',
    phone: '+91 99887 76655',
    propertyTitle: 'Premium 3 BHK Apartment - Bandra',
    date: 'Today, 10:30 AM',
    message: 'Interested in scheduling a site visit this Saturday. Is the price negotiable?',
    status: 'new'
  },
  {
    id: 'lead-2',
    buyerName: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    phone: '+91 98765 43210',
    propertyTitle: 'Spacious 4 BHK Villa - HSR Layout',
    date: 'Yesterday',
    message: 'Can you please share the floor plan and registration documents?',
    status: 'contacted'
  },
  {
    id: 'lead-3',
    buyerName: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phone: '+91 88776 65544',
    propertyTitle: 'Cozy 2 BHK Flat - Powai',
    date: '3 days ago',
    message: 'Is a bank loan pre-approved for this project? Let me know.',
    status: 'qualified'
  }
];

export default function SellerDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="h-3 w-3" /> New Lead
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertCircle className="h-3 w-3" /> Contacted
          </span>
        );
      case 'qualified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success-foreground border border-success/20">
            <CheckCircle2 className="h-3 w-3" /> Qualified
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-in fade-in duration-300">
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Seller Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, {sellerProfile.name}. Here is an overview of your active listings and buyer leads.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/seller/properties/add">
            <Button className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 shadow-xs cursor-pointer flex items-center gap-1.5 h-10">
              <Plus className="h-4.5 w-4.5" />
              <span>List New Property</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Listings Card */}
        <Card className="rounded-2xl border-border/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              My Listings
            </CardTitle>
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Building2 className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {sellerProfile.totalListings}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 font-medium">
              <span className="text-success-foreground font-bold">{sellerProfile.activeListings} Active</span> · {sellerProfile.totalListings - sellerProfile.activeListings} Draft/Sold
            </p>
          </CardContent>
        </Card>

        {/* Total Leads Card */}
        <Card className="rounded-2xl border-border/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Enquiries
            </CardTitle>
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Users className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">156</div>
            <p className="text-xs text-success-foreground mt-1.5 font-bold flex items-center gap-0.5">
              +12% <span className="text-muted-foreground font-medium">from last week</span>
            </p>
          </CardContent>
        </Card>

        {/* Lead Conversion Card */}
        <Card className="rounded-2xl border-border/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Conversion Rate
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">18.4%</div>
            <p className="text-xs text-success-foreground mt-1.5 font-bold flex items-center gap-0.5">
              +2.4% <span className="text-muted-foreground font-medium">this month</span>
            </p>
          </CardContent>
        </Card>

        {/* Subscription Plan Card */}
        <Card className="rounded-2xl border-border/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Subscription
            </CardTitle>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <CreditCard className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 capitalize">
              {sellerProfile.plan} Plan
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 font-medium">
              Renews on Jan 15, 2027
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <Card className="rounded-2xl border-border/40 shadow-xs lg:col-span-2">
          <CardHeader className="flex flex-col gap-1 pb-4">
            <CardTitle className="text-lg font-bold text-foreground">
              Leads & Views Analytics
            </CardTitle>
            <CardDescription>
              Monthly breakdown of listing views and active buyer enquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full flex items-center justify-center">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={mockChartData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/45" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
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
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="var(--color-primary)" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorViews)" 
                      name="Listing Views"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="#10b981" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorLeads)" 
                      name="Buyer Leads"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-muted/40 animate-pulse rounded-2xl flex items-center justify-center">
                  <span className="text-xs text-muted-foreground font-semibold">Loading chart...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips & Limits Card */}
        <Card className="rounded-2xl border-border/40 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-foreground">
              Verification & KYC
            </CardTitle>
            <CardDescription>
              Required details to unlock premium visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <div className="p-3.5 rounded-2xl bg-success/5 border border-success/15 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success-foreground shrink-0 mt-0.5" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-foreground">KYC Documents Approved</span>
                <span className="text-[11px] text-muted-foreground mt-1">
                  Your identity documents have been vetted. Verified seller badge is active.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">Active Listings Limit</span>
                <span className="text-foreground">{sellerProfile.activeListings} / Unlimited</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[80%]" />
              </div>
              <span className="text-[10px] text-muted-foreground font-semibold mt-1">
                You are on the <span className="text-amber-600 font-bold">Pro Plan</span> which grants unlimited active property listings and advanced lead matching features.
              </span>
            </div>
          </CardContent>
          <div className="p-6 border-t border-border/40">
            <Link href="/seller/profile">
              <Button variant="outline" className="w-full rounded-xl text-xs font-bold cursor-pointer h-9.5">
                Manage Profile & KYC
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Leads Section */}
      <Card className="rounded-2xl border-border/40 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              Recent Buyer Enquiries
            </CardTitle>
            <CardDescription>
              Direct contact requests submitted by buyers for your properties
            </CardDescription>
          </div>
          <Link href="/seller/leads">
            <Button variant="ghost" className="rounded-xl text-xs font-black text-primary hover:text-primary/90 flex items-center gap-1 cursor-pointer">
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {mockRecentLeads.map((lead) => (
              <div key={lead.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <Avatar size="default" className="h-10 w-10 border border-border/60">
                    <AvatarFallback className="bg-indigo-500/10 text-indigo-500 font-black text-xs">
                      {lead.buyerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 text-left">
                    <div className="flex items-center flex-wrap gap-2.5">
                      <span className="text-sm font-bold text-foreground truncate">{lead.buyerName}</span>
                      {getStatusBadge(lead.status)}
                      <span className="text-[10px] text-muted-foreground font-semibold">{lead.date}</span>
                    </div>
                    <span className="text-[11px] text-primary font-black mt-1 truncate hover:underline">
                      Property: {lead.propertyTitle}
                    </span>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed italic">
                      &ldquo;{lead.message}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Lead Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <a href={`tel:${lead.phone}`}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer">
                      <Phone className="h-4.5 w-4.5" />
                    </Button>
                  </a>
                  <a href={`mailto:${lead.email}`}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer">
                      <Mail className="h-4.5 w-4.5" />
                    </Button>
                  </a>
                  <Link href={`/seller/leads?reply=${lead.id}`}>
                    <Button className="rounded-xl text-xs font-bold px-4 h-9 cursor-pointer">
                      <MessageSquare className="h-4 w-4 mr-1.5" /> Reply
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

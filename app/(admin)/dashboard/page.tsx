'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Building2, 
  ClipboardCheck, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Server,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  platformStats, 
  weeklyStats, 
  mockPendingApprovals, 
  mockRecentRegistrations 
} from '@/lib/mock-data/admin-stats';

export default function AdminDashboardOverviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format currency helper (e.g. 1480000 -> ₹14.8L)
  const formatShortCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    return `₹${val.toLocaleString()}`;
  };

  // Stat cards configuration for Row 1
  const keyMetricCards = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: platformStats.totalUsers.toLocaleString(),
      change: '+5.2% vs yesterday',
      isPositive: true,
      icon: Users,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      href: '/admin/users',
      clickable: false,
    },
    {
      id: 'active-listings',
      title: 'Active Listings',
      value: platformStats.activeListings.toLocaleString(),
      change: '+3.8% vs yesterday',
      isPositive: true,
      icon: Building2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      href: '/admin/approvals',
      clickable: false,
    },
    {
      id: 'pending-approvals',
      title: 'Pending Approvals',
      value: platformStats.pendingApprovals.toString(),
      change: '+12.5% vs yesterday',
      isPositive: true,
      icon: ClipboardCheck,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      href: '/admin/approvals',
      clickable: true,
    },
    {
      id: 'revenue-month',
      title: 'Revenue This Month',
      value: formatShortCurrency(platformStats.revenueThisMonth),
      change: '+18.2% vs yesterday',
      isPositive: true,
      icon: DollarSign,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      href: '/admin/revenue',
      clickable: false,
    },
    {
      id: 'leads-today',
      title: 'Total Leads Today',
      value: platformStats.leadsToday.toString(),
      change: '+8.4% vs yesterday',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      href: '/admin/analytics',
      clickable: false,
    },
    {
      id: 'active-subscriptions',
      title: 'Active Subscriptions',
      value: platformStats.activeSubscriptions.toLocaleString(),
      change: '+4.1% vs yesterday',
      isPositive: true,
      icon: CreditCard,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      href: '/admin/subscription-plans',
      clickable: false,
    },
  ];

  // Platform Health Items for Row 4
  const healthIndicators = [
    { name: 'Database', status: 'Healthy', icon: Server, detail: 'PostgreSQL • 12ms latency' },
    { name: 'Payment Gateway', status: 'Operational', icon: DollarSign, detail: 'Razorpay API Active' },
    { name: 'Storage', status: 'Operational', icon: Layers, detail: 'CDN & Media Servers 99.9%' },
    { name: 'AI Services', status: 'Operational', icon: Activity, detail: 'LLM & Recommendation Engines' },
  ];

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Seller':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Broker':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>EstateHub Admin Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Platform Statistics Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 font-bold text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Systems Operational</span>
          </Badge>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: KEY METRICS (6 STAT CARDS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {keyMetricCards.map((card) => {
          const Icon = card.icon;

          const cardContent = (
            <Card className={`rounded-3xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-all p-4 shadow-lg flex flex-col justify-between h-full ${card.clickable ? 'cursor-pointer hover:scale-[1.02] ring-1 ring-amber-500/20' : ''}`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                  <div className={`p-2 rounded-xl border ${card.color}`}>
                    <Icon className="h-4 w-4 stroke-[2.2]" />
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-0.5">
                  <span className="text-2xl font-black text-white tracking-tight">{card.value}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                  {card.isPositive ? (
                    <ArrowUpRight className="h-3 w-3 shrink-0" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 shrink-0 text-rose-400" />
                  )}
                  <span>{card.change}</span>
                </span>

                {card.clickable && (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5">
                    Review &gt;
                  </Badge>
                )}
              </div>
            </Card>
          );

          if (card.clickable) {
            return (
              <Link key={card.id} href={card.href}>
                {cardContent}
              </Link>
            );
          }

          return <div key={card.id}>{cardContent}</div>;
        })}
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: CHARTS (NEW USERS/LISTINGS & DAILY REVENUE) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Chart: Dual Line Chart - New Users + New Listings */}
        <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-base font-black text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span>Growth Trends (Last 7 Days)</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Daily volume of new user registrations and property submissions
              </CardDescription>
            </div>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold text-[10px]">
              Daily Tracking
            </Badge>
          </div>

          <div className="h-[280px] w-full pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-slate-700 text-slate-100 p-3 rounded-2xl shadow-xl text-xs space-y-1.5">
                            <span className="font-extrabold text-amber-400 block border-b border-slate-800 pb-1">{label}</span>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-blue-400 font-bold">New Users:</span>
                              <span className="font-black text-white">{payload[0]?.value}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-emerald-400 font-bold">New Listings:</span>
                              <span className="font-black text-white">{payload[1]?.value}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 10, fontSize: 11, fontWeight: 700 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newUsers" 
                    name="New Users" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ fill: '#3b82f6', r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newListings" 
                    name="New Listings" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ fill: '#10b981', r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Loading chart visualization...
              </div>
            )}
          </div>
        </Card>

        {/* Right Chart: Bar Chart - Daily Revenue */}
        <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-base font-black text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-400" />
                <span>Daily Revenue (Last 7 Days)</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Gross subscription and featured boost earnings per day
              </CardDescription>
            </div>
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-bold text-[10px]">
              INR Revenue
            </Badge>
          </div>

          <div className="h-[280px] w-full pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const val = payload[0].value as number;
                        return (
                          <div className="bg-slate-900 border border-slate-700 text-slate-100 p-3 rounded-2xl shadow-xl text-xs space-y-1">
                            <span className="font-extrabold text-purple-400 block border-b border-slate-800 pb-1">{label}</span>
                            <div className="flex items-center justify-between gap-4 pt-1">
                              <span className="text-slate-400 font-medium">Daily Gross:</span>
                              <span className="font-black text-emerald-400 text-sm">₹{val.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    name="Daily Revenue" 
                    fill="#a855f7" 
                    radius={[8, 8, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Loading chart visualization...
              </div>
            )}
          </div>
        </Card>

      </div>

      {/* ========================================================================= */}
      {/* ROW 3: TWO TABLES (PENDING APPROVALS & RECENT REGISTRATIONS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Table: Pending Approvals (Last 5 listings awaiting review) */}
        <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-black text-white">Pending Approvals</h3>
                <p className="text-[11px] text-slate-400">Listings awaiting admin moderation</p>
              </div>
            </div>
            <Link href="/admin/approvals">
              <Button size="sm" variant="outline" className="rounded-xl border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer">
                View All ({platformStats.pendingApprovals})
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black uppercase text-slate-500">
                  <th className="pb-2">Listing Title / Seller</th>
                  <th className="pb-2">Type / Price</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockPendingApprovals.slice(0, 5).map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate max-w-[200px]">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.seller} • <span className="text-slate-500">{item.submittedAt}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-200">{item.price}</span>
                        <span className="text-[10px] text-slate-400">{item.type}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Link href={`/admin/approvals?id=${item.id}`}>
                        <Button 
                          size="sm" 
                          className="h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] px-3 cursor-pointer shadow-xs"
                        >
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Table: Recent Registrations (Last 5 new users) */}
        <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-black text-white">Recent Registrations</h3>
                <p className="text-[11px] text-slate-400">Latest buyers, sellers & brokers</p>
              </div>
            </div>
            <Link href="/admin/users">
              <Button size="sm" variant="outline" className="rounded-xl border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer">
                View All Users
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black uppercase text-slate-500">
                  <th className="pb-2">User Details</th>
                  <th className="pb-2">Role Badge</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockRecentRegistrations.slice(0, 5).map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-2">
                      <Badge className={`text-[10px] font-extrabold border ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-bold text-slate-300">{user.status}</span>
                        <span className="text-[10px] text-slate-500">{user.registeredAt}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>

      {/* ========================================================================= */}
      {/* ROW 4: PLATFORM HEALTH (4 STATUS INDICATORS) */}
      {/* ========================================================================= */}
      <Card className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col gap-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-black text-white">Platform Infrastructure & Service Health</h3>
              <p className="text-xs text-slate-400">Live monitoring metrics for core backend modules</p>
            </div>
          </div>

          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 text-xs font-black">
            All Systems Normal
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {healthIndicators.map((svc) => {
            const Icon = svc.icon;
            return (
              <div 
                key={svc.name}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-200">{svc.name}</span>
                    <span className="text-[10px] text-slate-400">{svc.detail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{svc.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, User, Search, MessageSquare, Heart, Bell, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Saved Searches',
      value: '3',
      description: 'Active automated search criteria',
      icon: Search,
      href: '/saved-searches',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Active Enquiries',
      value: '5',
      description: 'Messages sent to property sellers',
      icon: MessageSquare,
      href: '/enquiries',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'My Wishlist',
      value: '8',
      description: 'Bookmarked properties',
      icon: Heart,
      href: '/wishlist',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Price Drop Alerts',
      value: '2',
      description: 'Active price drop trackers',
      icon: Bell,
      href: '/alerts',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground">Welcome Back, Prashant!</h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Manage your account details, alerts, wishlist, and conversations.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl hover:scale-[1.01] transition-transform duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <span className="text-2xl font-black text-foreground">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {stat.description}
                </span>
                <Link
                  href={stat.href}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline mt-2"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions / Getting Started */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <Card className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-black text-foreground">Complete Your Profile</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
            Add your details, contact number, and professional bio to make communication with sellers smoother.
          </p>
          <Link
            href="/profile"
            className={cn(
              buttonVariants({ size: 'sm' }),
              "w-fit rounded-xl font-bold mt-1 flex items-center justify-center cursor-pointer"
            )}
          >
            Edit Profile
          </Link>
        </Card>

        <Card className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-black text-foreground">Browse Properties</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
            Explore thousands of residential apartments, plots, and commercial properties. Save your searches to get notified.
          </p>
          <Link
            href="/properties"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              "w-fit rounded-xl font-bold mt-1 flex items-center justify-center cursor-pointer"
            )}
          >
            Search Properties
          </Link>
        </Card>
      </div>
    </div>
  );
}

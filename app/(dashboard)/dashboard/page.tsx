'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MessageSquare, Heart, Bell, ArrowRight, ArrowUpRight, SearchSlash, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/lib/hooks/use-wishlist';
import { mockSavedSearches } from '@/lib/mock-data/saved-searches';
import { mockEnquiries } from '@/lib/mock-data/enquiries';
import { mockPriceAlerts } from '@/lib/mock-data/price-alerts';
import { mockProperties } from '@/lib/mock-data/properties';

export default function DashboardPage() {
  const { wishlist } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);

  // Sync mount status to avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: 'Saved Searches',
      value: String(mockSavedSearches.length),
      description: 'Active automated search criteria',
      icon: Search,
      href: '/saved-searches',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Active Enquiries',
      value: String(mockEnquiries.length),
      description: 'Messages sent to property sellers',
      icon: MessageSquare,
      href: '/enquiries',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'My Wishlist',
      value: isMounted ? String(wishlist.length) : '...',
      description: 'Bookmarked properties',
      icon: Heart,
      href: '/wishlist',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Price Drop Alerts',
      value: String(mockPriceAlerts.length),
      description: 'Active price drop trackers',
      icon: Bell,
      href: '/price-alerts',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
  ];

  // Derive last 3 enquiries
  const recentEnquiries = useMemo(() => {
    return [...mockEnquiries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, []);

  // Derive last 3 wishlist items
  const recentWishlist = useMemo(() => {
    if (!isMounted) return [];
    return mockProperties
      .filter((p) => wishlist.includes(p.id))
      .slice(0, 3);
  }, [wishlist, isMounted]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lac`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500/15 text-amber-500 border-none text-[8px] font-black uppercase shrink-0 py-0.5 rounded-full px-2">Pending</Badge>;
      case 'replied':
        return <Badge className="bg-emerald-500/15 text-emerald-500 border-none text-[8px] font-black uppercase shrink-0 py-0.5 rounded-full px-2">Replied</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-none text-[8px] font-black uppercase shrink-0 py-0.5 rounded-full px-2">Closed</Badge>;
    }
  };

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
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline mt-2 w-fit"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Column 1: Recent Enquiries */}
        <Card className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-black text-foreground">Recent Enquiries</h3>
            </div>
            <Link href="/enquiries" className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5">
              <span>All ({mockEnquiries.length})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-3 border border-border/60 bg-background/30 rounded-xl flex flex-col gap-2 hover:bg-background/50 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <Link href={`/properties/${enq.propertyId}`} className="text-xs font-black text-foreground hover:text-primary transition-colors truncate max-w-[70%] leading-tight">
                      {enq.propertyTitle}
                    </Link>
                    {getStatusBadge(enq.status)}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed line-clamp-1">
                    &ldquo;{enq.message}&rdquo;
                  </p>
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-semibold mt-1">
                    <span>Seller: <strong className="text-foreground/80 font-bold">{enq.sellerName}</strong></span>
                    <span>{new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/80 rounded-xl min-h-[150px]">
                <span className="text-[10px] font-semibold text-muted-foreground">No recent enquiries.</span>
              </div>
            )}
          </div>
        </Card>

        {/* Column 2: Recent Wishlist */}
        <Card className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-black text-foreground">Recent Wishlist</h3>
            </div>
            <Link href="/wishlist" className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5">
              <span>All ({isMounted ? wishlist.length : 0})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {!isMounted ? (
              <div className="flex-1 flex items-center justify-center min-h-[150px]">
                <span className="text-[10px] font-semibold text-muted-foreground animate-pulse">Loading Wishlist...</span>
              </div>
            ) : recentWishlist.length > 0 ? (
              recentWishlist.map((prop) => (
                <div key={prop.id} className="p-3 border border-border/60 bg-background/30 rounded-xl flex items-center justify-between gap-4 hover:bg-background/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-10 w-14 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/65">
                      {prop.images?.[0] ? (
                        <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" sizes="56px" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[8px] text-muted-foreground">No Image</div>
                      )}
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-xs font-black text-foreground truncate leading-tight">{prop.title}</span>
                      <span className="text-[10px] text-primary font-bold mt-1">{formatPrice(prop.price)}</span>
                    </div>
                  </div>
                  <Link href={`/properties/${prop.id}`}>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary cursor-pointer">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/80 rounded-xl min-h-[150px]">
                <SearchSlash className="h-6 w-6 text-muted-foreground/60 mb-2" />
                <span className="text-[10px] font-semibold text-muted-foreground">Your wishlist is currently empty.</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions / Getting Started */}
      <Card className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl p-5 mt-2">
        <h3 className="text-sm font-black text-foreground mb-4">Quick Dashboard Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/properties" className="w-full">
            <Button variant="outline" className="w-full justify-center h-11 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <span>Search Properties</span>
            </Button>
          </Link>
          <Link href="/wishlist" className="w-full">
            <Button variant="outline" className="w-full justify-center h-11 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span>View Wishlist</span>
            </Button>
          </Link>
          <Link href="/seller" className="w-full">
            <Button variant="outline" className="w-full justify-center h-11 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-primary" />
              <span>Post Property (Seller)</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

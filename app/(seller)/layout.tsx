'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart2, 
  Building2, 
  PlusCircle, 
  Users, 
  TrendingUp, 
  UserCheck, 
  CreditCard, 
  Bell, 
  LogOut, 
  Menu,
  Plus
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toast';
import { sellerProfile } from '@/lib/mock-data/seller';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  // Dynamic breadcrumb generation
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    parts.forEach((part) => {
      currentPath += `/${part}`;
      
      let label = part.charAt(0).toUpperCase() + part.slice(1);
      if (part === 'seller') label = 'Seller';
      else if (part === 'properties') label = 'My Properties';
      else if (part === 'add') label = 'Add Property';
      else if (part === 'leads') label = 'Leads';
      else if (part === 'analytics') label = 'Analytics';
      else if (part === 'profile') label = 'Profile & KYC';
      else if (part === 'subscription') label = 'Subscription';
      else if (part === 'notifications') label = 'Notifications';
      
      crumbs.push({
        label,
        href: currentPath
      });
    });
    
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-indigo-50/10 to-slate-100 dark:from-slate-950 dark:via-indigo-950/5 dark:to-slate-900">
      {/* Desktop Sidebar (hidden on mobile/tablet) */}
      <aside className="hidden md:block w-[260px] shrink-0 h-screen sticky top-0 z-30">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Strip */}
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/80 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <div className="md:hidden">
              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger render={
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/80 cursor-pointer">
                    <Menu className="h-5 w-5 text-foreground" />
                  </Button>
                } />
                <SheetContent side="left" className="p-0 w-[260px] h-full border-r bg-card text-card-foreground">
                  <SheetTitle className="sr-only">Seller Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Access seller dashboard sections</SheetDescription>
                  <SidebarContent 
                    pathname={pathname} 
                    onLogout={handleLogout} 
                    onLinkClick={() => setIsMobileOpen(false)} 
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Breadcrumbs - Hidden on small mobile screens */}
            <nav className="hidden sm:flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider select-none">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.href + idx}>
                    {idx > 0 && <span className="text-muted-foreground/45 text-[8px]">&gt;</span>}
                    {isLast ? (
                      <span className="text-foreground font-black">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-primary transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="flex items-center gap-2.5">
            <Link href="/seller/notifications">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer relative">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-450 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
              </Button>
            </Link>

            <Link href="/seller/properties/add">
              <Button className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-1.5 h-9 text-xs">
                <Plus className="h-4 w-4" />
                <span>Post New Property</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto animate-in fade-in duration-300 flex flex-col gap-6">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}

interface SidebarContentProps {
  pathname: string;
  onLogout: (e: React.MouseEvent) => void;
  onLinkClick?: () => void;
}

function SidebarContent({ pathname, onLogout, onLinkClick }: SidebarContentProps) {
  const getPlanBadge = (plan: 'free' | 'basic' | 'pro') => {
    switch (plan) {
      case 'pro':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Pro Plan
          </span>
        );
      case 'basic':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Basic Plan
          </span>
        );
      case 'free':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            Free Plan
          </span>
        );
    }
  };

  const sidebarSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/seller/dashboard' },
        { label: 'Analytics', icon: BarChart2, href: '/seller/analytics' },
      ],
    },
    {
      title: 'LISTINGS',
      items: [
        { label: 'My Properties', icon: Building2, href: '/seller/properties' },
        { label: 'Add New Property', icon: PlusCircle, href: '/seller/properties/add' },
      ],
    },
    {
      title: 'LEADS',
      items: [
        { label: 'All Leads', icon: Users, href: '/seller/leads' },
        { label: 'Lead Analytics', icon: TrendingUp, href: '/seller/leads/analytics' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Profile & KYC', icon: UserCheck, href: '/seller/profile' },
        { label: 'Subscription Plan', icon: CreditCard, href: '/seller/subscription' },
        { label: 'Notifications', icon: Bell, href: '/seller/notifications' },
        { label: 'Logout', icon: LogOut, href: '#logout', isAction: true },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-card border-r border-border/40 w-full text-left">
      {/* Seller Header Info */}
      <div className="p-5 flex flex-col gap-4 border-b border-border/50">
        <Link href="/" onClick={onLinkClick} className="flex items-center gap-2 group transition-transform hover:scale-[1.01] duration-300">
          <Image 
            src="/estatex_logo.png" 
            alt="EstateX Logo" 
            width={32} 
            height={32} 
            className="h-8 w-8 object-contain rounded-lg shadow-xs"
          />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-primary leading-none">EstateX</span>
            <span className="text-[9px] font-black tracking-wider uppercase text-muted-foreground mt-0.5">Seller Hub</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-3 mt-1.5 p-2.5 rounded-2xl bg-muted/30 border border-border/20">
          <Avatar size="default" className="h-10 w-10 border border-border/80 ring-2 ring-primary/5">
            <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
              {sellerProfile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-foreground truncate">{sellerProfile.name}</span>
            <div className="flex items-center gap-1.5 mt-1">
              {getPlanBadge(sellerProfile.plan)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-4 flex flex-col gap-5 overflow-y-auto">
        {sidebarSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            <span className="text-[10px] font-black tracking-wider text-muted-foreground/60 px-3.5 mb-1.5 uppercase select-none">
              {section.title}
            </span>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (item.isAction) {
                  return (
                    <button
                      key={item.label}
                      onClick={onLogout}
                      className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onLinkClick}
                    className={`flex items-center gap-3 py-2.5 pr-4 pl-3.5 text-xs font-bold border-l-3 transition-all duration-250 ${
                      isActive
                        ? 'border-primary bg-primary/5 text-primary rounded-r-xl'
                        : 'border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

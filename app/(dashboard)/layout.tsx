'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, User, Search, MessageSquare, Heart, Bell, LogOut, Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    // UI-only mock logout, redirect to login
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-indigo-50/10 to-slate-100 dark:from-slate-950 dark:via-indigo-950/5 dark:to-slate-900">
      {/* Desktop Sidebar (hidden on mobile/tablet) */}
      <aside className="hidden md:block w-60 shrink-0 h-screen sticky top-0">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header (hidden on desktop) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border/80 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/85 cursor-pointer">
                  <Menu className="h-5 w-5 text-foreground" />
                </Button>
              } />
              <SheetContent side="left" className="p-0 w-60 h-full border-r">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Access dashboard sections</SheetDescription>
                <SidebarContent pathname={pathname} onLogout={handleLogout} onLinkClick={() => setIsMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-1.5">
              <Image 
                src="/estatex_logo.png" 
                alt="EstateX Logo" 
                width={28} 
                height={28} 
                className="h-7 w-7 object-contain"
              />
              <span className="text-sm font-black tracking-tight text-primary">EstateX</span>
            </Link>
          </div>

          <Link href="/profile">
            <Avatar size="sm" className="h-8 w-8 border border-border/80">
              <AvatarFallback className="bg-primary/10 text-primary font-black text-[10px]">PG</AvatarFallback>
            </Avatar>
          </Link>
        </header>

        {/* Dashboard Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto animate-in fade-in duration-300 flex flex-col gap-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex flex-wrap items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider select-none mb-1">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-muted-foreground/60">&gt;</span>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            {pathname !== '/dashboard' && (
              <>
                <span className="text-muted-foreground/60">&gt;</span>
                <span className="text-foreground">
                  {pathname === '/profile' 
                    ? 'My Profile' 
                    : pathname === '/saved-searches' 
                      ? 'Saved Searches' 
                      : pathname === '/enquiries' 
                        ? 'My Enquiries' 
                        : pathname === '/price-alerts' 
                          ? 'Price Drop Alerts' 
                          : pathname.replace('/', '').replace('-', ' ')}
                </span>
              </>
            )}
          </nav>
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}

interface SidebarContentProps {
  pathname: string;
  onLogout: () => void;
  onLinkClick?: () => void;
}

function SidebarContent({ pathname, onLogout, onLinkClick }: SidebarContentProps) {
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'My Profile', icon: User, href: '/profile' },
    { label: 'Saved Searches', icon: Search, href: '/saved-searches' },
    { label: 'My Enquiries', icon: MessageSquare, href: '/enquiries' },
    { label: 'My Wishlist', icon: Heart, href: '/wishlist' },
    { label: 'Price Drop Alerts', icon: Bell, href: '/price-alerts' },
  ];

  return (
    <div className="flex flex-col h-full bg-card border-r border-border/80 w-full text-left">
      {/* User Info Header */}
      <div className="p-6 flex flex-col gap-4 border-b border-border/60">
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02] duration-300">
          <Image 
            src="/estatex_logo.png" 
            alt="EstateX Logo" 
            width={32} 
            height={32} 
            className="h-8 w-8 object-contain rounded-lg shadow-xs"
          />
          <span className="text-lg font-black tracking-tight text-primary">EstateX</span>
        </Link>
        
        <div className="flex items-center gap-3 mt-2">
          <Avatar size="default" className="h-10 w-10 border border-border/80">
            <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">PG</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-foreground truncate">Prashant Gupta</span>
            <span className="text-[10px] text-muted-foreground font-semibold truncate mt-0.5">
              prashant@example.com
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-border/60">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start h-10 px-3.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer flex items-center gap-3"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}


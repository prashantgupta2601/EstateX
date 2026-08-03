'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  DollarSign, 
  ClipboardCheck, 
  Flag, 
  UserCheck, 
  Users, 
  Building2, 
  User, 
  CreditCard, 
  Bell, 
  Settings, 
  ScrollText, 
  ShieldCheck, 
  ExternalLink, 
  LogOut, 
  Menu, 
  ChevronRight,
  Shield
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toast';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const adminNavSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Revenue', href: '/admin/revenue', icon: DollarSign },
    ],
  },
  {
    title: 'MODERATION',
    items: [
      { label: 'Listing Approvals', href: '/admin/approvals', icon: ClipboardCheck },
      { label: 'Reported Content', href: '/admin/reports', icon: Flag },
      { label: 'Broker Verification', href: '/admin/verifications', icon: UserCheck },
    ],
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      { label: 'All Users', href: '/admin/users', icon: Users },
      { label: 'Sellers', href: '/admin/sellers', icon: Building2 },
      { label: 'Buyers', href: '/admin/buyers', icon: User },
    ],
  },
  {
    title: 'PLATFORM',
    items: [
      { label: 'Subscription Plans', href: '/admin/subscription-plans', icon: CreditCard },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
      { label: 'Site Settings', href: '/admin/settings', icon: Settings },
      { label: 'Activity Logs', href: '/admin/logs', icon: ScrollText },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If on login page, render without admin sidebar layout
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center">
        {children}
        <Toaster />
      </div>
    );
  }

  const handleLogout = () => {
    // Clear admin session cookie
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  // Generate dynamic breadcrumbs
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Admin', href: '/admin/dashboard' }];
    
    let currentPath = '';
    parts.forEach((part) => {
      if (part === 'admin') return;
      currentPath += `/admin/${part}`;

      let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
      if (part === 'dashboard') label = 'Dashboard';
      else if (part === 'approvals') label = 'Listing Approvals';
      else if (part === 'reports') label = 'Reported Content';
      else if (part === 'verifications') label = 'Broker Verification';
      else if (part === 'subscription-plans') label = 'Subscription Plans';
      else if (part === 'logs') label = 'Activity Logs';

      crumbs.push({ label, href: currentPath });
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 font-sans">
      {/* Desktop Sidebar (280px, Dark slate-900 variant) */}
      <aside className="hidden lg:block w-[280px] shrink-0 h-screen sticky top-0 z-30 bg-slate-900 border-r border-slate-800 flex flex-col">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 lg:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Menu Trigger */}
            <div className="lg:hidden">
              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger render={
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-slate-800 text-slate-200 hover:bg-slate-800 cursor-pointer">
                    <Menu className="h-5 w-5" />
                  </Button>
                } />
                <SheetContent side="left" className="p-0 w-[280px] h-full border-r border-slate-800 bg-slate-900 text-slate-100">
                  <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Access admin control sections</SheetDescription>
                  <SidebarContent 
                    pathname={pathname} 
                    onLogout={handleLogout} 
                    onLinkClick={() => setIsMobileOpen(false)} 
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.href + idx}>
                    {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />}
                    {isLast ? (
                      <span className="text-slate-100 font-bold">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-amber-400 transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* View Live Site Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700/60 shadow-xs cursor-pointer"
            >
              <span>View Live Site</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>

            {/* Admin Avatar & Dropdown */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Avatar className="h-8 w-8 border border-amber-500/40 bg-amber-500/10">
                <AvatarFallback className="bg-amber-500/20 text-amber-400 text-xs font-black">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-slate-200">System Admin</span>
                <span className="text-[10px] text-amber-400 font-medium">Superuser</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
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
  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      
      {/* Sidebar Header: "EstateHub Admin" + Shield Icon */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-md">
          <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
            EstateHub <span className="text-amber-400">Admin</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Control Center
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {adminNavSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1.5">
            <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              {section.title}
            </span>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onLinkClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer: Logout Button */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer border border-rose-500/20"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="h-4 w-4" />
            <span>Sign Out Admin</span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase font-mono">v2.4</span>
        </button>
      </div>

    </div>
  );
}

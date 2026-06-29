'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Navbar() {
  const navLinks = [
    { label: 'Buy', href: '/properties' },
    { label: 'Rent', href: '/properties' },
    { label: 'Commercial', href: '/properties' },
    { label: 'Compare', href: '/compare' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'EMI Calculator', href: '/emi-calculator' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-xs">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/estatex_logo.png" 
            alt="EstateX Logo" 
            width={32} 
            height={32} 
            className="h-8 w-8 object-contain rounded"
          />
          <span className="text-xl font-bold tracking-tight text-primary">EstateX</span>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="hover:text-primary hover:underline underline-offset-4 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side: Desktop CTAs & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Desktop Authentication buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm">Login</Button>
            <Button size="sm">Sign Up</Button>
          </div>

          {/* Mobile Sheet/Hamburger Navigation */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                }
              />
              <SheetContent side="right" className="p-6">
                <SheetHeader className="text-left border-b pb-4 mb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <Image 
                      src="/estatex_logo.png" 
                      alt="EstateX Logo" 
                      width={28} 
                      height={28} 
                      className="h-7 w-7 object-contain rounded"
                    />
                    <span className="text-lg font-bold tracking-tight text-primary">EstateX</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 text-base font-semibold text-muted-foreground mt-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.label} 
                      href={link.href} 
                      className="hover:text-primary transition-colors py-2 border-b border-border/40"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 mt-6">
                    <Button variant="outline" className="w-full">Login</Button>
                    <Button className="w-full">Sign Up</Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </header>
  );
}

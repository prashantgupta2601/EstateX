'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Heart, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useComparison } from '@/lib/hooks/use-comparison';
import { useWishlist } from '@/lib/hooks/use-wishlist';
import { useAccessibility } from '@/components/providers/accessibility-provider';

export default function Navbar() {
  const { comparison, isMounted } = useComparison();
  const { wishlist } = useWishlist();
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAccessibilityMode, toggleAccessibilityMode } = useAccessibility();

  const navLinks = [
    { label: 'Buy', href: '/properties?purpose=buy' },
    { label: 'Rent', href: '/properties?purpose=rent' },
    { label: 'Commercial', href: '/properties?purpose=commercial' },
    { 
      label: isMounted && comparison.length > 0 ? `Compare (${comparison.length})` : 'Compare', 
      href: '/compare' 
    },
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
              key={link.href} 
              href={link.href} 
              className="hover:text-primary hover:underline underline-offset-4 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side: Desktop CTAs & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Wishlist Heart Icon with Count Badge */}
          <Link 
            href="/wishlist" 
            className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {isMounted && wishlist.length > 0 && (
              <span className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-background">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Accessibility Toggle Button */}
          <button
            onClick={toggleAccessibilityMode}
            className={`p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary ${
              isAccessibilityMode ? 'text-primary bg-primary/10' : ''
            }`}
            aria-label="Toggle accessibility mode"
            title="Toggle Accessibility Mode"
          >
            <Accessibility className="h-5 w-5" />
          </button>

          {/* Desktop Authentication buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>

          {/* Mobile Sheet/Hamburger Navigation */}
          <div className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="hover:text-primary transition-colors py-2 border-b border-border/40"
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  {/* Mobile Wishlist link row with Pill Badge */}
                  <Link 
                    href="/wishlist" 
                    onClick={() => setIsOpen(false)}
                    className="hover:text-primary transition-colors py-2 border-b border-border/40 flex items-center justify-between"
                  >
                    <span>Wishlist</span>
                    {isMounted && wishlist.length > 0 && (
                      <span className="bg-red-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>

                  {/* Mobile Accessibility Toggle Row */}
                  <button
                    onClick={() => {
                      toggleAccessibilityMode();
                      setIsOpen(false);
                    }}
                    className="hover:text-primary transition-colors py-2 border-b border-border/40 flex items-center justify-between text-left font-semibold text-base text-muted-foreground w-full cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span>Accessibility Mode</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                      isAccessibilityMode ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {isAccessibilityMode ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <div className="flex flex-col gap-2 mt-6">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
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

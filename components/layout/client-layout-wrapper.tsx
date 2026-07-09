'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import Footer from './footer';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();

  // Define paths where the public Navbar and Footer should NOT be rendered
  const hideLayout = 
    pathname.startsWith('/seller') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/enquiries') ||
    pathname.startsWith('/price-alerts') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/saved-searches') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/verify-otp');

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

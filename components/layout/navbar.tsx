import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-background px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
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
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/search" className="hover:text-primary transition-colors">Search</Link>
          <Link href="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link>
          <Link href="/compare" className="hover:text-primary transition-colors">Compare</Link>
        </div>
      </div>
    </nav>
  );
}

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
      href: '#',
      label: 'Facebook',
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: '#',
      label: 'Twitter',
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      href: '#',
      label: 'Instagram',
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      ),
      href: '#',
      label: 'LinkedIn',
    },
  ];

  const quickLinks = [
    { label: 'About Us', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Latest News', href: '#' },
  ];

  const buyerLinks = [
    { label: 'Buy Properties', href: '/properties' },
    { label: 'Rent Properties', href: '/properties' },
    { label: 'Commercial Buildings', href: '/properties' },
    { label: 'Wishlist Catalog', href: '/wishlist' },
    { label: 'EMI Calculator', href: '/emi-calculator' },
  ];

  const sellerLinks = [
    { label: 'List Your Property', href: '#' },
    { label: 'Pricing Plans', href: '#' },
    { label: 'Agent Center', href: '#' },
    { label: 'Seller Resources', href: '#' },
  ];

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Top section: 4 columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & Tagline & Socials */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/estatex_logo.png" 
                alt="EstateX Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8 object-contain rounded brightness-125"
              />
              <span className="text-xl font-bold tracking-tight text-white">EstateX</span>
            </Link>
            <p className="text-sm text-slate-400">
              Discover, compare, and secure your dream property with the most comprehensive real estate platform.
            </p>
            <div className="flex gap-4 mt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="hover:text-primary transition-colors text-slate-400 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Company</h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Buyers */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white">For Buyers</h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              {buyerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: For Sellers */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white">For Sellers</h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              {sellerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Legal Links */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} EstateX. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:underline hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:underline hover:text-slate-400">Cookie Preferences</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

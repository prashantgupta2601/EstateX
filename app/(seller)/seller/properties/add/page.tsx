'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, IndianRupee, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/seller/properties');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Add New Property</h1>
        <p className="text-sm text-muted-foreground mt-0.5">List a new property for sale or rent on EstateX</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="rounded-2xl border-border/40 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Property Details</CardTitle>
              <CardDescription>Enter the basic details of your property listing</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Property Title</label>
                <Input placeholder="e.g. Premium 3 BHK Apartment in DLF Phase 5" required className="rounded-xl h-10 border-border/80" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Description</label>
                <textarea 
                  placeholder="Describe your property including key features, landmarks, and highlights..." 
                  required 
                  rows={4}
                  className="w-full text-xs bg-transparent border border-border/80 rounded-xl p-3 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Listing Type</label>
                  <select className="h-10 text-xs border border-border/80 rounded-xl px-3 bg-transparent">
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Property Category</label>
                  <select className="h-10 text-xs border border-border/80 rounded-xl px-3 bg-transparent">
                    <option value="apartment">Apartment / Flat</option>
                    <option value="house">Independent Villa / House</option>
                    <option value="plot">Plot / Land</option>
                    <option value="office">Commercial Office Space</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Location */}
          <Card className="rounded-2xl border-border/40 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Pricing & Location</CardTitle>
              <CardDescription>Specify the listing price and property address details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Price (in INR)</label>
                  <div className="relative">
                    <Input type="number" placeholder="e.g. 15000000" required className="rounded-xl h-10 pl-9 border-border/80" />
                    <span className="absolute left-3.5 top-2.5 text-muted-foreground text-xs"><IndianRupee className="h-4 w-4" /></span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Super Area (sqft)</label>
                  <Input type="number" placeholder="e.g. 1850" required className="rounded-xl h-10 border-border/80" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Street Address</label>
                <div className="relative">
                  <Input placeholder="e.g. Golf Course Road" required className="rounded-xl h-10 pl-9 border-border/80" />
                  <span className="absolute left-3.5 top-3 text-muted-foreground text-xs"><MapPin className="h-4 w-4" /></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">City</label>
                  <Input placeholder="e.g. Gurugram" required className="rounded-xl h-10 border-border/80" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">State</label>
                  <Input placeholder="e.g. Haryana" required className="rounded-xl h-10 border-border/80" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media & Specs Side Cards */}
        <div className="flex flex-col gap-6">
          {/* Specifications */}
          <Card className="rounded-2xl border-border/40 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Bedrooms (BHK)</label>
                <select className="h-10 text-xs border border-border/80 rounded-xl px-3 bg-transparent">
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3" selected>3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Bathrooms</label>
                <Input type="number" placeholder="e.g. 3" defaultValue={3} className="rounded-xl h-10 border-border/80" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Furnishing Status</label>
                <select className="h-10 text-xs border border-border/80 rounded-xl px-3 bg-transparent">
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished" selected>Semi-Furnished</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload (Mock) */}
          <Card className="rounded-2xl border-border/40 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Property Photos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="border border-dashed border-border/80 rounded-2xl py-8 px-4 flex flex-col items-center justify-center text-center cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-foreground">Drag & Drop Photos</span>
                <span className="text-[10px] text-muted-foreground mt-1 max-w-[180px]">
                  Supports JPG, PNG up to 5MB (Max 10 files)
                </span>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="w-full rounded-xl bg-primary text-primary-foreground font-bold h-11 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer">
            {loading ? 'Publishing Listing...' : 'Publish Property Listing'}
          </Button>
        </div>
      </form>
    </div>
  );
}

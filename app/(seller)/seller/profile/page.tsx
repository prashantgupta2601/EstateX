'use client';

import React from 'react';
import { UserCheck, ShieldCheck, Mail, Phone, Calendar, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { sellerProfile } from '@/lib/mock-data/seller';

export default function SellerProfilePage() {
  const initials = sellerProfile.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Profile & KYC</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your seller profile and check verification credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="rounded-2xl border-border/40 shadow-xs lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <Avatar size="lg" className="h-16 w-16 border border-border/80">
              <AvatarFallback className="bg-primary/10 text-primary font-black text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">{sellerProfile.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{sellerProfile.plan} Seller</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
                <Mail className="h-4.5 w-4.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Email</span>
                  <span className="text-xs font-bold text-foreground">{sellerProfile.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
                <Phone className="h-4.5 w-4.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Phone</span>
                  <span className="text-xs font-bold text-foreground">{sellerProfile.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
                <Calendar className="h-4.5 w-4.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Joined Date</span>
                  <span className="text-xs font-bold text-foreground">{sellerProfile.joinedDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
                <Building2 className="h-4.5 w-4.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Active listings</span>
                  <span className="text-xs font-bold text-foreground">{sellerProfile.activeListings} / {sellerProfile.totalListings} Listings</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <Button variant="outline" className="rounded-xl text-xs font-bold cursor-pointer h-9.5">
                Change Password
              </Button>
              <Button className="rounded-xl text-xs font-bold cursor-pointer h-9.5">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KYC Verification Card */}
        <Card className="rounded-2xl border-border/40 shadow-xs flex flex-col justify-between">
          <div>
            <CardHeader pb-4>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-5 w-5 text-success-foreground" />
                Verification & trust
              </CardTitle>
              <CardDescription>Security status and background validation logs</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs font-medium">
              <div className="flex items-center justify-between py-2 border-b border-border/45">
                <span className="text-muted-foreground">Verification Badge</span>
                <span className="text-success-foreground font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/45">
                <span className="text-muted-foreground">KYC Status</span>
                <span className="text-success-foreground font-bold">Verified</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/45">
                <span className="text-muted-foreground">Document Type</span>
                <span className="text-foreground font-bold">Aadhaar + PAN</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                Your verified badge is displayed next to all your listings. This increases buyer trust and search visibility by up to 40%.
              </p>
            </CardContent>
          </div>
          
          <div className="p-6 border-t border-border/40">
            <Button variant="outline" disabled className="w-full rounded-xl text-xs font-bold h-9.5 flex items-center justify-center gap-1.5">
              <UserCheck className="h-4 w-4 text-success-foreground" />
              <span>KYC Approved</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

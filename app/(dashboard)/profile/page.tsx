'use client';

import React, { useState, useRef } from 'react';
import { Camera, User, Mail, Phone, MapPin, FileText, Check, ShieldCheck, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import DatePicker from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { mockCities } from '@/lib/mock-data/cities';

export default function ProfilePage() {
  // Form State
  const [fullName, setFullName] = useState('Prashant Gupta');
  const [email] = useState('prashant@example.com'); // Disabled/Non-editable
  const [phone, setPhone] = useState('+91 9876543210');
  const [dob, setDob] = useState<string | null>('1998-05-24');
  const [city, setCity] = useState('New Delhi');
  const [bio, setBio] = useState('A real estate enthusiast looking to invest in modern residential spaces and premium apartments across Metro Cities.');

  // Avatar Upload State
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast('Avatar updated successfully!');
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast('Name is required', 'error');
      return;
    }
    console.log('Saved profile details:', { fullName, email, phone, dob, city, bio });
    toast('Profile updated successfully');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setDialogError('All fields are required');
      return;
    }

    if (newPassword.length < 8) {
      setDialogError('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setDialogError('New password and confirm password do not match');
      return;
    }

    setDialogError(null);
    console.log('Password updated successfully');
    toast('Password changed successfully');
    
    // Reset state & close dialog
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPass(false);
    setShowNewPass(false);
    setShowConfirmPass(false);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground">My Profile</h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Update your personal details and manage account preferences.
        </p>
      </div>

      {/* Main Profile Info Card */}
      <Card className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleProfileSubmit} className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Left side: Avatar Upload Area */}
            <div className="flex flex-col items-center gap-3 w-full md:w-44 select-none">
              <div 
                onClick={handleAvatarClick}
                className="group relative w-28 h-28 rounded-full border-2 border-border/80 bg-muted hover:border-primary/50 transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center overflow-hidden"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-primary/80 select-none">
                    {fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-300 text-white text-[10px] font-black">
                  <Camera className="h-5 w-5" />
                  <span>CHANGE</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground font-semibold">
                  PNG or JPG up to 5MB.
                </span>
              </div>
            </div>

            {/* Right side: Fields Input Grid */}
            <div className="flex-1 w-full flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fullName" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      className="pl-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background border-border/80"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">
                    Email Address (Non-Editable)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      placeholder="name@example.com"
                      className="pl-10 h-11 rounded-xl bg-muted/30 border-border/60 text-muted-foreground/60 cursor-not-allowed opacity-80"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Phone Number
                    </label>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-bold py-0.5 px-2 rounded-full flex items-center gap-1 shrink-0 h-4 leading-none">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                      Verified
                    </Badge>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="pl-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background border-border/80"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Date of Birth
                  </label>
                  <DatePicker 
                    value={dob} 
                    onChange={setDob} 
                    placeholder="Select Date of Birth" 
                  />
                </div>

                {/* City Selection */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    City
                  </label>
                  <Select value={city} onValueChange={(val) => setCity(val || '')}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-background/50 focus-visible:bg-background border-border/80 flex items-center justify-between px-3.5">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCities.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          <span className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            {c.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bio Description */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="bio" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Short Bio
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/70" />
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a brief intro..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 focus-visible:bg-background border border-border/80 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground resize-none h-28"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Profile Form Button */}
              <div className="flex justify-end mt-2">
                <Button 
                  type="submit" 
                  className="h-11 rounded-xl px-6 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md cursor-pointer text-sm"
                >
                  Save Changes
                </Button>
              </div>

            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Security Section */}
      <Card className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm">
        <CardHeader className="p-6 md:p-8 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-sm font-black text-foreground uppercase tracking-wider">Account Security</CardTitle>
              <CardDescription className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Update account security options and password configurations.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1 max-w-md">
            <span className="text-xs font-black text-foreground">Password Management</span>
            <span className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
              We recommend changing your password periodically to protect your personal comparisons, bookings, and wishlist.
            </span>
          </div>

          {/* Change Password Dialog Trigger & Modal */}
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              // Reset error when dialog closes
              setDialogError(null);
            }
          }}>
            <DialogTrigger render={
              <Button 
                variant="outline"
                className="h-11 rounded-xl px-5 border-border/80 bg-background/50 hover:bg-muted font-bold text-xs cursor-pointer flex items-center gap-2 shrink-0"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Change Password</span>
              </Button>
            } />

            <DialogContent className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-2xl">
              <DialogHeader className="flex flex-col gap-1.5">
                <DialogTitle className="text-lg font-black text-foreground">Change Password</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-semibold">
                  Enter your current password and your new password to update security details.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleChangePasswordSubmit} className="flex flex-col gap-4 mt-2">
                {/* Current Password */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="currentPassword" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background border-border/80"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="newPassword" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <Input
                      id="newPassword"
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background border-border/80"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 rounded-xl bg-background/50 focus-visible:bg-background border-border/80"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {dialogError && (
                  <p className="text-[10px] text-destructive font-semibold flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{dialogError}</span>
                  </p>
                )}

                {/* Footer Buttons */}
                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                  <DialogClose render={
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-11 rounded-xl text-xs font-bold border-border/85 bg-background hover:bg-muted cursor-pointer flex-1"
                    >
                      Cancel
                    </Button>
                  } />
                  <Button 
                    type="submit" 
                    className="h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md cursor-pointer text-xs flex-1"
                  >
                    Update Password
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

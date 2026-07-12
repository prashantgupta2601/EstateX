'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  IndianRupee, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Upload, 
  Sparkles, 
  Star, 
  Info,
  CheckCircle,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { mockSellerListings, SellerListing } from '@/lib/mock-data/seller-listings';
import PropertyLocationPickerWrapper from '@/components/property/property-location-picker-wrapper';

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [category, setCategory] = useState('apartment');
  const [price, setPrice] = useState('');
  const [superArea, setSuperArea] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [state, setState] = useState('Haryana');
  
  // Specs states
  const [bhk, setBhk] = useState('3');
  const [bathrooms, setBathrooms] = useState(3);
  const [furnishing, setFurnishing] = useState('Semi-Furnished');

  // Location Picker States
  const [lat, setLat] = useState(28.4595); // Default Gurugram center
  const [lng, setLng] = useState(77.0266);

  // Amenities Option checklist
  const amenitiesList = [
    { label: 'Parking', value: 'parking' },
    { label: 'Lift', value: 'lift' },
    { label: 'Power Backup', value: 'power-backup' },
    { label: 'Gym', value: 'gym' },
    { label: 'Swimming Pool', value: 'swimming-pool' },
    { label: 'Security (24x7)', value: 'security' },
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['parking', 'security']);

  // Media states
  const [images, setImages] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState<number>(0);
  const [dragOver, setDragOver] = useState(false);

  // Toggle amenities
  const handleToggleAmenity = (val: string) => {
    setSelectedAmenities(prev => 
      prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]
    );
  };

  // Handle Photo Upload (Simulated with URL.createObjectURL or default placeholders)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      processFiles(filesArray);
    }
  };

  const processFiles = (files: File[]) => {
    // Limits: Max 10 files, size < 5MB
    const validFiles: string[] = [];
    let hasError = false;

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast(`File "${file.name}" is too large (max 5MB)`, 'error');
        hasError = true;
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast(`File "${file.name}" is not an image`, 'error');
        hasError = true;
        return;
      }
      
      // Use FileReader to read file as DataURL (base64) so it persists in localStorage!
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => {
            if (prev.length >= 10) {
              if (!hasError) toast('Maximum 10 photos allowed', 'error');
              hasError = true;
              return prev;
            }
            return [...prev, reader.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages(prev => prev.filter((_, i) => i !== idx));
    if (coverIndex === idx) {
      setCoverIndex(0);
    } else if (coverIndex > idx) {
      setCoverIndex(prev => prev - 1);
    }
  };

  const setCoverPhoto = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverIndex(idx);
    toast('Cover photo updated!', 'success');
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast('Please enter a property title', 'error');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      toast('Please enter a valid price', 'error');
      return;
    }
    if (!superArea || parseFloat(superArea) <= 0) {
      toast('Please enter a valid super area', 'error');
      return;
    }

    setLoading(true);

    // Arrange images so the cover photo is the first image in the array
    let sortedImages = [...images];
    if (sortedImages.length > 0 && coverIndex !== 0) {
      const coverImg = sortedImages[coverIndex];
      sortedImages = sortedImages.filter((_, i) => i !== coverIndex);
      sortedImages.unshift(coverImg);
    }

    // Fallback images if user didn't upload any
    const finalImages = sortedImages.length > 0 
      ? sortedImages 
      : [`https://placehold.co/800x600/1e293b/ffffff?text=${encodeURIComponent(category.toUpperCase() + ' ' + city)}`];

    // Create property listing object
    const newListing: SellerListing = {
      id: 's-prop-' + Date.now(),
      title,
      price: parseFloat(price),
      type: listingType,
      bhk: parseInt(bhk),
      city,
      status: 'pending', // Starts as pending moderator review
      views: 0,
      leads: 0,
      postedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 180)).toISOString().split('T')[0], // 6 months from now
      isFeatured: false,
      images: finalImages,
    };

    // Simulate database write
    setTimeout(() => {
      try {
        const stored = localStorage.getItem('estatex_seller_listings');
        const currentListings = stored ? JSON.parse(stored) : mockSellerListings;
        
        // Add to the top of listings
        localStorage.setItem('estatex_seller_listings', JSON.stringify([newListing, ...currentListings]));
        
        // Increment total listings counts in local storage or simulated sellerProfile
        const storedProfile = localStorage.getItem('estatex_seller_profile');
        const profile = storedProfile ? JSON.parse(storedProfile) : null;
        if (profile) {
          profile.totalListings = (profile.totalListings || 12) + 1;
          localStorage.setItem('estatex_seller_profile', JSON.stringify(profile));
        }

        setLoading(false);
        setShowSuccessDialog(true);
      } catch (err) {
        console.error(err);
        toast('Failed to save listing. Storage quota exceeded.', 'error');
        setLoading(false);
      }
    }, 1500);
  };

  const handleLocationChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  // Price formatting helper for Real-time Card Preview
  const formatPrice = (pStr: string) => {
    const val = parseFloat(pStr);
    if (isNaN(val)) return '₹0';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Add New Property</h1>
        <p className="text-sm text-muted-foreground mt-0.5">List a new property for sale or rent on EstateX</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Form (Col 1 & 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Property Details */}
          <Card className="rounded-2xl border-border/40 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Property Details</CardTitle>
              <CardDescription>Enter the basic details of your property listing</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Property Title</label>
                <Input 
                  placeholder="e.g. Premium 3 BHK Apartment in DLF Phase 5" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                  className="rounded-xl h-10 border-border/80" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Description</label>
                <textarea 
                  placeholder="Describe your property including key features, landmarks, and highlights..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required 
                  rows={4}
                  className="w-full text-xs bg-transparent border border-border/80 rounded-xl p-3 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus:border-primary/80"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Listing Type</label>
                  <select 
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as 'sale' | 'rent')}
                    className="h-10 text-xs border border-border/80 rounded-xl px-3 bg-card text-foreground"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Property Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 text-xs border border-border/80 rounded-xl px-3 bg-card text-foreground"
                  >
                    <option value="apartment">Apartment / Flat</option>
                    <option value="house">Independent Villa / House</option>
                    <option value="plot">Plot / Land</option>
                    <option value="office">Commercial Office Space</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Specifications */}
          <Card className="rounded-2xl border-border/40 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Pricing & Specifications</CardTitle>
              <CardDescription>Specify the listing price, size, and layout properties</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Price (in INR)</label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="e.g. 15000000" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required 
                      className="rounded-xl h-10 pl-9 border-border/80" 
                    />
                    <span className="absolute left-3.5 top-2.5 text-muted-foreground text-xs"><IndianRupee className="h-4 w-4" /></span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Super Area (sqft)</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 1850" 
                    value={superArea}
                    onChange={(e) => setSuperArea(e.target.value)}
                    required 
                    className="rounded-xl h-10 border-border/80" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Bedrooms (BHK)</label>
                  <select 
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="h-10 text-xs border border-border/80 rounded-xl px-3 bg-card text-foreground"
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Bathrooms</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 3" 
                    value={bathrooms}
                    onChange={(e) => setBathrooms(parseInt(e.target.value) || 0)}
                    className="rounded-xl h-10 border-border/80" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Furnishing Status</label>
                  <select 
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value)}
                    className="h-10 text-xs border border-border/80 rounded-xl px-3 bg-card text-foreground"
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                  </select>
                </div>
              </div>

              {/* Amenities Checkbox Group */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs font-bold text-foreground">Amenities Available</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {amenitiesList.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity.value);
                    return (
                      <button
                        key={amenity.value}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity.value)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-primary/5 border-primary text-primary font-bold shadow-xs' 
                            : 'bg-card border-border/80 hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all ${
                          isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-border/80 bg-background'
                        }`}>
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span>{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location details */}
          <Card className="rounded-2xl border-border/40 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Property Location & Map Coordinates</CardTitle>
              <CardDescription>Enter the address and fine-tune your map coordinate coordinates</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Street Address</label>
                <div className="relative">
                  <Input 
                    placeholder="e.g. Near DLF Galleria, Golf Course Road" 
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required 
                    className="rounded-xl h-10 pl-9 border-border/80" 
                  />
                  <span className="absolute left-3.5 top-3 text-muted-foreground text-xs"><MapPin className="h-4 w-4" /></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-10 text-xs border border-border/80 rounded-xl px-3 bg-card text-foreground"
                  >
                    <option value="Gurugram">Gurugram</option>
                    <option value="Noida">Noida</option>
                    <option value="New Delhi">New Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">State</label>
                  <Input 
                    placeholder="e.g. Haryana" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required 
                    className="rounded-xl h-10 border-border/80" 
                  />
                </div>
              </div>

              {/* Dynamic Leaflet Map Picker Component */}
              <div className="border border-border/50 rounded-2xl p-4 bg-muted/10 mt-2">
                <PropertyLocationPickerWrapper 
                  lat={lat} 
                  lng={lng} 
                  city={city} 
                  onChange={handleLocationChange} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media & Sidebar Preview (Col 3) */}
        <div className="flex flex-col gap-6">
          
          {/* Photos Uploader Card */}
          <Card className="rounded-2xl border-border/40 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Property Photos</CardTitle>
              <CardDescription className="text-xs">Drag and drop images, set a cover photo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              
              {/* Drag/Drop Dropzone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('photo-upload-input')?.click()}
                className={`border border-dashed rounded-2xl py-8 px-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragOver 
                    ? 'border-primary bg-primary/5 scale-[0.99]' 
                    : 'border-border/85 bg-muted/10 hover:bg-muted/20'
                }`}
              >
                <input 
                  type="file" 
                  id="photo-upload-input" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoChange} 
                />
                
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                  <Upload className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-foreground">Drag & Drop Photos</span>
                <span className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">
                  Supports JPG, PNG up to 5MB (Max 10 files) or click to browse.
                </span>
              </div>

              {/* Image previews grid */}
              {images.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    Uploaded Photos ({images.length}/10)
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => {
                      const isCover = coverIndex === idx;
                      return (
                        <div 
                          key={idx} 
                          className="relative aspect-square rounded-xl overflow-hidden border border-border/50 group bg-slate-100 dark:bg-slate-800"
                        >
                          <img 
                            src={img} 
                            alt={`Preview ${idx + 1}`} 
                            className="h-full w-full object-cover"
                          />
                          
                          {/* Image controls overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                            <button
                              type="button"
                              onClick={(e) => setCoverPhoto(idx, e)}
                              title="Set as Cover Photo"
                              className={`p-1.5 rounded-lg transition-transform hover:scale-105 cursor-pointer ${
                                isCover ? 'bg-amber-500 text-white' : 'bg-background/80 text-muted-foreground hover:text-amber-500'
                              }`}
                            >
                              <Star className="h-3.5 w-3.5 fill-current" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => removeImage(idx, e)}
                              title="Delete Photo"
                              className="p-1.5 rounded-lg bg-red-650 hover:bg-red-700 text-white transition-transform hover:scale-105 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Cover Photo indicator badge */}
                          {isCover && (
                            <div className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                              <Check className="h-2 w-2 stroke-[4]" />
                              <span>Cover</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Listing Card Preview */}
          <Card className="rounded-2xl border-border/40 shadow-xs bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden">
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-primary" />
                Live Preview
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-500/20">
                Draft
              </span>
            </div>
            
            {/* Mock Property Card */}
            <div className="p-4 flex flex-col gap-3">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted/40 relative border border-border/20">
                {images.length > 0 ? (
                  <img 
                    src={images[coverIndex] || images[0]} 
                    alt="Property Preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted/10 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-40 animate-pulse" />
                  </div>
                )}
                
                {/* Type Badge */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[9px] font-black uppercase bg-primary text-primary-foreground rounded-full shadow-xs">
                  For {listingType === 'sale' ? 'Sale' : 'Rent'}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <span className="text-base font-extrabold text-foreground tracking-tight line-clamp-1">
                  {title.trim() || 'Property Listing Title'}
                </span>
                
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                  <span className="truncate">{streetAddress ? `${streetAddress}, ${city}` : `${city}, India`}</span>
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-xs font-bold text-foreground">
                  <span>{bhk} BHK</span>
                  <span className="h-3 w-px bg-border"></span>
                  <span>{superArea ? `${superArea} sqft` : '-- sqft'}</span>
                  <span className="h-3 w-px bg-border"></span>
                  <span>{furnishing}</span>
                </div>

                <div className="flex items-center justify-between border-t border-border/40 mt-3 pt-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Asking Price</span>
                    <span className="text-base font-black text-primary leading-tight">
                      {price ? formatPrice(price) : '₹0'}
                    </span>
                  </div>
                  
                  {/* Map Pin confirmation icon */}
                  <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground bg-muted/30 border border-border/20 px-2 py-1 rounded-lg">
                    <MapPin className="h-3 w-3 text-emerald-500 animate-bounce" />
                    <span>Geo pinned</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action publishing button */}
          <div className="flex flex-col gap-3">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full rounded-xl bg-primary text-primary-foreground font-bold h-11 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 fill-current" />
                  <span>Publish Property Listing</span>
                </>
              )}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
              <Info className="h-3 w-3 shrink-0" />
              Listing will be marked 'Pending' until moderator approval.
            </p>
          </div>
        </div>
      </form>

      {/* Success Dialog Modal */}
      {showSuccessDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-300">
          <Card className="max-w-md w-full rounded-2xl border-border/30 shadow-2xl p-6 flex flex-col items-center justify-center text-center gap-5 bg-card text-card-foreground transform scale-100 transition-all">
            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 animate-bounce">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">Property Listed Successfully!</h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                "{title}" has been submitted and is currently pending moderator review. It should be active within 24 hours.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2">
              <Button 
                onClick={() => {
                  setShowSuccessDialog(false);
                  router.push('/listings');
                }} 
                className="w-full rounded-xl bg-primary text-primary-foreground font-semibold h-10 hover:scale-[1.01] transition-all cursor-pointer"
              >
                Go to My Properties
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSuccessDialog(false);
                  // Reset states for a new upload
                  setTitle('');
                  setDescription('');
                  setPrice('');
                  setSuperArea('');
                  setStreetAddress('');
                  setImages([]);
                  setCoverIndex(0);
                  setSelectedAmenities(['parking', 'security']);
                }} 
                className="w-full rounded-xl border-border/80 text-muted-foreground hover:text-foreground font-semibold h-10 cursor-pointer"
              >
                Upload Another Property
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

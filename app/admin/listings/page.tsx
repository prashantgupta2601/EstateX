'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  mockPendingListings, 
  PendingListing 
} from '@/lib/mock-data/pending-listings';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Check, 
  X, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Sparkles, 
  Filter, 
  Search, 
  CheckSquare, 
  Square, 
  User, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Send
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose 
} from '@/components/ui/sheet';
import { toast } from '@/components/ui/toast';

const PREDEFINED_REJECTION_REASONS = [
  'Incorrect information',
  'Duplicate listing',
  'Inappropriate content',
  'Suspicious pricing',
  'Missing required details',
  'Other',
];

export default function ListingModerationPage() {
  const [listings, setListings] = useState<PendingListing[]>(mockPendingListings);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'flagged'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  
  // Preview modal state
  const [previewListing, setPreviewListing] = useState<PendingListing | null>(null);
  const [activePreviewImageIndex, setActivePreviewImageIndex] = useState(0);

  // Reject dialog state
  const [rejectingListing, setRejectingListing] = useState<PendingListing | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [rejectionNotes, setRejectionNotes] = useState('');

  // Daily stats state
  const [stats, setStats] = useState({
    approvedToday: 28,
    rejectedToday: 4,
    avgReviewTime: '14 mins',
  });

  // Price formatter (e.g., 28500000 -> ₹2.85 Cr, 9200000 -> ₹92.00 L)
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Filter listings based on active tab and search query
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Tab matching
      let tabMatch = false;
      if (activeTab === 'pending') tabMatch = item.status === 'pending';
      else if (activeTab === 'approved') tabMatch = item.status === 'approved';
      else if (activeTab === 'rejected') tabMatch = item.status === 'rejected';
      else if (activeTab === 'flagged') tabMatch = Boolean(item.flagReason);

      if (!tabMatch) return false;

      // Search matching
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.locality.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.sellerName.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    });
  }, [listings, activeTab, searchQuery]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      pending: listings.filter((l) => l.status === 'pending').length,
      approved: listings.filter((l) => l.status === 'approved').length,
      rejected: listings.filter((l) => l.status === 'rejected').length,
      flagged: listings.filter((l) => Boolean(l.flagReason)).length,
    };
  }, [listings]);

  // Selection helpers
  const isSelected = (id: string) => selectedListingIds.includes(id);

  const toggleSelect = (id: string) => {
    setSelectedListingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const pendingListingsFiltered = useMemo(() => {
    return filteredListings.filter((l) => l.status === 'pending');
  }, [filteredListings]);

  const isAllPendingSelected =
    pendingListingsFiltered.length > 0 &&
    pendingListingsFiltered.every((l) => selectedListingIds.includes(l.id));

  const toggleSelectAllPending = () => {
    if (isAllPendingSelected) {
      setSelectedListingIds([]);
    } else {
      setSelectedListingIds(pendingListingsFiltered.map((l) => l.id));
    }
  };

  // Actions
  const handleApprove = (listing: PendingListing) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === listing.id
          ? { ...item, status: 'approved', reviewedAt: 'Just now' }
          : item
      )
    );
    setSelectedListingIds((prev) => prev.filter((id) => id !== listing.id));
    setStats((prev) => ({ ...prev, approvedToday: prev.approvedToday + 1 }));
    toast('Listing approved and now live.', 'success');
    if (previewListing?.id === listing.id) {
      setPreviewListing(null);
    }
  };

  const handleBulkApprove = () => {
    if (selectedListingIds.length === 0) return;
    const count = selectedListingIds.length;
    setListings((prev) =>
      prev.map((item) =>
        selectedListingIds.includes(item.id)
          ? { ...item, status: 'approved', reviewedAt: 'Just now' }
          : item
      )
    );
    setSelectedListingIds([]);
    setStats((prev) => ({ ...prev, approvedToday: prev.approvedToday + count }));
    toast(`${count} ${count === 1 ? 'listing' : 'listings'} approved and now live.`, 'success');
  };

  const openRejectDialog = (listing: PendingListing) => {
    setRejectingListing(listing);
    setSelectedReasons([]);
    setRejectionNotes('');
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleConfirmReject = () => {
    if (!rejectingListing) return;
    if (selectedReasons.length === 0 && !rejectionNotes.trim()) {
      toast('Please select at least one reason or provide feedback notes.', 'error');
      return;
    }

    setListings((prev) =>
      prev.map((item) =>
        item.id === rejectingListing.id
          ? {
              ...item,
              status: 'rejected',
              rejectionReason: selectedReasons,
              rejectionNotes: rejectionNotes,
              reviewedAt: 'Just now',
            }
          : item
      )
    );
    setSelectedListingIds((prev) => prev.filter((id) => id !== rejectingListing.id));
    setStats((prev) => ({ ...prev, rejectedToday: prev.rejectedToday + 1 }));
    toast('Listing rejected and seller notified.', 'success');
    
    if (previewListing?.id === rejectingListing.id) {
      setPreviewListing(null);
    }
    setRejectingListing(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ClipboardCheck className="h-6 w-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Listing Moderation
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Review, verify, approve, or reject property listings submitted by sellers.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search listings, sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-900/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Pending Approvals
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-amber-400 mt-1">
                {tabCounts.pending}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Approved Today
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 mt-1">
                {stats.approvedToday}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Rejected Today
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-rose-400 mt-1">
                {stats.rejectedToday}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <XCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Avg Review Time
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-indigo-400 mt-1">
                {stats.avgReviewTime}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Bulk Action Header */}
      <Tabs 
        defaultValue="pending" 
        value={activeTab} 
        onValueChange={(v) => {
          setActiveTab(v as any);
          setSelectedListingIds([]);
        }}
        className="w-full space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-2 rounded-2xl border border-slate-800/60">
          <TabsList className="bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 text-xs sm:text-sm px-4 py-2 rounded-lg font-medium transition-all"
            >
              Pending
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-200 group-data-[state=active]:bg-indigo-500 group-data-[state=active]:text-white">
                {tabCounts.pending}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="approved"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 text-xs sm:text-sm px-4 py-2 rounded-lg font-medium transition-all"
            >
              Approved
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-200">
                {tabCounts.approved}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-slate-400 text-xs sm:text-sm px-4 py-2 rounded-lg font-medium transition-all"
            >
              Rejected
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-200">
                {tabCounts.rejected}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="flagged"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-slate-400 text-xs sm:text-sm px-4 py-2 rounded-lg font-medium transition-all"
            >
              Flagged AI
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {tabCounts.flagged}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Bulk Action Controls for Pending Tab */}
          {activeTab === 'pending' && pendingListingsFiltered.length > 0 && (
            <div className="flex items-center gap-3 px-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAllPending}
                className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200 text-xs"
              >
                {isAllPendingSelected ? (
                  <CheckSquare className="h-4 w-4 mr-1.5 text-indigo-400" />
                ) : (
                  <Square className="h-4 w-4 mr-1.5 text-slate-400" />
                )}
                {isAllPendingSelected ? 'Deselect All' : 'Select All Pending'}
              </Button>

              {selectedListingIds.length > 0 && (
                <Button
                  size="sm"
                  onClick={handleBulkApprove}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 animate-in fade-in duration-200"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Approve All Selected ({selectedListingIds.length})
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Listings Grid */}
        <TabsContent value={activeTab} className="m-0 focus-visible:outline-none">
          {filteredListings.length === 0 ? (
            <Card className="bg-slate-900/40 border-slate-800/80 p-12 text-center">
              <div className="max-w-xs mx-auto space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">No listings found</h3>
                <p className="text-xs text-slate-400">
                  {searchQuery
                    ? `No ${activeTab} listings match your search "${searchQuery}".`
                    : `There are currently no listings in the ${activeTab} queue.`}
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredListings.map((listing) => {
                const selected = isSelected(listing.id);
                return (
                  <Card
                    key={listing.id}
                    className={`group bg-slate-900/80 border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                      selected
                        ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-lg shadow-indigo-950/30'
                        : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
                    }`}
                  >
                    <div>
                      {/* Top Bar with Thumbnail & Basic Meta */}
                      <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                        <Image
                          src={listing.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        {/* Selection Checkbox (Pending Tab) */}
                        {activeTab === 'pending' && (
                          <button
                            type="button"
                            onClick={() => toggleSelect(listing.id)}
                            className={`absolute top-3 left-3 z-10 p-1.5 rounded-xl border backdrop-blur-md transition-all ${
                              selected
                                ? 'bg-indigo-600 border-indigo-400 text-white'
                                : 'bg-slate-950/60 border-slate-700/80 text-slate-300 hover:border-slate-400'
                            }`}
                          >
                            {selected ? (
                              <CheckSquare className="h-5 w-5" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                        )}

                        {/* Top Right Status & Property Badges */}
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <Badge className="bg-slate-900/80 text-slate-200 border-slate-700 backdrop-blur-md text-xs font-semibold">
                            {listing.bhk} BHK • {listing.type}
                          </Badge>
                          <Badge
                            className={`text-xs font-semibold capitalize backdrop-blur-md ${
                              listing.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : listing.status === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {listing.status}
                          </Badge>
                        </div>

                        {/* Price Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <div>
                            <p className="text-xl font-bold text-white drop-shadow-md">
                              {formatPrice(listing.price)}
                            </p>
                            <p className="text-xs text-slate-300 drop-shadow flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              {listing.locality}, {listing.city}
                            </p>
                          </div>
                          <span className="text-xs text-slate-300 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800">
                            {listing.area.toLocaleString('en-IN')} sq ft
                          </span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-5 space-y-4">
                        {/* Title */}
                        <h3 className="font-semibold text-base text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                          {listing.title}
                        </h3>

                        {/* Seller & Submission Info */}
                        <div className="flex items-center justify-between text-xs border-t border-b border-slate-800/80 py-3 text-slate-300">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-semibold text-xs border border-slate-700">
                              {listing.sellerName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1 font-medium text-slate-200">
                                {listing.sellerName}
                                {listing.sellerVerified && (
                                  <span title="Verified Seller">
                                    <ShieldCheck className="h-4 w-4 text-emerald-400 inline-block" />
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500">ID: {listing.sellerId}</span>
                            </div>
                          </div>

                          <div className="text-right text-slate-400">
                            <span className="block text-[10px] uppercase text-slate-500 font-medium">Submitted</span>
                            <span className="font-medium text-slate-300">{listing.submittedAt}</span>
                          </div>
                        </div>

                        {/* AI Flag Warning Banner (if flagReason present) */}
                        {listing.flagReason && (
                          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 flex items-start gap-2.5 text-xs text-amber-300">
                            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-400 block">AI Moderation Flag</span>
                              <p className="mt-0.5 leading-relaxed text-amber-200/90">{listing.flagReason}</p>
                            </div>
                          </div>
                        )}

                        {/* Rejection reason details (if rejected) */}
                        {listing.status === 'rejected' && listing.rejectionReason && (
                          <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 space-y-1">
                            <span className="font-bold text-rose-400 block">Rejection Reasons:</span>
                            <p className="text-rose-200/90 font-medium">
                              {listing.rejectionReason.join(', ')}
                            </p>
                            {listing.rejectionNotes && (
                              <p className="text-slate-400 italic text-[11px] mt-1 border-t border-rose-500/20 pt-1">
                                Note: &ldquo;{listing.rejectionNotes}&rdquo;
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-5 pt-0 grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewListing(listing);
                          setActivePreviewImageIndex(0);
                        }}
                        className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        Preview
                      </Button>

                      {listing.status !== 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(listing)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-950/40"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </Button>
                      )}

                      {listing.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectDialog(listing)}
                          className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-md shadow-rose-950/40"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Reject
                        </Button>
                      )}

                      {listing.status === 'approved' && (
                        <div className="col-span-2 text-right flex items-center justify-end text-xs text-emerald-400 font-medium pr-2">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approved & Live
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Property Preview Sheet */}
      <Sheet open={Boolean(previewListing)} onOpenChange={(open) => !open && setPreviewListing(null)}>
        <SheetContent side="right" className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-xl w-full p-0 flex flex-col justify-between overflow-hidden">
          {previewListing && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs">
                      {previewListing.id}
                    </Badge>
                    <Badge
                      className={`text-xs capitalize ${
                        previewListing.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : previewListing.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {previewListing.status}
                    </Badge>
                  </div>
                  <SheetTitle className="text-xl font-bold text-white leading-snug">
                    {previewListing.title}
                  </SheetTitle>
                  <SheetDescription className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {previewListing.locality}, {previewListing.city}
                  </SheetDescription>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Main Photo Gallery Preview */}
                <div className="space-y-2">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                    <Image
                      src={previewListing.images[activePreviewImageIndex] || previewListing.images[0]}
                      alt="Property Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/80 text-[11px] text-slate-200 border border-slate-800 backdrop-blur-md">
                      {activePreviewImageIndex + 1} / {previewListing.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  {previewListing.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {previewListing.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePreviewImageIndex(idx)}
                          className={`relative h-16 w-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                            activePreviewImageIndex === idx
                              ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                              : 'border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <Image src={img} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Key Overview Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Price</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {formatPrice(previewListing.price)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Config</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {previewListing.bhk} BHK • {previewListing.type}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Area</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {previewListing.area} sq ft
                    </span>
                  </div>
                </div>

                {/* AI Warning in Preview if flagged */}
                {previewListing.flagReason && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      AI Flagged Risk Notice
                    </div>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      {previewListing.flagReason}
                    </p>
                  </div>
                )}

                {/* Seller Info Card */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Seller Profile Details
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                        {previewListing.sellerName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-100 text-sm">
                          {previewListing.sellerName}
                          {previewListing.sellerVerified && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">
                              <ShieldCheck className="h-3 w-3 mr-0.5" /> Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">ID: {previewListing.sellerId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Property Description
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    {previewListing.description}
                  </p>
                </div>
              </div>

              {/* Sticky Bottom Actions */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center gap-3">
                {previewListing.status !== 'approved' && (
                  <Button
                    onClick={() => handleApprove(previewListing)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs py-5"
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    Approve Listing
                  </Button>
                )}

                {previewListing.status !== 'rejected' && (
                  <Button
                    variant="destructive"
                    onClick={() => openRejectDialog(previewListing)}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs py-5"
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Reject Listing
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Rejection Dialog */}
      <Dialog open={Boolean(rejectingListing)} onOpenChange={(open) => !open && setRejectingListing(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-500" />
              Reject Property Listing
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              Select reason(s) for rejecting &ldquo;{rejectingListing?.title}&rdquo;. The seller will receive feedback to make corrections.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {/* Predefined Reasons Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Rejection Reasons (Select all that apply)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PREDEFINED_REJECTION_REASONS.map((reason) => {
                  const checked = selectedReasons.includes(reason);
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => toggleReason(reason)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                        checked
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                          checked
                            ? 'bg-rose-600 border-rose-500 text-white'
                            : 'border-slate-700 bg-slate-950'
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </div>
                      {reason}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Notes Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Additional Notes for Seller
              </label>
              <textarea
                rows={3}
                placeholder="Explain what specific corrections are required..."
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setRejectingListing(null)}
              className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Reject & Notify Seller
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

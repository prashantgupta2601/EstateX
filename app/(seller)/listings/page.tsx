'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  MapPin, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  PlayCircle, 
  PauseCircle, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { mockSellerListings, SellerListing } from '@/lib/mock-data/seller-listings';
import EmptyState from '@/components/property/empty-state';

export default function SellerListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'pending' | 'rejected' | 'paused' | 'expired'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const stored = localStorage.getItem('estatex_seller_listings');
    if (stored) {
      setListings(JSON.parse(stored));
    } else {
      setListings(mockSellerListings);
      localStorage.setItem('estatex_seller_listings', JSON.stringify(mockSellerListings));
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('estatex_seller_listings', JSON.stringify(listings));
    }
  }, [listings, isMounted]);

  if (!isMounted) {
    return (
      <div className="flex flex-col gap-6 text-left py-12 items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-muted-foreground animate-pulse">Loading your listings...</span>
      </div>
    );
  }

  // Selected listings for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog State
  const [activeListing, setActiveListing] = useState<SellerListing | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'pause_activate' | 'delete' | 'boost' | 'bulk_delete' | null>(null);
  
  // Mock boost credits
  const [boostCredits, setBoostCredits] = useState(3);

  // Format Price to INR format (Lakhs/Crores)
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Consistent Status badge color system
  const getStatusBadge = (listing: SellerListing) => {
    if (listing.status === 'expired' && listing.isSold) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          {listing.type === 'rent' ? 'Rented' : 'Sold'}
        </span>
      );
    }

    switch (listing.status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20" title="Awaiting admin approval">
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            Rejected
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            Paused
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 border border-slate-500/20">
            {listing.status}
          </span>
        );
    }
  };

  // Toggle pause/active confirmation handlers
  const confirmPauseActivate = () => {
    if (!activeListing) return;
    const isCurrentlyActive = activeListing.status === 'active';
    const newStatus = isCurrentlyActive ? 'paused' : 'active';
    
    setListings(prev => 
      prev.map(l => l.id === activeListing.id ? { ...l, status: newStatus } : l)
    );

    toast(
      isCurrentlyActive ? 'Listing paused successfully!' : 'Listing activated successfully!',
      'success'
    );
    setDialogOpen(false);
  };

  // Delete listing confirmation handlers
  const confirmDelete = () => {
    if (!activeListing) return;
    setListings(prev => prev.filter(l => l.id !== activeListing.id));
    setSelectedIds(prev => prev.filter(id => id !== activeListing.id));
    toast('Listing deleted successfully!', 'success');
    setDialogOpen(false);
  };

  // Boost listing (featured) confirmation handlers
  const confirmBoost = () => {
    if (!activeListing) return;
    setListings(prev => 
      prev.map(l => l.id === activeListing.id ? { ...l, isFeatured: true } : l)
    );
    toast('Plan upgraded! Listing boosted successfully.', 'success');
    setDialogOpen(false);
  };

  // Mark listing as Sold or Rented
  const handleMarkAsSold = (id: string) => {
    setListings(prev => 
      prev.map(l => {
        if (l.id === id) {
          toast(l.type === 'rent' ? 'Listing marked as Rented!' : 'Listing marked as Sold!', 'success');
          return { ...l, status: 'expired', isSold: true };
        }
        return l;
      })
    );
  };

  // Renew listing (extends expiry by 30 days)
  const handleRenewListing = (id: string) => {
    const today = new Date();
    const newExpiry = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0];
    
    setListings(prev => 
      prev.map(l => {
        if (l.id === id) {
          return { ...l, status: 'active', expiryDate: newExpiry, isSold: false };
        }
        return l;
      })
    );
    toast('Listing renewed for 30 days.', 'success');
  };

  // Bulk action handlers
  const handleBulkPause = () => {
    const activeSelected = listings.filter(l => selectedIds.includes(l.id) && l.status === 'active');
    if (activeSelected.length === 0) {
      toast('No active listings selected to pause.', 'error');
      return;
    }
    setListings(prev => 
      prev.map(l => selectedIds.includes(l.id) && l.status === 'active' ? { ...l, status: 'paused' } : l)
    );
    toast(`Successfully paused ${activeSelected.length} listings.`, 'success');
    setSelectedIds([]);
  };

  const handleBulkRenew = () => {
    const expiredSelected = listings.filter(l => selectedIds.includes(l.id) && l.status === 'expired');
    if (expiredSelected.length === 0) {
      toast('No expired listings selected to renew.', 'error');
      return;
    }
    const today = new Date();
    const newExpiry = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0];
    
    setListings(prev => 
      prev.map(l => selectedIds.includes(l.id) && l.status === 'expired' ? { ...l, status: 'active', expiryDate: newExpiry, isSold: false } : l)
    );
    toast(`Renewed ${expiredSelected.length} listings for 30 days.`, 'success');
    setSelectedIds([]);
  };

  const confirmBulkDelete = () => {
    setListings(prev => prev.filter(l => !selectedIds.includes(l.id)));
    toast(`Successfully deleted ${selectedIds.length} listings.`, 'success');
    setSelectedIds([]);
    setDialogOpen(false);
  };

  // Checkbox row selection handlers
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Header checkbox "Select All" page handler
  const handleSelectAllPage = () => {
    const pageIds = paginatedListings.map(l => l.id);
    const isAllSelected = paginatedListings.every(l => selectedIds.includes(l.id));
    
    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  // Filter listings by search query and selected tab status
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            listing.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = selectedTab === 'all' || listing.status === selectedTab;
      return matchesSearch && matchesTab;
    });
  }, [listings, searchQuery, selectedTab]);

  // Paginated listings
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;

  const paginatedListings = useMemo(() => {
    return filteredListings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredListings, startIndex, itemsPerPage]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTab('all');
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const statuses: { value: typeof selectedTab; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'paused', label: 'Paused' },
    { value: 'expired', label: 'Expired' }
  ];

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300 relative">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Properties</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and track your listed properties</p>
        </div>
        
        <Link href="/seller/listings/new">
          <Button className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 shadow-xs hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer flex items-center gap-1.5 h-10 text-xs">
            <Plus className="h-4.5 w-4.5" />
            <span>Post New Property</span>
          </Button>
        </Link>
      </div>

      {/* Top Toolbar */}
      <div className="flex flex-col gap-4 bg-card/45 p-4.5 rounded-2xl border border-border/40 backdrop-blur-xs">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-border/40 pb-px w-full md:w-auto">
            {statuses.map((tab) => {
              const count = tab.value === 'all' 
                ? listings.length 
                : listings.filter(l => l.status === tab.value).length;
              const isActive = selectedTab === tab.value;
              
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setSelectedTab(tab.value);
                    setCurrentPage(1);
                    setSelectedIds([]);
                  }}
                  className={`px-4 py-2.5 text-xs font-bold transition-all duration-200 border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black leading-none transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/75" />
            <Input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
                setSelectedIds([]);
              }}
              className="pl-10 pr-4 h-10 rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 w-full text-xs"
            />
          </div>
        </div>

        {/* Content Area */}
        {listings.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-8 w-8 stroke-[2.5]" />}
            title="No properties listed yet"
            description="Post your first property listing to start receiving buyer leads."
            actionLabel="Post Your First Property"
            onAction={() => window.location.href = '/seller/listings/new'}
          />
        ) : filteredListings.length === 0 ? (
          <EmptyState
            title="No properties match your filter"
            description="Try adjusting your search keywords or switching status tabs."
            actionLabel="Clear Filters"
            onClearFilters={clearFilters}
          />
        ) : (
          /* Listings View */
          <div className="flex flex-col gap-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden border border-border/30 rounded-xl bg-background/25">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-[10px] font-black text-muted-foreground uppercase tracking-wider bg-muted/40 border-b border-border/30 select-none">
                  <tr>
                    {/* Checkbox Column */}
                    <th scope="col" className="px-4 py-3.5 w-12 text-center align-middle">
                      <input 
                        type="checkbox"
                        checked={paginatedListings.length > 0 && paginatedListings.every(l => selectedIds.includes(l.id))}
                        onChange={handleSelectAllPage}
                        className="h-4 w-4 rounded-sm border-border/80 text-primary focus:ring-primary/40 cursor-pointer"
                      />
                    </th>
                    <th scope="col" className="px-3 py-3.5 w-20">Thumbnail</th>
                    <th scope="col" className="px-5 py-3.5">Property Title & Location</th>
                    <th scope="col" className="px-5 py-3.5">Type & BHK</th>
                    <th scope="col" className="px-5 py-3.5">Price</th>
                    <th scope="col" className="px-5 py-3.5">Status</th>
                    <th scope="col" className="px-5 py-3.5">Views / Leads</th>
                    <th scope="col" className="px-5 py-3.5">Posted Date</th>
                    <th scope="col" className="px-5 py-3.5 text-right w-16">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25">
                  {paginatedListings.map((listing) => (
                    <tr 
                      key={listing.id} 
                      className={`hover:bg-muted/15 transition-colors duration-150 ${
                        selectedIds.includes(listing.id) ? 'bg-primary/5 hover:bg-primary/10' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5 text-center align-middle">
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(listing.id)}
                          onChange={() => handleSelectRow(listing.id)}
                          className="h-4 w-4 rounded-sm border-border/80 text-primary focus:ring-primary/40 cursor-pointer"
                        />
                      </td>
                      {/* Thumbnail */}
                      <td className="px-3 py-3.5 align-middle">
                        <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-muted border border-border/40 shadow-2xs">
                          <Image 
                            src={listing.images[0] || 'https://placehold.co/120x90?text=Property'} 
                            alt={listing.title} 
                            fill 
                            className="object-cover"
                            sizes="56px"
                          />
                          {listing.isFeatured && (
                            <div className="absolute top-0.5 left-0.5 bg-amber-500 p-0.5 rounded-sm select-none shadow-3xs" title="Featured Property">
                              <Sparkles className="h-2 w-2 text-white fill-white" />
                            </div>
                          )}
                        </div>
                      </td>
                      {/* Title + Location */}
                      <td className="px-5 py-3.5 align-middle max-w-[260px]">
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-foreground truncate" title={listing.title}>
                              {listing.title}
                            </span>
                            {listing.isFeatured && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase bg-amber-550/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0 select-none">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/80" />
                            <span className="truncate">{listing.city}</span>
                          </span>
                        </div>
                      </td>
                      {/* Type + BHK */}
                      <td className="px-5 py-3.5 align-middle">
                        <span className="text-xs font-semibold text-muted-foreground capitalize">
                          {listing.type} • {listing.bhk} BHK
                        </span>
                      </td>
                      {/* Price */}
                      <td className="px-5 py-3.5 align-middle font-black text-xs text-foreground">
                        {formatPrice(listing.price)}
                      </td>
                      {/* Status badge */}
                      <td className="px-5 py-3.5 align-middle">
                        {getStatusBadge(listing)}
                      </td>
                      {/* Stats */}
                      <td className="px-5 py-3.5 align-middle">
                        <div className="flex flex-col text-[11px] text-muted-foreground gap-0.5 font-semibold">
                          <span><strong>{listing.views}</strong> views</span>
                          <span><strong>{listing.leads}</strong> leads</span>
                        </div>
                      </td>
                      {/* Posted Date */}
                      <td className="px-5 py-3.5 align-middle text-xs font-semibold text-muted-foreground">
                        {new Date(listing.postedDate).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3.5 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          } />
                          <DropdownMenuContent align="end" className="w-44 bg-card border border-border/85 shadow-lg rounded-xl p-1 z-50">
                            <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => window.open(`/properties/${listing.id}`, '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>View Listing</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => router.push(`/seller/listings/${listing.id}/edit`)}>
                              <Edit3 className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Edit Property</span>
                            </DropdownMenuItem>
                            
                            {(listing.status === 'active' || listing.status === 'paused') && (
                              <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => {
                                setActiveListing(listing);
                                setDialogType('pause_activate');
                                setDialogOpen(true);
                              }}>
                                {listing.status === 'active' ? (
                                  <>
                                    <PauseCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Pause Listing</span>
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Activate Listing</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}

                            {(listing.status === 'active' || listing.status === 'paused') && (
                              <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleMarkAsSold(listing.id)}>
                                <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Mark as {listing.type === 'rent' ? 'Rented' : 'Sold'}</span>
                              </DropdownMenuItem>
                            )}

                            {listing.status === 'expired' && (
                              <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleRenewListing(listing.id)}>
                                <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Renew Listing</span>
                              </DropdownMenuItem>
                            )}

                            {!listing.isFeatured && (
                              <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => {
                                setActiveListing(listing);
                                setDialogType('boost');
                                setDialogOpen(true);
                              }}>
                                <Sparkles className="h-4 w-4 mr-2 text-amber-500 fill-amber-500/20" />
                                <span className="text-amber-600 dark:text-amber-400 font-bold">Boost Listing</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator className="my-1 bg-border/40" />
                            <DropdownMenuItem variant="destructive" className="cursor-pointer font-bold text-xs text-destructive focus:bg-destructive/10" onClick={() => {
                              setActiveListing(listing);
                              setDialogType('delete');
                              setDialogOpen(true);
                            }}>
                              <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                              <span>Delete Listing</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="flex flex-col gap-3.5 md:hidden">
              {paginatedListings.length > 0 && (
                <div className="flex items-center justify-between px-2 pb-2 border-b border-border/20">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="mobile-select-all"
                      checked={paginatedListings.length > 0 && paginatedListings.every(l => selectedIds.includes(l.id))}
                      onChange={handleSelectAllPage}
                      className="h-4 w-4 rounded-sm border-border/80 text-primary focus:ring-primary/40 cursor-pointer"
                    />
                    <label htmlFor="mobile-select-all" className="text-xs font-bold text-muted-foreground select-none cursor-pointer">
                      Select All ({paginatedListings.length})
                    </label>
                  </div>
                  {selectedIds.length > 0 && (
                    <button 
                      onClick={() => setSelectedIds([])}
                      className="text-xs font-bold text-destructive hover:underline"
                    >
                      Deselect All
                    </button>
                  )}
                </div>
              )}
              {paginatedListings.map((listing) => (
                <div 
                  key={listing.id} 
                  className={`p-4.5 rounded-2xl border border-border/40 bg-background/30 shadow-2xs flex flex-col gap-4 relative transition-colors ${
                    selectedIds.includes(listing.id) ? 'bg-primary/5 border-primary/25' : ''
                  }`}
                >
                  {/* Actions Dropdown on mobile card top-right */}
                  <div className="absolute top-4.5 right-4.5 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer bg-background/50">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="w-44 bg-card border border-border/85 shadow-lg rounded-xl p-1 z-50">
                        <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => window.open(`/properties/${listing.id}`, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>View Listing</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => router.push(`/seller/listings/${listing.id}/edit`)}>
                          <Edit3 className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Edit Property</span>
                        </DropdownMenuItem>
                        
                        {(listing.status === 'active' || listing.status === 'paused') && (
                          <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => {
                            setActiveListing(listing);
                            setDialogType('pause_activate');
                            setDialogOpen(true);
                          }}>
                            {listing.status === 'active' ? (
                              <>
                                <PauseCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Pause Listing</span>
                              </>
                            ) : (
                              <>
                                <PlayCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Activate Listing</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        )}

                        {(listing.status === 'active' || listing.status === 'paused') && (
                          <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleMarkAsSold(listing.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Mark as {listing.type === 'rent' ? 'Rented' : 'Sold'}</span>
                          </DropdownMenuItem>
                        )}

                        {listing.status === 'expired' && (
                          <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleRenewListing(listing.id)}>
                            <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Renew Listing</span>
                          </DropdownMenuItem>
                        )}

                        {!listing.isFeatured && (
                          <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => {
                            setActiveListing(listing);
                            setDialogType('boost');
                            setDialogOpen(true);
                          }}>
                            <Sparkles className="h-4 w-4 mr-2 text-amber-500 fill-amber-500/20" />
                            <span className="text-amber-600 dark:text-amber-400 font-bold">Boost Listing</span>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator className="my-1 bg-border/40" />
                        <DropdownMenuItem variant="destructive" className="cursor-pointer font-bold text-xs text-destructive focus:bg-destructive/10" onClick={() => {
                          setActiveListing(listing);
                          setDialogType('delete');
                          setDialogOpen(true);
                        }}>
                          <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                          <span>Delete Listing</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex gap-3 items-start">
                    {/* Checkbox */}
                    <div className="flex items-center h-16 align-middle shrink-0">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(listing.id)}
                        onChange={() => handleSelectRow(listing.id)}
                        className="h-4 w-4 rounded-sm border-border/80 text-primary focus:ring-primary/40 cursor-pointer"
                      />
                    </div>
                    
                    {/* Image */}
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-muted border border-border/40 shrink-0 shadow-3xs">
                      <Image 
                        src={listing.images[0] || 'https://placehold.co/120x90?text=Property'} 
                        alt={listing.title} 
                        fill 
                        className="object-cover"
                        sizes="80px"
                      />
                      {listing.isFeatured && (
                        <div className="absolute top-1 left-1 bg-amber-500 p-0.5 rounded-sm shadow-3xs" title="Featured Property">
                          <Sparkles className="h-2 w-2 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    {/* Primary Info */}
                    <div className="flex-1 flex flex-col min-w-0 text-left justify-between min-h-16 pr-6">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-extrabold text-xs text-foreground line-clamp-1 truncate max-w-[130px]" title={listing.title}>
                          {listing.title}
                        </span>
                      </div>
                      
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/80" />
                        <span className="truncate">{listing.city}</span>
                      </span>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-muted-foreground capitalize">
                            {listing.type} • {listing.bhk} BHK
                          </span>
                          {listing.isFeatured && (
                            <span className="inline-flex items-center px-1 py-0.2 rounded-sm text-[8px] font-black uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
                              Featured
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-black text-primary">
                          {formatPrice(listing.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Views / Leads Stats Bar */}
                  <div className="flex items-center justify-between border-t border-border/30 pt-3 text-[11px] text-muted-foreground font-semibold">
                    <div className="flex gap-4">
                      <span><strong>{listing.views}</strong> views</span>
                      <span><strong>{listing.leads}</strong> leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(listing)}
                      <span>Posted: {new Date(listing.postedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 border-t border-border/30 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-8.5 text-[11px] font-bold border-border/80 cursor-pointer bg-background/40"
                      onClick={() => router.push(`/seller/listings/${listing.id}/edit`)}
                    >
                      Edit
                    </Button>
                    
                    {listing.status === 'active' || listing.status === 'paused' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-8.5 text-[11px] font-bold border-border/80 cursor-pointer bg-background/40"
                        onClick={() => {
                          setActiveListing(listing);
                          setDialogType('pause_activate');
                          setDialogOpen(true);
                        }}
                      >
                        {listing.status === 'active' ? 'Pause' : 'Activate'}
                      </Button>
                    ) : listing.status === 'expired' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-8.5 text-[11px] font-bold border-border/80 cursor-pointer bg-background/40"
                        onClick={() => handleRenewListing(listing.id)}
                      >
                        Renew
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-8.5 text-[11px] font-bold border-border/80 cursor-pointer bg-background/40 disabled:opacity-50"
                        disabled
                      >
                        Unavailable
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-8.5 text-[11px] font-bold border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer bg-background/40"
                      onClick={() => {
                        setActiveListing(listing);
                        setDialogType('delete');
                        setDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-5">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">
                  Showing <span className="text-foreground">{startIndex + 1}</span> to{' '}
                  <span className="text-foreground">{Math.min(startIndex + itemsPerPage, filteredListings.length)}</span> of{' '}
                  <span className="text-foreground">{filteredListings.length}</span> listings
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8.5 w-8.5 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={activePage === 1}
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={activePage === page ? 'default' : 'ghost'}
                      className={`h-8.5 w-8.5 rounded-xl text-xs font-black cursor-pointer ${
                        activePage === page 
                          ? 'bg-primary text-primary-foreground shadow-xs' 
                          : 'border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8.5 w-8.5 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={activePage === totalPages}
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-background/85 border border-border/80 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-4.5 animate-in slide-in-from-bottom-10 fade-in duration-300 max-w-lg w-[calc(100%-2rem)] sm:w-auto">
          <span className="text-xs font-bold text-foreground shrink-0 select-none">
            {selectedIds.length} selected
          </span>
          <div className="h-4 w-px bg-border/80 shrink-0" />
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-8.5 text-[11px] font-bold border-border/85 cursor-pointer bg-background/50 hover:bg-muted/50 shrink-0"
              onClick={handleBulkPause}
            >
              Pause All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-8.5 text-[11px] font-bold border-border/85 cursor-pointer bg-background/50 hover:bg-muted/50 shrink-0"
              onClick={handleBulkRenew}
            >
              Renew All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-8.5 text-[11px] font-bold border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer bg-background/50 shrink-0"
              onClick={() => {
                setActiveListing(null);
                setDialogType('bulk_delete');
                setDialogOpen(true);
              }}
            >
              Delete All
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation & Promos Dialog Overlay */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-card border border-border/80 p-5 gap-4">
          {dialogType === 'pause_activate' && activeListing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                  {activeListing.status === 'active' ? 'Pause Listing?' : 'Activate Listing?'}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-2 select-none leading-relaxed">
                  {activeListing.status === 'active' 
                    ? `Are you sure you want to temporarily pause "${activeListing.title}"? It will be hidden from search results and won't receive new leads.`
                    : `Are you sure you want to activate "${activeListing.title}"? It will become visible on the public portal and start receiving leads.`}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <DialogClose render={<Button variant="ghost" className="rounded-xl border border-border/80 h-9 font-bold text-xs cursor-pointer w-full sm:w-auto" />}>
                  Cancel
                </DialogClose>
                <Button 
                  className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground h-9 font-bold text-xs cursor-pointer w-full sm:w-auto"
                  onClick={confirmPauseActivate}
                >
                  {activeListing.status === 'active' ? 'Pause Listing' : 'Activate Listing'}
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogType === 'delete' && activeListing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-extrabold text-destructive flex items-center gap-2">
                  Delete Listing?
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-2 select-none leading-relaxed">
                  Are you sure you want to delete <strong className="text-foreground">"{activeListing.title}"</strong>? <span className="text-destructive font-semibold">This action cannot be undone.</span> You will permanently lose this listing and all associated lead and view metrics.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <DialogClose render={<Button variant="ghost" className="rounded-xl border border-border/80 h-9 font-bold text-xs cursor-pointer w-full sm:w-auto" />}>
                  Cancel
                </DialogClose>
                <Button 
                  className="rounded-xl bg-destructive hover:bg-destructive/95 text-destructive-foreground h-9 font-bold text-xs cursor-pointer w-full sm:w-auto"
                  onClick={confirmDelete}
                >
                  Delete Listing
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogType === 'bulk_delete' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-extrabold text-destructive flex items-center gap-2">
                  Delete {selectedIds.length} Listings?
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-2 select-none leading-relaxed">
                  Are you sure you want to permanently delete the <strong className="text-foreground">{selectedIds.length}</strong> selected listings? <span className="text-destructive font-semibold">This action cannot be undone</span> and all data for these listings will be lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <DialogClose render={<Button variant="ghost" className="rounded-xl border border-border/80 h-9 font-bold text-xs cursor-pointer w-full sm:w-auto" />}>
                  Cancel
                </DialogClose>
                <Button 
                  className="rounded-xl bg-destructive hover:bg-destructive/95 text-destructive-foreground h-9 font-bold text-xs cursor-pointer w-full sm:w-auto"
                  onClick={confirmBulkDelete}
                >
                  Delete All
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogType === 'boost' && activeListing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500/20" />
                  Upgrade to Boost Listing
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-2 select-none leading-relaxed">
                  Stand out from the crowd! Featured properties appear at the top of buyer search results, display a prominent premium badge, and receive up to <strong className="text-foreground">5x more buyer leads</strong>.
                  <br /><br />
                  This property is currently not featured. Upgrade to our <strong className="text-foreground">Pro Seller Plan</strong> to feature this listing and unlock unlimited leads.
                </DialogDescription>
              </DialogHeader>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex flex-col gap-1 text-xs select-none mt-2">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 fill-amber-500/20" />
                  Pro Plan Benefits
                </span>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  <li>Featured placement in top cities</li>
                  <li>Instant WhatsApp lead alerts</li>
                  <li>Dedicated Relationship Manager</li>
                </ul>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <DialogClose render={<Button variant="ghost" className="rounded-xl border border-border/80 h-9 font-bold text-xs cursor-pointer w-full sm:w-auto" />}>
                  Cancel
                </DialogClose>
                <Button 
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white h-9 font-bold text-xs cursor-pointer w-full sm:w-auto"
                  onClick={confirmBoost}
                >
                  Upgrade & Feature Now
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

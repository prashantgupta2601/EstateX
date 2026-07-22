'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Users, 
  Sparkles, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Calendar, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserCheck, 
  ArrowUpDown,
  MoreVertical,
  Building2,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { mockLeads, Lead, LeadSource, LeadStatus } from '@/lib/mock-data/leads';
import EmptyState from '@/components/property/empty-state';

export default function SellerLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusTab, setStatusTab] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Masked phone reveal state (Set of lead IDs)
  const [revealedPhones, setRevealedPhones] = useState<Set<string>>(new Set());

  // Dialog State for viewing lead details
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Initialize leads from localStorage or mock data
  useEffect(() => {
    const stored = localStorage.getItem('estatex_seller_leads');
    if (stored) {
      setLeads(JSON.parse(stored));
    } else {
      setLeads(mockLeads);
      localStorage.setItem('estatex_seller_leads', JSON.stringify(mockLeads));
    }
    setIsMounted(true);
  }, []);

  // Sync to localStorage whenever leads change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('estatex_seller_leads', JSON.stringify(leads));
    }
  }, [leads, isMounted]);

  // Toggle phone mask
  const togglePhoneReveal = (id: string) => {
    setRevealedPhones((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Helper to mask phone number
  const getMaskedPhone = (phone: string, id: string) => {
    if (revealedPhones.has(id)) return phone;
    // Mask middle 5 digits: +91 98112 *****
    const parts = phone.split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} *****`;
    }
    if (phone.length > 5) {
      return phone.substring(0, phone.length - 5) + '*****';
    }
    return phone;
  };

  // Update lead status handler
  const handleUpdateStatus = (id: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: newStatus, lastUpdated: new Date().toISOString() }
          : l
      )
    );

    if (activeLead && activeLead.id === id) {
      setActiveLead((prev) => prev ? { ...prev, status: newStatus } : null);
    }

    toast(`Lead status updated to ${newStatus.replace(/_/g, ' ')}.`, 'success');
  };

  // Filtered & Sorted Leads calculation
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Search filter (buyer name or phone)
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          lead.buyerName.toLowerCase().includes(query) ||
          lead.buyerPhone.toLowerCase().includes(query) ||
          lead.buyerEmail.toLowerCase().includes(query) ||
          lead.propertyTitle.toLowerCase().includes(query);

        // Status tab filter
        const matchesStatus =
          statusTab === 'all' || lead.status === statusTab;

        // Source dropdown filter
        const matchesSource =
          sourceFilter === 'all' || lead.source === sourceFilter;

        // Date range filter
        let matchesDate = true;
        if (dateRangeFilter !== 'all') {
          const leadDate = new Date(lead.createdAt);
          const now = new Date();
          if (dateRangeFilter === 'today') {
            matchesDate = leadDate.toDateString() === now.toDateString();
          } else if (dateRangeFilter === 'week') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            matchesDate = leadDate >= sevenDaysAgo;
          } else if (dateRangeFilter === 'month') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            matchesDate = leadDate >= thirtyDaysAgo;
          }
        }

        return matchesSearch && matchesStatus && matchesSource && matchesDate;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [leads, searchQuery, statusTab, sourceFilter, dateRangeFilter, sortOrder]);

  // Paginated leads
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  // Top stats counters
  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      converted: leads.filter((l) => l.status === 'converted').length,
    };
  }, [leads]);

  if (!isMounted) {
    return (
      <div className="flex flex-col gap-6 text-left py-16 items-center justify-center min-h-[400px]">
        <div className="h-9 w-9 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-muted-foreground animate-pulse">Loading buyer inquiries...</span>
      </div>
    );
  }

  // Get source badge helper
  const getSourceBadge = (source: LeadSource) => {
    switch (source) {
      case 'website':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 capitalize">
            <Globe className="h-3 w-3" />
            <span>Website</span>
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
            <MessageSquare className="h-3 w-3" />
            <span>WhatsApp</span>
          </span>
        );
      case 'call':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 capitalize">
            <Phone className="h-3 w-3" />
            <span>Direct Call</span>
          </span>
        );
      case 'email':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 capitalize">
            <Mail className="h-3 w-3" />
            <span>Email</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-muted text-muted-foreground border border-border/40 capitalize">
            {source}
          </span>
        );
    }
  };

  // Get status badge helper
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
            <Sparkles className="h-3 w-3 fill-emerald-500/20" />
            <span>New</span>
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="h-3 w-3" />
            <span>Contacted</span>
          </span>
        );
      case 'interested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <UserCheck className="h-3 w-3" />
            <span>Interested</span>
          </span>
        );
      case 'not_interested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <XCircle className="h-3 w-3" />
            <span>Not Interested</span>
          </span>
        );
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <CheckCircle2 className="h-3 w-3 text-indigo-500" />
            <span>Converted</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
            {status}
          </span>
        );
    }
  };

  const statusTabsList: { value: string; label: string }[] = [
    { value: 'all', label: 'All Inquiries' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'interested', label: 'Interested' },
    { value: 'converted', label: 'Converted' },
    { value: 'not_interested', label: 'Not Interested' }
  ];

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300 relative pb-12">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Buyer Lead Inbox</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage buyer inquiries, track deal progress, and contact potential buyers.</p>
        </div>
      </div>

      {/* Top Stats Overview (4 mini cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Leads */}
        <Card className="rounded-2xl border-border/40 bg-card/65 backdrop-blur-xs shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Total Inquiries</span>
              <span className="text-2xl font-black text-foreground mt-1">{stats.total}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: New Leads */}
        <Card className="rounded-2xl border-border/40 bg-card/65 backdrop-blur-xs shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">New (Unread)</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.new}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Contacted Leads */}
        <Card className="rounded-2xl border-border/40 bg-card/65 backdrop-blur-xs shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Contacted</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{stats.contacted}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Converted Leads */}
        <Card className="rounded-2xl border-border/40 bg-card/65 backdrop-blur-xs shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Converted</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{stats.converted}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Container Card */}
      <div className="flex flex-col gap-4 bg-card/45 p-4.5 rounded-2xl border border-border/40 backdrop-blur-xs shadow-sm">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 border-b border-border/40 pb-px overflow-x-auto no-scrollbar">
          {statusTabsList.map((tab) => {
            const count = tab.value === 'all'
              ? leads.length
              : leads.filter((l) => l.status === tab.value).length;
            const isActive = statusTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setStatusTab(tab.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2.5 text-xs font-bold transition-all duration-200 border-b-2 -mb-px flex items-center gap-2 cursor-pointer shrink-0 ${
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

        {/* Filters Toolbar Row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-1">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/75" />
            <Input
              type="text"
              placeholder="Search by buyer name, phone, or title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 h-10 rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 w-full text-xs"
            />
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Source Filter Dropdown */}
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 rounded-xl bg-background/50 border border-border/80 px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="call">Direct Call</option>
              <option value="email">Email</option>
            </select>

            {/* Date Range Picker */}
            <select
              value={dateRangeFilter}
              onChange={(e) => {
                setDateRangeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 rounded-xl bg-background/50 border border-border/80 px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="h-10 rounded-xl bg-background/50 border border-border/80 px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

          </div>
        </div>

        {/* Content Display */}
        {filteredLeads.length === 0 ? (
          <EmptyState
            icon={<Users className="h-8 w-8 stroke-[2.5]" />}
            title="No buyer leads found"
            description="Adjust your search criteria or switch status filters to view other leads."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setStatusTab('all');
              setSourceFilter('all');
              setDateRangeFilter('all');
              setCurrentPage(1);
            }}
          />
        ) : (
          <div className="flex flex-col gap-4 mt-2">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden border border-border/30 rounded-xl bg-background/25">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-[10px] font-black text-muted-foreground uppercase tracking-wider bg-muted/40 border-b border-border/30 select-none">
                  <tr>
                    <th scope="col" className="px-4 py-3.5">Buyer</th>
                    <th scope="col" className="px-4 py-3.5">Property</th>
                    <th scope="col" className="px-4 py-3.5">Phone</th>
                    <th scope="col" className="px-4 py-3.5">Source</th>
                    <th scope="col" className="px-4 py-3.5">Status</th>
                    <th scope="col" className="px-4 py-3.5">Date</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25">
                  {paginatedLeads.map((lead) => {
                    const isNew = lead.status === 'new';
                    const initials = lead.buyerName.split(' ').map(n => n[0]).join('').substring(0, 2);

                    return (
                      <tr 
                        key={lead.id}
                        className={`hover:bg-muted/15 transition-colors duration-150 relative ${
                          isNew 
                            ? 'bg-emerald-500/5 border-l-4 border-l-emerald-500 hover:bg-emerald-500/10' 
                            : ''
                        }`}
                      >
                        {/* Buyer Info */}
                        <td className="px-4 py-3.5 align-middle">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                              isNew 
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30' 
                                : 'bg-primary/10 text-primary'
                            }`}>
                              {initials}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-xs text-foreground truncate">{lead.buyerName}</span>
                              <span className="text-[11px] text-muted-foreground truncate">{lead.buyerEmail}</span>
                            </div>
                          </div>
                        </td>

                        {/* Property Info */}
                        <td className="px-4 py-3.5 align-middle max-w-[220px]">
                          <div className="flex items-center gap-2.5">
                            <div className="relative h-9 w-12 rounded-lg overflow-hidden bg-muted border border-border/40 shrink-0">
                              <Image 
                                src={lead.propertyImage} 
                                alt={lead.propertyTitle} 
                                fill 
                                sizes="48px"
                                className="object-cover" 
                              />
                            </div>
                            <span className="text-xs font-bold text-foreground truncate" title={lead.propertyTitle}>
                              {lead.propertyTitle}
                            </span>
                          </div>
                        </td>

                        {/* Masked Phone */}
                        <td className="px-4 py-3.5 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-foreground">
                              {getMaskedPhone(lead.buyerPhone, lead.id)}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePhoneReveal(lead.id)}
                              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                              title={revealedPhones.has(lead.id) ? 'Hide phone' : 'Click to reveal phone'}
                            >
                              {revealedPhones.has(lead.id) ? (
                                <EyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Source Badge */}
                        <td className="px-4 py-3.5 align-middle">
                          {getSourceBadge(lead.source)}
                        </td>

                        {/* Status Dropdown selector */}
                        <td className="px-4 py-3.5 align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={
                              <button type="button" className="cursor-pointer">
                                {getStatusBadge(lead.status)}
                              </button>
                            } />
                            <DropdownMenuContent align="start" className="w-40 bg-card border border-border/85 shadow-lg rounded-xl p-1 z-50">
                              <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleUpdateStatus(lead.id, 'new')}>
                                Mark as New
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleUpdateStatus(lead.id, 'contacted')}>
                                Mark as Contacted
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleUpdateStatus(lead.id, 'interested')}>
                                Mark as Interested
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleUpdateStatus(lead.id, 'converted')}>
                                Mark as Converted
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-bold text-xs text-destructive" onClick={() => handleUpdateStatus(lead.id, 'not_interested')}>
                                Mark Not Interested
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 align-middle text-xs font-semibold text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 align-middle text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setActiveLead(lead);
                                setIsDialogOpen(true);
                              }}
                              className="h-8 px-2.5 text-xs font-bold rounded-lg border border-border/80 hover:bg-muted text-foreground cursor-pointer"
                            >
                              <span>View</span>
                            </Button>

                            <a 
                              href={`tel:${lead.buyerPhone}`}
                              className="p-2 rounded-lg border border-border/80 bg-background hover:bg-primary/10 hover:text-primary text-muted-foreground cursor-pointer transition-colors"
                              title={`Call ${lead.buyerName}`}
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>

                            <a 
                              href={`https://wa.me/${lead.buyerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="flex flex-col gap-3.5 md:hidden">
              {paginatedLeads.map((lead) => {
                const isNew = lead.status === 'new';
                const initials = lead.buyerName.split(' ').map(n => n[0]).join('').substring(0, 2);

                return (
                  <div
                    key={lead.id}
                    className={`p-4 rounded-2xl border bg-card/70 flex flex-col gap-3 transition-all ${
                      isNew
                        ? 'border-emerald-500/40 border-l-4 border-l-emerald-500 bg-emerald-500/5'
                        : 'border-border/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          isNew 
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-extrabold text-sm text-foreground truncate">{lead.buyerName}</span>
                          <span className="text-xs text-muted-foreground truncate">{lead.buyerEmail}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {getStatusBadge(lead.status)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/20">
                      <div className="relative h-10 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image src={lead.propertyImage} alt={lead.propertyTitle} fill sizes="48px" className="object-cover" />
                      </div>
                      <span className="text-xs font-bold text-foreground truncate" title={lead.propertyTitle}>
                        {lead.propertyTitle}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-border/20 pt-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">
                          {getMaskedPhone(lead.buyerPhone, lead.id)}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePhoneReveal(lead.id)}
                          className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {revealedPhones.has(lead.id) ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>

                      <div>{getSourceBadge(lead.source)}</div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveLead(lead);
                            setIsDialogOpen(true);
                          }}
                          className="h-8 px-3 text-xs font-bold rounded-xl border border-border/80"
                        >
                          View Details
                        </Button>
                        <a 
                          href={`https://wa.me/${lead.buyerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-border/20 mt-2 select-none">
                <span className="text-xs font-bold text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activePage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="rounded-xl h-8 px-3 text-xs font-bold border-border/80 cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    <span>Previous</span>
                  </Button>

                  <span className="text-xs font-extrabold text-foreground px-2">
                    {activePage} / {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activePage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="rounded-xl h-8 px-3 text-xs font-bold border-border/80 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Lead Details Modal */}
      {activeLead && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg rounded-2xl border-border bg-card p-6 shadow-xl">
            <DialogHeader className="text-left flex flex-col gap-1">
              <div className="flex items-center justify-between">
                {getStatusBadge(activeLead.status)}
                {getSourceBadge(activeLead.source)}
              </div>
              <DialogTitle className="text-xl font-extrabold text-foreground tracking-tight mt-2">
                Inquiry from {activeLead.buyerName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Received on {new Date(activeLead.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 my-3 text-xs">
              
              {/* Buyer Contact Details */}
              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40 flex flex-col gap-2">
                <span className="font-extrabold text-foreground text-xs uppercase tracking-wider text-muted-foreground">Buyer Details</span>
                <div className="grid grid-cols-2 gap-2 text-foreground font-semibold">
                  <div>Name: <strong>{activeLead.buyerName}</strong></div>
                  <div>Phone: <strong className="font-mono">{activeLead.buyerPhone}</strong></div>
                  <div className="col-span-2">Email: <strong>{activeLead.buyerEmail}</strong></div>
                </div>
              </div>

              {/* Property Inquired */}
              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40 flex items-center gap-3">
                <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/40">
                  <Image src={activeLead.propertyImage} alt={activeLead.propertyTitle} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-primary">Inquired Property</span>
                  <span className="font-extrabold text-xs text-foreground leading-tight mt-0.5">{activeLead.propertyTitle}</span>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex flex-col gap-1.5">
                <span className="font-extrabold text-foreground">Buyer Message:</span>
                <p className="p-3.5 rounded-2xl bg-background border border-border/60 text-foreground font-medium leading-relaxed italic">
                  "{activeLead.message}"
                </p>
              </div>

              {/* Quick Status Update Selector inside Dialog */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-primary/5 border border-primary/20">
                <span className="font-bold text-foreground">Update Lead Status:</span>
                <select
                  value={activeLead.status}
                  onChange={(e) => handleUpdateStatus(activeLead.id, e.target.value as LeadStatus)}
                  className="h-8 rounded-xl bg-background border border-border/80 px-2.5 text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="interested">Interested</option>
                  <option value="converted">Converted</option>
                  <option value="not_interested">Not Interested</option>
                </select>
              </div>

            </div>

            <DialogFooter className="flex flex-row items-center justify-end gap-2.5 pt-2">
              <a
                href={`tel:${activeLead.buyerPhone}`}
                className="flex-1 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-10 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Phone className="h-4 w-4" />
                <span>Call Buyer</span>
              </a>

              <a
                href={`https://wa.me/${activeLead.buyerPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

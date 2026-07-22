'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Calendar, 
  ExternalLink, 
  Building2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserCheck, 
  Sparkles, 
  Plus, 
  FileText, 
  Eye, 
  Users, 
  IndianRupee,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/toast';
import { mockLeads, Lead, LeadSource, LeadStatus, LeadTimelineEvent } from '@/lib/mock-data/leads';
import { mockSellerListings } from '@/lib/mock-data/seller-listings';

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [lead, setLead] = useState<Lead | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');

  // Load leads list from localStorage or fallback to mockLeads
  useEffect(() => {
    const stored = localStorage.getItem('estatex_seller_leads');
    let list: Lead[] = [];
    if (stored) {
      list = JSON.parse(stored);
    } else {
      list = mockLeads;
      localStorage.setItem('estatex_seller_leads', JSON.stringify(mockLeads));
    }
    setLeads(list);

    const foundLead = list.find((l) => l.id === id);
    if (foundLead) {
      // Ensure initial timeline if not present
      if (!foundLead.timeline || foundLead.timeline.length === 0) {
        const initialTimeline: LeadTimelineEvent[] = [
          {
            id: `evt-init-${foundLead.id}`,
            type: 'system',
            title: `Lead received via ${foundLead.source.toUpperCase()}`,
            description: `Initial message: "${foundLead.message}"`,
            timestamp: foundLead.createdAt,
          },
        ];
        if (foundLead.status !== 'new') {
          initialTimeline.push({
            id: `evt-status-init-${foundLead.id}`,
            type: 'status_change',
            title: `Status updated to ${foundLead.status.replace(/_/g, ' ')}`,
            timestamp: foundLead.lastUpdated || foundLead.createdAt,
          });
        }
        foundLead.timeline = initialTimeline;
      }
      setLead(foundLead);
    }
    setIsMounted(true);
  }, [id]);

  // Sync state changes to localStorage
  const saveLeadUpdate = (updatedLead: Lead) => {
    setLead(updatedLead);
    setLeads((prev) => {
      const updatedList = prev.map((l) => (l.id === updatedLead.id ? updatedLead : l));
      localStorage.setItem('estatex_seller_leads', JSON.stringify(updatedList));
      return updatedList;
    });
  };

  // Find index & previous/next lead IDs for quick navigation
  const currentIndex = useMemo(() => leads.findIndex((l) => l.id === id), [leads, id]);
  const prevLead = currentIndex > 0 ? leads[currentIndex - 1] : null;
  const nextLead = currentIndex >= 0 && currentIndex < leads.length - 1 ? leads[currentIndex + 1] : null;

  // Property performance statistics
  const propertyStats = useMemo(() => {
    if (!lead) return { views: 1240, totalLeads: 1 };
    const matchingSellerProp = mockSellerListings.find((p) => p.id === lead.propertyId);
    const totalLeadsForProp = leads.filter((l) => l.propertyId === lead.propertyId).length;
    return {
      views: matchingSellerProp?.views || 1240,
      totalLeads: totalLeadsForProp || 1,
    };
  }, [lead, leads]);

  // Status Change Handler
  const handleStatusChange = (newStatus: LeadStatus) => {
    if (!lead) return;
    const now = new Date().toISOString();
    const newTimelineEvent: LeadTimelineEvent = {
      id: `evt-${Date.now()}`,
      type: 'status_change',
      title: `Status changed to ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
      timestamp: now,
    };

    const updatedLead: Lead = {
      ...lead,
      status: newStatus,
      lastUpdated: now,
      timeline: [newTimelineEvent, ...(lead.timeline || [])],
    };

    saveLeadUpdate(updatedLead);
    toast('Lead status updated.', 'success');
  };

  // Add Note Handler
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !lead) return;

    const now = new Date().toISOString();
    const newNoteEvent: LeadTimelineEvent = {
      id: `note-${Date.now()}`,
      type: 'note',
      title: 'Seller Note Added',
      description: noteText.trim(),
      timestamp: now,
    };

    const updatedLead: Lead = {
      ...lead,
      lastUpdated: now,
      timeline: [newNoteEvent, ...(lead.timeline || [])],
    };

    saveLeadUpdate(updatedLead);
    setNoteText('');
    toast('Note added to timeline.', 'success');
  };

  const formatPrice = (priceVal: number) => {
    if (!priceVal) return '₹0';
    if (priceVal >= 10000000) return `₹ ${(priceVal / 10000000).toFixed(2)} Cr`;
    if (priceVal >= 100000) return `₹ ${(priceVal / 100000).toFixed(2)} L`;
    return `₹ ${priceVal.toLocaleString('en-IN')}`;
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col gap-4 text-center py-20 items-center justify-center min-h-[400px]">
        <div className="h-9 w-9 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-muted-foreground animate-pulse">Loading lead details...</span>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
        <h2 className="text-2xl font-bold text-foreground">Lead Not Found</h2>
        <p className="text-sm text-muted-foreground">The inquiry you are looking for does not exist or was deleted.</p>
        <Link href="/seller/leads">
          <Button className="rounded-xl font-bold text-xs bg-primary text-primary-foreground">Back to Leads</Button>
        </Link>
      </div>
    );
  }

  const getSourceBadge = (source: LeadSource) => {
    switch (source) {
      case 'website':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 capitalize">
            <Globe className="h-3.5 w-3.5" />
            <span>Website Form</span>
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </span>
        );
      case 'call':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 capitalize">
            <Phone className="h-3.5 w-3.5" />
            <span>Direct Call</span>
          </span>
        );
      case 'email':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 capitalize">
            <Mail className="h-3.5 w-3.5" />
            <span>Email Enquiry</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 fill-emerald-500/20" />
            <span>New Inquiry</span>
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="h-3.5 w-3.5" />
            <span>Contacted</span>
          </span>
        );
      case 'interested':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Interested</span>
          </span>
        );
      case 'not_interested':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <XCircle className="h-3.5 w-3.5" />
            <span>Not Interested</span>
          </span>
        );
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Converted Deal</span>
          </span>
        );
    }
  };

  const initials = lead.buyerName.split(' ').map((n) => n[0]).join('').substring(0, 2);

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300 max-w-6xl mx-auto w-full relative pb-12">
      
      {/* Top Header Bar with Breadcrumb and Prev/Next Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/25 pb-4 select-none">
        
        {/* Back to Leads Breadcrumb */}
        <Link 
          href="/seller/leads"
          className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 mr-1 text-primary" />
          <span>Back to Buyer Leads</span>
        </Link>

        {/* Sequential Lead Navigation Arrows */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {currentIndex >= 0 && (
            <span className="text-xs font-bold text-muted-foreground">
              Lead {currentIndex + 1} of {leads.length}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={!prevLead}
              onClick={() => prevLead && router.push(`/seller/leads/${prevLead.id}`)}
              className="rounded-xl h-8 px-3 text-xs font-bold border-border/80 cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={!nextLead}
              onClick={() => nextLead && router.push(`/seller/leads/${nextLead.id}`)}
              className="rounded-xl h-8 px-3 text-xs font-bold border-border/80 cursor-pointer flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

      </div>

      {/* Top 3-Column Layout Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: Buyer Info */}
        <Card className="rounded-2xl border-border/40 bg-card/65 backdrop-blur-xs shadow-md">
          <CardContent className="p-5 flex flex-col justify-between h-full gap-5">
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Buyer Details</span>
                {getSourceBadge(lead.source)}
              </div>

              {/* Avatar + Buyer Name */}
              <div className="flex items-center gap-3 mt-1">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-base border border-primary/20 shrink-0 shadow-2xs">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-base font-extrabold text-foreground truncate">{lead.buyerName}</h3>
                  <span className="text-xs text-muted-foreground truncate">{lead.buyerEmail}</span>
                </div>
              </div>

              {/* Full Revealed Phone Number */}
              <div className="mt-2 p-3 rounded-xl bg-muted/30 border border-border/20 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground/80">Phone Number</span>
                <span className="font-mono text-sm font-black text-foreground">{lead.buyerPhone}</span>
              </div>

              {/* First Contacted Date */}
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mt-1">
                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>First contacted on {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Quick Contact Action Buttons */}
            <div className="flex items-center gap-2.5 pt-3 border-t border-border/20">
              <a
                href={`https://wa.me/${lead.buyerPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all hover:scale-[1.01]"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${lead.buyerPhone}`}
                className="flex-1 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-10 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all hover:scale-[1.01]"
              >
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </a>
            </div>

          </CardContent>
        </Card>

        {/* Center Card: Property Info & Performance Stats */}
        <Card className="rounded-2xl border-border/40 bg-card/65 backdrop-blur-xs shadow-md">
          <CardContent className="p-5 flex flex-col justify-between h-full gap-5">
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Inquired Property</span>
                <a
                  href={`/properties/${lead.propertyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Listing</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Property Image & Title */}
              <div className="flex flex-col gap-2 mt-1">
                <div className="relative h-28 w-full rounded-xl overflow-hidden bg-muted border border-border/40 shadow-2xs">
                  <Image src={lead.propertyImage} alt={lead.propertyTitle} fill sizes="300px" className="object-cover" />
                </div>
                <h4 className="font-extrabold text-sm text-foreground leading-snug truncate" title={lead.propertyTitle}>
                  {lead.propertyTitle}
                </h4>
              </div>
            </div>

            {/* Property Performance Stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/20">
              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/20 flex flex-col">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
                  <Eye className="h-3 w-3 text-primary" />
                  <span>Property Views</span>
                </div>
                <span className="text-lg font-black text-foreground mt-0.5">{propertyStats.views.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/20 flex flex-col">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
                  <Users className="h-3 w-3 text-primary" />
                  <span>Total Leads</span>
                </div>
                <span className="text-lg font-black text-foreground mt-0.5">{propertyStats.totalLeads}</span>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Right Card: Lead Status & Management */}
        <Card className="rounded-2xl border-border/40 bg-card/65 backdrop-blur-xs shadow-md">
          <CardContent className="p-5 flex flex-col justify-between h-full gap-5">
            
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status & Stage</span>
              
              {/* Current Status Badge */}
              <div className="py-2">
                {getStatusBadge(lead.status)}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Update the lead stage to track buyer engagement from initial inquiry to deal closure.
              </p>
            </div>

            {/* Status Selector Dropdown */}
            <div className="flex flex-col gap-2 pt-3 border-t border-border/20">
              <span className="text-[10px] font-bold uppercase text-muted-foreground/80">Change Status</span>
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="outline" className="w-full justify-between rounded-xl h-10 border-border/80 font-bold text-xs cursor-pointer">
                    <span className="capitalize">{lead.status.replace(/_/g, ' ')}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-56 bg-card border border-border/85 shadow-lg rounded-xl p-1 z-50">
                  <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleStatusChange('new')}>
                    Mark as New
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleStatusChange('contacted')}>
                    Mark as Contacted
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleStatusChange('interested')}>
                    Mark as Interested
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => handleStatusChange('converted')}>
                    Mark as Converted
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer font-bold text-xs text-destructive" onClick={() => handleStatusChange('not_interested')}>
                    Mark Not Interested
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Buyer Message Section */}
      <Card className="rounded-2xl border-border/40 bg-card/65 backdrop-blur-xs shadow-md">
        <CardContent className="p-5 flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Original Buyer Inquiry</span>
          <p className="text-sm font-medium text-foreground leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/20 italic">
            "{lead.message}"
          </p>
        </CardContent>
      </Card>

      {/* Activity Log & Seller Notes Timeline Section */}
      <Card className="rounded-2xl border-border/40 bg-card/65 backdrop-blur-xs shadow-md">
        <CardContent className="p-6 flex flex-col gap-6">
          
          <div className="flex items-center justify-between border-b border-border/20 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-base font-extrabold text-foreground">Lead Activity & Notes Timeline</h3>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {lead.timeline?.length || 0} events
            </span>
          </div>

          {/* Add Seller Note Input Form */}
          <form onSubmit={handleAddNote} className="flex flex-col gap-3">
            <textarea
              rows={3}
              placeholder="Write a private note about this buyer (e.g., call outcome, visit agreed date, negotiation details)..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-background/50 border border-border/80 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!noteText.trim()}
                className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-4 h-9 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>Add Note</span>
              </Button>
            </div>
          </form>

          {/* Timeline History Event List */}
          <div className="relative pl-6 flex flex-col gap-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
            {lead.timeline && lead.timeline.map((event) => (
              <div key={event.id} className="relative flex flex-col gap-1 text-xs">
                
                {/* Event Marker Circle */}
                <div className={`absolute -left-[23px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-background ${
                  event.type === 'note'
                    ? 'bg-amber-500 ring-2 ring-amber-500/20'
                    : event.type === 'status_change'
                    ? 'bg-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-emerald-500 ring-2 ring-emerald-500/20'
                }`} />

                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-foreground text-xs">{event.title}</span>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {event.description && (
                  <p className="text-muted-foreground font-medium leading-relaxed bg-muted/20 p-2.5 rounded-xl border border-border/20 mt-0.5">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>

        </CardContent>
      </Card>

    </div>
  );
}

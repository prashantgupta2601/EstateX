'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Calendar, ChevronDown, ChevronUp, User, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockEnquiries, Enquiry } from '@/lib/mock-data/enquiries';

export default function EnquiriesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'replied' | 'closed'>('all');
  const [expandedEnquiries, setExpandedEnquiries] = useState<Record<string, boolean>>({});

  const tabCounts = useMemo(() => {
    return {
      all: mockEnquiries.length,
      pending: mockEnquiries.filter((e) => e.status === 'pending').length,
      replied: mockEnquiries.filter((e) => e.status === 'replied').length,
      closed: mockEnquiries.filter((e) => e.status === 'closed').length,
    };
  }, []);

  const filteredEnquiries = useMemo(() => {
    if (activeTab === 'all') return mockEnquiries;
    return mockEnquiries.filter((e) => e.status === activeTab);
  }, [activeTab]);

  const toggleExpand = (id: string) => {
    setExpandedEnquiries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black shrink-0 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Pending
          </Badge>
        );
      case 'replied':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black shrink-0 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Replied
          </Badge>
        );
      case 'closed':
        return (
          <Badge className="bg-muted text-muted-foreground border-border/80 text-[9px] font-black shrink-0 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Closed
          </Badge>
        );
    }
  };

  const tabs: { label: string; value: typeof activeTab }[] = [
    { label: `All (${tabCounts.all})`, value: 'all' },
    { label: `Pending (${tabCounts.pending})`, value: 'pending' },
    { label: `Replied (${tabCounts.replied})`, value: 'replied' },
    { label: `Closed (${tabCounts.closed})`, value: 'closed' },
  ];

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground">My Enquiries</h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Track property enquiries and conversations with owners and agents.
        </p>
      </div>

      {/* Tabs Filter Header */}
      <div className="flex gap-1.5 border-b border-border/60 pb-px overflow-x-auto select-none no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`pb-3 text-xs font-bold transition-all relative shrink-0 px-3 cursor-pointer ${
              activeTab === tab.value
                ? 'text-primary font-black border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground font-semibold'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List Enquiries */}
      {filteredEnquiries.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredEnquiries.map((enquiry) => {
            const isExpanded = !!expandedEnquiries[enquiry.id];
            const isLongMessage = enquiry.message.length > 85;
            const displayMessage = isExpanded || !isLongMessage 
              ? enquiry.message 
              : `${enquiry.message.slice(0, 80)}...`;

            return (
              <Card 
                key={enquiry.id}
                className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl overflow-hidden shadow-xs hover:scale-[1.005] transition-all duration-300"
              >
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
                  {/* Thumbnail Image */}
                  <div className="relative w-full sm:w-28 h-20 shrink-0 bg-muted rounded-xl overflow-hidden border border-border/65">
                    <Image 
                      src={enquiry.propertyImage} 
                      alt={enquiry.propertyTitle} 
                      fill
                      className="object-cover" 
                      sizes="(max-width: 640px) 100vw, 112px"
                    />
                  </div>

                  {/* Main content body */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0 text-left">
                    <div className="flex flex-col gap-1">
                      <Link 
                        href={`/properties/${enquiry.propertyId}`}
                        className="text-xs sm:text-sm font-black text-foreground hover:text-primary transition-colors flex items-center gap-1 group leading-tight"
                      >
                        <span className="truncate">{enquiry.propertyTitle}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </Link>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                          <User className="h-3 w-3" />
                          <span>Seller: {enquiry.sellerName}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Sent: {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enquiry Message Content */}
                    <div className="p-3 bg-muted/30 dark:bg-muted/10 border border-border/40 rounded-xl mt-1 text-xs text-foreground/90 font-medium leading-relaxed">
                      <span>{displayMessage}</span>
                      {isLongMessage && (
                        <button
                          onClick={() => toggleExpand(enquiry.id)}
                          className="text-[10px] font-bold text-primary ml-1.5 hover:underline inline-flex items-center gap-0.5 cursor-pointer align-middle"
                        >
                          {isExpanded ? (
                            <>
                              <span>Show Less</span>
                              <ChevronUp className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              <span>Read More</span>
                              <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status badge wrapper (renders next to image or on right side) */}
                  <div className="sm:self-start shrink-0">
                    {getStatusBadge(enquiry.status)}
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-card/45 border border-border/80 rounded-2xl gap-4 min-h-[300px]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <p className="text-xs font-black text-foreground">No Enquiries Found</p>
            <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed">
              {activeTab === 'all'
                ? 'When you enquire about a property listing, details of your communication history will appear here.'
                : `There are no enquiries in this section matching the status "${activeTab}".`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

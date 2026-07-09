'use client';

import React, { useState } from 'react';
import { Users, Search, Phone, Mail, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const mockLeadsData = [
  {
    id: 'lead-1',
    buyerName: 'Aarav Mehta',
    email: 'aarav@example.com',
    phone: '+91 99887 76655',
    propertyTitle: 'Premium 3 BHK Apartment - Bandra',
    date: 'Today, 10:30 AM',
    message: 'Interested in scheduling a site visit this Saturday. Is the price negotiable?',
    status: 'new'
  },
  {
    id: 'lead-2',
    buyerName: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    phone: '+91 98765 43210',
    propertyTitle: 'Spacious 4 BHK Villa - HSR Layout',
    date: 'Yesterday',
    message: 'Can you please share the floor plan and registration documents?',
    status: 'contacted'
  },
  {
    id: 'lead-3',
    buyerName: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phone: '+91 88776 65544',
    propertyTitle: 'Cozy 2 BHK Flat - Powai',
    date: '3 days ago',
    message: 'Is a bank loan pre-approved for this project? Let me know.',
    status: 'qualified'
  },
  {
    id: 'lead-4',
    buyerName: 'Devendra Patil',
    email: 'dev.patil@example.com',
    phone: '+91 77665 54433',
    propertyTitle: 'Office Space in Signature Towers - Gurgaon',
    date: '5 days ago',
    message: 'Looking for leasing terms and details about annual maintenance fees.',
    status: 'new'
  },
  {
    id: 'lead-5',
    buyerName: 'Kunal Sen',
    email: 'kunal.sen@example.com',
    phone: '+91 91234 56789',
    propertyTitle: 'Premium 3 BHK Apartment - Bandra',
    date: '1 week ago',
    message: 'Would love to know if the property is Vaastu compliant.',
    status: 'contacted'
  }
];

export default function SellerLeadsPage() {
  const [leads, setLeads] = useState(mockLeadsData);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'qualified'>('all');
  const [search, setSearch] = useState('');

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'all' || lead.status === filter;
    const matchesSearch = lead.buyerName.toLowerCase().includes(search.toLowerCase()) || 
                          lead.propertyTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <Clock className="h-3 w-3" /> New
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <AlertCircle className="h-3 w-3" /> Contacted
          </span>
        );
      case 'qualified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success-foreground border border-success/20">
            <CheckCircle2 className="h-3 w-3" /> Qualified
          </span>
        );
      default:
        return null;
    }
  };

  const handleUpdateStatus = (id: string, newStatus: 'new' | 'contacted' | 'qualified') => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Buyer Enquiries</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage incoming leads and connect with buyers</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Input 
            placeholder="Search by buyer or property..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl h-10 pl-9 border-border/80" 
          />
          <span className="absolute left-3.5 top-3 text-muted-foreground"><Search className="h-4 w-4" /></span>
        </div>

        {/* Tab filters */}
        <div className="flex p-1 bg-muted rounded-xl w-full sm:w-auto">
          {(['all', 'new', 'contacted', 'qualified'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === t 
                  ? 'bg-background text-foreground shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      <Card className="rounded-2xl border-border/40 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {filteredLeads.length > 0 ? (
            <div className="divide-y divide-border/40">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <Avatar size="default" className="h-10 w-10 border border-border/60">
                      <AvatarFallback className="bg-indigo-500/10 text-indigo-500 font-black text-xs">
                        {lead.buyerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 text-left">
                      <div className="flex items-center flex-wrap gap-2.5">
                        <span className="text-sm font-bold text-foreground truncate">{lead.buyerName}</span>
                        {getStatusBadge(lead.status)}
                        <span className="text-[10px] text-muted-foreground font-semibold">{lead.date}</span>
                      </div>
                      <span className="text-[11px] text-primary font-black mt-1 truncate">
                        Listing: {lead.propertyTitle}
                      </span>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed italic">
                        &ldquo;{lead.message}&rdquo;
                      </p>

                      {/* Status Management */}
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Change Status:</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(lead.id, 'contacted')}
                          className="h-6 rounded-md text-[10px] font-bold px-2 py-0 cursor-pointer border hover:bg-amber-500/10 hover:text-amber-600"
                        >
                          Mark Contacted
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(lead.id, 'qualified')}
                          className="h-6 rounded-md text-[10px] font-bold px-2 py-0 cursor-pointer border hover:bg-success/15 hover:text-success-foreground"
                        >
                          Mark Qualified
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <a href={`tel:${lead.phone}`}>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer" title="Call Buyer">
                        <Phone className="h-4.5 w-4.5" />
                      </Button>
                    </a>
                    <a href={`mailto:${lead.email}`}>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer" title="Email Buyer">
                        <Mail className="h-4.5 w-4.5" />
                      </Button>
                    </a>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteLead(lead.id)}
                      className="h-9 w-9 rounded-xl border border-border/80 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-muted-foreground/60 mb-2" />
              <h3 className="text-lg font-bold text-foreground">No leads found</h3>
              <p className="text-xs text-muted-foreground mt-1">Try broadening your search or filter options.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

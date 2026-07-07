'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function EnquiriesPage() {
  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div>
        <h1 className="text-2xl font-black text-foreground">My Enquiries</h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Track property enquiries and conversations with owners and agents.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center text-center p-8 bg-card/45 border border-border/80 rounded-2xl gap-4 min-h-[300px]">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <p className="text-xs font-black text-foreground">No Enquiries Sent Yet</p>
          <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed">
            Inquire about properties you are interested in, and your communication history will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

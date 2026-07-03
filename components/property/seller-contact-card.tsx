'use client';

import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import EnquiryForm from '@/components/property/enquiry-form';
import { Phone, Send, Calendar, Star, Mail, ShieldCheck } from 'lucide-react';

interface SellerContactCardProps {
  property: Property;
}

export default function SellerContactCard({ property }: SellerContactCardProps) {
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const handleContactClick = () => {
    if (!isPhoneRevealed) {
      setIsPhoneRevealed(true);
      toast("Seller's phone number has been revealed!");
    }
  };

  const handleScheduleClick = () => {
    toast("Visit request submitted! The seller will contact you to coordinate a date.");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-md flex flex-col gap-6 text-left">
      
      {/* Seller Header Info */}
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 border border-border">
          {property.agent.image ? (
            <AvatarImage src={property.agent.image} alt={property.agent.name} className="object-cover animate-fade-in" />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
            {getInitials(property.agent.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-bold text-foreground leading-snug">{property.agent.name}</h3>
          
          {property.agent.isVerified && property.agent.role && (
            <Badge className={`w-fit mt-1 border-none font-bold text-[9px] uppercase tracking-wider ${
              property.agent.role === 'owner' 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}>
              {property.agent.role === 'owner' ? 'Verified Owner' : 'Verified Broker'}
            </Badge>
          )}

          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
            <strong>{property.agent.rating || 4.8}</strong> Rating
          </span>
        </div>
      </div>

      <hr className="border-border/60" />

      {/* Seller contact details info */}
      <div className="flex flex-col gap-3 text-xs text-muted-foreground">
        {/* Phone row with blur click-to-reveal */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/5 text-primary shrink-0">
            <Phone className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span 
                onClick={handleContactClick}
                className={`text-sm font-bold text-foreground transition-all duration-300 ${
                  isPhoneRevealed ? '' : 'blur-xs select-none cursor-pointer'
                }`}
              >
                {property.agent.phone}
              </span>
              {!isPhoneRevealed && (
                <button 
                  onClick={handleContactClick}
                  className="text-[10px] text-primary font-bold hover:underline cursor-pointer select-none"
                >
                  Click to show
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Email row */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/5 text-primary shrink-0">
            <Mail className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</span>
            <span className="text-sm font-semibold text-foreground break-all mt-0.5">{property.agent.email}</span>
          </div>
        </div>
      </div>

      <hr className="border-border/60" />

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3">
        {/* Contact Seller button */}
        <Button 
          onClick={handleContactClick}
          className="w-full h-11 rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Phone className="h-4 w-4" />
          {isPhoneRevealed ? property.agent.phone : "Contact Seller"}
        </Button>

        {/* Send Enquiry button */}
        <Button 
          variant="secondary"
          onClick={() => setIsEnquiryOpen(true)}
          className="w-full h-11 rounded-2xl border border-border hover:bg-muted font-extrabold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Send className="h-4 w-4" />
          <span>Send Enquiry</span>
        </Button>

        {/* Schedule Visit button */}
        <Button 
          variant="outline"
          onClick={handleScheduleClick}
          className="w-full h-11 rounded-2xl border border-border/80 hover:bg-muted font-extrabold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Calendar className="h-4 w-4" />
          <span>Schedule Visit</span>
        </Button>
      </div>

      {/* Enquiry Form Dialog Modal */}
      <Dialog open={isEnquiryOpen} onOpenChange={setIsEnquiryOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-card border border-border/80 shadow-2xl p-6">
          <DialogHeader className="text-left mb-2">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <DialogTitle className="text-lg font-black text-foreground">Send Lead Enquiry</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Interested in <strong>{property.title}</strong>? Submit your contact info below to enquire from <strong>{property.agent.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <EnquiryForm 
            propertyTitle={property.title} 
            agentName={property.agent.name} 
            onSuccess={() => setIsEnquiryOpen(false)} 
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}

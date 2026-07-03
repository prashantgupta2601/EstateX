'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { Send, AlertCircle } from 'lucide-react';

interface EnquiryFormProps {
  propertyTitle: string;
  agentName: string;
  onSuccess?: () => void;
}

export default function EnquiryForm({ propertyTitle, agentName, onSuccess }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'I am interested in this property',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanPhone = formData.phone.replace(/\s+/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(cleanPhone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('Lead Enquiry Submitted:', {
        ...formData,
        phone: `+91 ${formData.phone}`,
        propertyTitle,
        agentName,
      });
      
      toast('Enquiry sent successfully! The seller will contact you soon.');
      
      if (onSuccess) {
        onSuccess();
      }
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name Field */}
      <div className="flex flex-col gap-1 text-left">
        <label htmlFor="enquiry-name" className="text-xs font-bold text-muted-foreground px-1">
          Full Name
        </label>
        <Input
          id="enquiry-name"
          name="name"
          type="text"
          placeholder="e.g. Rahul Sharma"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`h-10 rounded-xl bg-background/50 text-sm ${
            errors.name ? 'border-destructive focus-visible:ring-destructive' : 'border-border'
          }`}
        />
        {errors.name && (
          <span className="text-[10px] text-destructive font-semibold flex items-center gap-1 px-1 mt-0.5 animate-fade-in">
            <AlertCircle className="h-3 w-3" />
            {errors.name}
          </span>
        )}
      </div>

      {/* Phone Field */}
      <div className="flex flex-col gap-1 text-left">
        <label htmlFor="enquiry-phone" className="text-xs font-bold text-muted-foreground px-1">
          Phone Number
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3 text-sm font-bold text-muted-foreground border-r border-border pr-2 py-1 select-none">
            +91
          </div>
          <Input
            id="enquiry-phone"
            name="phone"
            type="tel"
            maxLength={10}
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`h-10 pl-14 rounded-xl bg-background/50 text-sm ${
              errors.phone ? 'border-destructive focus-visible:ring-destructive' : 'border-border'
            }`}
          />
        </div>
        {errors.phone && (
          <span className="text-[10px] text-destructive font-semibold flex items-center gap-1 px-1 mt-0.5 animate-fade-in">
            <AlertCircle className="h-3 w-3" />
            {errors.phone}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-1 text-left">
        <label htmlFor="enquiry-email" className="text-xs font-bold text-muted-foreground px-1">
          Email Address
        </label>
        <Input
          id="enquiry-email"
          name="email"
          type="email"
          placeholder="e.g. rahul@example.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`h-10 rounded-xl bg-background/50 text-sm ${
            errors.email ? 'border-destructive focus-visible:ring-destructive' : 'border-border'
          }`}
        />
        {errors.email && (
          <span className="text-[10px] text-destructive font-semibold flex items-center gap-1 px-1 mt-0.5 animate-fade-in">
            <AlertCircle className="h-3 w-3" />
            {errors.email}
          </span>
        )}
      </div>

      {/* Message Field */}
      <div className="flex flex-col gap-1 text-left">
        <label htmlFor="enquiry-message" className="text-xs font-bold text-muted-foreground px-1">
          Message
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`w-full p-3 rounded-xl border bg-background/50 text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 resize-none ${
            errors.message ? 'border-destructive focus:ring-destructive' : 'border-border'
          }`}
        />
        {errors.message && (
          <span className="text-[10px] text-destructive font-semibold flex items-center gap-1 px-1 mt-0.5 animate-fade-in">
            <AlertCircle className="h-3 w-3" />
            {errors.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 mt-2 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 border-2 border-primary-foreground/35 border-t-primary-foreground rounded-full animate-spin" />
            <span>Submitting Enquiry...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Send Enquiry</span>
          </>
        )}
      </Button>
    </form>
  );
}

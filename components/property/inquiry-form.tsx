'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface InquiryFormProps {
  propertyTitle: string;
  agentName: string;
}

export default function InquiryForm({ propertyTitle, agentName }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I am interested in "${propertyTitle}". Please contact me with more details.`,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (min 10 digits)';
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
    // Clear error on change
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
      setIsSuccess(true);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: `Hi, I am interested in "${propertyTitle}". Please contact me with more details.`,
    });
    setErrors({});
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-success/5 border border-success/20 rounded-2xl animate-fade-in py-8">
        <div className="p-3 rounded-full bg-success/10 text-success mb-4">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Inquiry Sent!</h3>
        <p className="mt-2 text-xs text-muted-foreground max-w-[240px] leading-relaxed">
          Your inquiry for <strong>{propertyTitle}</strong> has been forwarded to <strong>{agentName}</strong>. They will contact you shortly.
        </p>
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="mt-6 rounded-xl border-border/80 text-xs font-semibold cursor-pointer"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name Field */}
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor="name" className="text-xs font-bold text-muted-foreground px-1">
          Full Name
        </label>
        <Input
          id="name"
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
          <span className="text-[10px] text-destructive font-semibold flex items-center gap-1 px-1 mt-0.5">
            <AlertCircle className="h-3 w-3" />
            {errors.name}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor="email" className="text-xs font-bold text-muted-foreground px-1">
          Email Address
        </label>
        <Input
          id="email"
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
          <span className="text-[10px] text-destructive font-semibold flex items-center gap-1 px-1 mt-0.5">
            <AlertCircle className="h-3 w-3" />
            {errors.email}
          </span>
        )}
      </div>

      {/* Phone Field */}
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor="phone" className="text-xs font-bold text-muted-foreground px-1">
          Phone Number
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="e.g. 9876543210"
          value={formData.phone}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`h-10 rounded-xl bg-background/50 text-sm ${
            errors.phone ? 'border-destructive focus-visible:ring-destructive' : 'border-border'
          }`}
        />
        {errors.phone && (
          <span className="text-[10px] text-destructive font-semibold flex items-center gap-1 px-1 mt-0.5">
            <AlertCircle className="h-3 w-3" />
            {errors.phone}
          </span>
        )}
      </div>

      {/* Message Field */}
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor="message" className="text-xs font-bold text-muted-foreground px-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="I am interested in..."
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`w-full p-3 rounded-xl border bg-background/50 text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 resize-none ${
            errors.message ? 'border-destructive focus:ring-destructive' : 'border-border'
          }`}
        />
        {errors.message && (
          <span className="text-[10px] text-destructive font-semibold flex items-center gap-1 px-1 mt-0.5">
            <AlertCircle className="h-3 w-3" />
            {errors.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 mt-2 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 border-2 border-primary-foreground/35 border-t-primary-foreground rounded-full animate-spin" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Send Inquiry</span>
          </>
        )}
      </Button>
    </form>
  );
}

'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, Headphones, HelpCircle, Lock, CheckCircle2, PhoneCall } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const faqItems = [
  {
    id: 'faq-1',
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your plan remains active until the end of the billing period.',
  },
  {
    id: 'faq-2',
    question: 'What happens when my plan expires?',
    answer: 'Your listings remain visible but you lose access to premium features until you renew.',
  },
  {
    id: 'faq-3',
    question: 'Can I upgrade mid-cycle?',
    answer: "Yes, you'll be charged the prorated difference.",
  },
  {
    id: 'faq-4',
    question: 'Is my payment information secure?',
    answer: 'Payments are processed by Razorpay, a PCI-DSS compliant payment gateway.',
  },
  {
    id: 'faq-5',
    question: 'Do you offer refunds?',
    answer: 'We offer a 7-day refund policy for first-time subscribers.',
  },
  {
    id: 'faq-6',
    question: 'Can I switch between plans?',
    answer: 'Yes, upgrades are instant, downgrades take effect at the next billing cycle.',
  },
];

export function SubscriptionFaq() {
  return (
    <div className="w-full flex flex-col gap-8 mt-12">
      
      {/* 3. Money Back Guarantee / Trust Badge Row (Above FAQ) */}
      <div className="w-full rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/[0.06] via-card to-amber-500/[0.06] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Badge Item 1 */}
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Lock className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-sm sm:text-base text-foreground">
                <span>🔒</span>
                <span>Secure Payment</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                256-bit SSL & Razorpay PCI-DSS compliant
              </p>
            </div>
          </div>

          <div className="hidden md:block h-10 w-px bg-border/60" />

          {/* Badge Item 2 */}
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-sm sm:text-base text-foreground">
                <span>✅</span>
                <span>7-Day Refund Policy</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                100% money-back guarantee for first-time users
              </p>
            </div>
          </div>

          <div className="hidden md:block h-10 w-px bg-border/60" />

          {/* Badge Item 3 */}
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <PhoneCall className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-sm sm:text-base text-foreground">
                <span>📞</span>
                <span>24/7 Support</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Instant seller assistance whenever you need it
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. FAQ Section */}
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        {/* FAQ Header */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-muted text-muted-foreground border border-border/40">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Everything you need to know about our seller subscription plans and billing.
          </p>
        </div>

        {/* Shadcn Accordion */}
        <Accordion type="single" collapsible defaultValue="faq-1" className="w-full space-y-3">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left font-extrabold text-foreground">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

    </div>
  );
}

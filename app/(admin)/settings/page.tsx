'use client';

import React, { useState } from 'react';
import { mockCities } from '@/lib/mock-data/cities';
import {
  Settings,
  Sliders,
  Globe,
  Mail,
  Save,
  AlertTriangle,
  Sparkles,
  Bot,
  ShieldCheck,
  Smartphone,
  Languages,
  Wrench,
  Search,
  Code,
  FileCode,
  Edit2,
  CheckCircle2,
  HelpCircle,
  Copy,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

type SettingsTab = 'general' | 'flags' | 'seo' | 'emails';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  isMaintenanceMode?: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Tab 1: General Settings State
  const [platformName, setPlatformName] = useState('EstateHub');
  const [platformTagline, setPlatformTagline] = useState(
    "India's Premier Real Estate & Property Marketplace"
  );
  const [supportEmail, setSupportEmail] = useState('support@estatehub.in');
  const [supportPhone, setSupportPhone] = useState('+91 1800-123-4567');
  const [defaultCurrency, setDefaultCurrency] = useState('INR');
  const [defaultCity, setDefaultCity] = useState('Gurugram');
  const [maxImagesPerListing, setMaxImagesPerListing] = useState<number>(20);
  const [maxVideosPerListing, setMaxVideosPerListing] = useState<number>(3);
  const [listingExpiryDays, setListingExpiryDays] = useState<number>(30);

  // Tab 2: Feature Flags State
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: 'ai-recommendations',
      name: 'AI Property Recommendations',
      description: 'Deliver personalized property suggestions using AI vector search.',
      enabled: true,
    },
    {
      id: 'ai-description',
      name: 'AI Description Generator',
      description: 'Auto-generate attractive listing descriptions from property attributes.',
      enabled: true,
    },
    {
      id: 'ai-price-prediction',
      name: 'AI Price Prediction',
      description: 'Provide estimated market price ranges using historical transaction data.',
      enabled: true,
    },
    {
      id: 'ai-chat-assistant',
      name: 'AI Chat Assistant',
      description: 'Enable conversational AI concierge for buyer and seller inquiries.',
      enabled: true,
    },
    {
      id: 'property-comparison',
      name: 'Property Comparison',
      description: 'Allow buyers to compare up to 4 property listings side-by-side.',
      enabled: true,
    },
    {
      id: 'virtual-tours',
      name: 'Virtual Tours',
      description: 'Support 360-degree interactive 3D virtual walkthroughs.',
      enabled: true,
    },
    {
      id: 'broker-verification',
      name: 'Broker Verification',
      description: 'Require manual RERA registration verification for broker accounts.',
      enabled: true,
    },
    {
      id: 'otp-verification',
      name: 'OTP Verification',
      description: 'Mandate 6-digit SMS OTP verification during registration & login.',
      enabled: true,
    },
    {
      id: 'multi-lang',
      name: 'Multi-language Support',
      description: 'Enable Hindi, Marathi, Tamil, and regional UI language translation.',
      enabled: false,
    },
    {
      id: 'maintenance-mode',
      name: 'Maintenance Mode',
      description: 'Temporarily restrict user access and display a system maintenance message.',
      enabled: false,
      isMaintenanceMode: true,
    },
  ]);

  // Modal State for Maintenance Mode Warning
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [pendingMaintenanceState, setPendingMaintenanceState] = useState<boolean>(false);

  // Tab 3: SEO Settings State
  const [metaTitle, setMetaTitle] = useState(
    'EstateHub - Buy, Sell & Rent Real Estate Properties in India'
  );
  const [metaDescription, setMetaDescription] = useState(
    'Find verified residential apartments, villas, commercial plots, and luxury homes across top Indian cities on EstateHub.'
  );
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('G-8X92K0L3M4');
  const [searchConsoleCode, setSearchConsoleCode] = useState(
    'google-site-verification=a1b2c3d4e5f6g7h8i9j0'
  );
  const [autoSitemap, setAutoSitemap] = useState(true);
  const [robotsTxt, setRobotsTxt] = useState(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://estatehub.in/sitemap.xml`
  );

  // Tab 4: Email Templates State
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'tmpl-welcome',
      name: 'Welcome Email',
      description: 'Sent immediately when a new buyer or seller creates an account.',
      subject: 'Welcome to EstateHub, {{seller_name}}!',
      body: `Hi {{seller_name}},\n\nThank you for joining EstateHub, India's leading real estate platform!\n\nYou can now post property listings, manage buyer leads, and track analytics from your dashboard.\n\nBest regards,\nThe EstateHub Team\n{{support_email}}`,
    },
    {
      id: 'tmpl-lead',
      name: 'Lead Notification',
      description: 'Sent to sellers when a prospective buyer submits an enquiry on their property.',
      subject: 'New Lead for {{listing_title}}',
      body: `Hello {{seller_name}},\n\nYou have received a new buyer enquiry for your property "{{listing_title}}".\n\nBuyer Name: {{buyer_name}}\nBuyer Phone: {{buyer_phone}}\nBuyer Email: {{buyer_email}}\n\nLog in to your dashboard to respond immediately.`,
    },
    {
      id: 'tmpl-listing-approved',
      name: 'Listing Approved',
      description: 'Sent when an admin approves a newly submitted or updated listing.',
      subject: 'Your property "{{listing_title}}" is now Live!',
      body: `Dear {{seller_name}},\n\nGreat news! Your property listing "{{listing_title}}" has passed moderation and is now published live on EstateHub.\n\nView your live listing here: {{listing_url}}`,
    },
    {
      id: 'tmpl-listing-rejected',
      name: 'Listing Rejected',
      description: 'Sent when a property listing fails moderation criteria.',
      subject: 'Action Required: Listing Revision for {{listing_title}}',
      body: `Hello {{seller_name}},\n\nYour listing "{{listing_title}}" requires revision before it can be published.\n\nReason: {{rejection_reason}}\n\nPlease edit your listing and resubmit for verification.`,
    },
    {
      id: 'tmpl-kyc-approved',
      name: 'KYC Approved',
      description: 'Sent to brokers when their RERA verification documents are approved.',
      subject: 'Verified Broker Status Approved!',
      body: `Dear {{seller_name}},\n\nCongratulations! Your RERA broker verification document has been verified. Your profile now displays the Verified Broker badge.`,
    },
    {
      id: 'tmpl-kyc-rejected',
      name: 'KYC Rejected',
      description: 'Sent when broker verification documents are invalid or unreadable.',
      subject: 'Broker Verification Update Required',
      body: `Hello {{seller_name}},\n\nWe could not verify your broker documentation. Reason: {{rejection_reason}}.\n\nPlease upload a valid RERA certificate copy in your account settings.`,
    },
    {
      id: 'tmpl-payment-confirm',
      name: 'Payment Confirmation',
      description: 'Sent after a successful subscription plan purchase or renewal.',
      subject: 'Payment Receipt for {{plan_name}} - {{invoice_id}}',
      body: `Dear {{seller_name}},\n\nWe have received your payment of {{amount}} for {{plan_name}}.\n\nInvoice ID: {{invoice_id}}\nDate: {{payment_date}}\n\nThank you for choosing EstateHub!`,
    },
    {
      id: 'tmpl-plan-expiry',
      name: 'Plan Expiry Notice',
      description: 'Sent 3 days before a seller subscription plan expires.',
      subject: 'Your {{plan_name}} subscription expires in 3 days',
      body: `Hi {{seller_name}},\n\nYour {{plan_name}} plan on EstateHub will expire on {{expiry_date}}.\n\nRenew today to keep your featured property listings active without interruption!`,
    },
  ]);

  // Modal State for Editing Email Template
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');

  // Handlers for General Settings
  const handleSaveGeneralSettings = () => {
    toast('General settings saved successfully.', 'success');
  };

  // Handlers for Feature Flags
  const handleToggleFlag = (flag: FeatureFlag, newChecked: boolean) => {
    if (flag.isMaintenanceMode) {
      if (newChecked) {
        // Toggling Maintenance Mode ON -> show modal warning
        setPendingMaintenanceState(true);
        setIsMaintenanceModalOpen(true);
        return;
      }
    }

    // Direct toggle
    setFeatureFlags((prev) =>
      prev.map((f) => (f.id === flag.id ? { ...f, enabled: newChecked } : f))
    );
    toast(
      `Feature "${flag.name}" is now ${newChecked ? 'ENABLED' : 'DISABLED'}.`,
      'success'
    );
  };

  const handleConfirmMaintenanceMode = () => {
    setFeatureFlags((prev) =>
      prev.map((f) => (f.isMaintenanceMode ? { ...f, enabled: true } : f))
    );
    setIsMaintenanceModalOpen(false);
    toast('Maintenance Mode has been ACTIVATED.', 'error');
  };

  // Handlers for SEO Settings
  const handleSaveSeoSettings = () => {
    toast('SEO configurations updated.', 'success');
  };

  // Handlers for Email Templates
  const handleOpenEditEmailModal = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setTemplateSubject(template.subject);
    setTemplateBody(template.body);
    setIsEmailModalOpen(true);
  };

  const handleSaveEmailTemplate = () => {
    if (!editingTemplate) return;
    setEmailTemplates((prev) =>
      prev.map((t) =>
        t.id === editingTemplate.id
          ? { ...t, subject: templateSubject.trim(), body: templateBody }
          : t
      )
    );
    toast(`Email template "${editingTemplate.name}" updated.`, 'success');
    setIsEmailModalOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Top Page Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Settings className="h-6 w-6 stroke-[2.5]" />
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Site Settings & Feature Flags
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Control platform parameters, toggle experimental features, configure SEO tags, and manage email notification templates.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-px overflow-x-auto scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'general'
              ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Settings className="h-4 w-4" />
          General Settings
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flags')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'flags'
              ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Sliders className="h-4 w-4" />
          Feature Flags
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'seo'
              ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Globe className="h-4 w-4" />
          SEO Settings
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emails')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'emails'
              ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Mail className="h-4 w-4" />
          Email Templates
        </button>
      </div>

      {/* TAB 1: General Settings */}
      {activeTab === 'general' && (
        <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-amber-400" />
                General Platform Configurations
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                System branding, support contact details, currency, default city, and upload quotas.
              </CardDescription>
            </div>

            <Button
              onClick={handleSaveGeneralSettings}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save General Settings
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Platform Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Platform Name</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Platform Tagline */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Platform Tagline</label>
              <input
                type="text"
                value={platformTagline}
                onChange={(e) => setPlatformTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Support Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Support Phone */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Support Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Default Currency */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Default Currency</label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ US Dollar)</option>
                <option value="AED">AED (AED UAE Dirham)</option>
              </select>
            </div>

            {/* Default City */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Default City</label>
              <select
                value={defaultCity}
                onChange={(e) => setDefaultCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {mockCities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Images per Listing */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Max Images per Listing</label>
              <input
                type="number"
                value={maxImagesPerListing}
                onChange={(e) => setMaxImagesPerListing(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Max Videos per Listing */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Max Videos per Listing</label>
              <input
                type="number"
                value={maxVideosPerListing}
                onChange={(e) => setMaxVideosPerListing(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Listing Expiry Days */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Listing Expiry Days</label>
              <input
                type="number"
                value={listingExpiryDays}
                onChange={(e) => setListingExpiryDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB 2: Feature Flags */}
      {activeTab === 'flags' && (
        <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-indigo-400" />
              Platform Feature Switches & Toggles
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              Enable or disable AI features, security requirements, and system maintenance mode in real-time.
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {featureFlags.map((flag) => (
              <div
                key={flag.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  flag.isMaintenanceMode && flag.enabled
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : flag.enabled
                    ? 'bg-slate-950/70 border-slate-800'
                    : 'bg-slate-950/30 border-slate-800/40 opacity-75'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{flag.name}</span>
                    {flag.enabled ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px]">
                        ON
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[9px]">
                        OFF
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{flag.description}</p>
                </div>

                <Switch
                  checked={flag.enabled}
                  onCheckedChange={(checked) => handleToggleFlag(flag, checked)}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: SEO Settings */}
      {activeTab === 'seo' && (
        <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-400" />
                SEO, Analytics & Crawling Configurations
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Default site metadata, web tracking measurement IDs, and robots.txt crawler rules.
              </CardDescription>
            </div>

            <Button
              onClick={handleSaveSeoSettings}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save SEO Settings
            </Button>
          </div>

          <div className="space-y-5 text-xs">
            {/* Meta Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Default Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Default Meta Description</label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* GA ID & Search Console */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Google Analytics ID</label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Google Search Console Tag</label>
                <input
                  type="text"
                  placeholder="google-site-verification=..."
                  value={searchConsoleCode}
                  onChange={(e) => setSearchConsoleCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Sitemap Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-white block">Sitemap Auto-generation</span>
                <span className="text-slate-400 text-xs block">
                  Automatically update `/sitemap.xml` daily with newly published listings.
                </span>
              </div>
              <Switch checked={autoSitemap} onCheckedChange={setAutoSitemap} />
            </div>

            {/* Robots.txt Editor */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Robots.txt Content</label>
              <textarea
                rows={6}
                value={robotsTxt}
                onChange={(e) => setRobotsTxt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: Email Templates */}
      {activeTab === 'emails' && (
        <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-400" />
              Email Notification Templates
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              Customize automated transactional emails sent to buyers, sellers, and brokers.
            </CardDescription>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-3">Template Name</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Default Subject</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {emailTemplates.map((tmpl) => (
                  <tr key={tmpl.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white whitespace-nowrap">
                      {tmpl.name}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 line-clamp-1 max-w-[280px]">
                      {tmpl.description}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-amber-400 line-clamp-1 max-w-[260px]">
                      {tmpl.subject}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditEmailModal(tmpl)}
                        className="h-7 px-2.5 text-[11px] font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" />
                        Edit Template
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Maintenance Mode Confirmation Modal */}
      <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
              Enable Maintenance Mode?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              This will show a maintenance page to all public visitors. Continue?
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 space-y-2">
            <span className="font-bold block text-rose-300 text-sm">
              Public User Access Restricted
            </span>
            <p className="leading-relaxed">
              When Maintenance Mode is active, all public property searches, buyer lead submissions, and seller logins will be temporarily blocked.
            </p>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMaintenanceModalOpen(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmMaintenanceMode}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
            >
              Activate Maintenance Mode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Template Edit Dialog */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-400" />
              {editingTemplate ? `Edit Template: ${editingTemplate.name}` : 'Edit Email Template'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Customize email subject line and body text. Use dynamic variables enclosed in double curly braces.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            {/* Subject Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Email Subject Line</label>
              <input
                type="text"
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Email Body Textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Email Message Body</label>
              <textarea
                rows={9}
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
            </div>

            {/* Requirement 4: Variables Hint */}
            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs space-y-1">
              <span className="font-bold text-indigo-400 block flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                Available Template Variables
              </span>
              <p className="text-indigo-200/90 text-[11px]">
                Use <code className="bg-indigo-950 px-1 py-0.5 rounded text-indigo-300">{"{{seller_name}}"}</code>, <code className="bg-indigo-950 px-1 py-0.5 rounded text-indigo-300">{"{{listing_title}}"}</code>, <code className="bg-indigo-950 px-1 py-0.5 rounded text-indigo-300">{"{{plan_name}}"}</code>, <code className="bg-indigo-950 px-1 py-0.5 rounded text-indigo-300">{"{{amount}}"}</code>, <code className="bg-indigo-950 px-1 py-0.5 rounded text-indigo-300">{"{{invoice_id}}"}</code>, <code className="bg-indigo-950 px-1 py-0.5 rounded text-indigo-300">{"{{support_email}}"}</code>.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEmailModalOpen(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEmailTemplate}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Save Email Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

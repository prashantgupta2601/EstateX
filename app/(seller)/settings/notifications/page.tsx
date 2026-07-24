'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Sliders,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';

interface NotificationSettingRow {
  id: string;
  title: string;
  description: string;
  hasEmail: boolean;
  hasPush: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

const DEFAULT_SETTINGS: NotificationSettingRow[] = [
  {
    id: 'new_lead',
    title: 'New Lead Received',
    description: 'Get notified instantly when a prospective buyer submits an enquiry or contact request for your listing.',
    hasEmail: true,
    hasPush: true,
    emailEnabled: true,
    pushEnabled: true,
  },
  {
    id: 'lead_status',
    title: 'Lead Status Updated',
    description: 'Receive updates when a buyer lead advances to site visit scheduled, offer received, or deal closed.',
    hasEmail: true,
    hasPush: true,
    emailEnabled: true,
    pushEnabled: false,
  },
  {
    id: 'listing_status',
    title: 'Listing Approved / Rejected',
    description: 'Notifications regarding your property verification status, publication status, or documentation feedback.',
    hasEmail: true,
    hasPush: true,
    emailEnabled: true,
    pushEnabled: true,
  },
  {
    id: 'plan_expiring',
    title: 'Plan Expiring Soon',
    description: 'Alerts when your seller subscription renewal date or featured listing quota is nearing expiration.',
    hasEmail: true,
    hasPush: true,
    emailEnabled: true,
    pushEnabled: true,
  },
  {
    id: 'weekly_report',
    title: 'Weekly Performance Report',
    description: 'A comprehensive weekly email digest summarizing property views, lead engagement, and locality trends.',
    hasEmail: true,
    hasPush: false,
    emailEnabled: true,
    pushEnabled: false,
  },
];

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettingRow[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('estatex_notification_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing stored settings', e);
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleToggle = (id: string, type: 'email' | 'push', value: boolean) => {
    setSettings((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [type === 'email' ? 'emailEnabled' : 'pushEnabled']: value,
            }
          : row
      )
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccess(true);
      try {
        localStorage.setItem('estatex_notification_settings', JSON.stringify(settings));
      } catch (e) {
        console.error('Error saving settings', e);
      }
      toast('Notification preferences updated successfully!', 'success');
      setTimeout(() => setIsSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sliders className="h-6 w-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Notification Preferences
            </h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 ml-0.5">
            Customize which alerts you receive via Email and Mobile Push notifications.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-10 px-5 rounded-xl font-black text-xs bg-primary hover:bg-primary/95 text-primary-foreground shadow-xs cursor-pointer flex items-center gap-2 self-start sm:self-center shrink-0"
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
            </>
          )}
        </Button>
      </div>

      {/* Main Settings Card */}
      <Card className="rounded-2xl border-border/40 shadow-xs bg-card overflow-hidden">
        <CardHeader className="bg-muted/20 border-b border-border/40 py-4 px-6 flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-extrabold text-foreground">
              Notification Channels
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Toggle specific event alerts for Email and Browser/Push channels
            </CardDescription>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-xs font-bold text-muted-foreground uppercase tracking-wider pr-2">
            <div className="flex items-center gap-1.5 min-w-[70px] justify-center">
              <Mail className="h-4 w-4 text-primary" />
              <span>Email</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-[70px] justify-center">
              <Smartphone className="h-4 w-4 text-indigo-500" />
              <span>Push</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-border/30">
          {settings.map((row) => (
            <div
              key={row.id}
              className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
            >
              <div className="flex flex-col gap-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-foreground">{row.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {row.description}
                </p>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/20">
                {/* Email Toggle */}
                <div className="flex items-center gap-2 min-w-[70px] justify-center">
                  <span className="sm:hidden text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-primary" /> Email:
                  </span>
                  {row.hasEmail ? (
                    <Switch
                      checked={row.emailEnabled}
                      onCheckedChange={(checked) => handleToggle(row.id, 'email', checked)}
                    />
                  ) : (
                    <span className="text-[11px] text-muted-foreground/40 font-medium select-none">N/A</span>
                  )}
                </div>

                {/* Push Toggle */}
                <div className="flex items-center gap-2 min-w-[70px] justify-center">
                  <span className="sm:hidden text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Smartphone className="h-3.5 w-3.5 text-indigo-500" /> Push:
                  </span>
                  {row.hasPush ? (
                    <Switch
                      checked={row.pushEnabled}
                      onCheckedChange={(checked) => handleToggle(row.id, 'push', checked)}
                    />
                  ) : (
                    <span className="text-[11px] text-muted-foreground/40 font-medium select-none">N/A</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>

        <CardFooter className="bg-muted/20 border-t border-border/40 p-4 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>Critical transaction & security alerts are always delivered immediately.</span>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="rounded-xl font-bold text-xs bg-primary text-primary-foreground cursor-pointer"
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Bell, Sparkles, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockNotifications = [
  {
    id: 'notif-1',
    type: 'system',
    icon: ShieldCheck,
    iconColor: 'text-success-foreground bg-success/10 border-success/20',
    title: 'KYC Verification Approved',
    message: 'Congratulations! Your Aadhaar and PAN documents have been approved. The verified seller badge is now active on your profile.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    type: 'lead',
    icon: Sparkles,
    iconColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    title: 'New High Quality Lead',
    message: 'Aarav Mehta submitted a contact inquiry for your property: "Premium 3 BHK Apartment - Bandra". View it in your enquiries tab.',
    time: '4 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    type: 'billing',
    icon: AlertTriangle,
    iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    title: 'Subscription Invoice Paid',
    message: 'Your monthly Pro Plan subscription has renewed. Invoice #EX-2026-0701 has been sent to your email.',
    time: '1 week ago',
    read: true
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Stay updated on buyer leads, KYC, and listing stats</p>
        </div>

        <Button 
          variant="outline" 
          onClick={handleMarkAllRead}
          className="rounded-xl text-xs font-bold cursor-pointer h-9.5 self-start sm:self-auto"
        >
          Mark all as read
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {notifications.length > 0 ? (
          notifications.map((n) => {
            const Icon = n.icon;
            return (
              <Card 
                key={n.id} 
                className={`rounded-2xl border-border/40 overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 ${
                  n.read ? 'bg-card/45' : 'border-l-3 border-l-primary bg-primary/[0.005]'
                }`}
              >
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${n.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 flex flex-col gap-1 text-left min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-bold text-foreground">{n.title}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(n.id)}
                    className="h-8.5 w-8.5 rounded-xl border border-border/80 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer self-center"
                    title="Delete Notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="py-20 text-center border border-dashed border-border/80 rounded-3xl bg-card/20 flex flex-col items-center justify-center">
            <Bell className="h-10 w-10 text-muted-foreground/60 mb-2" />
            <h3 className="text-lg font-bold text-foreground">All caught up!</h3>
            <p className="text-xs text-muted-foreground mt-1">No new alerts or system updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}

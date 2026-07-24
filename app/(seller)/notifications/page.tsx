'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Users, 
  Building2, 
  CreditCard, 
  CheckCheck, 
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  mockNotifications, 
  NotificationItem, 
  NotificationType 
} from '@/lib/mock-data/notifications';

type FilterTab = 'all' | 'unread' | 'leads' | 'listings' | 'account';

const TAB_OPTIONS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'leads', label: 'Leads' },
  { id: 'listings', label: 'Listings' },
  { id: 'account', label: 'Account' },
];

export default function NotificationsCenterPage() {
  const router = useRouter();
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [visibleCount, setVisibleCount] = useState(10);

  // Sync state with localStorage if present
  useEffect(() => {
    const stored = localStorage.getItem('estatex_notifications_list');
    if (stored) {
      try {
        setNotificationsList(JSON.parse(stored));
      } catch (e) {
        console.error('Error reading stored notifications', e);
      }
    }
  }, []);

  const saveToStorage = (updated: NotificationItem[]) => {
    setNotificationsList(updated);
    try {
      localStorage.setItem('estatex_notifications_list', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving notifications', e);
    }
  };

  const handleMarkAllRead = () => {
    const updated = notificationsList.map(n => ({ ...n, isRead: true }));
    saveToStorage(updated);
  };

  const handleItemClick = (item: NotificationItem) => {
    // Mark as read
    const updated = notificationsList.map(n => n.id === item.id ? { ...n, isRead: true } : n);
    saveToStorage(updated);

    // Navigate to actionUrl
    if (item.actionUrl) {
      router.push(item.actionUrl);
    }
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notificationsList.filter(n => n.id !== id);
    saveToStorage(updated);
  };

  // Filtering
  const filteredNotifications = notificationsList.filter((item) => {
    if (activeTab === 'unread') return !item.isRead;
    if (activeTab === 'leads') return item.type === 'new_lead' || item.type === 'lead_update';
    if (activeTab === 'listings') return item.type === 'listing_approved' || item.type === 'listing_rejected' || item.type === 'price_alert';
    if (activeTab === 'account') return item.type === 'plan_expiring' || item.type === 'plan_expired' || item.type === 'system';
    return true;
  });

  const unreadCount = notificationsList.filter(n => !n.isRead).length;
  const displayedItems = filteredNotifications.slice(0, visibleCount);
  const hasMore = filteredNotifications.length > visibleCount;

  // Icon resolver per notification type
  const getIconConfig = (type: NotificationType) => {
    switch (type) {
      case 'new_lead':
      case 'lead_update':
        return {
          icon: Users,
          bgColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          badgeText: type === 'new_lead' ? 'New Lead' : 'Lead Update',
        };
      case 'listing_approved':
      case 'listing_rejected':
      case 'price_alert':
        return {
          icon: Building2,
          bgColor: type === 'listing_rejected' 
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' 
            : type === 'price_alert'
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          badgeText: type === 'listing_approved' ? 'Approved' : type === 'listing_rejected' ? 'Rejected' : 'Price Alert',
        };
      case 'plan_expiring':
      case 'plan_expired':
        return {
          icon: CreditCard,
          bgColor: type === 'plan_expired'
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          badgeText: type === 'plan_expiring' ? 'Subscription' : 'Plan Expired',
        };
      case 'system':
      default:
        return {
          icon: Bell,
          bgColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          badgeText: 'System Alert',
        };
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full max-w-4xl mx-auto pb-12">
      
      {/* Header & Mark All as Read Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Bell className="h-6 w-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
              <span>Notification Center</span>
              {unreadCount > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-black bg-red-500 text-white shadow-xs">
                  {unreadCount} unread
                </span>
              )}
            </h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 ml-0.5">
            Real-time updates on buyer leads, listing approvals, subscription status, and account alerts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="h-9 px-3.5 rounded-xl text-xs font-extrabold border-border/60 hover:bg-muted/50 cursor-pointer self-start sm:self-center flex items-center gap-1.5 shrink-0"
        >
          <CheckCheck className="h-4 w-4 text-primary" />
          <span>Mark All as Read</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-2xl border border-border/30 overflow-x-auto">
        {TAB_OPTIONS.map((tab) => {
          const isActive = activeTab === tab.id;
          let count = 0;
          if (tab.id === 'all') count = notificationsList.length;
          else if (tab.id === 'unread') count = unreadCount;
          else if (tab.id === 'leads') count = notificationsList.filter(n => n.type === 'new_lead' || n.type === 'lead_update').length;
          else if (tab.id === 'listings') count = notificationsList.filter(n => n.type === 'listing_approved' || n.type === 'listing_rejected' || n.type === 'price_alert').length;
          else if (tab.id === 'account') count = notificationsList.filter(n => n.type === 'plan_expiring' || n.type === 'plan_expired' || n.type === 'system').length;

          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setVisibleCount(10); }}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-background text-foreground shadow-xs border border-border/40'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-black ${
                isActive ? 'bg-primary/10 text-primary' : 'bg-muted/60 text-muted-foreground'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="flex flex-col gap-3">
        {displayedItems.length > 0 ? (
          displayedItems.map((item) => {
            const { icon: Icon, bgColor, badgeText } = getIconConfig(item.type);
            const isUnread = !item.isRead;

            return (
              <Card
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`group rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden relative ${
                  isUnread 
                    ? 'border-primary/40 bg-gradient-to-r from-primary/[0.04] via-card to-card shadow-xs hover:border-primary/60 hover:shadow-md' 
                    : 'border-border/40 bg-card hover:bg-muted/20 hover:border-border/70'
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                  {/* Type Icon */}
                  <div className={`p-3 rounded-2xl border shrink-0 ${bgColor} transition-transform group-hover:scale-105`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Unread Blue Indicator Dot */}
                        {isUnread && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 animate-pulse" title="Unread" />
                        )}
                        <h3 className={`text-sm tracking-tight truncate ${isUnread ? 'font-black text-foreground' : 'font-semibold text-foreground/90'}`}>
                          {item.title}
                        </h3>
                        <span className="hidden sm:inline-flex text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-muted text-muted-foreground border border-border/30 shrink-0">
                          {badgeText}
                        </span>
                      </div>

                      <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap shrink-0">
                        {item.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground/90 leading-relaxed line-clamp-2 mt-0.5">
                      {item.message}
                    </p>

                    {item.actionUrl && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        <span>View details</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  {/* Actions (Delete button) */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteItem(e, item.id)}
                    className="h-8 w-8 rounded-xl border border-transparent hover:border-border/60 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer self-center transition-colors"
                    title="Remove Notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="py-20 text-center border border-dashed border-border/80 rounded-3xl bg-card/30 flex flex-col items-center justify-center p-6">
            <div className="p-4 rounded-full bg-muted/40 text-muted-foreground mb-3">
              <Bell className="h-8 w-8" />
            </div>
            <h3 className="text-base font-extrabold text-foreground">No notifications found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {activeTab === 'unread' 
                ? 'You are all caught up! There are no unread notifications right now.' 
                : 'There are no notifications matching the selected filter category.'}
            </p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex items-center justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="rounded-2xl h-10 px-6 text-xs font-black border-border/60 hover:bg-muted/50 cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <span>Load More Notifications</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

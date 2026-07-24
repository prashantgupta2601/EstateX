'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Users, 
  Building2, 
  CreditCard, 
  ArrowRight, 
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  mockNotifications, 
  NotificationItem, 
  NotificationType 
} from '@/lib/mock-data/notifications';

export function NotificationBellDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state with localStorage if saved
  useEffect(() => {
    const stored = localStorage.getItem('estatex_notifications_list');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing stored notifications', e);
      }
    }
  }, [isOpen]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = items.filter(n => !n.isRead).length;
  const recentItems = items.slice(0, 5);

  const saveItems = (updated: NotificationItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem('estatex_notifications_list', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving notifications', e);
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = items.map(n => ({ ...n, isRead: true }));
    saveItems(updated);
  };

  const handleItemClick = (item: NotificationItem) => {
    const updated = items.map(n => n.id === item.id ? { ...n, isRead: true } : n);
    saveItems(updated);
    setIsOpen(false);
    if (item.actionUrl) {
      router.push(item.actionUrl);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_lead':
      case 'lead_update':
        return <Users className="h-4 w-4 text-indigo-500" />;
      case 'listing_approved':
      case 'listing_rejected':
      case 'price_alert':
        return <Building2 className="h-4 w-4 text-emerald-500" />;
      case 'plan_expiring':
      case 'plan_expired':
        return <CreditCard className="h-4 w-4 text-amber-500" />;
      case 'system':
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer relative"
        title="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        
        {/* Unread Red Dot Badge with Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-xs animate-in zoom-in-50">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown Menu Preview */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border/60 bg-popover/98 backdrop-blur-xl text-popover-foreground shadow-2xl z-50 overflow-hidden text-left animate-in fade-in-0 slide-in-from-top-2 duration-200">
          
          {/* Dropdown Header */}
          <div className="p-3.5 px-4 flex items-center justify-between border-b border-border/40 bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="h-3 w-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Recent 5 Notifications List */}
          <div className="divide-y divide-border/30 max-h-[360px] overflow-y-auto">
            {recentItems.length > 0 ? (
              recentItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-muted/40 transition-colors cursor-pointer ${
                    !item.isRead ? 'bg-primary/[0.03]' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-muted/60 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs truncate ${!item.isRead ? 'font-black text-foreground' : 'font-semibold text-foreground/80'}`}>
                        {item.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {item.createdAt}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {!item.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 self-center" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No notifications right now.
              </div>
            )}
          </div>

          {/* Footer View All Link */}
          <div className="p-2.5 bg-muted/30 border-t border-border/40 text-center">
            <Link
              href="/seller/notifications"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-black text-primary hover:underline cursor-pointer"
            >
              <span>View All Notifications</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}

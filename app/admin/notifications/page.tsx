'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  mockAdminNotifications,
  AdminNotificationItem,
  AdminNotificationType,
} from '@/lib/mock-data/admin-notifications';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldCheck,
  Building2,
  Flag,
  CreditCard,
  Activity,
  UserCheck,
  Search,
  CheckCheck,
  Trash2,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';

type NotificationCategory = 'all' | 'unread' | 'moderation' | 'payments' | 'system';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] =
    useState<AdminNotificationItem[]>(mockAdminNotifications);
  const [activeTab, setActiveTab] = useState<NotificationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Category Tab Filter
      if (activeTab === 'unread' && n.isRead) return false;
      if (
        activeTab === 'moderation' &&
        !['broker_kyc', 'listing_pending', 'user_report'].includes(n.type)
      ) {
        return false;
      }
      if (activeTab === 'payments' && n.type !== 'payment_failed') return false;
      if (
        activeTab === 'system' &&
        !['traffic_alert', 'admin_registered'].includes(n.type)
      ) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesMessage = n.message.toLowerCase().includes(q);
        return matchesTitle || matchesMessage;
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  // Mark single as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast('Notification marked as read.', 'success');
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast('All admin notifications marked as read.', 'success');
  };

  // Delete single notification
  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast('Notification dismissed.', 'success');
  };

  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
    toast('All notifications cleared.', 'success');
  };

  // Get Icon based on type
  const getNotificationIcon = (type: AdminNotificationType) => {
    switch (type) {
      case 'listing_pending':
        return <Building2 className="h-5 w-5 text-amber-400" />;
      case 'broker_kyc':
        return <UserCheck className="h-5 w-5 text-indigo-400" />;
      case 'user_report':
        return <Flag className="h-5 w-5 text-rose-400" />;
      case 'payment_failed':
        return <CreditCard className="h-5 w-5 text-rose-400" />;
      case 'traffic_alert':
        return <Activity className="h-5 w-5 text-sky-400" />;
      case 'admin_registered':
        return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
      default:
        return <Bell className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 relative">
              <Bell className="h-6 w-6 stroke-[2.5]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </span>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Admin Notifications
              </h1>
              {unreadCount > 0 && (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs font-bold">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time alerts for pending listings, broker verifications, flagged content reports, and revenue events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer"
            >
              <CheckCheck className="h-4 w-4 mr-1.5 text-emerald-400" />
              Mark All as Read
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 px-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            {(
              [
                { key: 'all', label: 'All Alerts' },
                { key: 'unread', label: `Unread (${unreadCount})` },
                { key: 'moderation', label: 'Moderation' },
                { key: 'payments', label: 'Payments' },
                { key: 'system', label: 'System' },
              ] as Array<{ key: NotificationCategory; label: string }>
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[220px] pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
              <Bell className="h-8 w-8 stroke-[1.5] text-slate-600 mb-1" />
              <p className="font-semibold text-slate-300">No notifications found</p>
              <p className="text-slate-500 max-w-xs">
                You have cleared all alerts or no notifications match your filter criteria.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.isRead
                    ? 'bg-slate-900 border-amber-500/30 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Category Icon */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5 sm:mt-0">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          !notif.isRead ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {notif.title}
                      </span>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        {notif.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80 w-full sm:w-auto justify-between sm:justify-end">
                  <Link
                    href={notif.actionUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all border border-slate-700/60 cursor-pointer"
                  >
                    <span>View Action</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </Link>

                  <div className="flex items-center gap-1">
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Dismiss notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

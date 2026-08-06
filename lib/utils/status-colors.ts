/**
 * Central status color tokens and utilities for EstateX Admin Panel.
 * Ensures consistent badge colors across listings, users, revenue, reports, and logs.
 */

export interface StatusStyle {
  label: string;
  bg: string;
  text: string;
  border: string;
  badgeClass: string;
}

export function getStatusBadgeStyle(status: string): StatusStyle {
  const normalized = status.toLowerCase().trim();

  switch (normalized) {
    // Success / Green Statuses
    case 'approved':
    case 'active':
    case 'success':
    case 'verified':
    case 'resolved':
    case 'published':
      return {
        label: capitalize(normalized),
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold',
      };

    // Warning / Amber Statuses
    case 'pending':
    case 'under_review':
    case 'review':
    case 'refunded':
    case 'warning':
    case 'medium':
      return {
        label: capitalize(normalized.replace('_', ' ')),
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/20',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold',
      };

    // Error / Critical / Red Statuses
    case 'rejected':
    case 'failed':
    case 'banned':
    case 'critical':
    case 'high':
    case 'expired':
      return {
        label: capitalize(normalized),
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/20',
        badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold',
      };

    // Info / Blue Statuses
    case 'inactive':
    case 'draft':
    case 'info':
    case 'low':
    default:
      return {
        label: capitalize(normalized),
        bg: 'bg-slate-800',
        text: 'text-slate-300',
        border: 'border-slate-700',
        badgeClass: 'bg-slate-800 text-slate-300 border-slate-700 font-medium',
      };
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
